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
  const failsafeTimerRef = useRef(null);

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
        void progressBarRef.current.offsetWidth;
        progressBarRef.current.style.display = 'flex';
        progressBarRef.current.classList.add('fade-in');
      }
    }, 300);
  };

  // Function to force complete the loading screen but with smooth transitions
  const forceCompleteLoading = () => {
    console.log("Failsafe triggered: Initiating smooth completion sequence");
    
    // First ensure progress bar is faded out if it's still visible
    if (progressBarVisible) {
      if (progressBarRef.current) {
        progressBarRef.current.classList.add('fade-out');
      }
      setProgressBarVisible(false);
      setShowPrompt(false);
    }
    
    // Then handle profile fade out if it's still visible
    if (profileVisible) {
      if (profileRef.current) {
        profileRef.current.classList.add('fade-out');
      }
      
      setTimeout(() => {
        setProfileVisible(false);
        setPortfolioReady(true);
        
        // Start the screen transition effects
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
      }, 600);
    } else if (portfolioReady) {
      // If we're already at the screen transition part
      if (loadingScreenRef.current) {
        if (!loadingScreenRef.current.classList.contains('dim-screen')) {
          loadingScreenRef.current.classList.add('dim-screen');
        }
        setTimeout(() => {
          if (!loadingScreenRef.current.classList.contains('brighten-screen')) {
            loadingScreenRef.current.classList.add('brighten-screen');
          }
          setTimeout(() => {
            setIsVisible(false);
            if (onLoadingComplete) onLoadingComplete(true);
          }, 700);
        }, 500);
      }
    }
  };

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
        clearInterval(immediateTimer);

        import('./preloadAssets').then(({ preloadAssets }) => {
          preloadAssets().then(() => {
            const slowTimer = setInterval(() => {
              setLoadingProgress(prev => {
                const next = prev + 1;
                if (next >= 100) {
                  clearInterval(slowTimer);
                }
                return next;
              });
            }, 100);
          });
        });
      }, 1000);
    };

    simulateLoading();
    const fallbackTimer = setTimeout(() => setLoadingProgress(100), 8000);
    return () => clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (loadingProgress === 100) {
      // Call onLoadingComplete to signal that loading has reached 100%
      if (onLoadingComplete) onLoadingComplete(false);

      // Clear any existing failsafe timer
      if (failsafeTimerRef.current) {
        clearTimeout(failsafeTimerRef.current);
      }

      // Set up the 5-second failsafe timer that will ensure animations complete smoothly
      failsafeTimerRef.current = setTimeout(forceCompleteLoading, 5000);

      if (progressBarRef.current) {
        progressBarRef.current.classList.add('fade-out');
      }

      setTimeout(() => {
        setProgressBarVisible(false);
        setShowPrompt(false);

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
                // Clear the failsafe timer if the normal flow completes
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
  }, [loadingProgress, onLoadingComplete]);

  // Cleanup function to clear the failsafe timer when component unmounts
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
      <div className="fixed-layout-container">
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
    </div>
  );
};

export default LoadingScreen;