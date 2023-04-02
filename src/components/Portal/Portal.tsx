import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { config } from 'uilib/tools/config';

const DEFAULT_SELECTOR = `#${config.appOverlayId}`;

type Props = {
  // CSS selector of the element to render into
  selector?: string;
  // Children to render
  children: React.ReactNode;
};

export function Portal(props: Props) {
  const { selector = DEFAULT_SELECTOR, children } = props;
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    // prevent HTML mismatch between server and client
    setMounted(true);
  }, []);

  if (!isMounted) return null;

  return createPortal(<>{children}</>, document.querySelector(selector));
}
