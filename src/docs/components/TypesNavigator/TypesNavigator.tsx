import { useCallback, useState, useEffect, useRef, ReactNode } from 'react';
import cn from 'classnames';

import { Table, Popup, Link } from 'uilib/components';
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
const Field = ({ name, value, optional = false, comment = '' }) => (
  <div className={S.field}>
    {name}
    <Sep>:{optional ? '?' : ''}</Sep>
    &nbsp;
    <span className={S.value}>{value}</span>
    <Sep>;</Sep>
    {comment && <span className={S.comment}>{comment}</span>}
  </div>
);

export const Type = ({ name, scope, customLinks = {} }): ReactNode => {
  const customLink = customLinks[name];

  if (customLink) return injectTypes(name, scope, customLinks);

  const content = renderNavigator({ scope, type: name, inPopup: true });

  if (!content) return injectTypes(name, scope, customLinks);

  return (
    <Popup
      direction="bottom-right"
      hoverControl
      elevation={1}
      paranja
      // animated={false}
      trigger={<span className={S.type}>{name}</span>}
      content={content}
    />
  );
};

const cleanTypName = (type: string) => {
  if (/\w+\[\]$/.test(type)) return type.replace(/\[\]/, '');

  return type;
};

function renderNavigator(p) {
  const name = cleanTypName(p.type);
  const value = TYPES[p.scope][name] || TYPES.global[name];

  if (!value) return null;

  if (value.isPlain) return <SimpleTypesNavigator {...p} value={value.value} />;

  return <TypesNavigator {...p} />;
}

function injectTypes(
  value,
  scope,
  customLinks = {},
  excludeTypes = []
): ReactNode {
  const content: ReactNode[] = [value];

  const renderType = (type: string, scope: string): ReactNode => {
    const link = customLinks[type];

    if (link) {
      return (
        <Link href={link} key={type} className={S.type}>
          {type}
        </Link>
      );
    }

    // @ts-ignore
    return <Type scope={scope} name={type} key={type} />;
  };

  const injectType = (type: string, scope: string) => {
    if (excludeTypes.includes(type)) return;

    for (let i = 0; i < content.length; i++) {
      const item = content[i];

      if (typeof item === 'string') {
        const match = item.match(new RegExp(`\\b${type}\\b`));

        if (match) {
          const newItems = [
            item.substring(0, match.index),
            renderType(type, scope),
            item.substring(match.index + type.length),
          ].filter(Boolean);

          content.splice(i, 1, ...newItems);
        }
      }
    }
  };

  // local component types
  for (const type of Object.keys(TYPES[scope])) {
    injectType(type, scope);
  }

  // global types
  for (const type of Object.keys(TYPES.global)) {
    injectType(type, 'global');
  }

  return [...content];
}

const SimpleTypesNavigator = ({ value, scope, inPopup }) => (
  <div className={cn(S.root, inPopup && S.inPopup, S.stringType)}>
    {injectTypes(value, scope)}
  </div>
);

const scrollBarOffset = 20;

export function TypesNavigator({ scope, type, inPopup }: Props) {
  const name = cleanTypName(type);
  const { kind, ext, ...props } = TYPES[scope][name] || TYPES.global[name];

  const headerRef = useRef<HTMLDivElement>(null);
  const [offsetTop, setOffsetTop] = useState(scrollBarOffset);
  const onHeaderResize = useCallback(() => {
    setOffsetTop(headerRef.current?.offsetHeight + scrollBarOffset);
  }, []);

  useEffect(() => {
    resizeObserver.observe(headerRef.current, onHeaderResize);
    return () => resizeObserver.unobserve(headerRef.current);
  });

  const excludeTypes = [cleanTypName(type)];

  return (
    <div className={cn(S.root, inPopup && S.inPopup)}>
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
                {injectTypes(item, scope, {}, excludeTypes)}
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
            key={name}
            // @ts-ignore
            {...p}
            // @ts-ignore
            value={injectTypes(p.value ?? p, scope, {}, excludeTypes)}
          />
        ))}
      </div>
    </div>
  );
}

function parseLinks(str: string) {
  const links = str.match(/\[([^\]]+)\]\(([^)]+)\)/g);

  if (!links) return str;

  const content = [];
  let restStr = str;

  links.forEach(link => {
    const href = link.match(/\(([^)]+)\)/)[1];
    const text = link.match(/\[([^\]]+)\]/)[1];
    const startIndex = restStr.indexOf(link);

    content.push(
      restStr.substring(0, startIndex),
      <Link inline href={href} key={text}>
        {text}
      </Link>
    );

    restStr = restStr.substring(startIndex + link.length);
  });

  return [...content, restStr];
}

export function TypesTable({
  scope,
  type,
  hideRequiredStart = false,
  customLinks = {},
}) {
  const { kind, ext, ...props } = TYPES[scope][type];

  const renderComments = useCallback(comments => {
    if (!comments) return null;

    let isList = false;
    let listItems = [];
    const content = [];

    comments.forEach(line => {
      if (line.startsWith('- ')) {
        isList = true;
        listItems.push(<li key={line}>{parseLinks(line.substr(2))}</li>);
      } else if (isList) {
        isList = false;
        content.push(<ul>{listItems}</ul>);
        listItems = [];
      } else {
        content.push(<p key={line}>{parseLinks(line)}</p>);
      }
    });

    return content;
  }, []);

  const columns = [
    {
      id: 'name',
      label: 'Name',
      sticky: true,
      render({ name, optional }) {
        return hideRequiredStart || optional ? name : <Required text={name} />;
      },
    },
    {
      id: 'type',
      label: 'Type',
      render({ value }) {
        // @ts-ignore
        return <Type scope={scope} name={value} customLinks={customLinks} />;
      },
    },
    {
      id: 'description',
      label: 'Description',
      render({ comment }) {
        return renderComments(comment?.split('\n\n'));
      },
    },
  ];
  // @ts-ignore
  const data = Object.entries(props).map(([name, p]) => ({ name, ...p }));

  return (
    <Table columns={columns} data={data} blur className={S.typesNavigator} />
  );
}
