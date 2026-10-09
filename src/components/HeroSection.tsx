import React from 'react';
import { WeddingDetails } from '../types/wedding';
import { CountdownTimer } from './CountdownTimer';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { Calendar, MapPin, Heart, Mail, Share2, Check } from 'lucide-react';

interface HeroSectionProps {
  details: WeddingDetails;
  onOpenEnvelope: () => void;
  onScrollToRsvp: () => void;
  onScrollToVenue: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  details,
  onOpenEnvelope,
  onScrollToRsvp,
  onScrollToVenue,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${details.coupleNames} Wedding Invitation`,
        text: `You're invited to celebrate the wedding of ${details.coupleNames} on ${details.date} at Lake Como!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToCalendar = () => {
    // 2026-09-19 15:30 to 2026-09-20 02:00
    const calEvent = {
      title: `${details.coupleNames} Wedding Celebration`,
      description: `Ceremony & Reception for ${details.coupleNames} at ${details.ceremonyVenue.name}. Dress code: ${details.dressCode.theme}.`,
      location: details.ceremonyVenue.address,
      startDateIso: '20260919T133000Z',
      endDateIso: '20260920T010000Z',
    };
    downloadIcsFile(calEvent);
  };

  return (
    <section id="hero" className="relative pt-6 pb-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background soft ambient ornamentals */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#eaddc7]/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        
        {/* Top Kicker & Color Indicator */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 glass rounded-full border border-[#C85A17]/30 shadow-xs mb-5">
          <div className="flex items-center -space-x-1">
            <span className="w-3 h-3 rounded-full bg-[#C85A17] ring-1 ring-white" title="Burnt Orange" />
            <span className="w-3 h-3 rounded-full bg-[#0F5132] ring-1 ring-white" title="Emerald Green" />
            <span className="w-3 h-3 rounded-full bg-white border border-stone-300 ring-1 ring-white" title="Crisp White" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] font-sans font-semibold text-[#2c241d]">
            Palette: Burnt Orange · Emerald Green · White
          </span>
        </div>

        {/* Couple Names Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-[#2b241e] tracking-tight leading-[1.15] mb-4">
          <span className="block sm:inline">{details.partnerOne}</span>
          <span className="block sm:inline font-script text-3xl sm:text-5xl md:text-6xl text-[#C85A17] mx-3 my-1 sm:my-0">
            &
          </span>
          <span className="block sm:inline">{details.partnerTwo}</span>
        </h1>

        <p className="font-serif italic text-lg sm:text-xl text-[#3D322A] max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          "Two souls, one path, bound in timeless devotion overlooking the sapphire waters of Lake Como."
        </p>

        {/* Hero Imagery Card with Arch */}
        <div className="relative max-w-2xl mx-auto my-8">
          <div className="relative rounded-t-[130px] rounded-b-3xl overflow-hidden shadow-2xl border-4 border-white/95 bg-stone-200 aspect-[16/10] ring-1 ring-[#C85A17]/30">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85"
              alt="Julian and Eleanor at Lake Como"
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            />
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            
            <div className="absolute bottom-5 inset-x-5 flex items-center justify-between text-white text-xs sm:text-sm">
              <span className="font-serif italic tracking-wider drop-shadow-md text-stone-100">
                Villa Bellissima · Tremezzina
              </span>
              <span className="font-sans tracking-[0.25em] uppercase text-[11px] font-semibold bg-black/40 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/30 shadow-sm">
                19 · IX · MMXXVI
              </span>
            </div>
          </div>

          {/* Quick Floating Action: Wax Seal badge */}
          <button
            onClick={onOpenEnvelope}
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 inline-flex items-center gap-2.5 glass glass-hover text-[#2c241d] border border-[#C85A17]/40 px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="w-4 h-4 rounded-full bg-[#0F5132] flex items-center justify-center text-[9px] text-white font-serif shadow-xs">
              ✦
            </div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold font-sans text-stone-900 group-hover:text-[#C85A17] transition-colors">
              Open Wax Seal Letter
            </span>
          </button>
        </div>

        {/* Prominent Live Countdown Timer Tracking Days, Hours, and Minutes */}
        <div className="mt-10">
          <CountdownTimer targetDate={details.targetDateTime} />
        </div>

        {/* Date and Venue summary */}
        <div className="mt-4 max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-5 glass glass-hover rounded-2xl border border-[#0F5132]/25 shadow-xs">
            <div className="flex items-center gap-2 text-[#0F5132] text-xs font-bold uppercase tracking-[0.2em] mb-1.5 font-sans">
              <Calendar className="w-4 h-4 text-[#0F5132]" />
              <span>When</span>
            </div>
            <p className="font-serif text-lg text-[#2c241d] font-semibold">
              {details.date}
            </p>
            <p className="text-xs text-stone-600 mt-0.5 font-sans">
              Ceremony commences at 16:30
            </p>
          </div>

          <div className="p-5 glass glass-hover rounded-2xl border border-[#C85A17]/30 shadow-xs">
            <div className="flex items-center gap-2 text-[#C85A17] text-xs font-bold uppercase tracking-[0.2em] mb-1.5 font-sans">
              <MapPin className="w-4 h-4 text-[#C85A17]" />
              <span>Where</span>
            </div>
            <p className="font-serif text-lg text-[#2c241d] font-semibold">
              {details.ceremonyVenue.name}
            </p>
            <p className="text-xs text-stone-600 mt-0.5 font-sans">
              {details.ceremonyVenue.city}, Italy
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
          <button
            onClick={onScrollToRsvp}
            className="px-7 py-3.5 bg-[#0F5132] hover:bg-[#082E1D] text-white text-xs uppercase tracking-[0.22em] font-semibold font-sans rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer border border-[#C85A17]/40 hover:-translate-y-0.5"
          >
            Joyfully RSVP Now
          </button>

          <button
            onClick={handleAddToCalendar}
            className="px-5 py-3.5 glass glass-hover text-[#2c241d] border border-[#C85A17]/30 text-xs uppercase tracking-[0.18em] font-semibold font-sans rounded-xl shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#C85A17]" />
            <span>Add to Calendar (.ics)</span>
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-3.5 glass glass-hover text-[#2c241d] border border-[#C85A17]/30 text-xs uppercase tracking-[0.18em] font-semibold font-sans rounded-xl shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5"
            title="Share invitation link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-stone-500" />}
            <span className="font-sans">{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>

      </div>
    </section>
  );
};
