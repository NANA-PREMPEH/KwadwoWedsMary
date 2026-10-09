import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  formattedDate: string;
  venueName: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, formattedDate, venueName }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    isPast: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ days, hours, minutes, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days, helper: 'Until the celebration' },
    { label: 'Hours', value: timeLeft.hours, helper: 'To Ceremony' },
    { label: 'Minutes', value: timeLeft.minutes, helper: 'To Sacred Vows' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      {/* Prominent Card Container */}
      <div className="relative glass-strong rounded-3xl border border-[#C85A17]/30 p-6 sm:p-8 shadow-xl shadow-[#0F5132]/8 overflow-hidden backdrop-blur-2xl">
        
        {/* Subtle decorative background watermarks */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-[#C85A17]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-36 h-36 bg-[#0F5132]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header Label */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#C85A17]/20">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C85A17] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C85A17]" />
            </span>
            <span className="text-[11px] uppercase tracking-[0.25em] font-sans font-bold text-[#0F5132]">
              {timeLeft.isPast ? 'Today is the Celebration Day' : 'Live Wedding Countdown'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#C85A17] font-sans font-semibold tracking-wide">
            <Clock className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Days, Hours, and Minutes 3-Column Prominent Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 relative">
          {units.map((unit, idx) => (
            <div
              key={unit.label}
              className="relative flex flex-col items-center justify-center p-4 sm:p-6 glass glass-hover rounded-2xl border border-[#0F5132]/25 group transition-all"
            >
              {/* Value */}
              <span className="font-serif text-4xl sm:text-6xl md:text-7xl font-semibold text-[#0F5132] tracking-tight leading-none group-hover:scale-105 group-hover:text-[#C85A17] transition-all duration-300">
                {String(unit.value).padStart(2, '0')}
              </span>

              {/* Label */}
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[#C85A17] font-sans font-bold mt-2 sm:mt-3">
                {unit.label}
              </span>

              {/* Sub-label helper */}
              <span className="hidden sm:inline-block text-[10px] text-stone-500 font-sans mt-0.5 font-medium tracking-wide">
                {unit.helper}
              </span>

              {/* Colon separators between columns */}
              {idx < units.length - 1 && (
                <div className="hidden sm:block absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 text-2xl font-serif text-[#C85A17]/40 select-none pointer-events-none">
                  :
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Banner Note */}
        <div className="mt-6 pt-4 border-t border-[#0F5132]/15 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 font-sans gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C85A17]" />
            <span className="font-semibold text-[#0F5132]">{venueName}</span>
          </div>
          <span className="text-stone-500 text-[11px] tracking-wide">
            {timeLeft.days} days and {timeLeft.hours} hours remaining
          </span>
        </div>

      </div>
    </div>
  );
};
