import { getRandomItem } from '../../storybook.helpers';
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

export function generateTreeOptions(level = 0, parentId = ''): Option[] {
  const length = level ? randomInt(10) : 10;
  const items = [];

  for (let i = 0; i < length; i++) {
    const id = `${parentId}${i}`;
    const label = getRandomItem(TEXT);
    const item = { id, label } as Option;

    if (parentId) item.parentId = parentId;

    if (randomInt(10) - 6 - level > 0)
      items.push(...generateTreeOptions(level + 1, id));

    items.push(item);
  }

  return items;
}

export function generateOptions(): Option[] {
  const items = [];
  const length = 10;

  for (let id = 0; id < length; id++) {
    const label = getRandomItem(TEXT);
    const item = { id, label } as Option;

    items.push(item);
  }

  return items;
}
