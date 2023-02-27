import type { Option } from './Select.types';

export function isMultiple(value) {
  return Array.isArray(value);
}

export function renderLabel({ label, render }: Option): string {
  if (render) return render(label);
  return label;
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

export function mapById(options): IdsMap {
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
