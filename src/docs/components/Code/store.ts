import { createStore } from 'justorm/react';
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

  clearEditedCode(id) {
    this.editedCode = '';
    LS.remove(editedLabel(id));
  },

  updateHeight(id) {
    this.height = H.getPreHeight(document.getElementById(id));
  },

  /** Update live preview without changing the persisted edit buffer. */
  setActiveCode(code) {
    this.execCode = H.wrapExample(code, this.scope);
  },

  onChange(id, code) {
    this.editedCode = code;
    this.execCode = H.wrapExample(code, this.scope);
    this.updateHeight(id);
    persistEdited(id, code);
  },
});

const persistEdited = debounce((id, code) => {
  // Drop stale writes after clear/toggle races
  if (code !== STORE.editedCode) return;
  LS.set(editedLabel(id), code);
}, 1000);

export default STORE;
