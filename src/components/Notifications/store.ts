import { createStore } from 'justorm/react';
import Time from 'timen';

import { spliceWhere } from 'uilib/tools/array';
import { generateUID } from 'uilib/tools/uid';
import C from './Notifications.constants.json';
import { ItemParams } from './Notifications.types';

const SHOW_TIME = 5000;

type ID = string;

const STORE = createStore('notifications', {
  items: [] as ID[],
  autoHide: [] as ID[],
  data: {},
  paused: false,
  show(data: ItemParams) {
    const id = generateUID();

    this.items.push(id);
    this.data[id] = {
      ...data,
      createdAt: Date.now(),
    };

    Time.after(C.ANIMATION_DURATION, () => (this.data[id].visible = true));

    if (data.autoHide !== false) this.autoHide.push(id);

    return id;
  },
  pause() {
    this.paused = true;
    this.pausedAt = Date.now();
  },
  unpause() {
    const pauseTime = Date.now() - this.pausedAt;

    this.autoHide.forEach(id => {
      this.data[id].createdAt += pauseTime;
    });

    this.paused = false;
  },
  close(id) {
    this.data[id].visible = false;
    Time.after(C.ANIMATION_DURATION, () => this.remove(id));
  },
  remove(id) {
    spliceWhere(this.autoHide, id);
    spliceWhere(this.items, id);
    delete this.data[id];
  },
});

// worker
Time.every(50, function tick() {
  const { paused, autoHide, data } = STORE;

  if (paused || autoHide.length === 0) {
    return;
  }

  const id = autoHide[0]; // TODO: move trough all autoHide until some will !readyToHide
  const item = data[id];
  const readyToHide = Date.now() - item.createdAt > SHOW_TIME;

  if (item.visible && readyToHide) {
    item.visible = false;
    Time.after(C.ANIMATION_DURATION, () => STORE.remove(id));
  }
});

export default STORE;
export type NotificationsStore = typeof STORE;
