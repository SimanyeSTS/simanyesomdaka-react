import React, { useRef } from "react";
import IconCloud from "./IconCloud";
import "./SkillsCard.css";

export default React.memo(SkillsCard);
function SkillsCard({ data }) {
  const skills = Object.keys(data.skills);
  const skills_names = Object.values(data.skills);
  const skillsContainerRef = useRef(null);

  const handleSkillClick = (skillName) => {
    const index = skills_names.indexOf(skillName);
    if (index !== -1 && skillsContainerRef.current) {
      const cloud = skillsContainerRef.current.querySelector('.icon-cloud');
      if (cloud) {
        const icons = cloud.querySelectorAll('a');
        if (icons.length > index) {
          icons[index].focus();
          icons[index].click();
        }
      }
    }
  };
  

  return (
    <div className="skills__container" ref={skillsContainerRef}>
      <h2>{data.title}</h2>
      <p>Empowered by knowledge, driven by skills—here's what I bring to the table.</p>
      <div className="skills__floating-area">
        <IconCloud iconSlugs={skills} />
      </div>
      <div className="skills__names">
        {skills_names.map((name, index) => (
          <span 
            key={index} 
            className="skill__name"
            onClick={() => handleSkillClick(name)}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}