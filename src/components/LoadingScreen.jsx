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
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Nuclear option for Chrome visibility
  useEffect(() => {
    const forceChromeRender = () => {
      const elements = document.querySelectorAll('.progress-container, .progress-bar, .progress-bar-fill');
      elements.forEach(el => {
        el.style.transform = 'translateZ(0)';
        el.style.willChange = 'transform';
        el.style.backfaceVisibility = 'hidden';
      });
    };
    
    // Run immediately and again after a short delay
    forceChromeRender();
    const forceRenderTimeout = setTimeout(forceChromeRender, 300);
    
    return () => clearTimeout(forceRenderTimeout);
  }, []);

  // Cleanup all intervals and timeouts
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const simulateLoading = () => {
      let progress = 0;
      intervalRef.current = setInterval(() => {
        progress += Math.random() * 5 + 2;
        if (progress >= 100) {
          progress = 100;
          clearInterval(intervalRef.current);
          timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
            onLoadingComplete();
            // Ensure scrolling is re-enabled
            document.documentElement.style.overflow = 'auto';
            document.body.style.overflow = 'auto';
          }, 300);
        }
        setLoadingProgress(progress);
      }, 100);
    };

    // Temporarily disable scrolling during loading
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    simulateLoading();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      // Cleanup scroll lock if component unmounts early
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, [onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div className="loading-screen" style={{
      backgroundColor: themeState.background === 'bg-1' ? 'white' : '#100F0F',
      color: themeState.background === 'bg-1' ? '#100F0F' : 'white'
    }}>
      <div className="content-container">
        <div className="profile__area">
          <div className="outer__circle" style={{ borderColor: `hsl(${themeState.primaryHue}, 89%, 41%)` }}>
            <span className="tech-icon" style={{ 
              backgroundColor: themeState.background === 'bg-1' ? 'white' : '#100F0F',
              color: `hsl(${themeState.primaryHue}, 89%, 41%)`
            }}>
              <MdDesignServices />
            </span>
            <span className="tech-icon" style={{ 
              backgroundColor: themeState.background === 'bg-1' ? 'white' : '#100F0F',
              color: `hsl(${themeState.primaryHue}, 89%, 41%)`
            }}>
              <HiServer />
            </span>
            <span className="tech-icon" style={{ 
              backgroundColor: themeState.background === 'bg-1' ? 'white' : '#100F0F',
              color: `hsl(${themeState.primaryHue}, 89%, 41%)`
            }}>
              <MdCode />
            </span>
            <span className="tech-icon" style={{ 
              backgroundColor: themeState.background === 'bg-1' ? 'white' : '#100F0F',
              color: `hsl(${themeState.primaryHue}, 89%, 41%)`
            }}>
              <MdVideoLibrary />
            </span>
          </div>
          <div className="inner__circle">
            <img src={profile} alt="Header Portrait" />
          </div>
        </div>

        <div className="progress-container chrome-fix">
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