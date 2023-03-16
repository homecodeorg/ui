import { Component } from 'react';
import { createPortal } from 'react-dom';
import { withStore } from 'justorm/react';
import cn from 'classnames';
import compare from 'compareq';
import { Scroll, uid, config } from 'uilib';

import FullscreenButton from './FullscreenButton/FullscreenButton';
import Editor from './Editor/Editor';
import Result from './Result/Result';

import S from './Code.styl';
import Styles from './Styles/Styles';

type Props = {
  store?: any;
  scope?: object;
  code: string;
};

@withStore({ app: [], editor: ['isFullscreen'] })
export class Code extends Component<Props> {
  store;
  state = { inited: false };

  id = `editor-${uid.generateUID()}`;

  componentDidMount() {
    const { code, scope, store } = this.props;
    const { app, editor } = store;

    editor.scope = scope;
    editor.onChange(code, this.id);
    app.updateGradient();

    this.setState({ inited: true });
  }

  componentDidUpdate(prev: Props) {
    const {
      scope,
      store: { editor },
    } = this.props;

    if (!compare(prev.scope, scope)) {
      editor.scope = scope;
    }
  }

  isFullscreen = () => this.props.store.editor.isFullscreen;

  renderContent(content) {
    if (this.isFullscreen()) {
      return createPortal(
        content,
        document.getElementById(
          this.isFullscreen() ? config.appOverlayId : 'code-inline'
        )
      );
    }

    return content;
  }

  render() {
    return (
      <div
        className={cn(S.root, this.isFullscreen() && S.fullscreen)}
        key="code"
      >
        <Styles id={this.id} />
        <Scroll
          y
          fadeSize="m"
          className={S.editorContainer}
          offset={{ y: { before: 50, after: 20 } }}
        >
          <Editor code={this.props.code} id={this.id} />
        </Scroll>
        <Result />
        <FullscreenButton />
      </div>
    );
  }
}
