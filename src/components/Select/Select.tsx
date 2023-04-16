import { Component, createRef, ReactNode } from 'react';
import cn from 'classnames';
import compare from 'compareq';
import pick from 'lodash.pick';
import omit from 'lodash.omit';
import { createStore } from 'justorm/react';
import Time from 'timen';

import { Icon } from 'uilib/components/Icon/Icon';
import { Button } from 'uilib/components/Button/Button';
import { Input } from 'uilib/components/Input/Input';
import { Label } from 'uilib/components/Label/Label';
import { Popup } from 'uilib/components/Popup/Popup';
import { Scroll } from 'uilib/components/Scroll/Scroll';
import { RequiredStar } from 'uilib/components/RequiredStar/RequiredStar';
import { AssistiveText } from 'uilib/components/AssistiveText/AssistiveText';
import { getInteractionMode, INTERACTION_MODE } from 'uilib/tools/dom';
import throttle from 'uilib/tools/throttle';

import * as T from './Select.types';
import * as H from './Select.helpers';
import S from './Select.styl';

export const SelectHelpers = H;

export class Select extends Component<T.Props, T.State> {
  store;
  inputRef = createRef<Input>();
  triggerInputRef = createRef<HTMLDivElement>();
  contentRef = createRef<HTMLDivElement>();
  scrollInnerElem: HTMLDivElement;
  onScrollInnerRef = elem => (this.scrollInnerElem = elem);
  focusedElem: HTMLDivElement;

  timers = Time.create();
  items = [];
  maxIndex = -1;
  isFirstSelectedMeet = false;
  isTree = false;
  focusedItemId = '';
  preventClose = false;
  searchValLower = '';
  optionsTree = [] as T.Option[];
  ids = {
    items: {},
    childIds: {},
  };

  static defaultProps = {
    size: 'm',
    additionalOptions: [],
  };

  constructor(props) {
    super(props);

    this.onOptionsChange();

    this.store = createStore(this, {
      searchVal: '',
      isOpen: false,
      isFocused: false,
      focusedItemIndex: 0,
      selected: this.getDefaultSelected(),
      expanded: this.getDefaultExpanded(props.value),
      labelClipPath: '',
    });
  }

  componentDidUpdate(prevProps) {
    const { options, value } = this.props;

    if (!compare(value, prevProps.value)) {
      this.store.selected = this.getDefaultSelected();
    }

    if (!compare(options, prevProps.options)) {
      this.onOptionsChange();
    }
  }

  componentWillUnmount() {
    this.timers.clear();
    this.unDocumetnKeyDown();
    this.unDocumentClick();
  }

  onOptionsChange() {
    const { options } = this.props;

    this.ids = H.mapById(options);
    this.optionsTree = H.buildOptionsTree(options, this.ids);
    this.items = this.getItems();
    this.maxIndex = Math.max(0, this.items.length - 1);

    if (this.store?.focusedItemIndex > this.maxIndex) {
      this.store.focusedItemIndex = this.maxIndex;
      this.focusedItemId = this.items[this.maxIndex].id;
    }
  }

  coerceType(id) {
    const isNumber = typeof this.ids.items[id].id === 'number';

    if (isNumber) return parseFloat(id);
    return id;
  }

  getDefaultExpanded(value) {
    const { expandSelected } = this.props;
    const { items } = this.ids;

    if (!expandSelected) return {};
    if (!value) return {};

    const result = {};
    const stack = [...(this.isMultiple() ? value : [value])];

    // go through all selected items and mark their parents as expanded
    while (stack.length) {
      const pointerId = stack.shift();
      const item = items[pointerId];
      if (item.parentId) {
        result[item.parentId] = true;
        stack.push(item.parentId);
      }
    }

    return result;
  }

  getDefaultSelected() {
    const { value } = this.props;

    if (!value) return {};

    if (this.isMultiple()) {
      // @ts-ignore
      return value.reduce((acc, id) => {
        const parentId = this.getParentId(id);

        if (parentId) {
          if (!acc[parentId]) {
            acc[parentId] = [id];
          } else {
            acc[parentId].push(id);
          }
        } else {
          acc[id] = this.ids.childIds[id] ? [] : true;
        }

        return acc;
      }, {});
    }

    // @ts-ignore
    return { [value]: true };
  }

