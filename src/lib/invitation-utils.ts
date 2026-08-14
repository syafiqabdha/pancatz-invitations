/**
 * invitation-utils.ts
 * Date/time formatting and calendar URL helpers for the invitation page.
 * Extracted from src/pages/[...slug].astro
 */

/**
 * Format an ISO date string for the Malaysian locale.
 */
export function formatEventDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('ms-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format an ISO date string as a short time string (HH:MM).
 */
export function formatEventTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('ms-MY', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Build a Google Calendar "Add to Calendar" URL for the invitation.
 */
export function buildCalendarUrl(params: {
  eventDateTime: string;
  calendarDetails?: string;
  venueAddress?: string;
}): string {
  const start = new Date(params.eventDateTime);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);

  const fmt = (d: Date): string =>
    d.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';

  const text = encodeURIComponent(params.calendarDetails ?? '');
  const loc = encodeURIComponent(params.venueAddress ?? '');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${fmt(start)}/${fmt(end)}&location=${loc}`;
}
