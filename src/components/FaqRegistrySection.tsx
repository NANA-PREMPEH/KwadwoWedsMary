import React, { useState } from 'react';
import { FaqItem } from '../types/wedding';
import { ChevronDown } from 'lucide-react';

interface FaqRegistrySectionProps {
  faqs: FaqItem[];
}

export const FaqRegistrySection: React.FC<FaqRegistrySectionProps> = ({ faqs }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* FAQ Part */}
      <div>
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

    </section>
  );
};
