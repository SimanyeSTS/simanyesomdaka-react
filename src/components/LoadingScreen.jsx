// LoadingScreen.jsx
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
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptFading, setPromptFading] = useState(false);
  const [elementsReady, setElementsReady] = useState(false);
  const [progressBarVisible, setProgressBarVisible] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [portfolioReady, setPortfolioReady] = useState(false);

  const profileRef = useRef(null);
  const loadingScreenRef = useRef(null);
  const progressBarRef = useRef(null);
  const promptRef = useRef(null);
  const centerContainerRef = useRef(null);
  const renderTimeoutRef = useRef(null);

  const isLightTheme = themeState.background === 'bg-1';
  const backgroundColor = isLightTheme ? 'white' : '#100F0F';
  const textColor = isLightTheme ? '#100F0F' : 'white';
  const iconBgColor = isLightTheme ? 'white' : '#100F0F';
  const progressColor = `hsl(${themeState.primaryHue}, 89%, 41%)`;

  // Enhanced browser detection
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

  // Force initial render for Chrome mobile
  useEffect(() => {
    if (isChromeMobile()) {
      // Show everything immediately for a moment
      setElementsReady(true);
      
      // Add a small delay for Chrome to pick up the changes
      renderTimeoutRef.current = setTimeout(() => {
        // Check if elements are properly rendered
        const checkRendering = () => {
          const centerContainer = centerContainerRef.current;
          const profileElement = profileRef.current;
          const progressElement = progressBarRef.current;
          
          // If something doesn't look right, show the prompt
          if (!centerContainer || 
              !profileElement || 
              !progressElement ||
              centerContainer.offsetHeight === 0 || 
              profileElement.offsetHeight === 0 ||
              progressElement.offsetHeight === 0) {
            setShowPrompt(true);
            setElementsReady(false);
          }
        };
        
        checkRendering();
      }, 300);
    } else {
      // For other browsers, just show everything
      setElementsReady(true);
    }
    
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, []);

  // Add document-wide click handler for Chrome
  useEffect(() => {
    const handleDocumentClick = () => {
      if (showPrompt && !promptFading && !elementsReady) {
        handlePromptClick();
      }
    };

    if (isChromeMobile()) {
      document.addEventListener('click', handleDocumentClick);
    }

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [showPrompt, promptFading, elementsReady]);

  // Handle prompt click
  const handlePromptClick = () => {
    if (promptFading) return; // Prevent multiple clicks during animation
    
    setPromptFading(true);

    // Start fade out animation
    if (promptRef.current) {
      promptRef.current.classList.add('fade-out');
    }

    // After fade out completes, show all elements
    setTimeout(() => {
      setShowPrompt(false);
      setElementsReady(true);
      setPromptFading(false);
      
      // Force browser reflow/repaint for Chrome
      if (centerContainerRef.current) {
        centerContainerRef.current.style.display = 'none';
        const reflowTrigger = centerContainerRef.current.offsetHeight;
        centerContainerRef.current.style.display = 'flex';
        centerContainerRef.current.classList.add('fade-in');
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
        setShowPrompt(false);

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
      {/* Tap prompt for Chrome mobile */}
      {showPrompt && (
        <div 
          ref={promptRef}
          className="chrome-tap-prompt"
          onClick={handlePromptClick}
        >
          <div className="tap-instruction" style={{ color: progressColor }}>
            Tap to continue
          </div>
        </div>
      )}
      
      {/* Content is only shown when elements are ready */}
      {elementsReady && (
        <div 
          ref={centerContainerRef} 
          className="center-container"
        >
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
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;