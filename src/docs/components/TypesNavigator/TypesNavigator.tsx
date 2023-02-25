import { useCallback, useState, useEffect, useRef } from 'react';
import cn from 'classnames';

import { Scroll, Popup } from 'uilib/components';
import { resizeObserver } from 'uilib/tools';

import TYPES from '../../types.json';
import { Required } from '../ComponentLayout/ComponentLayout';
import S from './TypesNavigator.styl';

type Props = {
  scope: string;
  type: string;
  inPopup?: boolean;
};

console.log(TYPES);

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

export const Type = ({ name, scope }) => {
  const content = renderNavigator({ scope, type: name, inPopup: true });

  if (!content) return name;

  return (
    <Popup
      direction="bottom-right"
      hoverControl
      trigger={<span className={S.type}>{name}</span>}
      content={content}
    />
  );
};

function renderNavigator(p) {
  const value = TYPES[p.scope][p.type] || TYPES.global[p.type];

  if (!value) return null;

  if (value.isPlain) return <SimpleTypesNavigator {...p} value={value.value} />;

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
          {Object.entries(props).map(([name, p]) => (
            <Field
              name={name}
              {...p}
              value={injectTypes(p.value ?? p, scope)}
            />
          ))}
        </div>
      </Scroll>
    </div>
  );
}

export function TypesTable({ scope, type }) {
  const { kind, ext, ...props } = TYPES[scope][type];

  const renderComments = useCallback(comments => {
    if (!comments) return null;

    let isList = false;
    let listItems = [];
    const content = [];

    comments.forEach(line => {
      if (line.startsWith('- ')) {
        isList = true;
        listItems.push(<li>{line.substr(2)}</li>);
      } else if (isList) {
        isList = false;
        content.push(<ul>{listItems}</ul>);
        listItems = [];
      } else {
        content.push(<p>{line}</p>);
      }
    });

    return content;
  }, []);

  const renderField = useCallback(([name, { value, comment, optional }]) => {
    return (
      <tr>
        <td>{optional ? name : <Required text={name} />}</td>
        <td>
          <Type scope={scope} name={value} />
        </td>
        <td>{renderComments(comment?.split('\n\n'))}</td>
      </tr>
    );
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>{Object.entries(props).map(renderField)}</tbody>
    </table>
  );
}
