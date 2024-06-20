import React, {useState} from "react";
import {Button, Form, InputGroup, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import {connect} from "react-redux";

import {changeStaticInfo} from "../../actions/health";

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


const StaticInfoModal = (props) => {
    const {SI, changeStaticInfo, ...defaultProps} = props;
    const [formData, setFormData] = useState(SI);
    const onChange = obj => {
        setFormData(prevFormData => {
            let updatedFormData = {...prevFormData};
            Object.keys(obj).forEach(key => {
                updatedFormData[key] = obj[key];
            });
            return updatedFormData;
        });
    };
    const handleDiabetic = (obj) => {
        const value = obj[Object.keys(obj)[0]];
        let updatedObj;
        if (value !== null && value) updatedObj = obj;
        else {
            setValidatedD(true);
            updatedObj = { ...obj, "is_diabetic_with_diseases": false, "diabetic_period": 0};
        }
        onChange(updatedObj);
    }
    const handleKidney = (obj) => {
        const value = obj[Object.keys(obj)[0]];
        let updatedObj;
        if (value !== null && value) updatedObj = obj;
        else {
            updatedObj = {...obj, "is_kidney_disease_chronic": false,};
        }
        onChange(updatedObj);
    }

    const [validatedH, setValidatedH] = useState(true);
    const [validatedD, setValidatedD] = useState(true);
    const isValid = () => {
        let _validatedH, _validatedD;
        if(formData.height > 40 && formData.height < 270) {
            setValidatedH(true);
            _validatedH = true;
        } else {
            setValidatedH(false);
            _validatedH = false;
        }
        if (formData.is_diabetic)
            if (formData.diabetic_period >= 0 && formData.diabetic_period <= 100) {
                setValidatedD(true);
                _validatedD = true;
            } else {
                setValidatedD(false);
                _validatedD = false;
            }
        else _validatedD = true;
        return _validatedD && _validatedH;
    }

    const onSubmit = e => {
        e.preventDefault();
        if (isValid()) {
            changeStaticInfo(formData).then(result => {
                if(result[0]) window.location.reload();
            });
        }
    };
    const handleModalShow = () => {
        setFormData(SI);
    };

    return (
        <Modal
            {...defaultProps}
            className="staticInfoModal"
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
                        <p>Медицинская карта</p>
                        <div className="modalLine"></div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup hasValidation>
                        <p className="subtitle">Физические данные</p>
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <Form.Group className="controlFormContent" controlId="formHeight">
                                        <Form.Label><b>1.</b> Рост: </Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="height"
                                            style={{width: '15vw', textAlign: 'end'}}
                                            value={formData.height}
                                            onChange={e => onChange({[e.target.name]: e.target.value})}
                                            isInvalid={!validatedH}
                                        />
                                        <Form.Label style={{marginLeft: '0.2rem'}}> см.</Form.Label>
                                    </Form.Group>
                                </div>
                                <div className="col last">
                                    <Form.Group className="radioFormContent" controlId="formSportsman">
                                        <Form.Label><b>2.</b> Спортсмен: </Form.Label>
                                        <Form.Check
                                            id="formSportsman_yes"
                                            type="radio"
                                            name="is_physical_activity"
                                            label="Да"
                                            checked={formData.is_physical_activity}
                                            onChange={e => onChange({[e.target.name]: e.target.checked})}
                                        />
                                        <Form.Check
                                            id="formSportsman_no"
                                            type="radio"
                                            name="is_physical_activity"
                                            label="Нет"
                                            checked={!formData.is_physical_activity}
                                            onChange={e => onChange({[e.target.name]: !e.target.checked})}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </div>
                        <p className="subtitle">Здоровье</p>
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <Form.Group controlId="formHeartDiseased">
                                        <Form.Label><b>1.</b> Наличие сердечно-сосудистых заболеваний:</Form.Label>
                                        <div className="radioFormContent">
                                            <Form.Check
                                                id="formHeartDiseased_yes"
                                                type="radio"
                                                name="is_heart_diseased"
                                                label="Да"
                                                checked={formData.is_heart_diseased !== null && formData.is_heart_diseased}
                                                onChange={e => onChange({[e.target.name]: e.target.checked})}
                                            />
                                            <Form.Check
                                                id="formHeartDiseased_no"
                                                type="radio"
                                                name="is_heart_diseased"
                                                label="Нет"
                                                checked={formData.is_heart_diseased !== null && !formData.is_heart_diseased}
                                                onChange={e => onChange({[e.target.name]: !e.target.checked})}
                                            />
                                            <Form.Check
                                                id="formHeartDiseased_dk"
                                                type="radio"
                                                name="is_heart_diseased"
                                                label="Не знаю"
                                                checked={formData.is_heart_diseased === null}
                                                onChange={e => onChange({[e.target.name]: null})}
                                            />
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="col last">
                                    <Form.Group controlId="formKidneyDiseased">
                                        <Form.Label><b>2.</b> Наличие хронических заболеваний почек:</Form.Label>
                                        <div className="radioFormContent">
                                            <Form.Check
                                                id="formKidneyDiseased_yes"
                                                type="radio"
                                                name="is_kidney_diseased"
                                                label="Да"
                                                checked={formData.is_kidney_diseased !== null && formData.is_kidney_diseased}
                                                onChange={e => handleKidney({[e.target.name]: e.target.checked})}
                                            />
                                            <Form.Check
                                                id="formKidneyDiseased_no"
                                                type="radio"
                                                name="is_kidney_diseased"
                                                label="Нет"
                                                checked={formData.is_kidney_diseased !== null && !formData.is_kidney_diseased}
                                                onChange={e => handleKidney({[e.target.name]: !e.target.checked})}
                                            />
                                            <Form.Check
                                                id="formKidneyDiseased_dk"
                                                type="radio"
                                                name="is_kidney_diseased"
                                                label="Не знаю"
                                                checked={formData.is_kidney_diseased === null}
                                                onChange={e => handleKidney({[e.target.name]: null})}
                                            />
                                        </div>
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <Form.Group className="" controlId="formDiabetic">
                                        <Form.Label><b>3.</b> Наличие сахарного диабета:</Form.Label>
                                        <div className="radioFormContent">
                                            <Form.Check
                                                id="formDiabetic_yes"
                                                type="radio"
                                                name="is_diabetic"
                                                label="Да"
                                                checked={formData.is_diabetic !== null && formData.is_diabetic}
                                                onChange={e => handleDiabetic({[e.target.name]: e.target.checked})}
                                            />
                                            <Form.Check
                                                id="formDiabetic_no"
                                                type="radio"
                                                name="is_diabetic"
                                                label="Нет"
                                                checked={formData.is_diabetic !== null && !formData.is_diabetic}
                                                onChange={e => handleDiabetic({[e.target.name]: !e.target.checked})}
                                            />
                                            <Form.Check
                                                id="formDiabetic_dk"
                                                type="radio"
                                                name="is_diabetic"
                                                label="Не знаю"
                                                checked={formData.is_diabetic === null}
                                                onChange={e => handleDiabetic({[e.target.name]: null})}
                                            />
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="col last">
                                    <div
                                        className={`mb-1 disabled-area ${formData.is_kidney_diseased ? 'enable' : ''}`}>
                                        <Form.Group className="" controlId="formKidneyDiseasedChronoc">
                                            <Form.Label><b>2.1.</b> В острой форме:</Form.Label>
                                            <div className="radioFormContent">
                                                <Form.Check
                                                    id="formKidneyDiseasedChronoc_yes"
                                                    type="radio"
                                                    name="is_kidney_disease_chronic"
                                                    label="Да"
                                                    checked={formData.is_kidney_diseased ? !formData.is_kidney_disease_chronic : false}
                                                    onChange={e => onChange({[e.target.name]: e.target.checked})}
                                                    disabled={!formData.is_kidney_diseased}
                                                />
                                                <Form.Check
                                                    id="formKidneyDiseasedChronoc_no"
                                                    type="radio"
                                                    name="is_kidney_disease_chronic"
                                                    label="Нет"
                                                    checked={formData.is_kidney_diseased ? !formData.is_kidney_disease_chronic : true}
                                                    onChange={e => onChange({[e.target.name]: !e.target.checked})}
                                                    disabled={!formData.is_kidney_diseased}
                                                />
                                            </div>
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className={`mb-1 disabled-area ${formData.is_diabetic ? 'enable' : ''}`}>
                                        <Form.Group className="" controlId="formDiabeticP">
                                            <Form.Label><b>3.1.</b> Продолжительность диабета:</Form.Label>
                                            <div className="controlFormContent">
                                                <Form.Control
                                                    type="number"
                                                    name="diabetic_period"
                                                    style={{textAlign: 'end'}}
                                                    value={formData.is_diabetic ? formData.diabetic_period : 0}
                                                    onChange={e => onChange({[e.target.name]: e.target.value})}
                                                    disabled={!formData.is_diabetic}
                                                    isInvalid={!validatedD}
                                                />
                                                <Form.Label style={{marginLeft: '0.4rem'}}> лет.</Form.Label>
                                            </div>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="col last">
                                    <Form.Group className="" controlId="formCholesterol">
                                        <Form.Label><b>4.</b> Повышенный уровень холестерина:</Form.Label>
                                        <div className="radioFormContent">
                                            <Form.Check
                                                id="formCholesterol_yes"
                                                type="radio"
                                                name="is_cholesterol"
                                                label="Да"
                                                checked={formData.is_cholesterol !== null && formData.is_cholesterol}
                                                onChange={e => onChange({[e.target.name]: e.target.checked})}
                                            />
                                            <Form.Check
                                                id="formCholesterol_no"
                                                type="radio"
                                                name="is_cholesterol"
                                                label="Нет"
                                                checked={formData.is_cholesterol !== null && !formData.is_cholesterol}
                                                onChange={e => onChange({[e.target.name]: !e.target.checked})}
                                            />
                                            <Form.Check
                                                id="formCholesterol_dk"
                                                type="radio"
                                                name="is_cholesterol"
                                                label="Не знаю"
                                                checked={formData.is_cholesterol === null}
                                                onChange={e => onChange({[e.target.name]: null})}
                                            />
                                        </div>
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className={`mb-1 disabled-area ${formData.is_diabetic ? 'enable' : ''}`}>
                                        <Form.Group controlId="formDiabeticD">
                                            <Form.Label>
                                                <b>3.2.</b> Диабет с поражением
                                                {formData.is_diabetic ? (
                                                    <OverlayTrigger
                                                        placement="right"
                                                        delay={{show: 250, hide: 400}}
                                                        overlay={renderTooltip}
                                                    >
                                                        <span className="hdTrigger"> органов-мишеней:</span>
                                                    </OverlayTrigger>
                                                ) : (' органов-мишеней:')}
                                            </Form.Label>
                                            <div className="radioFormContent">
                                                <Form.Check
                                                    id="formDiabeticD_yes"
                                                    type="radio"
                                                    name="is_diabetic_with_diseases"
                                                    label="Да"
                                                    checked={formData.is_diabetic ? formData.is_diabetic_with_diseases : false}
                                                    onChange={e => onChange({[e.target.name]: e.target.checked})}
                                                    disabled={!formData.is_diabetic}
                                                />
                                                <Form.Check
                                                    id="formDiabeticD_no"
                                                    type="radio"
                                                    name="is_diabetic_with_diseases"
                                                    label="Нет"
                                                    checked={formData.is_diabetic ? !formData.is_diabetic_with_diseases : true}
                                                    onChange={e => onChange({[e.target.name]: !e.target.checked})}
                                                    disabled={!formData.is_diabetic}
                                                />
                                            </div>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="col last">
                                    <Form.Group className="" controlId="formStroked">
                                        <Form.Label><b>5.</b> Преодоление инсульта:</Form.Label>
                                        <div className="radioFormContent">
                                            <Form.Check
                                                id="formStroked_yes"
                                                type="radio"
                                                name="is_stroked"
                                                label="Да"
                                                checked={formData.is_stroked !== null && formData.is_stroked}
                                                onChange={e => onChange({[e.target.name]: e.target.checked})}
                                            />
                                            <Form.Check
                                                id="formStroked_no"
                                                type="radio"
                                                name="is_stroked"
                                                label="Нет"
                                                checked={formData.is_stroked !== null && !formData.is_stroked}
                                                onChange={e => onChange({[e.target.name]: !e.target.checked})}
                                            />
                                            <Form.Check
                                                id="formStroked_dk"
                                                type="radio"
                                                name="is_stroked"
                                                label="Не знаю"
                                                checked={formData.is_stroked === null}
                                                onChange={e => onChange({[e.target.name]: null})}
                                            />
                                        </div>
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <Form.Group className="" controlId="formAsthmatic">
                                        <Form.Label><b>6.</b> Наличие астмы: </Form.Label>
                                        <div className="radioFormContent">
                                            <Form.Check
                                                id="formAsthmatic_yes"
                                                type="radio"
                                                name="is_asthmatic"
                                                label="Да"
                                                checked={formData.is_asthmatic}
                                                onChange={e => onChange({[e.target.name]: e.target.checked})}
                                            />
                                            <Form.Check
                                                id="formAsthmatic_no"
                                                type="radio"
                                                name="is_asthmatic"
                                                label="Нет"
                                                checked={!formData.is_asthmatic}
                                                onChange={e => onChange({[e.target.name]: !e.target.checked})}
                                            />
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="col last">
                                    <Form.Group className="" controlId="formSkinCancer">
                                        <Form.Label><b>7.</b> Наличие рака кожи: </Form.Label>
                                        <div className="radioFormContent">
                                            <Form.Check
                                                id="formSkinCancer_yes"
                                                type="radio"
                                                name="is_skin_cancer"
                                                label="Да"
                                                checked={formData.is_skin_cancer}
                                                onChange={e => onChange({[e.target.name]: e.target.checked})}
                                            />
                                            <Form.Check
                                                id="formSkinCancer_no"
                                                type="radio"
                                                name="is_skin_cancer"
                                                label="Нет"
                                                checked={!formData.is_skin_cancer}
                                                onChange={e => onChange({[e.target.name]: !e.target.checked})}
                                            />
                                        </div>
                                    </Form.Group>
                                </div>
                            </div>
                        </div>
                        <p className="subtitle">Привычки</p>
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <Form.Group className="" controlId="formSmoke">
                                        <Form.Label><b>1.</b> Курение: </Form.Label>
                                        <div className="radioFormContent">
                                            <Form.Check
                                                id="formSmoke_yes"
                                                type="radio"
                                                name="is_smoker"
                                                label="Да"
                                                checked={formData.is_smoker}
                                                onChange={e => onChange({[e.target.name]: e.target.checked})}
                                            />
                                            <Form.Check
                                                id="formSmoke_no"
                                                type="radio"
                                                name="is_smoker"
                                                label="Нет"
                                                checked={!formData.is_smoker}
                                                onChange={e => onChange({[e.target.name]: !e.target.checked})}
                                            />
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="col last">
                                    <Form.Group className="" controlId="formAlcoholic">
                                        <Form.Label><b>2.</b> Употребление алкоголя: </Form.Label>
                                        <div className="radioFormContent">
                                            <Form.Check
                                                id="formAlcoholic_yes"
                                                type="radio"
                                                name="is_alcoholic"
                                                label="Да"
                                                checked={formData.is_alcoholic}
                                                onChange={e => onChange({[e.target.name]: e.target.checked})}
                                            />
                                            <Form.Check
                                                id="formAlcoholic_no"
                                                type="radio"
                                                name="is_alcoholic"
                                                label="Нет"
                                                checked={!formData.is_alcoholic}
                                                onChange={e => onChange({[e.target.name]: !e.target.checked})}
                                            />
                                        </div>
                                    </Form.Group>
                                </div>
                            </div>
                        </div>
                    </InputGroup>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button
                        onClick={e => onSubmit(e)}
                        className="bth-pink"
                    >
                        Изменить данные
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
export default connect(null, {changeStaticInfo})(StaticInfoModal);