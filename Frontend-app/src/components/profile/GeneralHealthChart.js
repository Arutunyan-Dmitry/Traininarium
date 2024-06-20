import React from "react";
import {faArrowRight, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {Doughnut} from 'react-chartjs-2';

library.add(faArrowRight, faArrowLeft);


const labels = ["Очень плохое", "Плохое", "Нормальное", "Хорошее", "Превосходное"];
const colors = ['#FF6384', '#FF4B69', '#3B5BDB', '#748FFC', '#B4B6AF', '#FFCE56'];
const countGeneralHealth = (data) => {
    const counts = {};
    data.forEach((value) => {
        counts[value] = (counts[value] || 0) + 1;
    });
    const uniqueValues = Object.keys(counts);
    const countsArray = Object.values(counts);
    return {uniqueValues, countsArray};
};

const GeneralHealthChart = ({title, onClickNext, onClickPrev, DI}) => {
    const {uniqueValues, countsArray} = countGeneralHealth(Object.values(DI).map(obj =>
         labels[["Poor", "Fair", "Good", "Very good", "Excellent"].indexOf(obj.general_health)]
    ));
    const data = {
        labels: uniqueValues,
        datasets: [
            {
                data: countsArray,
                backgroundColor: colors,
                hoverBackgroundColor: colors
            }
        ]
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
                    <div className="col d-flex justify-content-end">
                        <Button className="next" onClick={onClickNext}>
                            <FontAwesomeIcon icon={faArrowRight}/>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="chartPlace">
                <div style={{paddingRight: '5vw'}}>
                    <p>
                        График самочувствия поможет вам проанализировать и улучшить понимание
                        своих эмоций.
                    </p>
                    <p>
                        Чаще всего ваше самочувствие - <b>{
                            uniqueValues[countsArray.indexOf(Math.max(...countsArray))]
                        }</b>
                    </p>
                </div>
                <Doughnut className="me-5" data={data} width={600} height={400}/>
            </div>
        </>
    )
};

export default GeneralHealthChart;