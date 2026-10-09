import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Hotel,
  HeartHandshake,
  Utensils,
  Navigation,
  Compass,
  ExternalLink,
  Layers,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Ship,
  Phone,
  Clock
} from 'lucide-react';

export type VenueSiteType = 'ceremony' | 'reception' | 'hotel';

export interface VenueSite {
  id: string;
  name: string;
  italianName: string;
  type: VenueSiteType;
  role: string;
  address: string;
  lat: number;
  lng: number;
  timeOrDistance: string;
  description: string;
  bookingCode?: string;
  googleMapsUrl: string;
  phone?: string;
  imageUrl: string;
}

export const VENUE_SITES: VenueSite[] = [
  {
    id: 'site-ceremony',
    name: 'Idyllic Moments Guest House',
    italianName: 'Wedding Venue',
    type: 'ceremony',
    role: 'Wedding Ceremony',
    address: 'Idyllic Moments Guest House',
    lat: 45.9657,
    lng: 9.2023,
    timeOrDistance: 'Saturday, November 14, 2026 · 9:00 AM',
    description: 'Join Kwadwo Akomani Preko and Mary Adubeah Yeboah as they celebrate their wedding.',
    googleMapsUrl: 'https://maps.app.goo.gl/bkBVE9oAzWUiyD5TA?g_st=iw',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'site-reception',
    name: 'The Glass Pavilion & Belvedere Gardens',
    italianName: 'Il Padiglione di Vetro',
    type: 'reception',
    role: 'Aperitivo, Gala Dinner & Dancing',
    address: 'Idyllic Moments Guest House',
    lat: 45.9664,
    lng: 9.2038,
    timeOrDistance: '17:45 Aperitivo · 19:30 Gala Dinner · Late Night',
    description: 'Chandelier-lit open glass structure surrounded by centuries-old olive groves, lakeside terraces, and evening fire pits.',
    googleMapsUrl: 'https://maps.app.goo.gl/bkBVE9oAzWUiyD5TA?g_st=iw',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'site-hotel-menaggio',
    name: 'Grand Hotel Victoria Concept & Spa',
    italianName: 'Menaggio Luxury Residence',
    type: 'hotel',
    role: 'Primary Guest Hotel & Spa Block',
    address: 'Idyllic Moments Guest House',
    lat: 46.0211,
    lng: 9.2415,
    timeOrDistance: '~10 mins via complimentary private shuttle boat',
    description: 'Premier 5-star lakeside hotel reserved with preferred block rates under group code JULIANELEANOR.',
    bookingCode: 'JULIANELEANOR',
    googleMapsUrl: 'https://maps.app.goo.gl/bkBVE9oAzWUiyD5TA?g_st=iw',
    phone: '+39 0344 32003',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'site-hotel-bellagio',
    name: 'Grand Hotel Villa Serbelloni',
    italianName: 'Bellagio Promontory Suites',
    type: 'hotel',
    role: 'Historic Partner Hotel & Private Jetty',
    address: 'Idyllic Moments Guest House',
    lat: 45.9892,
    lng: 9.2635,
    timeOrDistance: '~12 mins direct wooden water taxi to Villa jetty',
    description: 'Historic neoclassical palace situated directly on the tip of Bellagio with private water taxi pickup.',
    bookingCode: 'JULIANELEANOR',
    googleMapsUrl: 'https://maps.app.goo.gl/bkBVE9oAzWUiyD5TA?g_st=iw',
    phone: '+39 031 950216',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'site-hotel-tremezzo',
    name: 'Grand Hotel Tremezzo',
    italianName: 'Lakeside Boutique Resort',
    type: 'hotel',
    role: 'Partner Hotel & Water Terrace',
    address: 'Idyllic Moments Guest House',
    lat: 45.9845,
    lng: 9.2295,
    timeOrDistance: '~5 mins private boat launch to ceremony dock',
    description: 'Iconic Art Nouveau hotel featuring floating pools and direct shuttle connections to the wedding gates.',
    bookingCode: 'JULIANELEANOR',
    googleMapsUrl: 'https://maps.app.goo.gl/bkBVE9oAzWUiyD5TA?g_st=iw',
    phone: '+39 0344 42491',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80'
  }
];

