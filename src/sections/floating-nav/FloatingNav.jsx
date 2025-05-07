import { useState, useEffect, useRef } from "react";
import { debounce } from 'lodash';
import data from "./data";
import { updateActiveLinkByScroll, scrollToSection } from "../../components/navUtils";
import "./floating-nav.css";

const FloatingNav = () => {
  const [showNav, setShowNav] = useState(true);
  const [activeLink, setActiveLink] = useState("#");
  const isManualScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const isAtTop = () => window.scrollY <= 10;

  useEffect(() => {
    const debouncedHideNav = debounce(() => {
      if (!isAtTop()) {
        setShowNav(false);
      }
    }, 5000);

    const handleScroll = () => {
      if (!isManualScrollingRef.current) {
        const newActiveLink = updateActiveLinkByScroll(false, null);
        setActiveLink(newActiveLink);
      }

      setShowNav(true);
      debouncedHideNav();
    };

    const handleClick = (e) => {
      const target = e.target;
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[onclick]') ||
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.isContentEditable;

      if (!isInteractive) {
        setShowNav(true);
        debouncedHideNav();
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClick);

    setActiveLink(updateActiveLinkByScroll(false, null));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
      debouncedHideNav.cancel();
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    
    setActiveLink(link);
    isManualScrollingRef.current = true;
    
    scrollToSection(link);
    
    setShowNav(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 1500);
  };

  return (
    <ul id="floating__nav" className={`scrollspy ${showNav ? "show" : "hide"}`}>
      {data.map((item) => (
        <li key={item.id} className={activeLink === item.link ? "active" : ""}>
          <a
            href={item.link}
            onClick={(e) => handleLinkClick(e, item.link)}
          >
            {item.icon}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default FloatingNav;