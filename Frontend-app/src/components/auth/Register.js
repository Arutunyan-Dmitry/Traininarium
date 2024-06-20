import React, {useEffect, useRef, useState} from "react";
import {Modal, Button, Form, Spinner} from "react-bootstrap";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from '@fortawesome/fontawesome-svg-core';
import {faPerson, faPersonDress} from '@fortawesome/free-solid-svg-icons';
import '../../assets/css/components/auth.css';

import {activate, register, resendCode} from '../../actions/auth'
import SuccessToast from "../shared/SuccessToast";
import ErrorAlert from "../shared/ErrorAlert";

library.add(faPerson, faPersonDress);


const RegisterModal = (props) => {
    const {uid, email, register, activate, resendCode, ...defaultProps} = props;
    const [onLoading, setOnLoading] = useState(false);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const registerInitial = {
        username: "",
        email: "",
        password: "",
        re_password: "",
        date_of_birth: "",
        gender: 'Male',
        race: ""
    };
    const [registerData, setRegisterData] = useState(registerInitial);
    const onRegisterChange = obj => {
        setRegisterData(prevData => {
            let updatedData = {...prevData};
            Object.keys(obj).forEach(key => {
                updatedData[key] = obj[key];
            });
            return updatedData;
        });
    };
    const [validatedE, setValidatedE] = useState(true);
    const [validatedP, setValidatedP] = useState(true);
    const [validatedRP, setValidatedRP] = useState(true);
    const [validatedDOB, setValidatedDOB] = useState(true);
    const [validatedR, setValidatedR] = useState(true);
    const today = new Date();
    const isValid = () => {
        let _validatedE, _validatedP, _validatedRP, _validatedDOB, _validatedR;
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(registerData.email)) {
            setValidatedE(true)
            _validatedE = true;
        } else {
            setValidatedE(false)
            _validatedE = false;
        }
        if (/^(?=.*?[a-zA-Zа-яА-Я])(?=.*?\d)(?=.*?[\W_]).{6,}$/.test(registerData.password)) {
            setValidatedP(true)
            _validatedP = true;
        } else {
            setValidatedP(false)
            _validatedP = false;
        }
        if (registerData.password === registerData.re_password) {
            setValidatedRP(true)
            _validatedRP = true;
        } else {
            setValidatedRP(false)
            _validatedRP = false;
        }
        if (registerData.date_of_birth !== '') {
            const dob = new Date(registerData.date_of_birth);
            const df = today.getFullYear() - dob.getFullYear();
            if (df < 100 && df > 14) {
                setValidatedDOB(true)
                _validatedDOB = true;
            } else {
                setValidatedDOB(false)
                _validatedDOB = false;
            }
        } else {
            setValidatedDOB(false)
            _validatedDOB = false;
        }
        if (registerData.race !== "") {
            setValidatedR(true)
            _validatedR = true
        } else {
            setValidatedR(false)
            _validatedR = false
        }
        return (_validatedE && _validatedP && _validatedRP && _validatedDOB && _validatedR)
    }
    const handleRegister = () => {
        if (isValid()) {
            setOnLoading(true);
            register(registerData).then(result => {
                if (result[0]) {
                    setOnLoading(false);
                    setShowError(false);
                    setError("");
                    setOnActivation(true);
                }
                else {
                    setOnLoading(false);
                    setError(Object.values(result[1].response.data)[0][0]);
                    setShowError(true);
                }
            });
        }
    };

    const [onActivation, setOnActivation] = useState(false);
    const [activationCode, setActivationCode] = useState("");
    useEffect(() => {
        if (uid !== null && email !== null) setOnActivation(true);
    }, []);
    const handleActivate = () => {
        setOnLoading(true);
        activate(uid, activationCode).then(result => {
            if (result[0]) {
                setOnLoading(false);
                setShowSuccess(true);
                defaultProps.onHide();
            }
            else {
                setOnLoading(false);
                setError(Object.values(result[1].response.data)[0][0]);
                setShowError(true);
            }
        });
        setShowSuccess(false);
    };

    const [timer, setTimer] = useState(60);
    const timerRef = useRef(null);
    useEffect(() => {
        if (onActivation) {
            const counter =
                timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(counter);
        }
    }, [timer, onActivation]);

    const handleResendCode = () => {
        resendCode(email).then(result => {
            if (result) setTimer(60);
        })
    };

    const handleOnHide = () => {
        setRegisterData(registerInitial);
        setActivationCode("");
        setError("");
        setShowError(false);
        setShowSuccess(false);
        defaultProps.onHide();
    };

    return (
        <>
            <Modal
                className="registerModal"
                {...defaultProps}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                dialogClassName={onActivation ? ('thin') : ('wide')}
                onHide={handleOnHide}
                keyboard={false}
            >
                <Modal.Header closeButton={!onActivation}>
                    <Modal.Title
                        id="contained-modal-title-vcenter"
                        style={onActivation ? ({marginRight: 'auto', paddingLeft: 0}) : ({
                            marginRight: 0,
                            paddingLeft: '2rem'
                        })}
                    >
                        {onActivation ? (<p>Активация</p>) : (<p>Регистрация</p>)}
                        <div className="modalLine"></div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {onLoading && (
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
                    {onActivation ? (
                        <div ref={timerRef} className="activation">
                            <p>
                                На вашу электронную почту пришло письмо с кодом подтверждения
                                активации. Пожалуйста, проверьте почту, указанную при регистрации,
                                и введите код активации в поле ниже:
                            </p>
                            <div className="d-flex justify-content-center">
                                <Form.Control
                                    type="text"
                                    placeholder="000000"
                                    name="code"
                                    value={activationCode}
                                    onChange={e => {
                                        if (/^\d+$/.test(e.target.value) || e.target.value === "") {
                                            if (e.target.value.length > 6)
                                                setActivationCode(e.target.value.slice(0, -1));
                                            else
                                                setActivationCode(e.target.value);
                                        }
                                    }}
                                    required
                                />
                            </div>
                            <p>
                                Если вам не пришло сообщение с кодом, вы можете отправить его повторно:
                            </p>
                            <Button
                                variant="link"
                                disabled={timer !== 0}
                                onClick={handleResendCode}
                            >
                                Отправить код повторно
                            </Button>
                            <span>{timer} cек.</span>
                        </div>
                    ) : (
                        <Form className="registration">
                            <div>
                                <Form.Group className="mb-3" controlId="formRegisterUsername">
                                    <Form.Label>Имя пользователя</Form.Label>
                                    <Form.Control
                                        type="username"
                                        placeholder="Имя пользователя"
                                        name="username"
                                        value={registerData.username}
                                        onChange={e => onRegisterChange({[e.target.name]: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formRegisterEmail">
                                    <Form.Label>Адрес эл. почты</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Введите E-mail"
                                        name="email"
                                        value={registerData.email}
                                        onChange={e => onRegisterChange({[e.target.name]: e.target.value})}
                                        isInvalid={!validatedE}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">Введите адрес эл. почты
                                        правильно</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formRegisterPassword">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Пароль"
                                        name="password"
                                        minLength={6}
                                        value={registerData.password}
                                        onChange={e => onRegisterChange({[e.target.name]: e.target.value})}
                                        isInvalid={!validatedP}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">Пароль слишком простой</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formRegisterRePassword">
                                    <Form.Label>Повторите пароль</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Пароль"
                                        name="re_password"
                                        minLength={6}
                                        value={registerData.re_password}
                                        onChange={e => onRegisterChange({[e.target.name]: e.target.value})}
                                        isInvalid={!validatedRP}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">Пароли не совпадают</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                            <div>
                                <Form.Group className="mb-3" controlId="formRegisterDateOfBirth">
                                    <Form.Label>Дата рождения</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="date_of_birth"
                                        value={registerData.date_of_birth}
                                        onChange={e => onRegisterChange({[e.target.name]: e.target.value})}
                                        isInvalid={!validatedDOB}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">Выберите дату рождения
                                        правильно</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formRegisterGender">
                                    <Form.Label>Ваш пол</Form.Label>
                                    <div className="d-flex justify-content-around">
                                        <Form.Check
                                            id="formRegisterGenderMale"
                                            type="radio"
                                            label={(<FontAwesomeIcon
                                                icon={faPerson}
                                                style={{fontSize: '3rem', color: '#3B5BDB'}}
                                            />)}
                                            name="Male"
                                            onChange={e => onRegisterChange({"gender": e.target.name})}
                                            checked={registerData.gender === 'Male'}
                                        />
                                        <Form.Check
                                            id="formRegisterGenderFemale"
                                            type="radio"
                                            label={(<FontAwesomeIcon
                                                icon={faPersonDress}
                                                style={{fontSize: '3rem', color: '#F27DA9'}}
                                            />)}
                                            name="Female"
                                            onChange={e => onRegisterChange({"gender": e.target.name})}
                                            checked={registerData.gender === 'Female'}
                                        />
                                    </div>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formRegisterRace">
                                    <Form.Label>Ваша этническая принадлежность</Form.Label>
                                    <Form.Select
                                        name="race"
                                        aria-label="Выберите один вариант"
                                        onChange={e => onRegisterChange({[e.target.name]: e.target.value})}
                                        value={registerData.race}
                                        isInvalid={!validatedR}>
                                        >
                                        <option value="">Выберите один вариант</option>
                                        <option value="European">Европеец</option>
                                        <option value="Asian">Азиат</option>
                                        <option value="African">Африканец</option>
                                        <option value="Indian">Индус</option>
                                        <option value="American">Американец</option>
                                        <option value="Other">Другое</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">Выберите один из
                                        вариантов</Form.Control.Feedback>
                                </Form.Group>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center position-relative">
                    {onLoading && (
                        <div className="loading" />
                    )}
                    {onActivation ? (
                        <Button
                            className="bth-dark-blue"
                            onClick={handleActivate}
                        >
                            Отправить код
                        </Button>
                    ) : (
                        <Button
                            className="bth-dark-blue"
                            // onClick={() => testRegister()}
                            onClick={handleRegister}
                        >
                            Зарегистрироваться
                        </Button>
                    )}

                </Modal.Footer>
            </Modal>
            {showSuccess && (
                <SuccessToast title="Регистрация" body="Вы успешно зарегистрировались" />
            )}
        </>
    );
};

const mapStateProps = state => ({
    uid: state.auth.uid,
    email: state.auth.email
});

export default connect(mapStateProps, {register, activate, resendCode})(RegisterModal);