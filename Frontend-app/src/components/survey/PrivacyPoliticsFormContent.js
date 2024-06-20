import {Button, Form, Modal} from "react-bootstrap";
import React from "react";


const PrivacyPoliticsFormContent = ({ title, hasNext, onClickNext, hasPrev, onClickPrev,
                                      hasSubmit, is_using_data_agreed, onChange }) => (
    <>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                <p>{title}</p>
                <div className="modalLine"></div>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>
                Согласны ли вы предоставлять свои данные опроса для дальнейшего
                обучения системы с целью улучшения её работы?
            </p>
            <Form.Group className="is_using_data_agreed mb-3" controlId="formPrivacyPolitics">
                <Form.Check
                    name="is_using_data_agreed"
                    checked={is_using_data_agreed}
                    onChange={e => onChange({[e.target.name]: e.target.checked})}
                />
                <Form.Label>Я даю согласие на обработку своих данных</Form.Label>
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

export default PrivacyPoliticsFormContent;