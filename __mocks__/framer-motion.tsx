import React from 'react';

// Simple mock for framer-motion that just renders the children
export const motion = {
  div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  )),
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
