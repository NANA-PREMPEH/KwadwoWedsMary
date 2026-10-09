import React, { useState } from 'react';
import { SongSuggestion, MusicGenre } from '../types/wedding';
import { soundEngine } from '../utils/audio';
import { Music, Play, Pause, Disc3, Heart, Plus, Sparkles, Volume2, VolumeX, ListMusic, ThumbsUp, Radio } from 'lucide-react';

interface MusicPlayerSectionProps {
  songs: SongSuggestion[];
  onAddSong: (song: SongSuggestion) => void;
  onVoteSong: (id: string) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
}

const QUICK_INSPIRATIONS = [
  { title: "Can't Help Falling In Love", artist: 'Elvis Presley', genre: 'Slow Dance & Romance' as MusicGenre },
  { title: 'That’s Amore', artist: 'Dean Martin', genre: 'Italian Classics' as MusicGenre },
  { title: 'Ain’t No Mountain High Enough', artist: 'Marvin Gaye & Tammi Terrell', genre: 'Groove & Disco' as MusicGenre },
  { title: 'Dancing Queen', artist: 'ABBA', genre: 'Reception Party' as MusicGenre },
  { title: 'Fly Me to the Moon', artist: 'Frank Sinatra', genre: 'Slow Dance & Romance' as MusicGenre },
];

