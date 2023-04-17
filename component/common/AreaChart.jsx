import { Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import httpService from "../../lib/httpService";

const DEFAULT_MONTH_DATA = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const DEFAULT_MONTH_NAME = [
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
];
const defaultChartSeries = [
  {
    name: "Appaluds",
    data: DEFAULT_MONTH_DATA,
  },
  {
    name: "Goals",
    data: DEFAULT_MONTH_DATA,
  },
  {
    name: "Review",
    data: DEFAULT_MONTH_DATA,
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
    categories: DEFAULT_MONTH_NAME,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
};

const AreaChart = ({ user }) => {
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
      })
      .catch(() => setChartData(defaultChartSeries))
      .finally(() => setLoading(false));
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

export default AreaChart;
