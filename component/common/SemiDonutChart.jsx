import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

function SemiDonutChart() {
  const [options, setOptions] = useState({
    series: [8.8, 10],
    chart: {
      type: "donut",
    },
    legend: {
      show: false,
    },
    labels: ["Rate", "Total"],
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
  });

  return <Chart options={options} series={options.series} type="donut" />;
}

export default SemiDonutChart;
