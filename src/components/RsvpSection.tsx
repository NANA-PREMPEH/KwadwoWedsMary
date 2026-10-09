import React, { useState } from 'react';
import { RsvpEntry } from '../types/wedding';
import { launchWeddingConfetti } from '../utils/confetti';
import { soundEngine } from '../utils/audio';
import { CheckCircle2, Heart, Music, Utensils, Send, Edit3, Printer, Sparkles, User, Mail, Phone } from 'lucide-react';

interface RsvpSectionProps {
  onAddRsvp: (entry: RsvpEntry) => void;
  existingRsvps: RsvpEntry[];
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({ onAddRsvp, existingRsvps }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<'accepted' | 'declined'>('accepted');
  const [partySize, setPartySize] = useState<number>(1);
  const [plusOneName, setPlusOneName] = useState('');
  const [dietary, setDietary] = useState<string[]>(['No Preference']);
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [songRequest, setSongRequest] = useState('');
  const [message, setMessage] = useState('');
  
  const [submittedEntry, setSubmittedEntry] = useState<RsvpEntry | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const dietaryOptions = [
    'No Preference',
    'Jollof Rice',
    'Waakye',
    'Fufu & Light Soup',
    'Banku & Tilapia',
    'Kenkey & Fish',
    'Vegetarian Ghanaian Meal',
    'Special Dietary Needs'
  ];

  const handleToggleDietary = (opt: string) => {
    if (opt === 'No Preference') {
      setDietary(['No Preference']);
      return;
    }

    const filtered = dietary.filter((d) => d !== 'No Preference');
    if (filtered.includes(opt)) {
      const next = filtered.filter((d) => d !== opt);
      setDietary(next.length === 0 ? ['No Preference'] : next);
    } else {
      setDietary([...filtered, opt]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setErrorMsg('');

    const newEntry: RsvpEntry = {
      id: `rsvp-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      attending,
      partySize: attending === 'accepted' ? partySize : 0,
      guestNames: attending === 'accepted' 
        ? (partySize > 1 && plusOneName.trim() ? [fullName.trim(), plusOneName.trim()] : [fullName.trim()])
        : [],
      dietaryRestrictions: attending === 'accepted' ? dietary : [],
      dietaryNotes: dietaryNotes.trim() || undefined,
      songRequest: songRequest.trim() || undefined,
      message: message.trim() || undefined,
      submittedAt: new Date().toISOString(),
    };

    onAddRsvp(newEntry);
    setSubmittedEntry(newEntry);

    // Audio chime & confetti
    soundEngine.playNote(523.25, 1.2, 0.3, 'sine');
    setTimeout(() => soundEngine.playNote(659.25, 1.5, 0.35, 'sine'), 100);
    setTimeout(() => soundEngine.playNote(783.99, 2.0, 0.4, 'sine'), 220);
    launchWeddingConfetti();
  };

  const handleResetForNewResponse = () => {
    setSubmittedEntry(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setAttending('accepted');
    setPartySize(1);
    setPlusOneName('');
    setDietary(['No Preference']);
    setDietaryNotes('');
    setSongRequest('');
    setMessage('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="rsvp" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C85A17] font-semibold block mb-2 font-sans">
          Kindly Respond
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#0F5132] font-normal">
          RSVP & Celebratory Wishes
        </h2>
        <div className="flex items-center justify-center gap-1.5 my-4">
          <span className="w-8 h-0.5 bg-[#C85A17]" />
          <span className="w-2 h-2 rounded-full bg-[#0F5132]" />
          <span className="w-8 h-0.5 bg-[#C85A17]" />
        </div>
        <p className="font-serif italic text-base text-[#6b5847] max-w-lg mx-auto">
          Please let us know if you will celebrate with us by August 1st, 2026.
        </p>
      </div>

      {submittedEntry ? (
        /* Confirmation Card / Boarding Pass */
        <div className="glass-strong backdrop-blur-2xl border border-[#0F5132]/35 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto animate-fade-in relative overflow-hidden ring-1 ring-[#C85A17]/30">
          {/* Subtle watermark seal */}
          <div className="absolute top-4 right-4 text-stone-200 pointer-events-none text-8xl font-serif select-none opacity-30">
            J&E
          </div>

          <div className="text-center pb-6 border-b border-[#C85A17]/20">
            <div className="w-14 h-14 glass border border-[#C85A17]/40 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-[#0F5132]">
              <Sparkles className="w-7 h-7 text-[#C85A17]" />
            </div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C85A17] font-sans font-semibold">
              Response Confirmed
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#0F5132] font-semibold mt-1">
              {submittedEntry.attending === 'accepted' ? 'We Can’t Wait to Celebrate With You!' : 'Thank You for Letting Us Know'}
            </h3>
            <p className="text-xs text-stone-600 font-sans mt-1">
              Confirmation Code: <span className="font-mono font-bold text-[#C85A17]">{submittedEntry.id.toUpperCase()}</span>
            </p>
          </div>

          <div className="py-6 space-y-4 text-sm text-[#4d4034] font-sans border-b border-[#C85A17]/20">
            <div className="flex justify-between items-center py-1">
              <span className="text-stone-500 text-xs uppercase tracking-[0.16em]">Primary Guest:</span>
              <span className="font-serif text-base text-[#2c241d] font-semibold">{submittedEntry.fullName}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-stone-500 text-xs uppercase tracking-[0.16em]">Attendance:</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                submittedEntry.attending === 'accepted' ? 'bg-[#0F5132]/15 text-[#0F5132] border border-[#0F5132]/30' : 'bg-stone-100 text-stone-600'
              }`}>
                {submittedEntry.attending === 'accepted' ? 'Joyfully Attending' : 'Regretfully Declines'}
              </span>
            </div>

            {submittedEntry.attending === 'accepted' && (
              <>
                <div className="flex justify-between items-center py-1">
                  <span className="text-stone-500 text-xs uppercase tracking-[0.16em]">Reserved Party:</span>
                  <span className="font-semibold text-stone-700">{submittedEntry.partySize} {submittedEntry.partySize > 1 ? 'Guests' : 'Guest'}</span>
                </div>

                {submittedEntry.guestNames && submittedEntry.guestNames.length > 1 && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-stone-500 text-xs uppercase tracking-[0.16em]">Plus One:</span>
                    <span>{submittedEntry.guestNames[1]}</span>
                  </div>
                )}

                <div className="flex justify-between items-start py-1">
                  <span className="text-stone-500 text-xs uppercase tracking-[0.16em]">Dietary Preferences:</span>
                  <span className="text-right text-xs max-w-xs">{submittedEntry.dietaryRestrictions.join(', ') || 'None specified'}</span>
                </div>

                {submittedEntry.songRequest && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-stone-500 text-xs uppercase tracking-[0.16em]">Song Choice:</span>
                    <span className="italic text-xs text-[#C85A17] font-semibold">“{submittedEntry.songRequest}”</span>
                  </div>
                )}
              </>
            )}

            {submittedEntry.message && (
              <div className="pt-2">
                <span className="text-stone-500 text-xs uppercase tracking-[0.16em] block mb-1">Your Personal Blessing:</span>
                <p className="font-serif italic text-sm text-[#4d4034] glass p-3 rounded-xl border border-[#C85A17]/20">
                  “{submittedEntry.message}”
                </p>
              </div>
            )}
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 glass glass-hover border border-[#C85A17]/30 text-[#3d332a] text-xs uppercase tracking-[0.16em] font-sans rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#0F5132]" />
              <span>Print / Save Ticket</span>
            </button>

            <button
              onClick={handleResetForNewResponse}
              className="px-4 py-2 bg-[#0F5132] hover:bg-[#082E1D] text-white text-xs uppercase tracking-[0.16em] font-sans rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#E06D28]" />
              <span>Modify or Submit Another RSVP</span>
            </button>
          </div>
        </div>
      ) : (
        /* RSVP Form */
        <div className="glass-strong backdrop-blur-2xl rounded-3xl border border-[#C85A17]/30 p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto ring-1 ring-[#0F5132]/10">
          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-700 text-xs font-sans">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Attendance Choice Buttons */}
            <div>
              <label className="block text-xs uppercase tracking-[0.25em] font-bold text-[#5c4e42] font-sans mb-3 text-center">
                Will you be joining us in Lake Como?
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setAttending('accepted')}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    attending === 'accepted'
                      ? 'border-[#0F5132] bg-[#f4f8f5] ring-2 ring-[#0F5132]/30 shadow-md'
                      : 'glass border-stone-200 text-stone-600 hover:border-[#0F5132]'
                  }`}
                >
                  <Heart className={`w-5 h-5 mb-1 ${attending === 'accepted' ? 'text-[#C85A17] fill-[#C85A17]' : 'text-stone-400'}`} />
                  <span className="font-serif text-base font-semibold text-[#0F5132]">
                    Joyfully Accepts
                  </span>
                  <span className="text-[11px] text-stone-500 font-sans mt-0.5">
                    I will be there to celebrate!
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttending('declined')}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    attending === 'declined'
                      ? 'border-[#C85A17] bg-[#fdf8f4] ring-2 ring-[#C85A17]/30 shadow-md'
                      : 'glass border-stone-200 text-stone-600 hover:border-[#C85A17]'
                  }`}
                >
                  <span className="font-serif text-lg text-stone-400 mb-1">✦</span>
                  <span className="font-serif text-base font-medium text-[#2c241d]">
                    Regretfully Declines
                  </span>
                  <span className="text-[11px] text-stone-500 font-sans mt-0.5">
                    Will toast from afar with love
                  </span>
                </button>
              </div>
            </div>

