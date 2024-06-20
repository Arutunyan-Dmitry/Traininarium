import {Button, Form, Modal} from "react-bootstrap";
import React from "react";


const MedCardTwoFormContent = ({ title, hasNext, onClickNext, hasPrev, onClickPrev,
                                 hasSubmit, is_kidney_diseased, is_kidney_disease_chronic,
                                 is_cholesterol, onChange }) => {

    const handleKidney = (obj) => {
        const value = obj[Object.keys(obj)[0]]
        let updatedObj = {};

        if (value !== null && value) {
            updatedObj = obj
        } else {
            updatedObj = {
                ...obj,
                "is_kidney_disease_chronic": false,
            };
        }
        onChange(updatedObj)
    }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <p>{title}</p>
                    <div className="modalLine"></div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="formKidneyDiseased">
                    <Form.Label>Есть ли у вас диагностированные хронические заболевания почек?</Form.Label>
                    <div className="three-choice">
                        <Form.Check
                            id="formKidneyDiseased1_yes"
                            type="radio"
                            name="is_kidney_diseased"
                            label="Да"
                            checked={is_kidney_diseased !== null && is_kidney_diseased}
                            onChange={e => handleKidney({[e.target.name]: e.target.checked})}
                        />
                        <Form.Check
                            id="formKidneyDiseased1_no"
                            type="radio"
                            name="is_kidney_diseased"
                            label="Нет"
                            checked={is_kidney_diseased !== null && !is_kidney_diseased}
                            onChange={e => handleKidney({[e.target.name]: !e.target.checked})}
                        />
                        <Form.Check
                            id="formKidneyDiseased1_dk"
                            type="radio"
                            name="is_kidney_diseased"
                            label="Не знаю"
                            checked={is_kidney_diseased === null}
                            onChange={e => handleKidney({[e.target.name]: null})}
                        />
                    </div>
                </Form.Group>

                <div className={`mb-3 disabled-area ${is_kidney_diseased ? 'enable' : ''}`}>
                    <Form.Group className="mb-3" controlId="formKidneyDiseasedC">
                        <Form.Label> Они выражены в острой или умеренной форме?</Form.Label>
                        <div className="three-choice">
                            <Form.Check
                                id="formKidneyDiseasedC1_yes"
                                type="radio"
                                name="is_kidney_disease_chronic"
                                label="Да"
                                checked={is_kidney_disease_chronic}
                                onChange={e => onChange({[e.target.name]: e.target.checked})}
                                disabled={!is_kidney_diseased}
                            />
                            <Form.Check
                                id="formKidneyDiseasedC1_no"
                                type="radio"
                                name="is_kidney_disease_chronic"
                                label="Нет"
                                checked={!is_kidney_disease_chronic}
                                onChange={e => onChange({[e.target.name]: !e.target.checked})}
                                disabled={!is_kidney_diseased}
                            />
                        </div>
                    </Form.Group>
                </div>

                <Form.Group className="mb-3" controlId="formCholesterol">
                    <Form.Label>Повышен ли ваш общий уровень холестерина? (больше 8ммоль/л)</Form.Label>
                    <div className="three-choice">
                        <Form.Check
                            id="formCholesterol1_yes"
                            type="radio"
                            name="is_cholesterol"
                            label="Да"
                            checked={is_cholesterol !== null && is_cholesterol}
                            onChange={e => onChange({[e.target.name]: e.target.checked})}
                        />
                        <Form.Check
                            id="formCholesterol1_no"
                            type="radio"
                            name="is_cholesterol"
                            label="Нет"
                            checked={is_cholesterol !== null && !is_cholesterol}
                            onChange={e => onChange({[e.target.name]: !e.target.checked})}
                        />
                        <Form.Check
                            id="formCholesterol1_dk"
                            type="radio"
                            name="is_cholesterol"
                            label="Не знаю"
                            checked={is_cholesterol === null}
                            onChange={e => onChange({[e.target.name]: null})}
                        />
                    </div>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <div className="container text-center">
                    <div className="row">
                        <div className="col d-flex">
                            {hasPrev && (<Button className="prev" variant="secondary" onClick={onClickPrev}>Назад</Button>)}
                        </div>
                        <div className="col-6">
                            {hasSubmit && (<Button className="submit" variant="primary" type="submit">Узнать результат!</Button>)}
                        </div>
                        <div className="col d-flex justify-content-end">
                            {hasNext && (<Button className="next" variant="dark" onClick={onClickNext}>Далее</Button>)}
                        </div>
                    </div>
                </div>
            </Modal.Footer>
        </>
    )
};

export default MedCardTwoFormContent;