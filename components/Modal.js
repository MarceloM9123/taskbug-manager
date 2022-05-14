import { useEffect, useRef  } from "react";
import ReactPortal from "./ReactPortal";
import { CSSTransition } from "react-transition-group";

export default function Modal({ children, isOpen, handleClose }) {
    const nodeRef = useRef(null);
    useEffect(() => {
        const closeOnEscapeKey = e => e.key === "Escape" ? handleClose() : null;
        document.body.addEventListener("keydown", closeOnEscapeKey);
        return () => {
            document.body.removeEventListener("keydown", closeOnEscapeKey);
        };
    }, [handleClose]);

    return (
        <ReactPortal wrapperId="react-portal-modal-container">
			<CSSTransition
				in={isOpen}
				timeout={{ entry: 0, exit: 500 }}
				unmountOnExit
				classNames="modal"
				nodeRef={nodeRef}
			>
				<div className="modal" ref={nodeRef}>
					<div className="modal-content">
                        <button onClick={handleClose} className="close-btn">
                            Close
                        </button>
                    </div>
				</div>
			</CSSTransition>
		</ReactPortal>
    )
}
