import React, { Component } from 'react';
import * as justorm from 'justorm/react';
import timen from 'timen';
import cn from 'classnames';
import compare from 'compareq';
import { Scroll, uid } from '/src';

import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';

import vsDark from 'prism-react-renderer/themes/vsDark';
import vsLight from 'prism-react-renderer/themes/vsLight';

import * as uilib from '/src';
import * as helpers from 'helpers';

// import TYPES from '../../types.json';
import * as H from './Code.helpers';
import S from './Code.styl';

const { withStore, createStore } = justorm;

const SCOPE = { uilib, React, justorm, timen, helpers };

type Props = {
  store?: any;
  scope?: object;
  code: string;
};

const getGradient = ([c0, c1, c2]) => `
linear-gradient(${c0}deg, rgba(255,0,0,.1), rgba(255,0,0,0) 70.71%),
linear-gradient(${c1}deg, rgba(0,255,0,.1), rgba(0,255,0,0) 70.71%),
linear-gradient(${c2}deg, rgba(0,0,255,.1), rgba(0,0,255,0) 70.71%);
`;

@withStore({ app: ['theme', 'gradient'] })
export class Code extends Component<Props> {
  store;

  id = `editor-${uid.generateUID()}`;

  constructor(props) {
    super(props);

    const { code } = props;

    this.store = createStore(this, {
      height: '100%',
      editedCode: code,
      execCode: this.getExecCode(code),
      currScope: this.getScope(),
    });
  }

  componentDidMount() {
    this.updateHeight();
    this.props.store.app.updateGradient();
  }

  componentDidUpdate({ scope }: Props) {
    if (!compare(scope, this.props.scope)) {
      this.store.currScope = this.getScope(scope);
    }
  }

  getScope = (scope = this.props.scope) => ({ ...SCOPE, ...scope });

  getExecCode = (code = this.store.editedCode) => {
    return H.wrapExample(code, this.props.scope);
  };

  updateHeight() {
    const editorElem = document.getElementById(this.id);
    this.store.height = H.getPreHeight(editorElem);
  }

  // updateExecCode = debounce(
  updateExecCode = code => (this.store.execCode = this.getExecCode(code));
  //   1000
  // );

  onChange = code => {
    this.store.editedCode = code;
    this.updateHeight();
    this.updateExecCode(code);
  };

  render() {
    const { store } = this.props;
    const { theme, gradient } = store.app;
    const { height, editedCode, execCode, currScope } =
      this.store.originalObject;
    const isGradientEven = gradient.changeCount % 2 === 0;

    return (
      <div className={S.root}>
        <style>{`
          #${this.id} > textarea { height: ${height} !important; }
          .${S.root}::before {
            background: ${getGradient(
              isGradientEven ? gradient.prev : gradient.curr
            )};
            opacity: ${isGradientEven ? 0 : 1};
          }
          .${S.root}::after {
            background: ${getGradient(
              isGradientEven ? gradient.curr : gradient.prev
            )};
            opacity: ${isGradientEven ? 1 : 0};
          }
        `}</style>

        <Scroll
          y
          className={S.editorContainer}
          innerClassName={S.editorContainerInner}
          offset={{ y: { before: 20, after: 20 } }}
        >
          <LiveEditor
            className={S.editor}
            id={this.id}
            code={editedCode}
            language="typescript"
            theme={theme === 'dark' ? vsDark : vsLight}
            onChange={this.onChange}
          />
        </Scroll>

        <div className={S.editorResult}>
          <LiveProvider noInline code={execCode} scope={currScope}>
            <LiveEditor className={cn(S.editor, S.runtime)} />
            <LiveError className={S.error} />
            <LivePreview className={S.preview} />
          </LiveProvider>
        </div>
      </div>
    );
  }
}
