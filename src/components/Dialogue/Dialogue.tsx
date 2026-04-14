import cn from 'classnames';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from 'uilib/components/Card/Card';
import { Icon } from 'uilib/components/Icon/Icon';
import { isBrowser } from 'uilib/tools/env';

import S from './Dialogue.styl';
import type { Props as DialogueProps } from './Dialogue.types';

const FOOTER_ALIGN_CLASS: Record<
  NonNullable<DialogueProps['footerAlignment']>,
  string
> = {
  left: S.footerAlignLeft,
  center: S.footerAlignCenter,
  right: S.footerAlignRight,
};

export function Dialogue({
  open,
  onOpenChange,
  disabled,
  trigger,
  title,
  subtitle,
  icon,
  content,
  contentClassName,
  footer,
  footerAlignment = 'center',
  size = 'default',
  className,
  noScroll,
  maxHeight,
  autoScrollBottom,
  width,
}: DialogueProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(false);
        });
      });
    } else {
      setIsAnimating(true);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !dialogRef.current) return;

    const previousActiveElement = document.activeElement as HTMLElement;

    const focusableElements = dialogRef.current.querySelectorAll<
      HTMLButtonElement | HTMLAnchorElement | HTMLInputElement
    >(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (firstFocusable) {
      firstFocusable.focus();
    } else {
      dialogRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
        return;
      }

      if (e.key === 'Tab' && focusableElements.length > 0) {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement?.focus) {
        previousActiveElement.focus();
      }
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [open]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  const handleCloseClick = () => {
    onOpenChange(false);
  };

  const onTriggerClick = !disabled ? () => onOpenChange(true) : undefined;

  const dialogueContent = (
    <>
      <div
        className={cn(S.dialogOverlay, open && !isAnimating && S.isOpen)}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      <Card
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={subtitle ? descriptionId : undefined}
        className={cn(
          S.dialogContent,
          S[`size-${size}`],
          open && !isAnimating && S.isOpen,
          !open && isAnimating && S.isClosed,
          className
        )}
        tabIndex={-1}
        style={{
          width,
          maxHeight: maxHeight
            ? `min(${String(maxHeight)}, calc(100% - var(--p-5)))`
            : undefined,
        }}
      >
        {(title || subtitle || icon) && (
          <CardHeader
            icon={icon}
            title={title}
            description={subtitle}
            titleId={titleId}
            descriptionId={descriptionId}
          />
        )}

        <button
          className={S.dialogClose}
          onClick={handleCloseClick}
          aria-label="Close dialog"
          type="button"
        >
          <Icon type="close" size="m" />
        </button>

        {content && (
          <CardContent
            className={contentClassName}
            noScroll={noScroll}
            autoScrollBottom={autoScrollBottom}
          >
            {content}
          </CardContent>
        )}

        {footer && (
          <CardFooter className={FOOTER_ALIGN_CLASS[footerAlignment]}>
            {footer}
          </CardFooter>
        )}
      </Card>
    </>
  );

  return (
    <>
      {trigger && <div onClick={onTriggerClick}>{trigger}</div>}
      {open &&
        !disabled &&
        isMounted &&
        isBrowser &&
        createPortal(dialogueContent, document.body)}
    </>
  );
}

export { default as DialogueStyles } from './Dialogue.styl';
