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
