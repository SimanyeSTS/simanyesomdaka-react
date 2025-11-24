import { useEffect } from "react";
import data from "./data";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdDesignServices, MdCode, MdVideoLibrary } from "react-icons/md";
import { HiServer } from "react-icons/hi";
import { useNavigation } from "../../context/navigation-context";
import profile from "../../assets/ProfilePic.png";
import "./header.css";

const Header = () => {
  const { handleNavigation } = useNavigation();

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  const handleButtonClick = (e) => {
    e.preventDefault();
    handleNavigation("#contact");
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
            Software Engineer with <span className="highlight">Backend & Cloud expertise</span>, 
            focused on building scalable, secure systems. Currently pursuing a 
            <span className="highlight"> Diploma in ICT at CPUT</span>, I combine academic 
            principles with practical experience to deliver robust, production-ready solutions.
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