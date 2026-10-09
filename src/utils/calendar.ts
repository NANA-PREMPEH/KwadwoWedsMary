// Utility to generate Google Calendar links and .ics file download

export function getGoogleCalendarUrl(event: {
  title: string;
  description: string;
  location: string;
  startDateIso: string; // e.g. 20260919T143000Z
  endDateIso: string;
}) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${event.startDateIso}/${event.endDateIso}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(event: {
  title: string;
  description: string;
  location: string;
  startDateIso: string;
  endDateIso: string;
}) {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aeterna Wedding Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    `DTSTART:${event.startDateIso}`,
    `DTEND:${event.endDateIso}`,
    `STATUS:CONFIRMED`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'Julian-and-Eleanor-Wedding.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
