import { Modal, Spinner, Alert, Placeholder } from "react-bootstrap";
import React, {useEffect, useState} from "react";

const ResultFormContent = ({ result, error }) => {
    const [animationStyles, setAnimationStyles] = useState(null);
    const [count, setCount] = useState(0);
    const [riskLabel, setRiskLabel] = useState({
        style: null,
        label: ''
    });

    useEffect(() => {
        const colorScheme = [[154, 205, 50], [255, 215, 0], [255, 99, 71], [199, 21, 133], [220, 20, 60]];
        const labelScheme = ['Низкой', 'Умеренной', 'Высокой', 'Очень высокой', 'Самой высокой'];
        if (result !== '') {
            const percent = result["risk_group_kp"] * 100;
            const timeset = 5000 / percent;
            const colorN = Math.ceil((percent / 20));
            let colors;

            switch (colorN) {
                case 1: colors = new Array(5).fill(colorScheme[0]); break;
                case 2:
                    colors = new Array(5).fill(null).map((item, index) => {
                        if (index < 2) return colorScheme[0];
                        else return colorScheme[1];
                    });
                    break;
                case 3:
                    colors = new Array(5).fill(null).map((item, index) => {
                        if (index === 0) return colorScheme[0];
                        else if(index < 3) return colorScheme[1];
                        else return colorScheme[2];
                    });
                    break;
                case 4:
                    colors = new Array(5).fill(null).map((item, index) => {
                        if (index === 0) return colorScheme[0];
                        else if(index === 1) return colorScheme[1];
                        else if(index === 2) return colorScheme[2];
                        else return colorScheme[3];
                    });
                    break;
                default:
                    colors = colorScheme;
            }

            setAnimationStyles({
                '--target-value': percent + '%',
                '--target-color-1': colors[0],
                '--target-color-2': colors[1],
                '--target-color-3': colors[2],
                '--target-color-4': colors[3],
                '--target-color-5': colors[4],
            });

            if (count < percent) {
                setTimeout(() => setCount(count + 1), timeset);
            }

            setRiskLabel({
                style: {color: `rgb(${colorScheme[colorN - 1]})`},
                label: labelScheme[colorN - 1]
            });
        }
    }, [result, count]);

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <p>Ваши результаты</p>
                    <div className={`modalLine ${error === '' ? '' : 'error'}` }></div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {result === '' && error === '' ? (<>
                    <div className="loading">
                        <Spinner animation="grow" variant="primary"/>
                        <Spinner animation="grow" variant="primary"/>
                        <Spinner animation="grow" variant="primary"/>
                    </div>
                </>) : (<>
                    {error !== '' ? (<>
                        <p>{error.toString()}</p>
                    </>) : (<>
                        <div className="result-container p-3 mb-3" style={animationStyles}>
                            {result["verified"] ? (
                                <Alert className={`risk-verify success ${count >= (result["risk_group_kp"] * 100) ? 'visible' : ''}`} variant="success">
                                    Проблем с точностью вычислений не найдено <span style={{color: 'green'}}>&#10004;</span>
                                </Alert>
                            ) : (<>
                                <Alert className={`risk-verify error ${count >= (result["risk_group_kp"] * 100) ? 'visible' : ''}`} variant="danger">
                                    Возникли проблемы с точностью вычислений <span>&#10060;</span>
                                </Alert>
                            </>)}
                            <div className="scale" style={animationStyles}>
                                <div className={`result-number ${count >= (result["risk_group_kp"] * 100) ? 'show' : ''}`}>{count}%</div>
                            </div>
                            <div className="dynamic-axe-x" style={animationStyles}>
                                <div className="risk-counter">{count}</div>
                            </div>
                            <div className="axe-x"></div>
                            <div className="axe-y"></div>
                            {count < (result["risk_group_kp"] * 100) && (
                                <Placeholder className="risk-loading-sm" as="p" animation="wave">
                                    <Placeholder xs={12} />
                                </Placeholder>
                            )}
                        </div>
                        {!result["verified"] && (
                            <div className={`verify-explain mb-3 ${count >= (result["risk_group_kp"] * 100) ? 'show' : ''}`}>
                                Похоже, что вы слишком часто выбирали в ответах вариант
                                <b> "Не знаю"</b>. Пройдите опрос ещё раз.
                            </div>
                        )}
                        <div className={`result-explain ${count >= (result["risk_group_kp"] * 100) ? 'show' : ''}`}>
                            Вы прошли опрос и получили результат! Вероятность развития у вас
                            заболеваний сердечно-сосудистого характера или возникновения
                            других ситуаций, представляющих опасность вашему здоровью, при
                            неконтролируемой физической активности - <b>{count}%</b>.
                            Это соответствует <span style={riskLabel["style"]}><b>{riskLabel["label"]}</b></span> группе риска.
                        </div>
                        {result["verified"] && (
                            <p className={`result-title ${count >= (result["risk_group_kp"] * 100) ? 'show' : ''}`}>Traininarium</p>
                        )}
                        {count < (result["risk_group_kp"] * 100) && (
                            <Placeholder className="risk-loading-lg" as="p" animation="wave">
                                <Placeholder xs={12} />
                            </Placeholder>
                        )}
                    </>)}
                </>)}
            </Modal.Body>
        </>
    )
};

export default ResultFormContent;
