import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import themeReducer from "./themeReducer";

export const ThemeContext = createContext();

const getInitialThemeState = () => {
  const useSystemTheme = sessionStorage.getItem("useSystemTheme") === "true" || 
                         sessionStorage.getItem("useSystemTheme") === null;
  
  const storedTheme = JSON.parse(localStorage.getItem("themeSettings")) || {};
  
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const systemTheme = systemPrefersDark ? "bg-2" : "bg-1";
  
  if (useSystemTheme || !storedTheme.background) {
    return {
      primary: storedTheme.primary || "color-1",
      primaryHue: storedTheme.primaryHue || 270,
      background: systemTheme
    };
  }
  
  return storedTheme;
};

export const ThemeProvider = ({ children }) => {
  const [themeState, dispatchTheme] = useReducer(
    themeReducer,
    getInitialThemeState()
  );

  const themeHandler = (buttonClassName) => {
    dispatchTheme({ type: buttonClassName });
    
    if (buttonClassName === "bg-1" || buttonClassName === "bg-2") {
      sessionStorage.setItem("useSystemTheme", "false");
    }
  };

  const handleSystemThemeChange = useCallback((e) => {
    const useSystemTheme = sessionStorage.getItem("useSystemTheme") === "true" || 
                           sessionStorage.getItem("useSystemTheme") === null;
    
    if (useSystemTheme) {
      dispatchTheme({
        type: e.matches ? "bg-2" : "bg-1"
      });
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [handleSystemThemeChange]);

  useEffect(() => {
    localStorage.setItem("themeSettings", JSON.stringify(themeState));
  }, [themeState]);

  useEffect(() => {
    const detectPageLoadType = () => {
      if (window.performance && window.performance.navigation) {
        const navType = window.performance.navigation.type;
        
        if (navType === 2) {
          sessionStorage.setItem("useSystemTheme", "true");
        } else if (navType === 0) {
          if (!sessionStorage.getItem("useSystemTheme")) {
            sessionStorage.setItem("useSystemTheme", "true");
          }
        }
      } else {
        if (!sessionStorage.getItem("pageLoaded")) {
          sessionStorage.setItem("useSystemTheme", "true");
          sessionStorage.setItem("pageLoaded", "true");
        }
      }
    };
    
    detectPageLoadType();
    
    const handleBeforeUnload = (e) => {
      if (e.ctrlKey && e.shiftKey) {
        sessionStorage.setItem("useSystemTheme", "true");
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'r' || e.keyCode === 82)) {
        sessionStorage.setItem("useSystemTheme", "true");
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ themeState, themeHandler }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);