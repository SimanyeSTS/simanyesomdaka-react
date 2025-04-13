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
  const [profileVisible, setProfileVisible] = useState(true);
  
  const progressBarRef = useRef(null);
  const profileRef = useRef(null);

  // Chrome mobile detection
  const isChromeMobile = /Android.*Chrome\//.test(navigator.userAgent);

  // Nuclear option for Chrome mobile rendering
  useEffect(() => {
    if (!isChromeMobile || !progressBarRef.current) return;

    // 1. Create and focus a hidden button
    const focusButton = document.createElement('button');
    focusButton.style.position = 'absolute';
    focusButton.style.opacity = '0';
    focusButton.style.height = '0';
    focusButton.style.width = '0';
    focusButton.tabIndex = -1;
    progressBarRef.current.appendChild(focusButton);

    // 2. Continuous focus/blur cycle
    const focusInterval = setInterval(() => {
      focusButton.focus();
      setTimeout(() => focusButton.blur(), 50);
    }, 300);

    // 3. Force style recalculations
    const styleInterval = setInterval(() => {
      progressBarRef.current.style.transform = 'translateZ(0)';
      void progressBarRef.current.offsetHeight;
    }, 200);

    return () => {
      clearInterval(focusInterval);
      clearInterval(styleInterval);
      if (progressBarRef.current) {
        progressBarRef.current.removeChild(focusButton);
      }
    };
  }, []);

  // Loading progress simulation
  useEffect(() => {
    let interval;
    const simulateLoading = () => {
      setLoadingProgress(prev => {
        const newValue = prev + Math.random() * 5 + 2;
        if (newValue >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newValue;
      });
    };
    interval = setInterval(simulateLoading, 150);
    return () => clearInterval(interval);
  }, []);

  // Completion handler
  useEffect(() => {
    if (loadingProgress === 100) {
      setTimeout(() => {
        setProfileVisible(false);
        setTimeout(() => {
          setIsVisible(false);
          onLoadingComplete();
        }, 500);
      }, 800);
    }
  }, [loadingProgress, onLoadingComplete]);

  if (!isVisible) return null;

  const iconBgColor = themeState.background === 'bg-1' ? 'white' : '#100F0F';
  const progressColor = `hsl(${themeState.primaryHue}, 89%, 41%)`;

  return (
    <div className="loading-screen" style={{
      backgroundColor: themeState.background === 'bg-1' ? 'white' : '#100F0F',
      color: themeState.background === 'bg-1' ? '#100F0F' : 'white'
    }}>
      <div className="content-container">
        {profileVisible && (
          <div ref={profileRef} className="profile__area loading-profile">
            <div className="outer__circle" style={{ borderColor: progressColor }}>
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
              <img src={profile} alt="Profile" />
            </div>
          </div>
        )}
        
        <div 
          ref={progressBarRef}
          className={`progress-container ${isChromeMobile ? 'chrome-mobile' : ''}`}
          style={{ touchAction: 'manipulation' }}
        >
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${loadingProgress}%`,
                backgroundColor: progressColor
              }} 
            />
          </div>
          <div className="progress-text">
            Loading {loadingProgress >= 100 ? '100.00%' : `${Math.floor(loadingProgress)}%`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;