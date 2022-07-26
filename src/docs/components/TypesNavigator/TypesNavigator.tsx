import { useCallback, useState, useEffect, useRef } from 'react';
import cn from 'classnames';

import { Scroll, Popup } from 'uilib/components';
import { resizeObserver } from 'uilib/tools';

import TYPES from '../../types.json';

import S from './TypesNavigator.styl';

type Props = {
  scope: string;
  type: string;
  inPopup?: boolean;
};

const Kw = p => <span className={S.kw}>{p.children}</span>;
const Sep = p => <span className={S.sep}>{p.children}</span>;
const Field = ({ name, value, optional, comment }) => (
  <div className={S.field}>
    <span className={S.name}>{name}</span>
    <Sep>:{optional ? '?' : ''}</Sep>
    &nbsp;
    <span className={S.value}>{value}</span>
    <Sep>;</Sep>
    {comment && <span className={S.comment}>{comment}</span>}
  </div>
);

const Type = ({ name, scope }) => (
  <Popup
    direction="bottom-right"
    hoverControl
    clearTargetMargin
    trigger={<span className={S.type}>{name}</span>}
    content={renderNavigator({ scope, type: name, inPopup: true })}
  />
);

function renderNavigator(p) {
  const value = TYPES[p.scope][p.type];

  if (typeof value === 'string')
    return <SimpleTypesNavigator {...p} value={value} />;

  return <TypesNavigator {...p} />;
}

function injectTypes(value, scope) {
  const content = [];
  let restStr = value;

  // local component types
  for (const type of Object.keys(TYPES[scope])) {
    const match = restStr.match(new RegExp(`\\b${type}\\b`));

    if (match) {
      content.push(
        restStr.substr(0, match.index),
        <Type scope={scope} name={type} key={type} />
      );

      restStr = restStr.substr(match.index + type.length);
    }
  }

  // global types
  for (const type of Object.keys(TYPES.global)) {
    const match = restStr.match(new RegExp(`\\b${type}\\b`));

    if (match) {
      content.push(
        restStr.substr(0, match.index),
        <Type scope="global" name={type} key={type} />
      );

      restStr = restStr.substr(match.index + type.length);
    }
  }

  if (content.length) {
    content.push(restStr);
    return content;
  }

  return value;
}

const SimpleTypesNavigator = ({ value, scope, inPopup }) => (
  <div className={cn(S.root, inPopup && S.inPopup, S.stringType)}>
    {injectTypes(value, scope)}
  </div>
);

const scrollBarOffset = 20;

export function TypesNavigator({ scope, type, inPopup }: Props) {
  const { kind, ext, ...props } = TYPES[scope][type];

  const headerRef = useRef<HTMLDivElement>(null);
  const [offsetTop, setOffsetTop] = useState(scrollBarOffset);
  const onHeaderResize = useCallback(() => {
    setOffsetTop(headerRef.current?.offsetHeight + scrollBarOffset);
  }, []);

  useEffect(() => {
    resizeObserver.observe(headerRef.current, onHeaderResize);
    return () => resizeObserver.unobserve(headerRef.current);
  });

  return (
    <div className={cn(S.root, inPopup && S.inPopup)}>
      <Scroll
        x
        y
        className={S.fields}
        offset={{
          x: { before: scrollBarOffset, after: scrollBarOffset },
          y: { before: offsetTop, after: scrollBarOffset },
        }}
      >
        <div className={S.header} ref={headerRef}>
          {!inPopup && (
            <div className={S.title}>
              <Kw>{kind}</Kw>&nbsp;
              {type}
            </div>
          )}
          {ext?.length && (
            <div className={S.extends}>
              {ext.map(item => (
                <>
                  {item}
                  <br />
                </>
              ))}
            </div>
          )}
        </div>
        <div className={S.fieldsInner}>
          {Object.entries(props).map(([name, p]) =>
            typeof p === 'string' ? (
              <Field name={name} value={injectTypes(p, scope)} />
            ) : (
              <Field name={name} {...p} value={injectTypes(p.value, scope)} />
            )
          )}
        </div>
      </Scroll>
    </div>
  );
}
