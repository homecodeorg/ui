import cn from 'classnames';
import { useEffect, useRef } from 'react';

import { Scroll } from 'uilib/components/Scroll/Scroll';
import { TextShimmer } from 'uilib/components/TextShimmer/TextShimmer';
import { scrollTo } from 'uilib/tools/scroll';

import { ChatMessage } from './ChatMessage';
import S from './ChatView.styl';
import { isPlanMessageContent } from './content';
import type { ChatViewProps } from './types';

export function ChatView({
  messages,
  isPrompting,
  promptingLabel = 'Thinking…',
  emptyLabel = 'Start the conversation',
  className,
  messagesClassName,
  footer,
  onButtonClick,
}: ChatViewProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const visible = messages.filter(message => !isPlanMessageContent(message.content));

  useEffect(() => {
    const scroller = listRef.current;
    if (scroller) scrollTo(scroller, 0, scroller.scrollHeight + 80);
  }, [visible.length, isPrompting]);

  return (
    <div className={cn(S.root, className)}>
      <Scroll
        y
        fadeSize="l"
        autoHide
        className={S.messages}
        innerClassName={cn(S.messagesInner, messagesClassName)}
        onInnerRef={elem => {
          listRef.current = elem;
        }}
      >
        {visible.length === 0 && <div className={S.empty}>{emptyLabel}</div>}
        {visible.map((message, index) => {
          const prev = visible[index - 1];
          const isStacked =
            Boolean(prev) &&
            prev.role === message.role &&
            message.role !== 'SYSTEM';
          return (
            <ChatMessage
              key={message.id || `${message.role}-${index}`}
              data={message}
              isStacked={isStacked}
              isLastMessage={index === visible.length - 1}
              onButtonClick={onButtonClick}
            />
          );
        })}
      </Scroll>
      {isPrompting && (
        <div className={S.status}>
          <TextShimmer>{promptingLabel}</TextShimmer>
        </div>
      )}
      {footer && <div className={S.footer}>{footer}</div>}
    </div>
  );
}
