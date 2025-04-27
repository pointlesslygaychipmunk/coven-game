import React from 'react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen grid grid-cols-[14rem_1fr_16rem] bg-mauve-50 dark:bg-mauve-950 text-mauve-950 dark:text-mauve-100">
    {children}
  </div>
);
