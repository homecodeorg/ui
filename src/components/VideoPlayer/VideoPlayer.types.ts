import { ComponentType, Size } from 'uilib/types';

export type Props = ComponentType & {
  // Video source URL
  src: string;
  // Poster image URL shown before playback
  poster?: string;
  // localStorage key; defaults to `VideoPlayer:${src}`
  storageKey?: string;
  // Size of control buttons and progress slider
  size?: Size;
  // Autoplay after enough data is loaded
  autoPlay?: boolean;
  // Mute audio
  muted?: boolean;
  // Loop playback
  loop?: boolean;
  // Called when play/pause state changes
  onPlayChange?: (playing: boolean) => void;
  // Called when current time updates
  onTimeUpdate?: (currentTime: number, duration: number) => void;
};
