import type { ReactNode } from 'react';

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

export type ChatFormattedTextProps = {
  text: string;
  className?: string;
  onButtonClick?: (params: { text: string; [name: string]: string }) => void;
};

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
  /** Default true. Hidden file input + plus button (no STT / live voice). */
  showAttach?: boolean;
  onAttach?: (files: File[]) => void;
  attachAccept?: string;
  /** Default true. Compact model dropdown (e.g. Auto Router). */
  showModelSelector?: boolean;
  models?: ChatPromptModel[];
  model?: string;
  onModelChange?: (id: string) => void;
};
