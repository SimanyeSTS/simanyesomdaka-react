import { useEffect } from "react";
import data from "./data";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdDesignServices, MdCode, MdVideoLibrary } from "react-icons/md";
import { HiServer } from "react-icons/hi";
import profile from "../../assets/profile.png";
import "./header.css";

const Header = () => {
  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  const handleButtonClick = (e) => {
    e.preventDefault();
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      window.scrollTo({
        top: contactSection.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <header id="home">
      <div className="container header__container" data-aos="fade-down">
        <div className="header__socials">
          {data.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.icon}
            </a>
          ))}
        </div>
        <div className="info">
          <h1>Software Engineer | Backend & Cloud-Focused | Problem-Solver Across the Stack</h1>
          <h3>Hi, I'm Simanye...</h3>
          <p>
            A Junior Software Engineer with <span className="highlight">Backend & Cloud expertise</span>, applying strong engineering principles to build scalable and secure systems. As an <span className="highlight">Applications Development student at CPUT</span>, I approach software challenges with a problem-solving mindset, ensuring efficiency across different tech stacks. Always eager to learn, adapt, and tackle new opportunities in the ever-evolving tech landscape.
          </p>
          <a 
            href="#contact" 
            className="btn primary"
            onClick={handleButtonClick}
          >
            Let's Talk
          </a>
        </div>
        <div className="profile__area">
          <div className="outer__circle">
            <span>
              <MdDesignServices />
            </span>
            <span>
              <HiServer />
            </span>
            <span>
              <MdCode />
            </span>
            <span>
              <MdVideoLibrary />
            </span>
          </div>
          <div className="inner__circle">
            <img src={profile} alt="Header Portrait" loading="lazy" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;