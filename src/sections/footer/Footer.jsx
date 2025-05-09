import { links, socials } from "./data";
import { useState } from "react";
import { useNavigation } from "../../context/navigation-context";
import "./footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [hoveredLink, setHoveredLink] = useState(null);
  const { activeLink, handleNavigation } = useNavigation();

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    handleNavigation(link);
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