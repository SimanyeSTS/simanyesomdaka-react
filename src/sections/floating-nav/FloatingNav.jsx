import { useState, useEffect } from "react";
import { debounce } from 'lodash';
import data from "./data";
import { useNavigation } from "../../context/navigation-context";
import "./floating-nav.css";

const FloatingNav = () => {
  const [showNav, setShowNav] = useState(true);
  const { activeLink, handleNavigation } = useNavigation();

  const isAtTop = () => window.scrollY <= 10;

  useEffect(() => {
    const debouncedHideNav = debounce(() => {
      if (!isAtTop()) {
        setShowNav(false);
      }
    }, 5000);

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

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      debouncedHideNav.cancel();
    };
  }, []);

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    handleNavigation(link);
    setShowNav(true);
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