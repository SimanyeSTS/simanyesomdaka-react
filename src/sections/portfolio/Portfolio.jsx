import "./portfolio.css";
import Projects from "./Projects";
import ProjectsCategories from "./ProjectsCategories";
import data from "./data";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Portfolio = () => {
  const [projects, setProjects] = useState(data);

  const categories = data.map((item) => item.category);
  const uniqueCategories = ["All", ...new Set(categories)];

  useEffect(() => {
    AOS.init({ once: false, duration: 800 });
  }, []);

  const filterProjecstHandler = (category) => {
    if (category === "All") {
      setProjects(data);
    } else {
      const filterProjects = data.filter(
        (project) => project.category === category
      );
      setProjects(filterProjects);
    }
    setTimeout(() => {
      AOS.refreshHard();
    }, 0);
  };

  return (
    <section id="portfolio">
      <h2>Recent Projects</h2>
      <p>
        Here are some of the projects I've worked on, including personal projects, freelance work, and portfolio pieces.  
        Use the buttons to filter projects by category.
      </p>
      <div className="container portfolio__container">
        <ProjectsCategories
          categories={uniqueCategories}
          onFilterProjects={filterProjecstHandler}
        />
        <Projects projects={projects} />
      </div>
    </section>
  );
};

export default Portfolio;
