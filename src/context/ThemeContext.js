'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => {
    // Lazy initialization to match blocking script and prevent flash
    if (typeof window !== 'undefined') {
      return localStorage.getItem('themeMode') || 'system';
    }
    return 'system';
  });

  const [theme, setTheme] = useState('dark'); // Default visual state

  useEffect(() => {
    // 2. Apply Theme Logic
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let isDark;

      if (themeMode === 'system') {
        isDark = mediaQuery.matches;
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
        }
      } else {
        isDark = themeMode === 'dark';
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        }
      }

      setTheme(isDark ? 'dark' : 'light');
    };

    applyTheme(); // Initial apply

    // Listen for system changes if in system mode
    const handleSystemChange = (e) => {
      if (themeMode === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [themeMode]);

  const setMode = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('themeMode', mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
