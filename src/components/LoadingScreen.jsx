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

const simulateTap = (element) => {
  if (!element) return;
  const evt = new Event('click', { bubbles: true, cancelable: true });
  element.dispatchEvent(evt);
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
    setLoadingProgress(5);

    setTimeout(() => {
      if (progressBarRef.current) {
        forceRepaint(progressBarRef.current);
      }
    }, 10);

    const simulateLoading = () => {
      const increment = () => {
        setLoadingProgress(prev => {
          if (prev >= 100) return 100;
          return prev + Math.random() * 5 + 2;
        });

        if (progressBarRef.current) {
          forceRepaint(progressBarRef.current);
          simulateTap(progressBarRef.current); // simulate tap to trigger rendering
        }
      };

      const immediateTimer = setInterval(() => {
        increment();
      }, 100);

      setTimeout(() => {
        clearInterval(immediateTimer);
        const slowTimer = setInterval(() => {
          increment();
          if (loadingProgress >= 90) {
            clearInterval(slowTimer);
            setTimeout(() => {
              setLoadingProgress(100);
              forceRepaint(progressBarRef.current);
              simulateTap(progressBarRef.current);
            }, 500);
          }
        }, 200);
      }, 1000);
    };

    simulateLoading();

    const fallbackTimer = setTimeout(() => {
      setLoadingProgress(100);
      if (progressBarRef.current) {
        forceRepaint(progressBarRef.current);
        simulateTap(progressBarRef.current);
      }
    }, 5000);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
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

    preloadAllImages();
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

  const getProgressText = () => {
    if (loadingProgress >= 100) return '100.00%';
    return `${Math.min(loadingProgress, 100)}%`;
  };

  if (!isVisible) return null;

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
              ref={outerCircleRef} 
              className="outer__circle keep-bright" 
              style={{ borderColor: `hsl(${themeState.primaryHue}, 89%, 41%)` }}
            >
              <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
                <MdDesignServices />
              </span>
              <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
                <HiServer />
              </span>
              <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
                <MdCode />
              </span>
              <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
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
            onTouchStart={() => {}} 
            onClick={() => {}} 
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
              Loading {getProgressText()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;