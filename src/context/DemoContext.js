'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from '@/context/AuthContext';

const DemoContext = createContext();

export function DemoProvider({ children }) {
  const [isDemo, setIsDemo] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    // If user is logged in, force demo mode OFF
    if (session) {
      console.log('Session detected, disabling demo mode.');
      setIsDemo(false);
      localStorage.removeItem('rms_is_demo');
      return;
    }

    const storedDemo = localStorage.getItem('rms_is_demo');
    if (storedDemo === 'true') {
      setIsDemo(true);
    }
  }, [session]);

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
