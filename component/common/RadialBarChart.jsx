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
// const seriesOptions = {
//   chart: {
//     type: "donut",
//   },
//   legend: {
//     show: false,
//   },
//   labels: ["Goals", "Applauds"],
//   colors: ["#FF9F5B", "#64A15E"],
//   plotOptions: {
//     pie: {
//       donut: {
//         labels: {
//           show: true,
//           total: {
//             show: true,
//             label: "",
//             formatter: () => "Text you want",
//           },
//         },
//       },
//     },
//   },

//   stroke: {
//     show: false,
//   },
//   dataLabels: {
//     formatter: function (_, opts) {
//       return opts.w.config.series[opts.seriesIndex];
//     },
//   },
// };

function RadialBarChart({ totalGoals, totalApplauds, reviewRating }) {
  const [options, setOptions] = useState(seriesOptions);

  useEffect(() => {
    setOptions((prev) => ({ ...prev, series: [8.5 * 10] }));
  }, [reviewRating]);

  return <Chart options={options} series={options.series} type="radialBar" />;
}

export default RadialBarChart;
