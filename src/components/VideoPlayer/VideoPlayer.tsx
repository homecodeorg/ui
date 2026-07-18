import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import cn from 'classnames';

import { Button } from 'uilib/components/Button/Button';
import { Icon } from 'uilib/components/Icon/Icon';
import { Popup } from 'uilib/components/Popup/Popup';
import { ProgressCircular } from 'uilib/components/ProgressCircular/ProgressCircular';
import { Slider } from 'uilib/components/Slider/Slider';
import useEvent from 'uilib/hooks/useEvent';
import debounce from 'uilib/tools/debounce';

import S from './VideoPlayer.styl';
import * as H from './VideoPlayer.helpers';
import * as T from './VideoPlayer.types';

export type VideoPlayerProps = T.Props;

let activePlayerId: string | null = null;

export function VideoPlayer({
  src,
  poster,
  storageKey,
  size = 'm',
  autoPlay = false,
  muted = false,
  loop = false,
  className,
  onPlayChange,
  onTimeUpdate,
}: T.Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progressInputRef = useRef<HTMLInputElement>(null);
  const currentTimeLabelRef = useRef<HTMLSpanElement>(null);
  const isSeekingRef = useRef(false);
  const durationRef = useRef(0);
  const rafRef = useRef(0);
  const volumeKeepOpenRef = useRef(false);
  const volumeHideTimerRef = useRef(0);
  const lastTapRef = useRef(0);
  const singleClickTimerRef = useRef(0);

  const playerId = useMemo(
    () => storageKey ?? src ?? Math.random().toString(36).slice(2),
    [storageKey, src]
  );
  const lsKey = H.getStorageKey(src, storageKey);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [isVolumePopupOpen, setIsVolumePopupOpen] = useState(false);

  const showControlsBar = !isPlaying || isHovered || isVolumePopupOpen;

  const persistTime = useMemo(
    () =>
      debounce((time: number) => {
        H.saveStorage(lsKey, { currentTime: time });
      }, H.TIME_PERSIST_DEBOUNCE_MS),
    [lsKey]
  );

  const persistVolume = useCallback(
    (nextVolume: number) => {
      H.saveStorage(lsKey, { volume: nextVolume });
    },
    [lsKey]
  );

  const syncProgressDom = useCallback((time: number) => {
    const duration = durationRef.current;
    const input = progressInputRef.current;
    const label = currentTimeLabelRef.current;
    const pct = H.timeToProgressPct(time, duration);

    if (input) {
      if (input.valueAsNumber !== time) input.value = String(time);
      input.style.setProperty('--progress', pct);
    }
    if (label) label.textContent = H.formatTime(time);
  }, []);

  const claimKeyboard = useCallback(() => {
    activePlayerId = playerId;
  }, [playerId]);

  const clearVolumeHideTimer = useCallback(() => {
    window.clearTimeout(volumeHideTimerRef.current);
  }, []);

  const openVolumePopup = useCallback(() => {
    volumeKeepOpenRef.current = true;
    clearVolumeHideTimer();
    setIsVolumePopupOpen(true);
  }, [clearVolumeHideTimer]);

  const releaseVolumePopup = useCallback(
    (delay = 0) => {
      volumeKeepOpenRef.current = false;
      clearVolumeHideTimer();
      volumeHideTimerRef.current = window.setTimeout(() => {
        if (!volumeKeepOpenRef.current) setIsVolumePopupOpen(false);
      }, delay);
    },
    [clearVolumeHideTimer]
  );

  const flashVolumePopup = useCallback(() => {
    setIsVolumePopupOpen(true);
    clearVolumeHideTimer();
    volumeHideTimerRef.current = window.setTimeout(() => {
      if (!volumeKeepOpenRef.current) setIsVolumePopupOpen(false);
    }, H.VOLUME_POPUP_HIDE_MS);
  }, [clearVolumeHideTimer]);

  const applyVolume = useCallback(
    (next: number, { flashPopup = false } = {}) => {
      const video = videoRef.current;
      const clamped = H.clamp(next, 0, 1);
      setVolume(clamped);
      if (video) video.volume = clamped;
      persistVolume(clamped);
      if (flashPopup) flashVolumePopup();
    },
    [persistVolume, flashVolumePopup]
  );

  const seekBy = useCallback(
    (delta: number) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration)) return;

      const next = H.clamp(video.currentTime + delta, 0, video.duration);
      video.currentTime = next;
      syncProgressDom(next);
      persistTime(next);
      onTimeUpdate?.(next, video.duration || 0);
    },
    [syncProgressDom, persistTime, onTimeUpdate]
  );

  const seekTo = useCallback(
    (time: number) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration)) return;

      const next = H.clamp(time, 0, video.duration);
      video.currentTime = next;
      syncProgressDom(next);
    },
    [syncProgressDom]
  );

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !isReady) return;

    claimKeyboard();

    if (video.paused) {
      try {
        await video.play();
      } catch {
        // Autoplay / play() can reject; ignore.
      }
    } else {
      video.pause();
    }
  }, [claimKeyboard, isReady]);

  const toggleFullscreen = useCallback(async () => {
    const root = rootRef.current;
    if (!root) return;

    claimKeyboard();

    try {
      if (document.fullscreenElement === root) {
        await document.exitFullscreen();
      } else {
        await root.requestFullscreen();
      }
    } catch {
      // Fullscreen may be blocked by the browser.
    }
  }, [claimKeyboard]);

  const debouncedSeekLeft = useMemo(
    () =>
      H.leadingDebounce(() => {
        const duration = videoRef.current?.duration ?? 0;
        seekBy(-H.getSeekDelta(duration));
      }, H.KEYBOARD_DEBOUNCE_MS),
    [seekBy]
  );
  const debouncedSeekRight = useMemo(
    () =>
      H.leadingDebounce(() => {
        const duration = videoRef.current?.duration ?? 0;
        seekBy(H.getSeekDelta(duration));
      }, H.KEYBOARD_DEBOUNCE_MS),
    [seekBy]
  );

  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  const debouncedVolumeUp = useMemo(
    () =>
      H.leadingDebounce(
        () =>
          applyVolume(volumeRef.current + H.VOLUME_STEP, { flashPopup: true }),
        H.KEYBOARD_DEBOUNCE_MS
      ),
    [applyVolume]
  );
  const debouncedVolumeDown = useMemo(
    () =>
      H.leadingDebounce(
        () =>
          applyVolume(volumeRef.current - H.VOLUME_STEP, { flashPopup: true }),
        H.KEYBOARD_DEBOUNCE_MS
      ),
    [applyVolume]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (activePlayerId !== playerId) return;
      if (H.isEditableTarget(e.target)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          debouncedSeekLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          debouncedSeekRight();
          break;
        case 'ArrowUp':
          e.preventDefault();
          debouncedVolumeUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          debouncedVolumeDown();
          break;
        default:
          break;
      }
    },
    [
      playerId,
      togglePlay,
      debouncedSeekLeft,
      debouncedSeekRight,
      debouncedVolumeUp,
      debouncedVolumeDown,
    ]
  );

  useEvent({
    event: 'keydown',
    callback: onKeyDown as (event: Event) => void,
    isActive: true,
  });

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === rootRef.current);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      if (activePlayerId === playerId) activePlayerId = null;
      clearVolumeHideTimer();
      window.clearTimeout(singleClickTimerRef.current);
    };
  }, [playerId, clearVolumeHideTimer]);

  // Sync DOM progress after controls mount / duration known.
  useEffect(() => {
    if (!isReady) return;
    const video = videoRef.current;
    if (video) syncProgressDom(video.currentTime);
  }, [isReady, duration, syncProgressDom]);

  // Realtime progress via rAF — no React state for currentTime.
  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = () => {
      const video = videoRef.current;
      if (video && !isSeekingRef.current) {
        const time = video.currentTime;
        syncProgressDom(time);
        onTimeUpdate?.(time, video.duration || 0);
        persistTime(time);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, syncProgressDom, onTimeUpdate, persistTime]);

  useEffect(() => {
    setIsReady(false);
    setIsPlaying(false);
    setLoadProgress(0);
    setDuration(0);
    durationRef.current = 0;
    activePlayerId = playerId;
    syncProgressDom(0);

    const stored = H.loadStorage(lsKey);
    if (typeof stored.volume === 'number') {
      setVolume(H.clamp(stored.volume, 0, 1));
    }
  }, [src, lsKey, playerId, syncProgressDom]);

  const onLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const stored = H.loadStorage(lsKey);
    const nextVolume =
      typeof stored.volume === 'number'
        ? H.clamp(stored.volume, 0, 1)
        : video.volume;

    video.volume = nextVolume;
    setVolume(nextVolume);

    const nextDuration = video.duration || 0;
    durationRef.current = nextDuration;
    setDuration(nextDuration);

    let time = 0;
    if (
      typeof stored.currentTime === 'number' &&
      stored.currentTime > 0 &&
      Number.isFinite(nextDuration)
    ) {
      time = H.clamp(stored.currentTime, 0, nextDuration);
      video.currentTime = time;
    }

    syncProgressDom(time);
    setLoadProgress(H.getBufferedPercent(video));
  }, [lsKey, syncProgressDom]);

  const onProgress = useCallback(() => {
    setLoadProgress(H.getBufferedPercent(videoRef.current));
  }, []);

  const onCanPlay = useCallback(() => {
    setIsReady(true);
    setLoadProgress(100);
  }, []);

  const onPlay = useCallback(() => {
    setIsPlaying(true);
    onPlayChange?.(true);
  }, [onPlayChange]);

  const onPause = useCallback(() => {
    setIsPlaying(false);
    onPlayChange?.(false);
    const video = videoRef.current;
    if (video) {
      syncProgressDom(video.currentTime);
      persistTime(video.currentTime);
    }
  }, [onPlayChange, persistTime, syncProgressDom]);

  const onEnded = useCallback(() => {
    setIsPlaying(false);
    onPlayChange?.(false);
    const video = videoRef.current;
    if (video) syncProgressDom(video.currentTime);
  }, [onPlayChange, syncProgressDom]);

  const onRootKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.code === 'Space' || e.code.startsWith('Arrow')) {
        claimKeyboard();
      }
    },
    [claimKeyboard]
  );

  const onSeekPointerDown = useCallback(() => {
    isSeekingRef.current = true;
  }, []);

  const onSeekPointerUp = useCallback(() => {
    isSeekingRef.current = false;
    const video = videoRef.current;
    if (!video) return;
    syncProgressDom(video.currentTime);
    persistTime(video.currentTime);
    onTimeUpdate?.(video.currentTime, video.duration || 0);
  }, [syncProgressDom, persistTime, onTimeUpdate]);

  const onSeekChange = useCallback(
    (value: number) => {
      seekTo(value);
      if (currentTimeLabelRef.current) {
        currentTimeLabelRef.current.textContent = H.formatTime(value);
      }
    },
    [seekTo]
  );

  // Single tap/click → play/pause (delayed). Double → fullscreen.
  const onVideoSurfaceActivate = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < H.DOUBLE_TAP_MS) {
      window.clearTimeout(singleClickTimerRef.current);
      lastTapRef.current = 0;
      toggleFullscreen();
      return;
    }

    lastTapRef.current = now;
    window.clearTimeout(singleClickTimerRef.current);
    singleClickTimerRef.current = window.setTimeout(() => {
      lastTapRef.current = 0;
      togglePlay();
    }, H.DOUBLE_TAP_MS);
  }, [toggleFullscreen, togglePlay]);

  const volumeIcon = volume <= 0 ? 'volumeOff' : 'volume';

  return (
    <div
      ref={rootRef}
      className={cn(
        S.root,
        isFullscreen && S.fullscreen,
        S[`size-${size}`],
        className
      )}
      tabIndex={0}
      onPointerDown={claimKeyboard}
      onFocus={claimKeyboard}
      onKeyDown={onRootKeyDown}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <div className={S.videoWrap} onClick={onVideoSurfaceActivate}>
        <video
          ref={videoRef}
          className={S.video}
          src={src}
          poster={poster}
          muted={muted}
          loop={loop}
          autoPlay={autoPlay}
          playsInline
          preload="auto"
          onLoadedMetadata={onLoadedMetadata}
          onProgress={onProgress}
          onCanPlay={onCanPlay}
          onPlay={onPlay}
          onPause={onPause}
          onEnded={onEnded}
        />
        {!isReady && (
          <div className={S.loading}>
            <ProgressCircular value={loadProgress} size="l" showPercentage />
          </div>
        )}

        {isReady && (
          <div
            className={cn(S.controls, !showControlsBar && S.controlsCompact)}
            onClick={e => e.stopPropagation()}
          >
            <div className={S.progressRow}>
              <Slider
                className={S.progress}
                inputRef={progressInputRef}
                min={0}
                max={duration || 1}
                step={0.01}
                defaultValue={0}
                size={size}
                showGhost
                aria-label="Playback progress"
                disabled={!duration}
                onPointerDown={onSeekPointerDown}
                onPointerUp={onSeekPointerUp}
                onChange={onSeekChange}
              />
            </div>

            <div ref={barRef} className={S.bar}>
              <Button
                variant="text"
                size={size}
                square
                aria-label={isPlaying ? 'Pause' : 'Play'}
                onClick={togglePlay}
              >
                <Icon type={isPlaying ? 'pause' : 'play'} size={size} />
              </Button>

              <span className={S.time}>
                <span ref={currentTimeLabelRef}>0:00</span>
                {' / '}
                {H.formatTime(duration)}
              </span>

              <Popup
                className={S.volumeControl}
                isOpen={isVolumePopupOpen}
                direction="top"
                size="s"
                blur
                round
                elevation={1}
                animated
                trigger={
                  <Button
                    variant="text"
                    size={size}
                    square
                    aria-label="Volume"
                    aria-valuenow={Math.round(volume * 100)}
                    onFocus={openVolumePopup}
                    onBlur={() => releaseVolumePopup(H.VOLUME_POPUP_HIDE_MS)}
                  >
                    <Icon type={volumeIcon} size={size} />
                  </Button>
                }
                triggerProps={{
                  onPointerEnter: openVolumePopup,
                  onPointerLeave: () =>
                    releaseVolumePopup(H.VOLUME_POPUP_HIDE_MS),
                }}
                content={
                  <div
                    className={S.volumePopup}
                    onPointerEnter={openVolumePopup}
                    onPointerLeave={() =>
                      releaseVolumePopup(H.VOLUME_POPUP_HIDE_MS)
                    }
                  >
                    <div className={S.volumeSliderWrap}>
                      <Slider
                        className={S.volumeSlider}
                        vertical
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        size={size}
                        aria-label="Volume level"
                        onChange={value => applyVolume(value)}
                      />
                    </div>
                  </div>
                }
              />

              <Button
                variant="text"
                size={size}
                square
                aria-label={
                  isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'
                }
                onClick={toggleFullscreen}
              >
                <Icon
                  type={isFullscreen ? 'fullscreenExit' : 'fullscreen'}
                  size={size}
                />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
