# Tooltip Component

Ultra-efficient tooltip system using modern Popover API with fallback support.

## Usage

### Method 1: Global TooltipProvider (Most Efficient)

Add `TooltipProvider` to your app root:

```tsx
import { TooltipProvider } from 'components/Tooltip';

function App() {
  return <TooltipProvider>{/* Your app content */}</TooltipProvider>;
}
```

Then use `data-tooltip` attribute anywhere:

```tsx
<button data-tooltip="Click me!">Button</button>
<span data-tooltip="This is helpful information">Help</span>

// With direction
<button data-tooltip="Save changes" data-tooltip-direction="bottom">Save</button>
<icon data-tooltip="Settings" data-tooltip-direction="left">⚙️</icon>

// With blur effect
<button data-tooltip="Glossy tooltip" data-tooltip-blur>Hover me</button>
```

### Method 2: Individual Tooltip Component

For more control over specific tooltips:

```tsx
import { Tooltip } from 'components/Tooltip';

<Tooltip content="Custom tooltip" delay={500}>
  <button>Hover me</button>
</Tooltip>;

// With direction
<Tooltip content="Delete item" direction="right">
  <button>🗑️</button>
</Tooltip>;

// With blur effect
<Tooltip content="Modern tooltip" blur>
  <button>Click</button>
</Tooltip>;
```

## Props

### TooltipProvider

- `data-tooltip`: Tooltip content
- `data-tooltip-direction`: `top` | `bottom` | `left` | `right` (default: `top`)
- `data-tooltip-blur`: Enable backdrop blur effect (no value needed)

### Tooltip Component

- `content`: Tooltip text or React node
- `delay`: Delay before showing (ms, default: 0)
- `direction`: `top` | `bottom` | `left` | `right` (default: `top`)
- `blur`: Enable backdrop blur effect (default: `false`)

## Features

- **Ultra-lightweight**: Single tooltip element reused globally
- **Modern API**: Uses native Popover API with automatic fallback
- **Accessible**: Keyboard support (focus/blur)
- **Performant**: Event delegation, no React re-renders
- **Customizable**: Delay timing, styling via CSS
- **Smart positioning**: Auto-adjusts to stay within viewport
- **Directional**: Support for top, bottom, left, right placement
- **Blur effect**: Modern glassmorphism with backdrop-filter

## Performance

- Only 1 DOM element for all tooltips when using `TooltipProvider`
- Event delegation reduces memory usage
- No React re-renders on hover
- Native browser positioning
