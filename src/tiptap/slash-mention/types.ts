import type { Editor, Range } from '@tiptap/core';

import type { IconType } from '../../components/Icon/Icon.types';

export type SlashCommandItem = {
  id: string;
  label: string;
  description?: string;
  /** Left icon in the slash suggestion list (`<Icon type={icon} />`). */
  icon?: IconType;
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

export type SlashGetItems = (
  query: string
) => SlashCommandItem[] | Promise<SlashCommandItem[]>;

export type PromptMentionConfig = {
  slashChar: string;
  /** Static items (client-filtered). Ignored when getItems is set. */
  items?: SlashCommandItem[];
  /** Async/dynamic items (e.g. server search for @files). */
  getItems?: SlashGetItems;
  onItemCommand?: SlashOnItemCommand;
  pluginKey?: import('@tiptap/pm/state').PluginKey;
};

export type CreateSlashMentionExtensionOptions = {
  items?: SlashCommandItem[];
  getItems?: SlashGetItems;
  slashChar?: string;
  pluginKey?: import('@tiptap/pm/state').PluginKey;
  onItemCommand?: SlashOnItemCommand;
  suggestionPlacement?: SlashSuggestionPlacement;
};
