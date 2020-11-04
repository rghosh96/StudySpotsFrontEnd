import React from 'react';
// // import CanvasJSReact, { CanvasJS, CanvasJSChart } from 'react-canvas-js'; 
// import {CanvasJSReact} from 'react-canvas-js';
// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;
import { Bar, Chart } from 'react-chartjs-2';
import '../../styling/master.scss';

Chart.defaults.global.defaultFontSize = 36;


export default function PopTimesChart(props) {
    var dataConfig = {
        hour: [],
        percentage: [],
        barColor: [],
    };

    // setup for conditional bar color
    var date = new Date;
    var currentHour = date.getHours();

    // setup to normalize the opacity of the bar color
    let min = 101, max = -1, newMin = 20, newMax = 100;
    props.hours.forEach(item => {
        let val = item.percentage;
        max = val > max ? val : max;
        min = val < min ? val : min;
    });


    props.hours.forEach(item => {
        // normalize the percentage to make the bar color more vibrant
        let opacity = (((item.percentage - min) / (max - min)) * (newMax - newMin) + newMin) / 100.0;

        // format each hour on a 1-12 range with a/p for morning/afternoon
        let displayHour = '';
        // only display every third hour so as not to crowd the x-axis
        if (item.hour % 3 == 0) {
            if (item.hour > 12) {
                displayHour = `${item.hour % 12}p`
            } else if (item.hour < 12) {
                displayHour = `${item.hour % 12}a`
            } else if (item.hour == 12) {
                displayHour = '12p'
            } else if (item.hour == 0) {
                displayHour = '12a'
            }
        }

        dataConfig.hour.push(displayHour);
        dataConfig.percentage.push(item.percentage);
        // current hour bar color is red, other bars are StudySpots green
        dataConfig.barColor.push(item.hour == currentHour ? `rgba(194, 146, 87,${opacity})` : `rgba(104, 126, 99,${opacity})`);
    });

    const data = {
        labels: dataConfig.hour,
        datasets: [{
            backgroundColor: dataConfig.barColor,
            borderColor: 'rgba(0,0,0,0)', // invisible
            borderWidth: 2,
            data: dataConfig.percentage
        }],
    };

    const options = {
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        responsive: true,
        // maintainAspectRatio: false,
        title: {
            display: true,
            text: props.day,
        },
        scales: {
            // hide gride lines
            xAxes: [{
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }
            }],
            yAxes: [{
                display: false, // hide y axis numbers
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                }
            }]
        }
    }

    return (
        <div className="pop-times-chart-wrapper">
            <Bar
                data={data}
                options={options}
            />
        </div>
    );
}

// export default function PopTimesChart(props) {
//     const options = {
//         title: {
//             text: "Basic Column Chart"
//         },
//         data: [
//             {
//                 // Change type to "doughnut", "line", "splineArea", etc.
//                 type: "column",
//                 dataPoints:

//                     [
//                         { label: "Apple", y: 10 },
//                         { label: "Orange", y: 15 },
//                         { label: "Banana", y: 25 },
//                         { label: "Mango", y: 30 },
//                         { label: "Grape", y: 28 }
//                     ]
//             }
//         ]
//     }

//     return (
//         <div>
//             <CanvasJSChart options={options}
//             /* onRef={ref => this.chart = ref} */
//             />
//             {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
//         </div>
//     );

// }