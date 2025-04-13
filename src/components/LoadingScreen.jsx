import React, { useState, useEffect, useRef } from 'react';
import { MdDesignServices, MdCode, MdVideoLibrary } from "react-icons/md";
import { HiServer } from "react-icons/hi";
import { useThemeContext } from "../context/theme-context";
import profile from '../assets/profile.png';
import './loading.css';

// Nuclear option for Chrome mobile rendering
const forceChromeRender = (element) => {
  if (!element) return;
  
  // Only apply to Chrome mobile
  const isChromeMobile = /Android.*Chrome\//.test(navigator.userAgent);
  if (!isChromeMobile) return;

  // Create a temporary element to simulate touch
  const touchSimulator = document.createElement('div');
  touchSimulator.style.position = 'fixed';
  touchSimulator.style.width = '1px';
  touchSimulator.style.height = '1px';
  touchSimulator.style.top = '0';
  touchSimulator.style.left = '0';
  touchSimulator.style.opacity = '0';
  touchSimulator.style.pointerEvents = 'none';
  touchSimulator.style.zIndex = '999999';
  document.body.appendChild(touchSimulator);

  // Simulate touch events
  const simulateTouch = () => {
    try {
      // Create and dispatch touch events
      const touchStart = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        view: window,
        touches: [new Touch({ identifier: 1, target: element, clientX: 0, clientY: 0 })],
        changedTouches: [new Touch({ identifier: 1, target: element, clientX: 0, clientY: 0 })],
        targetTouches: [new Touch({ identifier: 1, target: element, clientX: 0, clientY: 0 })]
      });
      
      const touchEnd = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        view: window
      });

      element.dispatchEvent(touchStart);
      element.dispatchEvent(touchEnd);
      
      // Also trigger a click event for good measure
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      element.dispatchEvent(clickEvent);
    } catch (e) {
      console.log('Touch simulation error:', e);
    }
  };

  // Apply aggressive styling to force rendering
  element.style.transform = 'translateZ(0) scale(1.0001)';
  element.style.willChange = 'transform, opacity';
  element.style.backfaceVisibility = 'hidden';
  element.style.perspective = '1000px';
  element.style.opacity = '0.999';
  
  // Force layout and paint
  void element.offsetHeight;
  
  // Simulate touch immediately
  simulateTouch();
  
  // Continuous simulation for 2 seconds
  let attempts = 0;
  const maxAttempts = 20;
  const interval = setInterval(() => {
    simulateTouch();
    attempts++;
    if (attempts >= maxAttempts) {
      clearInterval(interval);
      document.body.removeChild(touchSimulator);
    }
  }, 100);

  // Also force repaint through animation
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
  const nativeProgressRef = useRef(null);
  
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
    forceChromeRender(progressBarRef.current);
    
    // Also apply to native progress element if it exists
    if (nativeProgressRef.current) {
      forceChromeRender(nativeProgressRef.current);
    }
    
    // Add event listeners to capture any real user interaction
    const handleInteraction = () => {
      if (progressBarRef.current) {
        progressBarRef.current.style.opacity = '1';
      }
      if (nativeProgressRef.current) {
        nativeProgressRef.current.style.opacity = '1';
      }
    };
    
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('click', handleInteraction);
    
    return () => {
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, []);

  // Track loading progress
  useEffect(() => {
    // Initial jump to show something immediately
    setLoadingProgress(5);
    
    // Simulate loading
    const simulateLoading = () => {
      const increment = () => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 5 + 2;
          return newProgress >= 100 ? 100 : newProgress;
        });
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
            }, 500);
          }
        }, 200);
      }, 1000);
    };
    
    simulateLoading();
    
    // Fallback to ensure completion
    const fallbackTimer = setTimeout(() => {
      setLoadingProgress(100);
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
        }
        if (nativeProgressRef.current) {
          nativeProgressRef.current.classList.add('fade-out');
        }
        
        setTimeout(() => {
          setProgressBarVisible(false);
          
          setTimeout(() => {
            if (profileRef.current) {
              profileRef.current.classList.add('fade-out');
            }
            
            setTimeout(() => {
              setProfileVisible(false);
              setPortfolioReady(true);
              
              if (loadingScreenRef.current) {
                loadingScreenRef.current.classList.add('dim-screen');
                
                setTimeout(() => {
                  loadingScreenRef.current.classList.add('brighten-screen');
                  
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
          <>
            {/* Custom progress bar */}
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
            
            {/* Native progress element as fallback */}
            <div className="native-progress-container">
              <progress 
                ref={nativeProgressRef}
                className="native-progress"
                value={loadingProgress} 
                max="100"
                aria-hidden="true"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;