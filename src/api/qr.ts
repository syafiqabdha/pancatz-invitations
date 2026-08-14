import type { APIRoute } from 'astro';
import QRCode from 'qrcode';

export const GET: APIRoute = async ({ url }) => {
  const slug = url.searchParams.get('slug') || 'nurul-dan-afiq';
  const base = process.env.SITE_URL || 'https://inv.pancatz.com';

  try {
    const qrSvg = await QRCode.toString(`${base}/${slug}`, {
      type: 'svg',
      width: 256,
      margin: 2,
      color: { dark: '#D9B867', light: '#071D18' },
    });

    return new Response(qrSvg, {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml' },
    });
  } catch {
    return new Response('QR generation failed', { status: 500 });
  }
};
