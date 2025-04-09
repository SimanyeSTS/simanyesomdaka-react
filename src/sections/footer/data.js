import { HiOutlineMail } from "react-icons/hi";
import { AiOutlineLinkedin } from "react-icons/ai";
import { AiOutlinePhone } from "react-icons/ai";
import { AiFillGithub } from "react-icons/ai";

export const links = [
  { id: 1, link: "#", title: "Home" },
  { id: 2, link: "#about", title: "About" },
  { id: 3, link: "#services", title: "Services" },
  { id: 4, link: "#portfolio", title: "Portfolio" },
  { id: 5, link: "#contact", title: "Contact" },
];

export const socials = [
  { id: 1, link: "mailto:simanyesomdaka@gmail.com", icon: <HiOutlineMail /> },
  { id: 2, link: "https://www.linkedin.com/in/simanye-somdaka-6501712b2/", icon: <AiOutlineLinkedin /> },
  { id: 3, link: "tel:+27730633069", icon: <AiOutlinePhone /> },
  { id: 4, link: "https://github.com/SimanyeSTS", icon: <AiFillGithub /> },
];