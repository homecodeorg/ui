export type Props = {
  className?: string;
  size?: string;
  children: string;
  isOnTop: boolean;
  isFocused?: boolean;
  disabled?: boolean;
  isError?: boolean;
  onClipPathChange?: (clipPath: string) => void;
};
