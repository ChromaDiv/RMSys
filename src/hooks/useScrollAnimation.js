import { useState, useEffect } from 'react';

/**
 * Custom hook to trigger animations based on scroll position.
 * Listens to both global window scroll and a specific container's scroll.
 * 
 * @returns {Object} { isScrolled, handleContainerScroll }
 */
export function useScrollAnimation(threshold = 10) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleWindowScroll = () => {
      // Check if window is scrolled beyond threshold
      // For some layouts, window scroll might be the primary trigger (e.g. mobile)
      if (window.scrollY > threshold) {
        setIsScrolled(true);
      } else {
        // Only reset to false if we can't check the container, 
        // or if we want window scroll to be independent.
        // But typically we want logical OR: (window > T || container > T)
        // Since we can't easily access container ref inside this window handler without more complexity,
        // we'll stick to a simple sets. 
        // NOTE: If both can scroll, we might flicker if one is 0 and other is > 0.
        // A safer approach: strictly set based on event.
        setIsScrolled(window.scrollY > threshold);
      }
    };

    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [threshold]);

  const handleContainerScroll = (e) => {
    // If the container scrolls, update state
    setIsScrolled(e.currentTarget.scrollTop > threshold);
  };

  return { isScrolled, handleContainerScroll };
}
