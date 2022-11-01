import React from "react";
import cl from './Modal.module.css'

const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? `${cl.modal} ${cl.display__block}` : `${cl.modal} ${cl.display__none}`;
    return (
        <div className={showHideClassName}>
            <section className={cl.modal__main}>
                {children}
                {/* <button type="button" onClick={handleClose}>
                    Close
                </button> */}
            </section>
        </div>
    )
}

export default Modal;