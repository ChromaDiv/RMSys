'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const DemoContext = createContext();

export function DemoProvider({ children }) {
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Persist demo state if needed, or default to false on refresh?
    // User request: "Default language should be english" implies defaults are important.
    // For demo mode, usually it's ephemeral, but let's check localStorage to be nice?
    // actually, let's keep it ephemeral for security/logic, unless explicitly set.
    const storedDemo = localStorage.getItem('rms_is_demo');
    if (storedDemo === 'true') {
      setIsDemo(true);
    }
  }, []);

  const setDemo = (value) => {
    setIsDemo(value);
    if (value) {
      localStorage.setItem('rms_is_demo', 'true');
    } else {
      localStorage.removeItem('rms_is_demo');
    }
  };

  return (
    <DemoContext.Provider value={{ isDemo, setDemo }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  return useContext(DemoContext);
}
