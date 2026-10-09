import { WeddingDetails, ScheduleItem, RsvpEntry, WeddingPhoto, GuestbookEntry, FaqItem, SongSuggestion, SeatingTable } from '../types/wedding';

export const INITIAL_WEDDING_DETAILS: WeddingDetails = {
  coupleNames: 'Kwadwo Akomani Preko & Mary Adubeah Yeboah',
  partnerOne: 'Kwadwo Akomani Preko',
  partnerTwo: 'Mary Adubeah Yeboah',
  date: 'Saturday, November 14, 2026 · 9:00 AM',
  targetDateTime: '2026-11-14T09:00:00+00:00',
  ceremonyVenue: {
    name: 'Idyllic Moments Guest House',
    tagline: 'Idyllic Moments Guest House',
    address: 'Idyllic Moments Guest House',
    city: 'Accra',
    country: 'Ghana',
    coordinates: { lat: 5.6836, lng: -0.20081 },
    googleMapsUrl: 'https://maps.app.goo.gl/bkBVE9oAzWUiyD5TA?g_st=iw',
    description: 'Join us at Idyllic Moments Guest House in North Haatso for the celebration of Kwadwo and Mary.'
  },
  receptionVenue: {
    name: 'Idyllic Moments Guest House',
    address: 'Idyllic Moments Guest House',
    description: 'The wedding celebration will be held at Idyllic Moments Guest House.'
  },
  dressCode: {
    theme: 'Emerald Green, Burnt Orange & Crisp White',
    description: 'Our celebration embraces the harmony of deep Emerald Green, warm Burnt Orange, and crisp White against the serene waters of Lake Como. We invite you to celebrate in elevated formal attire inspired by these colors.',
    colors: [
      { name: 'Burnt Orange', hex: '#C85A17' },
      { name: 'Emerald Green', hex: '#0F5132' },
      { name: 'Crisp White', hex: '#FFFFFF' },
      { name: 'Rust Sienna', hex: '#D35400' },
      { name: 'Deep Forest Emerald', hex: '#1B3B2F' }
    ]
  },
  hashtag: '#KwadwoAndMary2026'
};

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sch-1',
    time: '09:00',
    title: 'Wedding Ceremony',
    location: 'Idyllic Moments Guest House',
    description: 'Please join Kwadwo Akomani Preko and Mary Adubeah Yeboah as they celebrate their wedding.',
    iconName: 'GlassWater'
  },
  {
    id: 'sch-2',
    time: '16:30',
    title: 'The Ceremony & Sacred Vows',
    location: 'The Loggia Durini Terrace',
    description: 'Exchange of vows under the historic arches overlooking the lake. Processional by the Milan String Quartet.',
    iconName: 'HeartHandshake'
  },
  {
    id: 'sch-3',
    time: '17:45',
    title: 'Sunset Aperitivo & Live Jazz',
    location: 'Belvedere Lawn & Lemon Grove',
    description: 'Handcrafted cocktails, truffled arancini, crudo di mare, and Italian charcuterie accompanied by an acoustic swing trio.',
    iconName: 'Wine'
  },
  {
    id: 'sch-4',
    time: '19:30',
    title: 'Four-Course Candlelit Gala Dinner',
    location: 'The Glass Pavilion',
    description: 'Gourmet Northern Italian cuisine paired with reserve Barolo and Franciacorta wines, followed by family toasts.',
    iconName: 'Utensils'
  },
  {
    id: 'sch-5',
    time: '22:00',
    title: 'Cake Cutting & First Dance',
    location: 'Grand Verandah overlooking the Lake',
    description: 'Traditional Millefoglie cake assembled live with fresh wild strawberries, followed by Julian & Eleanor’s first dance.',
    iconName: 'Sparkles'
  },
  {
    id: 'sch-6',
    time: '22:45 – Late',
    title: 'Afterparty & Midnight Gelato',
    location: 'The Historic Cellar & Terrace',
    description: 'DJ sets, espresso martini bar, late-night Neapolitan wood-fired pizza and artisanal gelato cart under the stars.',
    iconName: 'Music'
  }
];

