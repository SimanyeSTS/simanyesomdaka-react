import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { updateActiveLinkByScroll, scrollToSection } from '../components/navUtils';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [activeLink, setActiveLink] = useState("#");
  const isManualScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!isManualScrollingRef.current) {
        const newActiveLink = updateActiveLinkByScroll();
        setActiveLink(newActiveLink);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    setActiveLink(updateActiveLinkByScroll());

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleNavigation = (link) => {
    setActiveLink(link);
    isManualScrollingRef.current = true;
    scrollToSection(link);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 1500);
  };

  return (
    <NavigationContext.Provider value={{ activeLink, handleNavigation }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);