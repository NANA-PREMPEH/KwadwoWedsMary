/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  INITIAL_WEDDING_DETAILS,
  INITIAL_SCHEDULE,
  INITIAL_PHOTOS,
  INITIAL_RSVPS,
  INITIAL_GUESTBOOK,
  INITIAL_FAQS,
  INITIAL_SONG_SUGGESTIONS,
  INITIAL_SEATING_TABLES
} from './data/initialData';
import { WeddingDetails, RsvpEntry, WeddingPhoto, GuestbookEntry, SongSuggestion, SeatingTable } from './types/wedding';
import { soundEngine } from './utils/audio';

import { Navbar } from './components/Navbar';
import { EnvelopeModal } from './components/EnvelopeModal';
import { HeroSection } from './components/HeroSection';
import { ScheduleSection } from './components/ScheduleSection';
import { VenueSection } from './components/VenueSection';
import { DressCodeSection } from './components/DressCodeSection';
import { RsvpSection } from './components/RsvpSection';
import { SeatingChartSection } from './components/SeatingChartSection';
import { MusicPlayerSection } from './components/MusicPlayerSection';
import { LivePhotoStream } from './components/LivePhotoStream';
import { GuestbookSection } from './components/GuestbookSection';
import { FaqRegistrySection } from './components/FaqRegistrySection';
import { OrganizerModal } from './components/OrganizerModal';
import { Footer } from './components/Footer';
import { BellRing, X } from 'lucide-react';

const PAGE_IDS = ['couple', 'schedule', 'venue', 'dress-code', 'rsvp', 'seating-chart', 'music-player', 'photos', 'guestbook', 'faq'] as const;

