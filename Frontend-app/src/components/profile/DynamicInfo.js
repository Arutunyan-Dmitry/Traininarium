import React, {useState} from "react";
import {Button, Form} from "react-bootstrap";
import DynamicInfoModal from "./DynamicInfoModal";


const gh = ["Poor", "Fair", "Good", "Very good", "Excellent"]
const labels = ["Очень плохое", "Плохое", "Нормальное", "Хорошее", "Превосходное"];
const colors = ['rgb(154, 205, 50)', 'rgb(255, 215, 0)','rgb(255, 99, 71)', 'rgb(199, 21, 133)', 'rgb(220, 20, 60)'];


const DynamicInfo = ({DI, DIL}) => {
    const dateList = Object.values(DI).map(item => item.created_at).reverse();
    const [data, setData] = useState(DIL);
    const changeDate = (date) => {
        setData(DI.find(item => item.created_at === date));
    }
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <div className="title-container">
                <p className="title">Трекер здоровья</p>
                <p className="label"> данные на:</p>
                <Form.Select onChange={e => changeDate(e.target.value)}>
                    {dateList.map(date => (<option key={date}>{date}</option>))}
                </Form.Select>
                <div className="d-flex justify-content-end" style={{width: '22vw'}}>
                    <Button
                        className="bth-dark-blue-inv addData"
                        onClick={() => setModalShow(true)}
                    >
                        Добавить данные
                    </Button>
                </div>
            </div>
            <div className="body">
                <div className="blank" />
                <li>Уровень риска: <b style={{color: colors[Math.ceil(data.risk_group_kp * 100 / 20) - 1]}}>{(data.risk_group_kp * 100).toFixed(0)}%</b></li>
                <li>Вес: <b>{data.weight} кг.</b></li>
                <li>Время сна: <b>{data.sleep_time} ч.</b></li>
                <li>Повышенное артериальное давление: {data.is_blood_pressure === null ? (
                    <b>Неизвестно</b>) : (data.is_blood_pressure === false ? (<b>Нет</b>) : (<b>Да</b>))}</li>
                <div className="blank" />
                <p className="subtitle">Самочувствие</p>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <li>
                                Периоды физического недомогания: <b>{data.physical_health} дн. </b>
                            </li>
                        </div>
                        <div className="col last">
                            <li>
                                Трудности при ходьбе: {data.is_difficult_to_walk === false ? (<b>Нет</b>) : (<b>Есть</b>)}
                            </li>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <li>
                                Периоды ментального недомогания: <b>{data.mental_health} дн.</b>
                            </li>
                        </div>
                        <div className="col last">
                            <li>
                                Общее самочувствие: <b>{labels[gh.indexOf(data.general_health)]}</b>
                            </li>
                        </div>
                    </div>
                </div>
            </div>

            {/* ----- Modals ------ */}
            <DynamicInfoModal
                DIL={DIL}
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    )
};

export default DynamicInfo;