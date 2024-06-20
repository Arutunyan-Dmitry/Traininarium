import React from "react";
import {faArrowRight, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {Line} from 'react-chartjs-2';

library.add(faArrowRight, faArrowLeft);


const colorScheme = [[154, 205, 50], [255, 215, 0], [255, 99, 71], [199, 21, 133], [220, 20, 60]];
const labelScheme = ['Низкая', 'Умеренная', 'Высокая', 'Очень высокая', 'Самая высокая'];


const countRisk = (data) => {
    const uniqueDates = {};
    const riskByDate = [];
    data.forEach(item => {
        const date = item.created_at.split(' ')[0];
        uniqueDates[date] = {date, risk_group_kp: (item.risk_group_kp * 100).toFixed(0)};
    });
    riskByDate.push(...Object.values(uniqueDates));
    if (riskByDate.length > 7) {
        return riskByDate.slice(-7);
    }
    return riskByDate;
};


const RiskChart = ({title, onClickNext, DI}) => {
    const cData = countRisk(Object.values(DI).map(obj => ({
        created_at: obj.created_at,
        risk_group_kp: obj.risk_group_kp
    })));
    const riskGroupColor = (value) => {
        return colorScheme[Math.ceil((value / 20)) - 1];
    };

    const data = {
        labels: Object.values(cData).map(item => item.date),
        datasets: [
            {
                label: 'My Dataset',
                data: Object.values(cData).map(item => item.risk_group_kp),
                fill: true,
                segment: {
                    borderColor: ctx => `rgba(${riskGroupColor(ctx.p0.parsed.y)}, 1)`,
                    backgroundColor: ctx => `rgba(${riskGroupColor(ctx.p0.parsed.y)}, 0.15)`,
                },
                stepped: true
            }
        ]
    };
    const options = {
        plugins: { legend: { display: false,}, tooltip: { callbacks: {
            label: function (context) {
                return 'Уровень риска: ' + context.raw + '%';
        }}}},
    };
    return (
        <>
            <div className="container header">
                <div className="row">
                    <div className="col" style={{opacity: 0.2}}>
                        <Button className="prev" disabled>
                            <FontAwesomeIcon icon={faArrowLeft}/>
                        </Button>
                    </div>
                    <div className="col-9 d-flex align-content-center">
                        <p className="title">{title}</p>
                    </div>
                    <div className="col d-flex justify-content-end">
                        <Button className="next" onClick={onClickNext}>
                            <FontAwesomeIcon icon={faArrowRight}/>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="chartPlace">
                <Line data={data} options={options} width={600} height={400}/>
                <div>
                    <p>
                        График уровня риска показывает вероятность возникновения у вас
                        заболеваний или других ситуаций, способных нанести вред вашему
                        здоровью, при проведении неконтролируемых тренировок.
                    </p>
                    <p>
                        Текущая группа риска - <b style={{color: `rgb(${
                            riskGroupColor(Object.values(cData).map(item => item.risk_group_kp).pop())
                        })` }}>
                            {labelScheme[Math.ceil((Object.values(cData).map(item => item.risk_group_kp).pop()) / 20) - 1]}
                        </b>
                    </p>
                </div>
            </div>
        </>
    )
};

export default RiskChart;