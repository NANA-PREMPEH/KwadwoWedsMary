import React, { useState } from 'react';
import { Volume2, VolumeX, Mail, Heart, Camera, Calendar, MapPin, ShieldCheck, Menu, X, Moon, Sun } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import monogramLogo from '../assets/kwadwo-mary-monogram.png';

interface NavbarProps {
  onOpenEnvelope: () => void;
  onOpenAdmin: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  activeSection: string;
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenEnvelope,
  onOpenAdmin,
  isAudioPlaying,
  onToggleAudio,
  activeSection,
  onNavigate,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateTo = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const navItems = [
    { label: 'The Couple', id: 'couple' },
    { label: 'Schedule', id: 'schedule' },
    { label: 'Venue & Travel', id: 'venue' },
    { label: 'Dress Code', id: 'dress-code' },
    { label: 'RSVP', id: 'rsvp' },
    { label: 'Seating Chart', id: 'seating-chart' },
    { label: 'Music', id: 'music-player' },
    { label: 'Live Photos', id: 'photos' },
    { label: 'Wishes', id: 'guestbook' },
    { label: 'FAQ & Registry', id: 'faq' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/80 backdrop-blur-xl border-b border-[#C85A17]/20 shadow-[0_4px_30px_rgba(15,81,50,0.04)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Monogram */}
          <button 
            onClick={() => navigateTo('couple')} 
            className="flex shrink-0 items-center gap-2 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 shrink-0 overflow-hidden rounded-full bg-[#063b2b] border border-[#C85A17]/60 flex items-center justify-center group-hover:border-[#E7C56A] transition-all shadow-sm">
              <img
                src={monogramLogo}
                alt="Kwadwo and Mary monogram"
                className="w-full h-full scale-[1.65] object-contain transition-transform duration-300 group-hover:scale-[1.78]"
              />
            </div>
            <div className="min-w-[118px]">
              <span className="block whitespace-nowrap font-serif text-lg text-[#2c2724] leading-tight">
                Kwadwo & Mary
              </span>
              <span className="block whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-[#C85A17] font-semibold font-sans">
                Nov 14, 2026 · Accra
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden 2xl:flex items-center space-x-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`whitespace-nowrap text-xs uppercase tracking-[0.2em] font-sans font-medium transition-colors hover:text-[#C85A17] cursor-pointer ${
                  activeSection === item.id ? 'text-[#0F5132] font-bold underline decoration-[#C85A17] decoration-2 underline-offset-8' : 'text-[#5c5249]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action buttons (Music, Envelope, Admin, RSVP) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-full glass glass-hover border border-[#C85A17]/25 text-stone-700 hover:text-[#C85A17] transition-colors cursor-pointer"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              className={`hidden sm:flex p-2.5 rounded-full glass glass-hover transition-all cursor-pointer items-center gap-2 ${
                isAudioPlaying 
                  ? 'border-[#0F5132] bg-[#f4f8f5]/80 text-[#0F5132] shadow-[0_0_15px_rgba(15,81,50,0.15)]' 
                  : 'border-[#C85A17]/25 text-stone-600 hover:text-stone-900'
              }`}
              title={isAudioPlaying ? 'Mute romantic ambient music' : 'Play romantic ambient music'}
              aria-label="Toggle ambient music"
            >
              {isAudioPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#0F5132] animate-pulse" />
                  <span className="hidden sm:inline text-[11px] font-sans font-semibold text-[#0F5132]">
                    Music Playing
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline text-[11px] font-sans text-stone-500">
                    Play Music
                  </span>
                </>
              )}
            </button>

            {/* Replay Envelope */}
            <button
              onClick={onOpenEnvelope}
              className="hidden sm:flex p-2.5 rounded-full glass glass-hover border border-[#C85A17]/25 text-stone-700 hover:text-[#C85A17] transition-colors cursor-pointer"
              title="View Envelope & Wax Seal"
              aria-label="Open wax seal envelope"
            >
              <Mail className="w-4 h-4" />
            </button>

            {/* Couple/Admin Toggle */}
            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex p-2.5 rounded-full glass glass-hover border border-[#C85A17]/25 text-stone-700 hover:text-[#0F5132] transition-colors cursor-pointer"
              title="Couple's Organizer & Guest Dashboard"
              aria-label="Couple organizer dashboard"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Quick RSVP CTA */}
            <button
              onClick={() => navigateTo('rsvp')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-[#0F5132] hover:bg-[#0b3d26] text-white text-xs uppercase tracking-[0.2em] font-sans font-semibold rounded-lg transition-all cursor-pointer shadow-sm hover:shadow-md border border-[#C85A17]/35"
            >
              RSVP
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="2xl:hidden p-2 rounded-lg glass border border-[#C85A17]/30 text-stone-700 hover:text-[#C85A17] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="2xl:hidden border-t border-[#C85A17]/20 glass-strong backdrop-blur-2xl px-5 py-4 space-y-3 animate-fade-in shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#C85A17]/15">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className="text-left py-2 px-2 text-xs uppercase tracking-[0.16em] text-[#423a32] hover:text-[#C85A17] font-medium transition-colors font-sans"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => navigateTo('rsvp')}
              className="w-full py-2.5 bg-[#0F5132] hover:bg-[#082E1D] text-white text-xs uppercase tracking-[0.2em] rounded-lg text-center font-medium font-sans border border-[#C85A17]/30 shadow-md"
            >
              Respond to RSVP
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenEnvelope(); }}
              className="w-full py-2 glass border border-[#C85A17]/30 text-[#423a32] hover:text-[#C85A17] text-xs uppercase tracking-[0.18em] rounded-lg text-center flex items-center justify-center gap-2 font-sans font-medium"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>View Wax Seal Envelope</span>
            </button>
            <button
              onClick={onToggleAudio}
              className="sm:hidden w-full py-2 glass border border-[#C85A17]/30 text-[#423a32] hover:text-[#C85A17] text-xs uppercase tracking-[0.18em] rounded-lg text-center flex items-center justify-center gap-2 font-sans font-medium"
            >
              {isAudioPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{isAudioPlaying ? 'Pause Music' : 'Play Music'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
