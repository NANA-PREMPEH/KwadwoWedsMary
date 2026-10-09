export interface WeddingDetails {
  coupleNames: string;
  partnerOne: string;
  partnerTwo: string;
  date: string; // ISO date string or formatted
  targetDateTime: string; // ISO string for countdown
  ceremonyVenue: {
    name: string;
    tagline: string;
    address: string;
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
    googleMapsUrl: string;
    description: string;
  };
  receptionVenue: {
    name: string;
    address: string;
    description: string;
  };
  dressCode: {
    theme: string;
    description: string;
    colors: { name: string; hex: string }[];
  };
  hashtag: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  iconName: string;
}

export interface RsvpEntry {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  attending: 'accepted' | 'declined';
  partySize: number;
  guestNames?: string[];
  dietaryRestrictions: string[];
  dietaryNotes?: string;
  songRequest?: string;
  message?: string;
  submittedAt: string;
}

export type PhotoCategory = 'all' | 'ceremony' | 'cocktail' | 'dinner' | 'party' | 'candid';

export interface WeddingPhoto {
  id: string;
  url: string;
  caption: string;
  uploaderName: string;
  category: PhotoCategory;
  timestamp: string;
  likes: number;
  isLikedByUser?: boolean;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  date: string;
  avatarSeed?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export type MusicGenre =
  | 'Slow Dance & Romance'
  | 'Groove & Disco'
  | 'Italian Classics'
  | 'Reception Party'
  | 'Late Night Anthems';

export interface SongSuggestion {
  id: string;
  title: string;
  artist: string;
  suggestedBy: string;
  genre: MusicGenre;
  dedication?: string;
  votes: number;
  hasVoted?: boolean;
  timestamp: string;
}

export interface SeatedGuest {
  name: string;
  role?: string;
  rsvpId?: string;
}

export interface SeatingTable {
  id: string;
  tableNumber: number;
  name: string;
  tagline: string;
  shape: 'head' | 'round' | 'rectangular';
  capacity: number;
  location: string;
  centerpieceNote: string;
  guests: SeatedGuest[];
  x: number; // percentage coordinate for floor plan
  y: number;
}
