import { array } from 'uilib/tools';

type Id = number;

export type ClientRectEdges = {
  readonly left: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
};

type Offset = { top?: number; right?: number; bottom?: number; left?: number };

type BoundaryPadding = {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
};

export type BoundaryFit = {
  readonly left: number;
  readonly top: number;
  readonly maxWidth: number | null;
};

export const ZERO_BOUNDARY_FIT: BoundaryFit = {
  left: 0,
  top: 0,
  maxWidth: null,
};

export function viewportClientRectEdges(): ClientRectEdges {
  const vv =
    typeof window !== 'undefined' && window.visualViewport
      ? window.visualViewport
      : null;

  if (vv) {
    return {
      left: vv.offsetLeft,
      top: vv.offsetTop,
      right: vv.offsetLeft + vv.width,
      bottom: vv.offsetTop + vv.height,
    };
  }

  const d = document.documentElement;
  return {
    left: 0,
    top: 0,
    right: d.clientWidth,
    bottom: d.clientHeight,
  };
}

export function domRectToEdges(r: DOMRectReadOnly): ClientRectEdges {
  return {
    left: r.left,
    top: r.top,
    right: r.right,
    bottom: r.bottom,
  };
}

export function intersectEdges(
  a: ClientRectEdges,
  b: ClientRectEdges
): ClientRectEdges | undefined {
  const left = Math.max(a.left, b.left);
  const top = Math.max(a.top, b.top);
  const right = Math.min(a.right, b.right);
  const bottom = Math.min(a.bottom, b.bottom);
  if (left >= right || top >= bottom) return undefined;

  return { left, top, right, bottom };
}

export function shrinkEdgesUniform(
  outer: ClientRectEdges,
  top: number,
  right: number,
  bottom: number,
  left: number
): ClientRectEdges {
  return {
    left: outer.left + left,
    top: outer.top + top,
    right: outer.right - right,
    bottom: outer.bottom - bottom,
  };
}

export function edgesWidth(edges: ClientRectEdges) {
  return Math.max(0, edges.right - edges.left);
}

export function popupBoundaryPadding(
  baseGap: number,
  offset?: Offset
): BoundaryPadding {
  const n = (num: number) => Number(num) || 0;
  return {
    top: baseGap + n(offset?.top),
    right: baseGap + n(offset?.right),
    bottom: baseGap + n(offset?.bottom),
    left: baseGap + n(offset?.left),
  };
}

export function popupBoundaryEdges({
  boundary,
  boundaryMountSelector,
  inline,
  padding,
}: {
  boundary?: 'viewport' | 'clipping';
  boundaryMountSelector: string;
  inline?: boolean;
  padding: BoundaryPadding;
}): ClientRectEdges {
  let outer = viewportClientRectEdges();
  const mode = boundary ?? (inline ? 'viewport' : 'clipping');

  if (mode === 'clipping' && !inline) {
    const mountElem = document.querySelector(boundaryMountSelector);

    if (mountElem instanceof Element) {
      outer =
        intersectEdges(
          outer,
          domRectToEdges(mountElem.getBoundingClientRect())
        ) ?? outer;
    }
  }

  const inner = shrinkEdgesUniform(
    outer,
    padding.top,
    padding.right,
    padding.bottom,
    padding.left
  );

  return inner.left < inner.right && inner.top < inner.bottom ? inner : outer;
}

export function constrainAxisShift(pref: number, lo: number, hi: number) {
  if (lo > hi) return lo;
  return Math.min(Math.max(pref, lo), hi);
}

/** Minimal shift to move `rect` into `inner`, preferring zero. */
export function shiftMarginsIntoBounds(
  rect: DOMRectReadOnly,
  inner: ClientRectEdges
): { marginLeft: number; marginTop: number } {
  const dxMin = inner.left - rect.left;
  const dxMax = inner.right - rect.right;
  const dyMin = inner.top - rect.top;
  const dyMax = inner.bottom - rect.bottom;

  return {
    marginLeft: constrainAxisShift(0, dxMin, dxMax),
    marginTop: constrainAxisShift(0, dyMin, dyMax),
  };
}

export function fitRectToBoundary(
  rect: DOMRectReadOnly,
  boundary: ClientRectEdges,
  maxWidth: number | null
): BoundaryFit {
  const { marginLeft, marginTop } = shiftMarginsIntoBounds(rect, boundary);
  return {
    left: Number.isFinite(marginLeft) ? marginLeft : 0,
    top: Number.isFinite(marginTop) ? marginTop : 0,
    maxWidth,
  };
}

export const childs: Record<Id, Id[]> = {};

let popupIds = 0;
export const getId = () => ++popupIds;

export const getPopupId = (elem, attr = 'data-popup-id') => {
  const id = elem.getAttribute(attr);
  return id ? parseInt(id, 10) : null;
};

export function isLastChild(rootId, id) {
  const ids = childs[rootId];
  return ids && ids[ids.length - 1] === id;
}

export function setChild(rootId, id) {
  if (!childs[rootId]) childs[rootId] = [];
  childs[rootId].push(id);
}

export function unsetChild(rootId, id) {
  array.spliceWhere(childs[rootId], id);
  if (!childs[rootId].length) delete childs[rootId];
}
