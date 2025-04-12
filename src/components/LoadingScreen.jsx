import React, { useState, useEffect, useRef } from 'react';
import { MdDesignServices, MdCode, MdVideoLibrary } from "react-icons/md";
import { HiServer } from "react-icons/hi";
import { useThemeContext } from "../context/theme-context";
import profile from '../assets/profile.png';
import './loading.css';

// Nuclear force repaint function for all browsers
const forceRepaint = (element) => {
  if (!element) return;
  // Multiple techniques to force repaint
  element.style.display = 'none';
  void element.offsetHeight;
  element.style.display = '';
  void element.offsetHeight;
  element.classList.add('force-repaint');
  setTimeout(() => {
    element.classList.remove('force-repaint');
    element.style.transform = 'translateZ(0) scale(1.0001)';
    void element.offsetHeight;
    element.style.transform = '';
  }, 0);
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

  // Lock scrolling during loading
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Nuclear loading simulation with forced rendering
  useEffect(() => {
    // Initial immediate jump to show activity
    setLoadingProgress(5);
    forceRepaint(progressBarRef.current);
    
    // Initial rendering kick for all browsers
    setTimeout(() => {
      setLoadingProgress(prev => Math.min(prev + 0.1, 100));
      forceRepaint(progressBarRef.current);
    }, 50);

    const simulateLoading = () => {
      const increment = () => {
        setLoadingProgress(prev => {
          if (prev >= 100) return 100;
          return prev + Math.random() * 5 + 2;
        });
        forceRepaint(progressBarRef.current);
      };
      
      // Fast initial progress
      const immediateTimer = setInterval(increment, 100);
      
      // Slow down after 1 second
      setTimeout(() => {
        clearInterval(immediateTimer);
        const slowTimer = setInterval(() => {
          if (loadingProgress >= 90) {
            clearInterval(slowTimer);
            // Final smooth transition to exactly 100%
            const finalTimer = setInterval(() => {
              setLoadingProgress(prev => {
                const newProgress = prev + (100 - prev) * 0.3;
                if (newProgress >= 99.95) {
                  clearInterval(finalTimer);
                  return 100;
                }
                return newProgress;
              });
              forceRepaint(progressBarRef.current);
            }, 50);
          } else {
            increment();
          }
        }, 200);
      }, 1000);

      // Hard fallback
      const fallbackTimer = setTimeout(() => {
        setLoadingProgress(100);
        forceRepaint(progressBarRef.current);
      }, 5000);
      
      return () => {
        clearTimeout(fallbackTimer);
      };
    };
    
    simulateLoading();
  }, []);

  // Preload all content
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

  // Handle completion sequence
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

  return (
    <div 
      ref={loadingScreenRef} 
      className={`loading-screen ${portfolioReady ? 'portfolio-ready' : ''}`}
      style={{ 
        backgroundColor: backgroundColor, 
        color: textColor,
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}
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
            className="progress-container"
            onTouchStart={() => {}}
            onClick={() => {}}
            onMouseDown={() => {}}
            style={{
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              transform: 'translate3d(-50%, 0, 0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform, opacity'
            }}
          >
            <div className="progress-bar">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: `${Math.min(loadingProgress, 100)}%`,
                  backgroundColor: `hsl(${themeState.primaryHue}, 89%, 41%)`,
                  transform: 'translateZ(0)',
                  willChange: 'width'
                }} 
              />
            </div>
            <div className="progress-text">
              Loading {Math.min(loadingProgress, 100)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;