export const InteractiveVenueMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [activeSiteId, setActiveSiteId] = useState<string>('site-ceremony');
  const [filterType, setFilterType] = useState<'all' | VenueSiteType>('all');
  const [mapTileStyle, setMapTileStyle] = useState<'voyager' | 'osm'>('voyager');

  const activeSite = VENUE_SITES.find((s) => s.id === activeSiteId) || VENUE_SITES[0];

  // Initialize Static Non-Interactive Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      if ((mapContainerRef.current as any)._leaflet_id) {
        delete (mapContainerRef.current as any)._leaflet_id;
      }

      // Static Map - interactions completely disabled (no dragging, zooming, scroll hijack)
      const map = L.map(mapContainerRef.current, {
        center: [45.988, 9.228], // Framed perfectly across Tremezzo, Bellagio & Menaggio
        zoom: 12,
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: false
      });

      // CartoDB Voyager tiles (warm, elegant, parchment-like map styling)
      const tileUrl =
        mapTileStyle === 'voyager'
          ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      L.tileLayer(tileUrl, {
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;

      // Invalidate size once rendered
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 300);

      // Add custom non-interactive HTML markers matching Emerald Green & Burnt Orange theme
      VENUE_SITES.forEach((site) => {
        const isCeremony = site.type === 'ceremony';
        const isReception = site.type === 'reception';

        // Custom Theme Colors: Emerald Green (#0F5132), Burnt Orange (#C85A17), Deep Forest (#082E1D)
        const bgColor = isCeremony ? '#0F5132' : isReception ? '#C85A17' : '#082E1D';
        const ringColor = isCeremony ? '#C85A17' : isReception ? '#0F5132' : '#C85A17';
        const iconSymbol = isCeremony ? '💍' : isReception ? '🥂' : '🏨';
        const badgeLabel = isCeremony
          ? 'Ceremony'
          : isReception
          ? 'Reception'
          : site.name.includes('Menaggio')
          ? 'Hotel Menaggio'
          : site.name.includes('Serbelloni')
          ? 'Hotel Serbelloni'
          : 'Hotel Tremezzo';

        const customHtml = `
          <div class="wedding-map-marker relative flex flex-col items-center pointer-events-none select-none">
            <!-- Pulsing outer ring -->
            <div style="background-color: ${ringColor};" class="absolute -inset-1 rounded-full opacity-30 animate-pulse"></div>
            <!-- Marker disc -->
            <div style="background-color: ${bgColor}; border: 2.5px solid #FFFFFF;" class="relative w-9 h-9 rounded-full flex items-center justify-center shadow-lg">
              <span class="text-sm select-none">${iconSymbol}</span>
            </div>
            <!-- Bottom pin beak -->
            <div style="border-top-color: ${bgColor};" class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] -mt-[1px]"></div>
            <!-- Label tag with theme border -->
            <div style="border: 1.5px solid ${ringColor}; background-color: #FFFFFF;" class="mt-1 px-2 py-0.5 rounded-full shadow-md text-[10px] font-sans font-bold whitespace-nowrap text-stone-900 tracking-tight">
              ${badgeLabel}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-wedding-pin',
          html: customHtml,
          iconSize: [44, 60],
          iconAnchor: [22, 48],
        });

        L.marker([site.lat, site.lng], { icon: customIcon, interactive: false }).addTo(map);
      });

      return () => {
        clearTimeout(timer);
      };
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tile layer if style switches
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    const tileUrl =
      mapTileStyle === 'voyager'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(mapInstanceRef.current);
  }, [mapTileStyle]);

  const handleSelectSite = (site: VenueSite) => {
    setActiveSiteId(site.id);
  };

  const filteredSites = VENUE_SITES.filter((site) => {
    if (filterType === 'all') return true;
    return site.type === filterType;
  });

  return (
    <div className="w-full space-y-6">
      
      {/* Top Filter and Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#0F5132]/20 shadow-xs">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-sans rounded-lg font-semibold transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#0F5132] text-white shadow-2xs'
                : 'text-stone-600 hover:text-[#0F5132]'
            }`}
          >
            Wedding Program
          </button>

          <button
            onClick={() => setFilterType('ceremony')}
            className={`px-3 py-1.5 text-xs font-sans rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'ceremony'
                ? 'bg-[#0F5132] text-white shadow-2xs'
                : 'text-stone-600 hover:text-[#0F5132]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#0F5132]" />
            <span>Ceremony</span>
          </button>

          <button
            onClick={() => setFilterType('reception')}
            className={`px-3 py-1.5 text-xs font-sans rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'reception'
                ? 'bg-[#C85A17] text-white shadow-2xs'
                : 'text-stone-600 hover:text-[#C85A17]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#C85A17]" />
            <span>Reception</span>
          </button>

          <button
            onClick={() => setFilterType('hotel')}
            className={`px-3 py-1.5 text-xs font-sans rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterType === 'hotel'
                ? 'bg-[#082E1D] text-white shadow-2xs'
                : 'text-stone-600 hover:text-[#082E1D]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#082E1D]" />
            <span>Venue Info</span>
          </button>
        </div>

        {/* Legend / Static map indicator */}
        <div className="flex items-center gap-3 text-xs text-stone-600 font-sans">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FDFBF7] rounded-lg border border-stone-200">
            <span className="w-2 h-2 rounded-full bg-[#0F5132]"></span>
            <span className="text-[11px] font-medium text-stone-700">Venue Location Overview</span>
          </div>

          <button
            onClick={() => setMapTileStyle(mapTileStyle === 'voyager' ? 'osm' : 'voyager')}
            className="px-2.5 py-1 rounded-lg border border-stone-200 text-stone-600 hover:text-[#0F5132] hover:border-[#0F5132] transition-colors flex items-center gap-1.5 cursor-pointer bg-[#FDFBF7]"
            title="Toggle map style"
          >
            <Layers className="w-3.5 h-3.5 text-[#C85A17]" />
            <span className="text-[11px]">{mapTileStyle === 'voyager' ? 'Warm Map' : 'Clean Map'}</span>
          </button>
        </div>

      </div>

      {/* Main Map + Card Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Non-Interactive Static Leaflet Map View */}
        <div className="lg:col-span-8 bg-white rounded-3xl border-2 border-[#0F5132] overflow-hidden shadow-lg relative min-h-[480px] flex flex-col ring-1 ring-[#C85A17]/30">
          
          {/* Static Leaflet map with pointer-events-none to prevent any scroll or gesture trapping */}
          <div
            ref={mapContainerRef}
            className="w-full flex-1 min-h-[480px] z-10 pointer-events-none select-none"
            aria-label="Static regional map of Lake Como wedding sites"
          />

          {/* Static Map Header Banner */}
          <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#0F5132]/25 shadow-md flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#C85A17]" />
            <span className="text-xs font-serif font-bold text-[#0F5132]">
              Idyllic Moments Guest House · Venue Map
            </span>
          </div>

          {/* Theme Color Legend at Top Right */}
          <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#0F5132]/20 shadow-sm text-[11px] font-sans font-medium">
            <span className="flex items-center gap-1 text-[#0F5132]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F5132]"></span> Ceremony
            </span>
            <span className="text-stone-300">·</span>
            <span className="flex items-center gap-1 text-[#C85A17]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C85A17]"></span> Reception
            </span>
            <span className="text-stone-300">·</span>
            <span className="flex items-center gap-1 text-[#082E1D]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#082E1D]"></span> Venue
            </span>
          </div>

          {/* Bottom Water Shuttle Banner */}
          <div className="absolute bottom-3 inset-x-3 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[#0F5132]/25 shadow-md flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#C85A17]/15 text-[#C85A17] flex items-center justify-center shrink-0">
                <Ship className="w-4 h-4" />
              </div>
              <p className="text-stone-700 font-sans">
                <strong className="text-[#0F5132]">Wedding Venue:</strong> Idyllic Moments Guest House · Saturday, November 14, 2026 at 9:00 AM.
              </p>
            </div>
            <span className="text-[10px] text-stone-500 uppercase tracking-wider font-bold shrink-0 hidden sm:inline">
              Fixed Overview
            </span>
          </div>

        </div>

        {/* Right: Active Site Spotlight & Location Selector */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          
          {/* Active Site Detailed Card */}
          <div className="bg-white rounded-3xl border-2 border-[#0F5132] p-6 shadow-md ring-1 ring-[#C85A17]/25 flex-1 flex flex-col justify-between">
            <div>
              {/* Image banner */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-[#0F5132]/20 shadow-xs">
                <img
                  src={activeSite.imageUrl}
                  alt={activeSite.name}
                  className="w-full h-full object-cover"
                />
                <span
                  style={{
                    backgroundColor:
                      activeSite.type === 'ceremony'
                        ? '#0F5132'
                        : activeSite.type === 'reception'
                        ? '#C85A17'
                        : '#082E1D',
                  }}
                  className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-white text-[10px] uppercase font-bold tracking-wider shadow-sm"
                >
                  {activeSite.type === 'ceremony'
                    ? '💍 Ceremony Site'
                    : activeSite.type === 'reception'
                    ? '🥂 Reception Site'
                    : '🏨 Partner Hotel'}
                </span>
              </div>

              {/* Title & Italian name */}
              <div className="mb-2">
                <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold text-[#C85A17]">
                  {activeSite.role}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0F5132] leading-snug mt-0.5">
                  {activeSite.name}
                </h3>
                <p className="text-xs font-serif italic text-stone-500">
                  {activeSite.italianName}
                </p>
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 text-xs text-stone-600 font-sans my-2.5">
                <MapPin className="w-3.5 h-3.5 text-[#C85A17] shrink-0 mt-0.5" />
                <span>{activeSite.address}</span>
              </div>

              {/* Timing or Distance */}
              <div className="flex items-center gap-2 text-xs font-sans text-[#0F5132] font-semibold mb-3">
                <Clock className="w-3.5 h-3.5 text-[#0F5132]" />
                <span>{activeSite.timeOrDistance}</span>
              </div>

              <p className="text-xs text-stone-600 font-sans leading-relaxed">
                {activeSite.description}
              </p>

              {activeSite.bookingCode && (
                <div className="mt-3 p-2.5 rounded-xl bg-[#FDFBF7] border border-[#0F5132]/20 text-xs font-sans">
                  <span className="text-stone-500 block text-[10px] uppercase tracking-wider">Discounted Booking Code:</span>
                  <strong className="text-[#C85A17] text-sm tracking-wide font-mono">{activeSite.bookingCode}</strong>
                </div>
              )}
            </div>

            {/* Direct Google Maps Navigation Button */}
            <div className="mt-6 pt-4 border-t border-[#0F5132]/10 flex items-center justify-between gap-3">
              <a
                href={activeSite.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 bg-[#0F5132] hover:bg-[#082E1D] text-white text-xs uppercase tracking-[0.16em] font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#C85A17]/40"
              >
                <Navigation className="w-3.5 h-3.5 text-[#E06D28]" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Quick Location Switcher Buttons */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
            <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold block mb-2 font-sans">
              Select Site to View Details:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {filteredSites.map((site) => (
                <button
                  key={site.id}
                  onClick={() => handleSelectSite(site)}
                  className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    site.id === activeSiteId
                      ? 'border-[#0F5132] bg-[#0F5132]/10 text-[#0F5132] font-bold shadow-2xs'
                      : 'border-stone-200 text-stone-600 hover:border-[#C85A17]'
                  }`}
                >
                  <span className="truncate block font-serif text-sm">{site.name.split('—')[0].trim()}</span>
                  <span className="text-[10px] text-stone-400 capitalize block">{site.type}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
