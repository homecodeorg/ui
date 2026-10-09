/** Finder / WKWebView file drags. Structural drag types, not language checks. */
const FILE_DRAG_TYPES = new Set([
  'Files',
  'files',
  'public.file-url',
  'application/x-moz-file',
]);

/**
 * macOS fires `dragleave` with a null `relatedTarget` while the pointer is
 * still inside the window. `dragover` can be a few hundred milliseconds
 * apart, so hide the overlay only after it has stopped.
 */
export const DROP_HIDE_GRACE_MS = 400;

export function dragCarriesFiles(
  types: ArrayLike<string> | null | undefined
): boolean {
  if (!types) return false;
  const list = Array.from(types);
  // Some WebKit builds hide types until drop. Don't reject those drags.
  if (list.length === 0) return true;
  return list.some(type => FILE_DRAG_TYPES.has(type));
}

type DropItemLike = {
  kind: string;
  getAsFile?: () => File | null;
};

export type DropData = {
  types?: ArrayLike<string> | null;
  files?: ArrayLike<File> | null;
  items?: ArrayLike<DropItemLike> | null;
};

function matchesAcceptPart(file: File, part: string): boolean {
  const token = part.trim().toLowerCase();
  if (!token) return false;
  if (token.startsWith('.')) {
    return file.name.toLowerCase().endsWith(token);
  }
  if (token.includes('/')) {
    const mime = file.type.toLowerCase();
    if (token.endsWith('/*')) return mime.startsWith(token.slice(0, -1));
    return mime === token;
  }
  return false;
}

export function matchesAccept(file: File, accept: string): boolean {
  const trimmed = accept.trim();
  if (!trimmed) return true;
  const parts = trimmed
    .split(',')
    .map(part => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return true;
  return parts.some(part => matchesAcceptPart(file, part));
}

function filesFromItems(
  items: ArrayLike<DropItemLike> | null | undefined
): File[] {
  if (!items) return [];
  const files: File[] = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item?.kind !== 'file') continue;
    const file = item.getAsFile?.() ?? null;
    if (file) files.push(file);
  }
  return files;
}

/**
 * Prefer `files`. On macOS WebKit that list is often empty while `items`
 * still has the file. Reading `items` when `files` is already set clears
 * the list in WebKit, so items are only a fallback.
 */
export function filesFromDataTransfer(dataTransfer: DropData): File[] {
  const listed = dataTransfer.files ? Array.from(dataTransfer.files) : [];
  if (listed.length > 0) return listed;
  return filesFromItems(dataTransfer.items);
}

export function filesForDrop(args: {
  defaultPrevented: boolean;
  disabled: boolean;
  accept: string;
  multiple: boolean;
  dataTransfer: DropData | null;
}): File[] {
  if (args.disabled || args.defaultPrevented || !args.dataTransfer) return [];
  const listed = args.dataTransfer.files
    ? Array.from(args.dataTransfer.files)
    : [];
  if (!dragCarriesFiles(args.dataTransfer.types) && listed.length === 0) {
    return [];
  }
  const files =
    listed.length > 0 ? listed : filesFromItems(args.dataTransfer.items);
  const matched = files.filter(file => matchesAccept(file, args.accept));
  if (args.multiple) return matched;
  return matched[0] ? [matched[0]] : [];
}