export const INITIAL_PHOTOS: WeddingPhoto[] = [
  {
    id: 'p-1',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    caption: 'Rehearsal dinner walk along the Bellagio shores. Can’t wait for tomorrow!',
    uploaderName: 'Julian & Eleanor',
    category: 'candid',
    timestamp: 'Yesterday at 19:40',
    likes: 42,
    isLikedByUser: false
  },
  {
    id: 'p-2',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    caption: 'The arches of the Loggia are dressed in white peonies and garden roses.',
    uploaderName: 'Elena Rostova (Floral Artist)',
    category: 'ceremony',
    timestamp: 'Today at 10:15',
    likes: 28,
    isLikedByUser: false
  },
  {
    id: 'p-3',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    caption: 'Arriving in Como via vintage Riva wooden boat. Pure Italian romance!',
    uploaderName: 'Matteo & Sofia',
    category: 'cocktail',
    timestamp: 'Today at 11:30',
    likes: 35,
    isLikedByUser: true
  },
  {
    id: 'p-4',
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
    caption: 'Setting the table settings with hand-calligraphed olive leaf place cards.',
    uploaderName: 'Camilla (Wedding Planner)',
    category: 'dinner',
    timestamp: 'Today at 12:45',
    likes: 19,
    isLikedByUser: false
  },
  {
    id: 'p-5',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    caption: 'The sun sinking behind the alpine peaks above the villa gardens.',
    uploaderName: 'Lucas Vance (Best Man)',
    category: 'candid',
    timestamp: 'Today at 14:00',
    likes: 24,
    isLikedByUser: false
  },
  {
    id: 'p-6',
    url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80',
    caption: 'A toast to the bride in the bridal suite! The countdown is on.',
    uploaderName: 'Seraphina (Maid of Honor)',
    category: 'party',
    timestamp: 'Today at 14:50',
    likes: 51,
    isLikedByUser: true
  }
];

export const INITIAL_RSVPS: RsvpEntry[] = [
  {
    id: 'rsvp-1',
    fullName: 'Lucas Vance',
    email: 'lucas.vance@example.com',
    phone: '+1 415 882 1920',
    attending: 'accepted',
    partySize: 2,
    guestNames: ['Lucas Vance', 'Dr. Chloe Aris'],
    dietaryRestrictions: ['None'],
    songRequest: 'September - Earth, Wind & Fire',
    message: 'Brother, so proud of you both! Ready to give the best speech of the decade.',
    submittedAt: '2026-08-01T14:22:00Z'
  },
  {
    id: 'rsvp-2',
    fullName: 'Seraphina Fontaine',
    email: 'seraphina.fontaine@example.com',
    attending: 'accepted',
    partySize: 1,
    guestNames: ['Seraphina Fontaine'],
    dietaryRestrictions: ['Vegetarian'],
    songRequest: 'L-O-V-E - Nat King Cole',
    message: 'Eleanor, my darling soul sister, tears are already welling up. Counting down the moments!',
    submittedAt: '2026-08-03T18:10:00Z'
  },
  {
    id: 'rsvp-3',
    fullName: 'Marco & Beatrice Rossi',
    email: 'rossi.famiglia@example.it',
    attending: 'accepted',
    partySize: 2,
    guestNames: ['Marco Rossi', 'Beatrice Rossi'],
    dietaryRestrictions: ['Gluten-Free'],
    songRequest: 'Volare - Domenico Modugno',
    message: 'Benvenuti in Italia! Non vediamo l’ora di celebrare il vostro amore a Como.',
    submittedAt: '2026-08-07T09:45:00Z'
  },
  {
    id: 'rsvp-4',
    fullName: 'Arthur & Genevieve Vance',
    email: 'vance.genevieve@example.com',
    attending: 'accepted',
    partySize: 2,
    guestNames: ['Arthur Vance', 'Genevieve Vance'],
    dietaryRestrictions: ['None'],
    songRequest: 'Can\'t Take My Eyes Off You - Frankie Valli',
    message: 'With all our maternal and paternal blessing and boundless love.',
    submittedAt: '2026-08-08T11:20:00Z'
  },
  {
    id: 'rsvp-5',
    fullName: 'David Sterling',
    email: 'd.sterling@example.co.uk',
    attending: 'declined',
    partySize: 0,
    dietaryRestrictions: [],
    message: 'Deeply saddened that overseas commitments keep me away, but sending all my heartfelt love and warmest congratulations!',
    submittedAt: '2026-08-11T16:05:00Z'
  }
];

