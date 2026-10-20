// Popover API, missing from the DOM lib in TypeScript 4.9
interface HTMLElement {
  showPopover(): void;
  hidePopover(): void;
  togglePopover(force?: boolean): boolean;
}
