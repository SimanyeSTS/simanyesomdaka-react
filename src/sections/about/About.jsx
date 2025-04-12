import React, { useEffect, useRef, useMemo, memo, useState } from "react";
import { throttle } from "lodash";
import CV from "../../assets/Simanye Somdaka's Resume (OA).PDF";
import { HiDownload } from "react-icons/hi";
import data from "./data";
import Card from "../../components/Card";
import "./about.css";
import {
  FaReact, FaNode, FaJava, FaPython,
  FaHtml5, FaCss3Alt, FaGitAlt, FaGithub, FaBootstrap,
  FaVuejs, FaAws, FaNpm, FaAndroid, FaCloud
} from "react-icons/fa";
import {
  SiJavascript, SiTailwindcss, SiMongodb,
  SiExpress, SiNextdotjs, SiMysql,
  SiTestinglibrary, SiFigma,
  SiVite, SiFlutter, SiDart, SiCplusplus,
  SiCsharp, SiFirebase, SiVercel,
  SiNetlify, SiPostman, SiVisualstudio,
  SiFlask, SiUnity, SiApache,
  SiRender, SiMicrosoftazure, SiGooglecloud,
  SiTypescript, SiDotnet
} from "react-icons/si";

const About = memo(() => {
  const [isMobile, setIsMobile] = useState(false);
  const skillsContainerRef = useRef(null);
  const floatingAreaRef = useRef(null);
  const skillNamesContainerRef = useRef(null);
  const animationRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const rotationSpeedRef = useRef({ x: 0, y: 0 });
  const sphereRotationRef = useRef({ x: 0.3, y: 0.3 });
  const useDefaultRotationRef = useRef(true);
  const animatingToFrontRef = useRef(false);
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const initialRotationRef = useRef({ x: 0.3, y: 0.3 });
  const touchStartPosRef = useRef({ x: 0, y: 0 });
  const touchStartTimeRef = useRef(0);
  const isTapRef = useRef(false);
  const touchMovedRef = useRef(false);
  const scrollStartPosRef = useRef(0);
  const isScrollingRef = useRef(false);
  const lastTouchedSkillNameRef = useRef(null);

  useEffect(() => {
    setIsMobile(
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }, []);

    const skillsData = useMemo(() => [
    // Core Programming Languages
    { id: 1, name: "JavaScript", icon: <SiJavascript />, category: "language" },
    { id: 2, name: "Python", icon: <FaPython />, category: "language" },
    { id: 3, name: "Java", icon: <FaJava />, category: "language" },
    { id: 4, name: "C++", icon: <SiCplusplus />, category: "language" },
    { id: 5, name: "C#", icon: <SiCsharp />, category: "language" },
    { id: 6, name: "Dart", icon: <SiDart />, category: "language" },
    { id: 7, name: "TypeScript", icon: <SiTypescript />, category: "language" },

    // Frontend
    { id: 8, name: "HTML5", icon: <FaHtml5 />, category: "frontend" },
    { id: 9, name: "CSS3", icon: <FaCss3Alt />, category: "frontend" },
    { id: 10, name: "React", icon: <FaReact />, category: "frontend" },
    { id: 11, name: "Vue.js", icon: <FaVuejs />, category: "frontend" },
    { id: 12, name: "Next.js", icon: <SiNextdotjs />, category: "frontend" },
    { id: 13, name: "Bootstrap", icon: <FaBootstrap />, category: "frontend" },
    { id: 14, name: "Tailwind CSS", icon: <SiTailwindcss />, category: "frontend" },
    { id: 15, name: "Vite", icon: <SiVite />, category: "frontend" },

    // Backend
    { id: 16, name: "Node.js", icon: <FaNode />, category: "backend" },
    { id: 17, name: "Express.js", icon: <SiExpress />, category: "backend" },
    { id: 18, name: "Flask", icon: <SiFlask />, category: "backend" },
    { id: 19, name: ".NET & ASP.NET Core", icon: <SiDotnet />, category: "backend" },

    // Database
    { id: 20, name: "MongoDB", icon: <SiMongodb />, category: "database" },
    { id: 21, name: "MySQL", icon: <SiMysql />, category: "database" },
    { id: 22, name: "Firebase", icon: <SiFirebase />, category: "database" },

    // Cloud & Hosting
    { id: 23, name: "AWS", icon: <FaAws />, category: "cloud" },
    { id: 24, name: "Azure", icon: <SiMicrosoftazure />, category: "cloud" },
    { id: 25, name: "Google Cloud", icon: <SiGooglecloud />, category: "cloud" },
    { id: 26, name: "Vercel", icon: <SiVercel />, category: "cloud" },
    { id: 27, name: "Netlify", icon: <SiNetlify />, category: "cloud" },
    { id: 28, name: "Render", icon: <SiRender />, category: "cloud" },
    { id: 29, name: "Clever Cloud", icon: <FaCloud />, category: "cloud" },

    // Mobile Development
    { id: 30, name: "Flutter", icon: <SiFlutter />, category: "mobile" },
    { id: 31, name: "Android Studio", icon: <FaAndroid />, category: "mobile" },

    // Game Development
    { id: 32, name: "Unity", icon: <SiUnity />, category: "game" },

    // DevOps & Tools
    { id: 33, name: "Git", icon: <FaGitAlt />, category: "devops" },
    { id: 34, name: "GitHub", icon: <FaGithub />, category: "devops" },
    { id: 35, name: "NPM", icon: <FaNpm />, category: "devops" },

    // IDE & Design
    { id: 36, name: "Visual Studio & VS Code", icon: <SiVisualstudio />, category: "tools" },
    { id: 37, name: "Apache Netbeans", icon: <SiApache />, category: "tools" },
    { id: 38, name: "Figma", icon: <SiFigma />, category: "tools" },
    { id: 39, name: "Postman", icon: <SiPostman />, category: "tools" },
    { id: 40, name: "Testing", icon: <SiTestinglibrary />, category: "tools" },
  ], []);

  const LazySkillIcon = ({ icon }) => {
    const [LoadedIcon, setLoadedIcon] = useState(() => () => null);
    useEffect(() => {
      const loadIcon = async () => {
        try {
          const loadedIcon = await Promise.resolve(icon);
          setLoadedIcon(() => () => loadedIcon);
        } catch (error) {
          alert("Icon loading failed", error);
        }
      };
      loadIcon();
    }, [icon]);
    return <LoadedIcon />;
  };

  const clearAllActiveStates = () => {
    if (!skillsContainerRef.current) return;
    const icons = skillsContainerRef.current.querySelectorAll(".skill__icon");
    const names = skillsContainerRef.current.querySelectorAll(".skill__name");

    icons.forEach((icon) => {
      icon.classList.remove("active");
      if (isMobile) {
        icon.classList.add("hover-clear");
        setTimeout(() => icon.classList.remove("hover-clear"), 3000);
      }
    });

    names.forEach((name) => {
      name.classList.remove("active");
      if (isMobile) {
        name.classList.add("hover-clear");
        setTimeout(() => name.classList.remove("hover-clear"), 3000);
      }
    });

    lastTouchedSkillNameRef.current = null;
  };

  const centerSkillIcon = (icon, container) => {
    if (touchMovedRef.current) return;
    if (!icon || !container) return;

    const index = Array.from(
      container.querySelectorAll(".skill__icon-wrapper")
    ).indexOf(icon);
    if (index === -1) return;

    clearAllActiveStates();

    const iconEl = icon.querySelector(".skill__icon");
    const nameEl = container.querySelectorAll(".skill__name")[index];

    if (iconEl) iconEl.classList.add("active");
    if (nameEl) nameEl.classList.add("active");

    if (nameEl && isMobile) {
      nameEl.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  };

  const handleSkillNameClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isScrollingRef.current) return;

    const index = Array.from(
      skillsContainerRef.current.querySelectorAll(".skill__name")
    ).indexOf(e.currentTarget);
    if (index === -1) return;

    const icon = skillsContainerRef.current.querySelectorAll(
      ".skill__icon-wrapper"
    )[index];
    if (!icon) return;

    touchMovedRef.current = false;
    centerSkillIcon(icon, skillsContainerRef.current);
  };

  const handleSkillNamesContainerTouchStart = () => {
    if (!skillNamesContainerRef.current) return;
    scrollStartPosRef.current = skillNamesContainerRef.current.scrollLeft;
    isScrollingRef.current = false;

    if (lastTouchedSkillNameRef.current) {
      lastTouchedSkillNameRef.current.classList.remove("active");
      lastTouchedSkillNameRef.current = null;
    }
  };

  const handleSkillNamesContainerTouchMove = () => {
    if (!skillNamesContainerRef.current) return;
    const currentScroll = skillNamesContainerRef.current.scrollLeft;
    if (Math.abs(currentScroll - scrollStartPosRef.current) > 5) {
      isScrollingRef.current = true;
      const names = skillsContainerRef.current.querySelectorAll(".skill__name");
      names.forEach((name) => {
        name.classList.remove("active");
        if (isMobile) {
          name.classList.add("hover-clear");
        }
      });
    }
  };

  const handleSkillNameTouchStart = (e) => {
    touchStartPosRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    touchStartTimeRef.current = Date.now();
    touchMovedRef.current = false;
    isTapRef.current = true;
    lastTouchedSkillNameRef.current = e.currentTarget;
  };

  const handleSkillNameTouchMove = (e) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartPosRef.current.x);
    const dy = Math.abs(e.touches[0].clientY - touchStartPosRef.current.y);
    if (dx > 5 || dy > 5) {
      touchMovedRef.current = true;
      isTapRef.current = false;
      isScrollingRef.current = true;
      e.currentTarget.classList.remove("active");
    }
  };

  const handleSkillNameTouchEnd = (e) => {
    if (isScrollingRef.current || touchMovedRef.current) {
      e.preventDefault();
      return;
    }
    const elapsed = Date.now() - touchStartTimeRef.current;
    if (elapsed < 300) {
      handleSkillNameClick(e);
    }
    e.preventDefault();
  };

  useEffect(() => {
    const container = skillNamesContainerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleSkillNamesContainerTouchStart, { passive: true });
      container.addEventListener("touchmove", handleSkillNamesContainerTouchMove, { passive: true });
      return () => {
        container.removeEventListener("touchstart", handleSkillNamesContainerTouchStart);
        container.removeEventListener("touchmove", handleSkillNamesContainerTouchMove);
      };
    }
  }, []);

  return (
    <section id="about">
      <div className="container about__container" data-aos="fade-in">
        <div className="about__content-container">
          <h2>About Me</h2>
          <p>Every journey has a story—here's mine.</p>
          <div className="about__cards">
            {data.map((item) => (
              <Card key={item.id} className="about__card">
                <span className="about__card-icon">{item.icon}</span>
                <h5>{item.title}</h5>
                <small>{item.desc}</small>
              </Card>
            ))}
          </div>
          <div className="about__text">
            <p>
              As a Junior Software Engineer, my passion is delivering scalable,
              secure, and efficient solutions by applying strong engineering
              principles. My expertise lies in backend and cloud development,
              but I take a full-stack approach when needed.
            </p>
            <p>
              Currently an Applications Development student at CPUT, I thrive
              in both independent and collaborative environments. My skills
              span data analysis, pattern recognition, and system optimization,
              with a keen interest in cloud security and infrastructure design.
            </p>
            <p>
              I'm always eager to connect with like-minded professionals and
              explore new opportunities. If you have a project or challenge,
              feel free to reach out—let's create something impactful!
            </p>
          </div>
          <a href={CV} download className="btn primary">
            Download CV <HiDownload />
          </a>
        </div>

        <div className="skills__container" ref={skillsContainerRef}>
          <h2>Skills</h2>
          <p>
            Empowered by knowledge, driven by skills—here's what I bring to the
            table.
          </p>
          <div className="skills__floating-area" ref={floatingAreaRef}>
            {skillsData.map((skill) => (
              <div
                key={skill.id}
                className="skill__icon-wrapper"
                draggable="false"
              >
                <div
                  className="skill__icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    centerSkillIcon(
                      e.currentTarget.parentElement,
                      skillsContainerRef.current
                    );
                  }}
                >
                  <LazySkillIcon icon={skill.icon} />
                </div>
              </div>
            ))}
          </div>
          <div className="skills__names" ref={skillNamesContainerRef}>
            {skillsData.map((skill) => (
              <span
                key={skill.id}
                className="skill__name"
                onClick={handleSkillNameClick}
                onTouchStart={handleSkillNameTouchStart}
                onTouchMove={handleSkillNameTouchMove}
                onTouchEnd={handleSkillNameTouchEnd}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default About;