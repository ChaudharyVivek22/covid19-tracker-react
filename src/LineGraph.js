import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import numeral from "numeral";

// https://disease.sh/v3/covid-19/historical/all?lastdays=120

// Options to pass in the Line Chart
const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tootips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll"
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    //Include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
}

function LineGraph({casesType='cases'}) {
    const [data, setData] = useState({});

    // Build Line Chart
    const buildChartData = (data, casesType = 'cases') => {
        let chartData = [];
        let lastDataPoint;
        for (let date in data[casesType]) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    }

    // Fetch Data and build chart
    useEffect(() => {
        const fetchData = async () => {
            fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
                .then(res => res.json())
                .then(data => {
                    // Some stuf here                
                    const chartData = buildChartData(data);
                    console.log("ChartDATA>>>>", chartData);
                    setData(chartData);
                })
        }
        fetchData();
    }, [casesType]) 


    return (
        <div>            
            {data?.length>0 &&(
                <Line
                options={options}
                data={{
                    datasets: [{
                        data: data,
                        backgroundColor: "rgba(204,16,52,0.5)",
                        borderColor: "#CC1034",
                    }]
                }}
            />
            )}            
        </div>
    )
}

export default LineGraph
