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

export default function App() {
  // State with localStorage persistence
  const [details, setDetails] = useState<WeddingDetails>(() => {
    try {
      const saved = localStorage.getItem('aeterna_wedding_details_v2');
      if (saved) return JSON.parse(saved);
      const v1 = localStorage.getItem('aeterna_wedding_details');
      if (v1) {
        const parsed = JSON.parse(v1);
        return { ...parsed, dressCode: INITIAL_WEDDING_DETAILS.dressCode };
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
      const saved = localStorage.getItem('aeterna_wedding_songs');
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
  const [activeSection, setActiveSection] = useState('hero');

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
      localStorage.setItem('aeterna_wedding_details_v2', JSON.stringify(details));
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
      localStorage.setItem('aeterna_wedding_songs', JSON.stringify(songs));
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

  // Audio Toggle
  const handleToggleAudio = () => {
    const nextState = soundEngine.toggleMusic();
    setIsAudioPlaying(nextState);
  };

  // Handlers for dynamic actions
  const handleAddRsvp = (newRsvp: RsvpEntry) => {
    setRsvps((prev) => [newRsvp, ...prev]);

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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
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
      />

      {/* Main Wedding Content Flow */}
      <main className="flex-1">
        <HeroSection
          details={details}
          onOpenEnvelope={() => setIsEnvelopeOpen(true)}
          onScrollToRsvp={() => scrollTo('rsvp')}
          onScrollToVenue={() => scrollTo('venue')}
        />

        <ScheduleSection schedule={INITIAL_SCHEDULE} />

        <VenueSection details={details} />

        <DressCodeSection dressCode={details.dressCode} />

        <RsvpSection
          onAddRsvp={handleAddRsvp}
          existingRsvps={rsvps}
        />

        <SeatingChartSection
          tables={tables}
          rsvps={rsvps}
          currentUserRsvp={currentUserRsvp}
          onConfirmUserAttendance={setCurrentUserRsvp}
          onScrollToRsvp={() => scrollTo('rsvp')}
        />

        <MusicPlayerSection
          songs={songs}
          onAddSong={handleAddSong}
          onVoteSong={handleVoteSong}
          isAudioPlaying={isAudioPlaying}
          onToggleAudio={handleToggleAudio}
        />

        <LivePhotoStream
          photos={photos}
          onAddPhoto={handleAddPhoto}
          onLikePhoto={handleLikePhoto}
        />

        <GuestbookSection
          entries={guestbook}
          onAddEntry={handleAddGuestbookEntry}
        />

        <FaqRegistrySection faqs={INITIAL_FAQS} />
      </main>

      {/* Footer */}
      <Footer hashtag={details.hashtag} />

      {/* Wax Seal Opening Modal Experience */}
      <EnvelopeModal
        isOpen={isEnvelopeOpen}
        onClose={() => setIsEnvelopeOpen(false)}
        coupleNames={details.coupleNames}
        weddingDate={details.date}
        venueName={details.ceremonyVenue.name}
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
