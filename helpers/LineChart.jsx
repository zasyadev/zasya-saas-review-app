import Chart from "react-apexcharts";

const LineChart = () => {
  const defaultState = {
    series: [
      {
        name: "Line",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        id: "li",
        group: "social",
        type: "area",
        height: 160,
        zoom: {
          enabled: false,
        },
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
        text: "Feedback given to me",
        style: {
          fontSize: "16",
          fontWeight: "500",
          fontFamily: "Montserrat",
          color: "#0f123f",
        },
      },
    },
  };

  return (
    <>
      <div className="bg-data ">
        <div className="line-chart-text">No Data Found</div>
        <Chart
          options={defaultState.options}
          series={defaultState.series}
          type="area"
          height={250}
          className="chart-data"
        />
      </div>
    </>
  );
};

export default LineChart;

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