  isClickedInside = elem =>
    elem.closest(`.${S.root}`) || elem.closest(`.${S.options}`);

  onFocusedElemRef = elem => {
    this.focusedElem = elem;

    if (elem) {
      const content = this.contentRef.current;

      if (!content) return;

      const { top, bottom } = elem.getBoundingClientRect();
      const rect = this.contentRef.current.getBoundingClientRect();
      const list = this.scrollInnerElem;

      if (top < rect.top) {
        list.scrollTop -= rect.top - top;
      } else if (bottom > rect.bottom) {
        list.scrollTop += bottom - rect.bottom;
      }
    }
  };

  onDocumentClick = e => {
    if (!this.isClickedInside(e.target)) {
      this.store.isOpen = false;
    }
  };

  onDocumentKeyDown = e => {
    const currIndex = this.store.focusedItemIndex;

    switch (e.key) {
      case 'ArrowDown':
        if (currIndex < this.maxIndex) this.setItemFocus(currIndex + 1);
        break;

      case 'ArrowUp':
        if (currIndex > 0) this.setItemFocus(currIndex - 1);
        break;
    }
  };

  onDocumentKeyUp = e => {
    const currIndex = this.store.focusedItemIndex;

    if (currIndex === -1) return;

    switch (e.key) {
      case 'Enter':
      case 'Space':
        if (this.store.isOpen) {
          e.preventDefault();
          e.stopPropagation();
          this.onItemToggle(this.items[currIndex].id);
        }
    }
  };

  unDocumetnKeyDown = () =>
    document.removeEventListener('keyup', this.onDocumentKeyUp, true);

  unDocumentClick = () =>
    document.removeEventListener('click', this.onDocumentClick);

  onFocus = e => {
    const { onFocus } = this.props;

    this.setSearchVal('');
    this.store.isFocused = true;
    onFocus?.(e);
  };

  onBlur = e => {
    const { onBlur } = this.props;

    this.store.isFocused = false;
    onBlur?.(e);
  };

  onSearchChange = (e, value) => {
    this.setSearchVal(value);
  };

  onExpandClick(e, id) {
    const { expanded } = this.store;

    e.preventDefault();
    e.stopPropagation();
    this.store.expanded[id] = !expanded[id];
  }

  onItemToggle(id) {
    this.onChange(this.getNewSelected(id));
    if (!this.isMultiple()) this.store.isOpen = false;
  }

  onChange(selected) {
    const { onChange } = this.props;

    this.store.selected = selected;
    onChange(this.getValue());
  }

  onLabelClipPathChange = clipPath => (this.store.labelClipPath = clipPath);

  onPopupOpen = () => {
    this.store.isOpen = true;

    if (this.isMultiple()) {
      document.addEventListener('click', this.onDocumentClick);
    }

    document.addEventListener('keydown', this.onDocumentKeyDown);
    document.addEventListener('keyup', this.onDocumentKeyUp, true);
  };

  onPopupClose = () => {
    this.setItemFocus(-1);
    this.store.isOpen = false;
    this.unDocumentClick();
    this.unDocumetnKeyDown();
  };

  onOptionHover = throttle(
    id => {
      const mode = getInteractionMode();
      if (mode !== INTERACTION_MODE.POINTER) return;

      const index = this.items.findIndex(item => item.id === id);
      this.setItemFocus(index);
    },
    100,
    { trailing: true }
  );

  setItemFocus = index => {
    this.focusedItemId = this.items[index]?.id;
    this.store.focusedItemIndex = index;
  };

  toggle = () => {
    this.store.isOpen = !this.store.isOpen;
  };

  setSearchVal(searchVal) {
    this.searchValLower = searchVal.toLowerCase();
    this.store.searchVal = searchVal;
  }

  getItems = () => [...this.props.additionalOptions, ...this.optionsTree];

  getParentId = id => this.ids.items[id]?.parentId;

  getChildIds = id => this.ids.childIds[id];

  isMultiple = () => H.isMultiple(this.props.value);

  isErrorVisible = () => !this.store.isOpen && Boolean(this.props.error);

