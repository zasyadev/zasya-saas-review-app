// import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Line } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "top",
//     },
//     title: {
//       display: true,
//       text: "Chart.js Line Chart",
//     },
//   },
// };

// const labels = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// export const data = {
//   labels,
//   datasets: [
//     {
//       label: "Dataset 1",
//       data: [45, 5, 45, 26, 48, 68, 48, 48, 32, 47, 18, 56],
//       borderColor: "rgb(255, 99, 132)",
//       backgroundColor: "rgba(255, 99, 132, 0.5)",
//     },
//   ],
// };

// export function LineChart() {
//   return (
//     <>
//       <h2 className="text-xl mt-10  font-semibold text-left">
//         Feedback given to me
//       </h2>
//       <Line options={{ options }} data={data} />
//     </>
//   );
// }

import Chart from "react-apexcharts";

const LineChart = () => {
  const defaultState = {
    series: [
      {
        name: "Chart Gradient",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        id: "li",
        group: "social",
        type: "area",
        height: 160,
        width: 300,
      },
      colors: ["#f8e2fd"],
      xaxis: {
        position: "bottom",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: false,
          },
        },
        lines: {
          show: false,
        },
      },
      title: {
        text: "Chart Gradient ",
      },
    },
  };

  return (
    <Chart
      options={defaultState.options}
      series={defaultState.series}
      type="area"
      height={160}
      width={300}
    />
  );
};

export default LineChart;