export const MusicPlayerSection: React.FC<MusicPlayerSectionProps> = ({
  songs,
  onAddSong,
  onVoteSong,
  isAudioPlaying,
  onToggleAudio,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'top' | MusicGenre>('all');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [suggestedBy, setSuggestedBy] = useState('');
  const [genre, setGenre] = useState<MusicGenre>('Reception Party');
  const [dedication, setDedication] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !artist.trim() || !suggestedBy.trim()) return;

    const newSong: SongSuggestion = {
      id: `song-${Date.now()}`,
      title: title.trim(),
      artist: artist.trim(),
      suggestedBy: suggestedBy.trim(),
      genre,
      dedication: dedication.trim() || undefined,
      votes: 1,
      hasVoted: true,
      timestamp: 'Just now',
    };

    onAddSong(newSong);
    soundEngine.playNote(523.25, 0.8, 0.3, 'sine');
    setTimeout(() => soundEngine.playNote(659.25, 1.2, 0.35, 'sine'), 120);

    // Reset
    setTitle('');
    setArtist('');
    setDedication('');
    setShowForm(false);
  };

  const handleQuickAdd = (item: { title: string; artist: string; genre: MusicGenre }) => {
    setTitle(item.title);
    setArtist(item.artist);
    setGenre(item.genre);
    setShowForm(true);
  };

  const handlePlayPreview = (songId: string, songIdx: number) => {
    setPreviewingId(songId);
    // Web Audio preview chime scale
    const baseFreqs = [261.63, 329.63, 392.00, 523.25, 659.25];
    const root = baseFreqs[songIdx % baseFreqs.length];
    soundEngine.playNote(root, 0.6, 0.25, 'triangle');
    setTimeout(() => soundEngine.playNote(root * 1.25, 0.8, 0.25, 'sine'), 140);
    setTimeout(() => soundEngine.playNote(root * 1.5, 1.2, 0.3, 'sine'), 280);
    setTimeout(() => setPreviewingId(null), 1200);
  };

  // Filter songs
  const filteredSongs = [...songs].filter((s) => {
    if (selectedFilter === 'all' || selectedFilter === 'top') return true;
    return s.genre === selectedFilter;
  });

  // Sort
  if (selectedFilter === 'top') {
    filteredSongs.sort((a, b) => b.votes - a.votes);
  }

  const genresList: MusicGenre[] = [
    'Slow Dance & Romance',
    'Groove & Disco',
    'Italian Classics',
    'Reception Party',
    'Late Night Anthems'
  ];

  return (
    <section id="music-player" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[#C85A17] font-semibold mb-2 font-sans">
          <Radio className="w-3.5 h-3.5" />
          <span>Reception Playlist & DJ Queue</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#0F5132] font-normal">
          The Wedding Music Player
        </h2>
        <div className="flex items-center justify-center gap-1.5 my-4">
          <span className="w-8 h-0.5 bg-[#C85A17]" />
          <span className="w-2 h-2 rounded-full bg-[#0F5132]" />
          <span className="w-8 h-0.5 bg-[#C85A17]" />
        </div>
        <p className="font-serif italic text-base text-[#524438] max-w-xl mx-auto">
          Help craft the soundtrack to our Lake Como celebration! Suggest your favorite songs, vote for dance floor anthems, and listen along.
        </p>
      </div>

      {/* Hero Turntable / Now Playing Experience Bar */}
      <div className="glass-strong backdrop-blur-2xl rounded-3xl border border-[#C85A17]/30 p-6 sm:p-8 shadow-xl shadow-[#0F5132]/6 ring-1 ring-[#0F5132]/10 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Turntable Disc Visual */}
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#082E1D] via-[#0F5132] to-[#144933] border-4 border-[#082E1D] shadow-xl flex items-center justify-center shrink-0">
              {/* Spinning Vinyl Grooves */}
              <div className={`w-full h-full rounded-full border border-dashed border-white/20 flex items-center justify-center ${isAudioPlaying ? 'animate-spin [animation-duration:6s]' : ''}`}>
                {/* Center Label in Burnt Orange */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#C85A17] border-2 border-white flex items-center justify-center shadow-inner">
                  <Disc3 className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-2 h-2 rounded-full bg-[#C85A17] animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-[#C85A17]">
                  {isAudioPlaying ? 'Now Playing Ambient Melody' : 'Reception Suite Player'}
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-[#0F5132] font-semibold">
                Julian & Eleanor’s Como Waltz
              </h3>
              <p className="text-xs text-stone-600 font-sans mt-0.5">
                Chopin Nocturne & Italian Acoustic Melodies · Web Audio Soundscape
              </p>
            </div>
          </div>

          {/* Interactive Player Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleAudio}
              className={`px-5 py-3 rounded-xl flex items-center gap-2.5 text-xs uppercase tracking-[0.18em] font-sans font-semibold transition-all cursor-pointer shadow-sm ${
                isAudioPlaying
                  ? 'bg-[#0F5132] text-white border border-[#C85A17]/50 shadow-md hover:bg-[#082E1D]'
                  : 'bg-[#C85A17] hover:bg-[#a0420b] text-white shadow-md'
              }`}
            >
              {isAudioPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause Music</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Music</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-3 rounded-xl glass glass-hover text-[#0F5132] border border-[#0F5132]/35 text-xs uppercase tracking-[0.18em] font-sans font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-xs hover:border-[#C85A17]"
            >
              <Plus className="w-4 h-4 text-[#C85A17]" />
              <span>Suggest a Song</span>
            </button>
          </div>

        </div>

        {/* Animated Equalizer Visualizer */}
        <div className="mt-6 pt-4 border-t border-[#C85A17]/15 flex items-center justify-between text-xs text-stone-500 font-sans">
          <div className="flex items-center gap-1.5 h-4">
            <span className="text-[11px] font-sans text-[#0F5132] font-semibold mr-2">Audio Ambiance:</span>
            {[40, 75, 55, 90, 65, 85, 45, 95, 70, 50, 80, 60].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-[#0F5132] rounded-full transition-all duration-300"
                style={{
                  height: isAudioPlaying ? `${h}%` : '20%',
                  opacity: isAudioPlaying ? 0.9 : 0.3
                }}
              />
            ))}
          </div>

          <span className="text-stone-500 text-[11px] tracking-wide">
            {songs.length} song recommendations queued for the reception
          </span>
        </div>
      </div>

      {/* Song Suggestion Form Drawer / Card */}
      {showForm && (
        <div className="glass-strong backdrop-blur-2xl rounded-3xl border border-[#C85A17]/40 p-6 sm:p-8 shadow-2xl max-w-2xl mx-auto mb-12 animate-fade-in ring-1 ring-[#0F5132]/15">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#C85A17]/20">
            <div className="flex items-center gap-2 text-[#0F5132]">
              <ListMusic className="w-5 h-5 text-[#C85A17]" />
              <h3 className="font-serif text-xl font-bold text-[#0F5132]">
                Suggest a Track for the DJ
              </h3>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="text-stone-400 hover:text-stone-700 text-xs uppercase tracking-wider font-medium cursor-pointer font-sans"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#524438] mb-1 font-sans">
                  Song Title <span className="text-[#C85A17]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Can't Stop the Feeling"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-[#2b241e]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#524438] mb-1 font-sans">
                  Artist or Band <span className="text-[#C85A17]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Justin Timberlake"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-[#2b241e]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#524438] mb-1 font-sans">
                  Your Name <span className="text-[#C85A17]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sofia & Matteo"
                  value={suggestedBy}
                  onChange={(e) => setSuggestedBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-[#2b241e]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#524438] mb-1 font-sans">
                  Dance Floor Mood
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value as MusicGenre)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-[#2b241e]"
                >
                  {genresList.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.16em] font-semibold text-[#524438] mb-1 font-sans">
                Dedication or Note for the Newlyweds
              </label>
              <input
                type="text"
                placeholder="e.g. Play this when the dessert tables open!"
                value={dedication}
                onChange={(e) => setDedication(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-[#2b241e]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0F5132] hover:bg-[#082E1D] text-white text-xs uppercase tracking-[0.2em] font-bold font-sans rounded-xl shadow-md transition-all cursor-pointer border border-[#C85A17]/40"
            >
              Add Track to Wedding Playlist
            </button>
          </form>
        </div>
      )}

      {/* Quick Inspiration Chips */}
      <div className="mb-8">
        <span className="text-[11px] uppercase tracking-[0.25em] text-stone-500 font-sans block mb-2 font-semibold">
          Quick Suggestions to Add with One Click:
        </span>
        <div className="flex flex-wrap gap-2">
          {QUICK_INSPIRATIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAdd(item)}
              className="px-3.5 py-1.5 rounded-full glass glass-hover border border-[#0F5132]/25 hover:border-[#C85A17] text-xs text-[#0F5132] hover:text-[#C85A17] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs font-sans"
            >
              <Plus className="w-3 h-3 text-[#C85A17]" />
              <span>{item.title} — {item.artist}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Playlist Controls & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 glass p-3 sm:p-4 rounded-2xl border border-[#C85A17]/25 shadow-xs backdrop-blur-xl">
        
        {/* Genre / Sorting filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-sans rounded-lg transition-colors cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-[#0F5132] text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-[#0F5132]'
            }`}
          >
            All Songs ({songs.length})
          </button>

          <button
            onClick={() => setSelectedFilter('top')}
            className={`px-3.5 py-1.5 text-xs font-sans rounded-lg transition-colors cursor-pointer ${
              selectedFilter === 'top'
                ? 'bg-[#C85A17] text-white font-semibold shadow-xs'
                : 'text-stone-600 hover:text-[#C85A17]'
            }`}
          >
            🔥 Top Voted
          </button>

          {genresList.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedFilter(g)}
              className={`hidden sm:inline-block px-3 py-1.5 text-xs font-sans rounded-lg transition-colors cursor-pointer ${
                selectedFilter === g
                  ? 'bg-[#0F5132] text-white font-semibold shadow-xs'
                  : 'text-stone-600 hover:text-[#0F5132]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Suggest Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-[#C85A17] hover:bg-[#a0420b] text-white text-xs uppercase tracking-[0.16em] font-semibold font-sans rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Song</span>
          </button>
        )}
      </div>

      {/* The Song Suggestions List */}
      <div className="space-y-3">
        {filteredSongs.map((song, idx) => (
          <div
            key={song.id}
            className="glass glass-hover p-4 sm:p-5 rounded-2xl border border-[#0F5132]/20 hover:border-[#C85A17]/60 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
          >
            {/* Song Info */}
            <div className="flex items-start gap-4">
              <button
                onClick={() => handlePlayPreview(song.id, idx)}
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                  previewingId === song.id
                    ? 'bg-[#C85A17] text-white border-[#C85A17] scale-105'
                    : 'bg-[#FDFBF7] text-[#0F5132] border-[#0F5132]/25 group-hover:border-[#C85A17]'
                }`}
                title="Play melodious harp preview snippet"
              >
                {previewingId === song.id ? (
                  <Sparkles className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-serif text-lg sm:text-xl font-semibold text-[#0F5132] leading-snug">
                    {song.title}
                  </h4>
                  <span className="text-xs text-stone-400 font-sans">by</span>
                  <span className="font-medium text-stone-800 text-sm">
                    {song.artist}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-stone-500 font-sans">
                  <span className="px-2 py-0.5 rounded-full bg-[#0F5132]/10 text-[#0F5132] text-[10px] uppercase font-bold tracking-wider">
                    {song.genre}
                  </span>
                  <span>·</span>
                  <span>Suggested by <strong className="text-[#2b241e] font-semibold">{song.suggestedBy}</strong></span>
                  <span>·</span>
                  <span className="text-stone-400">{song.timestamp}</span>
                </div>

                {song.dedication && (
                  <p className="font-serif italic text-xs text-[#C85A17] mt-1.5">
                    “{song.dedication}”
                  </p>
                )}
              </div>
            </div>

            {/* Voting / Love action */}
            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
              <button
                onClick={() => onVoteSong(song.id)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-sans font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  song.hasVoted
                    ? 'bg-[#C85A17]/10 text-[#C85A17] border-[#C85A17] ring-1 ring-[#C85A17]/30'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-[#C85A17] hover:text-[#C85A17]'
                }`}
                title="Vote to play this song at the reception"
              >
                <Heart className={`w-3.5 h-3.5 ${song.hasVoted ? 'fill-[#C85A17] text-[#C85A17]' : 'text-stone-400'}`} />
                <span>{song.votes} {song.votes === 1 ? 'vote' : 'votes'}</span>
              </button>
            </div>

          </div>
        ))}

        {filteredSongs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#0F5132]/15 p-8">
            <Music className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="font-serif text-lg text-[#0F5132]">No songs in this category yet</p>
            <p className="text-xs text-stone-400 mt-1">Be the first to suggest a track for this mood!</p>
          </div>
        )}
      </div>

    </section>
  );
};
