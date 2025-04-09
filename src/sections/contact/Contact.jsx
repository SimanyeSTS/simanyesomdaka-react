import data from "./data";
import "./contact.css";
import { FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <section id="contact">
      <h2>Get In Touch</h2>
      <p>Feel free to reach out via any of the links below!</p>
      <div className="container contact__container" data-aos="fade-up">
        {data.map((contact) => (
          <a
            key={contact.id}
            href={contact.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {contact.icon}
          </a>
        ))}
      </div>
      <div className="address-container" data-aos="fade-up">
        <FaMapMarkerAlt className="address-icon" />
        <p className="address-text">Brooklyn, Cape Town, South Africa</p>
      </div>
    </section>
  );
};

export default Contact;