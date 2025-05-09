import data from "./data";
import { IoIosColorPalette } from "react-icons/io";
import { useModalContext } from "../../context/modal-context";
import { useState } from "react";
import { useNavigation } from "../../context/navigation-context";
import logo from "../../assets/logo.jpg";
import "./navbar.css";

const Navbar = () => {
  const { showModalHandler } = useModalContext();
  const [hoveredLink, setHoveredLink] = useState(null);
  const { activeLink, handleNavigation } = useNavigation();

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    handleNavigation(link);
  };

  return (
    <nav>
      <div className="container nav__container">
        <a href="index.html" className="nav__logo">
          <img src={logo} alt="Logo" />
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