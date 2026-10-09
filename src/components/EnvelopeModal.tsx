import React, { useState, useEffect } from 'react';
import { soundEngine } from '../utils/audio';
import { Sparkles, X, Music, ArrowRight, RotateCcw } from 'lucide-react';

interface EnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupleNames: string;
  partnerOne: string;
  partnerTwo: string;
  weddingDate: string;
  venueName: string;
  venueAddress: string;
  onOpened?: () => void;
}

export const EnvelopeModal: React.FC<EnvelopeModalProps> = ({
  isOpen,
  onClose,
  coupleNames,
  partnerOne,
  partnerTwo,
  weddingDate,
  venueName,
  venueAddress,
  onOpened
}) => {
  const [isBroken, setIsBroken] = useState(false);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);

  // Reset state when modal is opened afresh
  useEffect(() => {
    if (isOpen) {
      setIsBroken(false);
      setIsFullyRevealed(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const initials = coupleNames
    .split('&')
    .map((name) => name.trim().charAt(0))
    .filter(Boolean)
    .join(' & ');

  const handleBreakSeal = () => {
    if (isBroken) return;
    soundEngine.playWaxSealCrack();
    setIsBroken(true);
    
    // Play pleasant background sound
    soundEngine.toggleMusic(true);

    setTimeout(() => {
      setIsFullyRevealed(true);
      if (onOpened) onOpened();
    }, 900);
  };

  const handleResetSeal = () => {
    setIsBroken(false);
    setIsFullyRevealed(false);
  };

  const handleExplore = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[#1C2421]/95 via-[#161D1A]/95 to-[#111714]/95 backdrop-blur-md transition-all duration-700 select-none">
      
      {/* Top right close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-30 p-2.5 text-stone-300 hover:text-white transition-colors rounded-full bg-stone-900/60 hover:bg-stone-900/90 border border-stone-700/80 cursor-pointer shadow-lg"
        title="Close envelope"
        aria-label="Close envelope"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
        
        {/* Top Header Information matching reference */}
        <div className="text-center mb-5 transition-opacity duration-500">
          <p className="text-xs sm:text-[13px] uppercase tracking-[0.28em] text-[#E0D8CB] font-sans font-medium">
            {isBroken ? 'Wedding Invitation Unveiled' : 'Personal Invitation for Our Honored Guest'}
          </p>
          <p className="text-xs text-[#9B9284] font-sans mt-1.5">
            {isBroken ? 'Welcome to our celebration in Accra, Ghana' : 'Tap the wax seal to unveil the invitation'}
          </p>
        </div>

        {/* Envelope Outer Card Container matching Pinterest reference */}
        <div className="relative w-full aspect-[1.32/1] max-w-[520px] bg-[#FAF5EE] rounded-3xl shadow-[0_24px_50px_-12px_rgba(0,0,0,0.55)] border border-[#DFD4C2] overflow-hidden flex items-center justify-center">
          
          {/* Subtle paper grain texture */}
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#b8a68f_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />

          {/* Luxury Inset Dotted Stitching Border running along perimeter */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="14"
              y="14"
              width="calc(100% - 28px)"
              height="calc(100% - 28px)"
              rx="20"
              ry="20"
              fill="none"
              stroke="#D2C4AE"
              strokeWidth="2"
              strokeDasharray="4 8"
              strokeLinecap="round"
            />
          </svg>

          {/* Envelope Body Folds Background (Left, Right, Bottom triangular paper folds) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Bottom triangular flap fold */}
            <div
              className="absolute inset-0 bg-[#F2E8DB]"
              style={{
                clipPath: 'polygon(0% 100%, 100% 100%, 50% 56%)'
              }}
            />
            {/* Left diagonal fold */}
            <div
              className="absolute inset-0 bg-[#F6EFE4]"
              style={{
                clipPath: 'polygon(0% 0%, 0% 100%, 50% 56%)'
              }}
            />
            {/* Right diagonal fold */}
            <div
              className="absolute inset-0 bg-[#F4EDE2]"
              style={{
                clipPath: 'polygon(100% 0%, 100% 100%, 50% 56%)'
              }}
            />
          </div>

          {/* Unfolded Inside Invitation Card (slides out smoothly when unsealed) */}
          <div
            className={`absolute inset-x-5 inset-y-5 bg-white border-2 border-[#0F5132]/60 rounded-2xl shadow-xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-1000 ease-out z-20 ${
              isBroken
                ? 'scale-100 translate-y-0 opacity-100 ring-1 ring-[#C85A17]/30'
                : 'scale-95 translate-y-8 opacity-0 pointer-events-none'
            }`}
          >
            {/* Card Header Fleuron */}
            <div className="w-full flex items-center justify-center space-x-1.5 text-[#C85A17] text-[9px] sm:text-[10px] tracking-[0.22em] uppercase font-semibold font-sans shrink-0">
              <span>✦</span>
              <span>The Honour of Your Presence</span>
              <span>✦</span>
            </div>

            {/* Couple names & invitation copy */}
            <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center py-1.5 sm:py-2">
              <div className="font-script text-[clamp(1.25rem,3.6vw,2.35rem)] text-[#0F5132] leading-[1.05]">
                <span className="block whitespace-nowrap">{partnerOne}</span>
                <span className="block text-[#C85A17] text-[0.72em] leading-none my-0.5">&amp;</span>
                <span className="block whitespace-nowrap">{partnerTwo}</span>
              </div>
              <div className="w-12 h-px bg-[#C85A17] mx-auto my-2" />
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#C85A17] font-semibold font-sans">
                Request the pleasure of your company
              </p>
              <p className="text-[11px] sm:text-xs font-serif italic text-stone-600 mt-1">
                as they exchange their vows and unite in marriage
              </p>
            </div>

            {/* Wedding Date & Venue */}
            <div className="w-full shrink-0 border-t border-[#0F5132]/20 pt-2 text-center">
              <p className="font-serif text-sm sm:text-base font-semibold text-[#0F5132] tracking-wide">
                {weddingDate}
              </p>
              <p className="text-[10px] sm:text-xs text-[#C85A17] font-sans mt-0.5 tracking-wide font-medium">
                {venueName} · Accra, Ghana
              </p>
            </div>

            {/* Action buttons upon full reveal */}
            {isFullyRevealed && (
              <div className="mt-2 w-full flex flex-col sm:flex-row items-center gap-2 animate-fade-in shrink-0">
                <button
                  onClick={handleExplore}
                  className="w-full py-2 px-4 bg-[#0F5132] hover:bg-[#082E1D] text-white text-xs uppercase tracking-[0.2em] font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg group cursor-pointer border border-[#C85A17]/40"
                >
                  <span>Enter Celebration Suite</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#E06D28]" />
                </button>
                <button
                  onClick={handleResetSeal}
                  className="py-2 px-3 bg-[#FAF5EE] hover:bg-stone-200 text-[#0F5132] text-xs uppercase tracking-wider font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-[#DFD4C2] cursor-pointer"
                  title="Seal envelope again"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#C85A17]" />
                  <span className="hidden sm:inline">Re-seal</span>
                </button>
              </div>
            )}
          </div>

          {/* Sealed Envelope Top Flap & Wax Seal Experience (When sealed) */}
          {!isBroken && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              
              {/* Top Triangular Flap Shape with soft drop shadow */}
              <div
                className="absolute inset-0 bg-gradient-to-b from-[#F9F3EA] via-[#F5ECE0] to-[#ECE1D0]"
                style={{
                  clipPath: 'polygon(0% 0%, 100% 0%, 50% 58%)',
                  filter: 'drop-shadow(0px 8px 14px rgba(74, 59, 44, 0.14))'
                }}
              />

              {/* Envelope Flap Header Typography: Couple Names & Venue */}
              <div className="absolute top-[18%] sm:top-[20%] inset-x-4 text-center z-20 pointer-events-none">
                <div className="font-serif italic text-[#0F5132] text-sm sm:text-base font-semibold tracking-wide leading-tight">
                  {coupleNames}
                </div>
                <div className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#C85A17] font-semibold mt-1">
                  {venueName} · {venueAddress}
                </div>
              </div>

              {/* Center Wax Seal Area with Warm Burnt Orange Ambient Glow */}
              <div className="relative z-20 flex flex-col items-center justify-center mt-12 sm:mt-14">
                
                {/* Diffuse warm Burnt Orange radial glow behind seal matching reference */}
                <div
                  className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full pointer-events-none transition-all duration-700 -translate-y-4"
                  style={{
                    background: 'radial-gradient(circle, rgba(200, 90, 23, 0.38) 0%, rgba(200, 90, 23, 0.14) 45%, transparent 72%)'
                  }}
                />

                {/* Wax Seal Interactive Button */}
                <button
                  onClick={handleBreakSeal}
                  className="group relative cursor-pointer focus:outline-none flex flex-col items-center"
                  aria-label="Tap wax seal to open invitation"
                >
                  {/* Wax Seal Disc */}
                  <div className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#082E1D] via-[#0F5132] to-[#166640] border-[2.5px] sm:border-[3px] border-[#C85A17] shadow-[0_14px_28px_rgba(15,81,50,0.35),_0_6px_10px_rgba(0,0,0,0.22)] flex flex-col items-center justify-center transform transition-transform duration-300 group-hover:scale-105 active:scale-95">
                    
                    {/* Inner delicate dashed ring */}
                    <div className="w-[72%] h-[72%] rounded-full border border-dashed border-white/60 flex items-center justify-center shadow-inner">
                      {/* Serif Monogram Initials */}
                      <span className="font-serif font-bold text-xl sm:text-2xl text-white tracking-widest drop-shadow-sm select-none">
                        {initials}
                      </span>
                    </div>

                    {/* Organic Melted Wax Drops (matching image reference at ~2 o'clock and ~8 o'clock) */}
                    <div className="absolute -top-1.5 -right-1 w-3.5 h-3.5 rounded-full bg-[#0F5132] border border-[#082E1D] shadow-xs" />
                    <div className="absolute -bottom-1.5 -left-1 w-3.5 h-3.5 rounded-full bg-[#082E1D] border border-[#051F13] shadow-xs" />
                  </div>

                  {/* Action prompt beneath seal matching image: ✨ TAP SEAL TO OPEN */}
                  <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#0F5132] group-hover:text-[#C85A17] transition-colors">
                    <Sparkles className="w-3.5 h-3.5 text-[#C85A17] animate-pulse" />
                    <span>TAP SEAL TO OPEN</span>
                  </div>
                </button>

              </div>

            </div>
          )}

        </div>

        {/* Bottom Audio Note matching reference */}
        <div className="mt-5 flex items-center gap-2 text-[#9B9284] text-xs font-sans">
          <Music className="w-3.5 h-3.5 text-[#C85A17]" />
          <span>Includes romantic ambient audio & interactive features</span>
        </div>

      </div>
    </div>
  );
};
