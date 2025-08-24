import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MultiDirectionTooltip, PopupPlacement, PopupType } from '../index';

describe('MultiDirectionTooltip - Accessibility', () => {
  beforeEach(() => {
    // Mock getBoundingClientRect for consistent positioning
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 30,
      top: 100,
      left: 100,
      bottom: 130,
      right: 200,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('ARIA attributes', () => {
    it('sets correct ARIA attributes on trigger', () => {
      const config = {
        [PopupPlacement.TOP]: {
          [PopupType.HOVER]: {
            element: 'Test tooltip content',
          },
        },
      };

      render(
        <MultiDirectionTooltip
          config={config}
          trigger={<button>Hover me</button>}
        />
      );

      const trigger = screen.getByText('Hover me');
      expect(trigger).toHaveAttribute('aria-haspopup', 'true');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).not.toHaveAttribute('aria-describedby');
    });

    it('updates ARIA attributes when tooltip is open', async () => {
      const config = {
        [PopupPlacement.TOP]: {
          [PopupType.HOVER]: {
            element: 'Test tooltip content',
            openDelay: 0,
          },
        },
      };

      render(
        <MultiDirectionTooltip
          config={config}
          trigger={<button>Hover me</button>}
        />
      );

      const trigger = screen.getByText('Hover me');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(trigger).toHaveAttribute('aria-expanded', 'true');
        expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
      });
    });

    it('sets correct ARIA attributes on tooltip', async () => {
      const config = {
        [PopupPlacement.TOP]: {
          [PopupType.HOVER]: {
            element: 'Test tooltip content',
            openDelay: 0,
          },
        },
      };

      render(
        <MultiDirectionTooltip
          config={config}
          trigger={<button>Hover me</button>}
        />
      );

      const trigger = screen.getByText('Hover me');
      fireEvent.mouseEnter(trigger);

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('role', 'tooltip');
        expect(tooltip).toHaveAttribute('aria-live', 'polite');
        expect(tooltip).toHaveAttribute('aria-hidden', 'false');
        expect(tooltip).toHaveAttribute('tabindex', '-1');
      });
    });

    it('sets different ARIA attributes for click tooltips', async () => {
      const config = {
        [PopupPlacement.TOP]: {
          [PopupType.CLICK]: {
            element: 'Click tooltip content',
          },
        },
      };

      render(
        <MultiDirectionTooltip
          config={config}
          trigger={<button>Click me</button>}
        />
      );

      const trigger = screen.getByText('Click me');
      fireEvent.click(trigger);

      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('aria-live', 'assertive');
        expect(tooltip).toHaveAttribute('aria-modal', 'true');
        expect(tooltip).toHaveAttribute('tabindex', '0');
      });
    });
  });

  describe('Keyboard navigation', () => {
    it('opens tooltip on Enter key', async () => {
      const config = {
        [PopupPlacement.TOP]: {
          [PopupType.CLICK]: {
            element: 'Keyboard tooltip content',
          },
        },
      };

      render(
        <MultiDirectionTooltip
          config={config}
          trigger={<button>Press Enter</button>}
        />
      );

      const trigger = screen.getByText('Press Enter');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent('Keyboard tooltip content');
      });
    });

    it('opens tooltip on Space key', async () => {
      const config = {
        [PopupPlacement.TOP]: {
          [PopupType.CLICK]: {
            element: 'Space tooltip content',
          },
        },
      };

      render(
        <MultiDirectionTooltip
          config={config}
          trigger={<button>Press Space</button>}
        />
      );

      const trigger = screen.getByText('Press Space');
      trigger.focus();
      fireEvent.keyDown(trigger, { key: ' ' });

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveTextContent('Space tooltip content');
      });
    });

    it('closes tooltip on Escape key', async () => {
      const config = {
        [PopupPlacement.TOP]: {
          [PopupType.CLICK]: {
            element: 'Escape tooltip content',
          },
        },
      };

      render(
        <MultiDirectionTooltip
          config={config}
          trigger={<button>Click me</button>}
        />
      );

      const trigger = screen.getByText('Click me');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      // Wait a bit for the component to be fully ready
      await new Promise(resolve => setTimeout(resolve, 10));
      
      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('returns focus to trigger after closing with Escape', async () => {
      const config = {
        [PopupPlacement.TOP]: {
          [PopupType.CLICK]: {
            element: 'Focus test content',
          },
        },
      };

      render(
        <MultiDirectionTooltip
          config={config}
          trigger={<button>Click me</button>}
        />
      );

      const trigger = screen.getByText('Click me');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      });

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        expect(document.activeElement).toBe(trigger);
      });
    });
  });

  describe('Focus management for interactive tooltips', () => {
    it('manages Tab navigation within click tooltips', async () => {
      const config = {
        [PopupPlacement.TOP]: {
          [PopupType.CLICK]: {
            element: (
              <div>
                <button>First button</button>
                <button>Second button</button>
              </div>
            ),
          },
        },
      };

      render(
        <MultiDirectionTooltip
          config={config}
          trigger={<button>Click me</button>}
        />
      );

      const trigger = screen.getByText('Click me');
      fireEvent.click(trigger);

      await waitFor(() => {
        expect(screen.getByText('First button')).toBeInTheDocument();
      });

      const firstButton = screen.getByText('First button');
      const secondButton = screen.getByText('Second button');

      // Focus should start on the tooltip container
      const tooltip = screen.getByRole('tooltip');
      expect(document.activeElement).toBe(tooltip);

      // Manually focus the first button and test Tab trapping
      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      // Test that we can focus the second button
      secondButton.focus();
      expect(document.activeElement).toBe(secondButton);

      // Test the Tab key trapping behavior
      // When on the last element and Tab is pressed, it should go to first
      fireEvent.keyDown(secondButton, { key: 'Tab' });
      expect(document.activeElement).toBe(firstButton);

      // When on first element and Shift+Tab is pressed, it should go to last
      fireEvent.keyDown(firstButton, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(secondButton);
    });
  });
});
