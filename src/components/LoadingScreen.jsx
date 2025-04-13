import React, { useState, useEffect, useRef } from 'react';
import { MdDesignServices, MdCode, MdVideoLibrary } from "react-icons/md";
import { HiServer } from "react-icons/hi";
import { useThemeContext } from "../context/theme-context";
import profile from '../assets/profile.png';
import './loading.css';

const LoadingScreen = ({ onLoadingComplete }) => {
  const { themeState } = useThemeContext();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [progressBarVisible, setProgressBarVisible] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [portfolioReady, setPortfolioReady] = useState(false);
  const [forceRender, setForceRender] = useState(0); // New state for forcing renders
  
  const profileRef = useRef(null);
  const loadingScreenRef = useRef(null);
  const progressBarRef = useRef(null);
  const animationFrameRef = useRef(null); // Reference for animation frame

  const isLightTheme = themeState.background === 'bg-1';
  const backgroundColor = isLightTheme ? 'white' : '#100F0F';
  const textColor = isLightTheme ? '#100F0F' : 'white';
  const iconBgColor = isLightTheme ? 'white' : '#100F0F';
  const progressColor = `hsl(${themeState.primaryHue}, 89%, 41%)`;

  // Check if Chrome Mobile
  const isChromeMobile = () => {
    return /Android.*Chrome\//.test(navigator.userAgent);
  };

  // Chrome-specific rendering fixes
  useEffect(() => {
    if (!isChromeMobile()) return;
    
    // Force rendering by using requestAnimationFrame
    const forceRendering = () => {
      // Update state to trigger re-renders
      setForceRender(prev => (prev + 0.01) % 1000);
      
      // Force reflow on the progress bar element
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `translateZ(0) scale(1.${Math.floor(Math.random() * 9) + 1})`;
        void progressBarRef.current.offsetHeight; // Force reflow
        progressBarRef.current.style.transform = `translateZ(0) scale(1)`;
      }
      
      animationFrameRef.current = requestAnimationFrame(forceRendering);
    };
    
    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(forceRendering);
    
    // Add touch event listeners to document to keep the browser "awake"
    const keepActive = () => {};
    document.addEventListener('touchstart', keepActive, { passive: true });
    document.addEventListener('touchmove', keepActive, { passive: true });
    
    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      document.removeEventListener('touchstart', keepActive);
      document.removeEventListener('touchmove', keepActive);
    };
  }, []);

  // Prevent scrolling while loading screen is visible
  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  // Chrome Mobile-specific additional fixes
  useEffect(() => {
    if (!isChromeMobile()) return;

    // Create a hidden iframe to force Chrome to render
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Instead of simple timeout, keep creating iframes periodically
    const iframeInterval = setInterval(() => {
      const tempIframe = document.createElement('iframe');
      tempIframe.style.display = 'none';
      document.body.appendChild(tempIframe);
      
      setTimeout(() => {
        if (document.body.contains(tempIframe)) {
          document.body.removeChild(tempIframe);
        }
      }, 500);
    }, 1000);

    // Force focus and add a tabindex
    if (progressBarRef.current) {
      progressBarRef.current.focus();
      progressBarRef.current.setAttribute('tabindex', '0');
      
      // Add a subtle animation to keep the element active
      progressBarRef.current.classList.add('always-visible');
    }
    
    // Touch listeners specific to the progress bar
    const handleTouch = (e) => {
      e.preventDefault(); // Prevent default only for this element
      
      // Force visibility by manipulating style
      if (progressBarRef.current) {
        progressBarRef.current.style.opacity = "1";
        progressBarRef.current.style.visibility = "visible";
      }
    };
    
    if (progressBarRef.current) {
      progressBarRef.current.addEventListener('touchstart', handleTouch);
      progressBarRef.current.addEventListener('touchmove', handleTouch);
    }

    return () => {
      clearInterval(iframeInterval);
      if (progressBarRef.current) {
        progressBarRef.current.removeEventListener('touchstart', handleTouch);
        progressBarRef.current.removeEventListener('touchmove', handleTouch);
      }
      
      // Clean up any remaining iframes
      document.querySelectorAll('iframe').forEach(frame => {
        if (document.body.contains(frame)) {
          document.body.removeChild(frame);
        }
      });
    };
  }, []);

  // Track loading progress
  useEffect(() => {
    // Initial jump to show something immediately
    setLoadingProgress(5);

    // Simulate loading with more frequent updates
    const simulateLoading = () => {
      const increment = () => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 3 + 1; // More granular updates
          return newProgress >= 100 ? 100 : newProgress;
        });
      };
      
      // More frequent updates to keep element active
      const immediateTimer = setInterval(increment, 50); // More frequent
      
      // Slow down after initial progress
      setTimeout(() => {
        clearInterval(immediateTimer);
        const slowTimer = setInterval(() => {
          increment();
          if (loadingProgress >= 90) {
            clearInterval(slowTimer);
            setTimeout(() => {
              setLoadingProgress(100);
            }, 300);
          }
        }, 100); // Still more frequent than original
      }, 800);
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
      // Cancel animation frame on completion
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (onLoadingComplete) onLoadingComplete(false);
      
      setTimeout(() => {
        setProgressBarVisible(false);
        
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
        }, 800);
      }, 400);
    }
  }, [loadingProgress, onLoadingComplete]);

  if (!isVisible) return null;

  const formattedPercentage = loadingProgress >= 100 
    ? '100.00%' 
    : `${Math.min(loadingProgress, 99.99).toFixed(2)}%`;
    
  // Add random key to force re-render in Chrome
  const chromeKey = isChromeMobile() ? `progress-${forceRender}` : 'progress';

  return (
    <div 
      ref={loadingScreenRef} 
      className={`loading-screen ${portfolioReady ? 'portfolio-ready' : ''}`}
      style={{ backgroundColor: backgroundColor, color: textColor }}
    >
      <div className="content-container">
        {profileVisible && (
          <div ref={profileRef} className="profile__area loading-profile">
            <div 
              className="outer__circle keep-bright" 
              style={{ borderColor: progressColor }}
            >
              <span 
                className="tech-icon" 
                style={{ backgroundColor: iconBgColor, color: progressColor }}
              >
                <MdDesignServices />
              </span>
              <span 
                className="tech-icon" 
                style={{ backgroundColor: iconBgColor, color: progressColor }}
              >
                <HiServer />
              </span>
              <span 
                className="tech-icon" 
                style={{ backgroundColor: iconBgColor, color: progressColor }}
              >
                <MdCode />
              </span>
              <span 
                className="tech-icon" 
                style={{ backgroundColor: iconBgColor, color: progressColor }}
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
            key={chromeKey}
            ref={progressBarRef}
            className={`progress-container ${isChromeMobile() ? 'chrome-mobile always-visible' : ''}`}
            tabIndex="0"
            style={{ touchAction: "none", pointerEvents: "auto" }}
          >
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${Math.min(loadingProgress, 100)}%`,
                  backgroundColor: progressColor
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