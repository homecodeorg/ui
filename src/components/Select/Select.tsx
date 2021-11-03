import { Component, createRef, Fragment } from 'preact';
import cn from 'classnames';
import compare from 'compareq';
import pick from 'lodash.pick';
import omit from 'lodash.omit';
import { createStore } from 'justorm/preact';

import Time from 'timen';
import { scrollIntoView } from 'tools/scroll';

import { Icon } from 'components/Icon/Icon';
import { Button } from 'components/Button/Button';
import { Input } from 'components/Input/Input';
import { Label } from 'components/Label/Label';
import { Popup } from 'components/Popup/Popup';
import { AssistiveText } from 'components/AssistiveText/AssistiveText';

import * as T from './Select.types';
import * as H from './Select.helpers';
import S from './Select.styl';

export class Select extends Component<T.Props, T.State> {
  store;
  inputRef = createRef<Input>();
  selectedElem = createRef<HTMLDivElement>();
  triggerInputRef = createRef<HTMLDivElement>();

  timers = Time.create();
  isFirstSelectedMeet = false;
  isTree = false;
  preventClose = false;
  searchValLower = '';
  optionsTree = [] as T.Option[];
  ids = {
    items: {},
    childIds: {},
  };

  static defaultProps = {
    size: 'm',
  };

  constructor(props) {
    super(props);

    const { options } = props;

    this.ids = H.mapById(options);
    this.optionsTree = H.buildOptionsTree(options, this.ids);

    this.store = createStore(this, {
      searchVal: '',
      isOpen: false,
      isFocused: false,
      selected: this.getDefaultSelected(),
      expanded: this.getDefaultExpanded(props.value),
      labelClipPath: '',
    });
  }

  componentDidUpdate(prevProps) {
    if (!compare(this.props.value, prevProps.value)) {
      this.store.selected = this.getDefaultSelected();
    }
  }

