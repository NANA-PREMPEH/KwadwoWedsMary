import React, { useState, useMemo } from 'react';
import { SeatingTable, RsvpEntry } from '../types/wedding';
import { soundEngine } from '../utils/audio';
import {
  Lock,
  Unlock,
  Users,
  Search,
  CheckCircle2,
  Sparkles,
  MapPin,
  Compass,
  ArrowRight,
  UserCheck,
  ShieldAlert,
  Wine,
  HelpCircle
} from 'lucide-react';

interface SeatingChartSectionProps {
  tables: SeatingTable[];
  rsvps: RsvpEntry[];
  currentUserRsvp: RsvpEntry | null;
  onConfirmUserAttendance: (rsvp: RsvpEntry) => void;
  onScrollToRsvp: () => void;
}

export const SeatingChartSection: React.FC<SeatingChartSectionProps> = ({
  tables,
  rsvps,
  currentUserRsvp,
  onConfirmUserAttendance,
  onScrollToRsvp
}) => {
  const [selectedTableId, setSelectedTableId] = useState<string>('tbl-1');
  const [guestSearch, setGuestSearch] = useState('');
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyError, setVerifyError] = useState('');

  // Determine if user has confirmed RSVP as attending
  const isUnlocked = Boolean(currentUserRsvp && currentUserRsvp.attending === 'accepted');

  // Find user's assigned table if available
  const userSeatInfo = useMemo(() => {
    if (!currentUserRsvp) return null;
    const searchName = currentUserRsvp.fullName.toLowerCase();

    for (const table of tables) {
      const foundGuest = table.guests.find(
        (g) =>
          g.rsvpId === currentUserRsvp.id ||
          g.name.toLowerCase().includes(searchName) ||
          searchName.includes(g.name.toLowerCase())
      );
      if (foundGuest) {
        return { table, guest: foundGuest };
      }
    }
    // Default fallback to Table 5 for newly submitted RSVPs
    return { table: tables[4] || tables[0], guest: { name: currentUserRsvp.fullName, role: 'Honored Guest' } };
  }, [currentUserRsvp, tables]);

  // Handle manual verification
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError('');

    const query = verifyInput.trim().toLowerCase();
    if (!query) {
      setVerifyError('Please enter your full name or email');
      return;
    }

    const matchedRsvp = rsvps.find(
      (r) =>
        r.fullName.toLowerCase().includes(query) ||
        r.email.toLowerCase() === query ||
        (r.guestNames && r.guestNames.some((g) => g.toLowerCase().includes(query)))
    );

    if (matchedRsvp) {
      if (matchedRsvp.attending === 'accepted') {
        onConfirmUserAttendance(matchedRsvp);
        soundEngine.playNote(523.25, 0.8, 0.25, 'sine');
        setTimeout(() => soundEngine.playNote(659.25, 1.2, 0.3, 'sine'), 120);
      } else {
        setVerifyError('Your RSVP status is currently recorded as declined. Update your RSVP to view table assignments.');
      }
    } else {
      setVerifyError('No RSVP record found with that name or email. Please submit your RSVP first.');
    }
  };

  // Quick unlock shortcut for demo/testing
  const handleQuickUnlock = (name: string) => {
    const matched = rsvps.find((r) => r.fullName.toLowerCase().includes(name.toLowerCase()));
    if (matched && matched.attending === 'accepted') {
      onConfirmUserAttendance(matched);
      soundEngine.playNote(523.25, 0.6, 0.25, 'sine');
    }
  };

  const selectedTable = tables.find((t) => t.id === selectedTableId) || tables[0];

  // Filtered tables based on search
  const filteredTables = useMemo(() => {
    if (!guestSearch.trim()) return tables;
    const q = guestSearch.toLowerCase();
    return tables.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.guests.some((g) => g.name.toLowerCase().includes(q))
    );
  }, [tables, guestSearch]);

  return (
    <section id="seating-chart" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[#C85A17] font-semibold mb-2 font-sans">
          <Wine className="w-3.5 h-3.5" />
          <span>The Glass Pavilion Reception</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#0F5132] font-normal">
          Interactive Seating Chart
        </h2>
        <div className="flex items-center justify-center gap-1.5 my-4">
          <span className="w-8 h-0.5 bg-[#C85A17]" />
          <span className="w-2 h-2 rounded-full bg-[#0F5132]" />
          <span className="w-8 h-0.5 bg-[#C85A17]" />
        </div>
        <p className="font-serif italic text-base text-[#524438] max-w-xl mx-auto">
          Explore table assignments, discover your tablemates, and inspect the panoramic dining layout overlooking Lake Como.
        </p>
      </div>

      {!isUnlocked ? (
        /* GATED ACCESS STATE */
        <div className="glass-strong backdrop-blur-2xl rounded-3xl border border-[#C85A17]/35 p-8 sm:p-12 shadow-2xl max-w-2xl mx-auto text-center ring-1 ring-[#0F5132]/20 animate-fade-in relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-[#C85A17]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-44 h-44 bg-[#0F5132]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Lock Icon */}
          <div className="w-16 h-16 rounded-full glass border border-[#C85A17]/35 flex items-center justify-center mx-auto mb-5 text-[#0F5132] shadow-sm">
            <Lock className="w-7 h-7 text-[#C85A17]" />
          </div>

          <span className="text-[11px] uppercase tracking-[0.28em] font-sans font-bold text-[#C85A17] block mb-1">
            Exclusive to Confirmed Guests
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#0F5132] font-semibold mb-3">
            RSVP Confirmation Required
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 font-sans max-w-md mx-auto leading-relaxed mb-8">
            Table arrangements and personalized seat allocations are reserved for guests who have joyfully accepted their RSVP.
          </p>

          {/* Action 1: RSVP Now CTA */}
          <div className="p-5 rounded-2xl glass border border-[#0F5132]/20 mb-6">
            <h4 className="font-serif text-base text-[#0F5132] font-semibold mb-1">
              Haven't submitted your response yet?
            </h4>
            <p className="text-xs text-stone-500 mb-4 font-sans">
              Complete your RSVP to immediately unlock your seat and table assignment.
            </p>
            <button
              onClick={onScrollToRsvp}
              className="px-6 py-3 bg-[#0F5132] hover:bg-[#082E1D] text-white text-xs uppercase tracking-[0.2em] font-bold font-sans rounded-xl shadow-md transition-all cursor-pointer border border-[#C85A17]/40 inline-flex items-center gap-2"
            >
              <span>Joyfully RSVP Now</span>
              <ArrowRight className="w-4 h-4 text-[#E06D28]" />
            </button>
          </div>

          {/* Action 2: Already RSVP'd Verification Search */}
          <div className="pt-2">
            <span className="text-xs uppercase tracking-[0.18em] font-semibold text-stone-500 block mb-2 font-sans">
              Already RSVP'd as Attending? Unlock Below:
            </span>

            {verifyError && (
              <div className="mb-3 p-3 bg-rose-50/90 border border-rose-200 text-rose-700 text-xs rounded-xl font-sans text-left">
                {verifyError}
              </div>
            )}

            <form onSubmit={handleVerify} className="flex gap-2 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter your Name or Email..."
                value={verifyInput}
                onChange={(e) => setVerifyInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl glass-input text-xs text-[#2b241e]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#C85A17] hover:bg-[#a0420b] text-white text-xs uppercase tracking-[0.16em] font-bold font-sans rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
              >
                Unlock
              </button>
            </form>

            {/* Quick Demo Unlocks */}
            <div className="mt-5 pt-4 border-t border-[#C85A17]/15 text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 block mb-2 font-sans font-semibold">
                Try instant demo guest preview:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['Lucas Vance', 'Seraphina Fontaine', 'Marco Rossi', 'Arthur Vance'].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleQuickUnlock(name)}
                    className="px-2.5 py-1 rounded-lg glass border border-stone-200/60 hover:border-[#C85A17] hover:text-[#0F5132] text-stone-600 text-[11px] font-sans transition-colors cursor-pointer"
                  >
                    Unlock as {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* UNLOCKED SEATING CHART VIEW */
        <div className="space-y-8 animate-fade-in">
          
          {/* Confirmed Guest Header Banner */}
          <div className="glass-strong backdrop-blur-2xl rounded-2xl border border-[#0F5132]/30 p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ring-1 ring-[#C85A17]/25">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#0F5132] text-white flex items-center justify-center shrink-0 shadow-sm border border-[#C85A17]/40">
                <UserCheck className="w-6 h-6 text-[#E06D28]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#0F5132] font-sans">
                    RSVP Verified & Attending
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-[#2c241d] font-semibold">
                  Welcome, {currentUserRsvp?.fullName}
                </h3>
                {userSeatInfo && (
                  <p className="text-xs text-[#C85A17] font-sans font-medium mt-0.5">
                    Assigned to: <strong>Table {userSeatInfo.table.tableNumber} — {userSeatInfo.table.name}</strong> ({userSeatInfo.table.location})
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              {userSeatInfo && (
                <button
                  onClick={() => setSelectedTableId(userSeatInfo.table.id)}
                  className="px-4 py-2 bg-[#0F5132] hover:bg-[#082E1D] text-white text-xs uppercase tracking-[0.16em] font-bold font-sans rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#E06D28]" />
                  <span>View My Table</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Ballroom Floorplan Schematic & Table Explorer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Floor Plan Map */}
            <div className="lg:col-span-7 glass backdrop-blur-xl rounded-3xl border border-[#0F5132]/25 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0F5132]/10">
                <div className="flex items-center gap-2 text-[#0F5132]">
                  <Compass className="w-4 h-4 text-[#C85A17]" />
                  <span className="text-xs uppercase tracking-[0.2em] font-semibold font-sans">
                    Glass Pavilion Ballroom Floorplan
                  </span>
                </div>
                <span className="text-[11px] text-stone-400 font-sans">
                  Tap any table to inspect
                </span>
              </div>

              {/* Schematic Canvas */}
              <div className="relative w-full aspect-[4/3] bg-[#F7FAF8]/90 rounded-2xl overflow-hidden border border-[#0F5132]/15 shadow-inner select-none p-4">
                
                {/* Lake Como View Label at Top */}
                <div className="absolute top-3 inset-x-0 text-center">
                  <div className="inline-block px-4 py-1 rounded-full glass border border-[#0F5132]/25 text-[#0F5132] text-[10px] uppercase font-bold tracking-[0.25em]">
                    Lake Como Panoramic Glass Vista
                  </div>
                </div>

                {/* Ballroom perimeter outline */}
                <div className="absolute inset-x-8 top-12 bottom-6 border-2 border-dashed border-[#0F5132]/20 rounded-2xl pointer-events-none" />

                {/* Interactive Tables on Schematic */}
                {tables.map((table) => {
                  const isSelected = table.id === selectedTableId;
                  const isUserTable = userSeatInfo?.table.id === table.id;

                  return (
                    <button
                      key={table.id}
                      onClick={() => setSelectedTableId(table.id)}
                      style={{ left: `${table.x}%`, top: `${table.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                    >
                      <div className="flex flex-col items-center">
                        {/* Table Disc / Shape */}
                        <div
                          className={`relative transition-all duration-300 flex items-center justify-center font-serif text-sm font-bold shadow-md ${
                            table.shape === 'head'
                              ? 'w-24 h-12 rounded-xl'
                              : 'w-14 h-14 sm:w-16 sm:h-16 rounded-full'
                          } ${
                            isSelected
                              ? 'bg-[#C85A17] text-white ring-4 ring-[#C85A17]/30 scale-110 shadow-lg'
                              : isUserTable
                              ? 'bg-[#0F5132] text-white ring-4 ring-[#0F5132]/30 animate-pulse'
                              : 'glass text-[#0F5132] border border-[#0F5132]/30 hover:border-[#C85A17]'
                          }`}
                        >
                          <span>{table.tableNumber}</span>

                          {/* "You" badge if user's table */}
                          {isUserTable && (
                            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-[#E06D28] text-white text-[9px] font-sans font-bold shadow-sm">
                              You
                            </span>
                          )}
                        </div>

                        {/* Table Name label */}
                        <span className={`mt-1.5 px-2 py-0.5 rounded text-[10px] font-sans font-medium whitespace-nowrap transition-colors ${
                          isSelected
                            ? 'bg-[#0F5132] text-white'
                            : 'glass text-stone-700 shadow-2xs'
                        }`}>
                          {table.name}
                        </span>
                      </div>
                    </button>
                  );
                })}

                {/* Dance Floor Label in Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-40">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-stone-400">
                    Main Dance Floor
                  </span>
                </div>
              </div>

              {/* Table search filter */}
              <div className="mt-5 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Find table by guest name (e.g. Lucas, Seraphina)..."
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-[#2b241e]"
                />
              </div>
            </div>

            {/* Right: Selected Table Details & Guest Allocation */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="glass-strong backdrop-blur-2xl rounded-3xl border border-[#0F5132]/30 p-6 shadow-md ring-1 ring-[#C85A17]/25">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#0F5132]/10">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C85A17] font-sans font-bold block">
                      Table {selectedTable.tableNumber}
                    </span>
                    <h3 className="font-serif text-2xl text-[#0F5132] font-semibold">
                      {selectedTable.name}
                    </h3>
                  </div>

                  <span className="px-3 py-1 rounded-full glass border border-[#0F5132]/25 text-[#0F5132] text-xs font-sans font-bold">
                    {selectedTable.guests.length} / {selectedTable.capacity} Seats
                  </span>
                </div>

                <p className="text-xs text-stone-600 font-sans italic mb-4">
                  {selectedTable.tagline} · {selectedTable.location}
                </p>

                {/* Centerpiece description */}
                <div className="p-3.5 rounded-xl glass border border-[#0F5132]/15 mb-6 text-xs text-stone-600 font-sans">
                  <strong className="text-[#0F5132] block mb-1">Centerpiece & Table Setting:</strong>
                  {selectedTable.centerpieceNote}
                </div>

                {/* Seated Guests List for this table */}
                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] font-bold text-[#0F5132] font-sans mb-3 flex items-center justify-between">
                    <span>Seated Guests</span>
                    <Users className="w-3.5 h-3.5 text-[#C85A17]" />
                  </h4>

                  <div className="divide-y divide-stone-100">
                    {selectedTable.guests.map((guest, idx) => {
                      const isCurrentUser =
                        currentUserRsvp &&
                        (guest.rsvpId === currentUserRsvp.id ||
                          guest.name.toLowerCase().includes(currentUserRsvp.fullName.toLowerCase()));

                      return (
                        <div
                          key={idx}
                          className={`py-2.5 flex items-center justify-between text-xs transition-colors ${
                            isCurrentUser ? 'bg-[#0F5132]/5 px-2 rounded-lg' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#0F5132]/10 text-[#0F5132] flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            <span className={`font-medium ${isCurrentUser ? 'text-[#0F5132] font-bold' : 'text-stone-800'}`}>
                              {guest.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {guest.role && (
                              <span className="text-[10px] text-stone-400 font-sans">
                                {guest.role}
                              </span>
                            )}
                            {isCurrentUser && (
                              <span className="px-2 py-0.5 rounded-full bg-[#C85A17] text-white text-[9px] font-bold tracking-wide">
                                Your Seat
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Table Switcher Pills */}
              <div className="glass rounded-2xl border border-[#C85A17]/25 p-4 shadow-2xs backdrop-blur-xl">
                <span className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-sans font-bold block mb-2.5">
                  Browse All Tables:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {tables.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTableId(t.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        t.id === selectedTableId
                          ? 'border-[#0F5132] bg-[#0F5132]/10 text-[#0F5132] font-bold shadow-xs'
                          : 'glass border-stone-200/80 text-stone-600 hover:border-[#C85A17]'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-mono block text-[#C85A17]">T-{t.tableNumber}</span>
                      <span className="text-xs truncate block font-serif font-medium">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </section>
  );
};
