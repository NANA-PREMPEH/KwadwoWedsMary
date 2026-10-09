import React, { useState } from 'react';
import { Volume2, VolumeX, Mail, Heart, Camera, Calendar, MapPin, ShieldCheck, Menu, X } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface NavbarProps {
  onOpenEnvelope: () => void;
  onOpenAdmin: () => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenEnvelope,
  onOpenAdmin,
  isAudioPlaying,
  onToggleAudio,
  activeSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
            onClick={() => scrollTo('hero')} 
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full glass glass-hover border border-[#C85A17]/35 flex items-center justify-center group-hover:border-[#C85A17] transition-all shadow-sm">
              <span className="font-serif text-sm font-bold tracking-wider text-[#0F5132] group-hover:text-[#C85A17]">
                J & E
              </span>
            </div>
            <div>
              <span className="block font-serif text-lg text-[#2c2724] leading-tight">
                Julian & Eleanor
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#C85A17] font-semibold font-sans">
                Sept 19, 2026 · Como
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-xs uppercase tracking-[0.2em] font-sans font-medium transition-colors hover:text-[#C85A17] cursor-pointer ${
                  activeSection === item.id ? 'text-[#0F5132] font-bold underline decoration-[#C85A17] decoration-2 underline-offset-8' : 'text-[#5c5249]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action buttons (Music, Envelope, Admin, RSVP) */}
          <div className="flex items-center space-x-3">
            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              className={`p-2.5 rounded-full glass glass-hover transition-all cursor-pointer flex items-center gap-2 ${
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
              className="p-2.5 rounded-full glass glass-hover border border-[#C85A17]/25 text-stone-700 hover:text-[#C85A17] transition-colors cursor-pointer"
              title="View Envelope & Wax Seal"
              aria-label="Open wax seal envelope"
            >
              <Mail className="w-4 h-4" />
            </button>

            {/* Couple/Admin Toggle */}
            <button
              onClick={onOpenAdmin}
              className="p-2.5 rounded-full glass glass-hover border border-[#C85A17]/25 text-stone-700 hover:text-[#0F5132] transition-colors cursor-pointer"
              title="Couple's Organizer & Guest Dashboard"
              aria-label="Couple organizer dashboard"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            {/* Quick RSVP CTA */}
            <button
              onClick={() => scrollTo('rsvp')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-[#0F5132] hover:bg-[#0b3d26] text-white text-xs uppercase tracking-[0.2em] font-sans font-semibold rounded-lg transition-all cursor-pointer shadow-sm hover:shadow-md border border-[#C85A17]/35"
            >
              RSVP
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg glass border border-[#C85A17]/30 text-stone-700 hover:text-[#C85A17] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#C85A17]/20 glass-strong backdrop-blur-2xl px-5 py-4 space-y-3 animate-fade-in shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#C85A17]/15">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-left py-2 px-2 text-xs uppercase tracking-[0.16em] text-[#423a32] hover:text-[#C85A17] font-medium transition-colors font-sans"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); scrollTo('rsvp'); }}
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
          </div>
        </div>
      )}
    </header>
  );
};
