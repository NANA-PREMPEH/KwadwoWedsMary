import React, { useState } from 'react';
import { Cookie, Settings2, X } from 'lucide-react';

type CookiePreferences = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
};

const COOKIE_NAME = 'kwadwo_weds_mary_cookie_preferences';
const ONE_YEAR = 60 * 60 * 24 * 365;

const readPreferences = (): CookiePreferences | null => {
  const value = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`))
    ?.split('=')[1];

  if (!value) return null;

  try {
    return JSON.parse(decodeURIComponent(value)) as CookiePreferences;
  } catch {
    return null;
  }
};

const savePreferences = (preferences: CookiePreferences) => {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(preferences))}; max-age=${ONE_YEAR}; path=/; SameSite=Lax`;
};

export const CookieConsent: React.FC = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>(() =>
    readPreferences() ?? { necessary: true, functional: true, analytics: false }
  );
  const [isVisible, setIsVisible] = useState(() => readPreferences() === null);
  const [isManaging, setIsManaging] = useState(false);

  const confirm = (nextPreferences: CookiePreferences) => {
    savePreferences(nextPreferences);
    setPreferences(nextPreferences);
    setIsVisible(false);
    setIsManaging(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#E7C56A]/35 bg-[#063b2b]/88 p-5 text-[#F8F3E8] shadow-[0_20px_55px_rgba(1,20,13,0.42)] backdrop-blur-2xl sm:bottom-5 sm:p-6"
      role="dialog"
      aria-label="Cookie preferences"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={() => confirm({ necessary: true, functional: false, analytics: false })}
        className="absolute right-3 top-3 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Use essential cookies only and close"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col gap-5 pr-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-3xl gap-4">
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E7C56A]/35 bg-[#E7C56A]/10 text-[#E7C56A]">
            <Cookie className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl leading-tight text-[#FFF9ED]">Cookie Preferences</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#E7EFEA]/80">
              We use essential cookies to keep this invitation working and optional cookies to remember your experience. You can choose what is allowed.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 lg:justify-end">
          <button
            type="button"
            onClick={() => setIsManaging((open) => !open)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/15"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Manage
          </button>
          <button
            type="button"
            onClick={() => confirm({ necessary: true, functional: false, analytics: false })}
            className="rounded-xl border border-[#E7C56A]/60 bg-transparent px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#FFF9ED] transition-colors hover:bg-white/10"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => confirm({ necessary: true, functional: true, analytics: true })}
            className="rounded-xl bg-[#E7C56A] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#063b2b] transition-colors hover:bg-[#F5D77C]"
          >
            Accept all
          </button>
        </div>
      </div>

      {isManaging && (
        <div className="mt-5 grid gap-3 border-t border-white/15 pt-5 sm:grid-cols-3">
          <PreferenceCard title="Essential" description="Required for security and core site functions." checked disabled onChange={() => undefined} />
          <PreferenceCard
            title="Functional"
            description="Remembers choices such as your theme and invitation settings."
            checked={preferences.functional}
            onChange={(checked) => setPreferences((current) => ({ ...current, functional: checked }))}
          />
          <PreferenceCard
            title="Analytics"
            description="Helps us understand visits. No analytics service is currently active."
            checked={preferences.analytics}
            onChange={(checked) => setPreferences((current) => ({ ...current, analytics: checked }))}
          />
          <div className="sm:col-span-3 flex justify-end pt-1">
            <button
              type="button"
              onClick={() => confirm(preferences)}
              className="rounded-xl bg-[#E7C56A] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#063b2b] hover:bg-[#F5D77C]"
            >
              Save preferences
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

interface PreferenceCardProps {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

const PreferenceCard: React.FC<PreferenceCardProps> = ({ title, description, checked, disabled = false, onChange }) => (
  <label className="flex cursor-pointer gap-3 rounded-xl border border-white/15 bg-white/[0.06] p-3.5 transition-colors hover:bg-white/[0.09]">
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
      className="mt-1 h-4 w-4 accent-[#E7C56A] disabled:cursor-not-allowed"
    />
    <span>
      <span className="block text-sm font-semibold text-[#FFF9ED]">{title}</span>
      <span className="mt-0.5 block text-xs leading-relaxed text-[#E7EFEA]/70">{description}</span>
    </span>
  </label>
);
