import React, { useState } from 'react';
import { RsvpEntry, SeatingTable, WeddingAnnouncement, WeddingDetails, SongSuggestion, WeddingPhoto } from '../types/wedding';
import { X, Users, CheckCircle, XCircle, Utensils, Music, Download, Search, Settings, ShieldCheck, HeartHandshake, LogOut, Bell, Camera, Megaphone, UserCheck, UserRoundX } from 'lucide-react';

interface OrganizerDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  rsvps: RsvpEntry[];
  details: WeddingDetails;
  suggestedSongs?: SongSuggestion[];
  onUpdateDetails: (details: WeddingDetails) => void;
  onDeleteRsvp: (id: string) => void;
  onUpdateRsvp: (rsvp: RsvpEntry) => void;
  photos: WeddingPhoto[];
  onUpdatePhoto: (photo: WeddingPhoto) => void;
  onDeletePhoto: (id: string) => void;
  tables: SeatingTable[];
  onUpdateTables: (tables: SeatingTable[]) => void;
  announcements: WeddingAnnouncement[];
  onUpdateAnnouncements: (announcements: WeddingAnnouncement[]) => void;
  onLogout: () => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  isOpen,
  onClose,
  rsvps,
  details,
  suggestedSongs = [],
  onUpdateDetails,
  onDeleteRsvp,
  onUpdateRsvp,
  photos,
  onUpdatePhoto,
  onDeletePhoto,
  tables,
  onUpdateTables,
  announcements,
  onUpdateAnnouncements,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'guests' | 'dietary' | 'playlist' | 'photos' | 'seating' | 'announcements' | 'settings'>('guests');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNames, setEditingNames] = useState(details.coupleNames);
  const [editingDate, setEditingDate] = useState(details.date);
  const [editingVenueName, setEditingVenueName] = useState(details.ceremonyVenue.name);
  const [editingVenueAddress, setEditingVenueAddress] = useState(details.ceremonyVenue.address);
  const [saveNotice, setSaveNotice] = useState(false);

  if (!isOpen) return null;

  // Metrics
  const attendingList = rsvps.filter((r) => r.attending === 'accepted');
  const declinedList = rsvps.filter((r) => r.attending === 'declined');
  const totalHeadcount = attendingList.reduce((sum, r) => sum + (r.partySize || 1), 0);

  // Dietary aggregation
  const dietaryCounts: Record<string, number> = {};
  attendingList.forEach((r) => {
    (r.dietaryRestrictions || []).forEach((d) => {
      if (d !== 'None') {
        dietaryCounts[d] = (dietaryCounts[d] || 0) + 1;
      }
    });
  });

  // Songs
  const songRequests = rsvps
    .filter((r) => r.songRequest && r.songRequest.trim().length > 0)
    .map((r) => ({ guest: r.fullName, song: r.songRequest! }));

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Attendance', 'Party Size', 'Dietary', 'Notes', 'Song Request', 'Message', 'Timestamp'];
    const rows = rsvps.map((r) => [
      `"${r.id}"`,
      `"${r.fullName}"`,
      `"${r.email}"`,
      `"${r.phone || ''}"`,
      `"${r.attending}"`,
      `"${r.partySize}"`,
      `"${r.dietaryRestrictions.join('; ')}"`,
      `"${(r.dietaryNotes || '').replace(/"/g, '""')}"`,
      `"${(r.songRequest || '').replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${r.submittedAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'wedding-guestlist-export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadCsv = (filename: string, headers: string[], rows: string[][]) => {
    const quote = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const blob = new Blob([[headers, ...rows].map((row) => row.map(quote).join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const exportContacts = () => downloadCsv('wedding-guest-contacts.csv', ['Name', 'Email', 'Phone', 'Attendance', 'Party Size'], rsvps.map((rsvp) => [rsvp.fullName, rsvp.email, rsvp.phone || '', rsvp.attending, String(rsvp.partySize)]));
  const exportMeals = () => downloadCsv('wedding-catering-preferences.csv', ['Guest', 'Party Size', 'Meal Preferences', 'Notes'], attendingList.map((rsvp) => [rsvp.fullName, String(rsvp.partySize), rsvp.dietaryRestrictions.join('; '), rsvp.dietaryNotes || '']));
  const exportSeating = () => downloadCsv('wedding-seating-plan.csv', ['Table', 'Table Name', 'Guest', 'Role'], tables.flatMap((table) => table.guests.map((guest) => [String(table.tableNumber), table.name, guest.name, guest.role || 'Guest'])));

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDetails({
      ...details,
      coupleNames: editingNames,
      date: editingDate,
      ceremonyVenue: {
        ...details.ceremonyVenue,
        name: editingVenueName,
        address: editingVenueAddress,
      },
      receptionVenue: {
        ...details.receptionVenue,
        name: editingVenueName,
        address: editingVenueAddress,
      },
    });
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 2500);
  };

  const filteredRsvps = rsvps.filter((r) =>
    r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const pendingPhotos = photos.filter((photo) => photo.moderationStatus === 'pending');
  const assignGuest = (rsvp: RsvpEntry, tableId: string) => {
    onUpdateTables(tables.map((table) => ({
      ...table,
      guests: table.id === tableId
        ? [...table.guests.filter((guest) => guest.rsvpId !== rsvp.id), { name: rsvp.fullName, role: 'Honored Guest', rsvpId: rsvp.id }]
        : table.guests.filter((guest) => guest.rsvpId !== rsvp.id),
    })));
  };

  const adminTabs = [
    { id: 'guests', label: 'Guests', icon: Users, badge: filteredRsvps.length },
    { id: 'seating', label: 'Seating', icon: HeartHandshake, badge: undefined },
    { id: 'dietary', label: 'Catering', icon: Utensils, badge: undefined },
    { id: 'playlist', label: 'Music', icon: Music, badge: songRequests.length },
    { id: 'photos', label: 'Photos', icon: Camera, badge: pendingPhotos.length },
    { id: 'announcements', label: 'Updates', icon: Megaphone, badge: undefined },
    { id: 'settings', label: 'Settings', icon: Settings, badge: undefined },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071a12]/75 p-2 backdrop-blur-md animate-fade-in sm:p-5">
      <div role="dialog" aria-modal="true" aria-labelledby="organizer-dashboard-title" className="flex max-h-[96vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#F7F8F5] shadow-[0_32px_100px_rgba(0,0,0,0.45)] sm:max-h-[92vh] sm:rounded-[1.75rem]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0F5132]/10 bg-white px-4 py-4 sm:px-7 sm:py-5">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0F5132] shadow-sm ring-1 ring-[#C85A17]/35">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="mb-0.5 flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C85A17]">Private administration</p>
                <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700 sm:inline">Secure session</span>
              </div>
              <h3 id="organizer-dashboard-title" className="truncate font-serif text-xl font-semibold text-[#0F5132] sm:text-2xl">
                Wedding Operations
              </h3>
              <p className="hidden text-xs text-stone-500 sm:block">
                Guest management, event planning and content controls
              </p>
            </div>
          </div>

          <div className="relative flex items-center gap-1.5">
            <button onClick={() => setShowNotifications((open) => !open)} className="relative rounded-xl border border-stone-200 bg-white p-2.5 text-[#0F5132] shadow-sm transition hover:border-[#0F5132]/30 hover:bg-[#F4F8F5]" aria-label="Pending photo notifications">
              <Bell className="h-4 w-4" />
              {pendingPhotos.length > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C85A17] px-1 text-[9px] font-bold text-white">{pendingPhotos.length}</span>}
            </button>
            <button onClick={onLogout} className="hidden items-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-stone-600 transition hover:border-[#C85A17]/40 hover:bg-[#C85A17]/5 hover:text-[#C85A17] sm:flex" title="Sign out of the admin portal">
              <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Logout</span>
            </button>
            <button onClick={onClose} className="rounded-xl border border-stone-200 p-2.5 text-stone-500 transition hover:border-stone-300 hover:bg-stone-100 hover:text-stone-800" aria-label="Close admin portal">
              <X className="w-5 h-5" />
            </button>
            {showNotifications && <div className="absolute right-16 top-11 z-20 w-80 rounded-xl border border-[#E7C56A]/40 bg-white p-3 shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#C85A17]">Photo approvals</p>
              {pendingPhotos.length === 0 ? <p className="mt-2 text-xs text-stone-500">No pending photo submissions.</p> : <div className="mt-2 space-y-2">{pendingPhotos.slice(0, 4).map((photo) => <button key={photo.id} onClick={() => { setActiveTab('photos'); setShowNotifications(false); }} className="flex w-full items-center gap-2 rounded-lg p-1.5 text-left hover:bg-stone-50"><img src={photo.url} alt="Pending submission" className="h-9 w-9 rounded object-cover" /><span className="min-w-0"><span className="block truncate text-xs font-semibold text-[#0F5132]">{photo.uploaderName}</span><span className="block truncate text-[10px] text-stone-500">Awaiting approval</span></span></button>)}</div>}
            </div>}
          </div>
        </div>

        {/* Quick KPI stats row */}
        <div className="grid grid-cols-2 gap-3 border-b border-[#0F5132]/10 bg-[#F7F8F5] p-4 sm:grid-cols-4 sm:px-7 sm:py-5">
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500">Total responses</span><Users className="h-4 w-4 text-stone-400" /></div>
            <span className="mt-2 block font-serif text-3xl font-semibold leading-none text-[#17261f]">{rsvps.length}</span>
            <span className="mt-2 block text-[10px] text-stone-400">All submitted RSVPs</span>
          </div>

          <div className="rounded-xl border border-emerald-200/70 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700">Confirmed</span><UserCheck className="h-4 w-4 text-emerald-600" /></div>
            <span className="mt-2 block font-serif text-3xl font-semibold leading-none text-[#0F5132]">{attendingList.length}</span>
            <span className="mt-2 block text-[10px] text-stone-400">Accepted invitations</span>
          </div>

          <div className="rounded-xl border border-orange-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#C85A17]">Headcount</span><HeartHandshake className="h-4 w-4 text-[#C85A17]" /></div>
            <span className="mt-2 block font-serif text-3xl font-semibold leading-none text-[#C85A17]">{totalHeadcount}</span>
            <span className="mt-2 block text-[10px] text-stone-400">Expected attendees</span>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3"><span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500">Declined</span><UserRoundX className="h-4 w-4 text-stone-400" /></div>
            <span className="mt-2 block font-serif text-3xl font-semibold leading-none text-stone-600">{declinedList.length}</span>
            <span className="mt-2 block text-[10px] text-stone-400">Unable to attend</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex gap-1 overflow-x-auto border-b border-stone-200 bg-white px-3 py-2 sm:px-7" role="tablist" aria-label="Dashboard sections">
          {adminTabs.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold transition ${
                activeTab === id
                  ? 'bg-[#0F5132] text-white shadow-sm'
                  : 'text-stone-500 hover:bg-stone-100 hover:text-[#0F5132]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
              {typeof badge === 'number' && <span className={`rounded-full px-1.5 py-0.5 text-[9px] ${activeTab === id ? 'bg-white/15 text-white' : 'bg-stone-100 text-stone-500'}`}>{badge}</span>}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto bg-[#F7F8F5] p-4 sm:p-7">
          {activeTab === 'guests' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search guests by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#dcd0bf] focus:border-[#99732f] focus:outline-none text-xs text-[#2b241e] bg-white"
                  />
                </div>

                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2 bg-[#2c241d] hover:bg-[#43392f] text-white text-xs uppercase tracking-wider font-medium rounded-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-[#dfba73]" />
                  <span>Export CSV</span>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-[#f7f2ea] text-stone-600 uppercase tracking-wider border-b border-[#ebdcc9]">
                    <tr>
                      <th className="p-3">Guest Name</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Party</th>
                      <th className="p-3">Dietary</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2ece2]">
                    {filteredRsvps.map((r) => (
                      <tr key={r.id} className="hover:bg-stone-50">
                        <td className="p-3">
                          <span className="font-semibold text-[#2c241d] block">{r.fullName}</span>
                          <span className="text-[11px] text-stone-500">{r.email}</span>
                        </td>
                        <td className="p-3">
                          <select
                            value={r.attending}
                            onChange={(event) => onUpdateRsvp({ ...r, attending: event.target.value as RsvpEntry['attending'], partySize: event.target.value === 'declined' ? 0 : r.partySize })}
                            className="rounded-lg border border-[#0F5132]/20 bg-white px-2 py-1 text-[10px] font-semibold uppercase text-[#0F5132]"
                          >
                            <option value="accepted">Attending</option>
                            <option value="pending">Pending</option>
                            <option value="declined">Declined</option>
                          </select>
                        </td>
                        <td className="p-3 text-stone-700">
                          {r.partySize > 0 ? `${r.partySize} person` : '—'}
                        </td>
                        <td className="p-3 text-stone-600 max-w-xs truncate">
                          {r.dietaryRestrictions.join(', ') || 'None'}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              const adminNotes = window.prompt(`Private note for ${r.fullName}`, r.adminNotes || '');
                              if (adminNotes !== null) onUpdateRsvp({ ...r, adminNotes });
                            }}
                            className="mr-3 text-[#0F5132] hover:text-[#C85A17] text-[11px] cursor-pointer"
                          >
                            Note
                          </button>
                          <button
                            onClick={() => onDeleteRsvp(r.id)}
                            className="text-rose-600 hover:text-rose-800 text-[11px] cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'dietary' && (
            <div className="space-y-6">
              <div className="p-4 bg-white rounded-xl border border-[#ebdcc9]">
                <h4 className="font-serif text-lg text-[#2c241d] mb-3 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#99732f]" />
                  <span>Summary for Catering & Chefs</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {Object.entries(dietaryCounts).map(([key, count]) => (
                    <div key={key} className="p-3 bg-[#faf7f2] rounded-lg border border-[#ede3d5] text-center">
                      <span className="text-xs font-semibold text-[#2c241d] block">{key}</span>
                      <span className="text-xl font-serif text-[#99732f] font-bold">{count}</span>
                    </div>
                  ))}
                  {Object.keys(dietaryCounts).length === 0 && (
                    <p className="text-xs text-stone-500 col-span-4">No special restrictions registered yet.</p>
                  )}
                </div>

                <h5 className="text-xs uppercase tracking-wider font-semibold text-stone-600 mb-2">
                  Specific Dietary Notes from Guests:
                </h5>
                <ul className="space-y-2 text-xs text-stone-600">
                  {attendingList.filter((r) => r.dietaryNotes).map((r) => (
                    <li key={r.id} className="p-2.5 bg-[#fbf9f5] rounded border border-[#ebdcc9]">
                      <strong>{r.fullName}:</strong> {r.dietaryNotes}
                    </li>
                  ))}
                </ul>
                <button onClick={exportMeals} className="mt-4 rounded-lg bg-[#0F5132] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white">Export catering CSV</button>
              </div>
            </div>
          )}

          {activeTab === 'playlist' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-[#0F5132]/20">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-lg text-[#0F5132] flex items-center gap-2 font-semibold">
                    <Music className="w-4 h-4 text-[#C85A17]" />
                    <span>Reception DJ & Guest Suggestions ({suggestedSongs.length})</span>
                  </h4>
                  <button
                    onClick={() => {
                      const list = suggestedSongs.map((s) => `${s.title} - ${s.artist} (Suggested by ${s.suggestedBy}, ${s.votes} votes)`).join('\n');
                      navigator.clipboard.writeText(list);
                    }}
                    className="text-xs text-[#C85A17] hover:underline font-sans cursor-pointer font-semibold"
                  >
                    Copy All to Clipboard
                  </button>
                </div>

                <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
                  {suggestedSongs.map((s) => (
                    <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-serif text-sm font-semibold text-[#0F5132]">“{s.title}”</span>
                        <span className="text-stone-500 font-sans ml-1.5">— {s.artist}</span>
                        <span className="text-[10px] text-stone-400 font-sans block mt-0.5">
                          Suggested by {s.suggestedBy} · {s.genre}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#C85A17]/10 text-[#C85A17] font-bold text-xs">
                        {s.votes} {s.votes === 1 ? 'vote' : 'votes'}
                      </span>
                    </div>
                  ))}
                  {suggestedSongs.length === 0 && (
                    <p className="text-xs text-stone-400 py-4">No song requests submitted yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-600">Guest uploads are visible immediately. Review new photos here, hide anything unsuitable, or feature a favourite in the slideshow.</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {photos.map((photo) => (
                  <div key={photo.id} className="flex gap-3 rounded-xl border border-[#ebdcc9] bg-white p-3">
                    <img src={photo.url} alt="Guest submission" className="h-16 w-16 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-[#0F5132]">{photo.uploaderName}</p><p className="mt-1 line-clamp-2 text-[11px] text-stone-500">{photo.caption}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                        <button onClick={() => onUpdatePhoto({ ...photo, moderationStatus: 'approved' })} className="cursor-pointer rounded-lg border border-emerald-200 bg-emerald-100 px-2.5 py-1.5 font-semibold text-emerald-800 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-600 hover:text-white hover:shadow-md active:translate-y-0 active:scale-95">Keep public</button>
                        <button onClick={() => onUpdatePhoto({ ...photo, moderationStatus: 'hidden' })} className="cursor-pointer rounded-lg border border-stone-200 bg-stone-100 px-2.5 py-1.5 font-semibold text-stone-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-stone-700 hover:text-white hover:shadow-md active:translate-y-0 active:scale-95">Hide</button>
                        <button onClick={() => onUpdatePhoto({ ...photo, isFeatured: !photo.isFeatured })} className="cursor-pointer rounded-lg border border-amber-200 bg-amber-100 px-2.5 py-1.5 font-semibold text-amber-800 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#C85A17] hover:text-white hover:shadow-md active:translate-y-0 active:scale-95">{photo.isFeatured ? 'Unfeature' : 'Feature'}</button>
                        <button onClick={() => { if (window.confirm(`Permanently delete this photo from ${photo.uploaderName}?`)) onDeletePhoto(photo.id); }} className="cursor-pointer rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 font-semibold text-rose-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-rose-600 hover:text-white hover:shadow-md active:translate-y-0 active:scale-95">Delete</button>
                      </div></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'seating' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3"><p className="text-xs text-stone-600">Assign confirmed guests to a table. Capacity warnings appear in orange.</p><button onClick={exportSeating} className="rounded-lg bg-[#0F5132] px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white">Export seating CSV</button></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {tables.map((table) => {
                  const full = table.guests.length >= table.capacity;
                  return <div key={table.id} className={`rounded-xl border p-4 ${full ? 'border-[#C85A17]/60 bg-orange-50' : 'border-[#0F5132]/20 bg-white'}`}>
                    <div className="flex justify-between gap-3"><div><h4 className="font-serif text-lg text-[#0F5132]">Table {table.tableNumber}</h4><p className="text-[11px] text-stone-500">{table.name}</p></div><span className="text-xs font-bold text-[#C85A17]">{table.guests.length}/{table.capacity}</span></div>
                    <select defaultValue="" onChange={(event) => { const rsvp = rsvps.find((item) => item.id === event.target.value); if (rsvp) assignGuest(rsvp, table.id); event.currentTarget.value = ''; }} className="mt-3 w-full rounded-lg border border-stone-200 p-2 text-xs">
                      <option value="">Assign confirmed guest…</option>{rsvps.filter((rsvp) => rsvp.attending === 'accepted').map((rsvp) => <option key={rsvp.id} value={rsvp.id}>{rsvp.fullName}</option>)}
                    </select>
                    <div className="mt-3 space-y-1.5">{table.guests.map((guest) => <div key={`${guest.rsvpId}-${guest.name}`} className="flex justify-between rounded bg-stone-50 px-2 py-1.5 text-xs"><span>{guest.name}</span><button onClick={() => onUpdateTables(tables.map((item) => item.id === table.id ? { ...item, guests: item.guests.filter((entry) => entry !== guest) } : item))} className="text-rose-600">Remove</button></div>)}</div>
                  </div>;
                })}
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="space-y-4 max-w-xl"><p className="text-xs text-stone-600">Publish a timely message for guests. It appears only between the selected start and end times.</p>
              <form onSubmit={(event) => { event.preventDefault(); const now = new Date(); onUpdateAnnouncements([{ id: `announcement-${Date.now()}`, title: announcementTitle || 'Wedding Update', message: announcementMessage, startsAt: now.toISOString(), endsAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString() }, ...announcements]); setAnnouncementTitle(''); setAnnouncementMessage(''); }} className="space-y-3 rounded-xl border border-[#ebdcc9] bg-white p-4">
                <input value={announcementTitle} onChange={(event) => setAnnouncementTitle(event.target.value)} placeholder="Announcement title" required className="w-full rounded-lg border border-stone-200 p-2 text-sm" />
                <textarea value={announcementMessage} onChange={(event) => setAnnouncementMessage(event.target.value)} placeholder="Message for guests" required rows={3} className="w-full rounded-lg border border-stone-200 p-2 text-sm" />
                <button className="rounded-lg bg-[#0F5132] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">Publish for 24 hours</button>
              </form>
              {announcements.map((item) => <div key={item.id} className="flex justify-between gap-3 rounded-xl border border-[#ebdcc9] bg-white p-3"><div><p className="font-semibold text-[#0F5132]">{item.title}</p><p className="text-xs text-stone-600">{item.message}</p></div><button onClick={() => onUpdateAnnouncements(announcements.filter((entry) => entry.id !== item.id))} className="text-xs text-rose-600">Remove</button></div>)}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-lg">
              {saveNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg">
                  Wedding details updated successfully!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-[#0F5132]/20 bg-white p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#0F5132]">Guest seating chart</p>
                    <p className="mt-1 text-xs text-stone-500">Show the seating-chart page and navigation link to guests.</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={details.seatingChartVisible !== false}
                    onClick={() => onUpdateDetails({ ...details, seatingChartVisible: details.seatingChartVisible === false })}
                    className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${details.seatingChartVisible !== false ? 'bg-[#0F5132]' : 'bg-stone-300'}`}
                  >
                    <span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${details.seatingChartVisible !== false ? 'translate-x-5' : 'translate-x-0'}`} />
                    <span className="sr-only">Toggle guest seating-chart visibility</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5c4e42] mb-1 font-sans">
                    Couple Monogram Display Names
                  </label>
                  <input
                    type="text"
                    value={editingNames}
                    onChange={(e) => setEditingNames(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#dcd0bf] focus:outline-none text-xs text-[#2b241e] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5c4e42] mb-1 font-sans">
                    Venue Name
                  </label>
                  <input
                    type="text"
                    value={editingVenueName}
                    onChange={(e) => setEditingVenueName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#dcd0bf] focus:outline-none text-xs text-[#2b241e] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5c4e42] mb-1 font-sans">
                    Venue Address
                  </label>
                  <input
                    type="text"
                    value={editingVenueAddress}
                    onChange={(e) => setEditingVenueAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#dcd0bf] focus:outline-none text-xs text-[#2b241e] bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#5c4e42] mb-1 font-sans">
                    Wedding Date String
                  </label>
                  <input
                    type="text"
                    value={editingDate}
                    onChange={(e) => setEditingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#dcd0bf] focus:outline-none text-xs text-[#2b241e] bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2c241d] hover:bg-[#43392f] text-white text-xs uppercase tracking-wider font-medium rounded-lg cursor-pointer"
                >
                  Save Changes
                </button>
              </form>
              <button onClick={exportContacts} className="rounded-lg border border-[#0F5132]/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0F5132]">Export guest contacts CSV</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export { OrganizerDashboard as OrganizerModal };
