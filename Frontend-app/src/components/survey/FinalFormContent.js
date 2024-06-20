import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFaceSadCry, faFaceFrown, faFaceMeh, faFaceSmile, faFaceLaughBeam } from '@fortawesome/free-regular-svg-icons';

library.add(faFaceSadCry, faFaceFrown, faFaceMeh, faFaceSmile, faFaceLaughBeam);

const FinalFormContent = ({ title, hasNext, onClickNext, hasPrev, onClickPrev,
                            hasSubmit, physical_health, mental_health,
                            general_health, onChange,
                            isPhysical, isMental, onHelper }) => {

    const handlePhysical = (obj) => {
        const value = obj[Object.keys(obj)[0]]
        if(!value) {
            setValidatedP(true);
            onChange({"physical_health": 0});
        }
        onHelper(obj);
    };
    const handleMental = (obj) => {
        const value = obj[Object.keys(obj)[0]]
        if(!value) {
            setValidatedM(true);
            onChange({"mental_health": 0});
        }
        onHelper(obj);
    };

    const [validatedP, setValidatedP] = useState(true);
    const [validatedM, setValidatedM] = useState(true);

    const isValid = () => {
        let _validatedP, _validatedM;
        if (isPhysical) {
            if(physical_health > 0 && physical_health <= 30) {
                setValidatedP(true)
                _validatedP = true;
            } else {
                setValidatedP(false)
                _validatedP = false;
            }
        } else {
            setValidatedP(true)
            _validatedP = true;
        }
        if (isMental) {
            if(mental_health > 0 && mental_health <= 30) {
                setValidatedM(true)
                _validatedM = true;
            } else {
                setValidatedM(false)
                _validatedM = false;
            }
        } else {
            setValidatedM(true)
            _validatedM = true;
        }
        return (_validatedP && _validatedM)
    }
    const handleNext = (e) => { if (isValid()) onClickNext(e) };
    const handlePrev = (e) => { if (isValid()) onClickPrev(e) };
    const handleSubmit = (e) => { if (!isValid()) e.preventDefault() };

    const options = ["Poor", "Fair", "Good", "Very good", "Excellent"];
    const lang_options = ["Очень плохое", "Плохое", "Нормальное", "Хорошее", "Превосходное"];
    const ui_options = [faFaceSadCry, faFaceFrown, faFaceMeh, faFaceSmile, faFaceLaughBeam];

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <p>{title}</p>
                    <div className="modalLine"></div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup hasValidation>
                    <Form.Group className="mb-2" controlId="formPhysicalHealthChoice">
                        <Form.Label>Получали ли вы какие-либо травмы за последний месяц?</Form.Label>
                        <div className="three-choice">
                            <Form.Check
                                id="formPhysicalHealthChoice_yes"
                                name="isPhysical"
                                type="radio"
                                label="Да"
                                checked={isPhysical}
                                onChange={e => handlePhysical({[e.target.name]: e.target.checked})}
                            />
                            <Form.Check
                                id="formPhysicalHealthChoice_no"
                                name="isPhysical"
                                type="radio"
                                label="Нет"
                                checked={!isPhysical}
                                onChange={e => handlePhysical({[e.target.name]: !e.target.checked})}
                            />
                        </div>
                    </Form.Group>

                    <div className={`mb-2 disabled-area-phys ${isPhysical ? 'enable' : ''}`}>
                    <Form.Group controlId="formPhysicalHealth">
                        <div className="d-flex">
                            <Form.Label className="align-self-center flex-grow-1 mb-0">Сколько дней это длилось?</Form.Label>
                            <div className="ms-2">
                                <Form.Control
                                    className="physical-health-input"
                                    type="number"
                                    name="physical_health"
                                    value={physical_health}
                                    onChange={e => onChange({[e.target.name]: e.target.value})}
                                    disabled={!isPhysical}
                                    isInvalid={!validatedP}
                                />
                                <Form.Control.Feedback type="invalid">Укажите кол-во дней</Form.Control.Feedback>
                            </div>
                        </div>
                    </Form.Group>
                     </div>

                    <Form.Group className="mb-2" controlId="formMentalHealthChoice">
                        <Form.Label>Были ли у вас проблемы с ментальным самочувствием за последний месяц?</Form.Label>
                        <div className="three-choice">
                            <Form.Check
                                id="formMentalHealthChoice_yes"
                                name="isMental"
                                type="radio"
                                label="Да"
                                checked={isMental}
                                onChange={e => handleMental({[e.target.name]: e.target.checked})}
                            />
                            <Form.Check
                                id="formMentalHealthChoice_no"
                                name="isMental"
                                type="radio"
                                label="Нет"
                                checked={!isMental}
                                onChange={e => handleMental({[e.target.name]: !e.target.checked})}
                            />
                        </div>
                    </Form.Group>

                    <div className={`mb-3 disabled-area-ment ${isMental ? 'enable' : ''}`}>
                        <Form.Group controlId="formMentalHealth">
                            <div className="d-flex">
                                <Form.Label className="align-self-center flex-grow-1 mb-0">Сколько дней это длилось?</Form.Label>
                                <div className="ms-2">
                                    <Form.Control
                                        className="mental-health-input"
                                        type="number"
                                        name="mental_health"
                                        value={mental_health}
                                        onChange={e => onChange({[e.target.name]: e.target.value})}
                                        disabled={!isMental}
                                        isInvalid={!validatedM}
                                    />
                                    <Form.Control.Feedback type="invalid">Укажите кол-во дней</Form.Control.Feedback>
                                </div>
                            </div>
                        </Form.Group>
                    </div>

                    <Form.Group className="mb-2" controlId="formGeneralHealth">
                        <Form.Label> Как бы вы оценили свое самочувствие в целом?</Form.Label>
                            <Form.Range
                                className="general-health-input"
                                name="general_health"
                                min={0}
                                max={options.length - 1}
                                value={options.indexOf(general_health)}
                                onChange={e => onChange({[e.target.name] : options[e.target.value]})}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                {ui_options.map((option, index) => (
                                    <FontAwesomeIcon className="general-health-icons" key={index} icon={option} />
                                ))}
                            </div>
                            <span className="general-health-label">Вы выбрали: {lang_options[options.indexOf(general_health)]}</span>
                    </Form.Group>
                </InputGroup>
            </Modal.Body>
            <Modal.Footer>
                <div className="container text-center">
                    <div className="row">
                        <div className="col d-flex">
                            {hasPrev && (<Button className="prev" variant="secondary" onClick={handlePrev}>Назад</Button>)}
                        </div>
                        <div className="col-6">
                            {hasSubmit && (<Button className="submit" variant="primary" type="submit" onClick={handleSubmit}>Узнать результат!</Button>)}
                        </div>
                        <div className="col d-flex justify-content-end">
                            {hasNext && (<Button className="next" variant="dark" onClick={handleNext}>Далее</Button>)}
                        </div>
                    </div>
                </div>
            </Modal.Footer>
        </>
    )
};

export default FinalFormContent;