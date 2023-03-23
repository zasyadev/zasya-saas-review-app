import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const seriesOptions = {
  chart: {
    height: 240,
    type: "radialBar",
  },
  colors: ["#FF9F5B"],
  plotOptions: {
    radialBar: {
      dataLabels: {
        showOn: "always",
        name: {
          offsetY: -10,
          show: true,
          color: "#000",
          fontSize: "11px",
        },
        value: {
          color: "#000",
          fontSize: "30px",
          show: true,
          formatter: function (val) {
            return val / 10;
          },
        },
      },
      track: {
        background: "#a4a4a4",
        strokeWidth: "100%",
      },
    },
  },
  stroke: {
    lineCap: "round",
  },
  labels: ["Rating"],
  series: [0],
};

function RadialBarChart({ totalGoals, totalApplauds, reviewRating }) {
  const [options, setOptions] = useState(seriesOptions);

  useEffect(() => {
    setOptions((prev) => ({ ...prev, series: [reviewRating * 10] }));
  }, [reviewRating]);

  return <Chart options={options} series={options.series} type="radialBar" />;
}

export default RadialBarChart;
