import { Component } from 'react';
import { withStore } from 'justorm/react';
import cn from 'classnames';
import compare from 'compareq';
import { Scroll, uid, Portal, Button, Icon, LS } from 'uilib';

import FullscreenButton from './FullscreenButton/FullscreenButton';
import Editor from './Editor/Editor';
import Result from './Result/Result';

import S from './Code.styl';
import Background from './Background';

type Props = {
  store?: any;
  id: string;
  code: string;
  scope?: object;
};

@withStore({ app: [], editor: ['isFullscreen'] })
export class Code extends Component<Props> {
  store;

  id = `editor-${uid.generateUID()}`;

  state = {
    inited: false,
    isBgEnabled: !LS.get('codeBgDisabled'),
    code: '',
  };

  componentDidMount() {
    const { id, scope, store } = this.props;
    const { app, editor } = store;

    this.setCode(id);

    editor.scope = scope;
    editor.onChange(this.id, this.state.code);

    app.updateGradient();

    this.setState({ inited: true });
  }

  componentDidUpdate(prev: Props) {
    const {
      id,
      scope,
      store: { editor },
    } = this.props;

    if (!compare(prev.scope, scope)) {
      editor.scope = scope;
    }

    if (prev.id !== id) {
      this.setCode(id);
    }
  }

  setCode(id) {
    const { editor } = this.props.store;
    const code = editor.getEditedCode(id) || this.props.code;

    this.setState({ code });
  }

  onColorButtonClick = () => {
    const isBgEnabled = !this.state.isBgEnabled;

    this.setState({ isBgEnabled });
    LS.set('codeBgDisabled', !isBgEnabled);
  };

  isFullscreen = () => this.props.store.editor.isFullscreen;

  renderContent(content) {
    if (this.isFullscreen()) {
      return <Portal>{content}</Portal>;
    }

    return content;
  }

  render() {
    const { id } = this.props;
    const { isBgEnabled, code } = this.state;
    const isFullscreen = this.isFullscreen();

    return (
      <div
        className={cn(
          S.root,
          isFullscreen && S.fullscreen,
          isBgEnabled && S.colorBg
        )}
        key="code"
      >
        {isBgEnabled && <Background />}
        <Scroll
          y
          fadeSize="m"
          className={S.editorContainer}
          yScrollbarClassName={S.scrollbar}
          offset={{ y: { before: 14, after: 14 } }}
        >
          <Editor id={id} code={code} />
        </Scroll>
        <Result />
        <div className={S.toolbar}>
          <FullscreenButton isFullscreen={isFullscreen} />
          <Button
            onClick={this.onColorButtonClick}
            className={S.colorButton}
            title="Toggle background color"
          >
            <Icon type="colors" />
          </Button>
        </div>
      </div>
    );
  }
}
