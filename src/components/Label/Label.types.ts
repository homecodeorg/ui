export type Props = {
  className?: string;
  size?: string;
  children: string;
  isOnTop: boolean;
  isError?: boolean;
  onClipPathChange?: (clipPath: string) => void;
};
