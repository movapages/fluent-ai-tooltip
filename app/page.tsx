'use client';

import { useState } from 'react';
import {
  MultiDirectionTooltip,
  PopupPlacement,
  PopupType,
} from '@/components/multi-direction-tooltip';
import { cn } from '@/lib/utils';

type DemoSection = 'basic' | 'rich' | 'placements' | 'enterable' | 'interactive';

const DEMOS: Record<DemoSection, { title: string; description: string }> = {
  basic: {
    title: 'Basic Hover Tooltip',
    description: 'Simple text tooltip that appears on hover',
  },
  rich: {
    title: 'Rich Content',
    description: 'Tooltip with formatted content and interactive elements',
  },
  placements: {
    title: 'Placement Options',
    description: 'Demonstrate different tooltip positions (top, right, bottom, left)',
  },
  enterable: {
    title: 'Enterable Tooltip',
    description: 'Tooltip that allows mouse interaction with its content',
  },
  interactive: {
    title: 'Interactive Features',
    description: 'Keyboard navigation, focus management, and accessibility',
  },
};

const basicHoverConfig = {
  [PopupPlacement.TOP]: {
    [PopupType.HOVER]: {
      element: 'This is a simple hover tooltip',
      offset: 8,
      openDelay: 200,
      closeDelay: 100,
    },
  },
};

const richClickConfig = {
  [PopupPlacement.BOTTOM]: {
    [PopupType.CLICK]: {
      element: ({ closePopup }: { closePopup: () => void }) => (
                                <div className="p-4 max-w-sm bg-popover rounded-lg shadow-lg">
                          <h3 className="font-semibold mb-2 text-popover-foreground">Rich Content</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            This tooltip contains rich content with multiple elements.
                          </p>
                          <button
                            type="button"
                            onClick={closePopup}
                            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                          >
                            Close
                          </button>
                        </div>
      ),
      offset: 12,
      applyDefaultClassNames: false,
    },
  },
};

const makeTooltipConfig = (placement: PopupPlacement, text: string) => ({
  [placement]: {
    [PopupType.HOVER]: {
      element: text,
      openDelay: 100,
      offset: 8,
      disableFlip: true,
    },
  },
});

const enterableConfig = {
  [PopupPlacement.RIGHT]: {
    [PopupType.HOVER]: {
      element: (
                                <div className="p-2 bg-popover rounded-md">
                          <p className="text-popover-foreground">Hover over me!</p>
                          <button type="button" className="text-sm text-primary hover:text-primary/90 hover:underline mt-1">
                            Clickable content
                          </button>
                        </div>
      ),
      enterable: true,
      openDelay: 100,
      closeDelay: 100,
    },
  },
};

/**
 * Renders the content for each demo section
 * @param {Object} props - Component props
 * @param {DemoSection} props.section - The current demo section to display
 * @returns {JSX.Element} The rendered demo content
 */