  isSelected(id): boolean | 'indeterminate' {
    const { selected } = this.store;
    const parentId = this.getParentId(id);
    const hasParent = parentId !== undefined;

    if (hasParent) {
      // @ts-ignore
      return selected[parentId]?.indexOf(id) > -1;
    }

    const selectedVal = selected[id];

    if (Array.isArray(selectedVal)) {
      const childCount = this.getChildIds(id).length;

      if (selectedVal.length !== childCount) return 'indeterminate';
      return selectedVal.length > 0;
    }

    return selectedVal;
  }

  addSelected(id, selected) {
    if (!this.isMultiple()) return { [id]: true };

    const parentId = this.getParentId(id);
    const childIds = this.getChildIds(id);
    const hasParent = parentId !== undefined;
    const hasChilds = childIds?.length > 0;

    if (!hasParent && !hasChilds) {
      // top level without childs
      return { ...selected, [id]: true };
    }

    this.addSelectedToParent(id, selected);
    childIds?.forEach(childId => this.addSelected(childId, selected));

    return selected;
  }

  addSelectedToParent(id, selected) {
    const parentId = this.getParentId(id);

    if (parentId === undefined) return;
    if (!selected[parentId]) selected[parentId] = [];

    const arr = selected[parentId];
    const index = arr.indexOf(id);

    if (index > -1) return;

    arr.push(id);
    this.addSelectedToParent(parentId, selected);
  }

  removeSelected(id, selected) {
    if (!this.isMultiple()) return {};

    this.removeSelectedChilds(id, selected);
    this.removeSelectedFromParent(id, selected);

    return selected;
  }

  removeSelectedChilds(id, selected) {
    if (Array.isArray(selected[id])) {
      selected[id].forEach(childId =>
        this.removeSelectedChilds(childId, selected)
      );
    }

    delete selected[id];
  }

  removeSelectedFromParent(id, selected) {
    const parentId = this.getParentId(id);
    const parentSelected = selected[parentId];

    if (parentId === undefined || !parentSelected) return;

    const index = parentSelected.indexOf(id);

    if (index > -1) parentSelected.splice(index, 1);
    if (parentSelected.length === 0) {
      delete selected[parentId];
      this.removeSelectedFromParent(parentId, selected);
    }
  }

  selectAll = () => {
    let selected = {};

    this.optionsTree.forEach(
      ({ id }) => (selected = this.addSelected(id, selected))
    );

    this.onChange(selected);
  };

  setSelected(ids: T.Id[]) {
    let selected = {};

    ids.forEach(id => (selected = this.addSelected(id, selected)));

    this.onChange(selected);
  }

  dropSelected = () => {
    this.setSelected([]);
  };

  getNewSelected(id): T.State['selected'] {
    const { required } = this.props;
    const selected = JSON.parse(JSON.stringify(this.store.selected));

    if (this.isSelected(id)) {
      if (
        required &&
        (!this.isMultiple() || Object.keys(selected).length === 1)
      ) {
        return selected;
      }

      return this.removeSelected(id, selected);
    }

    return this.addSelected(id, selected);
  }

  getValue() {
    const { selected } = this.store;
    const entries = Object.entries(selected);

    if (this.isMultiple()) {
      // @ts-ignore
      return entries.reduce((acc, [id, val]) => {
        if (Array.isArray(val)) return [...acc, ...val];
        return [...acc, this.coerceType(id)];
      }, []);
    }

    const entry = entries[0];

    if (entry) return this.coerceType(entry[0]);
    return null;
  }

  getInputVal(): T.Value {
    const { isFocused, searchVal, selected } = this.store;

    if (isFocused) return searchVal as T.Id;

    const selectedPlain = Object.entries(selected).reduce((acc, entry) => {
      const parentId = this.coerceType(entry[0]);
      const val = entry[1];

      if (acc.indexOf(parentId) === -1) acc.push(parentId);
      if (Array.isArray(val)) {
        val.forEach(id => {
          if (acc.indexOf(id) === -1) acc.push(id);
        });
      }

      return acc;
    }, [] as T.Id[]);

    return selectedPlain.map(id => this.ids.items[id].label).join(', ');
  }

