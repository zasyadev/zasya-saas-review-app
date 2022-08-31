import Chart from "react-apexcharts";
import { Skeleton } from "antd";
import React, { useState, useEffect } from "react";
import httpService from "../../lib/httpService";

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
        position: "top", // top, center, bottom
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
        // title: {
        //   text: "Comapny Rating ",
        //   style: {
        //     fontSize: "14px",
        //   },
        // },
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
  // title: {
  //   text: "Feedback  ",
  //   style: {
  //     fontSize: "20",
  //     fontWeight: "600",
  //     fontFamily: "Montserrat",
  //     color: "#0f123f",
  //   },
  // },

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
      return `<div class="tooltip_chart"> <span> ${w.globals.labels[dataPointIndex]} : ${series[seriesIndex][dataPointIndex]} </span> </div>`;
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
        setChartData(defaultChartSeries);
        console.error(err.response.data.message);
      });
  }

  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <div
    // className=" bg-blur-overlay"
    >
      <p className="chart-title text-primary">Feedback</p>
      {loading ? (
        <>
          {" "}
          <Skeleton active className="mb-2" />
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
