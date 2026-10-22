import { Link } from '@tiptap/extension-link';

/**
 * Link with autolink, but non-inclusive. Stock Link is inclusive whenever
 * autolink is on, so text typed at a link's edge (e.g. before a URL at the
 * start of the line) joins the link. Autolink still re-links the URL itself
 * once a space is typed after it.
 */
export const NonInclusiveLink = Link.extend({
  inclusive: () => false,
});
