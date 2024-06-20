import {Button, Form, InputGroup, Modal, Tooltip, OverlayTrigger} from "react-bootstrap";
import React, {useState} from "react";


const MedCardOneFormContent = ({
                                   title, hasNext, onClickNext, hasPrev, onClickPrev,
                                   hasSubmit, is_heart_diseased, is_stroked,
                                   is_diabetic, is_diabetic_with_diseases,
                                   diabetic_period, onChange
                               }) => {

    const [validated, setValidated] = useState(true);
    const isValid = () => {
        if (is_diabetic)
            if (diabetic_period >= 0 && diabetic_period <= 100) {
                setValidated(true)
                return true;
            } else {
                setValidated(false)
                return false;
            }
        else
            return true;
    }

    const handleDiabetic = (obj) => {
        const value = obj[Object.keys(obj)[0]]
        let updatedObj = {};

        if (value !== null && value) {
            updatedObj = obj
        } else {
            setValidated(true)
            updatedObj = {
                ...obj,
                "is_diabetic_with_diseases": false,
                "diabetic_period": 0
            };
        }
        onChange(updatedObj)
    }
    const renderTooltip = (props) => (
        <Tooltip
            className="hdTooltip"
            id="hd-tooltip"
            {...props}
        >
            <ul>
                <li>Ретинопатия</li>
                <li>Глаукома</li>
                <li>Катаракта</li>
                <li>Нефропатия</li>
                <li>ХПН</li>
                <li>ТИА</li>
                <li>Стенокардия</li>
                <li>ИМ</li>
                <li>ХСН</li>
                <li>Периферическая нейропатия</li>
                <li>Поражение сосудов</li>
            </ul>
        </Tooltip>
    );
    const handleNext = (e) => {
        if (isValid()) onClickNext(e)
    };
    const handlePrev = (e) => {
        if (isValid()) onClickPrev(e)
    };

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
                    <Form.Group className="mb-3" controlId="formHeartDiseased">
                        <Form.Label>Есть ли у вас диагностированные сердечно-сосудистые заболевания?</Form.Label>
                        <div className="three-choice">
                            <Form.Check
                                id="formHeartDiseased1_yes"
                                type="radio"
                                name="is_heart_diseased"
                                label="Да"
                                checked={is_heart_diseased !== null && is_heart_diseased}
                                onChange={e => onChange({[e.target.name]: e.target.checked})}
                            />
                            <Form.Check
                                id="formHeartDiseased1_no"
                                type="radio"
                                name="is_heart_diseased"
                                label="Нет"
                                checked={is_heart_diseased !== null && !is_heart_diseased}
                                onChange={e => onChange({[e.target.name]: !e.target.checked})}
                            />
                            <Form.Check
                                id="formHeartDiseased1_dk"
                                type="radio"
                                name="is_heart_diseased"
                                label="Не знаю"
                                checked={is_heart_diseased === null}
                                onChange={e => onChange({[e.target.name]: null})}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formStroked">
                        <Form.Label>Был ли у вас инсульт?</Form.Label>
                        <div className="three-choice">
                            <Form.Check
                                id="formStroked1_yes"
                                type="radio"
                                name="is_stroked"
                                label="Да"
                                checked={is_stroked !== null && is_stroked}
                                onChange={e => onChange({[e.target.name]: e.target.checked})}
                            />
                            <Form.Check
                                id="formStroked1_no"
                                type="radio"
                                name="is_stroked"
                                label="Нет"
                                checked={is_stroked !== null && !is_stroked}
                                onChange={e => onChange({[e.target.name]: !e.target.checked})}
                            />
                            <Form.Check
                                id="formStroked1_dk"
                                type="radio"
                                name="is_stroked"
                                label="Не знаю"
                                checked={is_stroked === null}
                                onChange={e => onChange({[e.target.name]: null})}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-2" controlId="formDiabetic">
                        <Form.Label>Есть ли у вас сахарный диабет?</Form.Label>
                        <div className="three-choice">
                            <Form.Check
                                id="formDiabetic1_yes"
                                type="radio"
                                name="is_diabetic"
                                label="Да"
                                checked={is_diabetic !== null && is_diabetic}
                                onChange={e => handleDiabetic({[e.target.name]: e.target.checked})}
                            />
                            <Form.Check
                                id="formDiabetic1_no"
                                type="radio"
                                name="is_diabetic"
                                label="Нет"
                                checked={is_diabetic !== null && !is_diabetic}
                                onChange={e => handleDiabetic({[e.target.name]: !e.target.checked})}
                            />
                            <Form.Check
                                id="formDiabetic1_dk"
                                type="radio"
                                name="is_diabetic"
                                label="Не знаю"
                                checked={is_diabetic === null}
                                onChange={e => handleDiabetic({[e.target.name]: null})}
                            />
                        </div>
                    </Form.Group>

                    <div className={`mb-1 disabled-area ${is_diabetic ? 'enable' : ''}`}>
                        <Form.Group controlId="formDiabeticD">
                            <Form.Label>
                                Есть ли у вас диагностированные заболевания из
                                {is_diabetic ? (
                                    <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip}
                                    >
                                        <span className="hdTrigger"> данного списка?</span>
                                    </OverlayTrigger>
                                ) : (' данного списка?')}
                            </Form.Label>
                            <div className="three-choice">
                                <Form.Check
                                    id="formDiabeticD1_yes"
                                    type="radio"
                                    name="is_diabetic_with_diseases"
                                    label="Да"
                                    checked={is_diabetic ? is_diabetic_with_diseases : false}
                                    onChange={e => onChange(is_diabetic && {[e.target.name]: e.target.checked})}
                                    disabled={!is_diabetic}
                                />
                                <Form.Check
                                    id="formDiabeticD1_no"
                                    type="radio"
                                    name="is_diabetic_with_diseases"
                                    label="Нет"
                                    checked={is_diabetic ? !is_diabetic_with_diseases : true}
                                    onChange={e => onChange({[e.target.name]: !e.target.checked})}
                                    disabled={!is_diabetic}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-2" controlId="formDiabeticP">
                            <Form.Label> Укажите продолжительность вашего сахарного диабета</Form.Label>
                            <Form.Control
                                type="number"
                                name="diabetic_period"
                                value={is_diabetic ? diabetic_period : 0}
                                onChange={e => onChange({[e.target.name]: e.target.value})}
                                disabled={!is_diabetic}
                                isInvalid={!validated}
                            />
                            <Form.Control.Feedback type="invalid">Введите число лет правильно</Form.Control.Feedback>
                        </Form.Group>
                    </div>
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

export default MedCardOneFormContent;