import React, {useState} from "react";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {connect} from "react-redux";

import {addDynamicInfo} from "../../actions/health";
import {faFaceFrown, faFaceLaughBeam, faFaceMeh, faFaceSadCry, faFaceSmile} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const options = ["Poor", "Fair", "Good", "Very good", "Excellent"];
const lang_options = ["Очень плохое", "Плохое", "Нормальное", "Хорошее", "Превосходное"];
const ui_options = [faFaceSadCry, faFaceFrown, faFaceMeh, faFaceSmile, faFaceLaughBeam];


const DynamicInfoModal = (props) => {
    const {DIL, addDynamicInfo, ...defaultProps} = props;
    const [formData, setFormData] = useState(DIL);
    const onChange = obj => {
        setFormData(prevFormData => {
            let updatedFormData = {...prevFormData};
            Object.keys(obj).forEach(key => {
                updatedFormData[key] = obj[key];
            });
            return updatedFormData;
        });
    };

    const [validatedP, setValidatedP] = useState(true);
    const [validatedM, setValidatedM] = useState(true);
    const [validatedW, setValidatedW] = useState(true);
    const [validatedS, setValidatedS] = useState(true);
    const isValid = () => {
        let _validatedP, _validatedM, _validatedW, _validatedS;
        if (formData.physical_health >= 0 && formData.physical_health <= 30) {
            setValidatedP(true);
            _validatedP = true;
        } else {
            setValidatedP(false);
            _validatedP = false;
        }
        if (formData.mental_health >= 0 && formData.mental_health <= 30) {
            setValidatedM(true);
            _validatedM = true;
        } else {
            setValidatedM(false);
            _validatedM = false;
        }
        if (formData.weight > 10 && formData.weight < 400) {
            setValidatedW(true)
            _validatedW = true;
        } else {
            setValidatedW(false)
            _validatedW = false;
        }
        if (formData.sleep_time >= 0 && formData.sleep_time <= 24) {
            setValidatedS(true)
            _validatedS = true;
        } else {
            setValidatedS(false)
            _validatedS = false;
        }
        return _validatedP && _validatedM && _validatedW && _validatedS;
    }

    const onSubmit = e => {
        e.preventDefault();
        if (isValid()) {
            addDynamicInfo(formData).then(result => {
                if(result[0]) window.location.reload();
            });
        }
    };
    const handleModalShow = () => {
        setFormData(DIL);
    };

    return (
        <Modal
            {...defaultProps}
            className="dynamicInfoModal"
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            keyboard={false}
            onShow={handleModalShow}
        >
            <Form noValidate onSubmit={e => onSubmit(e)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <p>Трекер здоровья</p>
                        <div className="modalLine"></div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup hasValidation>
                        <Form.Group className="controlFormContent mt-2" controlId="formWeight">
                            <Form.Label><b>1.</b> Вес: </Form.Label>
                            <Form.Control
                                type="number"
                                step="0.1"
                                name="weight"
                                style={{width: '18vw', textAlign: 'end', marginLeft: 'auto'}}
                                value={parseFloat(formData.weight).toFixed(1)}
                                onChange={e => onChange({[e.target.name]: e.target.value})}
                                isInvalid={!validatedW}
                            />
                            <Form.Label style={{marginLeft: '0.2rem'}}> кг.</Form.Label>
                        </Form.Group>
                        <Form.Group className="controlFormContent mt-2" controlId="formSleep">
                            <Form.Label><b>2.</b> Время сна: </Form.Label>
                            <Form.Control
                                type="number"
                                name="sleep_time"
                                style={{width: '18vw', textAlign: 'end', marginLeft: 'auto'}}
                                value={formData.sleep_time}
                                onChange={e => onChange({[e.target.name]: e.target.value})}
                                isInvalid={!validatedS}
                            />
                            <Form.Label style={{marginLeft: '0.7rem'}}> ч.</Form.Label>
                        </Form.Group>
                        <Form.Group className="d-flex mt-3" controlId="formAD">
                            <Form.Label><b>3.</b> Повышенное артериальное давление:</Form.Label>
                            <div className="radioFormContent" style={{marginLeft: 'auto'}}>
                                <Form.Check
                                    id="formAD_yes"
                                    type="radio"
                                    name="is_blood_pressure"
                                    label="Да"
                                    checked={formData.is_blood_pressure !== null && formData.is_blood_pressure}
                                    onChange={e => onChange({[e.target.name]: e.target.checked})}
                                />
                                <Form.Check
                                    id="formAD_no"
                                    type="radio"
                                    name="is_blood_pressure"
                                    label="Нет"
                                    checked={formData.is_blood_pressure !== null && !formData.is_blood_pressure}
                                    onChange={e => onChange({[e.target.name]: !e.target.checked})}
                                />
                                <Form.Check
                                    id="formAD_dk"
                                    type="radio"
                                    name="is_blood_pressure"
                                    label="Не знаю"
                                    checked={formData.is_blood_pressure === null}
                                    onChange={e => onChange({[e.target.name]: null})}
                                />
                            </div>
                        </Form.Group>
                        <p className="subtitle">Самочувствие</p>
                        <Form.Group className="d-flex mt-3" controlId="formDiffWalking">
                            <Form.Label><b>4.</b> Трудности при ходьбе:</Form.Label>
                            <div className="radioFormContent" style={{marginLeft: 'auto'}}>
                                <Form.Check
                                    id="formDiffWalking_yes"
                                    type="radio"
                                    name="is_difficult_to_walk"
                                    label="Да"
                                    checked={formData.is_difficult_to_walk}
                                    onChange={e => onChange({[e.target.name]: e.target.checked})}
                                />
                                <Form.Check
                                    id="formDiffWalking_no"
                                    type="radio"
                                    name="is_difficult_to_walk"
                                    label="Нет"
                                    checked={!formData.is_difficult_to_walk}
                                    onChange={e => onChange({[e.target.name]: !e.target.checked})}
                                />
                            </div>
                        </Form.Group>
                        <Form.Group className="controlFormContent mt-2" controlId="formPH">
                            <Form.Label><b>5.</b> Периоды физического недомогания: </Form.Label>
                            <Form.Control
                                type="number"
                                name="physical_health"
                                style={{width: '18vw', textAlign: 'end', marginLeft: 'auto'}}
                                value={formData.physical_health}
                                onChange={e => onChange({[e.target.name]: e.target.value})}
                                isInvalid={!validatedP}
                            />
                            <Form.Label style={{marginLeft: '0.2rem'}}> дн.</Form.Label>
                        </Form.Group>
                        <Form.Group className="controlFormContent mt-2" controlId="formMH">
                            <Form.Label><b>6.</b> Периоды ментального недомогания: </Form.Label>
                            <Form.Control
                                type="number"
                                name="mental_health"
                                style={{width: '18vw', textAlign: 'end', marginLeft: 'auto'}}
                                value={formData.mental_health}
                                onChange={e => onChange({[e.target.name]: e.target.value})}
                                isInvalid={!validatedM}
                            />
                            <Form.Label style={{marginLeft: '0.2rem'}}> дн.</Form.Label>
                        </Form.Group>
                        <Form.Group className="mb-2 mt-2" controlId="formGeneralHealth">
                        <Form.Label><b>7.</b> Общее самочувствие:</Form.Label>
                            <Form.Range
                                className="general-health-input"
                                name="general_health"
                                min={0}
                                max={options.length - 1}
                                value={options.indexOf(formData.general_health)}
                                onChange={e => onChange({[e.target.name] : options[e.target.value]})}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                {ui_options.map((option, index) => (
                                    <FontAwesomeIcon className="general-health-icons" key={index} icon={option} />
                                ))}
                            </div>
                            <span className="general-health-label">Вы выбрали: {lang_options[options.indexOf(formData.general_health)]}</span>
                    </Form.Group>
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button
                        onClick={e => onSubmit(e)}
                        className="bth-pink"
                    >
                        Добавить данные
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
export default connect(null, {addDynamicInfo})(DynamicInfoModal);