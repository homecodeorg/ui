import type { ImgHTMLAttributes, ReactNode } from 'react';

export type Props = ImgHTMLAttributes<HTMLImageElement> & {
  /**
   * Rendered instead of the image when it fails to load. Defaults to a
   * broken-image icon. Pass `null` to render nothing.
   */
  fallback?: ReactNode;
  /** Class for the default fallback wrapper. */
  fallbackClassName?: string;
};
