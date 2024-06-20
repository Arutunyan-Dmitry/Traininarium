import { Button, Form, Modal, InputGroup } from "react-bootstrap";
import React, { useState } from "react";


const InitialFormContent = ({ title, hasNext, onClickNext, hasPrev, onClickPrev,
                              hasSubmit, date_of_birth, gender, race, onChange}) => {

    const [validatedDOB, setValidatedDOB] = useState(true);
    const [validatedR, setValidatedR] = useState(true);
    const today = new Date();
    const isValid = () => {
        let _validatedDOB, _validatedR;
        if(date_of_birth !== '') {
            const dob = new Date(date_of_birth);
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
        if(race !== "") {
            setValidatedR(true)
            _validatedR = true
        } else {
            setValidatedR(false)
            _validatedR = false
        }
        return (_validatedDOB && _validatedR)
    }

    const handleNext = (e) => { if (isValid()) onClickNext(e) };
    const handlePrev = (e) => { if (isValid()) onClickPrev(e) };

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
                    <Form.Group className="date_of_birth mb-3" controlId="formDateOfBirth">
                            <Form.Label>Укажите вашу дату рождения</Form.Label>
                            <Form.Control
                                type="date"
                                name="date_of_birth"
                                value={date_of_birth}
                                onChange={e => onChange({[e.target.name]: e.target.value})}
                                isInvalid={!validatedDOB}
                                required
                            />
                        <Form.Control.Feedback type="invalid">Выберите дату рождения правильно</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="race mb-3" controlId="formRace">
                        <Form.Label>Укажите вашу этническую принадлежность</Form.Label>
                        <Form.Select
                            name="race"
                            aria-label="Выберите один вариант"
                            onChange={e => onChange({[e.target.name]: e.target.value})}
                            value={race}
                            isInvalid={!validatedR}>
                            <option value="">Выберите один вариант</option>
                            <option value="European">Европеец</option>
                            <option value="Asian">Азиат</option>
                            <option value="African">Африканец</option>
                            <option value="Indian">Индус</option>
                            <option value="American">Американец</option>
                            <option value="Other">Другое</option>
                        </Form.Select>
                         <Form.Control.Feedback type="invalid">Выберите один из вариантов</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGender">
                        <Form.Label>Укажите ваш пол</Form.Label>
                        <div className="gender">
                            <Form.Check
                                id="formGender_male"
                                type="radio"
                                label="Мужской"
                                name="Male"
                                onChange={e=>onChange({"gender": e.target.name})}
                                checked={gender === 'Male'}
                            />
                            <Form.Check
                                id="formGender_female"
                                type="radio"
                                label="Женский"
                                name="Female"
                                onChange={e=>onChange({"gender": e.target.name})}
                                checked={gender === 'Female'}
                            />
                        </div>
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
                            {hasSubmit && (<Button className="submit" variant="primary" type="submit">Узнать результат!</Button>)}
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

export default InitialFormContent;