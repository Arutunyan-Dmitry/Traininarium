import React, {useEffect, useState} from "react";
import {Line} from 'react-chartjs-2';

const colors = ["30, 144, 255", "48, 207, 61", "255, 196, 59", "220, 20, 60"];


const ALoadChart = ({data, width, height}) => {
    const options = {
        plugins: {legend: {display: false,},},
        scales: {
            x: {max: 20, ticks: {display: false,},},
            y: {max: 100,},
        },
    };
    const [charData, setCharData] = useState({
        labels: [],
        datasets: [{label: 'Нагрузка ', fill: true, lineTension: 0.1, data: []}]
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const newLabel = new Date().toLocaleTimeString();
            const newData = data - Math.ceil(data * (Math.random() * 0.1).toFixed(2));
            setCharData(prevData => ({
                labels: [...prevData.labels.slice(-19), newLabel],
                datasets: [
                    {
                        ...prevData.datasets[0],
                        backgroundColor: `rgba(${colors[Math.round(newData / 25)]}, 0.4)`,
                        borderColor: `rgba(${colors[Math.round(newData / 25)]}, 1)`,
                        data: [...prevData.datasets[0].data.slice(-19), newData]
                    }
                ]
            }));
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return (
        <Line data={charData} options={options} width={width} height={height}/>
    )
};

export default ALoadChart;