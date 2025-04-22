import React, { useEffect, useRef, useMemo, memo, useState } from "react";
import { throttle } from 'lodash';
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
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const skillsContainerRef = useRef(null);
  const floatingAreaRef = useRef(null);
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

  useEffect(() => {
    const checkTouchDevice = () => {
      return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
    };
    setIsTouchDevice(checkTouchDevice());
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
    const [LoadedIcon, setLoadedIcon] = React.useState(() => () => null);
  
    React.useEffect(() => {
      const loadIcon = async () => {
        try {
          const loadedIcon = await Promise.resolve(icon);
          setLoadedIcon(() => () => loadedIcon);
        } catch (error) {
          alert('Icon loading failed: ' + (error.message || 'Unknown error'));
        }
      };
  
      loadIcon();
    }, [icon]);
  
    return <LoadedIcon />;
  };

  const clearAllActiveStates = React.useCallback(() => {
    if (!skillsContainerRef.current) return;

    const iconElements = skillsContainerRef.current.querySelectorAll('.skill__icon');
    const skillNames = skillsContainerRef.current.querySelectorAll('.skill__name');

    iconElements.forEach(icon => {
      icon.classList.remove('active');
    });

    skillNames.forEach(name => {
      name.classList.remove('active');
    });
  }, []);

  const activateSkillPair = React.useCallback((index) => {
    if (!skillsContainerRef.current) return;

    clearAllActiveStates();

    const icons = skillsContainerRef.current.querySelectorAll('.skill__icon-wrapper');
    const names = skillsContainerRef.current.querySelectorAll('.skill__name');

    if (icons[index]) {
      const icon = icons[index].querySelector('.skill__icon');
      if (icon) {
        icon.classList.add('active');
      }
    }

    if (names[index]) {
      names[index].classList.add('active');
      names[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [clearAllActiveStates]);

  const centerSkillIcon = React.useCallback((iconOrEvent, container) => {
    if (touchMovedRef.current) return;

    let icon;
    let index = -1;

    if (iconOrEvent instanceof Event || (iconOrEvent.nativeEvent && iconOrEvent.currentTarget)) {
      const target = iconOrEvent.currentTarget || iconOrEvent.target;

      if (target.classList.contains('skill__name')) {
        index = Array.from(container.querySelectorAll('.skill__name')).indexOf(target);
        if (index !== -1) {
          icon = container.querySelectorAll('.skill__icon-wrapper')[index];
        }
      } else {
        icon = target.closest('.skill__icon-wrapper');
        if (icon) {
          index = Array.from(container.querySelectorAll('.skill__icon-wrapper')).indexOf(icon);
        }
      }
    } else {
      icon = iconOrEvent;
      index = Array.from(container.querySelectorAll('.skill__icon-wrapper')).indexOf(icon);
    }

    if (!icon || index === -1) return;

    activateSkillPair(index);

    const x = parseFloat(icon.dataset.baseX || 0);
    const y = parseFloat(icon.dataset.baseY || 0);
    const z = parseFloat(icon.dataset.baseZ || 0);

    const targetRotationY = -Math.atan2(x, z);
    const targetRotationX = -Math.atan2(y, Math.sqrt(x * x + z * z));

    initialRotationRef.current = { 
      x: sphereRotationRef.current.x, 
      y: sphereRotationRef.current.y 
    };

    targetRotationRef.current = { 
      x: targetRotationX, 
      y: targetRotationY 
    };

    animatingToFrontRef.current = true;
    useDefaultRotationRef.current = false;
    rotationSpeedRef.current = { x: 0, y: 0 };
  }, [activateSkillPair]);

  const handleIconTouchStart = (e) => {
    touchStartPosRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    touchStartTimeRef.current = Date.now();
    touchMovedRef.current = false;
    isTapRef.current = true;
  };

  const handleIconTouchMove = (e) => {
    const moveX = Math.abs(e.touches[0].clientX - touchStartPosRef.current.x);
    const moveY = Math.abs(e.touches[0].clientY - touchStartPosRef.current.y);

    if (moveX > 5 || moveY > 5) {
      touchMovedRef.current = true;
      isTapRef.current = false;
    }
  };

  const handleIconTouchEnd = (e) => {
    if (touchMovedRef.current) {
      e.preventDefault();
      return;
    }

    const elapsed = Date.now() - touchStartTimeRef.current;
    if (elapsed < 300) {
      centerSkillIcon(e.currentTarget, skillsContainerRef.current);
    }
    e.preventDefault();
  };

  const handleSkillNameTouchStart = (e) => {
    touchStartPosRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
    touchStartTimeRef.current = Date.now();
    touchMovedRef.current = false;
    isTapRef.current = true;
  };

  const handleSkillNameTouchMove = (e) => {
    const moveX = Math.abs(e.touches[0].clientX - touchStartPosRef.current.x);
    const moveY = Math.abs(e.touches[0].clientY - touchStartPosRef.current.y);

    if (moveX > 5 || moveY > 5) {
      touchMovedRef.current = true;
      isTapRef.current = false;
    }
  };

  const handleSkillNameTouchEnd = (e) => {
    if (touchMovedRef.current) {
      e.preventDefault();
      return;
    }

    const elapsed = Date.now() - touchStartTimeRef.current;
    if (elapsed < 300) {
      handleSkillNameClick(e);
    }
    e.preventDefault();
  };

  const handleSkillNameClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const index = Array.from(skillsContainerRef.current.querySelectorAll('.skill__name')).indexOf(e.currentTarget);
    if (index === -1) return;

    const icon = skillsContainerRef.current.querySelectorAll('.skill__icon-wrapper')[index];
    if (!icon) return;

    touchMovedRef.current = false;
    centerSkillIcon(icon, skillsContainerRef.current);
  };

  useEffect(() => {
    if (!skillsContainerRef.current || !floatingAreaRef.current) return;

    const container = skillsContainerRef.current;
    const floatingArea = floatingAreaRef.current;
    const iconElements = container.querySelectorAll('.skill__icon-wrapper');
    const total = iconElements.length;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const containerRect = container.getBoundingClientRect();
    const containerHeight = containerRect.height - 100;
    const radius = Math.min(containerRect.width, containerHeight) * 0.45;

    const center = {
      x: containerRect.width / 2,
      y: (containerHeight / 2) - 40,
    };

    const createSpherePoints = (n) => {
      const points = [];
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const alpha = 2 * Math.PI / (goldenRatio * goldenRatio);

      for (let i = 0; i < n; i++) {
        const z = 1 - (2 * i + 1) / n;
        const radius = Math.sqrt(1 - z * z);
        const theta = alpha * i;
        const x = Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius;
        points.push({ x, y, z });
      }

      return points;
    };

    const spherePoints = createSpherePoints(total);

    iconElements.forEach((icon, index) => {
      const point = spherePoints[index];
      icon.dataset.baseX = point.x;
      icon.dataset.baseY = point.y;
      icon.dataset.baseZ = point.z;
      icon.dataset.x = point.x;
      icon.dataset.y = point.y;
      icon.dataset.z = point.z;
      icon.dataset.speedFactor = "1.0";
    });

    const animate = () => {
      if (!isDraggingRef.current) {
        if (animatingToFrontRef.current) {
          const easeAmount = 0.1;
          sphereRotationRef.current.x += (targetRotationRef.current.x - sphereRotationRef.current.x) * easeAmount;
          sphereRotationRef.current.y += (targetRotationRef.current.y - sphereRotationRef.current.y) * easeAmount;

          const distX = Math.abs(targetRotationRef.current.x - sphereRotationRef.current.x);
          const distY = Math.abs(targetRotationRef.current.y - sphereRotationRef.current.y);

          if (distX < 0.01 && distY < 0.01) {
            animatingToFrontRef.current = false;
          }
        }
        else if (useDefaultRotationRef.current) {
          sphereRotationRef.current.x += 0.001;
          sphereRotationRef.current.y += 0.001;
        } else {
          sphereRotationRef.current.x += rotationSpeedRef.current.x;
          sphereRotationRef.current.y += rotationSpeedRef.current.y;
        }
      }

      iconElements.forEach((icon) => {
        let x = parseFloat(icon.dataset.baseX);
        let y = parseFloat(icon.dataset.baseY);
        let z = parseFloat(icon.dataset.baseZ);
        const speedFactor = parseFloat(icon.dataset.speedFactor);

        const cosY = Math.cos(sphereRotationRef.current.y * speedFactor);
        const sinY = Math.sin(sphereRotationRef.current.y * speedFactor);
        const tempX = x * cosY + z * sinY;
        const tempZ = z * cosY - x * sinY;

        const cosX = Math.cos(sphereRotationRef.current.x * speedFactor);
        const sinX = Math.sin(sphereRotationRef.current.x * speedFactor);
        const tempY = y * cosX + tempZ * sinX;
        const finalZ = tempZ * cosX - y * sinX;

        const scale = (finalZ + 2) / 3;
        const translateX = tempX * radius * scale + center.x;
        const translateY = tempY * radius * scale + center.y;

        icon.style.transform = `translate(${translateX - 25}px, ${translateY - 25}px) scale(${0.8 + scale * 0.5})`;
        icon.style.opacity = Math.max(0.2, (finalZ + 1) / 2).toFixed(2);
        icon.style.zIndex = Math.floor((finalZ + 1) * 100);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseDown = (e) => {
      if (!e.target.closest('.skills__floating-area, .skill__icon-wrapper, .skill__icon')) {
        return;
      }

      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      clearAllActiveStates();

      e.preventDefault();
      floatingArea.style.cursor = 'grabbing';
      animatingToFrontRef.current = false;
    };

    const handleMouseMoveRaw = (e) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;

      const rotationMultiplier = 0.005;
      const cosX = Math.cos(sphereRotationRef.current.x);
      const horizontalDirection = cosX >= 0 ? 1 : -1;

      sphereRotationRef.current.y += deltaX * rotationMultiplier * horizontalDirection;
      sphereRotationRef.current.x += deltaY * rotationMultiplier;

      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        const speedMultiplier = 0.001;
        rotationSpeedRef.current = {
          x: Math.sign(deltaY) * speedMultiplier,
          y: Math.sign(deltaX) * speedMultiplier * horizontalDirection
        };
        useDefaultRotationRef.current = false;
      }

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = throttle(handleMouseMoveRaw, 16);

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      floatingArea.style.cursor = 'grab';
    };

    const handleTouchStart = (e) => {
      if (!e.target.closest('.skills__floating-area, .skill__icon-wrapper, .skill__icon')) {
        return;
      }

      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        clearAllActiveStates();

        e.preventDefault();
        floatingArea.style.cursor = 'grabbing';
        animatingToFrontRef.current = false;
      }
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - lastMousePosRef.current.x;
      const deltaY = e.touches[0].clientY - lastMousePosRef.current.y;

      const rotationMultiplier = 0.005;
      const cosX = Math.cos(sphereRotationRef.current.x);
      const horizontalDirection = cosX >= 0 ? 1 : -1;

      sphereRotationRef.current.y += deltaX * rotationMultiplier * horizontalDirection;
      sphereRotationRef.current.x += deltaY * rotationMultiplier;

      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        const speedMultiplier = 0.001;
        rotationSpeedRef.current = {
          x: Math.sign(deltaY) * speedMultiplier,
          y: Math.sign(deltaX) * speedMultiplier * horizontalDirection
        };
        useDefaultRotationRef.current = false;
      }

      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      floatingArea.style.cursor = 'grab';
    };

    floatingArea.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    floatingArea.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    const handleResize = () => {
      const newContainerRect = container.getBoundingClientRect();
      const newContainerHeight = newContainerRect.height - 100;
      center.x = newContainerRect.width / 2;
      center.y = (newContainerHeight / 2) - 40;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      floatingArea.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      floatingArea.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      window.removeEventListener('resize', handleResize);
    };
  }, [centerSkillIcon, skillsData, clearAllActiveStates]);

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
              As a Junior Software Engineer, my passion is delivering scalable, secure, and efficient solutions by applying strong engineering principles. My expertise lies in backend and cloud development, but I take a full-stack approach when needed.
            </p>
            <p>
              Currently an Applications Development student at CPUT, I thrive in both independent and collaborative environments. My skills span data analysis, pattern recognition, and system optimization, with a keen interest in cloud security and infrastructure design.
            </p>
            <p>
              I'm always eager to connect with like-minded professionals and explore new opportunities. If you have a project or challenge, feel free to reach out—let's create something impactful!
            </p>
          </div>
          <a href={CV} download className="btn primary">
            Download CV <HiDownload />
          </a>
        </div>

        <div className="skills__container" ref={skillsContainerRef}>
          <h2>Skills</h2>
          <p>Empowered by knowledge, driven by skills—here's what I bring to the table.</p>
          <div 
            className="skills__floating-area" 
            ref={floatingAreaRef}
            style={{ cursor: 'grab' }}
          >
            {skillsData.map((skill, index) => (
              <div 
                key={skill.id} 
                className="skill__icon-wrapper" 
                draggable="false"
                onTouchStart={handleIconTouchStart}
                onTouchMove={handleIconTouchMove}
                onTouchEnd={handleIconTouchEnd}
              >
                <div 
                  className="skill__icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    centerSkillIcon(e.currentTarget.parentElement, skillsContainerRef.current);
                  }}
                >
                  <LazySkillIcon icon={skill.icon} />
                </div>
              </div>
            ))}
          </div>
          <div className="skills__names">
            {skillsData.map((skill, index) => (
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

export default React.memo(About);