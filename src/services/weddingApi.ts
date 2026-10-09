import { RsvpEntry, WeddingPhoto } from '../types/wedding';

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
  getPhotos: () => request<WeddingPhoto[]>('/photos'),
  savePhoto: (photo: WeddingPhoto) => request<WeddingPhoto>('/photos', {
    method: 'POST',
    body: JSON.stringify(photo),
  }),
};
