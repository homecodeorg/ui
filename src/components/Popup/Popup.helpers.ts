import { array } from 'uilib/tools';

const popupsOverContent = {}; // [popupId]: [popupId, popupId, ...]
let popupIds = -1;

export const getId = () => ++popupIds;

export const getPopupId = elem => elem?.getAttribute('data-popup-id');

export function isLastOverContent(parentId, id) {
  const ids = popupsOverContent[parentId];
  return ids && ids.slice(-1) === id;
}

export function setOverContent(parentId, id) {
  if (!popupsOverContent[parentId]) popupsOverContent[parentId] = [];
  popupsOverContent[parentId].push(id);
}

export function unsetOverContent(parentId, id) {
  array.spliceWhere(popupsOverContent[parentId], id);
  if (!popupsOverContent[parentId].length) delete popupsOverContent[parentId];
}
