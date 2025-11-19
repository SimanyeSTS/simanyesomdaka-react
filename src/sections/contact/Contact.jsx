import data from "./data";
import "./contact.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineLocationOn } from "react-icons/md";
const Contact = () => {
  return (
    <section id="contact">
      <h2>Get In Touch</h2>
      <p>Let's start a conversation. Choose your platform below.</p>
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
        <div className="address-icon-container">
          <FaMapMarkerAlt className="address-icon filled" />
          <MdOutlineLocationOn className="address-icon outline" />
        </div>
        <p className="address-text">Philippi, Cape Town, South Africa</p>
      </div>
    </section>
  );
};
export default Contact;