  getLabel(id) {
    const { label, render } = Object(this.ids.items[id]);

    if (render) return render(label);
    return label;
  }

  getFieldLabel(label) {
    // @ts-ignore
    const length = this.props.value?.length;

    if (this.isMultiple() && length) return `${label} (${length})`;
    return label;
  }

  getSelectedLabel(): string {
    const { value } = this.props;

    if (!this.isMultiple()) return this.getLabel(value);
    if (!value) return '';
    return (
      value
        // @ts-ignore
        .reduce((acc, id) => {
          const label = this.getLabel(id);
          return label ? [...acc, label] : acc;
        }, [] as string[])
        .join(', ')
    );
  }

  filterOption({ label }) {
    return label.toLowerCase().includes(this.searchValLower);
  }

  getTriggerProps() {
    const { triggerProps } = this.props;
    const props = {
      ...pick(this.props, [
        'name',
        'label',
        'size',
        'variant',
        'disabled',
        // 'inputProps',
        // 'required',
        'autocomplete',
        // 'hideRequiredStar',
      ]),
      ...triggerProps,
    };

    if (this.items.length === 0) {
      props.disabled = true;
    }

    return props;
  }

  renderAdditionalLabel() {
    const { additionalLabel } = this.props;

    if (!additionalLabel) return null;
    return <div className={S.additionalLabel}>{additionalLabel}</div>;
  }

  renderTriggerInput() {
    const { inputProps, label } = this.props;
    const value = this.getInputVal();
    const props = {
      ...this.getTriggerProps(),
      ...inputProps,
      error: this.isErrorVisible(),
      // addonLeft: this.renderSelectedItems(),
      addonRight: this.renderTriggerArrow(),
      value,
      onChange: this.onSearchChange,
      ref: this.triggerInputRef,
      label: this.getFieldLabel(label),
    } as T.Props['inputProps'] & { onBlur: T.Props['onBlur']; value: string };

    return <Input {...props} />;
  }

  renderTriggerButton() {
    const { size, disabled } = this.props;
    const { labelClipPath, isFocused } = this.store;
    const { label, className, ...rest } = this.getTriggerProps();
    const props = omit(rest, ['name', 'inputProps']);
    const selectedLabel = [
      this.getSelectedLabel(),
      this.renderAdditionalLabel(),
    ].filter(Boolean);
    const hasSelected = selectedLabel.length > 0;
    const displayLabel = hasSelected ? selectedLabel : label;
    const title = hasSelected ? selectedLabel : null;
    const triggerArrow = this.renderTriggerArrow();
    const isError = this.isErrorVisible();
    const classes = cn(
      S.triggerButton,
      isError && S.isError,
      triggerArrow && S.hasTriggerArrow,
      className
    );

    return (
      <div>
        <Button
          className={classes}
          variant="default"
          {...props}
          style={{ clipPath: labelClipPath }}
          title={title?.join?.(', ')}
        >
          <div
            className={cn(S.triggerButtonLabel, hasSelected && S.hasSelected)}
          >
            {displayLabel}
          </div>
          {triggerArrow}
        </Button>
        <Label
          size={size}
          disabled={disabled}
          isOnTop={hasSelected}
          isFocused={isFocused}
          isError={isError}
          onClipPathChange={this.onLabelClipPathChange}
        >
          {this.getFieldLabel(label)}
        </Label>
      </div>
    );
  }

  renderTriggerArrow() {
    const { size, inputProps } = this.props;
    const { isOpen, searchVal } = this.store;

    if (inputProps?.hasClear && searchVal) return null;

    return (
      <Icon
        type="chevronDown"
        className={cn(S.triggerArrow, isOpen && S.isOpen)}
        size={size}
      />
    );
  }

  renderTrigger() {
    const { isSearchable, required, hideRequiredStar, size } = this.props;

    const trigger = isSearchable
      ? this.renderTriggerInput()
      : this.renderTriggerButton();

    return (
      <div className={S.trigger}>
        {trigger}
        {required && !hideRequiredStar && <RequiredStar size={size} />}
      </div>
    );
  }

