import React, { useState, useEffect, useRef } from 'react';
import { MdDesignServices, MdCode, MdVideoLibrary } from "react-icons/md";
import { HiServer } from "react-icons/hi";
import { useThemeContext } from "../context/theme-context";
import profile from '../assets/profile.png';
import './loading.css';

// Force browser repaint - this helps with mobile rendering issues
const forceRepaint = (element) => {
  if (!element) return;
  // Force layout recalculation
  void element.offsetHeight;
  // Apply and remove a class to force repaint
  element.classList.add('force-repaint');
  setTimeout(() => element.classList.remove('force-repaint'), 0);
};

// Chrome-specific auto-interact function to force rendering
const autoInteractWithProgressBar = (ref) => {
  if (!ref.current) return;
  
  // Create and dispatch synthetic events to force Chrome to paint
  const triggerEvents = () => {
    // Only run this on Chrome
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge|Edg/.test(navigator.userAgent);
    if (!isChrome) return;
    
    // Create events that force Chrome to paint
    const touchEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    // Fire these events on a delay to ensure Chrome registers them
    setTimeout(() => {
      if (ref.current) {
        ref.current.dispatchEvent(touchEvent);
        ref.current.dispatchEvent(clickEvent);
        
        // Also trigger multiple RAF cycles to ensure paint
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (ref.current) forceRepaint(ref.current);
          });
        });
      }
    }, 50);
  };
  
  // Start interacting immediately
  triggerEvents();
  
  // And repeat a few times to make sure it sticks
  const intervalId = setInterval(triggerEvents, 200);
  setTimeout(() => clearInterval(intervalId), 2000); // Stop after 2 seconds
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

  // Add Chrome-specific auto-interaction to force progress bar visibility
  useEffect(() => {
    if (progressBarRef.current) {
      // Run the auto-interaction mechanism for Chrome
      autoInteractWithProgressBar(progressBarRef);
      
      // Also apply aggressive initial rendering techniques
      requestAnimationFrame(() => {
        forceRepaint(progressBarRef.current);
        
        // Force hardware acceleration
        progressBarRef.current.style.transform = 'translateZ(0)';
        progressBarRef.current.style.willChange = 'transform, opacity';
        
        // Force visibility by briefly toggling a style
        progressBarRef.current.style.opacity = '0.99';
        setTimeout(() => {
          if (progressBarRef.current) {
            progressBarRef.current.style.opacity = '1';
          }
        }, 10);
      });
    }
  }, []);

  // Track actual loading progress
  // Aggressively force progress bar rendering
  useEffect(() => {
    // Set initial progress immediately
    setLoadingProgress(5);
    
    // Force immediate repaints
    setTimeout(() => {
      if (progressBarRef.current) {
        forceRepaint(progressBarRef.current);
      }
    }, 10);
    
    // Simulate loading with forced repaints to ensure visibility
    const simulateLoading = () => {
      const increment = () => {
        setLoadingProgress(prev => {
          if (prev >= 100) return 100;
          return prev + Math.random() * 5 + 2; // Random increment for natural feel
        });
        
        // Force repaint on each update
        if (progressBarRef.current) {
          forceRepaint(progressBarRef.current);
        }
      };
      
      // Start with quick progress to show movement immediately
      const immediateTimer = setInterval(() => {
        increment();
      }, 100);
      
      // After initial fast progress, slow down for the rest
      setTimeout(() => {
        clearInterval(immediateTimer);
        const slowTimer = setInterval(() => {
          increment();
          if (loadingProgress >= 90) {
            clearInterval(slowTimer);
            
            // Final push to 100%
            setTimeout(() => {
              setLoadingProgress(100);
              forceRepaint(progressBarRef.current);
            }, 500);
          }
        }, 200);
      }, 1000);
    };
    
    // Start simulated loading immediately
    simulateLoading();
    
    // Hard fallback to ensure completion
    const fallbackTimer = setTimeout(() => {
      setLoadingProgress(100);
      if (progressBarRef.current) {
        forceRepaint(progressBarRef.current);
      }
    }, 5000);
    
    return () => {
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Handle completion sequence when loading reaches 100%
  // Preload ALL app content
  useEffect(() => {
    // Preload all images in the document
    const preloadAllImages = () => {
      const imgElements = document.querySelectorAll('img[src]');
      imgElements.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
          const preloadLink = document.createElement('link');
          preloadLink.rel = 'preload';
          preloadLink.as = 'image';
          preloadLink.href = src;
          document.head.appendChild(preloadLink);
        }
      });
    };
    
    // Execute preloading
    preloadAllImages();
  }, []);

  // Handle completion with no white flash
  useEffect(() => {
    if (loadingProgress === 100) {
      // Make sure app content is rendered BEFORE removing loading screen
      // Render the main app behind the scenes
      if (onLoadingComplete) {
        // Signal to render main app while loading screen is still visible
        onLoadingComplete(false); // false = don't remove loading screen yet
      }
      
      // Wait a bit to ensure main app content is ready
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
                
                // Only after transition to transparent is complete, trigger loading screen removal
                setTimeout(() => {
                  loadingScreenRef.current.classList.add('brighten-screen');
                  forceRepaint(loadingScreenRef.current);
                  
                  // Now that the screen is transparent, we can safely hide it
                  setTimeout(() => {
                    setIsVisible(false);
                    if (onLoadingComplete) onLoadingComplete(true); // true = now we can fully remove it
                  }, 700);
                }, 500); // Reduced from 1000ms to 500ms
              }
            }, 300); // Reduced from 600ms to 300ms
          }, 800); // Reduced from 1500ms to 800ms
        }, 400); // Reduced from 600ms to 400ms
      }, 300);
    }
  }, [loadingProgress, onLoadingComplete]);

  if (!isVisible) return null;

  // Format the loading percentage - show 100.00% only when it reaches 100%
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
            onTouchStart={() => {}} // Chrome mobile fix
            onClick={() => {}} // Chrome mobile fix
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${Math.min(loadingProgress, 100)}%`, // Ensure never exceeds 100%
                  backgroundColor: `hsl(${themeState.primaryHue}, 89%, 41%)` 
                }} 
              />
            </div>
            <div className="progress-text">
              Loading {formattedPercentage} {/* Using the formatted percentage */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;