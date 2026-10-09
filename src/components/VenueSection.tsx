import React, { useState } from 'react';
import { WeddingDetails } from '../types/wedding';
import { InteractiveVenueMap } from './InteractiveVenueMap';
import { MapPin, Navigation, Compass, Sun, Wind, CloudSun, Plane, Car, Ship, Hotel, ExternalLink, Map } from 'lucide-react';

interface VenueSectionProps {
  details: WeddingDetails;
}

interface VenueSpot {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  description: string;
}

export const VenueSection: React.FC<VenueSectionProps> = ({ details }) => {
  const [mapMode, setMapMode] = useState<'regional' | 'estate'>('regional');
  const [selectedSpot, setSelectedSpot] = useState<string>('ceremony');

  const spots: VenueSpot[] = [
    {
      id: 'pier',
      name: 'Private Water Pier',
      role: 'Arrival & Boat Shuttles',
      x: 24,
      y: 72,
      description: 'The historic stone jetty where private wooden speedboats dock from Bellagio and Tremezzo.'
    },
    {
      id: 'ceremony',
      name: 'Loggia Durini Terrace',
      role: 'Ceremony & Vows',
      x: 48,
      y: 42,
      description: 'Triple-arched open loggia perched high on the promontory with panoramic views across both arms of Lake Como.'
    },
    {
      id: 'lawn',
      name: 'Belvedere Lemon Grove',
      role: 'Sunset Cocktail Hour',
      x: 65,
      y: 58,
      description: 'Terraced lawns shaded by citrus trees and sculpted holm oaks, featuring sunset acoustic music.'
    },
    {
      id: 'pavilion',
      name: 'The Glass Pavilion',
      role: 'Gala Dinner & Dancing',
      x: 76,
      y: 35,
      description: 'Chandelier-lit transparent structure seamlessly blending indoor comfort with romantic gardens.'
    },
    {
      id: 'gate',
      name: 'Valet & Main Gate',
      role: 'Vehicle Drop-Off',
      x: 18,
      y: 26,
      description: 'Private gated entrance on Via Statale with golf cart shuttle up the shaded path.'
    }
  ];

  const currentSpot = spots.find((s) => s.id === selectedSpot) || spots[1];

  return (
    <section id="venue" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#C85A17] font-semibold block mb-2 font-sans">
          The Destination & Accommodations
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#0F5132] font-normal">
          Villa Bellissima & Lake Como
        </h2>
        <div className="flex items-center justify-center gap-1.5 my-4">
          <span className="w-8 h-0.5 bg-[#C85A17]" />
          <span className="w-2 h-2 rounded-full bg-[#0F5132]" />
          <span className="w-8 h-0.5 bg-[#C85A17]" />
        </div>
        <p className="font-serif italic text-base text-[#524438] max-w-xl mx-auto">
          {details.ceremonyVenue.address} · Tremezzina & Central Lake Como
        </p>

        {/* View Switcher Tabs */}
        <div className="inline-flex p-1.5 glass rounded-2xl border border-[#C85A17]/30 shadow-md mt-6 backdrop-blur-xl">
          <button
            onClick={() => setMapMode('regional')}
            className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-[0.16em] font-sans font-bold transition-all cursor-pointer flex items-center gap-2 ${
              mapMode === 'regional'
                ? 'bg-[#0F5132] text-white shadow-sm'
                : 'text-stone-600 hover:text-[#0F5132]'
            }`}
          >
            <Map className="w-4 h-4 text-[#E06D28]" />
            <span>Regional Map: Hotel, Ceremony & Reception Pins</span>
          </button>
          
          <button
            onClick={() => setMapMode('estate')}
            className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-[0.16em] font-sans font-bold transition-all cursor-pointer flex items-center gap-2 ${
              mapMode === 'estate'
                ? 'bg-[#0F5132] text-white shadow-sm'
                : 'text-stone-600 hover:text-[#0F5132]'
            }`}
          >
            <Compass className="w-4 h-4 text-[#E06D28]" />
            <span>Villa Estate Grounds</span>
          </button>
        </div>
      </div>

      {/* Main Map Presentation */}
      <div className="mb-14">
        {mapMode === 'regional' ? (
          /* Static Regional Leaflet Map with Hotel, Ceremony & Reception pins */
          <div className="animate-fade-in">
            <InteractiveVenueMap />
          </div>
        ) : (
          /* Villa Bellissima Grounds Schematic */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            {/* Left: Schematic */}
            <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-[#0F5132] p-6 shadow-md ring-1 ring-[#C85A17]/25">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#0F5132]/10">
                <div className="flex items-center gap-2 text-[#0F5132]">
                  <Compass className="w-4 h-4 text-[#C85A17]" />
                  <span className="text-xs uppercase tracking-[0.18em] font-semibold font-sans">
                    Villa Bellissima Historic Grounds
                  </span>
                </div>
                <span className="text-[11px] text-[#C85A17] font-sans font-medium">
                  Tap pins to inspect locations
                </span>
              </div>

              {/* Map canvas schematic illustration */}
              <div className="relative w-full aspect-[16/10] bg-[#eef3f1] rounded-2xl overflow-hidden border border-[#d6e0db] shadow-inner select-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#85a6ab] via-[#5b8089] to-[#3a5860] opacity-90" />
                
                <div 
                  className="absolute inset-0 bg-[#f4eee4] border-4 border-[#0F5132]/30 shadow-xl"
                  style={{
                    clipPath: 'polygon(10% 10%, 85% 15%, 92% 65%, 65% 85%, 35% 85%, 15% 65%)',
                    backgroundImage: 'radial-gradient(#0F5132 0.8px, transparent 0.8px)',
                    backgroundSize: '18px 18px'
                  }}
                />

                <div className="absolute bottom-4 right-4 text-white/70 text-[10px] tracking-[0.3em] uppercase font-sans font-medium">
                  Lake Como Waters
                </div>

                {spots.map((spot) => {
                  const isSelected = spot.id === selectedSpot;
                  return (
                    <button
                      key={spot.id}
                      onClick={() => setSelectedSpot(spot.id)}
                      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                      aria-label={spot.name}
                    >
                      <div className="relative flex flex-col items-center">
                        <div
                          className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ${
                            isSelected
                              ? 'bg-[#C85A17] text-white scale-110 ring-4 ring-white'
                              : 'bg-[#0F5132] text-white hover:scale-105'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <span className="mt-1 px-1.5 py-0.5 rounded bg-black/65 backdrop-blur-sm text-[9px] sm:text-[10px] text-white whitespace-nowrap font-sans font-medium tracking-wide">
                          {spot.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Pin Details Box */}
              <div className="mt-5 p-4 rounded-xl bg-[#FDFBF7] border border-[#0F5132]/25 ring-1 ring-[#C85A17]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C85A17] font-sans">
                    {currentSpot.role}
                  </div>
                  <h4 className="font-serif text-lg text-[#0F5132] font-semibold">
                    {currentSpot.name}
                  </h4>
                  <p className="text-xs text-[#524438] font-sans mt-0.5">
                    {currentSpot.description}
                  </p>
                </div>

                <a
                  href={details.ceremonyVenue.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F5132] hover:bg-[#0b3d26] text-white text-xs uppercase tracking-wider font-medium rounded-lg shrink-0 transition-colors cursor-pointer border border-[#C85A17]/40 shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#E06D28]" />
                  <span>Open in Maps</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>

            {/* Right: Estate highlights */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 bg-white rounded-3xl border-2 border-[#0F5132] shadow-md ring-1 ring-[#C85A17]/20 space-y-3">
                <h3 className="font-serif text-2xl text-[#0F5132] font-semibold">
                  Estate Exploration Guide
                </h3>
                <p className="text-xs text-stone-600 font-sans leading-relaxed">
                  Villa Bellissima occupies the wooded tip of the Lavedo peninsula. Guests arriving by boat land at the private jetty, with a scenic moss-lined pathway leading past lemon groves to the Loggia Durini.
                </p>
                <div className="pt-2 space-y-2">
                  <div className="p-3 bg-[#FDFBF7] rounded-xl border border-stone-200 text-xs">
                    <strong className="text-[#0F5132] block">Gentle Footwear Note:</strong>
                    Historic gravel paths and stone steps connect the terraces. Block heels, dress flats, or wedges in emerald, orange, or ivory are highly recommended.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Travel, Weather & Accommodations Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Weather Card */}
        <div className="p-6 glass glass-hover rounded-3xl border border-[#0F5132]/25 shadow-xs flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#0F5132]/10">
              <div className="flex items-center gap-2 text-[#0F5132]">
                <Sun className="w-4 h-4 text-[#C85A17]" />
                <span className="text-xs uppercase tracking-[0.2em] font-semibold font-sans">
                  September Weather
                </span>
              </div>
              <span className="text-xs font-bold text-[#C85A17] font-sans">23°C / 73°F</span>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 glass rounded-2xl text-[#C85A17] border border-[#C85A17]/30 shrink-0">
                <CloudSun className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-serif text-[#0F5132] font-semibold">
                  Late Summer Sun & Lake Breeze
                </p>
                <p className="text-xs text-stone-600 font-sans mt-1 leading-relaxed">
                  Pleasantly warm during the ceremony. A light wrap or evening jacket in burnt orange or white is recommended for the terrace breeze.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200/50 text-[11px] text-stone-400 font-sans">
            Sunset at 19:22 · Sunset aperitivo starts at 17:45
          </div>
        </div>

        {/* Airport & Transit Card */}
        <div className="p-6 glass glass-hover rounded-3xl border border-[#0F5132]/25 shadow-xs flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#0F5132]/10">
              <div className="flex items-center gap-2 text-[#0F5132]">
                <Plane className="w-4 h-4 text-[#C85A17]" />
                <span className="text-xs uppercase tracking-[0.2em] font-semibold font-sans">
                  Airports & Transit
                </span>
              </div>
              <span className="text-xs font-bold text-[#0F5132] font-sans">MXP & LIN</span>
            </div>

            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Milan Malpensa (MXP) is ~75 mins away. Milan Linate (LIN) is ~85 mins. Private chauffeured Mercedes vans or direct Trenord trains to Como San Giovanni are available.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200/50 flex items-center gap-2 text-xs text-[#0F5132] font-semibold font-sans">
            <Car className="w-3.5 h-3.5 text-[#C85A17]" />
            <span>Valet parking available at Villa Main Gate</span>
          </div>
        </div>

        {/* Shuttles & Room Block Card */}
        <div className="p-6 glass glass-hover rounded-3xl border border-[#0F5132]/25 shadow-xs flex flex-col justify-between backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#0F5132]/10">
              <div className="flex items-center gap-2 text-[#0F5132]">
                <Ship className="w-4 h-4 text-[#C85A17]" />
                <span className="text-xs uppercase tracking-[0.2em] font-semibold font-sans">
                  Shuttles & Booking Code
                </span>
              </div>
              <span className="text-xs font-bold text-[#C85A17] font-sans">Complimentary</span>
            </div>

            <p className="text-xs text-stone-600 font-sans leading-relaxed">
              Private chartered Riva speedboats run continuously between Bellagio, Menaggio, Grand Hotel Tremezzo, and the Villa pier from 15:00 to 02:00.
            </p>

            <div className="mt-3 p-2.5 rounded-xl glass border border-[#C85A17]/30 text-xs font-sans">
              <span className="text-stone-500 block text-[10px] uppercase tracking-[0.16em]">Hotel Room Block Code:</span>
              <strong className="text-[#C85A17] text-sm tracking-wider font-mono">JULIANELEANOR</strong>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200/50 text-[11px] text-stone-400 font-sans">
            Rooms reserved at Grand Hotel Victoria & Serbelloni
          </div>
        </div>

      </div>

    </section>
  );
};

