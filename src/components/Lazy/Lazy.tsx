import { useEffect, useState, useRef, ComponentType } from 'react';
import Time from 'timen';

import { Spinner } from '../Spinner/Spinner';
import * as T from './Lazy.types';
import { Flex } from 'uilib/components/Flex/Flex';

function compare(cb1: T.Loader, cb2: T.Loader) {
  return cb1?.toString() === cb2?.toString();
}

const loaded = new Map<T.Loader, T.ImportData>();

export type LazyProps = T.Props;

function useLazy(loader: T.Loader, spinnerTimeout: number = 500) {
  const [loading, setLoading] = useState(() => {
    const cached = loaded.get(loader);
    return !cached;
  });
  const [spinnerTimeoutState, setSpinnerTimeoutState] = useState(() => {
    const cached = loaded.get(loader);
    return !!cached;
  });
  const [importData, setImportData] = useState<T.ImportData | undefined>(() =>
    loaded.get(loader)
  );
  const loaderRef = useRef(loader);
  const timeoutRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const cached = loaded.get(loader);

    // If already loaded, don't show loading state
    if (cached) {
      setImportData(cached);
      setLoading(false);
      setSpinnerTimeoutState(true);
      return;
    }

    // If loader changed, clear previous timeout
    if (!compare(loaderRef.current, loader)) {
      timeoutRef.current?.();
      timeoutRef.current = null;
    }

    loaderRef.current = loader;

    // Start loading
    setLoading(true);
    setSpinnerTimeoutState(false);

    timeoutRef.current = Time.after(spinnerTimeout, () => {
      setSpinnerTimeoutState(true);
    });

    loader().then((data: T.ImportData) => {
      // Check if loader hasn't changed during async operation
      if (!compare(loaderRef.current, loader)) return;

      loaded.set(loader, data);
      setImportData(data);
      setLoading(false);
    });

    return () => {
      timeoutRef.current?.();
    };
  }, [loader, spinnerTimeout]);

  return { loading, spinnerTimeout: spinnerTimeoutState, importData };
}

export function Lazy(props: T.Props) {
  const {
    progressElem,
    loader,
    render,
    children,
    hideSpinner,
    spinnerTimeout = 500,
    size = 'm',
    ...restProps
  } = props;

  const {
    loading,
    spinnerTimeout: spinnerTimeoutState,
    importData,
  } = useLazy(loader, spinnerTimeout);

  const DefaultNode = importData?.default as ComponentType<any> | undefined;

  if (loading && !spinnerTimeoutState && !hideSpinner) {
    return (
      progressElem ?? (
        <Flex
          justifyContent="center"
          alignItems="center"
          flexGrow={1}
          width="100%"
          height="100%"
        >
          <Spinner size={size} />
        </Flex>
      )
    );
  }

  if (render) return render(importData!);
  if (typeof children === 'function') return children(importData!);
  if (DefaultNode) return <DefaultNode {...restProps} />;

  return children;
}
