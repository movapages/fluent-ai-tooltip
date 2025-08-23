'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { type ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { HoverPopupMetadata, MultiDirectionTooltipProps } from './types';
import { PopupPlacement, PopupType } from './types';

/**
 * A flexible tooltip component that supports multiple directions and interaction types
 * @component
 * @param {MultiDirectionTooltipProps} props - Component props
 * @returns {JSX.Element} The rendered tooltip component
 */
export const MultiDirectionTooltip = ({
  config,
  trigger,
  disableFlip = false,
  defaultOffset = 8,
  triggerClassName,
  triggerCallbacks,
  className,
  ...props
}: MultiDirectionTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePopup, setActivePopup] = useState<{
    placement: PopupPlacement;
    type: PopupType;
    position?: { top: number; left: number };
  } | null>(null);
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).slice(2, 11)}`);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  // Create a dummy element to measure tooltip size before showing it
  const measureTooltip = useCallback((content: React.ReactNode) => {
    const dummy = document.createElement('div');
    dummy.style.position = 'absolute';
    dummy.style.visibility = 'hidden';
    dummy.style.padding = '12px'; // Match tooltip padding
    dummy.style.maxWidth = '300px'; // Reasonable max width
    dummy.innerHTML = typeof content === 'string' ? content : 'Measuring';
    document.body.appendChild(dummy);
    const rect = dummy.getBoundingClientRect();
    document.body.removeChild(dummy);
    return rect;
  }, []);

  const calculatePosition = useCallback(
    (placement: PopupPlacement) => {
      if (!triggerRef.current) return {};
      
      const triggerRect = triggerRef.current.getBoundingClientRect();
      
      // Use actual tooltip size if available, otherwise use a default size
      const popupRect = popupRef.current 
        ? popupRef.current.getBoundingClientRect()
        : { width: 200, height: 40 };
      
      const offset = defaultOffset;
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      // Calculate positions relative to viewport since we're using position: fixed
      const positions: Record<PopupPlacement, { top: number; left: number }> = {
        [PopupPlacement.TOP]: {
          top: triggerRect.top - popupRect.height - offset,
          left: triggerRect.left + (triggerRect.width - popupRect.width) / 2,
        },
        [PopupPlacement.BOTTOM]: {
          top: triggerRect.bottom + offset,
          left: triggerRect.left + (triggerRect.width - popupRect.width) / 2,
        },
        [PopupPlacement.LEFT]: {
          top: triggerRect.top + (triggerRect.height - popupRect.height) / 2,
          left: triggerRect.left - popupRect.width - offset,
        },
        [PopupPlacement.RIGHT]: {
          top: triggerRect.top + (triggerRect.height - popupRect.height) / 2,
          left: triggerRect.right + offset,
        },
      };

      // For fixed placement tooltips (like in "All Placements" demo), strictly enforce placement
      const tooltipConfig = config[placement]?.[activePopup?.type ?? PopupType.HOVER];
      if (tooltipConfig?.disableFlip || disableFlip) {
        return {
          position: positions[placement],
          placement,
        };
      }

      // For regular tooltips, check viewport boundaries and flip if needed
      const viewportLeft = 0; // Use 0 for viewport-relative calculations
      const viewportTop = 0;
      const viewportRight = window.innerWidth;
      const viewportBottom = window.innerHeight;

      // We're already in viewport coordinates since we're using getBoundingClientRect
      const viewportPos = positions[placement];

      let finalPlacement = placement;
      
      // Check boundaries and flip only if we'll be out of bounds
      if (viewportPos.left < viewportLeft) {
        finalPlacement = PopupPlacement.RIGHT;
      } else if (viewportPos.left + popupRect.width > viewportRight) {
        finalPlacement = PopupPlacement.LEFT;
      } else if (viewportPos.top < viewportTop) {
        finalPlacement = PopupPlacement.BOTTOM;
      } else if (viewportPos.top + popupRect.height > viewportBottom) {
        finalPlacement = PopupPlacement.TOP;
      }

      return {
        position: positions[finalPlacement],
        placement: finalPlacement,
      };
    },
    [defaultOffset, disableFlip]
  );

  const handleOpen = useCallback(
    (placement: PopupPlacement, type: PopupType) => {
      const popupConfig = config[placement]?.[type];
      if (!popupConfig) return;

      const delay =
        type === PopupType.HOVER ? (popupConfig as HoverPopupMetadata).openDelay || 0 : 0;

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      // Pre-calculate position before showing the tooltip
      const preCalculatedPosition = calculatePosition(placement);
      const finalPlacement = preCalculatedPosition.placement || placement;
      
      timeoutRef.current = window.setTimeout(() => {
        setIsOpen(true);
        setActivePopup({ 
          placement: finalPlacement,
          type,
          position: preCalculatedPosition.position
        });
        popupConfig.onOpenCallback?.();
      }, delay);
    },
    [config]
  );

  const handleClose = useCallback(() => {
    if (!activePopup) return;

    const popupConfig = config[activePopup.placement]?.[activePopup.type];
    if (!popupConfig) return;

    const delay =
      activePopup.type === PopupType.HOVER
        ? (popupConfig as HoverPopupMetadata).closeDelay || 0
        : 0;

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
      popupConfig.onCloseCallback?.();
      setActivePopup(null);
    }, delay);
  }, [config, activePopup]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activePopup?.type === PopupType.CLICK &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePopup, handleClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          handleClose();
          triggerRef.current?.focus();
          break;
        case 'Tab':
          if (activePopup?.type === PopupType.CLICK && popupRef.current) {
            const focusableElements = popupRef.current.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0] as HTMLElement;
            const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (event.shiftKey && document.activeElement === firstFocusable) {
              event.preventDefault();
              lastFocusable?.focus();
            } else if (!event.shiftKey && document.activeElement === lastFocusable) {
              event.preventDefault();
              firstFocusable?.focus();
            }
          }
          break;
      }
    };

    if (isOpen && activePopup?.type === PopupType.CLICK && popupRef.current) {
      popupRef.current.focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose, activePopup?.type]);

  const positionRef = useRef<{ top: number; left: number } | null>(null);
  const placementRef = useRef<PopupPlacement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (!isOpen || !activePopup || !popupRef.current) return;

      const tooltipConfig = config[activePopup.placement]?.[activePopup.type];
      const result = calculatePosition(activePopup.placement);
      
      if (!result.position) return;

      // Only update if position has changed
      if (
        !positionRef.current ||
        positionRef.current.top !== result.position.top ||
        positionRef.current.left !== result.position.left
      ) {
        positionRef.current = result.position;
        Object.assign(popupRef.current.style, {
          top: `${result.position.top}px`,
          left: `${result.position.left}px`,
        });
      }

      // Only update placement if allowed and changed
      if (
        !tooltipConfig?.disableFlip &&
        !disableFlip &&
        placementRef.current !== result.placement
      ) {
        placementRef.current = result.placement;
        requestAnimationFrame(() => {
          setActivePopup(prev => 
            prev ? { ...prev, placement: result.placement } : null
          );
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    handleResize();

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOpen, activePopup, calculatePosition, config, disableFlip]);

  const triggerElement = typeof trigger === 'function' ? trigger({ isOpen }) : trigger;
  const isButton = typeof triggerElement === 'object' && (triggerElement as ReactElement)?.type === 'button';

  const triggerProps = {
    ref: triggerRef,
    'aria-describedby': isOpen ? tooltipId.current : undefined,
    'aria-expanded': isOpen,
    'aria-haspopup': true,
    className: cn(isButton ? undefined : 'inline-block', triggerClassName),
    onClick: () => {
      triggerCallbacks?.onClick?.();
      Object.entries(config).forEach(([placement, types]) => {
        if (types[PopupType.CLICK]) {
          handleOpen(placement as PopupPlacement, PopupType.CLICK);
        }
      });
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerCallbacks?.onClick?.();
        Object.entries(config).forEach(([placement, types]) => {
          if (types[PopupType.CLICK]) {
            handleOpen(placement as PopupPlacement, PopupType.CLICK);
          }
        });
      }
    },
    onMouseEnter: () => {
      triggerCallbacks?.onMouseEnter?.();
      // Find the first hover config and use its placement
      const hoverEntry = Object.entries(config).find(([_, types]) => types[PopupType.HOVER]);
      if (hoverEntry) {
        handleOpen(hoverEntry[0] as PopupPlacement, PopupType.HOVER);
      }
    },
    onMouseLeave: () => {
      triggerCallbacks?.onMouseLeave?.();
      if (activePopup?.type === PopupType.HOVER) {
        const popupConfig = config[activePopup.placement]?.[PopupType.HOVER];
        // Only close immediately if the tooltip is not enterable
        if (!(popupConfig as HoverPopupMetadata)?.enterable) {
          handleClose();
        }
      }
    },
  };

  return (
    <div className="relative inline-block" {...props}>
      {isButton ? (
        <button
          {...(triggerElement as ReactElement).props}
          {...triggerProps}
          className={cn((triggerElement as ReactElement).props.className, triggerClassName)}
        >
          {(triggerElement as ReactElement).props.children}
        </button>
      ) : (
        <button type="button" {...triggerProps}>
          {triggerElement}
        </button>
      )}

      <AnimatePresence>
        {isOpen && activePopup && (
          <motion.div
            ref={popupRef}
            initial={(() => {
              switch (activePopup.placement) {
                case PopupPlacement.TOP:
                  return { opacity: 0, y: -8 };
                case PopupPlacement.BOTTOM:
                  return { opacity: 0, y: 8 };
                case PopupPlacement.LEFT:
                  return { opacity: 0, x: -8 };
                case PopupPlacement.RIGHT:
                  return { opacity: 0, x: 8 };
              }
            })()}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={(() => {
              switch (activePopup.placement) {
                case PopupPlacement.TOP:
                  return { opacity: 0, y: -8, scale: 0.95 };
                case PopupPlacement.BOTTOM:
                  return { opacity: 0, y: 8, scale: 0.95 };
                case PopupPlacement.LEFT:
                  return { opacity: 0, x: -8, scale: 0.95 };
                case PopupPlacement.RIGHT:
                  return { opacity: 0, x: 8, scale: 0.95 };
              }
            })()}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              mass: 0.5,
            }}
            style={{
              ...(activePopup.position || calculatePosition(activePopup.placement).position),
              position: 'fixed',
            }}
            data-placement={activePopup.placement}
            className={cn(
              'fixed z-50 tooltip-arrow',
              config[activePopup.placement]?.[activePopup.type]?.applyDefaultClassNames !== false &&
                'bg-popover text-popover-foreground rounded-lg shadow-lg border border-border p-3 text-sm backdrop-blur-sm',
              className
            )}
            onMouseEnter={() => {
              const popupConfig = config[activePopup.placement]?.[activePopup.type];
              if (
                activePopup.type === PopupType.HOVER &&
                (popupConfig as HoverPopupMetadata)?.enterable
              ) {
                if (timeoutRef.current !== null) {
                  window.clearTimeout(timeoutRef.current);
                }
                popupConfig?.onMouseEnter?.();
              }
            }}
            onMouseLeave={() => {
              const popupConfig = config[activePopup.placement]?.[activePopup.type];
              if (
                activePopup.type === PopupType.HOVER &&
                (popupConfig as HoverPopupMetadata)?.enterable
              ) {
                handleClose();
                popupConfig?.onMouseLeave?.();
              }
            }}
            id={tooltipId.current}
            role="tooltip"
            aria-live={activePopup?.type === PopupType.HOVER ? 'polite' : 'assertive'}
            aria-modal={activePopup?.type === PopupType.CLICK}
            aria-hidden={!isOpen}
            tabIndex={activePopup?.type === PopupType.CLICK ? 0 : -1}
          >
            {(() => {
              const element = config[activePopup.placement]?.[activePopup.type]?.element;
              if (typeof element === 'function') {
                return (element as (props: { closePopup: () => void }) => React.ReactNode)({
                  closePopup: handleClose,
                });
              }
              return element;
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiDirectionTooltip;