import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'MultiDirectionTooltip Examples',
  description: 'A flexible, accessible tooltip component for React applications',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider defaultTheme="system" storageKey="fluent-ai-theme">
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}