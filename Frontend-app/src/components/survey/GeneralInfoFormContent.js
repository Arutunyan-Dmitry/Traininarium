import {Button, Form, Modal, InputGroup} from "react-bootstrap";
import React, {useState} from "react";


const GeneralInfoFormContent = ({ title, hasNext, onClickNext, hasPrev, onClickPrev,
                                  hasSubmit, height, weight, sleep_time, onChange}) => {

    const [validatedH, setValidatedH] = useState(true);
    const [validatedW, setValidatedW] = useState(true);
    const [validatedS, setValidatedS] = useState(true);
    const isValid = () => {
        let _validatedH, _validatedW, _validatedS;
        if(height > 40 && height < 270) {
            setValidatedH(true)
            _validatedH = true;
        } else {
            setValidatedH(false)
            _validatedH = false;
        }
        if(weight > 10 && weight < 400) {
            setValidatedW(true)
            _validatedW = true;
        } else {
            setValidatedW(false)
            _validatedW = false;
        }
        if(sleep_time >= 0 && sleep_time <= 24) {
            setValidatedS(true)
            _validatedS = true;
        } else {
            setValidatedS(false)
            _validatedS = false;
        }
        return (_validatedH && _validatedW && _validatedS)
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
                    <Form.Group className="mb-3" controlId="formHeight">
                        <Form.Label>Укажите ваш рост</Form.Label>
                        <Form.Control
                            type="number"
                            name="height"
                            value={height}
                            onChange={e => onChange({[e.target.name]: e.target.value})}
                            isInvalid={!validatedH}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Укажите рост правильно</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formWeight">
                        <Form.Label>Укажите ваш вес</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.1"
                            name="weight"
                            value={parseFloat(weight).toFixed(1)}
                            onChange={e => onChange({[e.target.name]: e.target.value})}
                            isInvalid={!validatedW}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Укажите вес правильно</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formWeight">
                        <Form.Label>Укажите, сколько часов в среднем вы спите в сутки </Form.Label>
                        <Form.Control
                            type="number"
                            name="sleep_time"
                            value={sleep_time}
                            onChange={e => onChange({[e.target.name]: e.target.value})}
                            isInvalid={!validatedS}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Укажите время сна правильно</Form.Control.Feedback>
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

export default GeneralInfoFormContent;