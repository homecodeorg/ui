import { Gallery } from 'uilib';

const { getRandomImageUrl } = helpers;
const items = [
  getRandomImageUrl(),
  getRandomImageUrl(),
  getRandomImageUrl(),
  getRandomImageUrl(),
  getRandomImageUrl(),
];

export default () => {
  return <Gallery items={items} style={{ height: 400 }} />;
};

// 'https://picsum.photos/id/5/400/300.jpg',
// 'https://picsum.photos/id/432/400/300.jpg',
// 'https://picsum.photos/id/336/400/300.jpg',
// 'https://picsum.photos/id/210/400/300.jpg',
// 'https://picsum.photos/id/248/400/300.jpg',
