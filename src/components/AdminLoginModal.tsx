import React, { useState } from 'react';
import { KeyRound, LockKeyhole, Mail, ShieldCheck, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await onLogin(email, password);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-[#03180f]/70 p-4 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#E7C56A]/35 bg-[#FDFBF7]/95 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-8">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700" aria-label="Close admin login">
          <X className="h-4 w-4" />
        </button>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E7C56A]/45 bg-[#063b2b] shadow-lg">
            <ShieldCheck className="h-7 w-7 text-[#E7C56A]" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C85A17]">Private access</p>
          <h2 className="mt-1 font-serif text-3xl text-[#0F5132]">Admin Portal</h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">Sign in to manage wedding information and guest responses.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0F5132]"><Mail className="h-3.5 w-3.5" /> Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required className="w-full rounded-xl border border-[#0F5132]/20 bg-white px-3.5 py-3 text-sm text-stone-800 outline-none transition focus:border-[#C85A17] focus:ring-2 focus:ring-[#C85A17]/15" />
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0F5132]"><LockKeyhole className="h-3.5 w-3.5" /> Password</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required className="w-full rounded-xl border border-[#0F5132]/20 bg-white px-3.5 py-3 text-sm text-stone-800 outline-none transition focus:border-[#C85A17] focus:ring-2 focus:ring-[#C85A17]/15" />
          </label>
          {error && <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#063b2b] px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#0F5132] disabled:cursor-not-allowed disabled:opacity-60">
            <KeyRound className="h-4 w-4 text-[#E7C56A]" />
            {isSubmitting ? 'Signing in…' : 'Enter portal'}
          </button>
        </form>
      </div>
    </div>
  );
};
