import { useEffect, useRef } from 'react';

import { ChatMessage } from './ChatMessage';
import type { ChatViewProps } from './types';
import S from './ChatView.styl';
import { Scroll, type ScrollRef } from 'uilib/components/Scroll/Scroll';
import cn from 'classnames';
import { isPlanMessageContent } from './content';
import { scrollTo } from 'uilib/tools/scroll';

export function ChatView({
  messages,
  isPrompting,
  emptyLabel = 'Start the conversation',
  className,
  messagesClassName,
  footer,
  onButtonClick,
  footerClassName,
  autoScroll = true,
}: ChatViewProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<ScrollRef>(null);
  const visible = messages.filter(
    message => !isPlanMessageContent(message.content)
  );

  const lastMessage = visible[visible.length - 1];
  const lastContent = lastMessage?.content;

  useEffect(() => {
    if (autoScroll) return;
    const scroller = listRef.current;
    if (scroller) scrollTo(scroller, 0, scroller.scrollHeight + 80);
  }, [autoScroll, visible.length, lastContent, isPrompting]);

  // A new user message always brings the view back to the bottom
  useEffect(() => {
    if (autoScroll && lastMessage?.role === 'USER') {
      scrollRef.current?.scrollToBottom();
    }
  }, [autoScroll, visible.length]);

  return (
    <div className={cn(S.root, className)}>
      <Scroll
        ref={scrollRef}
        y
        autoScroll={autoScroll}
        fadeSize="l"
        autoHide
        offset={{ y: { after: 30 } }}
        className={S.messages}
        innerClassName={cn(
          S.messagesInner,
          footer && S.messagesInnerWithPrompt,
          messagesClassName
        )}
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
            prev.author === message.author &&
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
      {footer && (
        <div className={cn(S.footer, footerClassName)}>{footer}</div>
      )}
    </div>
  );
}
