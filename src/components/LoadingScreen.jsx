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
  const [progressBarVisible, setProgressBarVisible] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [portfolioReady, setPortfolioReady] = useState(false);
  
  const progressBarRef = useRef(null);
  const loadingScreenRef = useRef(null);

  // Lock body scroll during loading
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Simplified loading simulation
  useEffect(() => {
    let animationFrame;
    let startTime = null;
    const duration = 3000; // 3 seconds total
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration * 100, 100);
      
      setLoadingProgress(progress);
      
      if (progress < 100) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Final completion
        setTimeout(() => {
          setProgressBarVisible(false);
          setTimeout(() => {
            setProfileVisible(false);
            setPortfolioReady(true);
            setTimeout(() => {
              setIsVisible(false);
              if (onLoadingComplete) onLoadingComplete();
            }, 700);
          }, 300);
        }, 500);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div 
      ref={loadingScreenRef} 
      className="loading-screen"
      style={{ 
        backgroundColor: themeState.background === 'bg-1' ? 'white' : '#100F0F',
        color: themeState.background === 'bg-1' ? '#100F0F' : 'white'
      }}
    >
      <div className="content-container">
        {profileVisible && (
          <div className="profile__area loading-profile">
            <div className="outer__circle keep-bright" style={{ borderColor: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
              <span className="tech-icon" style={{ backgroundColor: themeState.background === 'bg-1' ? 'white' : '#100F0F', color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
                <MdDesignServices />
              </span>
              <span className="tech-icon" style={{ backgroundColor: themeState.background === 'bg-1' ? 'white' : '#100F0F', color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
                <HiServer />
              </span>
              <span className="tech-icon" style={{ backgroundColor: themeState.background === 'bg-1' ? 'white' : '#100F0F', color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
                <MdCode />
              </span>
              <span className="tech-icon" style={{ backgroundColor: themeState.background === 'bg-1' ? 'white' : '#100F0F', color: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
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
            style={{
              // Force Chrome to render
              transform: 'translateX(-50%) translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform'
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
              Loading {Math.min(loadingProgress, 100).toFixed(2)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;