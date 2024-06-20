import {Button, Form, Modal} from "react-bootstrap";
import React from "react";


const PetPeevesFormContent = ({ title, hasNext, onClickNext, hasPrev, onClickPrev,
                                hasSubmit, is_alcoholic, is_smoker, is_physical_activity,
                                onChange }) => (
    <>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                <p>{title}</p>
                <div className="modalLine"></div>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3" controlId="formAlcoholic">
                <Form.Label>Употребляете ли вы алкоголь?</Form.Label>
                <div className="two-choice">
                    <Form.Check
                        id="formAlcoholic1_yes"
                        type="radio"
                        name="is_alcoholic"
                        label="Да"
                        checked={is_alcoholic}
                        onChange={e => onChange({[e.target.name]: e.target.checked})}
                    />
                    <Form.Check
                        id="formAlcoholic1_no"
                        type="radio"
                        name="is_alcoholic"
                        label="Нет"
                        checked={!is_alcoholic}
                        onChange={e => onChange({[e.target.name]: !e.target.checked})}
                    />
                </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSmoker">
                <Form.Label>Вы курите (курили когда либо)?</Form.Label>
                <div className="two-choice">
                    <Form.Check
                        id="formSmoker1_yes"
                        type="radio"
                        name="is_smoker"
                        label="Да"
                        checked={is_smoker}
                        onChange={e => onChange({[e.target.name]: e.target.checked})}
                    />
                    <Form.Check
                        id="formSmoker1_no"
                        type="radio"
                        name="is_smoker"
                        label="Нет"
                        checked={!is_smoker}
                        onChange={e => onChange({[e.target.name]: !e.target.checked})}
                    />
                </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPhysicalActive">
                <Form.Label>Занимаетесь ли вы спортом?</Form.Label>
                <div className="two-choice">
                    <Form.Check
                        id="formPhysicalActive1_yes"
                        type="radio"
                        name="is_physical_activity"
                        label="Да"
                        checked={is_physical_activity}
                        onChange={e => onChange({[e.target.name]: e.target.checked})}
                    />
                    <Form.Check
                        id="formPhysicalActive1_no"
                        type="radio"
                        name="is_physical_activity"
                        label="Нет"
                        checked={!is_physical_activity}
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

export default PetPeevesFormContent;