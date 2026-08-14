import type { APIRoute } from 'astro';

// In-memory store for dev (replace with Directus in production)
const devRsvps: { invitation: string; guest_name: string; telephone: string; wish: string; attendance_status: string }[] = [];

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)\.]/g, '').replace(/^\+?60/, '0');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { invitation, guest_name, telephone, wish, attendance_status } = body;

    // Validate
    const errors: string[] = [];
    if (!guest_name || guest_name.trim().length < 2) errors.push('Nama diperlukan (minimum 2 aksara).');
    if (!telephone || telephone.trim().length < 7) errors.push('Nombor telefon tidak sah.');
    if (!wish || wish.trim().length < 3) errors.push('Ucapan diperlukan (minimum 3 aksara).');

    if (errors.length > 0) {
      return new Response(JSON.stringify({ error: errors[0] }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const normalizedPhone = normalizePhone(telephone);

    // Check duplicate (dev: in-memory; prod: Directus)
    const duplicate = devRsvps.find(
      r => r.invitation === invitation && normalizePhone(r.telephone) === normalizedPhone
    );

    if (duplicate) {
      return new Response(JSON.stringify({ error: 'Anda telah menghantar RSVP sebelum ini.' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Rate limit check (simple: 3 per IP per minute — dev only)
    // Production: use a proper rate limiter

    // Store (dev: in-memory; prod: Directus)
    const rsvp = {
      invitation: invitation || 'mock-001',
      guest_name: guest_name.trim(),
      telephone: normalizedPhone,
      wish: wish.trim(),
      attendance_status: attendance_status || 'attending',
    };

    devRsvps.push(rsvp);

    // Production path:
    // const isDup = await checkDuplicateRsvp(invitation, normalizedPhone);
    // if (isDup) return 409;
    // await submitRsvp({ invitation, guest_name, telephone: normalizedPhone, wish, attendance_status });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[RSVP API]', err);
    return new Response(JSON.stringify({ error: 'Ralat pelayan. Sila cuba lagi.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
