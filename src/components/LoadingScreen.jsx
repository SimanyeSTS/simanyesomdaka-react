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
  
  // Use requestAnimationFrame for smooth progress
  useEffect(() => {
    let start = null;
    const duration = 3000; // 3 seconds total
    
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration * 100, 100);
      setLoadingProgress(progress);
      
      if (progress < 100) {
        requestAnimationFrame(animate);
      } else {
        // Give a small delay before hiding
        setTimeout(() => {
          setIsVisible(false);
          onLoadingComplete();
        }, 300);
      }
    };
    
    requestAnimationFrame(animate);
    
    return () => {
      // Cleanup
    };
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="loading-screen">
      <div className="content-container">
        <div className="profile__area">
          <div className="outer__circle" style={{ borderColor: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
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
        
        {/* Progress bar with forced visibility */}
        <div className="progress-container">
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
            Loading {loadingProgress.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;