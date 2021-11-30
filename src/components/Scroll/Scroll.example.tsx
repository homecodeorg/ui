import { Fragment } from 'react';

import { LOREM_IPSUM_LONG, State, Title } from '../../helpers';

import { Heading } from '../Heading/Heading';
import { Input } from '../Input/Input';
import { Container } from '../Container/Container';

import Scroll from './Scroll';
import S from './Scroll.example.styl';

const TEXT = [
  LOREM_IPSUM_LONG,
  LOREM_IPSUM_LONG,
  LOREM_IPSUM_LONG,
  LOREM_IPSUM_LONG,
  LOREM_IPSUM_LONG,
].join('\n');

function Example(style) {
  return <div style={{ maxWidth: '100%', ...style }}>{TEXT}</div>;
}

export default () => (
  <Fragment>
    <Container vertical size="s">
      <Heading id="xy" text="XY" />
      <Scroll className={S.example} innerClassName={S.inner} x y>
        <div style={{ width: 1000 }}>{TEXT}</div>
      </Scroll>
    </Container>

    <Container vertical size="s">
      <Heading id="y" text="Y" />
      <Scroll className={S.example} innerClassName={S.inner} y>
        {TEXT}
      </Scroll>
    </Container>

    <Container vertical size="s">
      <Heading id="x" text="X" />
      <Scroll className={S.example} innerClassName={S.inner} x>
        <div style={{ width: 2000 }}>{TEXT}</div>
      </Scroll>
    </Container>

    <Container vertical size="s">
      <Heading id="y-offset" text="Y with offset before" />
      <Scroll
        className={S.example}
        innerClassName={S.inner}
        y
        offset={{ y: { before: 50 } }}
      >
        {TEXT}
      </Scroll>
    </Container>

    <Container vertical size="s">
      <Heading id="y-offset" text="XY with offset from every side" />
      <Scroll
        className={S.example}
        innerClassName={S.inner}
        x
        y
        offset={{ x: { before: 20, after: 20 }, y: { before: 20, after: 20 } }}
      >
        <div style={{ width: 1000 }}>{TEXT}</div>
      </Scroll>
    </Container>

    <Container vertical size="s">
      <Heading
        id="thumb-depend-scroll"
        text="Thumb size depend on scroll height"
      />
      <State initial={{ width: 1000, height: 1000 }}>
        {state => (
          <div>
            <div style={{ width: 300, display: 'flex' }}>
              <Input
                className={S.input}
                label="width"
                type="number"
                step={100}
                value={state.width}
                onChange={val => (state.width = val)}
              />
              <Input
                className={S.input}
                label="height"
                type="number"
                step={100}
                value={state.height}
                onChange={val => (state.height = val)}
              />
            </div>
            <Scroll
              className={S.example}
              innerClassName={S.inner}
              y
              offset={{ y: { before: 20, after: 20 } }}
            >
              <div
                style={{
                  width: state.width,
                  height: state.height,
                  overflow: 'hidden',
                }}
              >
                {TEXT}
              </div>
            </Scroll>
          </div>
        )}
      </State>
    </Container>
  </Fragment>
);
