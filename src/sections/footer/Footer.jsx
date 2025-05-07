import { links, socials } from "./data";
import { useState, useEffect, useRef } from "react";
import { updateActiveLinkByScroll, scrollToSection } from "../../components/navUtils";
import "./footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [activeLink, setActiveLink] = useState("#");
  const [hoveredLink, setHoveredLink] = useState(null);
  const isManualScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!isManualScrollingRef.current) {
        const newActiveLink = updateActiveLinkByScroll();
        setActiveLink(newActiveLink);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    
    setActiveLink(updateActiveLinkByScroll());
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
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
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 1500);
  };

  return (
    <footer>
      <div className="container footer__container">
        <ul className="nav__menu">
          {links.map((fLink) => (
            <li key={fLink.id}>
              <a 
                href={fLink.link}
                className={`${activeLink === fLink.link ? "active" : ""} ${
                  hoveredLink === fLink.link ? "hovered" : ""
                }`}
                onClick={(e) => handleLinkClick(e, fLink.link)}
                onMouseEnter={() => setHoveredLink(fLink.link)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {fLink.title}
              </a>
            </li>
          ))}
        </ul>
        <div className="footer__socials">
          {socials.map((social) => (
            <a
              key={social.id}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
      <div className="footer__copyright">
        <small> {currentYear} Simanye Somdaka &copy; All Rights Reserved</small>
      </div>
    </footer>
  );
};

export default Footer;