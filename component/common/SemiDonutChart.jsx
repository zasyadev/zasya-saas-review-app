import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const seriesOptions = {
  chart: {
    type: "donut",
  },
  legend: {
    show: false,
  },
  labels: ["Goals", "Applauds"],
  colors: ["#FF9F5B", "#64A15E"],
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 90,
      offsetY: 10,
    },
  },
  grid: {
    padding: {
      bottom: -80,
    },
  },
  stroke: {
    show: false,
  },
  dataLabels: {
    formatter: function (_, opts) {
      return opts.w.config.series[opts.seriesIndex];
    },
  },
  series: [0, 0],
};

function SemiDonutChart({ totalGoals, totalApplauds }) {
  const [options, setOptions] = useState(seriesOptions);

  useEffect(() => {
    setOptions((prev) => ({ ...prev, series: [totalGoals, totalApplauds] }));
  }, [totalGoals, totalApplauds]);

  return <Chart options={options} series={options.series} type="donut" />;
}

export default SemiDonutChart;
