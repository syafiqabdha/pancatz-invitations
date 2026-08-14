const DIRECTUS_URL = process.env.DIRECTUS_URL || '';
const DIRECTUS_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN || '';

async function directusFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${DIRECTUS_URL}/items/${path}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Directus ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  return json.data as T;
}

function queryString(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      search.set(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

// --- Types ---

export interface Invitation {
  id: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  template: string;
  couple_name_1: string;
  couple_name_2: string;
  event_date_time: string;
  timezone: string;
  venue_name?: string;
  venue_address?: string;
  google_maps_url?: string;
  waze_url?: string;
  islamic_opening?: string;
  verse_or_message?: string;
  story?: string;
  schedule?: { time: string; description: string }[];
  dress_code?: string;
  dress_code_palette?: { name: string; hex: string }[];
  gift_enabled: boolean;
  gift_details?: string;
  music_enabled: boolean;
  music_file?: string;
  contact_name?: string;
  contact_phone?: string;
  theme_config?: Record<string, unknown>;
  feature_flags?: Record<string, boolean>;
  qr_code?: string;
  public_url?: string;
  order_id: string;
  calendar_details?: string;
  client_user?: string;
  gallery?: Media[];
}

export interface Rsvp {
  id: string;
  invitation: string;
  guest_name: string;
  telephone: string;
  wish: string;
  attendance_status: 'attending' | 'not_attending';
  wish_public: boolean;
  moderation_status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  source: string;
}

export interface Media {
  id: string;
  invitation: string;
  type: 'photo' | 'music';
  file: { id: string; filename_download: string };
  alt_text?: string;
  sort_order: number;
}

// --- Invitations ---

export async function getInvitationBySlug(slug: string): Promise<Invitation | null> {
  const qs = queryString({
    filter: JSON.stringify({ slug: { _eq: slug }, status: { _eq: 'published' } }),
    fields: '*',
    limit: 1,
  });
  const items = await directusFetch<Invitation[]>(`invitations${qs}`);
  return items[0] ?? null;
}

export async function getInvitationById(id: string): Promise<Invitation | null> {
  return directusFetch<Invitation>(`invitations/${id}?fields=*`);
}

export async function createInvitation(data: Partial<Invitation>): Promise<Invitation> {
  return directusFetch<Invitation>('invitations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// --- RSVPs ---

export async function submitRsvp(data: {
  invitation: string;
  guest_name: string;
  telephone: string;
  wish: string;
  attendance_status?: string;
}): Promise<Rsvp> {
  return directusFetch<Rsvp>('rsvps', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      source: 'web',
      moderation_status: 'pending',
      wish_public: false,
    }),
  });
}

export async function getRsvpsByInvitation(invitationId: string): Promise<Rsvp[]> {
  const qs = queryString({
    filter: JSON.stringify({ invitation: { _eq: invitationId } }),
    sort: '-date_created',
  });
  return directusFetch<Rsvp[]>(`rsvps${qs}`);
}

export async function getPublicWishes(invitationId: string): Promise<Rsvp[]> {
  const qs = queryString({
    filter: JSON.stringify({ invitation: { _eq: invitationId }, wish_public: { _eq: true } }),
    fields: 'id,guest_name,wish,submitted_at',
    sort: '-date_created',
  });
  return directusFetch<Rsvp[]>(`rsvps${qs}`);
}

export async function checkDuplicateRsvp(invitationId: string, telephone: string): Promise<boolean> {
  const qs = queryString({
    filter: JSON.stringify({ invitation: { _eq: invitationId }, telephone: { _eq: telephone } }),
    fields: 'id',
    limit: 1,
  });
  const items = await directusFetch<{ id: string }[]>(`rsvps${qs}`);
  return items.length > 0;
}

export async function updateRsvpModeration(id: string, data: {
  moderation_status: string;
  wish_public: boolean;
}): Promise<Rsvp> {
  return directusFetch<Rsvp>(`rsvps/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// --- Media ---

export async function getMediaByInvitation(invitationId: string, type?: 'photo' | 'music'): Promise<Media[]> {
  const filter: Record<string, unknown> = { invitation: { _eq: invitationId } };
  if (type) filter.type = { _eq: type };
  const qs = queryString({
    filter: JSON.stringify(filter),
    fields: '*,file.id,file.filename_download',
    sort: 'sort_order',
  });
  return directusFetch<Media[]>(`media${qs}`);
}

// --- Auth ---

export async function authenticateCouple(orderId: string, password: string) {
  // Look up invitation by order_id
  const qs = queryString({
    filter: JSON.stringify({ order_id: { _eq: orderId } }),
    fields: 'id,slug,status,client_user,order_id',
    limit: 1,
  });
  const items = await directusFetch<{ id: string; slug: string; status: string; client_user?: string; order_id: string }[]>(`invitations${qs}`);

  if (items.length === 0) return null;

  const invitation = items[0];
  if (!invitation.client_user) return null;

  // Attempt Directus login
  try {
    const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: invitation.client_user, password }),
    });

    if (!response.ok) return null;

    const auth = await response.json() as { data: { access_token: string } };
    return { ...invitation, access_token: auth.data.access_token };
  } catch {
    return null;
  }
}
