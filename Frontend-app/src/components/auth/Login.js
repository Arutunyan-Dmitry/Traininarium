import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import '../../assets/css/components/auth.css';
import '../../assets/css/components/shared.css';

import { login } from '../../actions/auth'

import SuccessToast from "../shared/SuccessToast";
import ErrorAlert from "../shared/ErrorAlert";


const LoginModal = ( props ) => {
    const { login, ...defaultProps } = props;
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const {username, password} = formData;
    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value });
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const onSubmit = e => {
        e.preventDefault();
        setShowLoading(true);
        setShowError(false);
        login(username, password).then(result => {
            if(result[0]) {
                setShowSuccess(true);
                props.onHide();
            } else {
                setError(Object.values(result[1].response.data)[0]);
                setShowError(true);
            }
            setShowLoading(false);
        });
        setShowSuccess(false);
    };

    const handleOnHide = () => {
        setFormData({username: "", password: ""});
        setError("");
        setShowError(false);
        setShowSuccess(false);
        defaultProps.onHide();
    };

    return (
        <>
            <Modal
                className="loginModal"
                {...defaultProps}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                onHide={handleOnHide}
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <p>Войти</p>
                        <div className="modalLine"></div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showLoading && (
                        <div className="loading">
                            <Spinner animation="grow" variant="primary"/>
                            <Spinner animation="grow" variant="primary"/>
                            <Spinner animation="grow" variant="primary"/>
                        </div>
                    )}
                    <div className={`errorContainer ${showError ? 'visible' : 'hidden'}`}>
                        <ErrorAlert
                            title=""
                            body={error}
                            show={showError}
                            setShow={setShowError}
                        />
                    </div>
                    <Form onSubmit={e => onSubmit(e)}>
                        <Form.Group className="mb-3" controlId="formLoginEmail">
                            <Form.Label>Имя пользователя</Form.Label>
                            <Form.Control
                                type="username"
                                placeholder="Имя пользователя"
                                name="username"
                                value={username}
                                onChange={e => onChange(e)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formLoginPassword">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Пароль"
                                name="password"
                                value={password}
                                onChange={e => onChange(e)}
                                required
                            />
                        </Form.Group>
                        <div className="submitContainer">
                            <Button variant="primary" type="submit">Войти</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            {showSuccess && (
                <SuccessToast title="Авторизация" body="Вход в систему выполнен" />
            )}
        </>
    );
};

export default connect(null, { login })(LoginModal);