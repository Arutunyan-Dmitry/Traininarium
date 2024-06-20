import React from "react";
import {faArrowRight, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {Bar} from 'react-chartjs-2';

library.add(faArrowRight, faArrowLeft);


const removeMonthFromDate = (dateString) => {
    const [year, month] = dateString.split('.');
    const date = new Date(`${month}/01/${year}`);
    date.setMonth(date.getMonth() - 1);
    const newMonth = String(date.getMonth() + 1).padStart(2, '0');
    const newYear = date.getFullYear();
    return `${newYear}.${newMonth}`;
};


const calculateAverageWeightByMonth = (data) => {
    const weightByMonth = {};
    data.forEach(entry => {
        const [month, year] = [entry.created_at.split('.')[1], entry.created_at.split('.')[2].split(' ')[0]];
        const monthKey = `${year}.${month}`;
        if (!weightByMonth[monthKey]) {
            weightByMonth[monthKey] = {
                totalWeight: 0,
                count: 0
            };
        }
        weightByMonth[monthKey].totalWeight += entry.weight;
        weightByMonth[monthKey].count++;
    });
    const averageWeightByMonth = {};
    for (const key in weightByMonth) {
        averageWeightByMonth[key] = weightByMonth[key].totalWeight / weightByMonth[key].count;
    }
    const result = {};
    let currentKey = Object.keys(averageWeightByMonth)[Object.keys(averageWeightByMonth).length - 1];
    for (let i = 0; i < 6; i++) {
        if (averageWeightByMonth[currentKey])
            result[currentKey] = averageWeightByMonth[currentKey];
        else
            result[currentKey] = 0;
        currentKey = removeMonthFromDate(currentKey);
    }
    return result;
};


const WeightChart = ({title, onClickPrev, DI}) => {
    const cData = calculateAverageWeightByMonth(Object.values(DI).map(obj => ({
        created_at: obj.created_at,
        weight: obj.weight
    })));
    const data = {
        labels: Object.keys(cData).reverse(),
        datasets: [
            {
                data: Object.values(cData).reverse().map(item => item.toFixed(2)),
                backgroundColor: ['rgba(242, 125, 169, 0.6)', 'rgba(59, 91, 219, 0.6)'],
                borderColor: ['rgba(242, 125, 169, 1)', 'rgba(59, 91, 219, 1)'],
                borderWidth: 3,
            },
        ],
    };
    const options = {
        plugins: {
            legend: {display: false,}, tooltip: {
                callbacks: {
                    label: function (context) {
                        return 'Вес: ' + context.raw + 'кг';
                    }
                }
            }
        },
    };
    return (
        <>
            <div className="container header">
                <div className="row">
                    <div className="col">
                        <Button className="prev" onClick={onClickPrev}>
                            <FontAwesomeIcon icon={faArrowLeft}/>
                        </Button>
                    </div>
                    <div className="col-9 d-flex align-content-center">
                        <p className="title">{title}</p>
                    </div>
                    <div className="col d-flex justify-content-end" style={{opacity: 0.2}}>
                        <Button className="next" disabled>
                            <FontAwesomeIcon icon={faArrowRight}/>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="chartPlace">
                <Bar data={data} options={options} width={600} height={400}/>
                <div>
                    <p>
                        График веса отображает изменения вашего веса за каждый месяц.
                        Он поможет вам отслеживать прогресс и достигать поставленных целей.
                    </p>
                    <p>
                        Текущий вес - <b>{Object.values(cData).reverse().pop().toFixed(1)} кг.</b>
                    </p>
                </div>
            </div>
        </>
    )
};

export default WeightChart;