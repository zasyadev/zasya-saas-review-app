import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  plugins: {
    legend: {
      // position: "bottom",
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

const doughnutdata = {
  labels: ["Total Applaud", "Total Score"],
  datasets: [
    {
      label: "# of Votes",
      data: [15, 15, 60],
      backgroundColor: ["#44ad2f", "#4ea8fc", "#fff"],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

export function DoughnutChart() {
  return (
    <>
      <div className=" mx-1 ">
        <h2 className="text-xl mt-4  font-semibold ">Total Score</h2>
        <Doughnut data={doughnutdata} options={{ options, responsive: true }} />
      </div>
    </>
  );
}
