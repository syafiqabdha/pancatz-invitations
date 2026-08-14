import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Validate required fields
    const required = ['couple_name_1', 'couple_name_2', 'email', 'phone', 'event_date'];
    for (const field of required) {
      if (!data[field]) {
        return new Response(JSON.stringify({ error: `${field} diperlukan` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const n8nWebhook = process.env.N8N_CONTACT_WEBHOOK;
    if (!n8nWebhook) {
      // Dev fallback — log to console
      console.log('[Contact Form]', data);
      return new Response(JSON.stringify({ success: true, dev: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(n8nWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`n8n returned ${res.status}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[Contact API]', err);
    return new Response(JSON.stringify({ error: 'Ralat pelayan' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
