import {Button, Form, Modal} from "react-bootstrap";
import React from "react";


const MedCardThreeFormContent = ({ title, hasNext, onClickNext, hasPrev, onClickPrev,
                                   hasSubmit, is_blood_pressure, is_asthmatic,
                                   is_skin_cancer, onChange, is_difficult_to_walk }) => (
    <>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                <p>{title}</p>
                <div className="modalLine"></div>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3" controlId="formBloodPressure">
                <Form.Label>
                    Страдаете ли вы от повышенного давления?
                    (повышенное - в среднем 180 / 100 или больше)
                </Form.Label>
                <div className="three-choice">
                    <Form.Check
                        id="formBloodPressure1_yes"
                        type="radio"
                        name="is_blood_pressure"
                        label="Да"
                        checked={is_blood_pressure !== null && is_blood_pressure}
                        onChange={e => onChange({[e.target.name]: e.target.checked})}
                    />
                    <Form.Check
                        id="formBloodPressure1_no"
                        type="radio"
                        name="is_blood_pressure"
                        label="Нет"
                        checked={is_blood_pressure !== null && !is_blood_pressure}
                        onChange={e => onChange({[e.target.name]: !e.target.checked})}
                    />
                    <Form.Check
                        id="formBloodPressure1_dk"
                        type="radio"
                        name="is_blood_pressure"
                        label="Не знаю"
                        checked={is_blood_pressure === null}
                        onChange={e => onChange({[e.target.name]: null})}
                    />
                </div>
            </Form.Group>



            <Form.Group className="mb-3" controlId="formAsthmatic">
                <Form.Label> У вас есть астма?</Form.Label>
                <div className="three-choice">
                    <Form.Check
                        id="formAsthmatic1_yes"
                        type="radio"
                        name="is_asthmatic"
                        label="Да"
                        checked={is_asthmatic}
                        onChange={e => onChange({[e.target.name]: e.target.checked})}
                    />
                    <Form.Check
                        id="formAsthmatic1_no"
                        type="radio"
                        name="is_asthmatic"
                        label="Нет"
                        checked={!is_asthmatic}
                        onChange={e => onChange({[e.target.name]: !e.target.checked})}
                    />
                </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSkinCancer">
                <Form.Label> Вы страдаете от рака кожи?</Form.Label>
                <div className="three-choice">
                    <Form.Check
                        id="formSkinCancer1_yes"
                        type="radio"
                        name="is_skin_cancer"
                        label="Да"
                        checked={is_skin_cancer}
                        onChange={e => onChange({[e.target.name]: e.target.checked})}
                    />
                    <Form.Check
                        id="formSkinCancer1_no"
                        type="radio"
                        name="is_skin_cancer"
                        label="Нет"
                        checked={!is_skin_cancer}
                        onChange={e => onChange({[e.target.name]: !e.target.checked})}
                    />
                </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDiffWalking">
                <Form.Label> Испытываете ли вы трудности при ходьбе?</Form.Label>
                <div className="three-choice">
                    <Form.Check
                        id="formDiffWalking1_yes"
                        type="radio"
                        name="is_difficult_to_walk"
                        label="Да"
                        checked={is_difficult_to_walk}
                        onChange={e => onChange({[e.target.name]: e.target.checked})}
                    />
                    <Form.Check
                        id="formDiffWalking1_no"
                        type="radio"
                        name="is_difficult_to_walk"
                        label="Нет"
                        checked={!is_difficult_to_walk}
                        onChange={e => onChange({[e.target.name]: !e.target.checked})}
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
);

export default MedCardThreeFormContent;