import { Option } from './Select.types';

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

function sortOptions(options, sortBy = 'sortingKey', { items }) {
  return options.sort((a, b) => {
    const aKey = items[a.id][sortBy];
    const bKey = items[b.id][sortBy];

    if (aKey === bKey) return 0;
    if (aKey > bKey) return -1;
    return 1;
  });
}

function groupOptions(options: Option[], groupBy: string, idsMap: IdsMap) {
  const grouped = {} as { [groupName: string]: Option[] };
  const groupLess = [] as Option[];

  options.forEach(item => {
    const groupName = idsMap.items[item.id][groupBy];

    if (!groupName) {
      groupLess.push(item);
      return;
    }

    if (!grouped[groupName]) {
      grouped[groupName] = [
        {
          id: groupName,
          isGroupHeader: true,
          label: groupName,
        },
      ];
    }

    grouped[groupName].push(item);
  });

  return {
    grouped,
    groupLess,
  };
}

export function formatOptionsList({ options, groupBy, sortBy, idsMap }) {
  if (groupBy) {
    const { grouped, groupLess } = groupOptions(options, groupBy, idsMap);
    const sortedGroupLess = sortOptions(groupLess, sortBy, idsMap);
    const sortedGroups = Object.keys(grouped).reduce(
      (acc, groupItems) => [...acc, ...sortOptions(groupItems, sortBy, idsMap)],
      [] as Option[]
    );

    return [...sortedGroupLess, ...sortedGroups];
  }

  return sortOptions(options, sortBy, idsMap);
}
