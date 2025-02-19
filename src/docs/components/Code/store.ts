import { createStore } from 'justorm';
import { LS, debounce } from 'uilib/tools';

import * as H from './Code.helpers';

const editedLabel = id => `edited::${id}`;

const STORE = createStore('editor', {
  height: '100%',
  editedCode: '',
  execCode: '',
  scope: {},

  getEditedCode(id) {
    return LS.get(editedLabel(id));
  },

  updateHeight(id) {
    this.height = H.getPreHeight(document.getElementById(id));
  },

  updateExecCode(id) {
    this.execCode = H.wrapExample(this.editedCode, this.scope);
    LS.set(editedLabel(id), this.editedCode);
  },

  onChange(id, code) {
    this.editedCode = code;
    this.updateHeight(id);
    updateExecCode(id);
  },
});

const updateExecCode = debounce(id => STORE.updateExecCode(id), 1000);

export default STORE;
