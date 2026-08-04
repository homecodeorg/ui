import type { Id, Option, Value } from './Select.types';

export function isMultiple(value) {
  return Array.isArray(value);
}

export function renderLabel({ label, render }: Option): string {
  if (render) return render(label);
  return label;
}

/** Selection is always kept as a list of ids, whatever the `value` shape is. */
export function toIds(value: Value | undefined): Id[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

/** Stable primitive for `useEffect` deps — `value` arrays are often recreated. */
export function idsKey(ids: Id[]): string {
  return ids.join('\u0000');
}

/**
 * Script-agnostic normalization: `toLocaleLowerCase` respects locale casing rules
 * and NFC keeps composed/decomposed forms comparable.
 */
function normalize(text: string): string {
  return text.toLocaleLowerCase().normalize('NFC');
}

export function matchesSearch(option: Option, query: string): boolean {
  if (!query) return true;
  return normalize(option.label).includes(normalize(query));
}

export function isSelectable(option: Option | undefined): boolean {
  return Boolean(option) && !option.isGroupHeader;
}

export function buildOptionsTree(options: Option[], idsMap: IdsMap): Option[] {
  function buildOption(id: Option['id']): Option {
    const { items, childIds } = idsMap;
    const data = { ...items[id] };
    const childs = childIds[id];

    if (childs) data.children = childs.map(buildOption);

    return data;
  }

  return options.reduce(
    (acc, { id, parentId }) => (parentId ? acc : [...acc, buildOption(id)]),
    [] as Option[]
  );
}

type IdsMap = {
  items: { [key: string]: Option };
  childIds: { [key: string]: Option['id'][] };
};

export function mapById(options: Option[]): IdsMap {
  return options.reduce(
    (acc, item) => {
      const { items, childIds } = acc;
      const { id, parentId } = item;

      items[id] = item;

      if (parentId) {
        if (!childIds[parentId]) childIds[parentId] = [];
        childIds[parentId].push(id);
      }

      return acc;
    },
    {
      items: {},
      childIds: {},
    }
  );
}