const DemoContent = ({ section }: { section: DemoSection }) => {
  switch (section) {
    case 'basic':
      return (
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-8">
            The most basic usage of the tooltip - simple text that appears on hover.
          </p>
          <div className="flex items-center justify-center p-12 bg-card rounded-lg border border-border">
            <MultiDirectionTooltip
              config={basicHoverConfig}
              trigger={
                <button type="button" className="px-4 py-2 text-card-foreground border border-border rounded-md hover:bg-accent">
                  Hover me!
                </button>
              }
            />
          </div>
        </div>
      );

    case 'rich':
      return (
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-8">
            Tooltips can contain rich HTML content, including interactive elements.
          </p>
          <div className="flex items-center justify-center p-12 bg-card rounded-lg border border-border">
            <MultiDirectionTooltip
              config={richClickConfig}
              trigger={
                <button type="button" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  Click me!
                </button>
              }
            />
          </div>
        </div>
      );

    case 'placements':
      return (
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-8">
            Tooltips can be positioned in four directions: top, right, bottom, and left.
          </p>
          <div className="flex items-center justify-center p-12 bg-card rounded-lg border border-border">
            <div className="grid grid-cols-3 gap-8 place-items-center max-w-md">
              <div />
              <MultiDirectionTooltip
                config={makeTooltipConfig(PopupPlacement.TOP, 'Top Tooltip')}
                trigger={
                  <button type="button" className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent text-card-foreground">
                    Top
                  </button>
                }
                disableFlip
              />
              <div />
              <MultiDirectionTooltip
                config={makeTooltipConfig(PopupPlacement.LEFT, 'Left Tooltip')}
                trigger={
                  <button type="button" className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent text-card-foreground">
                    Left
                  </button>
                }
                disableFlip
              />
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                Center
              </div>
              <MultiDirectionTooltip
                config={makeTooltipConfig(PopupPlacement.RIGHT, 'Right Tooltip')}
                trigger={
                  <button type="button" className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent text-card-foreground">
                    Right
                  </button>
                }
                disableFlip
              />
              <div />
              <MultiDirectionTooltip
                config={makeTooltipConfig(PopupPlacement.BOTTOM, 'Bottom Tooltip')}
                trigger={
                  <button type="button" className="px-3 py-1 text-sm border border-border rounded-md hover:bg-accent text-card-foreground">
                    Bottom
                  </button>
                }
                disableFlip
              />
              <div />
            </div>
          </div>
        </div>
      );

    case 'enterable':
      return (
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-8">
            Enterable tooltips allow users to interact with content inside the tooltip.
          </p>
          <div className="flex items-center justify-center p-12 bg-card rounded-lg border border-border">
            <MultiDirectionTooltip
              config={enterableConfig}
              trigger={
                <button type="button" className="px-4 py-2 text-card-foreground border border-border rounded-md hover:bg-accent">
                  Hover for interactive content
                </button>
              }
            />
          </div>
        </div>
      );

    case 'interactive':
      return (
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-8">
            Tooltips support keyboard navigation and focus management for accessibility.
          </p>
          <div className="flex items-center justify-center p-12 bg-card rounded-lg border border-border">
            <div className="space-x-4">
              <MultiDirectionTooltip
                config={{
                  [PopupPlacement.TOP]: {
                    [PopupType.CLICK]: {
                      element: (
                        <div className="space-y-2">
                          <p className="text-popover-foreground">Press Tab to move focus</p>
                          <button type="button" className="px-2 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                            Focusable Button 1
                          </button>
                          <button type="button" className="px-2 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                            Focusable Button 2
                          </button>
                        </div>
                      ),
                    },
                  },
                }}
                trigger={
                  <button type="button" className="px-4 py-2 text-card-foreground border border-border rounded-md hover:bg-accent">
                    Click for keyboard demo
                  </button>
                }
              />
            </div>
          </div>
        </div>
      );
  }
};

/**
 * Home page component that showcases the MultiDirectionTooltip features
 * @returns {JSX.Element} The rendered home page
 */
export default function Home() {
  const [activeSection, setActiveSection] = useState<DemoSection>('basic');

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-card border-r border-border p-6">
        <h2 className="text-lg font-semibold mb-4 text-card-foreground">Features</h2>
        <nav className="space-y-1">
          {(Object.entries(DEMOS) as [DemoSection, { title: string; description: string }][]).map(
            ([key, { title, description }]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-lg text-sm transition-colors',
                  activeSection === key
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <div className="font-medium">{title}</div>
                <div className="text-xs mt-0.5 text-muted-foreground/80">{description}</div>
              </button>
            )
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">{DEMOS[activeSection].title}</h1>
          <p className="text-muted-foreground mb-8">{DEMOS[activeSection].description}</p>
          <div className="bg-muted rounded-lg border border-border">
            <DemoContent section={activeSection} />
          </div>
        </div>
      </main>
    </div>
  );
}