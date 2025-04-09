import { useState } from "react";
import CategoryButton from "../portfolio/CategoryButton"; // Reusing the CategoryButton component

const CertificateCategories = ({ categories, onFilterCertificates }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const changeCategoryHandler = (activeCat) => {
    setActiveCategory(activeCat);
    onFilterCertificates(activeCat);
  };
  
  return (
    <div className="portfolio__categories certificates__categories">
      {categories.map((category) => (
        <CategoryButton
          key={category}
          category={category}
          onChangeCategory={() => changeCategoryHandler(category)}
          className={`btn cat__btn ${
            activeCategory === category ? "primary" : "white"
          }`}
        />
      ))}
    </div>
  );
};

export default CertificateCategories;