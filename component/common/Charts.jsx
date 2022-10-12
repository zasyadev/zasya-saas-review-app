import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import httpService from "../../lib/httpService";
import CustomPopover from "./CustomPopover";

const defaultChartSeries = {
  name: "Feedback",
  data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

const defaultOptions = {
  chart: {
    toolbar: {
      show: false,
    },
    type: "bar",
    height: 360,
  },
  plotOptions: {
    bar: {
      borderRadius: 14,
      columnWidth: "40%",
      dataLabels: {
        position: "top",
      },
    },
  },
  responsive: [
    {
      breakpoint: 500,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 1,
            columnWidth: "90%",
          },
        },
      },
    },
  ],
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val;
    },
    offsetY: 10,
    style: {
      fontSize: "12px",
      colors: ["#fff"],
    },
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    position: "bottom",
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },

  colors: ["#0F123F"],
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
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      return `<div className="tooltip_chart"> <span className="px-2"> ${w.globals.labels[dataPointIndex]} : ${series[seriesIndex][dataPointIndex]} </span> </div>`;
    },
  },
};

const BarChart = ({ user }) => {
  const [chartData, setChartData] = useState(defaultChartSeries);
  const [loading, setLoading] = useState(true);

  async function fetchChartData() {
    setLoading(true);
    setChartData([]);

    await httpService
      .post(`/api/dashboard/chart`, {
        userId: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          setChartData((prev) => ({ ...prev, data: response.data }));
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setChartData(defaultChartSeries);
        console.error(err.response.data?.message);
      });
  }

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <div>
      <p className="chart-title text-primary flex items-center">
        Feedback{" "}
        <span className="leading-[0] ml-2">
          {CustomPopover(
            "Count of Feedback given by the organization monthly."
          )}
        </span>
      </p>
      {loading ? (
        <>
          <Skeleton active className="mt-4 mb-2" />
          <Skeleton active />
        </>
      ) : (
        <Chart
          options={defaultOptions}
          series={[chartData]}
          type="bar"
          height={360}
          className="chart-data "
        />
      )}
      {/* <div className="bar-chart-text">No Data Found</div> */}
    </div>
  );
};

export default BarChart;