const getPageFromHash = () => {
  const page = window.location.hash.replace(/^#\/?/, '');
  return PAGE_IDS.includes(page as typeof PAGE_IDS[number]) ? page : 'couple';
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('aeterna_theme') === 'dark';
    } catch {
      return false;
    }
  });
  const [hasSubmittedRsvp, setHasSubmittedRsvp] = useState(() => {
    try {
      return localStorage.getItem('aeterna_rsvp_submitted') === 'true';
    } catch {
      return false;
    }
  });
  const [showRsvpReminder, setShowRsvpReminder] = useState(false);

  // State with localStorage persistence
  const [details, setDetails] = useState<WeddingDetails>(() => {
    try {
      const saved = localStorage.getItem('aeterna_wedding_details_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          ceremonyVenue: {
            ...parsed.ceremonyVenue,
            googleMapsUrl: INITIAL_WEDDING_DETAILS.ceremonyVenue.googleMapsUrl
          }
        };
      }
      return INITIAL_WEDDING_DETAILS;
    } catch {
      return INITIAL_WEDDING_DETAILS;
    }
  });

  const [rsvps, setRsvps] = useState<RsvpEntry[]>(() => {
    try {
      const saved = localStorage.getItem('aeterna_wedding_rsvps');
      return saved ? JSON.parse(saved) : INITIAL_RSVPS;
    } catch {
      return INITIAL_RSVPS;
    }
  });

  const [photos, setPhotos] = useState<WeddingPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('aeterna_wedding_photos');
      return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
    } catch {
      return INITIAL_PHOTOS;
    }
  });

  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(() => {
    try {
      const saved = localStorage.getItem('aeterna_wedding_guestbook');
      return saved ? JSON.parse(saved) : INITIAL_GUESTBOOK;
    } catch {
      return INITIAL_GUESTBOOK;
    }
  });

  const [songs, setSongs] = useState<SongSuggestion[]>(() => {
    try {
      const saved = localStorage.getItem('aeterna_wedding_songs_v2');
      return saved ? JSON.parse(saved) : INITIAL_SONG_SUGGESTIONS;
    } catch {
      return INITIAL_SONG_SUGGESTIONS;
    }
  });

  const [tables, setTables] = useState<SeatingTable[]>(() => {
    try {
      const saved = localStorage.getItem('aeterna_seating_tables');
      return saved ? JSON.parse(saved) : INITIAL_SEATING_TABLES;
    } catch {
      return INITIAL_SEATING_TABLES;
    }
  });

  // Track currently active user RSVP (unlocks seating chart if attending)
  const [currentUserRsvp, setCurrentUserRsvp] = useState<RsvpEntry | null>(() => {
    try {
      const saved = localStorage.getItem('aeterna_current_user_rsvp');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // UI state
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState(getPageFromHash);

  // Check if first-time visitor to pop the envelope
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('aeterna_envelope_seen');
    if (!hasVisited) {
      setIsEnvelopeOpen(true);
      sessionStorage.setItem('aeterna_envelope_seen', 'true');
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aeterna_wedding_details_v5', JSON.stringify(details));
    } catch {}
  }, [details]);

  useEffect(() => {
    try {
      localStorage.setItem('aeterna_wedding_rsvps', JSON.stringify(rsvps));
    } catch {}
  }, [rsvps]);

  useEffect(() => {
    try {
      localStorage.setItem('aeterna_wedding_photos', JSON.stringify(photos));
    } catch {}
  }, [photos]);

  useEffect(() => {
    try {
      localStorage.setItem('aeterna_wedding_guestbook', JSON.stringify(guestbook));
    } catch {}
  }, [guestbook]);

  useEffect(() => {
    try {
      localStorage.setItem('aeterna_wedding_songs_v2', JSON.stringify(songs));
    } catch {}
  }, [songs]);

  useEffect(() => {
    try {
      localStorage.setItem('aeterna_seating_tables', JSON.stringify(tables));
    } catch {}
  }, [tables]);

  useEffect(() => {
    try {
      if (currentUserRsvp) {
        localStorage.setItem('aeterna_current_user_rsvp', JSON.stringify(currentUserRsvp));
      } else {
        localStorage.removeItem('aeterna_current_user_rsvp');
      }
    } catch {}
  }, [currentUserRsvp]);

  useEffect(() => {
    try {
      localStorage.setItem('aeterna_rsvp_submitted', String(hasSubmittedRsvp));
    } catch {}
  }, [hasSubmittedRsvp]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    try {
      localStorage.setItem('aeterna_theme', isDarkMode ? 'dark' : 'light');
    } catch {}
  }, [isDarkMode]);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveSection(getPageFromHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (hasSubmittedRsvp) return;

    try {
      if (sessionStorage.getItem('aeterna_rsvp_reminder_dismissed') === 'true') return;
    } catch {}

    const reminderTimer = window.setTimeout(() => setShowRsvpReminder(true), 60_000);
    return () => window.clearTimeout(reminderTimer);
  }, [hasSubmittedRsvp]);

  // Audio Toggle
  const handleToggleAudio = () => {
    const nextState = soundEngine.toggleMusic();
    setIsAudioPlaying(nextState);
  };

  // Handlers for dynamic actions
  const handleAddRsvp = (newRsvp: RsvpEntry) => {
    setRsvps((prev) => [newRsvp, ...prev]);
    setHasSubmittedRsvp(true);
    setShowRsvpReminder(false);

    // If accepting, set as current user so seating chart unlocks immediately
    if (newRsvp.attending === 'accepted') {
      setCurrentUserRsvp(newRsvp);

      // Dynamically add to Table 5 if not already seated
      setTables((prev) => {
        const alreadySeated = prev.some((t) =>
          t.guests.some((g) => g.name.toLowerCase() === newRsvp.fullName.toLowerCase())
        );
        if (alreadySeated) return prev;

        return prev.map((t, idx) => {
          if (idx === 4) { // Table 5: Tavolo Menaggio
            const newGuests = [{ name: newRsvp.fullName, role: 'Honored Guest', rsvpId: newRsvp.id }];
            if (newRsvp.guestNames && newRsvp.guestNames.length > 1) {
              newGuests.push({ name: newRsvp.guestNames[1], role: 'Plus-One Guest', rsvpId: newRsvp.id });
            }
            return {
              ...t,
              guests: [...t.guests, ...newGuests]
            };
          }
          return t;
        });
      });
    }

    // Also automatically add their personal note to the guestbook if they wrote one
    if (newRsvp.message && newRsvp.message.trim().length > 0) {
      const newGb: GuestbookEntry = {
        id: `gb-rsvp-${Date.now()}`,
        name: newRsvp.fullName,
        message: newRsvp.message.trim(),
        date: 'Today',
      };
      setGuestbook((prev) => [newGb, ...prev]);
    }

    // Also automatically queue their dance floor song request if specified
    if (newRsvp.songRequest && newRsvp.songRequest.trim().length > 0) {
      const rsvpSong: SongSuggestion = {
        id: `song-rsvp-${Date.now()}`,
        title: newRsvp.songRequest.trim(),
        artist: 'Guest Favorite',
        suggestedBy: newRsvp.fullName,
        genre: 'Reception Party',
        votes: 1,
        hasVoted: true,
        timestamp: 'Just now (via RSVP)'
      };
      setSongs((prev) => [rsvpSong, ...prev]);
    }
  };

  const handleDeleteRsvp = (id: string) => {
    setRsvps((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddPhoto = (newPhoto: WeddingPhoto) => {
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const handleLikePhoto = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isLiked = !p.isLikedByUser;
          return {
            ...p,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
            isLikedByUser: isLiked,
          };
        }
        return p;
      })
    );
  };

  const handleAddGuestbookEntry = (entry: GuestbookEntry) => {
    setGuestbook((prev) => [entry, ...prev]);
  };

  const handleAddSong = (newSong: SongSuggestion) => {
    setSongs((prev) => [newSong, ...prev]);
  };

  const handleVoteSong = (id: string) => {
    setSongs((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const hasVoted = !s.hasVoted;
          return {
            ...s,
            votes: hasVoted ? s.votes + 1 : Math.max(0, s.votes - 1),
            hasVoted,
          };
        }
        return s;
      })
    );
  };

  const navigateTo = (page: string) => {
    const nextPage = PAGE_IDS.includes(page as typeof PAGE_IDS[number]) ? page : 'couple';
    if (window.location.hash === `#/${nextPage}`) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.hash = `/${nextPage}`;
  };

  const dismissRsvpReminder = () => {
    setShowRsvpReminder(false);
    try {
      sessionStorage.setItem('aeterna_rsvp_reminder_dismissed', 'true');
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1F2421] paper-texture">
      
      {/* Top Navigation */}
      <Navbar
        onOpenEnvelope={() => setIsEnvelopeOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        activeSection={activeSection}
        onNavigate={navigateTo}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((current) => !current)}
      />

      {showRsvpReminder && (
        <aside
          className="fixed right-4 bottom-4 z-[60] w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-[#C85A17]/45 bg-[#0F5132]/95 p-4 text-white shadow-2xl backdrop-blur-xl animate-fade-in"
          role="status"
          aria-live="polite"
        >
          <button
            type="button"
            onClick={dismissRsvpReminder}
            className="absolute top-2.5 right-2.5 rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Dismiss RSVP reminder"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex gap-3 pr-5">
            <BellRing className="h-5 w-5 shrink-0 text-[#E06D28]" />
            <div>
              <p className="font-serif text-lg leading-tight">Have you RSVP’d?</p>
              <p className="mt-1 text-xs leading-relaxed text-white/80">Kindly let Kwadwo and Mary know if you will be joining the celebration.</p>
              <button
                type="button"
                onClick={() => {
                  dismissRsvpReminder();
                  navigateTo('rsvp');
                }}
                className="mt-3 rounded-lg bg-[#C85A17] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#A0420B] transition-colors"
              >
                RSVP now
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Main Wedding Content Flow */}
      <main className="flex-1" key={activeSection}>
        {activeSection === 'couple' && <HeroSection
          details={details}
          onOpenEnvelope={() => setIsEnvelopeOpen(true)}
          onScrollToRsvp={() => navigateTo('rsvp')}
          onScrollToVenue={() => navigateTo('venue')}
        />}

        {activeSection === 'schedule' && <ScheduleSection schedule={INITIAL_SCHEDULE} />}

        {activeSection === 'venue' && <VenueSection details={details} />}

        {activeSection === 'dress-code' && <DressCodeSection dressCode={details.dressCode} />}

        {activeSection === 'rsvp' && <RsvpSection
          onAddRsvp={handleAddRsvp}
          existingRsvps={rsvps}
        />}

        {activeSection === 'seating-chart' && <SeatingChartSection
          tables={tables}
          rsvps={rsvps}
          currentUserRsvp={currentUserRsvp}
          onConfirmUserAttendance={setCurrentUserRsvp}
          onScrollToRsvp={() => navigateTo('rsvp')}
        />}

        {activeSection === 'music-player' && <MusicPlayerSection
          songs={songs}
          onAddSong={handleAddSong}
          onVoteSong={handleVoteSong}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
        />}

        {activeSection === 'photos' && <LivePhotoStream
          photos={photos}
          onAddPhoto={handleAddPhoto}
          onLikePhoto={handleLikePhoto}
        />}

        {activeSection === 'guestbook' && <GuestbookSection
          entries={guestbook}
          onAddEntry={handleAddGuestbookEntry}
        />}

        {activeSection === 'faq' && <FaqRegistrySection faqs={INITIAL_FAQS} />}
      </main>

      {/* Footer */}
      <Footer details={details} />

      {/* Wax Seal Opening Modal Experience */}
      <EnvelopeModal
        isOpen={isEnvelopeOpen}
        onClose={() => setIsEnvelopeOpen(false)}
        coupleNames={details.coupleNames}
        partnerOne={details.partnerOne}
        partnerTwo={details.partnerTwo}
        weddingDate={details.date}
        venueName={details.ceremonyVenue.name}
        venueAddress={details.ceremonyVenue.address}
        onOpened={() => setIsAudioPlaying(true)}
      />

      {/* Couple Organizer & Guest Management Modal */}
      <OrganizerModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        rsvps={rsvps}
        details={details}
        suggestedSongs={songs}
        onUpdateDetails={setDetails}
        onDeleteRsvp={handleDeleteRsvp}
      />

    </div>
  );
}
