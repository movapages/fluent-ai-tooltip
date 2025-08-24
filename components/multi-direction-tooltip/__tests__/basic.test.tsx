import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MultiDirectionTooltip, PopupPlacement, PopupType } from '../index';

describe('MultiDirectionTooltip - Basic Functionality', () => {
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

  it('renders the trigger element', () => {
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

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip on hover', async () => {
    const config = {
      [PopupPlacement.TOP]: {
        [PopupType.HOVER]: {
          element: 'Test tooltip content',
          openDelay: 0,
          closeDelay: 0,
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
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByRole('tooltip')).toHaveTextContent('Test tooltip content');
    });
  });

  it('hides tooltip on mouse leave', async () => {
    const config = {
      [PopupPlacement.TOP]: {
        [PopupType.HOVER]: {
          element: 'Test tooltip content',
          openDelay: 0,
          closeDelay: 0,
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
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(trigger);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('shows tooltip on click', async () => {
    const config = {
      [PopupPlacement.RIGHT]: {
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
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByRole('tooltip')).toHaveTextContent('Click tooltip content');
    });
  });
});
