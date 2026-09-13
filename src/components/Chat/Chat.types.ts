import type { ReactNode } from 'react';

import type { FormattedTextProps } from '../FormattedText/FormattedText.types';

export type ChatRole = 'USER' | 'AGENT' | 'SYSTEM';

export type ChatContentPart = {
  type: string;
  text?: string;
  image_url?: { url?: string; filePath?: string; filename?: string };
  video_url?: { url?: string; filePath?: string };
  file?: { url?: string; filePath?: string; filename?: string };
  input_audio?: { data?: string; format?: string };
};

export type ChatMessageData = {
  id?: string;
  role: ChatRole;
  content: string;
  createdAt?: string | Date;
};

export type ChatFormattedTextProps = FormattedTextProps;

export type ChatMessageProps = {
  data: ChatMessageData;
  isStacked?: boolean;
  isLastMessage?: boolean;
  className?: string;
  onButtonClick?: ChatFormattedTextProps['onButtonClick'];
};

export type ChatViewProps = {
  messages: ChatMessageData[];
  isPrompting?: boolean;
  emptyLabel?: ReactNode;
  className?: string;
  messagesClassName?: string;
  footer?: ReactNode;
  footerClassName?: string;
  onButtonClick?: ChatFormattedTextProps['onButtonClick'];
};

export type ChatPromptModel = {
  id: string;
  label: string;
};

export type ChatSelectorItem = {
  id: string;
  title: string;
};

export type ChatSelectorProps = {
  title: string;
  chats: ChatSelectorItem[];
  searchQuery: string;
  selectedId?: string;
  onSearch: (query: string) => void;
  onSelectChat: (id: string) => void;
  onRename: (title: string) => void;
  onNewChat?: () => void;
  onSearchOpen?: () => void;
  onSearchClose?: () => void;
  searchPlaceholder?: string;
  newChatLabel?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
};

export type ChatPromptProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  /** Orbiting glow on the prompt while the agent is generating. Hides the model selector. */
  isPrompting?: boolean;
  /** Shown after the attach button. Falls back to `promptingLabel` while `isPrompting`. */
  status?: ReactNode;
  promptingLabel?: ReactNode;
  placeholder?: string;
  className?: string;
  /** Default true. Hidden file input + plus button. */
  showAttach?: boolean;
  onAttach?: (files: File[]) => void;
  attachAccept?: string;
  /**
   * Presentational slot next to Send (live radio + TTS). Host app owns the
   * node — do not import GLASS LivePanel into this package.
   */
  livePanel?: ReactNode;
  /** Default true. Compact model dropdown (e.g. Auto Router). Hidden while `isPrompting`. */
  showModelSelector?: boolean;
  models?: ChatPromptModel[];
  model?: string;
  onModelChange?: (id: string) => void;
};
