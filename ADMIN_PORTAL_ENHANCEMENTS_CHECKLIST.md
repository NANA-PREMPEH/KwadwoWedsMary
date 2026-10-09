# Admin Portal Enhancement Checklist

Use this document to decide and track the next admin-portal improvements for Kwadwo & Mary's wedding website.

## Priority 1 — Guest and RSVP Management

- [x] Search RSVP records by guest name or email.
- [x] Edit an RSVP response after submission.
- [x] Change attendance status: accepted, declined, or pending.
- [ ] Manage party size and plus-one names.
- [x] Add private coordinator notes for each guest.
- [x] Delete an invalid or duplicate RSVP.
- [x] Persist all RSVP updates in PostgreSQL.

## Priority 2 — Live Wedding Dashboard

- [x] Show total RSVP responses.
- [x] Show accepted and declined counts.
- [x] Show confirmed guest headcount, including plus-ones.
- [x] Show dietary and Ghanaian meal-preference totals.
- [ ] Show recent RSVP activity.
- [ ] Add a simple RSVP progress indicator.

## Priority 3 — Seating Plan Manager

- [ ] Display tables with seat capacity and assigned guests.
- [ ] Search and assign confirmed guests to tables.
- [ ] Move guests between tables.
- [ ] Warn when a table reaches capacity.
- [ ] Print or export table assignments.
- [ ] Save seating changes to PostgreSQL.

## Priority 4 — Photo Moderation

- [ ] View every guest photo submission in an admin queue.
- [ ] Approve photos before they appear in the public gallery.
- [ ] Feature selected photos in the gallery or slideshow.
- [ ] Hide or delete unsuitable submissions.
- [ ] Record moderation status and timestamps in PostgreSQL.

## Priority 5 — Announcements

- [ ] Create wedding-day announcements.
- [ ] Select a start and end time for each announcement.
- [ ] Display active announcements prominently to guests.
- [ ] Manage announcement history in the admin portal.
- [ ] Persist announcements in PostgreSQL.

## Priority 6 — Exports and Coordination

- [x] Export RSVPs as CSV.
- [ ] Export meal preferences for caterers.
- [ ] Export guest contacts for coordinators.
- [ ] Export seating assignments.
- [ ] Add an optional printable summary report.

## Implementation Order

1. Guest and RSVP management
2. Live wedding dashboard
3. Seating plan manager
4. Photo moderation
5. Announcements
6. Exports and coordination
