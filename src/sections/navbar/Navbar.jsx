import data from "./data";
import { IoIosColorPalette } from "react-icons/io";
import { useModalContext } from "../../context/modal-context";
import { useState, useEffect, useRef } from "react";
import { updateActiveLinkByScroll, scrollToSection } from "../../components/navUtils";
import logo from "../../assets/logo.jpg";
import "./navbar.css";

const Navbar = () => {
  const { showModalHandler } = useModalContext();
  const [activeLink, setActiveLink] = useState("#");
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const newActiveLink = updateActiveLinkByScroll(isManualScrolling, activeLink);
      if (!isManualScrolling) {
        setActiveLink(newActiveLink);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    
    if (!isManualScrolling) {
      setActiveLink(updateActiveLinkByScroll(false, null));
    }
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isManualScrolling, activeLink]);

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    
    setActiveLink(link);
    setIsManualScrolling(true);
    
    scrollToSection(link);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      setIsManualScrolling(false);
    }, 1000);
  };

  return (
    <nav>
      <div className="container nav__container">
        <a href="index.html" className="nav__logo">
          <img
            src={logo}
            alt="Logo"
          />
        </a>
        <ul className="nav__menu">
          {data.map((item) => (
            <li key={item.id}>
              <a
                href={item.link}
                className={`${activeLink === item.link ? "active" : ""} ${
                  hoveredLink === item.link ? "hovered" : ""
                }`}
                onClick={(e) => handleLinkClick(e, item.link)}
                onMouseEnter={() => setHoveredLink(item.link)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
        <button id="theme__icon" onClick={showModalHandler}>
          <IoIosColorPalette />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;