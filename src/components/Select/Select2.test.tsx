import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { config } from 'uilib/tools/config';

import { Select2 } from './Select2';
import * as T from './Select.types';

const OPTIONS: T.Option[] = [
  { id: 'a', label: 'Alice' },
  { id: 'b', label: 'Bob' },
  { id: 'c', label: 'Carol' },
  { id: 'd', label: 'Дмитрий' },
  { id: 'e', label: 'さくら' },
];

const GROUPED_OPTIONS: T.Option[] = [
  { id: 'g1', label: 'People', isGroupHeader: true },
  { id: 'a', label: 'Alice' },
  { id: 'b', label: 'Bob' },
];

// Popup renders its content into a portal and unmounts it only after the
// closing animation — tests disable it to keep assertions synchronous.
const popupProps = { animated: false } as T.Props['popupProps'];

const getOptionRows = () =>
  Array.from(document.querySelectorAll<HTMLElement>('.option'));

const getOptionLabels = () => getOptionRows().map(elem => elem.textContent);

const getFocusedLabel = () =>
  document.querySelector<HTMLElement>('.option.isFocused')?.textContent ?? null;

const getOptionRow = (label: string) =>
  getOptionRows().find(elem => elem.textContent === label);

const getChipLabels = () =>
  Array.from(document.querySelectorAll<HTMLElement>('.chip .content')).map(
    elem => elem.textContent
  );

const isOpened = () => getOptionRows().length > 0;

const getSearchInput = () => screen.getByRole('textbox') as HTMLInputElement;

