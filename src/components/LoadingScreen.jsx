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
  
  const profileRef = useRef(null);
  const loadingScreenRef = useRef(null);
  const progressBarRef = useRef(null);

  const isLightTheme = themeState.background === 'bg-1';
  const backgroundColor = isLightTheme ? 'white' : '#100F0F';
  const textColor = isLightTheme ? '#100F0F' : 'white';
  const iconBgColor = isLightTheme ? 'white' : '#100F0F';
  const progressColor = `hsl(${themeState.primaryHue}, 89%, 41%)`;

  // Enhanced Chrome Mobile detection
  const isChromeMobile = () => {
    return /Android.*Chrome\/[.0-9]*/.test(navigator.userAgent);
  };

  // Prevent scrolling while loading screen is visible
  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  // Chrome Mobile-specific rendering solution
  useEffect(() => {
    if (!isChromeMobile()) return;

    // Force layout and paint before showing content
    const forceRender = () => {
      if (progressBarRef.current) {
        // Trigger reflow
        progressBarRef.current.style.display = 'none';
        // Assign to variable to avoid ESLint warning
        const height = progressBarRef.current.offsetHeight;
        progressBarRef.current.style.display = 'flex';
        
        // Add Chrome-specific class
        progressBarRef.current.classList.add('chrome-mobile');
        
        // Force focus and make it focusable
        progressBarRef.current.setAttribute('tabindex', '-1');
        progressBarRef.current.focus({ preventScroll: true });
        
        // Add slight delay to ensure rendering
        setTimeout(() => {
          if (progressBarRef.current) {
            progressBarRef.current.style.willChange = 'transform, opacity';
            progressBarRef.current.style.backfaceVisibility = 'hidden';
          }
        }, 50);
      }
    };

    // Execute after a small delay to ensure DOM is ready
    setTimeout(forceRender, 100);
    
    // Additional fallback for stubborn cases
    const renderFallback = setTimeout(() => {
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = 'translate3d(-50%, 0, 0) scale(1.0001)';
        setTimeout(() => {
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = 'translate3d(-50%, 0, 0) scale(1)';
          }
        }, 50);
      }
    }, 200);

    return () => clearTimeout(renderFallback);
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
    : `${Math.min(loadingProgress, 100)}%`;

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
            ref={progressBarRef}
            className={`progress-container ${isChromeMobile() ? 'chrome-mobile' : ''}`}
            tabIndex="-1"
            style={{
              transform: 'translate3d(-50%, 0, 0)',
              backfaceVisibility: 'hidden',
              perspective: '1000px'
            }}
          >
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${Math.min(loadingProgress, 100)}%`,
                  backgroundColor: progressColor,
                  transform: 'translateZ(0)'
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