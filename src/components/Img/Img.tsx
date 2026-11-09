import cn from 'classnames';
import { useState } from 'react';

import { Icon } from '../Icon/Icon';

import S from './Img.styl';
import * as T from './Img.types';

export type ImgProps = T.Props;

/**
 * `<img>` that never shows the browser's broken-image glyph or its alt text:
 * when loading fails it renders `fallback` (a broken-image icon by default).
 */
export function Img({
  src,
  alt = '',
  fallback,
  fallbackClassName,
  className,
  onError,
  ...rest
}: T.Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  // Keyed by src, so a new src gets a fresh attempt.
  const isFailed = !src || failedSrc === src;

  if (isFailed) {
    if (fallback !== undefined) return <>{fallback}</>;
    return (
      <span
        className={cn(S.fallback, className, fallbackClassName)}
        role="img"
        aria-label={alt || undefined}
      >
        <Icon type="brokenImage" className={S.fallbackIcon} />
      </span>
    );
  }

  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      className={className}
      onError={event => {
        setFailedSrc(src);
        onError?.(event);
      }}
    />
  );
}
