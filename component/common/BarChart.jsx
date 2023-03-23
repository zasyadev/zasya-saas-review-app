import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import httpService from "../../lib/httpService";

const defaultChartSeries = [
  {
    name: "Appaluds",
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: "Goals",
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: "Review",
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
];

const defaultOptions = {
  chart: {
    toolbar: {
      show: false,
    },
    height: "300px",
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
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
};

const BarChart = ({ user }) => {
  const [chartData, setChartData] = useState(defaultChartSeries);
  const [loading, setLoading] = useState(true);

  async function fetchChartData() {
    setLoading(true);
    setChartData(defaultChartSeries);

    await httpService
      .get(`/api/dashboard/chart`, {
        userId: user.id,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          let chartArray = [];
          if (response.data) {
            chartArray = [
              {
                name: "Appaluds",
                data: response.data.applaudChartData,
              },
              {
                name: "Goals",
                data: response.data.goalChartData,
              },
              {
                name: "Review",
                data: response.data.reviewChartData,
              },
            ];
          }

          setChartData(chartArray);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setChartData(defaultChartSeries);
      });
  }
  useEffect(() => {
    fetchChartData();
  }, []);

  return (
    <div>
      {loading ? (
        <>
          <Skeleton active className="mt-4 mb-2" />
          <Skeleton active />
        </>
      ) : (
        <Chart
          options={defaultOptions}
          series={chartData}
          type="area"
          height={360}
        />
      )}
    </div>
  );
};

export default BarChart;
