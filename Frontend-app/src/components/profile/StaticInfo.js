import React, {useState} from "react";
import {Button} from "react-bootstrap";
import StaticInfoModal from "./StaticInfoModal";


const StaticInfo = ({SI}) => {
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <div className="title-container">
                <p className="title">Медицинская карта</p>
                <p className="title-upd"> изм. {SI.updated_at}</p>
                <div className="d-flex justify-content-end" style={{width: '29vw'}}>
                    <Button
                        onClick={() => setModalShow(true)}
                        className="bth-dark-blue-inv changeData"
                    >
                        Изменить данные
                    </Button>
                </div>
            </div>
            <div className="body">
                <p className="subtitle">Физические данные</p>
                <div className="container physical">
                    <div className="row">
                        <div className="col">
                            <li>
                                Рост: <b>{SI.height} см.</b>
                            </li>
                        </div>
                        <div className="col last">
                            <li>
                                Спортсмен: {SI.is_physical_activity === false ? (<b>Нет</b>) : (<b>Да</b>)}
                            </li>
                        </div>
                    </div>
                </div>
                <p className="subtitle">Здоровье</p>
                <div className="container health">
                    <div className="row">
                        <div className="col">
                            <li>
                                Наличие сердечно-сосудистых заболеваний: {SI.is_heart_diseased === null ? (
                                <b>Неизвестно</b>) : (SI.is_heart_diseased === false ? (<b>Нет</b>) : (<b>Да</b>))}
                            </li>
                        </div>
                        <div className="col last">
                            <li>
                                Наличие хронических заболеваний почек: {SI.is_kidney_diseased === null ? (
                                <b>Неизвестно</b>) : (SI.is_kidney_diseased === false ? (<b>Нет</b>) : (<b>Да</b>))}
                            </li>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <li>
                                Наличие сахарного диабета: {SI.is_diabetic === null ? (
                                <b>Неизвестно</b>) : (SI.is_diabetic === false ? (<b>Нет</b>) : (<b>Да</b>))}
                            </li>
                        </div>
                        <div className="col last">
                            {SI.is_kidney_diseased === true ? (
                                <li className="ms-2 enabled">
                                    В острой форме: {SI.is_kidney_disease_chronic === false ? (<b>Нет</b>) : (<b>Да</b>)}
                                </li>
                            ) : (
                                <li className="ms-2 disabled">
                                    В острой форме: <b>Нет</b>
                                </li>
                            )}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            {SI.is_diabetic === true ? (
                                <li className="ms-2 enabled">
                                    Продолжительность диабета: <b>{SI.diabetic_period} лет</b>
                                </li>
                            ) : (
                                <li className="ms-2 disabled">
                                    Продолжительность диабета: <b>0 лет</b>
                                </li>
                            )}
                        </div>
                        <div className="col last">
                            <li>
                                Повышенный уровень холестерина: {SI.is_cholesterol === null ? (
                                <b>Неизвестно</b>) : (SI.is_cholesterol === false ? (<b>Нет</b>) : (<b>Да</b>))}
                            </li>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            {SI.is_diabetic === true ? (
                                <li className="ms-2 enabled">
                                    Диабет с поражением органов-мишеней: {SI.is_diabetic_with_diseases === false ? (<b>Нет</b>) : (<b>Да</b>)}
                                </li>
                            ) : (
                                <li className="ms-2 disabled">
                                    Диабет с поражением органов-мишеней: <b>Нет</b>
                                </li>
                            )}
                        </div>
                        <div className="col last">
                            <li>
                                Преодоление инсульта: {SI.is_stroked === null ? (
                                <b>Неизвестно</b>) : (SI.is_stroked === false ? (<b>Нет</b>) : (<b>Да</b>))}
                            </li>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <li>
                                Наличие астмы: {SI.is_asthmatic === false ? (<b>Нет</b>) : (<b>Да</b>)}
                            </li>
                        </div>
                        <div className="col last">
                            <li>
                                Наличие рака кожи: {SI.is_skin_cancer === false ? (<b>Нет</b>) : (<b>Да</b>)}
                            </li>
                        </div>
                    </div>
                </div>
                <p className="subtitle">Привычки</p>
                <div className="container physical">
                    <div className="row">
                        <div className="col">
                            <li>
                                Курение: {SI.is_smoker === false ? (<b>Нет</b>) : (<b>Да</b>)}
                            </li>
                        </div>
                        <div className="col last">
                            <li>
                                Употребление алкоголя: {SI.is_alcoholic === false ? (<b>Нет</b>) : (<b>Да</b>)}
                            </li>
                        </div>
                    </div>
                </div>
            </div>

            {/* ----- Modals ------ */}
            <StaticInfoModal
                SI={SI}
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    )
};

export default StaticInfo;