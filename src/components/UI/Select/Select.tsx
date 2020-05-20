import { Component, createRef, Fragment } from 'preact';
import cn from 'classnames';
import compare from 'compareq';
import pick from 'lodash.pick';

import Time from 'timen';
import { scrollIntoView } from 'tools/dom';

import Icon from '../Icon/Icon';
import Button from '../Button/Button';
import Input from '../Input/Input';
import Popup from '../Popup/Popup';
import AssistiveText from '../AssistiveText/AssistiveText';

import * as T from './Select.types';
import * as H from './Select.helpers';
import S from './Select.styl';

class Select extends Component<T.Props, T.State> {
  inputRef = createRef<Input>();
  selectedElem = createRef<HTMLDivElement>();

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

    this.state = {
      searchVal: '',
      isOpen: false,
      isFocused: false,
      selected: this.getDefaultSelected(),
      expanded: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (!compare(this.props.value, prevProps.value)) {
      this.setState({ selected: this.getDefaultSelected() });
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
    this.setState({ isFocused: true });
    if (onFocus) onFocus(e);
  };

  onBlur = e => {
    const { onBlur } = this.props;

    this.setState({ isFocused: false });

    if (onBlur) onBlur(e);
  };

  onSearchChange = e => {
    this.setSearchVal(e.target.value);
  };

  onExpandClick(e, id) {
    const { ...expanded } = this.state.expanded;

    e.preventDefault();
    e.stopPropagation();
    expanded[id] = !expanded[id];
    this.setState({ expanded });
  }

  onItemClick(id) {
    this.onChange(this.getNewSelected(id));
  }

  onChange(selected) {
    const { onChange } = this.props;
    const { isOpen } = this.state;
    const isRemoved =
      Object.keys(selected).length < Object.keys(this.state.selected).length;

    this.setState({ selected }, () => {
      onChange(this.getValue());
      if (isOpen && isRemoved) this.updateSelectedScroll();
    });
  }

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

  hookPopupClose = () => this.preventClose;

  setSearchVal(searchVal) {
    this.searchValLower = searchVal.toLowerCase();
    this.setState({ searchVal });
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
    return !this.state.isOpen && Boolean(this.props.error);
  }

  isSelected(id): boolean | 'indeterminate' {
    const { selected } = this.state;
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
    const selected = JSON.parse(JSON.stringify(this.state.selected));

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
    const { selected } = this.state;
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
    const { isFocused, searchVal, selected } = this.state;

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

  filterOption({ label }) {
    return label.toLowerCase().includes(this.searchValLower);
  }

  renderInput() {
    const { inputProps, required, hideRequiredStart, ...rest } = this.props;
    const props = {
      ...pick(['name', 'label', 'size'], rest),
      ...inputProps,
      error: this.isErrorVisible(),
      // adornmentLeft: this.renderSelectedItems(),
      value: this.getInputVal(),
      onChange: this.onSearchChange,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      ref: this.inputRef,
    } as T.Props['inputProps'] & { onBlur: T.Props['onBlur'] };

    return <Input className={S.input} {...props} />;
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
    const { expanded } = this.state;
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
          trigger={this.renderInput()}
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

export default Select;
