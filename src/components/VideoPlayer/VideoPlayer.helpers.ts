import LS from 'uilib/tools/localStorage';

export type VideoPlayerStorage = {
  currentTime?: number;
  volume?: number;
};

export const SEEK_MAX_SEC = 5;
export const SEEK_DURATION_RATIO = 0.1;
export const VOLUME_STEP = 0.1;
export const VOLUME_POPUP_HIDE_MS = 500;
export const KEYBOARD_DEBOUNCE_MS = 30;
export const TIME_PERSIST_DEBOUNCE_MS = 500;
export const DOUBLE_TAP_MS = 300;

/** Keyboard seek step: min(5s, 10% of duration). */
export function getSeekDelta(duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return SEEK_MAX_SEC;
  return Math.min(SEEK_MAX_SEC, duration * SEEK_DURATION_RATIO);
}

export function timeToProgressPct(time: number, duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return '0%';
  return `${(clamp(time, 0, duration) / duration) * 100}%`;
}

export function getStorageKey(src: string, storageKey?: string) {
  return storageKey ?? `VideoPlayer:${src}`;
}

export function loadStorage(key: string): VideoPlayerStorage {
  const stored = LS.get(key);
  if (!stored || typeof stored !== 'object') return {};
  return stored as VideoPlayerStorage;
}

export function saveStorage(key: string, data: VideoPlayerStorage) {
  const prev = loadStorage(key);
  LS.set(key, { ...prev, ...data });
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';

  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = h > 0 ? String(m).padStart(2, '0') : String(m);
  const ss = String(s).padStart(2, '0');

  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function getBufferedPercent(video: HTMLVideoElement | null) {
  if (!video || !video.duration || !video.buffered.length) return 0;

  try {
    const end = video.buffered.end(video.buffered.length - 1);
    return Math.min(100, Math.max(0, (end / video.duration) * 100));
  } catch {
    return 0;
  }
}

export function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Leading debounce: run immediately, then ignore calls for `ms`. */
export function leadingDebounce<T extends (...args: any[]) => void>(
  fn: T,
  ms: number
): T {
  let locked = false;

  return ((...args: Parameters<T>) => {
    if (locked) return;
    locked = true;
    fn(...args);
    setTimeout(() => {
      locked = false;
    }, ms);
  }) as T;
}
