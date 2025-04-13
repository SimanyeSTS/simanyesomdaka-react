import React, { useState, useEffect, useRef } from 'react';
import { MdDesignServices, MdCode, MdVideoLibrary } from "react-icons/md";
import { HiServer } from "react-icons/hi";
import { useThemeContext } from "../context/theme-context";
import profile from '../assets/profile.png';
import './loading.css';

const forceRepaint = (element) => {
  if (!element) return;
  void element.offsetHeight;
  element.classList.add('force-repaint');
  setTimeout(() => element.classList.remove('force-repaint'), 0);
};

const autoTriggerVisibilityFix = (ref) => {
  if (!ref.current) return;
  const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg|Edge/.test(navigator.userAgent);

  if (!isChrome) return;

  const trigger = () => {
    try {
      const el = ref.current;
      if (!el) return;

      const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
      const touchEvent = new TouchEvent("touchstart", { bubbles: true, cancelable: true });

      el.dispatchEvent(clickEvent);
      el.dispatchEvent(touchEvent);

      forceRepaint(el);

      el.style.transform = 'translateZ(0)';
      el.style.willChange = 'transform, opacity';
      el.style.opacity = '0.99';

      setTimeout(() => {
        if (el) el.style.opacity = '1';
      }, 10);
    } catch (err) {
      // Safely ignore TouchEvent errors on unsupported platforms
    }
  };

  trigger();

  const intervalId = setInterval(trigger, 200);
  setTimeout(() => clearInterval(intervalId), 2000);
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

  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  useEffect(() => {
    if (progressBarRef.current) {
      autoTriggerVisibilityFix(progressBarRef);
    }
  }, []);

  useEffect(() => {
    setLoadingProgress(5);

    const increment = () => {
      setLoadingProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 5 + 2;
      });
      if (progressBarRef.current) forceRepaint(progressBarRef.current);
    };

    const fastTimer = setInterval(increment, 100);

    setTimeout(() => {
      clearInterval(fastTimer);
      const slowTimer = setInterval(() => {
        increment();
        if (loadingProgress >= 90) {
          clearInterval(slowTimer);
          setTimeout(() => {
            setLoadingProgress(100);
            if (progressBarRef.current) forceRepaint(progressBarRef.current);
          }, 500);
        }
      }, 200);
    }, 1000);

    const fallbackTimer = setTimeout(() => {
      setLoadingProgress(100);
      if (progressBarRef.current) forceRepaint(progressBarRef.current);
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, []);

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
    : `${Math.min(loadingProgress, 100).toFixed(2)}%`;

  return (
    <div 
      ref={loadingScreenRef} 
      className={`loading-screen ${portfolioReady ? 'portfolio-ready' : ''}`}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="content-container">
        {profileVisible && (
          <div ref={profileRef} className="profile__area loading-profile">
            <div 
              ref={outerCircleRef} 
              className="outer__circle keep-bright" 
              style={{ borderColor: `hsl(${themeState.primaryHue}, 89%, 41%)` }}
            >
              <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
                <MdDesignServices />
              </span>
              <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
                <MdCode />
              </span>
              <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
                <HiServer />
              </span>
              <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
                <MdVideoLibrary />
              </span>
            </div>
            <img src={profile} alt="profile" className="profile-img" />
          </div>
        )}

        {progressBarVisible && (
          <div ref={progressBarRef} className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(loadingProgress, 100)}%`, backgroundColor: `hsl(${themeState.primaryHue}, 89%, 41%)` }}
            />
            <div className="progress-text">{formattedPercentage}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;