import { Fragment } from "react";
import ReactDOM from "react-dom";
import Card from "./Card";
import { useModalContext } from "../context/modal-context";
import { useThemeContext } from "../context/theme-context";
import "./modal.css";

const Modal = ({ className, children }) => {
  const { showModal, closeModalHandler } = useModalContext();
  const { themeState } = useThemeContext();
  
  return (
    <Fragment>
      {showModal &&
        ReactDOM.createPortal(
          <>
            <section id="backdrop" onClick={closeModalHandler}></section>
            <Card className={`${className} ${themeState.background}`}>
              <button 
                className="close-button" 
                onClick={closeModalHandler}
                aria-label="Close"
              >
                &times;
              </button>
              {children}
            </Card>
          </>,
          document.querySelector("#overlays")
        )}
    </Fragment>
  );
};

export default Modal;