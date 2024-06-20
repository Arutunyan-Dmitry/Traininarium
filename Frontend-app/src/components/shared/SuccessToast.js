import React, { useState } from 'react'
import { Toast } from "react-bootstrap";
import '../../assets/css/components/shared.css'

const SuccessToast = ({ title, body }) => {
    const [show, setShow] = useState(true);

    return (
        <Toast
            className="successToast"
            bg="success"
            onClose={() => setShow(false)}
            show={show}
            delay={3000}
            autohide
        >
            <Toast.Header>
                <strong className="me-auto">{title}</strong>
                <small>Недавно</small>
            </Toast.Header>
            <Toast.Body>{body}</Toast.Body>
        </Toast>
    )
};

export default SuccessToast;