import React from "react";
import Card from "../../components/Card";
import { useThemeContext } from "../../context/theme-context";

const Project = ({ project }) => {
  const { themeState } = useThemeContext();
  const { title, desc, demo, github, image, imageLight, category } = project;
  
  const displayImage = themeState.background === "bg-1" ? imageLight : image;

  // List of technology keywords to highlight
  const techKeywords = [
    "Figma", "Vue", "Vue.js", "VueJS", "JavaScript", "MySQL", "Python", "React", 
    "Node.js", "Express.js", "HTML", "CSS", "Bootstrap", "Vuex", "Flask", 
    "Firebase", "API", "JWT", "MEVN", "AWS", "Lambda", "GitHub", "React Leaflet",
    "Alpha Vantage", "Gemini AI", "Leaflet"
  ];

  const highlightTechWords = (text) => {
    if (!text) return "";
    
    const pattern = new RegExp(`\\b(${techKeywords.join('|')})\\b`, 'g');
    
    const parts = text.split(pattern);
    
    return parts.map((part, index) => {
      if (techKeywords.includes(part)) {
        return <span key={index} className="tech-keyword">{part}</span>;
      }
      return part;
    });
  };

  return (
    <Card className="portfolio__project">
      {}
      <div className="portfolio__project-image">
        <img 
          src={displayImage} 
          alt={title} 
          loading="lazy"
          className="project-image-transition" 
        />
      </div>
      
      {}
      <div className="portfolio__project-title">
        <h4 title={title}>{title}</h4>
      </div>
      
      {}
      <div className="portfolio__project-description">
        <p>{desc ? highlightTechWords(desc) : '\u00A0'}</p>
      </div>
      
      {}
      <div className="portfolio__project-cta">
        <a href={demo} className="btn sm primary" target="_blank" rel="noopener noreferrer">
          Demo
        </a>
        {category !== "UI/UX" && (
          <a href={github} className="btn sm" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        )}
      </div>
    </Card>
  );
};

export default React.memo(Project);