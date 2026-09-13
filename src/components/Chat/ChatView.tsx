import { useEffect, useRef } from 'react';

import { ChatMessage } from './ChatMessage';
import type { ChatViewProps } from './types';
import S from './ChatView.styl';
import { Scroll } from 'uilib/components/Scroll/Scroll';
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
}: ChatViewProps) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const visible = messages.filter(
    message => !isPlanMessageContent(message.content)
  );

  const lastContent = visible[visible.length - 1]?.content;

  useEffect(() => {
    const scroller = listRef.current;
    if (scroller) scrollTo(scroller, 0, scroller.scrollHeight + 80);
  }, [visible.length, lastContent, isPrompting]);

  return (
    <div className={cn(S.root, className)}>
      <Scroll
        y
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