  renderFoldButton(id) {
    const { size } = this.props;

    return (
      <Button
        variant="clear"
        size={size}
        className={S.expandButton}
        onPointerUpCapture={e => this.onExpandClick(e, id)}
      >
        <Icon type="chevronRight" size={size} className={S.expandIcon} />
      </Button>
    );
  }

  renderOption = (item, level = 0) => {
    const { expanded } = this.store;
    const { id, children, isGroup } = item;
    const selectedState = this.isSelected(id);

    const isFocused = id === this.focusedItemId;
    const isExpanded = expanded[id];
    const isSelected = selectedState === true;
    const isIndeterminate = selectedState === 'indeterminate';
    const items = [] as JSX.Element[];

    const className = cn(
      S.option,
      isGroup && S.isGroup,
      isFocused && S.isFocused,
      isSelected && S.isSelected,
      isIndeterminate && S.isIndeterminate,
      isExpanded && S.isExpanded,
      S[`level-${level}`]
    );
    const props = {
      className,
      key: id,
      onPointerUp: () => this.onItemToggle(id),
      onPointerEnter: () => this.onOptionHover(id),
    } as T.OptionElemProps;

    // @ts-ignore
    if (isFocused) props.ref = this.onFocusedElemRef;

    if (isIndeterminate || (isSelected && !this.isFirstSelectedMeet)) {
      this.isFirstSelectedMeet = true;
    }

    if (children) {
      this.isTree = true;

      if (isExpanded) {
        children.forEach(child =>
          items.push(...this.renderOption(child, level + 1))
        );
      }
    }

    if (this.filterOption(item) || items.length > 0) {
      items.unshift(
        <div {...props}>
          {children?.length && this.renderFoldButton(item.id)}
          {H.renderLabel(item)}
        </div>
      );
    }

    return items;
  };

  renderOptions() {
    const { additionalOptions = [] } = this.props;

    const items = additionalOptions.concat(this.optionsTree);
    const itemsList = [] as ReactNode[];

    this.isFirstSelectedMeet = false;
    items.forEach(item => {
      itemsList.push(...this.renderOption(item));
    });

    return itemsList;
  }

  renderPresets() {
    const { presets = [], clearButton, selectAllButton } = this.props;
    const items = presets.map(({ label, ids }) => ({
      children: label,
      onClick: () => this.setSelected(ids),
      key: label,
    })) as T.PresetButtonProps[];

    if (selectAllButton) {
      items.push({
        children: 'Select all',
        onClick: this.selectAll,
        key: 'select-all-button',
      });
    }

    if (clearButton) {
      items.push({
        children: 'Clear',
        onClick: this.dropSelected,
        key: 'clear-button',
      });
    }

    if (items.length === 0) return null;

    return (
      <div className={S.presetPanel} key="preset-panel">
        {items.map(props => (
          <Button className={S.presetButton} variant="clear" {...props} />
        ))}
      </div>
    );
  }

  renderOptionsList() {
    const { size } = this.props;

    this.isTree = false;
    const classes = cn(S.options, S[`size-${size}`], this.isTree && S.isTree);

    return (
      <div ref={this.contentRef}>
        {this.renderPresets()}
        <Scroll
          y
          offset={{ y: { before: 10, after: 10 } }}
          className={classes}
          onInnerRef={this.onScrollInnerRef}
          key="items-scroll"
        >
          {this.renderOptions()}
        </Scroll>
      </div>
    );
  }

  render() {
    const { className, popupProps, size, error, blur } = this.props;
    const { isOpen, isFocused } = this.store;
    const classes = cn(S.root, className, S[`size-${size}`]);

    return (
      <>
        <Popup
          className={classes}
          direction="bottom"
          size={size}
          focusControl
          hoverControl={isFocused}
          blur={blur}
          {...popupProps}
          isOpen={isOpen}
          onOpen={this.onPopupOpen}
          onClose={this.onPopupClose}
          trigger={this.renderTrigger()}
          triggerProps={{
            onFocus: this.onFocus,
            onBlur: this.onBlur,
          }}
          content={this.renderOptionsList()}
        />
        {this.isErrorVisible() && (
          <AssistiveText variant="danger" size={size}>
            {error as string}
          </AssistiveText>
        )}
      </>
    );
  }
}
