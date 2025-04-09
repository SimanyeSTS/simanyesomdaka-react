import { useEffect, useState, useRef } from 'react';
import { useThemeContext } from "../context/theme-context";

const CustomAnimatedCursor = () => {
  const { themeState } = useThemeContext();
  const [cursorColor, setCursorColor] = useState('255, 0, 0');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [smallCursorPos, setSmallCursorPos] = useState({ x: 0, y: 0 });
  const [largeCursorPos, setLargeCursorPos] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState('default');

  const smallCursorRef = useRef(null);
  const largeCursorRef = useRef(null);

  const smallCursorAnimationRef = useRef(null);
  const largeCursorAnimationRef = useRef(null);

  useEffect(() => {
    const hslToRgb = (h, s, l) => {
      h = h % 360;
      s /= 100;
      l /= 100;

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;

      let r, g, b;

      if (h >= 0 && h < 60) {
        [r, g, b] = [c, x, 0];
      } else if (h >= 60 && h < 120) {
        [r, g, b] = [x, c, 0];
      } else if (h >= 120 && h < 180) {
        [r, g, b] = [0, c, x];
      } else if (h >= 180 && h < 240) {
        [r, g, b] = [0, x, c];
      } else if (h >= 240 && h < 300) {
        [r, g, b] = [x, 0, c];
      } else if (h >= 300 && h < 360) {
        [r, g, b] = [c, 0, x];
      } else {
        [r, g, b] = [c, 0, 0];
      }

      return `${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)}`;
    };

    const primaryHue = themeState.primaryHue || 270;
    setCursorColor(hslToRgb(primaryHue, 89, 41));
  }, [themeState.primaryHue]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        const computedStyle = window.getComputedStyle(element);
        const cursorStyle = computedStyle.cursor;
        setCursorType(cursorStyle);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const animateSmallCursor = () => {
      const dx = position.x - smallCursorPos.x;
      const dy = position.y - smallCursorPos.y;

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        setSmallCursorPos(prev => ({
          x: prev.x + dx * 0.6,
          y: prev.y + dy * 0.6,
        }));
        smallCursorAnimationRef.current = requestAnimationFrame(animateSmallCursor);
      } else {
        cancelAnimationFrame(smallCursorAnimationRef.current);
      }
    };

    smallCursorAnimationRef.current = requestAnimationFrame(animateSmallCursor);

    return () => {
      if (smallCursorAnimationRef.current) {
        cancelAnimationFrame(smallCursorAnimationRef.current);
      }
    };
  }, [position, smallCursorPos]);

  useEffect(() => {
    const animateLargeCursor = () => {
      const dx = smallCursorPos.x - largeCursorPos.x;
      const dy = smallCursorPos.y - largeCursorPos.y;

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        setLargeCursorPos(prev => ({
          x: prev.x + dx * 0.4,
          y: prev.y + dy * 0.4,
        }));
        largeCursorAnimationRef.current = requestAnimationFrame(animateLargeCursor);
      } else {
        cancelAnimationFrame(largeCursorAnimationRef.current);
      }
    };

    largeCursorAnimationRef.current = requestAnimationFrame(animateLargeCursor);

    return () => {
      if (largeCursorAnimationRef.current) {
        cancelAnimationFrame(largeCursorAnimationRef.current);
      }
    };
  }, [smallCursorPos, largeCursorPos]);

  const getSmallCursorStyles = () => {
    const baseStyles = {
      position: 'fixed',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: `rgb(${cursorColor})`,
      pointerEvents: 'none',
      zIndex: 10000, // Ensure it's above everything
      transform: 'translate(-50%, -50%)',
      left: `${smallCursorPos.x}px`,
      top: `${smallCursorPos.y}px`,
      transition: 'width 0.3s, height 0.3s',
    };

    if (cursorType === 'pointer') {
      return {
        ...baseStyles,
        width: '14px',
        height: '14px',
      };
    } else if (cursorType === 'grab' || cursorType === 'grabbing') {
      return {
        ...baseStyles,
        width: '12px',
        height: '12px',
        borderRadius: '30%',
      };
    } else if (cursorType === 'text') {
      return {
        ...baseStyles,
        width: '8px',
        height: '16px',
        borderRadius: '3px',
      };
    }

    return baseStyles;
  };

  const getLargeCursorStyles = () => {
    const baseStyles = {
      position: 'fixed',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      border: `2px solid rgb(${cursorColor})`,
      backgroundColor: `rgba(${cursorColor}, 0.2)`,
      pointerEvents: 'none',
      zIndex: 9999,
      transform: 'translate(-50%, -50%)',
      left: `${largeCursorPos.x}px`,
      top: `${largeCursorPos.y}px`,
    };

    if (cursorType === 'pointer') {
      return {
        ...baseStyles,
        width: '40px',
        height: '40px',
      };
    } else if (cursorType === 'grab') {
      return {
        ...baseStyles,
        width: '45px',
        height: '45px',
        borderRadius: '40%',
      };
    } else if (cursorType === 'text') {
      return {
        ...baseStyles,
        width: '35px',
        height: '45px',
        borderRadius: '10px',
      };
    }

    return baseStyles;
  };

  return (
    <>
      {}
      <div
        ref={smallCursorRef}
        className="cursor-small"
        style={getSmallCursorStyles()}
      />

      {}
      <div
        ref={largeCursorRef}
        className="cursor-large"
        style={getLargeCursorStyles()}
      />

      {}
      <style jsx>{`
        .cursor-small {
          will-change: transform;
        }
        .cursor-large {
          will-change: transform;
        }
          .cursor-small, .cursor-large {
           will-change: transform;
        }
      `}</style>
    </>
  );
};

export default CustomAnimatedCursor;