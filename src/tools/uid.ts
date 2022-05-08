import { nanoid } from 'nanoid';

export function generateUID() {
  return nanoid().replace(/^\d+/g, '').replace(/-/g, '_');
}
