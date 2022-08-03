import Chart from "react-apexcharts";

const BarChart = () => {
  const defaultState = {
    series: [
      {
        name: "rating",
        data: [2, 3, 4, 10, 8, 7, 1, 9, 10, 6, 8, 4],
      },
    ],

    options: {
      chart: {
        toolbar: {
          show: false,
        },
        type: "bar",
        height: 380,
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
            title: {
              text: "Comapny Rating ",
              style: {
                fontSize: "14px",
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
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#0F123F"],
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
        text: "Company Rating Received Per Month ",
        style: {
          fontSize: "20",
          fontWeight: "600",
          fontFamily: "Montserrat",
          color: "#0f123f",
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
    },
  };

  return (
    <>
      <div className="bg-blur-overlay ">
        <div className="bar-chart-text">No Data Found</div>
        <Chart
          options={defaultState.options}
          series={defaultState.series}
          type="bar"
          height={380}
          className="chart-data"
        />{" "}
      </div>
    </>
  );
};

export default BarChart;
