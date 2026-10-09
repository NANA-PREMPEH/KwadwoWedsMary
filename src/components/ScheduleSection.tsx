import React from 'react';
import { ScheduleItem } from '../types/wedding';
import { GlassWater, HeartHandshake, Wine, Utensils, Sparkles, Music, Clock } from 'lucide-react';

interface ScheduleSectionProps {
  schedule: ScheduleItem[];
}

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ schedule }) => {
  const getIcon = (name: string, index: number) => {
    const isOdd = index % 2 === 1;
    const colorClass = isOdd ? 'text-[#C85A17]' : 'text-[#0F5132]';

    switch (name) {
      case 'GlassWater':
        return <GlassWater className={`w-5 h-5 ${colorClass}`} />;
      case 'HeartHandshake':
        return <HeartHandshake className={`w-5 h-5 ${colorClass}`} />;
      case 'Wine':
        return <Wine className={`w-5 h-5 ${colorClass}`} />;
      case 'Utensils':
        return <Utensils className={`w-5 h-5 ${colorClass}`} />;
      case 'Sparkles':
        return <Sparkles className={`w-5 h-5 ${colorClass}`} />;
      case 'Music':
        return <Music className={`w-5 h-5 ${colorClass}`} />;
      default:
        return <Sparkles className={`w-5 h-5 ${colorClass}`} />;
    }
  };

  return (
    <section id="schedule" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FDFBF7] border-y border-[#0F5132]/15">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C85A17] font-semibold block mb-2 font-sans">
            The Flow of Our Day
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#0F5132] font-normal">
            Order of Celebration
          </h2>
          <div className="flex items-center justify-center gap-1.5 my-4">
            <span className="w-8 h-0.5 bg-[#C85A17]" />
            <span className="w-2 h-2 rounded-full bg-[#0F5132]" />
            <span className="w-8 h-0.5 bg-[#C85A17]" />
          </div>
          <p className="font-serif italic text-base text-[#524438] max-w-lg mx-auto">
            Please plan to arrive promptly at the lakeside pier by 15:30 to enjoy welcome drinks before the processional.
          </p>
        </div>

        {/* Timeline representation */}
        <div className="relative">
          {/* Vertical central stem line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#C85A17] via-[#0F5132] to-[#C85A17]" />
          {/* Mobile vertical line */}
          <div className="md:hidden absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#C85A17] via-[#0F5132] to-[#C85A17]" />

          <div className="space-y-12">
            {schedule.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.id}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Central Node Badge */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full glass border-2 border-[#0F5132] ring-4 ring-[#C85A17]/25 flex items-center justify-center shadow-md z-10">
                    {getIcon(item.iconName, index)}
                  </div>

                  {/* Content Box */}
                  <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-8">
                    <div
                      className={`p-6 glass glass-hover rounded-2xl border border-[#0F5132]/25 hover:border-[#C85A17]/60 shadow-xs hover:shadow-lg transition-all duration-300 backdrop-blur-xl ${
                        isEven ? 'md:text-left' : 'md:text-left'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#C85A17] font-sans">
                        <Clock className="w-3.5 h-3.5 text-[#C85A17]" />
                        <span className="font-bold">{item.time}</span>
                        <span className="text-stone-300">·</span>
                        <span className="text-stone-500 font-normal truncate">{item.location}</span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl text-[#0F5132] font-medium mb-2">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#4d4035] leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Empty side for layout balance */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
