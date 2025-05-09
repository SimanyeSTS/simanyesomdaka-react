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
  const [isOverScrollbar, setIsOverScrollbar] = useState(false);

  const smallCursorRef = useRef(null);
  const largeCursorRef = useRef(null);
  const smallCursorAnimationRef = useRef(null);
  const largeCursorAnimationRef = useRef(null);

  useEffect(() => {
    const checkInputType = () => {
      const mouseCapable = window.matchMedia('(pointer: fine)').matches;
      setHasMouse(mouseCapable);
    };
    checkInputType();

    const handleMouseMove = () => {
      if (!hasMouse) setHasMouse(true);
      setIsTouchActive(false);
    };

    const handleTouchStart = () => setIsTouchActive(true);
    const handlePointerChange = (e) => {
      if (e.pointerType === 'mouse') setHasMouse(true);
      if (e.pointerType === 'touch') setIsTouchActive(true);
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

  useEffect(() => {
    const hslToRgb = (h, s, l) => {
      h = h % 360;
      s /= 100;
      l /= 100;
      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = l - c / 2;
      let r, g, b;
      if (h < 60) [r, g, b] = [c, x, 0];
      else if (h < 120) [r, g, b] = [x, c, 0];
      else if (h < 180) [r, g, b] = [0, c, x];
      else if (h < 240) [r, g, b] = [0, x, c];
      else if (h < 300) [r, g, b] = [x, 0, c];
      else [r, g, b] = [c, 0, x];
      return `${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)}`;
    };

    const primaryHue = themeState.primaryHue || 270;
    setCursorColor(hslToRgb(primaryHue, 89, 41));
  }, [themeState.primaryHue]);

  const isScrollbarDetected = (x, y) => {
    const scrollbarThickness = 16;
    const overVerticalScrollbar = x >= window.innerWidth - scrollbarThickness;
    const overHorizontalScrollbar = y >= window.innerHeight - scrollbarThickness;
    
    if (overVerticalScrollbar || overHorizontalScrollbar) {
      return true;
    }
    
    const elementAtPoint = document.elementFromPoint(x, y);
    if (!elementAtPoint) return false;

    const rect = elementAtPoint.getBoundingClientRect();
    
    const isNearRightEdge = x >= rect.right - 16 && x <= rect.right;
    
    const isNearBottomEdge = y >= rect.bottom - 16 && y <= rect.bottom;
    
    const hasVerticalScrollbar = elementAtPoint.scrollHeight > elementAtPoint.clientHeight;
    const hasHorizontalScrollbar = elementAtPoint.scrollWidth > elementAtPoint.clientWidth;
    
    const isOverElementScrollbarVertical = isNearRightEdge && hasVerticalScrollbar;
    const isOverElementScrollbarHorizontal = isNearBottomEdge && hasHorizontalScrollbar;
    
    return (isOverElementScrollbarVertical || isOverElementScrollbarHorizontal);
  };

  useEffect(() => {
    if (!hasMouse || isTouchActive) return;
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const scrollbarDetected = isScrollbarDetected(e.clientX, e.clientY);
      setIsOverScrollbar(scrollbarDetected);
      
      if (!scrollbarDetected) {
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (element) {
          const computedStyle = window.getComputedStyle(element);
          setCursorType(computedStyle.cursor);
        }
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasMouse, isTouchActive]);

  useEffect(() => {
    if (!hasMouse || isTouchActive) return;
    const animate = () => {
      const dx = position.x - smallCursorPos.x;
      const dy = position.y - smallCursorPos.y;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        setSmallCursorPos(prev => ({ x: prev.x + dx * 0.6, y: prev.y + dy * 0.6 }));
        smallCursorAnimationRef.current = requestAnimationFrame(animate);
      } else cancelAnimationFrame(smallCursorAnimationRef.current);
    };
    smallCursorAnimationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(smallCursorAnimationRef.current);
  }, [position, smallCursorPos, hasMouse, isTouchActive]);

  useEffect(() => {
    if (!hasMouse || isTouchActive || loading) return;
    const animate = () => {
      const dx = smallCursorPos.x - largeCursorPos.x;
      const dy = smallCursorPos.y - largeCursorPos.y;
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        setLargeCursorPos(prev => ({ x: prev.x + dx * 0.4, y: prev.y + dy * 0.4 }));
        largeCursorAnimationRef.current = requestAnimationFrame(animate);
      } else cancelAnimationFrame(largeCursorAnimationRef.current);
    };
    largeCursorAnimationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(largeCursorAnimationRef.current);
  }, [smallCursorPos, largeCursorPos, hasMouse, isTouchActive, loading]);

  const getSmallCursorStyles = () => ({
    position: 'fixed',
    width: cursorType === 'pointer' ? '14px' : cursorType === 'text' ? '8px' : '10px',
    height: cursorType === 'pointer' ? '14px' : cursorType === 'text' ? '16px' : '10px',
    borderRadius: cursorType === 'pointer' ? '50%' : cursorType === 'text' ? '3px' : '50%',
    backgroundColor: `rgb(${cursorColor})`,
    pointerEvents: 'none',
    zIndex: 10000,
    transform: 'translate(-50%, -50%)',
    left: `${smallCursorPos.x}px`,
    top: `${smallCursorPos.y}px`,
    transition: 'width 0.3s, height 0.3s, opacity 0.3s ease',
    opacity: isOverScrollbar ? 0 : 1,
  });

  const getLargeCursorStyles = () => ({
    position: 'fixed',
    width: cursorType === 'pointer' ? '40px' : cursorType === 'text' ? '35px' : '50px',
    height: cursorType === 'pointer' ? '40px' : cursorType === 'text' ? '45px' : '50px',
    borderRadius: cursorType === 'pointer' ? '50%' : cursorType === 'text' ? '10px' : '50%',
    border: `2px solid rgb(${cursorColor})`,
    backgroundColor: `rgba(${cursorColor}, 0.2)`,
    pointerEvents: 'none',
    zIndex: 9999,
    transform: 'translate(-50%, -50%)',
    left: `${largeCursorPos.x}px`,
    top: `${largeCursorPos.y}px`,
    transition: 'width 0.3s, height 0.3s, opacity 0.3s ease',
    opacity: isOverScrollbar ? 0 : 1,
  });

  if (!hasMouse || isTouchActive) {
    if (loading) {
      return (
        <div
          ref={smallCursorRef}
          className="cursor-small"
          style={getSmallCursorStyles()}
        />
      );
    }
    return null;
  }

  return (
    <>
      <div ref={smallCursorRef} className="cursor-small" style={getSmallCursorStyles()} />
      {!loading && (
        <div ref={largeCursorRef} className="cursor-large" style={getLargeCursorStyles()} />
      )}
    </>
  );
};

export default CustomAnimatedCursor;