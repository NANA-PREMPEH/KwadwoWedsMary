import React, { useState } from 'react';
import { FaqItem } from '../types/wedding';
import { ChevronDown, Gift, Heart, Sparkles, Coffee, Plane, Home } from 'lucide-react';

interface FaqRegistrySectionProps {
  faqs: FaqItem[];
}

export const FaqRegistrySection: React.FC<FaqRegistrySectionProps> = ({ faqs }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [giftFundSuccess, setGiftFundSuccess] = useState<string | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const honeymoonExperiences = [
    {
      title: 'Romantic Sunset Riva Cruise',
      amount: '$150',
      desc: 'Private wooden boat glide across Lake Como at golden hour.',
      icon: Plane
    },
    {
      title: 'Tuscan Wine & Olive Oil Tasting',
      amount: '$100',
      desc: 'Tour of centuries-old vineyards and artisan cellar pairings.',
      icon: Coffee
    },
    {
      title: 'Future Home Architectural Library',
      amount: '$250',
      desc: 'Contributing to crafting our timeless family home and hearth.',
      icon: Home
    }
  ];

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* FAQ Part */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C85A17] font-semibold block mb-2 font-sans">
            Need to Know
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#0F5132] font-normal">
            Frequently Asked Questions
          </h2>
          <div className="flex items-center justify-center gap-1.5 my-4">
            <span className="w-8 h-0.5 bg-[#C85A17]" />
            <span className="w-2 h-2 rounded-full bg-[#0F5132]" />
            <span className="w-8 h-0.5 bg-[#C85A17]" />
          </div>
        </div>

        <div className="space-y-3.5 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="glass glass-hover rounded-2xl border border-[#0F5132]/20 hover:border-[#C85A17]/60 overflow-hidden transition-all shadow-xs backdrop-blur-xl"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-serif text-lg text-[#0F5132] font-semibold">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#C85A17] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#524438] font-sans leading-relaxed border-t border-[#0F5132]/10 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Registry & Honeymoon Wishing Well */}
      <div className="glass-strong backdrop-blur-2xl rounded-3xl border border-[#0F5132]/35 p-8 sm:p-12 shadow-2xl text-center ring-1 ring-[#C85A17]/30">
        <div className="w-14 h-14 glass border border-[#C85A17]/40 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0F5132] shadow-sm">
          <Gift className="w-6 h-6 text-[#C85A17]" />
        </div>

        <span className="text-[11px] uppercase tracking-[0.25em] text-[#C85A17] font-sans font-semibold block mb-1">
          Honeymoon & Future Well
        </span>
        <h3 className="font-serif text-3xl sm:text-4xl text-[#0F5132] mb-3 font-semibold">
          Our Registry & Wishing Well
        </h3>
        <p className="font-serif italic text-base text-[#524438] max-w-xl mx-auto mb-8">
          Having you make the journey to Italy to share our joy is the absolute greatest gift. If you wish to bless us with a token of affection, we have curated a few special experiences:
        </p>

        {giftFundSuccess && (
          <div className="mb-6 p-3 bg-emerald-50/90 border border-emerald-300 text-[#0F5132] font-medium text-xs rounded-xl max-w-md mx-auto font-sans">
            {giftFundSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {honeymoonExperiences.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <div
                key={idx}
                className="glass glass-hover p-5 rounded-2xl border border-[#0F5132]/20 hover:border-[#C85A17]/60 shadow-xs flex flex-col justify-between text-left transition-all backdrop-blur-xl"
              >
                <div>
                  <div className="w-9 h-9 rounded-xl glass border border-[#C85A17]/30 flex items-center justify-center text-[#0F5132] mb-3">
                    <Icon className="w-4 h-4 text-[#C85A17]" />
                  </div>
                  <h4 className="font-serif text-base text-[#0F5132] font-semibold leading-snug">
                    {exp.title}
                  </h4>
                  <p className="text-[11px] text-stone-600 font-sans mt-1">
                    {exp.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#C85A17]/15 flex items-center justify-between">
                  <span className="font-serif text-base font-bold text-[#0F5132]">{exp.amount}</span>
                  <button
                    onClick={() => {
                      setGiftFundSuccess(`Thank you so much! A note of pledge for "${exp.title}" was recorded.`);
                      setTimeout(() => setGiftFundSuccess(null), 4000);
                    }}
                    className="text-xs uppercase tracking-[0.16em] font-bold font-sans text-[#C85A17] hover:text-[#A0420B] cursor-pointer"
                  >
                    Gift Experience
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};
