import { RsvpEntry, SeatingTable, WeddingAnnouncement, WeddingDetails, WeddingPhoto } from '../types/wedding';

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const weddingApi = {
  getRsvps: () => request<RsvpEntry[]>('/rsvps'),
  saveRsvp: (rsvp: RsvpEntry) => request<RsvpEntry>('/rsvps', {
    method: 'POST',
    body: JSON.stringify(rsvp),
  }),
  updateRsvp: (rsvp: RsvpEntry) => request<RsvpEntry>('/rsvps', { method: 'PATCH', body: JSON.stringify(rsvp) }),
  deleteRsvp: (id: string) => request<void>('/rsvps', { method: 'DELETE', body: JSON.stringify({ id }) }),
  getPhotos: () => request<WeddingPhoto[]>('/photos'),
  savePhoto: (photo: WeddingPhoto) => request<WeddingPhoto>('/photos', {
    method: 'POST',
    body: JSON.stringify(photo),
  }),
  deletePhoto: (id: string) => request<void>('/photos', { method: 'DELETE', body: JSON.stringify({ id }) }),
  getWeddingDetails: () => request<{ content: WeddingDetails | null }>('/content'),
  saveWeddingDetails: (details: WeddingDetails) => request<{ content: WeddingDetails }>('/content', {
    method: 'PUT',
    body: JSON.stringify({ details }),
  }),
  getSeatingTables: () => request<{ content: SeatingTable[] | null }>('/content?key=seating-tables'),
  saveSeatingTables: (tables: SeatingTable[]) => request<{ content: SeatingTable[] }>('/content', { method: 'PUT', body: JSON.stringify({ key: 'seating-tables', content: tables }) }),
  getAnnouncements: () => request<{ content: WeddingAnnouncement[] | null }>('/content?key=announcements'),
  saveAnnouncements: (announcements: WeddingAnnouncement[]) => request<{ content: WeddingAnnouncement[] }>('/content', { method: 'PUT', body: JSON.stringify({ key: 'announcements', content: announcements }) }),
  getAdminSession: () => request<{ authenticated: boolean }>('/auth/session'),
  loginAdmin: (email: string, password: string) => request<{ authenticated: boolean }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  logoutAdmin: () => request<{ authenticated: boolean }>('/auth/logout', { method: 'POST' }),
};
