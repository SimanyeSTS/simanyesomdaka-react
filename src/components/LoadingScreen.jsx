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
  const [showProgressPrompt, setShowProgressPrompt] = useState(false);
  const [showCenterPrompt, setShowCenterPrompt] = useState(false);
  const [promptFading, setPromptFading] = useState(false);
  const [progressBarVisible, setProgressBarVisible] = useState(false);
  const [elementsCentered, setElementsCentered] = useState(false);
  const [profileVisible, setProfileVisible] = useState(true);
  const [portfolioReady, setPortfolioReady] = useState(false);

  const profileRef = useRef(null);
  const loadingScreenRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressPromptRef = useRef(null);
  const centerPromptRef = useRef(null);
  const promptTimeoutRef = useRef(null);

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

  // Check for centering and progress bar visibility issues
  useEffect(() => {
    if (!isChromeMobile()) {
      setProgressBarVisible(true);
      setElementsCentered(true);
      return;
    }

    // Check if elements are centered
    const checkCentering = () => {
      if (profileRef.current) {
        const rect = profileRef.current.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        return Math.abs(viewportCenter - elementCenter) < 10;
      }
      return false;
    };

    // Check if progress bar is visible
    const checkProgressBarVisible = () => {
      if (progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        return rect.height > 0 && rect.width > 0;
      }
      return false;
    };

    promptTimeoutRef.current = setTimeout(() => {
      const isCentered = checkCentering();
      const isProgressVisible = checkProgressBarVisible();

      if (!isCentered) {
        setShowCenterPrompt(true);
      }

      if (!isProgressVisible) {
        setShowProgressPrompt(true);
      } else {
        setProgressBarVisible(true);
      }

      // If everything is fine after delay, proceed normally
      if (isCentered && isProgressVisible) {
        setElementsCentered(true);
        setProgressBarVisible(true);
      }
    }, 500);

    return () => {
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
      }
    };
  }, []);

  // Handle progress prompt click
  const handleProgressPromptClick = () => {
    setPromptFading(true);
    if (progressPromptRef.current) {
      progressPromptRef.current.classList.add('fade-out');
    }
    
    setTimeout(() => {
      setShowProgressPrompt(false);
      setProgressBarVisible(true);
      setPromptFading(false);
      
      // Force reflow
      if (progressBarRef.current) {
        progressBarRef.current.style.display = 'none';
        void progressBarRef.current.offsetHeight;
        progressBarRef.current.style.display = 'flex';
      }
    }, 300);
  };

  // Handle center prompt click
  const handleCenterPromptClick = () => {
    setPromptFading(true);
    if (centerPromptRef.current) {
      centerPromptRef.current.classList.add('fade-out');
    }
    
    setTimeout(() => {
      setShowCenterPrompt(false);
      setElementsCentered(true);
      setPromptFading(false);
      
      // Force reflow
      if (profileRef.current) {
        profileRef.current.style.display = 'none';
        void profileRef.current.offsetHeight;
        profileRef.current.style.display = 'block';
      }
      if (loadingScreenRef.current) {
        loadingScreenRef.current.style.display = 'none';
        void loadingScreenRef.current.offsetHeight;
        loadingScreenRef.current.style.display = 'flex';
      }
    }, 300);
  };

  // Track loading progress
  useEffect(() => {
    setLoadingProgress(5);

    const simulateLoading = () => {
      const increment = () => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 5 + 2;
          return newProgress >= 100 ? 100 : newProgress;
        });
      };

      const immediateTimer = setInterval(increment, 100);

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
        setShowProgressPrompt(false);

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
    : `${Math.min(loadingProgress, 100).toFixed(2)}%`;

  return (
    <div 
      ref={loadingScreenRef} 
      className={`loading-screen ${portfolioReady ? 'portfolio-ready' : ''}`}
      style={{ backgroundColor: backgroundColor, color: textColor }}
    >
      {showCenterPrompt && (
        <div 
          ref={centerPromptRef}
          className="center-prompt"
          onClick={handleCenterPromptClick}
        >
          Tap to center loading elements
        </div>
      )}

      <div className={`center-container ${elementsCentered ? 'centered' : ''}`}>
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

        <div className="progress-area">
          {progressBarVisible && (
            <div 
              ref={progressBarRef}
              className="progress-container"
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

          {showProgressPrompt && (
            <div 
              ref={progressPromptRef}
              className="progress-prompt"
              onClick={handleProgressPromptClick}
            >
              <div className="tap-instruction" style={{ color: progressColor }}>
                Tap to show progress
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${Math.min(loadingProgress, 100)}%`,
                    backgroundColor: progressColor
                  }} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;