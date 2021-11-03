import { getRandomItem } from 'helpers';
import { Option } from './Select.types';

const TEXT = [
  'Aenean',
  'Pellentesque',
  'Ante',
  'Sed',
  'Cursus',
  'Lacinia',
  'Mauris',
  'Viverra',
  'Odio',
  'Vitae',
  'Finibus',
  'Tincidunt',
];

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function generateOption(id): Option {
  return { id, label: getRandomItem(TEXT) };
}

export function generateOptions() {
  return new Array(15).fill(1).map((n, i) => generateOption(i));
}

export function generateTreeOptions(level = 0, parentId = ''): Option[] {
  const length = level ? randomInt(10) : 10;
  const items = [] as Option[];

  for (let i = 0; i < length; i++) {
    const id = `${parentId}${i}`;
    const item = generateOption(id);

    if (parentId) item.parentId = parentId;

    if (randomInt(10) - 6 - level > 0)
      items.push(...generateTreeOptions(level + 1, id));

    items.push(item);
  }

  return items;
}