  componentWillUnmount() {
    this.timers.clear();
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

  onFocus = e => {
    const { onFocus } = this.props;

    this.setSearchVal('');
    this.store.isFocused = true;
    if (onFocus) onFocus(e);
  };

  onBlur = e => {
    const { onBlur } = this.props;

    this.store.isFocused = false;

    if (onBlur) onBlur(e);
  };

  onSearchChange = e => {
    this.setSearchVal(e.target.value);
  };

  onExpandClick(e, id) {
    const { expanded } = this.store;

    e.preventDefault();
    e.stopPropagation();
    this.store.expanded[id] = !expanded[id];
  }

  onItemClick(id) {
    this.onChange(this.getNewSelected(id));
  }

  onChange(selected) {
    const { onChange } = this.props;
    const { isOpen } = this.store;
    const isRemoved =
      Object.keys(selected).length < Object.keys(this.store.selected).length;

    this.store.selected = selected;
    onChange(this.getValue());
    if (isOpen && isRemoved) this.updateSelectedScroll();
  }

  onLabelClipPathChange = clipPath => (this.store.labelClipPath = clipPath);

  onPopupOpen = () => {
    const { onOpen } = this.props;

    this.setState({ isOpen: true });
    this.updateSelectedScroll();
    if (onOpen) onOpen();
  };

  onPopupClose = () => {
    const { onClose } = this.props;
    this.setState({ isOpen: false });
    if (onClose) onClose();
  };

  toggle = () => {
    this.store.isOpen = !this.store.isOpen;
  };

  hookPopupClose = () => this.preventClose;

  setSearchVal(searchVal) {
    this.searchValLower = searchVal.toLowerCase();
    this.store.searchVal = searchVal;
  }

  freezePopup = () => {
    this.preventClose = true;
  };

  unfreezePopup = () => {
    this.preventClose = false;
  };

  updateSelectedScroll() {
    const selectedElem = this.selectedElem.current;

    if (selectedElem) Time.after(50, () => scrollIntoView(selectedElem));
  }

  getParentId(id) {
    return this.ids.items[id]?.parentId;
  }

  getChildIds(id) {
    return this.ids.childIds[id];
  }

  isMultiple() {
    return H.isMultiple(this.props.value);
  }

  isErrorVisible() {
    return !this.store.isOpen && Boolean(this.props.error);
  }

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

  getInputVal() {
    const { isFocused, searchVal, selected } = this.store;

    if (isFocused) return searchVal;

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

  getFieldLabel(label, value) {
    if (this.isMultiple(value) && value.length)
      return `${label} (${value.length})`;
    return label;
  }

  getSelectedLabel(): string {
    const { value } = this.props;

    if (!this.isMultiple()) return this.getLabel(value);
    if (!value) return '';
    return value
      .reduce((acc, id) => {
        const label = this.getLabel(id);
        return label ? [...acc, label] : acc;
      }, [] as string[])
      .join(', ');
  }

  filterOption({ label }) {
    return label.toLowerCase().includes(this.searchValLower);
  }

  getTriggerProps() {
    const { triggerProps } = this.props;

    return {
      ...pick(this.props, [
        'name',
        'label',
        'size',
        'disabled',
        // 'inputProps',
        // 'required',
        'autocomplete',
        // 'hideRequiredStar',
      ]),
      ...triggerProps,
    };
  }

  renderAdditionalLabel() {
    const { additionalLabel } = this.props;

    if (!additionalLabel) return null;
    return <div className={S.additionalLabel}>{additionalLabel}</div>;
  }

  renderTriggerInput() {
    const { inputProps, value, label } = this.props;
    const props = {
      ...this.getTriggerProps(),
      ...inputProps,
      error: this.isErrorVisible(),
      // adornmentLeft: this.renderSelectedItems(),
      adornmentRight: this.renderTriggerArrow(),
      value: this.getInputVal(),
      onChange: this.setSearchVal,
      ref: this.triggerInputRef,
      label: this.getFieldLabel(label, value),
    } as T.Props['inputProps'] & { onBlur: T.Props['onBlur'] };

    return <Input {...props} />;
  }

  renderTriggerButton() {
    const { size, disabled, value } = this.props;
    const { labelClipPath, isFocused } = this.store;
    const { label, className, ...rest } = this.getTriggerProps();
    const props = omit(rest, ['name', 'inputProps']);
    const selectedLabel = [
      this.getSelectedLabel(),
      this.renderAdditionalLabel(),
    ].filter(Boolean);
    const hasSelected = selectedLabel.length > 0;
    const displayLabel = hasSelected ? selectedLabel : '  ';
    const title = hasSelected ? selectedLabel : null;
    const triggerArrow = this.renderTriggerArrow();
    const classes = cn(
      S.triggerButton,
      triggerArrow && S.hasTriggerArrow,
      className
    );

    return (
      <div>
        <Button
          className={classes}
          variant="default-primary"
          {...props}
          onClick={this.toggle}
          style={{ clipPath: labelClipPath }}
          title={title?.join?.(', ')}
        >
          {[displayLabel, triggerArrow]}
        </Button>
        <Label
          size={size}
          disabled={disabled}
          isOnTop={hasSelected}
          isFocused={isFocused}
          onClipPathChange={this.onLabelClipPathChange}
        >
          {this.getFieldLabel(label, value)}
        </Label>
      </div>
    );
  }

  renderTriggerArrow() {
    const { disableTriggerArrow } = this.props;
    const { isOpen } = this.store;
    if (disableTriggerArrow) return null;

    return (
      <Icon
        type="arrow-down"
        className={cn(S.triggerArrow, isOpen && S.isOpen)}
        size="s"
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
        onMouseUpCapture={e => this.onExpandClick(e, id)}
      >
        <Icon type="chevron-right" size={size} className={S.expandIcon} />
      </Button>
    );
  }

  renderOption = (item, level = 0) => {
    const { expanded } = this.store;
    const { id, children, isGroup } = item;
    const selectedState = this.isSelected(id);

    const isExpanded = expanded[id];
    const isSelected = selectedState === true;
    const isIndeterminate = selectedState === 'indeterminate';
    const items = [] as JSX.Element[];

    const className = cn(
      S.option,
      isGroup && S.isGroup,
      isSelected && S.isSelected,
      isIndeterminate && S.isIndeterminate,
      isExpanded && S.isExpanded,
      S[`level-${level}`]
    );
    const props = {
      className,
      key: id,
      onMouseDown: this.freezePopup,
      onMouseUp: () => this.onItemClick(id),
    } as T.OptionElemProps;

    if (isIndeterminate || (isSelected && !this.isFirstSelectedMeet)) {
      props.ref = this.selectedElem;
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
    const { groupBy, sortBy, additionalOptions = [] } = this.props;

    const itemsFormatted = H.formatOptionsList({
      options: this.optionsTree,
      groupBy,
      sortBy,
      idsMap: this.ids,
    });

    const items = additionalOptions.concat(itemsFormatted);
    const itemsList = [] as JSX.Element[];

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
          <Button className={S.presetButton} clear {...props} />
        ))}
      </div>
    );
  }

  renderOptionsList() {
    const { size } = this.props;

    this.isTree = false;
    const optionsList = this.renderOptions();
    const classes = cn(S.options, S[`size-${size}`], this.isTree && S.isTree);

    return [
      this.renderPresets(),
      <div className={classes} key="items-scroll">
        {optionsList}
      </div>,
    ];
  }

  render() {
    const { className, popupProps, size, error } = this.props;
    const classes = cn(S.root, className);

    return (
      <Fragment>
        <Popup
          className={classes}
          direction="bottom-right"
          clearTargetMargin
          {...popupProps}
          autoClose={!this.isMultiple()}
          onOpen={this.onPopupOpen}
          onClose={this.onPopupClose}
          trigger={this.renderTrigger()}
          content={this.renderOptionsList()}
        />
        {this.isErrorVisible() && (
          <AssistiveText variant="danger" size={size}>
            {error as string}
          </AssistiveText>
        )}
      </Fragment>
    );
  }
}
