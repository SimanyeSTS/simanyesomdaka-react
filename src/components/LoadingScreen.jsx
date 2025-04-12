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
  const [assetsLoaded, setAssetsLoaded] = useState({
    images: false,
    scripts: false,
    styles: false,
    fonts: false,
  });
  
  const profileRef = useRef(null);
  const outerCircleRef = useRef(null);
  const loadingScreenRef = useRef(null);
  const progressBarRef = useRef(null);
  
  const isLightTheme = themeState.background === 'bg-1';
  const backgroundColor = isLightTheme ? 'white' : '#100F0F';
  const textColor = isLightTheme ? '#100F0F' : 'white';
  const iconBgColor = isLightTheme ? 'white' : '#100F0F';

  // Lock body scroll when loading screen is visible
  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  // Track actual loading progress
  useEffect(() => {
    const trackResourceLoading = () => {
      // Count all resources that need to be loaded
      const totalResources = {
        images: document.images.length,
        scripts: document.scripts.length,
        styles: document.styleSheets.length,
        fonts: document.fonts ? document.fonts.size : 0
      };
      
      let loadedResources = {
        images: 0,
        scripts: 0,
        styles: 0,
        fonts: 0
      };
      
      // Track image loading
      Array.from(document.images).forEach(img => {
        if (img.complete) loadedResources.images++;
        img.addEventListener('load', () => {
          loadedResources.images++;
          updateProgress();
        });
        img.addEventListener('error', () => {
          loadedResources.images++;
          updateProgress();
        });
      });
      
      // Track script loading
      Array.from(document.scripts).forEach(script => {
        if (script.complete || script.readyState === 'complete') loadedResources.scripts++;
        script.addEventListener('load', () => {
          loadedResources.scripts++;
          updateProgress();
        });
        script.addEventListener('error', () => {
          loadedResources.scripts++;
          updateProgress();
        });
      });
      
      // Mark styles as loaded (they're usually already loaded by this point)
      setAssetsLoaded(prev => ({...prev, styles: true}));
      
      // Track font loading if supported
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          setAssetsLoaded(prev => ({...prev, fonts: true}));
          updateProgress();
        });
      } else {
        setAssetsLoaded(prev => ({...prev, fonts: true}));
      }
      
      // Calculate and update overall progress
      const updateProgress = () => {
        let totalWeight = 0;
        let loadedWeight = 0;
        
        // Images have higher weight in loading calculation
        totalWeight += totalResources.images * 2;
        loadedWeight += loadedResources.images * 2;
        
        // Scripts have medium weight
        totalWeight += totalResources.scripts * 1.5;
        loadedWeight += loadedResources.scripts * 1.5;
        
        // Styles and fonts have lower weight
        totalWeight += totalResources.styles + (totalResources.fonts || 0);
        loadedWeight += (assetsLoaded.styles ? totalResources.styles : 0) + 
                         (assetsLoaded.fonts ? (totalResources.fonts || 0) : 0);
        
        // Calculate percentage with a minimum of 5% increment
        const percentage = Math.min(100, Math.max(5, Math.floor((loadedWeight / (totalWeight || 1)) * 100)));
        
        setLoadingProgress(percentage);
        
        // Ensure we don't get stuck at 99%
        if (percentage >= 99) {
          setTimeout(() => {
            setLoadingProgress(100);
          }, 500);
        }
      };
      
      // Initial progress update
      updateProgress();
      
      // Fallback to ensure progress continues even if some resources fail to trigger events
      const fallbackTimer = setInterval(() => {
        loadedResources.images = Math.min(totalResources.images, loadedResources.images + 1);
        loadedResources.scripts = Math.min(totalResources.scripts, loadedResources.scripts + 1);
        updateProgress();
        
        // Clear fallback timer when everything is loaded
        if (loadedResources.images >= totalResources.images && 
            loadedResources.scripts >= totalResources.scripts &&
            assetsLoaded.styles && 
            assetsLoaded.fonts) {
          clearInterval(fallbackTimer);
        }
      }, 1000);
      
      // Ensure loading completes in a reasonable time
      setTimeout(() => {
        clearInterval(fallbackTimer);
        setLoadingProgress(100);
      }, 8000); // Timeout after 8 seconds
    };
    
    // Start tracking immediately
    trackResourceLoading();
    
    // Also handle window load event for additional safety
    window.addEventListener('load', () => {
      setTimeout(() => {
        setLoadingProgress(100);
      }, 500);
    });
    
    return () => {
      window.removeEventListener('load', () => {});
    };
  }, []);

  // Handle completion sequence
  useEffect(() => {
    if (loadingProgress === 100) {
      setTimeout(() => {
        if (progressBarRef.current) {
          progressBarRef.current.classList.add('fade-out');
        }
        
        setTimeout(() => {
          if (profileRef.current) {
            profileRef.current.classList.add('fade-out');
          }
          
          setTimeout(() => {
            if (loadingScreenRef.current) {
              loadingScreenRef.current.classList.add('dim-screen');
              
              setTimeout(() => {
                loadingScreenRef.current.classList.add('brighten-screen');
                
                setTimeout(() => {
                  setIsVisible(false);
                  onLoadingComplete();
                }, 700);
              }, 1000);
            }
          }, 600);
        }, 1000);
      }, 300);
    }
  }, [loadingProgress, onLoadingComplete]);

  return (
    <div 
      ref={loadingScreenRef} 
      className="loading-screen"
      style={{ backgroundColor: backgroundColor, color: textColor }}
    >
      <div className="content-container">
        <div ref={profileRef} className="profile__area loading-profile">
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
        
        <div ref={progressBarRef} className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${loadingProgress}%`, 
                backgroundColor: `hsl(${themeState.primaryHue}, 89%, 41%)` 
              }} 
            />
          </div>
          <div className="progress-text">
            Loading {loadingProgress}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;