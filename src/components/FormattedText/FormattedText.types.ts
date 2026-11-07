import type React from 'react';

export type InjectionResult = {
  elem: React.ReactNode;
  index: number;
  length: number;
} | null;

// Finds the first match in a plain string and says what to render for it
export type Injector = (content: string) => InjectionResult;

export type FormattedTextProps = {
  text: string;
  className?: string;
  onButtonClick?: (params: { text: string; [name: string]: string }) => void;
  // Show runs of "> " lines as grayed-out quotes with a bar on the left
  quotes?: boolean;
  // Extra injectors for the text outside tables and code blocks (and in table
  // cells). They run before the other built-in ones, e.g. JSON and links.
  injectors?: Injector[];
  // Turn each newline into a <br> (default). Turn it off when the container is
  // pre-wrap, so newlines stay in the text and survive copying.
  breaks?: boolean;
};
