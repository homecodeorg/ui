import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import { DropZone } from './DropZone';
import { DROP_HIDE_GRACE_MS } from './dropFiles';

function transfer(
  files: File[],
  types: string[] = ['Files'],
  items: { kind: string; getAsFile?: () => File | null }[] = []
) {
  return { types, files, items, dropEffect: 'none' as string };
}

function drag(
  type: string,
  dataTransfer: ReturnType<typeof transfer>,
  relatedTarget: Node | null = null
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });
  Object.defineProperty(event, 'relatedTarget', { value: relatedTarget });
  return event;
}

describe('DropZone macOS file drag', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('keeps the overlay up when dragleave has no relatedTarget', () => {
    const onFiles = jest.fn();
    render(
      <DropZone
        ghost
        multiple
        accept=""
        label="Drop files here"
        onFiles={onFiles}
      />
    );
    const data = transfer([new File(['x'], 'note.txt')]);

    act(() => {
      window.dispatchEvent(drag('dragenter', data));
      window.dispatchEvent(drag('dragover', data));
    });
    expect(screen.getByText('Drop files here')).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(drag('dragleave', data, null));
    });
    expect(screen.getByText('Drop files here')).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(drag('drop', data));
    });
    expect(onFiles).toHaveBeenCalledTimes(1);
    expect(onFiles.mock.calls[0][0][0].name).toBe('note.txt');
    expect(data.dropEffect).toBe('copy');
  });

  test('hides the overlay after the pointer has left', () => {
    render(
      <DropZone
        ghost
        multiple
        accept=""
        label="Drop files here"
        onFiles={jest.fn()}
      />
    );
    const data = transfer([new File(['x'], 'note.txt')]);
    act(() => {
      window.dispatchEvent(drag('dragover', data));
      window.dispatchEvent(drag('dragleave', data, null));
    });
    expect(screen.getByText('Drop files here')).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(DROP_HIDE_GRACE_MS);
    });
    expect(screen.queryByText('Drop files here')).not.toBeInTheDocument();
  });

  test('does not upload a drop claimed by an earlier listener', () => {
    const onFiles = jest.fn();
    render(
      <DropZone
        ghost
        multiple
        accept=""
        label="Drop files here"
        onFiles={onFiles}
      />
    );
    const data = transfer([
      new File([], 'GLASS.app', { type: 'application/octet-stream' }),
    ]);
    const event = drag('drop', data);
    event.preventDefault();
    act(() => {
      window.dispatchEvent(event);
    });
    expect(onFiles).not.toHaveBeenCalled();
  });
});
