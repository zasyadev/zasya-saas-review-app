import Chart from "react-apexcharts";

const BarChart = () => {
  const defaultState = {
    series: [
      {
        name: "sales",
        data: [2, 3, 4, 10, 8, 7, 1, 9, 10],
      },
    ],

    options: {
      chart: {
        type: "bar",
        height: 380,
      },
      plotOptions: {
        bar: {
          borderRadius: 25,
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "%";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"],
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
      title: {
        text: "Company Ratting Received Per Month ",
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
    },
  };

  return (
    <Chart
      options={defaultState.options}
      series={defaultState.series}
      type="bar"
      height={380}
    />
  );
};

export default BarChart;
