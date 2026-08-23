import cn from 'classnames';
import { useMemo } from 'react';

import { Expand } from 'uilib/components/Expand/Expand';
import { Link } from 'uilib/components/Router/Link/Link';

import { ChatFormattedText } from './ChatFormattedText';
import S from './ChatMessage.styl';
import {
  getDisplayContent,
  getDisplayParts,
  parseSystemEvent,
} from './content';
import type { ChatMessageProps } from './types';

export function ChatMessage({
  data,
  isStacked,
  className,
  onButtonClick,
}: ChatMessageProps) {
  const { content, role, createdAt } = data;
  const id = data.id;
  const isSystem = role === 'SYSTEM';
  const date = createdAt ? new Date(createdAt) : null;

  const systemEvent = useMemo(
    () => (isSystem ? parseSystemEvent(content) : null),
    [isSystem, content],
  );

  const parts = useMemo(
    () => (isSystem ? null : getDisplayParts(content)),
    [content, isSystem],
  );

  const body = useMemo(() => {
    if (parts) {
      return (
        <div className={S.parts}>
          {parts.map((part, i) => {
            if (part.type === 'text' && typeof part.text === 'string') {
              return (
                <ChatFormattedText
                  key={i}
                  text={part.text}
                  onButtonClick={onButtonClick}
                />
              );
            }
            if (part.type === 'image_url' && part.image_url?.url) {
              return (
                <img
                  key={i}
                  src={part.image_url.url}
                  alt=""
                  className={S.mediaPart}
                />
              );
            }
            if (part.type === 'video_url' && part.video_url?.url) {
              return (
                <video
                  key={i}
                  src={part.video_url.url}
                  controls
                  className={S.mediaPart}
                />
              );
            }
            if (part.type === 'file' && part.file?.url) {
              return (
                <div key={i} className={S.mediaPart}>
                  <Link
                    href={part.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {part.file.filename || 'Download'}
                  </Link>
                </div>
              );
            }
            if (part.type === 'input_audio' && part.input_audio?.data) {
              const format = part.input_audio.format || 'mp3';
              return (
                <audio
                  key={i}
                  src={`data:audio/${format};base64,${part.input_audio.data}`}
                  controls
                  className={S.mediaPart}
                />
              );
            }
            return null;
          })}
        </div>
      );
    }

    const text = isSystem
      ? systemEvent?.body ?? content
      : getDisplayContent(content);
    return <ChatFormattedText text={text} onButtonClick={onButtonClick} />;
  }, [content, isSystem, onButtonClick, parts, systemEvent]);

  return (
    <div
      className={cn(S.root, S[role], isStacked && S.stacked, className)}
      data-id={id}
    >
      {date && !Number.isNaN(date.getTime()) && (
        <div className={S.meta}>
          {date.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </div>
      )}
      <div className={S.text}>
        <div className={S.textContent}>
          {isSystem ? (
            <Expand
              className={S.systemFold}
              headerClassName={S.systemFoldTrigger}
              size="s"
              isOpen={false}
              header={systemEvent?.summary || getDisplayContent(content)}
              content={() => (
                <div className={S.systemFoldContent}>{body}</div>
              )}
            />
          ) : (
            body
          )}
        </div>
      </div>
    </div>
  );
}
