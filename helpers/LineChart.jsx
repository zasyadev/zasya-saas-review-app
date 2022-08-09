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
      <div className="bg-blur-overlay ">
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