function Controlled({
  initialValue = null,
  onChange,
  ...rest
}: Partial<T.Props> & { initialValue?: T.Value }) {
  const [value, setValue] = useState<T.Value>(initialValue);

  return (
    <Select2
      options={OPTIONS}
      popupProps={popupProps}
      {...rest}
      value={value}
      onChange={next => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

beforeEach(() => {
  const overlay = document.createElement('div');

  overlay.id = config.appOverlayId;
  document.body.appendChild(overlay);
});

afterEach(() => {
  document.getElementById(config.appOverlayId)?.remove();
});

describe('Select2 open state', () => {
  test('opens on trigger click and keeps working after a selection', async () => {
    render(<Controlled isSearchable label="Label" />);

    await userEvent.click(getSearchInput());
    expect(isOpened()).toBe(true);

    await userEvent.click(getOptionRow('Bob'));
    await waitFor(() => expect(isOpened()).toBe(false));

    // regression: a second click used to be a no-op because the trigger kept
    // the focus, so no new focus event reached the popup
    await userEvent.click(getSearchInput());
    await waitFor(() => expect(isOpened()).toBe(true));
  });

  test('opens on keyboard focus', async () => {
    render(<Controlled isSearchable label="Label" />);

    await userEvent.tab();

    expect(getSearchInput()).toHaveFocus();
    await waitFor(() => expect(isOpened()).toBe(true));
  });

  test('closes on outside click', async () => {
    render(
      <>
        <Controlled isSearchable label="Label" />
        <button type="button">outside</button>
      </>
    );

    await userEvent.click(getSearchInput());
    expect(isOpened()).toBe(true);

    await userEvent.click(screen.getByRole('button', { name: 'outside' }));
    await waitFor(() => expect(isOpened()).toBe(false));
  });

  test('the opening click does not close when it retargets outside mid-gesture', () => {
    render(<Controlled isSearchable label="Label" />);

    // A portalled popup can mount under the cursor; the click then targets a
    // common ancestor outside the select (here document.body) even though the
    // press started on the trigger.
    fireEvent.pointerDown(getSearchInput());
    expect(isOpened()).toBe(true);

    fireEvent.pointerUp(document.body);
    fireEvent.click(document.body);
    expect(isOpened()).toBe(true);
  });

  test('a pointer gesture that started outside closes', () => {
    render(<Controlled isSearchable label="Label" />);

    fireEvent.pointerDown(getSearchInput());
    expect(isOpened()).toBe(true);

    fireEvent.pointerDown(document.body);
    fireEvent.pointerUp(document.body);
    fireEvent.click(document.body);
    expect(isOpened()).toBe(false);
  });

  test('closes on blur when the focus leaves the select', async () => {
    render(
      <>
        <Controlled isSearchable label="Label" />
        <button type="button">outside</button>
      </>
    );

    getSearchInput().focus();
    await waitFor(() => expect(isOpened()).toBe(true));

    screen.getByRole('button', { name: 'outside' }).focus();

    await waitFor(() => expect(isOpened()).toBe(false));
  });

  test('`isOpen={undefined}` leaves the component in charge of the state', async () => {
    render(<Controlled isSearchable isOpen={undefined} label="Label" />);

    await userEvent.click(getSearchInput());

    expect(isOpened()).toBe(true);
  });

  test('a boolean `isOpen` controls the popup and reports transitions', async () => {
    const onOpen = jest.fn();
    const { rerender } = render(
      <Select2
        isSearchable
        label="Label"
        options={OPTIONS}
        popupProps={popupProps}
        isOpen={false}
        value={null}
        onChange={jest.fn()}
        onOpen={onOpen}
      />
    );

    expect(isOpened()).toBe(false);

    await userEvent.click(getSearchInput());
    expect(onOpen).toHaveBeenCalledTimes(1);

    rerender(
      <Select2
        isSearchable
        label="Label"
        options={OPTIONS}
        popupProps={popupProps}
        isOpen
        value={null}
        onChange={jest.fn()}
        onOpen={onOpen}
      />
    );

    expect(isOpened()).toBe(true);
  });
});

describe('Select2 keyboard navigation', () => {
  test('arrows move the cursor, Enter selects and the trigger shows the label', async () => {
    const onChange = jest.fn();

    render(<Controlled isSearchable label="Label" onChange={onChange} />);

    await userEvent.click(getSearchInput());
    expect(getFocusedLabel()).toBe('Alice');

    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(getFocusedLabel()).toBe('Carol');

    await userEvent.keyboard('{ArrowUp}');
    expect(getFocusedLabel()).toBe('Bob');

    await userEvent.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledWith('b');
    // regression: the trigger used to stay empty until a pointer move
    await waitFor(() => expect(getSearchInput()).toHaveValue('Bob'));
  });

  test('the cursor stays inside the filtered list', async () => {
    const onChange = jest.fn();

    render(<Controlled isSearchable label="Label" onChange={onChange} />);

    await userEvent.click(getSearchInput());
    await userEvent.type(getSearchInput(), 'o');

    expect(getOptionLabels()).toEqual(['Bob', 'Carol']);
    expect(getFocusedLabel()).toBe('Bob');

    await userEvent.keyboard('{ArrowDown}');
    expect(getFocusedLabel()).toBe('Carol');

    // clamped to the last visible row instead of running into hidden options
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(getFocusedLabel()).toBe('Carol');

    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith('c');
  });

  test('group headers are rendered but never focused or selected', async () => {
    const onChange = jest.fn();

    render(
      <Controlled
        isSearchable
        label="Label"
        options={GROUPED_OPTIONS}
        onChange={onChange}
      />
    );

    await userEvent.click(getSearchInput());

    expect(getOptionLabels()).toEqual(['People', 'Alice', 'Bob']);
    expect(getFocusedLabel()).toBe('Alice');

    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(getFocusedLabel()).toBe('Alice');

    await userEvent.click(getOptionRow('People'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('Select2 search', () => {
  test('filters case-insensitively across scripts', async () => {
    render(<Controlled isSearchable label="Label" />);

    const input = getSearchInput();

    await userEvent.click(input);

    await userEvent.type(input, 'ALI');
    expect(getOptionLabels()).toEqual(['Alice']);

    await userEvent.clear(input);
    await userEvent.type(input, 'ДМИ');
    expect(getOptionLabels()).toEqual(['Дмитрий']);

    await userEvent.clear(input);
    await userEvent.type(input, 'さく');
    expect(getOptionLabels()).toEqual(['さくら']);

    await userEvent.clear(input);
    expect(getOptionLabels()).toHaveLength(OPTIONS.length);
  });

  test('reports search changes and resets the query after a selection', async () => {
    const onSearchChange = jest.fn();

    render(
      <Controlled
        isSearchable
        label="Label"
        onSearchChange={onSearchChange}
        closeOnSelect={false}
      />
    );

    await userEvent.click(getSearchInput());
    await userEvent.type(getSearchInput(), 'bo');
    expect(onSearchChange).toHaveBeenLastCalledWith('bo');

    await userEvent.click(getOptionRow('Bob'));

    expect(onSearchChange).toHaveBeenLastCalledWith('');
    await waitFor(() => expect(getSearchInput()).toHaveValue('Bob'));
  });

  test('an externally controlled `searchValue` can be cleared', async () => {
    const { rerender } = render(
      <Select2
        isSearchable
        label="Label"
        options={OPTIONS}
        popupProps={popupProps}
        searchValue="bo"
        value={null}
        onChange={jest.fn()}
      />
    );

    await userEvent.click(getSearchInput());
    expect(getOptionLabels()).toEqual(['Bob']);

    rerender(
      <Select2
        isSearchable
        label="Label"
        options={OPTIONS}
        popupProps={popupProps}
        searchValue=""
        value={null}
        onChange={jest.fn()}
      />
    );

    expect(getOptionLabels()).toHaveLength(OPTIONS.length);
  });
});

describe('Select2 value', () => {
  test('a controlled value change updates the trigger label', () => {
    const props = {
      isSearchable: true,
      label: 'Label',
      options: OPTIONS,
      popupProps,
      onChange: jest.fn(),
    };
    const { rerender } = render(<Select2 {...props} value="a" />);

    expect(getSearchInput()).toHaveValue('Alice');

    rerender(<Select2 {...props} value="c" />);
    expect(getSearchInput()).toHaveValue('Carol');
  });

  test('single mode reports the id and closes on select', async () => {
    const onChange = jest.fn();

    render(<Controlled isSearchable label="Label" onChange={onChange} />);

    await userEvent.click(getSearchInput());
    await userEvent.click(getOptionRow('Carol'));

    expect(onChange).toHaveBeenCalledWith('c');
    await waitFor(() => expect(isOpened()).toBe(false));
  });

  test('multiple mode reports an array, renders chips and stays open', async () => {
    const onChange = jest.fn();

    render(
      <Controlled
        isSearchable
        label="Label"
        initialValue={[]}
        onChange={onChange}
      />
    );

    await userEvent.click(getSearchInput());
    await userEvent.click(getOptionRow('Alice'));

    expect(onChange).toHaveBeenLastCalledWith(['a']);
    expect(isOpened()).toBe(true);

    await userEvent.click(getOptionRow('Bob'));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);
    expect(getChipLabels()).toEqual(['Alice', 'Bob']);
  });

  test('removing a chip reports the remaining ids', async () => {
    const onChange = jest.fn();

    render(
      <Controlled
        isSearchable
        label="Label"
        initialValue={['a', 'b']}
        onChange={onChange}
      />
    );

    const removeButtons =
      document.querySelectorAll<HTMLElement>('.chip .remove');

    await userEvent.click(removeButtons[0]);

    expect(onChange).toHaveBeenLastCalledWith(['b']);
    expect(getChipLabels()).toEqual(['Bob']);
  });
});

describe('Select2 presets', () => {
  test('presets, select all and clear all report through onChange', async () => {
    const onChange = jest.fn();

    render(
      <Controlled
        isSearchable
        label="Label"
        initialValue={[]}
        closeOnSelect={false}
        selectAllButton
        clearButton
        presets={[{ label: 'Pair', ids: ['a', 'b'] }]}
        onChange={onChange}
      />
    );

    await userEvent.click(getSearchInput());

    await userEvent.click(screen.getByRole('button', { name: 'Pair' }));
    expect(onChange).toHaveBeenLastCalledWith(['a', 'b']);

    await userEvent.click(screen.getByRole('button', { name: 'Select all' }));
    expect(onChange).toHaveBeenLastCalledWith(OPTIONS.map(({ id }) => id));

    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });
});
