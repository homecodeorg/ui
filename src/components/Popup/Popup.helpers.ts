import { array } from 'uilib/tools';

type Id = number;

export const childs: Record<Id, Id[]> = {};

let popupIds = 0;
export const getId = () => ++popupIds;

export const getPopupId = (elem, attr = 'data-popup-id') => {
  const id = elem.getAttribute(attr);
  return id ? parseInt(id, 10) : null;
};

export function isLastOverContent(rootId, id) {
  const ids = childs[rootId];
  return ids && ids[ids.length - 1] === id;
}

export function setOverContent(rootId, id) {
  if (!childs[rootId]) childs[rootId] = [];
  childs[rootId].push(id);
}

export function unsetOverContent(rootId, id) {
  array.spliceWhere(childs[rootId], id);
  if (!childs[rootId].length) delete childs[rootId];
}
