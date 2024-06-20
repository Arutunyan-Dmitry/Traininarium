import React from 'react'
import { Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/components/shared.css'


const ErrorAlert = ({ title, body, show, setShow }) => {
    return (
        <Alert className="error" show={show} variant="danger" onClose={() => setShow(false)} dismissible>
            {title !== '' && (<Alert.Heading>{title}</Alert.Heading>)}
            <p>{body}</p>
        </Alert>
    )
};

export default ErrorAlert;