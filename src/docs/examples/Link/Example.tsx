import { Link } from 'uilib';

export default () => {
  return (
    <>
      Local links:
      <Link href="/button">relative</Link>
      <Link href="//intro/about">skip rootPath</Link>
      <br />
      External links:
      <Link href="https://uilib.apostol.space">UILIB</Link>
      <Link href="apostol.space">apostol.space</Link>
    </>
  );
};
