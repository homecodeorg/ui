import { createStore } from 'justorm/react';
import { debounce } from 'uilib/tools';

import * as H from './Code.helpers';

const STORE = createStore('editor', {
  height: '100%',
  editedCode: '',
  execCode: '',
  scope: {},
  updateHeight(id) {
    this.height = H.getPreHeight(document.getElementById(id));
  },
  updateExecCode() {
    this.execCode = H.wrapExample(this.editedCode, this.scope);
  },
  onChange(code, id) {
    this.editedCode = code;
    this.updateHeight(id);
    updateExecCode();
  },
});

const updateExecCode = debounce(code => STORE.updateExecCode(code), 1000);

export default STORE;
