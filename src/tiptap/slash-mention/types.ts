import type { Editor, Range } from '@tiptap/core';

export type SlashCommandItem = {
  id: string;
  label: string;
  description?: string;
  /** Extra class on inserted mention chip (merged with `slash-mention`). */
  className?: string;
  /** CSS color for chip text; background uses 30% color blend. */
  color?: string;
};

export type SlashItemCommandContext = {
  item: SlashCommandItem;
  /** Present when picked from slash menu; omitted on submit match. */
  editor?: Editor;
  range?: Range;
};

/**
 * Return true to skip default mention insert and handle command in app.
 */
export type SlashOnItemCommand = (ctx: SlashItemCommandContext) => boolean;

export type SlashSuggestionPlacement = 'below' | 'above' | 'auto';

export type CreateSlashMentionExtensionOptions = {
  items: SlashCommandItem[];
  slashChar?: string;
  pluginKey?: import('@tiptap/pm/state').PluginKey;
  onItemCommand?: SlashOnItemCommand;
  suggestionPlacement?: SlashSuggestionPlacement;
};
