# MultiDirectionTooltip Component

A flexible, accessible, and feature-rich tooltip component for React applications. Built with TypeScript, Tailwind CSS, and framer-motion.

## Overview

This component was developed as part of the Fluent AI technical assessment, focusing on creating a production-ready tooltip component with comprehensive features and documentation.

### Key Implementation Highlights
- Built with React 18 and TypeScript for type safety and modern development practices
- Utilizes Tailwind CSS and shadcn/ui for consistent, maintainable styling
- Implements subtle animations with framer-motion for enhanced UX
- Follows strict code quality standards with Biome
- Comprehensive test coverage and documentation

### Live Demo
- [View Demo on Vercel](https://fluent-ai-tooltip.vercel.app)
- [GitHub Repository](https://github.com/movapages/fluent-ai-tooltip)

## Features

- 🎯 Dynamic positioning with automatic flipping
- 🔄 Hover and click interactions with configurable delays
- ♿ WCAG-compliant with full keyboard navigation
- 📱 Responsive and mobile-friendly
- 🎨 Customizable with Tailwind CSS
- 🌓 Dark mode support
- 🎬 Smooth animations with framer-motion
- 🔍 Focus management and focus trapping
- 📦 Zero external dependencies (except peer dependencies)

## Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/movapages/fluent-ai-tooltip.git
cd fluent-ai-tooltip
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

### Basic Usage

```tsx
import { MultiDirectionTooltip, PopupPlacement, PopupType } from '@/components/multi-direction-tooltip';

// Basic hover tooltip
const App = () => (
  <MultiDirectionTooltip
    config={{
      [PopupPlacement.TOP]: {
        [PopupType.HOVER]: {
          element: "Simple hover tooltip",
          openDelay: 200,
          closeDelay: 100
        }
      }
    }}
    trigger="Hover me!"
  />
);
```

## API Reference

### MultiDirectionTooltipProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| config | MultiDirectionPopupConfig | Required | Configuration for tooltip behavior and content |
| trigger | React.ReactNode \| ((props: { isOpen: boolean }) => React.ReactNode) | Required | Element that triggers the tooltip |
| disableFlip | boolean | false | Disable automatic position flipping |
| defaultOffset | number | 8 | Default distance between trigger and tooltip |
| triggerClassName | string | undefined | Additional classes for trigger element |
| triggerCallbacks | { onClick?, onMouseEnter?, onMouseLeave? } | undefined | Callbacks for trigger interactions |

### MultiDirectionPopupConfig

Configuration object that defines tooltip behavior by placement and interaction type.

```typescript
type MultiDirectionPopupConfig = Partial<
  Record<
    PopupPlacement,
    {
      [PopupType.CLICK]?: BasePopupMetadata;
      [PopupType.HOVER]?: HoverPopupMetadata;
    }
  >
>;
```

### BasePopupMetadata

| Property | Type | Description |
|----------|------|-------------|
| offset | number | Distance between trigger and tooltip |
| element | React.ReactNode \| ((props: { closePopup: () => void }) => React.ReactNode) | Tooltip content |
| onMouseEnter | () => void | Mouse enter callback |
| onMouseLeave | () => void | Mouse leave callback |
| onOpenCallback | () => void | Open callback |
| onCloseCallback | () => void | Close callback |
| applyDefaultClassNames | boolean | Whether to apply default styles |
| disableFlip | boolean | Disable position flipping for this tooltip |

### HoverPopupMetadata

Extends BasePopupMetadata with additional hover-specific options:

| Property | Type | Description |
|----------|------|-------------|
| openDelay | number | Delay before opening (ms) |
| closeDelay | number | Delay before closing (ms) |
| enterable | boolean | Allow mouse interaction with tooltip |

## Examples

### Click Tooltip with Rich Content

```tsx
const richClickConfig = {
  [PopupPlacement.BOTTOM]: {
    [PopupType.CLICK]: {
      element: ({ closePopup }) => (
        <div className="p-4 max-w-sm">
          <h3 className="font-semibold mb-2">Rich Content</h3>
          <p className="text-sm text-gray-600 mb-3">
            This tooltip contains rich content with multiple elements.
          </p>
          <button 
            onClick={closePopup}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
          >
            Close
          </button>
        </div>
      ),
      offset: 12,
      applyDefaultClassNames: false
    }
  }
};

const App = () => (
  <MultiDirectionTooltip
    config={richClickConfig}
    trigger={
      <button className="px-4 py-2 bg-blue-500 text-white rounded">
        Click me!
      </button>
    }
  />
);
```

### All Placements Demo

```tsx
const allPlacementsConfig = {
  [PopupPlacement.TOP]: {
    [PopupType.HOVER]: {
      element: "Top Tooltip",
      openDelay: 100
    }
  },
  [PopupPlacement.RIGHT]: {
    [PopupType.HOVER]: {
      element: "Right Tooltip",
      openDelay: 100
    }
  },
  // ... similar for BOTTOM and LEFT
};
```

## Accessibility

The component follows WCAG guidelines and provides:

- ARIA attributes (`aria-describedby`, `aria-expanded`, etc.)
- Keyboard navigation (Tab, Enter, Space, Escape)
- Focus management for interactive tooltips
- Screen reader announcements
- Focus trapping for modal tooltips

## Performance Considerations

1. **Lazy Rendering**
   - Content is only rendered when tooltip is open
   - Animations use GPU acceleration

2. **Bundle Size**
   - Tree-shakeable exports
   - Minimal dependencies

3. **Optimizations**
   - Debounced position calculations
   - Memoized callbacks
   - Efficient DOM updates

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 not supported

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details