import React from "react";
import {Doughnut} from 'react-chartjs-2';

const colors = ["#DC143C", "#ffc43b", "#30cf3d", "#a6a6a6"];


const AUsersChart = ({data, width, height}) => {
    const charData = {
        labels: Object.keys(data),
        datasets: [{
            data: Object.values(data),
            backgroundColor: colors
        }]
    };
    return (
        <Doughnut data={charData} width={width} height={height}/>
    )
};

export default AUsersChart;