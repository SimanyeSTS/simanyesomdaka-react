import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [showCenteringPrompt, setShowCenteringPrompt] = useState(false);
  const [centeringPromptFading, setCenteringPromptFading] = useState(false);

  const profileRef = useRef(null);
  const loadingScreenRef = useRef(null);
  const progressBarRef = useRef(null);
  const promptRef = useRef(null);
  const centeringPromptRef = useRef(null);
  const promptTimeoutRef = useRef(null);
  const centeringPromptTimeoutRef = useRef(null);
  const failsafeTimerRef = useRef(null);
  
  const isMounted = useRef(true);

  const isLightTheme = themeState.background === 'bg-1';
  const backgroundColor = isLightTheme ? 'white' : '#100F0F';
  const textColor = isLightTheme ? '#100F0F' : 'white';
  const iconBgColor = isLightTheme ? 'white' : '#100F0F';
  const progressColor = `hsl(${themeState.primaryHue}, 89%, 41%)`;

  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isVisible]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      
      if (promptTimeoutRef.current) clearTimeout(promptTimeoutRef.current);
      if (centeringPromptTimeoutRef.current) clearTimeout(centeringPromptTimeoutRef.current);
      if (failsafeTimerRef.current) clearTimeout(failsafeTimerRef.current);
    };
  }, []);

  const handlePromptClick = useCallback(() => {
    if (promptFading || !isMounted.current) return;
    setPromptFading(true);

    if (promptRef.current) {
      promptRef.current.classList.add('fade-out');
    }

    setTimeout(() => {
      if (!isMounted.current) return;
      
      setShowPrompt(false);
      setProgressBarVisible(true);
      setPromptFading(false);

      if (progressBarRef.current) {
        progressBarRef.current.style.display = 'none';
        void progressBarRef.current.offsetWidth;
        progressBarRef.current.style.display = 'flex';
        progressBarRef.current.classList.add('fade-in');
      }
    }, 300);
  }, [promptFading]);

  const handleCenteringPromptClick = useCallback(() => {
    if (centeringPromptFading || !isMounted.current) return;
    setCenteringPromptFading(true);

    if (centeringPromptRef.current) {
      centeringPromptRef.current.classList.add('fade-out');
    }

    setTimeout(() => {
      if (!isMounted.current) return;
      
      setShowCenteringPrompt(false);
      setCenteringPromptFading(false);

      const fixedLayoutContainer = document.querySelector('.fixed-layout-container');
      if (fixedLayoutContainer) {
        fixedLayoutContainer.classList.add('force-center');
      }
    }, 300);
  }, [centeringPromptFading]);

  const forceCompleteLoading = useCallback(() => {
    if (!isMounted.current) return;
    
    if (progressBarVisible) {
      if (progressBarRef.current) {
        progressBarRef.current.classList.add('fade-out');
      }
      setProgressBarVisible(false);
      setShowPrompt(false);
    }
    
    if (profileVisible) {
      if (profileRef.current) {
        profileRef.current.classList.add('fade-out');
      }
      
      setTimeout(() => {
        if (!isMounted.current) return;
        
        setProfileVisible(false);
        setPortfolioReady(true);
        
        const loadingScreen = loadingScreenRef.current;
        if (loadingScreen) {
          loadingScreen.classList.add('dim-screen');
          setTimeout(() => {
            if (!isMounted.current || !loadingScreen) return;
            
            loadingScreen.classList.add('brighten-screen');
            setTimeout(() => {
              if (!isMounted.current) return;
              
              setIsVisible(false);
              if (onLoadingComplete) onLoadingComplete(true);
            }, 700);
          }, 500);
        }
      }, 600);
    } else if (portfolioReady) {
      const loadingScreen = loadingScreenRef.current;
      if (loadingScreen) {
        if (!loadingScreen.classList.contains('dim-screen')) {
          loadingScreen.classList.add('dim-screen');
        }
        setTimeout(() => {
          if (!isMounted.current || !loadingScreen) return;
          
          if (!loadingScreen.classList.contains('brighten-screen')) {
            loadingScreen.classList.add('brighten-screen');
          }
          setTimeout(() => {
            if (!isMounted.current) return;
            
            setIsVisible(false);
            if (onLoadingComplete) onLoadingComplete(true);
          }, 700);
        }, 500);
      }
    }
  }, [profileVisible, portfolioReady, progressBarVisible, onLoadingComplete]);

  useEffect(() => {
    const isChromeMobile = () => /Android.*Chrome\/[.0-9]*/.test(navigator.userAgent);
    if (!isChromeMobile()) return;

    promptTimeoutRef.current = setTimeout(() => {
      if (!isMounted.current) return;
      
      try {
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
      } catch (error) {
      }
    }, 500);

    centeringPromptTimeoutRef.current = setTimeout(() => {
      if (!isMounted.current) return;
      
      try {
        const fixedLayoutContainer = document.querySelector('.fixed-layout-container');
        if (fixedLayoutContainer) {
          const rect = fixedLayoutContainer.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const elementCenterY = rect.top + rect.height / 2;
          const windowCenterY = windowHeight / 2;
          
          if (Math.abs(elementCenterY - windowCenterY) > 30) {
            setShowCenteringPrompt(true);
          }
        }
      } catch (error) {
      }
    }, 700);

    const handleDocumentClick = () => {
      if (showPrompt && !promptFading) {
        handlePromptClick();
      }
      if (showCenteringPrompt && !centeringPromptFading) {
        handleCenteringPromptClick();
      }
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
      }
      if (centeringPromptTimeoutRef.current) {
        clearTimeout(centeringPromptTimeoutRef.current);
      }
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [showPrompt, promptFading, handlePromptClick, showCenteringPrompt, centeringPromptFading, handleCenteringPromptClick]);

  useEffect(() => {
    setLoadingProgress(5);

    const simulateLoading = () => {
      const increment = () => {
        setLoadingProgress(prev => {
          const newProgress = prev + Math.random() * 5 + 2;
          return newProgress >= 90 ? 90 : newProgress;
        });
      };

      const immediateTimer = setInterval(increment, 100);

      setTimeout(() => {
        if (!isMounted.current) {
          clearInterval(immediateTimer);
          return;
        }
        
        clearInterval(immediateTimer);

        import('./preloadAssets').then(({ preloadAssets }) => {
          preloadAssets().then(() => {
            const slowTimer = setInterval(() => {
              if (!isMounted.current) {
                clearInterval(slowTimer);
                return;
              }
              
              setLoadingProgress(prev => {
                const next = prev + 1;
                if (next >= 100) {
                  clearInterval(slowTimer);
                }
                return next;
              });
            }, 100);
          }).catch(() => {
            if (isMounted.current) setLoadingProgress(100);
          });
        }).catch(() => {
          if (isMounted.current) setLoadingProgress(100);
        });
      }, 1000);
    };

    simulateLoading();
    const fallbackTimer = setTimeout(() => {
      if (isMounted.current) setLoadingProgress(100);
    }, 8000);
    
    return () => clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (loadingProgress === 100) {
      if (onLoadingComplete) onLoadingComplete(false);

      if (failsafeTimerRef.current) {
        clearTimeout(failsafeTimerRef.current);
      }

      failsafeTimerRef.current = setTimeout(() => {
        if (isMounted.current) forceCompleteLoading();
      }, 5000);

      if (progressBarRef.current) {
        progressBarRef.current.classList.add('fade-out');
      }

      setTimeout(() => {
        if (!isMounted.current) return;
        
        setProgressBarVisible(false);
        setShowPrompt(false);
        setShowCenteringPrompt(false);

        if (profileRef.current) {
          profileRef.current.classList.add('fade-out');
        }

        setTimeout(() => {
          if (!isMounted.current) return;
          
          setProfileVisible(false);
          setPortfolioReady(true);

          const loadingScreen = loadingScreenRef.current;
          if (loadingScreen) {
            loadingScreen.classList.add('dim-screen');
            setTimeout(() => {
              if (!isMounted.current || !loadingScreen) return;
              
              loadingScreen.classList.add('brighten-screen');
              setTimeout(() => {
                if (!isMounted.current) return;
                
                if (failsafeTimerRef.current) {
                  clearTimeout(failsafeTimerRef.current);
                  failsafeTimerRef.current = null;
                }
                setIsVisible(false);
                if (onLoadingComplete) onLoadingComplete(true);
              }, 700);
            }, 500);
          }
        }, 600);
      }, 600);
    }
  }, [loadingProgress, onLoadingComplete, forceCompleteLoading]);

  useEffect(() => {
    return () => {
      if (failsafeTimerRef.current) {
        clearTimeout(failsafeTimerRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  const formattedPercentage = `${Math.floor(Math.min(loadingProgress, 100))}%`;

  return (
    <div 
      ref={loadingScreenRef} 
      className={`loading-screen ${portfolioReady ? 'portfolio-ready' : ''}`}
      style={{ backgroundColor, color: textColor }}
    >
      <CustomAnimatedCursor loading={true} />
      {showCenteringPrompt ? (
        <div 
          ref={centeringPromptRef} 
          className="centering-prompt"
          onClick={handleCenteringPromptClick}
          style={{ backgroundColor, color: textColor }}
        >
          <div className="tap-instruction-center" style={{ color: progressColor }}>
            Tap to center
          </div>
        </div>
      ) : (
        <div className={`fixed-layout-container ${showCenteringPrompt ? '' : ''}`}>
          <div className="profile-container">
            {profileVisible && (
              <div ref={profileRef} className="profile__area loading-profile">
                <div className="outer__circle keep-bright" style={{ borderColor: progressColor }}>
                  <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: progressColor }}><MdDesignServices /></span>
                  <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: progressColor }}><HiServer /></span>
                  <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: progressColor }}><MdCode /></span>
                  <span className="tech-icon" style={{ backgroundColor: iconBgColor, color: progressColor }}><MdVideoLibrary /></span>
                </div>
                <div className="inner__circle">
                  <img src={profile} alt="Header Portrait" />
                </div>
              </div>
            )}
          </div>

          <div className="progress-area-container">
            <div className="progress-area">
              {progressBarVisible && !showPrompt && (
                <div ref={progressBarRef} className="progress-container">
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${Math.min(loadingProgress, 100)}%`, backgroundColor: progressColor }} />
                  </div>
                  <div className="progress-text">
                    Loading <span className="codey-number">{formattedPercentage}</span>
                  </div>
                </div>
              )}

              {showPrompt && (
                <div ref={promptRef} className="progress-prompt" onClick={handlePromptClick}>
                  <div className="tap-instruction" style={{ color: progressColor }}>Tap to show progress bar</div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${Math.min(loadingProgress, 100)}%`, backgroundColor: progressColor }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;