export const INITIAL_GUESTBOOK: GuestbookEntry[] = [
  {
    id: 'gb-1',
    name: 'Seraphina Fontaine',
    message: 'To Julian and Eleanor: May your years together be as luminous, deep, and tranquil as Lake Como at golden hour. All my love forever!',
    date: 'August 12, 2026'
  },
  {
    id: 'gb-2',
    name: 'Matteo & Sofia',
    message: 'Che la vostra vita insieme sia sempre una dolce festa! Ci vediamo presto sulla pista da ballo!',
    date: 'August 18, 2026'
  },
  {
    id: 'gb-3',
    name: 'The Campbell Family',
    message: 'Watching your love story unfold has been one of life’s greatest joys. So honored to be a part of your milestone.',
    date: 'August 24, 2026'
  },
  {
    id: 'gb-4',
    name: 'Gabriel & Noah',
    message: 'Pack your dancing shoes Julian! We are ready to toast you two until the sunrise over the Alps.',
    date: 'September 01, 2026'
  }
];

export const INITIAL_FAQS: FaqItem[] = [
  {
    question: 'Where is the wedding venue and whom can I contact?',
    answer: 'The celebration is at Idyllic Moments Guest House. For directions or assistance, contact Barnabas on 055 707 6150 or Deborah on 054 263 7923.'
  },
  {
    question: 'What is the dress code and footwear recommendation?',
    answer: 'Our wedding colors are Emerald Green, Burnt Orange, and crisp White. We encourage formal evening wear incorporating these jewel and sunset tones—such as emerald dinner jackets or gowns, warm burnt orange silk accents, and crisp white styling. Because the venue features historic gravel pathways and lakeside stone steps, block heels or elegant wedges are strongly recommended over thin stilettos.'
  },
  {
    question: 'Are children invited to the festivities?',
    answer: 'While we adore your little ones, our ceremony and evening celebrations will be an adults-only affair so all our guests can relax and revel into the late evening.'
  },
  {
    question: 'What is the gift registry preference?',
    answer: 'Your presence across oceans and borders is the greatest gift of all. If you wish to honor us with a gift, we have established a Honeymoon & Future Home Wishing Well, or you may contribute to our Italian culinary discovery fund.'
  },
  {
    question: 'Can we take and share photos during the ceremony?',
    answer: 'We kindly request an “unplugged” ceremony so that our photographers can capture the moment and you can be fully present with us. During the cocktail hour, dinner, and reception, please take as many photos as you wish and upload them directly to our Live Photo Stream on this app!'
  }
];

export const INITIAL_SONG_SUGGESTIONS: SongSuggestion[] = [
  {
    id: 'song-1',
    title: 'My Heart Will Go On',
    artist: 'Celine Dion',
    suggestedBy: 'Kwadwo & Mary',
    genre: 'Slow Dance & Romance',
    dedication: 'Our featured wedding song.',
    votes: 50,
    hasVoted: true,
    timestamp: 'Featured'
  },
  {
    id: 'song-2',
    title: 'L-O-V-E',
    artist: 'Nat King Cole',
    suggestedBy: 'Seraphina Fontaine',
    genre: 'Slow Dance & Romance',
    dedication: 'For Julian and Eleanor’s timeless elegance.',
    votes: 24,
    hasVoted: true,
    timestamp: '3 days ago'
  },
  {
    id: 'song-3',
    title: 'Volare (Nel Blu Dipinto Di Blu)',
    artist: 'Domenico Modugno',
    suggestedBy: 'Marco & Beatrice Rossi',
    genre: 'Italian Classics',
    dedication: 'An absolute Como anthem to sing at the top of our lungs with Aperol in hand!',
    votes: 31,
    hasVoted: true,
    timestamp: '5 days ago'
  },
  {
    id: 'song-4',
    title: 'Can’t Take My Eyes Off You',
    artist: 'Frankie Valli',
    suggestedBy: 'Arthur & Genevieve Vance',
    genre: 'Reception Party',
    dedication: 'With our fondest parental memories and all our love.',
    votes: 15,
    hasVoted: false,
    timestamp: '1 week ago'
  },
  {
    id: 'song-5',
    title: 'At Last',
    artist: 'Etta James',
    suggestedBy: 'Eleanor (The Bride)',
    genre: 'Slow Dance & Romance',
    dedication: 'My heart has finally come home with Julian.',
    votes: 42,
    hasVoted: true,
    timestamp: '1 week ago'
  },
  {
    id: 'song-6',
    title: 'You Make My Dreams',
    artist: 'Daryl Hall & John Oates',
    suggestedBy: 'Sebastien & Leo',
    genre: 'Reception Party',
    dedication: 'Pure joy! Play this when the midnight gelato arrives.',
    votes: 11,
    hasVoted: false,
    timestamp: 'Just now'
  }
];

