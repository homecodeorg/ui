import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent as ReactDragEvent,
} from 'react';
import cn from 'classnames';

import { generateUID } from 'uilib/tools/uid';

import S from './DropZone.styl';
import type * as T from './DropZone.types';
import {
  DROP_HIDE_GRACE_MS,
  dragCarriesFiles,
  filesForDrop,
  matchesAccept,
} from './dropFiles';

export type DropZoneProps = T.Props;

export function DropZone(props: T.Props) {
  const {
    accept,
    label,
    error,
    disabled = false,
    ghost = false,
    id,
    className,
  } = props;
  const [isDragging, setIsDragging] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const fallbackInputIdRef = useRef(generateUID());
  const inputId = id ?? fallbackInputIdRef.current;
  const propsRef = useRef(props);
  propsRef.current = props;
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;

  const handleFileInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const raw = event.target.files;
      if (!raw?.length) return;

      const list = Array.from(raw).filter(file => matchesAccept(file, accept));

      if (props.multiple === true) {
        if (list.length > 0) props.onFiles(list);
      } else {
        const file = list[0];
        if (file) props.onFile(file);
      }
      event.target.value = '';
    },
    [accept, disabled, props]
  );

  useEffect(() => {
    const dialog = rootRef.current?.closest('[role="dialog"]');
    const target: EventTarget = dialog ?? window;
    let hideTimer = 0;
    let snapshotted: File[] | null = null;

    const allowFileDrag = (event: DragEvent) => {
      const transfer = event.dataTransfer;
      if (!transfer || !dragCarriesFiles(transfer.types)) return;
      event.preventDefault();
      transfer.dropEffect = disabledRef.current ? 'none' : 'copy';
      if (disabledRef.current) return;
      window.clearTimeout(hideTimer);
      setIsDragging(true);
    };

    const scheduleHide = () => {
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        setIsDragging(false);
      }, DROP_HIDE_GRACE_MS);
    };

    const onDragLeave = (event: DragEvent) => {
      const related = event.relatedTarget;
      if (related instanceof Node) {
        const host = dialog ?? document;
        if (host.contains(related)) return;
      }
      scheduleHide();
    };

    const onDropCapture = (event: DragEvent) => {
      // Snapshot before later capture listeners read `items`. WebKit then
      // clears `files`, so the bubble handler would see an empty drop.
      snapshotted = event.dataTransfer
        ? Array.from(event.dataTransfer.files)
        : [];
    };

    const deliver = (event: DragEvent) => {
      window.clearTimeout(hideTimer);
      setIsDragging(false);
      const saved = snapshotted;
      snapshotted = null;
      const transfer = event.dataTransfer;
      const claimed = event.defaultPrevented;
      if (transfer && dragCarriesFiles(transfer.types) && !claimed) {
        event.preventDefault();
      }
      if (claimed || disabledRef.current) return;
      const current = propsRef.current;
      const dataTransfer =
        saved && saved.length > 0
          ? { types: transfer?.types, files: saved, items: null }
          : transfer;
      const files = filesForDrop({
        defaultPrevented: false,
        disabled: false,
        accept: current.accept,
        multiple: current.multiple === true,
        dataTransfer,
      });
      if (files.length === 0) return;
      if (current.multiple === true) current.onFiles(files);
      else current.onFile(files[0]);
    };

    target.addEventListener('dragenter', allowFileDrag, true);
    target.addEventListener('dragover', allowFileDrag, true);
    target.addEventListener('dragleave', onDragLeave, true);
    target.addEventListener('drop', onDropCapture, true);
    target.addEventListener('drop', deliver);

    return () => {
      window.clearTimeout(hideTimer);
      target.removeEventListener('dragenter', allowFileDrag, true);
      target.removeEventListener('dragover', allowFileDrag, true);
      target.removeEventListener('dragleave', onDragLeave, true);
      target.removeEventListener('drop', onDropCapture, true);
      target.removeEventListener('drop', deliver);
    };
  }, []);

  const keepFileDrag = (event: ReactDragEvent<HTMLDivElement>) => {
    if (!dragCarriesFiles(event.dataTransfer.types)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
  };

  const shouldShowDropArea = !ghost || isDragging;
  const multiple = props.multiple === true;

  return (
    <div ref={rootRef} className={cn(S.root, className)}>
      {shouldShowDropArea && (
        <div
          className={cn(
            S.dropArea,
            isDragging && S.isDragging,
            disabled && S.disabled
          )}
          onDragEnter={keepFileDrag}
          onDragOver={keepFileDrag}
        >
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
            className={S.fileInput}
            id={inputId}
            disabled={disabled}
          />
          <label
            htmlFor={inputId}
            className={S.label}
            style={{
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            {label}
          </label>
        </div>
      )}
      {error && <div className={S.error}>{error}</div>}
    </div>
  );
}
