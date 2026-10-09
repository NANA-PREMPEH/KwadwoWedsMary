import React from 'react';
import { WeddingDetails } from '../types/wedding';
import { Sparkles, CheckCircle2, AlertCircle, Palette } from 'lucide-react';

interface DressCodeSectionProps {
  dressCode: WeddingDetails['dressCode'];
}

export const DressCodeSection: React.FC<DressCodeSectionProps> = ({ dressCode }) => {
  return (
    <section id="dress-code" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f5efe6]/40 border-y border-[#ebdcc9]">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[#C85A17] font-semibold mb-2 font-sans">
            <Palette className="w-3.5 h-3.5" />
            <span>The Wedding Colors</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#0F5132] font-normal">
            Burnt Orange, Emerald Green & White
          </h2>
          <div className="flex items-center justify-center gap-2 my-4">
            <span className="w-8 h-1 bg-[#C85A17] rounded-full" />
            <span className="w-8 h-1 bg-[#0F5132] rounded-full" />
            <span className="w-8 h-1 bg-white border border-stone-300 rounded-full" />
          </div>
          <p className="font-serif italic text-base text-[#5c4a3b] max-w-xl mx-auto">
            {dressCode.description}
          </p>
        </div>

        {/* Highlighted Color Trio Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="glass glass-hover p-6 rounded-2xl border border-[#C85A17]/35 shadow-sm flex flex-col items-center text-center backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-[#C85A17] shadow-md mb-3 ring-4 ring-[#C85A17]/20 flex items-center justify-center text-white font-serif text-sm">
              ✦
            </div>
            <h4 className="font-serif text-lg text-[#2c241d] font-semibold">Burnt Orange</h4>
            <span className="text-[11px] font-mono text-[#C85A17] font-semibold">#C85A17</span>
            <p className="text-xs text-stone-600 font-sans mt-2">
              Evoking Lake Como’s warm sunset glow, terracotta tiles, and autumn warmth.
            </p>
          </div>

          <div className="glass glass-hover p-6 rounded-2xl border border-[#0F5132]/35 shadow-sm flex flex-col items-center text-center backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-[#0F5132] shadow-md mb-3 ring-4 ring-[#0F5132]/20 flex items-center justify-center text-white font-serif text-sm">
              ✦
            </div>
            <h4 className="font-serif text-lg text-[#2c241d] font-semibold">Emerald Green</h4>
            <span className="text-[11px] font-mono text-[#0F5132] font-semibold">#0F5132</span>
            <p className="text-xs text-stone-600 font-sans mt-2">
              Reflecting historic cypress trees, botanical estate gardens, and regal serenity.
            </p>
          </div>

          <div className="glass glass-hover p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col items-center text-center backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-stone-300 shadow-md mb-3 ring-4 ring-stone-100 flex items-center justify-center text-stone-600 font-serif text-sm">
              ✦
            </div>
            <h4 className="font-serif text-lg text-[#2c241d] font-semibold">Crisp White</h4>
            <span className="text-[11px] font-mono text-stone-500 font-semibold">#FFFFFF</span>
            <p className="text-xs text-stone-600 font-sans mt-2">
              Timeless elegance, pristine florals, tailored shirts, and luminous marble colonnades.
            </p>
          </div>
        </div>

        {/* Two-column Attire Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 glass glass-hover rounded-2xl border-t-4 border-t-[#0F5132] border border-[#0F5132]/25 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#0F5132]" />
              <h4 className="font-serif text-xl text-[#0F5132] font-semibold">For Gentlemen</h4>
            </div>
            <ul className="space-y-3 text-xs text-[#5e5146] font-sans">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0F5132] mt-0.5 shrink-0" />
                <span>Smartly tailored kaftans, agbada, or formal African-print attire</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C85A17] mt-0.5 shrink-0" />
                <span>Kente cloth or rich Ankara accents are warmly welcomed</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                <span>Traditional smocks, shirts, or neatly tailored trousers are all suitable</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0F5132] mt-0.5 shrink-0" />
                <span>Complete your look with clean formal shoes or traditional sandals</span>
              </li>
            </ul>
          </div>

          <div className="p-6 glass glass-hover rounded-2xl border-t-4 border-t-[#C85A17] border border-[#C85A17]/25 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#C85A17]" />
              <h4 className="font-serif text-xl text-[#C85A17] font-semibold">For Ladies</h4>
            </div>
            <ul className="space-y-3 text-xs text-[#5e5146] font-sans">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0F5132] mt-0.5 shrink-0" />
                <span>Elegant Kente, lace, or Ankara dresses are warmly welcomed</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C85A17] mt-0.5 shrink-0" />
                <span>Celebrate in vibrant Ghanaian colours and beautiful African prints</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                <span>Gele headwraps, beads, and tasteful traditional accessories are encouraged</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C85A17] mt-0.5 shrink-0" />
                <span>We kindly remind guests that full-white attire is reserved for the bride</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Note on Footwear */}
        <div className="mt-6 p-4 rounded-xl glass border border-[#C85A17]/30 flex items-start gap-3 shadow-xs backdrop-blur-xl">
          <AlertCircle className="w-4 h-4 text-[#C85A17] shrink-0 mt-0.5" />
          <p className="text-xs text-[#524438] font-sans">
            <strong>Venue Advisory:</strong> The celebration will be held at Idyllic Moments Guest House. Please choose comfortable footwear suitable for the venue and the day’s celebrations.
          </p>
        </div>

      </div>
    </section>
  );
};
