import { Link } from 'uilib';

export default () => {
  return (
    <>
      Local links:
      <Link href="/button">relative</Link>
      <Link href="//intro/about">skip rootPath</Link>
      <br />
      Same-origin files:
      <Link href="/api/files/content?filePath=a.pdf" target="_blank">
        /api/files/content
      </Link>
      <Link href="/files/report.pdf" target="_blank">
        /files/report.pdf
      </Link>
      <br />
      External links:
      <Link href="https://uilib.apostol.space">UILIB</Link>
      <Link href="apostol.space">apostol.space</Link>
    </>
  );
};
