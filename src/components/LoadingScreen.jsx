import React, { useState, useEffect, useRef } from 'react';
import { MdDesignServices, MdCode, MdVideoLibrary } from "react-icons/md";
import { HiServer } from "react-icons/hi";
import { useThemeContext } from "../context/theme-context";
import profile from '../assets/profile.png';
import './loading.css';

// Enhanced force repaint function
const forceRepaint = (element) => {
  if (!element) return;
  // Multiple techniques to force repaint
  void element.offsetWidth;
  void element.offsetHeight;
  void element.getBoundingClientRect();
  element.style.transform = 'translateZ(0)';
  element.style.willChange = 'transform, opacity';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
  element.classList.add('force-repaint');
  setTimeout(() => {
    element.classList.remove('force-repaint');
    element.style.transform = '';
    element.style.willChange = '';
  }, 0);
};

// Chrome-specific rendering workaround
const ensureChromeRendering = (element) => {
  if (!element) return;
  
  // Only apply to Chrome
  const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge|Edg/.test(navigator.userAgent);
  if (!isChrome) return;

  // Apply Chrome-specific fixes
  element.style.transform = 'translateZ(0) scale(1.0001)';
  element.style.willChange = 'transform, opacity';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
  element.style.opacity = '0.999';
  
  // Force layout and paint
  void element.offsetHeight;
  
  // Gradually restore opacity to trigger paint
  setTimeout(() => {
    element.style.opacity = '1';
    void element.offsetHeight;
  }, 10);
  
  // Continuous micro-animation to keep element painted
  let iteration = 0;
  const animate = () => {
    if (iteration >= 20) return;
    iteration++;
    element.style.transform = `translateZ(0) scale(${1 + (iteration % 2 * 0.0001)})`;
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
};

const LoadingScreen = ({ onLoadingComplete }) => {
  const { themeState } = useThemeContext();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [progressBarVisible, setProgressBarVisible] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [portfolioReady, setPortfolioReady] = useState(false);
  
  const profileRef = useRef(null);
  const outerCircleRef = useRef(null);
  const loadingScreenRef = useRef(null);
  const progressBarRef = useRef(null);
  
  const isLightTheme = themeState.background === 'bg-1';
  const backgroundColor = isLightTheme ? 'white' : '#100F0F';
  const textColor = isLightTheme ? '#100F0F' : 'white';
  const iconBgColor = isLightTheme ? 'white' : '#100F0F';

  // Prevent scrolling while loading screen is visible
  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  // Chrome-specific rendering fixes
  useEffect(() => {
    if (!progressBarRef.current) return;
    
    // Apply Chrome-specific fixes immediately
    ensureChromeRendering(progressBarRef.current);
    
    // Force initial paint
    forceRepaint(progressBarRef.current);
    
    // Add a tiny delay and force again to ensure Chrome picks it up
    setTimeout(() => {
      forceRepaint(progressBarRef.current);
    }, 50);
    
    // Continuous checks to ensure visibility
    const checkInterval = setInterval(() => {
      if (progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          forceRepaint(progressBarRef.current);
        }
      }
    }, 200);
    
    return () => clearInterval(checkInterval);
  }, []);

  // Track loading progress
  useEffect(() => {
    // Initial jump to show something immediately
    setLoadingProgress(5);
    forceRepaint(progressBarRef.current);
    
    // Simulate loading
    const simulateLoading = () => {
      const increment = () => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 5 + 2;
          return newProgress >= 100 ? 100 : newProgress;
        });
        
        // Force repaint on each update
        if (progressBarRef.current) {
          forceRepaint(progressBarRef.current);
        }
      };
      
      // Fast initial progress
      const immediateTimer = setInterval(increment, 100);
      
      // Slow down after initial progress
      setTimeout(() => {
        clearInterval(immediateTimer);
        const slowTimer = setInterval(() => {
          increment();
          if (loadingProgress >= 90) {
            clearInterval(slowTimer);
            setTimeout(() => {
              setLoadingProgress(100);
              forceRepaint(progressBarRef.current);
            }, 500);
          }
        }, 200);
      }, 1000);
    };
    
    simulateLoading();
    
    // Fallback to ensure completion
    const fallbackTimer = setTimeout(() => {
      setLoadingProgress(100);
      forceRepaint(progressBarRef.current);
    }, 5000);
    
    return () => clearTimeout(fallbackTimer);
  }, []);

  // Handle completion
  useEffect(() => {
    if (loadingProgress === 100) {
      if (onLoadingComplete) onLoadingComplete(false);
      
      setTimeout(() => {
        if (progressBarRef.current) {
          progressBarRef.current.classList.add('fade-out');
          forceRepaint(progressBarRef.current);
        }
        
        setTimeout(() => {
          setProgressBarVisible(false);
          
          setTimeout(() => {
            if (profileRef.current) {
              profileRef.current.classList.add('fade-out');
              forceRepaint(profileRef.current);
            }
            
            setTimeout(() => {
              setProfileVisible(false);
              setPortfolioReady(true);
              
              if (loadingScreenRef.current) {
                loadingScreenRef.current.classList.add('dim-screen');
                forceRepaint(loadingScreenRef.current);
                
                setTimeout(() => {
                  loadingScreenRef.current.classList.add('brighten-screen');
                  forceRepaint(loadingScreenRef.current);
                  
                  setTimeout(() => {
                    setIsVisible(false);
                    if (onLoadingComplete) onLoadingComplete(true);
                  }, 700);
                }, 500);
              }
            }, 300);
          }, 800);
        }, 400);
      }, 300);
    }
  }, [loadingProgress, onLoadingComplete]);

  if (!isVisible) return null;

  const formattedPercentage = loadingProgress >= 100 
    ? '100.00%' 
    : `${Math.min(loadingProgress, 100)}%`;

  return (
    <div 
      ref={loadingScreenRef} 
      className={`loading-screen ${portfolioReady ? 'portfolio-ready' : ''}`}
      style={{ backgroundColor: backgroundColor, color: textColor }}
    >
      <div className="content-container">
        {profileVisible && (
          <div 
            ref={profileRef} 
            className="profile__area loading-profile"
          >
            <div 
              ref={outerCircleRef} 
              className="outer__circle keep-bright" 
              style={{ borderColor: `hsl(${themeState.primaryHue}, 89%, 41%)` }}
            >
              <span 
                className="tech-icon" 
                style={{ backgroundColor: iconBgColor, color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}
              >
                <MdDesignServices />
              </span>
              <span 
                className="tech-icon" 
                style={{ backgroundColor: iconBgColor, color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}
              >
                <HiServer />
              </span>
              <span 
                className="tech-icon" 
                style={{ backgroundColor: iconBgColor, color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}
              >
                <MdCode />
              </span>
              <span 
                className="tech-icon" 
                style={{ backgroundColor: iconBgColor, color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}
              >
                <MdVideoLibrary />
              </span>
            </div>
            <div className="inner__circle">
              <img src={profile} alt="Header Portrait" />
            </div>
          </div>
        )}
        
        {progressBarVisible && (
          <div 
            ref={progressBarRef} 
            className="progress-container chrome-fix"
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${Math.min(loadingProgress, 100)}%`,
                  backgroundColor: `hsl(${themeState.primaryHue}, 89%, 41%)` 
                }} 
              />
            </div>
            <div className="progress-text">
              Loading {formattedPercentage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;