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
  const profileRef = useRef(null);
  const outerCircleRef = useRef(null);
  const loadingScreenRef = useRef(null);
  const progressBarRef = useRef(null);
  
  const isLightTheme = themeState.background === 'bg-1';
  const backgroundColor = isLightTheme ? 'white' : '#100F0F';
  const textColor = isLightTheme ? '#100F0F' : 'white';
  const iconBgColor = isLightTheme ? 'white' : '#100F0F';

  // Ensure body overflow is controlled
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Progress animation - simplified and more reliable
  useEffect(() => {
    let animationFrame;
    let startTime = null;
    const duration = 2000; // 2 seconds for full progress

    const animateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration * 100, 100);
      
      setLoadingProgress(progress);

      if (progress < 100) {
        animationFrame = requestAnimationFrame(animateProgress);
      } else {
        // Start the fade-out sequence when progress completes
        setTimeout(() => {
          if (progressBarRef.current) {
            progressBarRef.current.classList.add('fade-out');
          }
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
        }, 300);
      }
    };

    // Start the animation immediately
    animationFrame = requestAnimationFrame(animateProgress);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div 
      ref={loadingScreenRef} 
      className="loading-screen" 
      style={{ backgroundColor, color: textColor }}
    >
      <div className="content-container">
        {/* Profile Area */}
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

        {/* Progress Bar - Always visible by default */}
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
            Loading {Math.round(loadingProgress)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;