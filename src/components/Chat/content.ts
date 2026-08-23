import type { ChatContentPart } from './types';

const PLAN_TYPES = new Set([
  'planCreated',
  'planStatusUpdate',
  'planStepUpdate',
  'planStepChunk',
]);

export function isPlanMessageContent(content: string): boolean {
  try {
    const parsed = JSON.parse(content) as { type?: string; planId?: string };
    if (parsed.planId) return true;
    if (typeof parsed.type === 'string' && PLAN_TYPES.has(parsed.type)) {
      return true;
    }
  } catch {
    // plain text
  }
  return false;
}

export function getDisplayContent(content: string): string {
  try {
    const parsed = JSON.parse(content) as {
      type?: string;
      display?: string;
      parts?: ChatContentPart[];
    };
    if (parsed.type === 'userPrompt' && typeof parsed.display === 'string') {
      return parsed.display;
    }
    if (Array.isArray(parsed.parts)) {
      return parsed.parts
        .filter(part => part.type === 'text' && typeof part.text === 'string')
        .map(part => part.text as string)
        .join('\n');
    }
  } catch {
    // plain text
  }
  return content;
}

export function getDisplayParts(content: string): ChatContentPart[] | null {
  try {
    const parsed = JSON.parse(content) as {
      type?: string;
      parts?: ChatContentPart[];
    };
    if (Array.isArray(parsed.parts) && parsed.parts.length > 0) {
      return parsed.parts;
    }
  } catch {
    // plain text
  }
  return null;
}

export function parseSystemEvent(content: string): {
  summary: string;
  body: string;
} | null {
  try {
    const parsed = JSON.parse(content) as {
      systemEventType?: string;
      systemData?: Record<string, string>;
      type?: string;
      name?: string;
      ok?: boolean;
      error?: string;
      phase?: string;
    };
    if (parsed.systemEventType && parsed.systemData) {
      switch (parsed.systemEventType) {
        case 'agent-selected':
          return {
            summary: `Agent switched to: ${parsed.systemData.agentId || 'Auto'}`,
            body: content,
          };
        case 'function-call':
          return {
            summary: `Called function: ${parsed.systemData.functionName}`,
            body: content,
          };
        case 'error':
          return {
            summary: `Error: ${parsed.systemData.errorMessage}`,
            body: content,
          };
        case 'conversation-stopped':
          return { summary: 'Conversation stopped', body: content };
        default:
          return { summary: parsed.systemEventType, body: content };
      }
    }
    if (parsed.type === 'toolInvocation' && parsed.name) {
      if (parsed.phase === 'invoked') {
        return { summary: `Calling ${parsed.name}…`, body: content };
      }
      if (parsed.ok === false) {
        return {
          summary: `${parsed.name} failed${parsed.error ? `: ${parsed.error}` : ''}`,
          body: content,
        };
      }
      return { summary: `${parsed.name} result`, body: content };
    }
  } catch {
    // not structured
  }
  return null;
}
