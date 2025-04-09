import data from "./data";
import Certificate from "./Certfiticate";
import { useState } from "react";
import CertificateCategories from "./CertificateCategories";
import "./certificates.css";

const Certificates = () => {
  const [certificates, setCertificates] = useState(data);

  const categories = data.map((item) => item.category);
  const uniqueCategories = ["All", ...new Set(categories)];

  const filterCertificatesHandler = (category) => {
    if (category === "All") {
      setCertificates(data);
      return;
    }

    const filteredCertificates = data.filter(
      (certificate) => certificate.category === category
    );
    setCertificates(filteredCertificates);
  };

  return (
    <section id="certificates">
      <h2>Certificates & Badges</h2>
      <p>
      Every credential is a milestone that reflects commitment, skills acquired, and readiness to take on new challenges.
      </p>
      <CertificateCategories
        categories={uniqueCategories}
        onFilterCertificates={filterCertificatesHandler}
      />
      <div className="container certificates__container" data-aos="fade-in">
        {certificates.map((certificate) => (
          <Certificate key={certificate.id} certificate={certificate} />
        ))}
      </div>
    </section>
  );
};

export default Certificates;