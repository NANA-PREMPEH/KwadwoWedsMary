import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  hashtag: string;
}

export const Footer: React.FC<FooterProps> = ({ hashtag }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#082E1D] text-[#E7EFEA] py-14 px-4 sm:px-6 lg:px-8 border-t-2 border-t-[#C85A17]">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        {/* Monogram */}
        <div className="w-12 h-12 rounded-full glass-emerald border border-[#C85A17]/50 flex items-center justify-center mx-auto text-white font-serif text-base tracking-widest shadow-lg">
          J & E
        </div>

        <div>
          <h4 className="font-serif text-2xl text-white font-medium">
            Julian Vance & Eleanor St. Claire
          </h4>
          <p className="text-xs uppercase tracking-[0.25em] text-[#E06D28] mt-1 font-sans font-semibold">
            September 19, 2026 · Villa Bellissima · Lake Como, Italy
          </p>
        </div>

        {/* Wedding Hashtag */}
        <div className="inline-block px-5 py-1.5 rounded-full glass border border-[#C85A17]/40 text-[#E06D28] text-xs font-mono font-bold tracking-wide shadow-sm">
          {hashtag}
        </div>

        <p className="font-serif italic text-sm text-[#B4D0C2] max-w-md mx-auto">
          "With love and boundless gratitude for your presence in our journey."
        </p>

        <div className="pt-6 border-t border-[#134E35] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8AAFA0] font-sans">
          <span>Aeterna Wedding Experience · Emerald Green, Burnt Orange & White Theme</span>
          
          <button
            onClick={scrollToTop}
            className="mt-3 sm:mt-0 flex items-center gap-1.5 glass glass-hover px-3 py-1 rounded-full border border-[#C85A17]/30 hover:text-white transition-all cursor-pointer text-[#E06D28] font-medium"
          >
            <span>Return to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
