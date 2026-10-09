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

- [x] Display tables with seat capacity and assigned guests.
- [-] Assign confirmed guests to tables. *(Assignment is implemented; a dedicated guest-search field is still pending.)*
- [x] Move guests between tables.
- [x] Warn when a table reaches capacity.
- [x] Export table assignments as CSV.
- [x] Save seating changes to PostgreSQL.

## Priority 4 — Photo Moderation

- [x] View every guest photo submission in an admin queue.
- [x] Approve photos before they appear in the public gallery.
- [x] Feature selected photos in the gallery or slideshow.
- [x] Hide unsuitable submissions.
- [-] Record moderation status in PostgreSQL. *(A separate moderation timestamp is still pending.)*

## Priority 5 — Announcements

- [x] Create wedding-day announcements.
- [-] Set an announcement time window. *(Announcements currently publish immediately for 24 hours; custom start/end inputs are still pending.)*
- [x] Display active announcements prominently to guests.
- [x] Manage announcement history in the admin portal.
- [x] Persist announcements in PostgreSQL.

## Priority 6 — Exports and Coordination

- [x] Export RSVPs as CSV.
- [x] Export meal preferences for caterers.
- [x] Export guest contacts for coordinators.
- [x] Export seating assignments.
- [ ] Add an optional printable summary report.

## Implementation Order

1. Guest and RSVP management
2. Live wedding dashboard
3. Seating plan manager
4. Photo moderation
5. Announcements
6. Exports and coordination
