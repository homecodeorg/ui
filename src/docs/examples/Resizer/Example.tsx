import { useEffect, useRef } from 'react';
import { Resizer } from 'uilib';

function SizeLabel() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let wrap = node.parentElement;
    while (wrap && !wrap.style.getPropertyValue('--width')) {
      wrap = wrap.parentElement;
    }
    if (!wrap) return;

    const sync = () => {
      node.textContent =
        wrap.style.getPropertyValue('--width') ||
        wrap.style.getPropertyValue('--height');
    };

    sync();
    const obs = new MutationObserver(sync);
    obs.observe(wrap, { attributes: true, attributeFilter: ['style'] });
    return () => obs.disconnect();
  }, []);

  return <span className={S.size} ref={ref} />;
}

function Pane({ name }) {
  return (
    <div className={S.pane}>
      <span>{name}</span>
      <SizeLabel />
    </div>
  );
}

export default () => (
  <div className={S.root}>
    <div className={S.subtitle}>Horizontal (remembered)</div>
    <div className={S.box}>
      <Resizer
        rememberKey="docs-resizer-horizontal"
        content={[<Pane name="A" />, <Pane name="B" />, <Pane name="C" />]}
      />
    </div>

    <div className={S.subtitle}>Vertical</div>
    <div className={S.boxTall}>
      <Resizer
        vertical
        content={[<Pane name="Top" />, <Pane name="Bottom" />]}
      />
    </div>
  </div>
);
