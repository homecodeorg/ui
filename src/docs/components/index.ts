export { ComponentLayout } from './ComponentLayout/ComponentLayout';
export { Code } from './Code/Code';
export { ApiTable } from './ApiTable/ApiTable';
export { Title } from './Title';
export { State } from './State';

export const LOREM_IPSUM_SHORT =
  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.';

export const LOREM_IPSUM_LONG =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

export function getRandomImageUrl(width = 400, height = 300) {
  const id = Math.round(Math.random() * 500);
  return `https://picsum.photos/id/${id}/${width}/${height}.jpg`;
}

export function getRandomItem(arr) {
  const index = Math.round(Math.random() * (arr.length - 1));
  const item = arr[index];
  return item;
}
