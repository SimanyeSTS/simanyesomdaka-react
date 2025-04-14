import { useEffect, useState, useRef } from 'react';
import { useThemeContext } from "../context/theme-context";

const CustomAnimatedCursor = ({ loading = false }) => {
  const { themeState } = useThemeContext();
  const [cursorColor, setCursorColor] = useState('255, 0, 0');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [smallCursorPos, setSmallCursorPos] = useState({ x: 0, y: 0 });
  const [largeCursorPos, setLargeCursorPos] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState('default');
  const [hasMouse, setHasMouse] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);

  const smallCursorRef = useRef(null);
  const largeCursorRef = useRef(null);

  const smallCursorAnimationRef = useRef(null);
  const largeCursorAnimationRef = useRef(null);

  // Enhanced input detection
  useEffect(() => {
    const checkInputType = () => {
      // Check if device has mouse capability
      const mouseCapable = window.matchMedia('(pointer: fine)').matches;
      setHasMouse(mouseCapable);
    };

    // Initial check
    checkInputType();

    // Mouse movement handler
    const handleMouseMove = () => {
      if (!hasMouse) setHasMouse(true);
      setIsTouchActive(false);
    };

    // Touch handler
    const handleTouchStart = () => {
      setIsTouchActive(true);
    };

    // Pointer change handler
    const handlePointerChange = (e) => {
      if (e.pointerType === 'mouse') {
        setHasMouse(true);
        setIsTouchActive(false);
      } else if (e.pointerType === 'touch') {
        setIsTouchActive(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('pointerdown', handlePointerChange);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('pointerdown', handlePointerChange);
    };
  }, [hasMouse]);

  // HSL to RGB conversion for cursor color
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

  // Mouse position tracking
  useEffect(() => {
    if (!hasMouse || isTouchActive) return;

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
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasMouse, isTouchActive]);

  // Small cursor animation
  useEffect(() => {
    if (!hasMouse || isTouchActive) return;

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
    return () => cancelAnimationFrame(smallCursorAnimationRef.current);
  }, [position, smallCursorPos, hasMouse, isTouchActive]);

  // Large cursor animation
  useEffect(() => {
    if (!hasMouse || isTouchActive || loading) return;

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
    return () => cancelAnimationFrame(largeCursorAnimationRef.current);
  }, [smallCursorPos, largeCursorPos, hasMouse, isTouchActive, loading]);

  // Cursor style definitions
  const getSmallCursorStyles = () => ({
    position: 'fixed',
    width: cursorType === 'pointer' ? '14px' : 
           cursorType === 'text' ? '8px' : '10px',
    height: cursorType === 'pointer' ? '14px' : 
            cursorType === 'text' ? '16px' : '10px',
    borderRadius: cursorType === 'pointer' ? '50%' : 
                 cursorType === 'text' ? '3px' : '50%',
    backgroundColor: `rgb(${cursorColor})`,
    pointerEvents: 'none',
    zIndex: 10000,
    transform: 'translate(-50%, -50%)',
    left: `${smallCursorPos.x}px`,
    top: `${smallCursorPos.y}px`,
    transition: 'width 0.3s, height 0.3s',
  });

  const getLargeCursorStyles = () => ({
    position: 'fixed',
    width: cursorType === 'pointer' ? '40px' : 
           cursorType === 'text' ? '35px' : '50px',
    height: cursorType === 'pointer' ? '40px' : 
            cursorType === 'text' ? '45px' : '50px',
    borderRadius: cursorType === 'pointer' ? '50%' : 
                 cursorType === 'text' ? '10px' : '50%',
    border: `2px solid rgb(${cursorColor})`,
    backgroundColor: `rgba(${cursorColor}, 0.2)`,
    pointerEvents: 'none',
    zIndex: 9999,
    transform: 'translate(-50%, -50%)',
    left: `${largeCursorPos.x}px`,
    top: `${largeCursorPos.y}px`,
  });

  if (!hasMouse || isTouchActive) {
    return null;
  }

  return (
    <>
      <div
        ref={smallCursorRef}
        className="cursor-small"
        style={getSmallCursorStyles()}
      />
      
      {!loading && (
        <div
          ref={largeCursorRef}
          className="cursor-large"
          style={getLargeCursorStyles()}
        />
      )}
    </>
  );
};

export default CustomAnimatedCursor;