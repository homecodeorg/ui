import { useEffect, useRef } from 'react';
import { Resizer } from 'uilib';

function SizeLabel({ showPx }) {
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
      const pct =
        wrap.style.getPropertyValue('--width') ||
        wrap.style.getPropertyValue('--height');
      if (!showPx) {
        node.textContent = pct;
        return;
      }
      node.textContent = `${pct} · ${Math.round(wrap.offsetWidth)}px`;
    };

    sync();
    const obs = new MutationObserver(sync);
    obs.observe(wrap, { attributes: true, attributeFilter: ['style'] });
    return () => obs.disconnect();
  }, [showPx]);

  return <span className={S.size} ref={ref} />;
}

function Pane({ name, showPx }) {
  return (
    <div className={S.pane}>
      <span>{name}</span>
      <SizeLabel showPx={showPx} />
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

    <div className={S.subtitle}>minWidth (% and px)</div>
    <div className={S.box}>
      <Resizer
        minWidths={['120px', '20%', '80px']}
        content={[
          <Pane name="A ≥ 120px" showPx />,
          <Pane name="B ≥ 20%" showPx />,
          <Pane name="C ≥ 80px" showPx />,
        ]}
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
