import { withStore } from 'justorm/react';

import S from '../Code.styl';

const getGradient = ([c0, c1, c2]) => `
linear-gradient(${c0}deg, rgba(255,0,0,.1), rgba(255,0,0,0) 70.71%),
linear-gradient(${c1}deg, rgba(0,255,0,.1), rgba(0,255,0,0) 70.71%),
linear-gradient(${c2}deg, rgba(0,0,255,.1), rgba(0,0,255,0) 70.71%);
`;

const Styles = withStore({
  app: ['gradient'],
  editor: ['height'],
})(function Styles({ id, store: { app, editor } }) {
  const { height } = editor;
  const { gradient } = app;
  const isGradientEven = gradient.changeCount % 2 === 0;

  return (
    <style>
      {`
#${id} > textarea { height: ${height} !important; }
.${S.root}::before {
  background: ${getGradient(isGradientEven ? gradient.prev : gradient.curr)};
  opacity: ${isGradientEven ? 0 : 1};
}
.${S.root}::after {
  background: ${getGradient(isGradientEven ? gradient.curr : gradient.prev)};
  opacity: ${isGradientEven ? 1 : 0};
}
      `}
    </style>
  );
});

export default Styles;
