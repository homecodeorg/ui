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

export type DropZoneProps = T.Props;

function matchesAcceptPart(file: File, part: string): boolean {
  const p = part.trim().toLowerCase();
  if (!p) return false;
  if (p.startsWith('.')) {
    return file.name.toLowerCase().endsWith(p);
  }
  if (p.includes('/')) {
    const t = file.type.toLowerCase();
    if (p.endsWith('/*')) {
      const prefix = p.slice(0, -1);
      return t.startsWith(prefix);
    }
    return t === p;
  }
  return false;
}

function matchesAccept(file: File, accept: string): boolean {
  const trimmed = accept.trim();
  if (!trimmed) return true;
  const parts = trimmed
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return true;
  return parts.some(part => matchesAcceptPart(file, part));
}

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
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const fallbackInputIdRef = useRef(generateUID());
  const inputId = id ?? fallbackInputIdRef.current;

  const handleDrop = useCallback(
    (e: ReactDragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const list = Array.from(e.dataTransfer.files).filter(f =>
        matchesAccept(f, accept),
      );

      if (props.multiple === true) {
        if (list.length > 0) {
          props.onFiles(list);
        }
      } else {
        const file = list[0];
        if (file) {
          props.onFile(file);
        }
      }
    },
    [accept, disabled, props],
  );

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const raw = e.target.files;
      if (!raw?.length) return;

      const list = Array.from(raw).filter(f => matchesAccept(f, accept));

      if (props.multiple === true) {
        if (list.length > 0) {
          props.onFiles(list);
        }
      } else {
        const file = list[0];
        if (file) {
          props.onFile(file);
        }
      }
      e.target.value = '';
    },
    [accept, disabled, props],
  );

  useEffect(() => {
    const dialog = dropAreaRef.current?.closest('[role="dialog"]');
    const targetElement = (dialog as HTMLElement) || document.body;

    const handleGlobalDragOver = (e: globalThis.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleGlobalDragLeave = (e: globalThis.DragEvent) => {
      if (
        !e.relatedTarget ||
        !targetElement.contains(e.relatedTarget as Node)
      ) {
        setIsDragging(false);
      }
    };

    const handleGlobalDrop = () => {
      setIsDragging(false);
    };

    targetElement.addEventListener('dragover', handleGlobalDragOver);
    targetElement.addEventListener('dragleave', handleGlobalDragLeave);
    targetElement.addEventListener('drop', handleGlobalDrop);

    return () => {
      targetElement.removeEventListener('dragover', handleGlobalDragOver);
      targetElement.removeEventListener('dragleave', handleGlobalDragLeave);
      targetElement.removeEventListener('drop', handleGlobalDrop);
    };
  }, []);

  const shouldShowDropArea = !ghost || isDragging;
  const multiple = props.multiple === true;

  return (
    <div className={cn(S.root, className)}>
      {shouldShowDropArea && (
        <div
          ref={dropAreaRef}
          className={cn(
            S.dropArea,
            isDragging && S.isDragging,
            disabled && S.disabled,
          )}
          onDrop={handleDrop}
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
