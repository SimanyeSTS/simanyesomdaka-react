import React, { useState, useEffect } from 'react';
import { MdDesignServices, MdCode, MdVideoLibrary } from "react-icons/md";
import { HiServer } from "react-icons/hi";
import { useThemeContext } from "../context/theme-context";
import profile from '../assets/profile.png';
import './loading.css';

const LoadingScreen = ({ onLoadingComplete }) => {
  const { themeState } = useThemeContext();
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    // Track ALL resources
    const trackProgress = () => {
      const resources = window.performance.getEntriesByType('resource');
      const total = resources.length;
      const loaded = resources.filter(r => 
        r.duration > 0 || 
        r.initiatorType === 'img' && r.name.includes('.png')
      ).length;
      
      const progress = Math.min(Math.round((loaded / total) * 100), 100);
      setLoadingProgress(progress);
      
      // Fallback check for React hydration
      if (progress >= 90 && document.querySelector('#root')?.children.length > 0) {
        setLoadingProgress(100);
      }
      
      if (progress === 100) {
        setTimeout(onLoadingComplete, 300);
      }
    };

    // Initial check
    trackProgress();
    
    // Poll every 100ms
    const interval = setInterval(trackProgress, 100);
    
    // Final check when window loads
    window.addEventListener('load', () => {
      setTimeout(() => setLoadingProgress(100), 200);
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', trackProgress);
    };
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen" 
         style={{ 
           backgroundColor: themeState.background === 'bg-1' ? 'white' : '#100F0F',
           color: themeState.background === 'bg-1' ? '#100F0F' : 'white'
         }}>
      <div className="content-container">
        {/* Your loading animation */}
        <div className="profile__area loading-profile">
          <div className="outer__circle keep-bright" 
               style={{ borderColor: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
            {/* Icons */}
          </div>
          <div className="inner__circle">
            <img src={profile} alt="Header Portrait" loading="eager" />
          </div>
        </div>

        {/* ALWAYS VISIBLE PROGRESS BAR */}
        <div className="progress-container" style={{ opacity: 1 }}>
          <div className="progress-bar">
            <div className="progress-bar-fill" 
                 style={{ 
                   width: `${loadingProgress}%`,
                   backgroundColor: `hsl(${themeState.primaryHue}, 89%, 41%)`
                 }} />
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