import { RefObject, useEffect } from 'react';

export type UseEventParams = {
  elem?:
    | Document
    | RefObject<HTMLElement>
    | RefObject<HTMLElement>[]
    | HTMLElement
    | HTMLElement[];
  event: string | string[];
  callback: (event: Event) => void;
  isActive?: boolean;
};

export default function useEvent({
  elem,
  event,
  callback,
  isActive = true,
}: UseEventParams): void {
  useEffect(() => {
    const events = Array.isArray(event) ? event : [event];
    const elems = elem ? (Array.isArray(elem) ? elem : [elem]) : [document];
    const getElem = (el: RefObject<HTMLElement> | HTMLElement | Document) =>
      el && ('current' in el ? el.current : el);

    const each = cb => {
      events.forEach(ev => {
        elems.forEach(el => cb(getElem(el), ev));
      });
    };

    const enable = () => {
      each((el, ev) => el?.addEventListener(ev, callback));
    };
    const disable = () => {
      each((el, ev) => el?.removeEventListener(ev, callback));
    };

    const hasRef = !elem || elems.some(getElem);

    if (isActive && hasRef) {
      enable();
    }

    return () => {
      disable();
    };
  }, [isActive, elem, callback]);
}