export const INITIAL_SEATING_TABLES: SeatingTable[] = [
  {
    id: 'tbl-1',
    tableNumber: 1,
    name: 'Tavolo Bellagio',
    tagline: 'The Head Table & Wedding Party',
    shape: 'head',
    capacity: 6,
    location: 'Central Glass Pavilion Alcove with Lake Views',
    centerpieceNote: 'Cascading white peonies, olive branches, and burnt orange silk table runners with gold beeswax tapers.',
    guests: [
      { name: 'Julian Vance', role: 'The Groom' },
      { name: 'Eleanor St. Claire', role: 'The Bride' },
      { name: 'Lucas Vance', role: 'Best Man', rsvpId: 'rsvp-1' },
      { name: 'Dr. Chloe Aris', role: 'Wedding Party', rsvpId: 'rsvp-1' },
      { name: 'Seraphina Fontaine', role: 'Maid of Honor', rsvpId: 'rsvp-2' },
      { name: 'Elena Rostova', role: 'Floral Designer & Friend' },
    ],
    x: 50,
    y: 22,
  },
  {
    id: 'tbl-2',
    tableNumber: 2,
    name: 'Tavolo Villa d’Este',
    tagline: 'Vance & St. Claire Family',
    shape: 'round',
    capacity: 8,
    location: 'North Verandah overlooking Bellagio',
    centerpieceNote: 'Sculpted alabaster urns with emerald cypress sprigs, white garden roses, and vintage silver candelabras.',
    guests: [
      { name: 'Arthur Vance', role: 'Father of the Groom', rsvpId: 'rsvp-4' },
      { name: 'Genevieve Vance', role: 'Mother of the Groom', rsvpId: 'rsvp-4' },
      { name: 'Lord Henry St. Claire', role: 'Father of the Bride' },
      { name: 'Lady Vivienne St. Claire', role: 'Mother of the Bride' },
      { name: 'Uncle Roberto', role: 'Family Elder' },
      { name: 'Aunt Clara', role: 'Family' },
    ],
    x: 25,
    y: 45,
  },
  {
    id: 'tbl-3',
    tableNumber: 3,
    name: 'Tavolo Tremezzo',
    tagline: 'Italian & Lakeside Companions',
    shape: 'round',
    capacity: 8,
    location: 'South Terrace Garden Colonnade',
    centerpieceNote: 'Handmade terracotta compotes filled with burnt orange garden dahlias, citrus branches, and olive leaves.',
    guests: [
      { name: 'Marco Rossi', role: 'Family Friend', rsvpId: 'rsvp-3' },
      { name: 'Beatrice Rossi', role: 'Family Friend', rsvpId: 'rsvp-3' },
      { name: 'Matteo', role: 'Lake Como Resident' },
      { name: 'Sofia', role: 'Guest' },
      { name: 'Camilla', role: 'Wedding Planner & Honored Guest' },
      { name: 'Giancarlo Bellini', role: 'Guest' },
    ],
    x: 75,
    y: 45,
  },
  {
    id: 'tbl-4',
    tableNumber: 4,
    name: 'Tavolo Varenna',
    tagline: 'University & Adventure Companions',
    shape: 'round',
    capacity: 8,
    location: 'Lakeside Arched Loggia',
    centerpieceNote: 'Floating candle bowls with white water lilies, emerald moss, and terracotta votives.',
    guests: [
      { name: 'Sebastien', role: 'Oxford Friend' },
      { name: 'Leo', role: 'Oxford Friend' },
      { name: 'Gabriel', role: 'Friend' },
      { name: 'Noah', role: 'Friend' },
      { name: 'Nicholas', role: 'Friend' },
      { name: 'Helena', role: 'Friend' },
    ],
    x: 35,
    y: 72,
  },
  {
    id: 'tbl-5',
    tableNumber: 5,
    name: 'Tavolo Menaggio',
    tagline: 'Honored Colleagues & Global Guests',
    shape: 'round',
    capacity: 8,
    location: 'East Terrace Rose Garden',
    centerpieceNote: 'Woven olive leaf wreaths with crisp white ranunculus and burnt orange ribbon accents.',
    guests: [
      { name: 'Dr. Campbell', role: 'Family Physician' },
      { name: 'Eleanor Campbell', role: 'Guest' },
      { name: 'Lady Genevieve Sterling', role: 'Honored Guest' },
      { name: 'Captain Alistair Finch', role: 'Guest' },
    ],
    x: 65,
    y: 72,
  },
];

