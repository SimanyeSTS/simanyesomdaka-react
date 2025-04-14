import React, { useState, useEffect, useRef } from 'react';
import { MdDesignServices, MdCode, MdVideoLibrary } from "react-icons/md";
import { HiServer } from "react-icons/hi";
import { useThemeContext } from "../context/theme-context";
import profile from '../assets/profile.png';
import CustomAnimatedCursor from './CustomAnimatedCursor';
import './loading.css';

const LoadingScreen = ({ onLoadingComplete }) => {
  const { themeState } = useThemeContext();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptFading, setPromptFading] = useState(false);
  const [progressBarVisible, setProgressBarVisible] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [portfolioReady, setPortfolioReady] = useState(false);

  const profileRef = useRef(null);
  const loadingScreenRef = useRef(null);
  const progressBarRef = useRef(null);
  const promptRef = useRef(null);
  const promptTimeoutRef = useRef(null);

  const isLightTheme = themeState.background === 'bg-1';
  const backgroundColor = isLightTheme ? 'white' : '#100F0F';
  const textColor = isLightTheme ? '#100F0F' : 'white';
  const iconBgColor = isLightTheme ? 'white' : '#100F0F';
  const progressColor = `hsl(${themeState.primaryHue}, 89%, 41%)`;

  // Prevent scrolling while loading screen is visible
  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  // Chrome Mobile detection and prompt handling
  useEffect(() => {
    const isChromeMobile = () => /Android.*Chrome\/[.0-9]*/.test(navigator.userAgent);
    if (!isChromeMobile()) return;

    promptTimeoutRef.current = setTimeout(() => {
      const progressBarElement = progressBarRef.current;
      if (progressBarElement) {
        const computedStyle = window.getComputedStyle(progressBarElement);
        if (progressBarElement.offsetHeight === 0 || 
            computedStyle.visibility === 'hidden' || 
            computedStyle.display === 'none' || 
            computedStyle.opacity === '0') {
          setShowPrompt(true);
          setProgressBarVisible(false);
        }
      } else {
        setShowPrompt(true);
        setProgressBarVisible(false);
      }
    }, 500);

    const handleDocumentClick = () => {
      if (showPrompt && !promptFading) {
        handlePromptClick();
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
      }
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [showPrompt, promptFading]);

  const handlePromptClick = () => {
    if (promptFading) return;
    setPromptFading(true);

    if (promptRef.current) {
      promptRef.current.classList.add('fade-out');
    }

    setTimeout(() => {
      setShowPrompt(false);
      setProgressBarVisible(true);
      setPromptFading(false);

      if (progressBarRef.current) {
        progressBarRef.current.style.display = 'none';
        progressBarRef.current.offsetHeight; // Trigger reflow
        progressBarRef.current.style.display = 'flex';
        progressBarRef.current.classList.add('fade-in');
      }
    }, 300);
  };

  // Simulate loading progress
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
          }
        }, 200);
      }, 1000);
    };

    simulateLoading();
    const fallbackTimer = setTimeout(() => setLoadingProgress(100), 5000);
    return () => clearTimeout(fallbackTimer);
  }, []);

  // Handle loading completion
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
      style={{ backgroundColor, color: textColor }}
    >
      <CustomAnimatedCursor loading={true} />
      
      <div className="center-container">
        {profileVisible && (
          <div ref={profileRef} className="profile__area loading-profile">
            <div className="outer__circle keep-bright" style={{ borderColor: progressColor }}>
              <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: progressColor }}>
                <MdDesignServices />
              </span>
              <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: progressColor }}>
                <HiServer />
              </span>
              <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: progressColor }}>
                <MdCode />
              </span>
              <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: progressColor }}>
                <MdVideoLibrary />
              </span>
            </div>
            <div className="inner__circle">
              <img src={profile} alt="Header Portrait" />
            </div>
          </div>
        )}

        <div className="progress-area">
          {progressBarVisible && !showPrompt && (
            <div ref={progressBarRef} className="progress-container">
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

          {showPrompt && (
            <div ref={promptRef} className="progress-prompt" onClick={handlePromptClick}>
              <div className="tap-instruction" style={{ color: progressColor }}>
                Tap to show progress bar
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