import { links, socials } from "./data";
import { useState, useEffect } from "react";
import { updateActiveLinkByScroll, scrollToSection } from "../../components/navUtils";
import "./footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [activeLink, setActiveLink] = useState("#");
  const [hoveredLink, setHoveredLink] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const newActiveLink = updateActiveLinkByScroll();
      setActiveLink(newActiveLink);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    setActiveLink(link);
    scrollToSection(link);
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