import Card from "../../components/Card";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useState } from "react";

const Certificate = ({ certificate }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <Card className="certificate" onClick={() => setShowDetails((prev) => !prev)}>
      <div>
        <h5 className="certificate__title">{certificate.title}</h5>
        <button className="certificate__icon">
          {showDetails ? <AiOutlineMinus /> : <AiOutlinePlus />}
        </button>
      </div>
      {showDetails && (
        <div className="certificate__details">
          {/* Description with scrolling if needed */}
          <div className="certificate__description-wrapper">
            <p className="certificate__description">
              {certificate.description || '\u00A0'}
            </p>
          </div>
          
          {/* Meta information with fixed position */}
          <div className="certificate__meta">
            <p className="certificate__issuer">
              {certificate.issuer ? `Issued by: ${certificate.issuer}` : '\u00A0'}
            </p>
            <p className="certificate__date">
              {certificate.date ? `Issued: ${certificate.date}` : '\u00A0'}
            </p>
          </div>
          
          {/* Button always at the bottom */}
          <div className="certificate__button-wrapper">
            <a 
              href={certificate.credentialUrl} 
              className="btn sm primary certificate__view-btn" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              View Credential
            </a>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Certificate;