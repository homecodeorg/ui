import type { ChatPromptModel, ChatPromptProps } from './types';
import { useRef, useState, type MouseEvent } from 'react';

import { Button } from 'uilib/components/Button/Button';
import { Icon } from 'uilib/components/Icon/Icon';
import {
  PromptComposer,
  type PromptComposerHandle,
} from 'uilib/components/PromptComposer/PromptComposer';
import S from './ChatPrompt.styl';
import { Select2 } from 'uilib/components/Select/Select2';
import { ThinkingOutline } from 'uilib/components/ThinkingOutline/ThinkingOutline';
import { Tooltip } from 'uilib/components/Tooltip/Tooltip';
import cn from 'classnames';

const DEFAULT_MODELS: ChatPromptModel[] = [
  { id: 'auto', label: 'Auto Router' },
];

export function ChatPrompt({
  value,
  onChange,
  onSubmit,
  disabled,
  isPrompting,
  placeholder = 'Message',
  className,
  showAttach = true,
  onAttach,
  attachAccept,
  showModelSelector = true,
  models = DEFAULT_MODELS,
  model,
  onModelChange,
}: ChatPromptProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const composerRef = useRef<PromptComposerHandle>(null);
  const [uncontrolledModel, setUncontrolledModel] = useState(
    model ?? models[0]?.id ?? 'auto'
  );
  const modelId = model ?? uncontrolledModel;
  const canSubmit = !disabled && Boolean(value.trim());

  const setModel = (id: string) => {
    if (model === undefined) setUncontrolledModel(id);
    onModelChange?.(id);
  };

  const onButtonsWrapperClick = (e: MouseEvent) => {
    const target = e.target;
    if (
      target instanceof HTMLElement &&
      (target.classList.contains(S.buttons) || target.classList.contains(S.gap))
    ) {
      composerRef.current?.focus();
    }
  };

  return (
    <div className={cn(S.root, className)}>
      <ThinkingOutline active={isPrompting} />
      <PromptComposer
        ref={composerRef}
        className={S.composer}
        disabled={disabled}
        placeholder={placeholder}
        prefillMessage={value}
        allowEnterSubmit
        onChange={onChange}
        onSubmit={text => {
          const next = text.trim();
          if (!next || disabled) return;
          onSubmit(next);
        }}
      />
      <div className={S.buttons} onClick={onButtonsWrapperClick}>
        <Button
          className={cn(S.button, S.submit)}
          variant="text"
          type="submit"
          round
          square
          disabled={!canSubmit}
          aria-label="Send"
          onClick={() => {
            const next = value.trim();
            if (!next || disabled) return;
            onSubmit(next);
          }}
        >
          <Icon type="arrowUp" className={S.submitIcon} />
        </Button>

        {showModelSelector && (
          <Select2
            className={S.promptModelSelector}
            label=""
            size="s"
            disableLabel
            hideRequiredStar
            round
            options={models}
            value={modelId}
            disabled={disabled}
            triggerProps={{ variant: 'clear' }}
            popupProps={{
              direction: 'top-right',
              round: true,
            }}
            onChange={next => {
              if (next == null || Array.isArray(next)) return;
              setModel(String(next));
            }}
          />
        )}

        <div className={S.gap} />

        {showAttach && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept={attachAccept}
              multiple
              className={S.fileInput}
              disabled={disabled}
              onChange={e => {
                const files = e.target.files;
                if (files?.length) onAttach?.(Array.from(files));
                e.target.value = '';
              }}
            />
            <Tooltip content="Attach" direction="right">
              <Button
                variant="text"
                className={S.attachButton}
                disabled={disabled}
                aria-label="Attach"
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon size="m" type="plus" />
              </Button>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
}
