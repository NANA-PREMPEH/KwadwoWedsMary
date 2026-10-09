import React, { useState } from 'react';
import { GuestbookEntry } from '../types/wedding';
import { soundEngine } from '../utils/audio';
import { Heart, Send, MessageCircle, Feather } from 'lucide-react';

interface GuestbookSectionProps {
  entries: GuestbookEntry[];
  onAddEntry: (entry: GuestbookEntry) => void;
}

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  entries,
  onAddEntry
}) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      date: 'Just now',
    };

    onAddEntry(newEntry);
    soundEngine.playNote(523.25, 0.7, 0.2, 'sine');

    setName('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <section id="guestbook" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FDFBF7] border-y border-[#0F5132]/15">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[#C85A17] font-semibold mb-2 font-sans">
            <Feather className="w-3.5 h-3.5" />
            <span>Loving Words</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#0F5132] font-normal">
            The Digital Guestbook
          </h2>
          <div className="flex items-center justify-center gap-1.5 my-4">
            <span className="w-8 h-0.5 bg-[#C85A17]" />
            <span className="w-2 h-2 rounded-full bg-[#0F5132]" />
            <span className="w-8 h-0.5 bg-[#C85A17]" />
          </div>
          <p className="font-serif italic text-base text-[#524438] max-w-lg mx-auto">
            Leave a note of love, wisdom, or celebratory cheer that Julian and Eleanor will treasure forever.
          </p>
        </div>

        {/* Message Input Form */}
        <div className="glass-strong backdrop-blur-2xl rounded-3xl border border-[#C85A17]/30 p-6 sm:p-8 shadow-xl max-w-2xl mx-auto mb-14 ring-1 ring-[#0F5132]/15">
          <h3 className="font-serif text-xl text-[#0F5132] mb-4 text-center font-semibold">
            Inscribe the Guestbook
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#5c4e42] mb-1 font-sans">
                Your Name / Family
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aunt Beatrice & Uncle Roberto"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-[#2b241e]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#5c4e42] mb-1 font-sans">
                Your Wish or Memory
              </label>
              <textarea
                rows={3}
                required
                placeholder="Write your blessings for the newlyweds..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-[#2b241e]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#0F5132] hover:bg-[#082E1D] text-white text-xs uppercase tracking-[0.22em] font-semibold font-sans rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#C85A17]/40"
            >
              <Send className="w-3.5 h-3.5 text-[#E06D28]" />
              <span>Inscribe in Guestbook</span>
            </button>
          </form>
        </div>

        {/* Guestbook Entries Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="glass glass-hover p-6 rounded-2xl border border-[#0F5132]/20 hover:border-[#C85A17]/60 shadow-xs flex flex-col justify-between hover:shadow-lg transition-all relative backdrop-blur-xl"
            >
              <div className="mb-4">
                <span className="text-[#C85A17]/50 font-serif text-3xl leading-none">“</span>
                <p className="font-serif italic text-base sm:text-lg text-[#2c241d] -mt-2 leading-relaxed">
                  {entry.message}
                </p>
              </div>

              <div className="pt-3 border-t border-[#C85A17]/15 flex items-center justify-between text-xs font-sans">
                <span className="font-semibold text-[#0F5132] tracking-wide">
                  {entry.name}
                </span>
                <span className="text-stone-400">
                  {entry.date}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
