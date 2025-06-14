import { useLayoutEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { config } from 'uilib/tools/config';
import { isBrowser } from 'uilib/tools/env';

const DEFAULT_SELECTOR = `#${config.appOverlayId}`;

type Props = {
  // CSS selector of the element to render into
  selector?: string;
  // Children to render
  children: React.ReactNode;
};

export function Portal(props: Props) {
  const { selector = DEFAULT_SELECTOR, children } = props;

  // Start with immediate rendering if we're in browser
  const [isMounted, setMounted] = useState(isBrowser);

  useLayoutEffect(() => {
    // Ensure we're mounted on client side (handles SSR edge cases)
    setMounted(true);
  }, []);

  // Cache target element to avoid DOM queries on every render
  const targetElement = useMemo(() => {
    if (!isMounted) return null;
    return document.querySelector(selector);
  }, [selector, isMounted]);

  // Don't render if not mounted (prevents SSR hydration mismatch)
  if (!isMounted) return null;

  // Check if target element exists before rendering
  if (!targetElement) {
    console.warn(`Portal target element not found: ${selector}`);
    return null;
  }

  return createPortal(<>{children}</>, targetElement);
}
