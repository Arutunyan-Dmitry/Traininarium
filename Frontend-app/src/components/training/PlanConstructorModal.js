import React, {useState} from "react";
import {Alert, Button, Form, InputGroup, Modal, Spinner} from "react-bootstrap";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from '@fortawesome/fontawesome-svg-core';
import {faArrowUpFromBracket, faTrash, faXmark} from '@fortawesome/free-solid-svg-icons';

import {createPlan, fillPlan, getExercises, deletePlan} from "../../actions/fitness";
import {bolt} from "../../containers/pages/Training";


library.add(faArrowUpFromBracket, faTrash, faXmark);


const PlanConstructorModal = (props) => {
    const {createPlan, getExercises, fillPlan, deletePlan, ...defaultProps} = props;
    const [plane, setPlane] = useState(1);
    const initPlanData = {
        name: "",
        picture: null,
        intensity: "",
        training_amount: 0,
        equipment: ""
    }
    const [planData, setPlanData] = useState(initPlanData);
    const planChange = obj => {
        setPlanData(prevFormData => {
            let updatedFormData = {...prevFormData};
            Object.keys(obj).forEach(key => {
                updatedFormData[key] = obj[key];
            });
            return updatedFormData;
        });
    };
    const [validatedN, setValidatedN] = useState(true);
    const [validatedI, setValidatedI] = useState(true);
    const [validatedT, setValidatedT] = useState(true);
    const planValidation = () => {
        let _validatedN, _validatedI, _validatedT;
        if (planData.name.length <= 255 && planData.name !== "") {
            setValidatedN(true);
            _validatedN = true;
        } else {
            setValidatedN(false);
            _validatedN = false;
        }
        if (planData.intensity !== "") {
            setValidatedI(true);
            _validatedI = true;
        } else {
            setValidatedI(false);
            _validatedI = false;
        }
        if (planData.training_amount >= 10 && planData.training_amount <= 30) {
            setValidatedT(true);
            _validatedT = true;
        } else {
            setValidatedT(false);
            _validatedT = false;
        }
        return _validatedI && _validatedN && _validatedT;
    };
    const [slug, setSlug] = useState("");
    const [image, setImage] = useState("");
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState("");
    const planSubmit = (e) => {
        e.preventDefault();
        if (planValidation()) {
            createPlan(planData).then(result => {
                if (result[0]) {
                    try {
                        setSlug(result[1]["slug"]);
                        setImage(result[1]["picture"]);
                        setPlane(2);
                    } catch (err) {
                        setError(err);
                        setShowError(true);
                    }
                }
                if (!result[0]) {
                    setError(result[1].request.response.match(/[а-яё]+/gi).join(' '))
                    setShowError(true);
                }
            });
        }
    };
    const handleErrorClose = () => {
        setError("");
        setShowError(false);
    };

    const [exercises, setExercises] = useState(null);
    const [f_exercises, setF_exercises] = useState(null);
    const handleShow = () => {
        getExercises().then(result => {
            if (result[0]) {
                setExercises(result[1]);
                setF_exercises(result[1]);
            }
            if (!result[0]) defaultProps.onHide();
        });
    };
    const searchExercise = (text) => {
        setF_exercises(Object.fromEntries(
            Object.entries(exercises)
                .filter(([key, value]) => value.name
                    .toLowerCase()
                    .includes(text.toLowerCase()))
        ));
    };

    const [trainingExercises, setTrainingExercises] = useState([]);
    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        const slug = e.dataTransfer.getData('text/plain');
        const foundExercise = exercises.find(exercise => exercise.slug === slug);
        if (foundExercise) {
            setTrainingExercises(prevExercises => ([...prevExercises, foundExercise]));
        }
    };
    const delTrainingExercise = (key) => {
        const updatedExercises = [...trainingExercises];
        updatedExercises.splice(key, 1);
        setTrainingExercises(updatedExercises);
    }

    const [creation, setCreation] = useState(false);
    const handleFillPlan = (e) => {
        const e_slugs = trainingExercises.map(exercise => exercise.slug);
        setCreation(true);
        fillPlan(slug, e_slugs).then(result => {
            if (result[0]) {
                setTimeout(() => {
                    setCreation(false);
                    window.location.reload();
                }, 600);
            }
            if (!result[0]) {
                setCreation(false);
                setError(result[1].request.response.match(/[а-яё]+/gi).join(' '));
                setShowError(true);
            }
        });
    };

    const onModalClose = () => {
        if (slug !== "") {
            deletePlan(slug).then(result => {
                if (result[0]) {
                    defaultProps.onHide();
                    window.location.reload();
                }
            });
        } else defaultProps.onHide();
    }

    return (
        <Modal
            {...defaultProps}
            className="planConstructorModal"
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            backdrop="static"
            onShow={handleShow}
            onHide={onModalClose}
            keyboard={false}
        >
            <Alert
                className="errorAlert"
                show={showError}
                variant="danger"
                onClose={() => {
                    handleErrorClose();
                }}
                dismissible
            >
                <b>Ошибка: </b>{error}
            </Alert>
            <Modal.Header closeButton>
                <Modal.Title>Конструктор плана тренировок</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={`creation-loading ${creation ? ('show') : ("")}`}>
                    <div>
                        <p>План тренировок создаётся...</p>
                        <Spinner animation="border" variant="primary" />
                        <p>Страница будет перезагружена</p>
                    </div>
                </div>
                {plane === 1 ? (<>
                    <Form noValidate onSubmit={e => planSubmit(e)}>
                        <div className="background">
                            <InputGroup className="picture" hasValidation>
                                <Form.Group controlId="formPicture">
                                    <p className="mb-2" style={{textAlign: "center"}}>Изображение</p>
                                    <Form.Label className="icon mb-2">
                                        {planData.picture === null ? (
                                            <FontAwesomeIcon icon={faArrowUpFromBracket}/>) : ('Загружено')}
                                    </Form.Label>
                                    <Form.Control
                                        style={{display: "none"}}
                                        type="file"
                                        accept=".jpg, .png"
                                        name="picture"
                                        onChange={e => {
                                            if (e.target.files.length > 0) planChange({[e.target.name]: e.target.files[0]});
                                            else planChange({[e.target.name]: null});
                                        }}
                                    />
                                </Form.Group>
                                {planData.picture !== null && (
                                    <div className="picture-show"
                                         style={{backgroundImage: `url(${URL.createObjectURL(planData.picture)})`}}>
                                        <Button
                                            variant="danger"
                                            style={{fontSize: "0.7rem"}}
                                            onClick={() => planChange({"picture": null})}
                                        ><FontAwesomeIcon icon={faTrash}/></Button>
                                    </div>
                                )}
                            </InputGroup>
                            <InputGroup className="content" hasValidation>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>Название плана<b style={{color: "red"}}> *</b></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={planData.name}
                                        onChange={e => planChange({[e.target.name]: e.target.value})}
                                        isInvalid={!validatedN}
                                    />
                                    <Form.Control.Feedback type="invalid">Введите название плана
                                        правильно</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formIntensity">
                                    <Form.Label>Интенсивность плана тренировок<b
                                        style={{color: "red"}}> *</b></Form.Label>
                                    <Form.Select
                                        name="intensity"
                                        value={planData.intensity}
                                        onChange={e => planChange({[e.target.name]: e.target.value})}
                                        isInvalid={!validatedI}
                                    >
                                        <option value="">Не выбрано</option>
                                        <option value="Low">Низкая</option>
                                        <option value="Medium">Средняя</option>
                                        <option value="High">Высокая</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">Выберите один из
                                        вариантов</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="training-amount" controlId="formTrainingAmount">
                                    <Form.Label>Количество тренировок в плане: <b
                                        style={{color: "red"}}> *</b></Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="training_amount"
                                        value={planData.training_amount}
                                        onChange={e => planChange({[e.target.name]: e.target.value})}
                                        isInvalid={!validatedT}
                                    />
                                </Form.Group>
                                <h6 className="training-amount-placeholder">От 10 до 30</h6>
                                <Form.Group className="mb-3" controlId="formEquipment">
                                    <Form.Label>Инвентарь</Form.Label>
                                    <Form.Control
                                        style={{maxHeight: '100px', resize: 'vertical'}}
                                        as="textarea"
                                        rows={3}
                                        aria-valuemax={5}
                                        name="equipment"
                                        placeholder="Необходимый инвентарь для тренировок плана..."
                                        value={planData.equipment}
                                        onChange={e => planChange({[e.target.name]: e.target.value})}
                                    />
                                </Form.Group>
                                <Button
                                    className="bth-dark-blue"
                                    type="submit"
                                >Далее</Button>
                            </InputGroup>
                        </div>
                    </Form>
                </>) : (<>
                    <div className="container">
                        <div className="row">
                            <div className="col left-plane">
                                <img src={image} alt=""/>
                                <h2>{planData.name}</h2>
                                <p>Интенсивность: {bolt(planData.intensity)}</p>
                                <p>Кол-во тренировок: {planData.training_amount}</p>
                            </div>
                            <div className="col central-plane">
                                <div
                                    className="constructor"
                                    onDrop={handleDrop}
                                    onDragOver={e => e.preventDefault()}
                                >
                                    <div className="start">
                                        Начало тренировки
                                    </div>
                                    {Object.entries(trainingExercises).map(([key, value]) => (
                                        <div key={key} className="training-exercise">
                                            <div className="ex-number"><h1>{parseInt(key, 10) + 1}</h1></div>
                                            <div className="exercise">
                                                <img src={value.picture} alt=""/>
                                                <div>
                                                    <h1><b>Название: </b>{value.name}</h1>
                                                    {value.amount !== null ? (
                                                        <p><b>Кол-во подходов: </b>{value.amount} раз</p>
                                                    ) : (
                                                        <p><b>Время выполнения: </b>{value.time} сек.</p>
                                                    )}
                                                    <p><b>Отдых: </b>{value.rest_time} сек.</p>
                                                </div>
                                                <Button
                                                    className="del-exercise"
                                                    variant="danger"
                                                    onClick={() => {
                                                        delTrainingExercise(key)
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faXmark}/>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="end">
                                        Конец тренировки
                                    </div>
                                </div>
                                <p>
                                    * Перетащите сюда упражнения в необходимом для желаемой тренировки
                                    порядке из списка правее
                                </p>
                                <div className="add-exercises">
                                    <Button
                                        className="bth-pink"
                                        style={{boxShadow: '3px 3px 2px rgba(0, 0, 0, 0.3)'}}
                                        onClick={handleFillPlan}>Создать план</Button>
                                </div>
                            </div>
                            <div className="col right-plane">
                                <Form.Group className="exerciseSearch" controlId="formSearch">
                                    <Form.Control
                                        type="text"
                                        name="search"
                                        placeholder="Поиск..."
                                        onChange={e => searchExercise(e.target.value)}
                                    />
                                </Form.Group>
                                <div className="exerciseList">
                                    {f_exercises !== null && (<>
                                        {Object.entries(f_exercises).map(([key, value]) => (
                                            <div
                                                id={value.slug}
                                                key={key}
                                                className="exerciseList-item"
                                                draggable
                                                onDragStart={handleDragStart}
                                            >
                                                <img draggable={false} src={value.picture} alt=""/>
                                                <p>{value.name}</p>
                                            </div>
                                        ))}
                                    </>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </>)}
            </Modal.Body>
        </Modal>
    );
};
export default connect(null, {createPlan, getExercises, fillPlan, deletePlan})(PlanConstructorModal);