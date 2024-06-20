import React, {useState} from "react";
import {Button, Form, ProgressBar, Modal, Spinner} from "react-bootstrap";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from '@fortawesome/fontawesome-svg-core';
import {faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';

import {deletePlan, getPlanExercises, getTrainingPerformances} from "../../actions/fitness";
import {bolt} from "../../containers/pages/Training";

library.add(faTriangleExclamation);


const PlanModal = (props) => {
    const {data, getPlanExercises, getTrainingPerformances, deletePlan, ...defaultProps} = props;
    const [loading, setLoading] = useState(true);
    const [planExercises, setPlanExercises] = useState(null);
    const [trainingPerformances, setTrainingPerformances] = useState(null);
    const handleShow = () => {
        if (data !== null) {
            getPlanExercises(data.slug).then(result => {
                if (result[0]) {
                    setPlanExercises(result[1]);
                    if (data.follow) {
                        getTrainingPerformances(data.slug).then(res => {
                            if (result[0]) setTrainingPerformances(res[1]);
                            else defaultProps.onHide();
                        })
                    }
                }
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            });
        } else {
            defaultProps.onHide();
        }
    };
    const handleHide = () => {
        setPlanExercises(null);
        setTrainingPerformances(null);
        setLoading(true);
        defaultProps.onHide();
    };

    const handleDelete = (slug) => {
        deletePlan(slug).then(result => {
            if (result[0]) window.location.reload();
        });
    };

    return (
        <Modal
            {...defaultProps}
            className="planModal"
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            keyboard={false}
            onShow={handleShow}
            onHide={handleHide}
        >
            <Form noValidate>
                <Modal.Header style={{backgroundImage: `url(${data !== null && (data.picture)})`}} closeButton>
                    <div className="background"/>
                    <Modal.Title>
                        {data !== null ? (<>
                            <h1>{data.name}</h1>
                            <p>Интенсивность: <b>{bolt(data.intensity)}</b></p>
                            <p>Кол-во тренировок: <b>{data.training_amount}</b></p>
                            <p>Инвентарь: <b>{data.equipment === "" ? ("не требуется") : (data.equipment)}</b></p>
                        </>) : ("Loading...")}
                    </Modal.Title>
                    {data !== null && (<>
                        {!data.follow && data.my && (
                            <Button
                                variant="danger"
                                className="delete-plan"
                                onClick={() => handleDelete(data.slug)}
                            >
                                Удалить план
                            </Button>
                        )}
                    </>)}
                </Modal.Header>
                <Modal.Body>
                    {loading && (
                        <div className="plan-detail-loading">
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="primary" />
                            <Spinner animation="grow" variant="primary" />
                        </div>
                    )}
                    {data !== null && (<>
                        {trainingPerformances !== null && (<>
                            <p className="performance-header">Прохождение плана</p>
                            <ProgressBar now={trainingPerformances.length} max={data.training_amount}/>
                            <p className="performance-label">{trainingPerformances.length} тренировок
                                из {data.training_amount}</p>
                        </>)}
                        {planExercises !== null && (<>
                            <p
                                className="exercise-header"
                                style={trainingPerformances !== null ? ({marginTop: '1rem'}) : ({marginTop: 0})}
                            >
                                Программа тренировки плана
                            </p>
                            <div
                                className="exercise-container"
                                style={trainingPerformances !== null ? ({height: '32vh'}) : ({height: '45vh'})}
                            >
                                {planExercises.map((exercise, index) => (
                                    <div key={index} className="exercise">
                                        <div className="number">
                                            <p>{index + 1}</p>
                                        </div>
                                        <div className="image">
                                            <img src={exercise.picture} alt=""/>
                                        </div>
                                        <div className="name">
                                            <p>{exercise.name}</p>
                                        </div>
                                        <div className="amount-time">
                                            {exercise.amount === null ? (
                                                <p>Время выполнения: <b>{exercise.time} сек.</b></p>
                                            ) : (
                                                <p>Кол-во подходов: <b>{exercise.amount} раз</b></p>
                                            )}
                                        </div>
                                        <div className="rest-time">
                                            <p>Отдых: <b>{exercise.rest_time} сек.</b></p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>)}
                        {planExercises === null && data.my && (<>
                            <h1><FontAwesomeIcon icon={faTriangleExclamation}/></h1>
                            <p>
                                Кажется, данный план был создан некорректно,
                                теперь его не получится отследить или пройти :(
                            </p>
                            <p>
                                Мы рекомендуем вам удалить данный план тренировок
                                и создать его заново.
                            </p>
                        </>)}
                    </>)}
                </Modal.Body>
                <Modal.Footer>
                    <p className="plan-mobile">
                        <b>*</b> Отслеживать планы и проходить в них тренировки вы можете в
                        нашем <i>мобильном приложении</i>
                    </p>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
export default connect(null, {getPlanExercises, getTrainingPerformances, deletePlan})(PlanModal);