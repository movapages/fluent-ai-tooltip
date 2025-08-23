'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

/**
 * Props for the ThemeProvider component
 * @interface ThemeProviderProps
 * @property {React.ReactNode} children - Child components to be wrapped
 * @property {Theme} [defaultTheme='system'] - Initial theme preference
 * @property {string} [storageKey='ui-theme'] - Key for storing theme in localStorage
 */
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

/**
 * State interface for the ThemeProvider context
 * @interface ThemeProviderState
 * @property {Theme} theme - Current theme value
 * @property {(theme: Theme) => void} setTheme - Function to update theme
 */
type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

/**
 * Gets the current system theme preference
 * @returns {'light' | 'dark'} The system theme preference
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'ui-theme',
}: ThemeProviderProps) {
  // Initialize with system theme to avoid flash
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && (stored === 'dark' || stored === 'light' || stored === 'system')) {
        return stored;
      }
      // If no stored preference, use system theme immediately
      return defaultTheme;
    } catch (e) {
      console.warn('Failed to get theme from localStorage:', e);
      return defaultTheme;
    }
  });

  // Apply theme class immediately on mount
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
    root.classList.add(effectiveTheme);

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      try {
        localStorage.setItem(storageKey, newTheme);
      } catch (e) {
        console.warn('Failed to save theme to localStorage:', e);
      }
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};