            {/* Guest Name & Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#5c4e42] mb-1 font-sans">
                  Full Name <span className="text-[#C85A17]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lady Genevieve Sterling"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-sm text-[#2b241e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#5c4e42] mb-1 font-sans">
                  Email Address <span className="text-[#C85A17]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="genevieve@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-sm text-[#2b241e]"
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#5c4e42] mb-1 font-sans">
                Phone Number <span className="text-stone-400 font-normal">(for lake shuttle updates)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-input text-sm text-[#2b241e]"
                />
              </div>
            </div>

            {/* Attendance conditional fields */}
            {attending === 'accepted' && (
              <div className="space-y-6 pt-2 border-t border-[#C85A17]/15">
                
                {/* Party Size & Plus One */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#5c4e42] mb-2 font-sans">
                    Number of Guests in Your Party
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPartySize(1)}
                      className={`px-5 py-2 rounded-xl border text-xs uppercase tracking-[0.16em] font-semibold font-sans cursor-pointer transition-all ${
                        partySize === 1
                          ? 'border-[#0F5132] bg-[#0F5132] text-white shadow-xs'
                          : 'glass border-stone-300 text-stone-600 hover:border-[#0F5132]'
                      }`}
                    >
                      Just Me (1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartySize(2)}
                      className={`px-5 py-2 rounded-xl border text-xs uppercase tracking-[0.16em] font-semibold font-sans cursor-pointer transition-all ${
                        partySize === 2
                          ? 'border-[#0F5132] bg-[#0F5132] text-white shadow-xs'
                          : 'glass border-stone-300 text-stone-600 hover:border-[#0F5132]'
                      }`}
                    >
                      Me + Guest (2)
                    </button>
                  </div>

                  {partySize === 2 && (
                    <div className="mt-3">
                      <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#5c4e42] mb-1 font-sans">
                        Full Name of Your Guest
                      </label>
                      <input
                        type="text"
                        placeholder="Guest full name"
                        value={plusOneName}
                        onChange={(e) => setPlusOneName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-[#2b241e]"
                      />
                    </div>
                  )}
                </div>

                {/* Dietary restrictions */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#5c4e42] mb-2 font-sans flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#C85A17]" />
                    <span>Preferred Ghanaian Dishes</span>
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {dietaryOptions.map((opt) => {
                      const isSelected = dietary.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleToggleDietary(opt)}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer border ${
                            isSelected
                              ? 'border-[#0F5132] bg-[#0F5132] text-white font-semibold shadow-xs'
                              : 'glass border-[#C85A17]/25 text-[#55473a] hover:border-[#0F5132]'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    placeholder="Other allergies or specific culinary notes..."
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    className="w-full mt-2.5 px-3.5 py-2 rounded-xl glass-input text-xs text-[#2b241e]"
                  />
                </div>

                {/* Dance Floor Song Request */}
                <div>
                  <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#5c4e42] mb-1 font-sans flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-[#C85A17]" />
                    <span>Dance Floor Song Request</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Song title and artist (e.g., L-O-V-E by Nat King Cole)"
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-[#2b241e]"
                  />
                </div>

              </div>
            )}

            {/* Personal Blessing Note */}
            <div>
              <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#5c4e42] mb-1 font-sans">
                A Note or Blessing for Julian & Eleanor
              </label>
              <textarea
                rows={3}
                placeholder="Share your wishes, a fond memory, or an Italian toast..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-[#2b241e]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-[#0F5132] hover:bg-[#082E1D] text-white text-xs uppercase tracking-[0.22em] font-semibold font-sans rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-[#C85A17]/40"
            >
              <Send className="w-4 h-4 text-[#E06D28]" />
              <span>Send My Response</span>
            </button>

          </form>
        </div>
      )}

    </section>
  );
};
