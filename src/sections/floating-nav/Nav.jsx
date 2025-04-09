import React from "react";

const Nav = ({ item, isActive }) => {
  return (
    <li className={isActive ? "active" : ""}>
      <a href={item.link}>{item.icon}</a>
    </li>
  );
};

export default Nav;