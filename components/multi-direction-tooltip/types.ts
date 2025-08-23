import type { HTMLAttributes } from 'react';

/**
 * Defines the possible placement positions for the tooltip
 * @enum {string}
 */
export enum PopupPlacement {
  TOP = 'top',
  LEFT = 'left',
  RIGHT = 'right',
  BOTTOM = 'bottom',
}

/**
 * Defines the interaction types for the tooltip
 * @enum {string}
 */
export enum PopupType {
  HOVER = 'hover',
  CLICK = 'click',
}

/**
 * Base configuration for all tooltip types
 * @interface BasePopupMetadata
 * @property {number} [offset] - Distance between trigger and tooltip in pixels
 * @property {() => void} [onMouseEnter] - Callback when mouse enters the tooltip
 * @property {() => void} [onMouseLeave] - Callback when mouse leaves the tooltip
 * @property {() => void} [onOpenCallback] - Callback when tooltip opens
 * @property {() => void} [onCloseCallback] - Callback when tooltip closes
 * @property {boolean} [applyDefaultClassNames] - Whether to apply default Tailwind classes
 * @property {boolean} [disableFlip] - Disable automatic position flipping for this tooltip
 * @property {React.ReactNode | ((props: { closePopup: () => void }) => React.ReactNode)} element - Content to display
 */
export interface BasePopupMetadata {
  offset?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onOpenCallback?: () => void;
  onCloseCallback?: () => void;
  applyDefaultClassNames?: boolean;
  disableFlip?: boolean;
  element: React.ReactNode | ((props: { closePopup: () => void }) => React.ReactNode);
}

/**
 * Configuration specific to hover-triggered tooltips
 * @interface HoverPopupMetadata
 * @extends BasePopupMetadata
 * @property {number} [openDelay] - Delay in ms before opening the tooltip
 * @property {number} [closeDelay] - Delay in ms before closing the tooltip
 * @property {boolean} [enterable] - Whether the tooltip can be interacted with
 */
export interface HoverPopupMetadata extends BasePopupMetadata {
  openDelay?: number;
  closeDelay?: number;
  enterable?: boolean;
}

/**
 * Configuration object for the MultiDirectionTooltip component
 * @typedef {Object} MultiDirectionPopupConfig
 * @property {Object} [PopupPlacement] - Configuration for each placement position
 * @property {BasePopupMetadata} [PopupPlacement.click] - Click tooltip configuration
 * @property {HoverPopupMetadata} [PopupPlacement.hover] - Hover tooltip configuration
 */
export type MultiDirectionPopupConfig = Partial<
  Record<
    PopupPlacement,
    {
      [PopupType.CLICK]?: BasePopupMetadata;
      [PopupType.HOVER]?: HoverPopupMetadata;
    }
  >
>;

/**
 * Props for the MultiDirectionTooltip component
 * @interface MultiDirectionTooltipProps
 * @extends {HTMLAttributes<HTMLDivElement>}
 * @property {boolean} [disableFlip] - Disable automatic position flipping
 * @property {number} [defaultOffset] - Default distance between trigger and tooltip
 * @property {string} [triggerClassName] - Additional classes for trigger element
 * @property {MultiDirectionPopupConfig} config - Tooltip configuration by placement and type
 * @property {React.ReactNode | ((props: { isOpen: boolean }) => React.ReactNode)} trigger - Trigger element or render function
 * @property {Object} [triggerCallbacks] - Callbacks for trigger element interactions
 */
export interface MultiDirectionTooltipProps extends HTMLAttributes<HTMLDivElement> {
  disableFlip?: boolean;
  defaultOffset?: number;
  triggerClassName?: string;
  config: MultiDirectionPopupConfig;
  trigger: React.ReactNode | ((props: { isOpen: boolean }) => React.ReactNode);
  triggerCallbacks?: {
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  };
}
