/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

function configs(labels, datasets) {
  const textColor = datasets.textColor || "#fff";
  
  return {
    data: {
      labels,
      datasets: [
        {
          label: datasets.label,
          tension: 0.4,
          borderWidth: 0,
          borderRadius: 4,
          borderSkipped: false,
          backgroundColor: datasets.backgroundColor || "#fff",
          data: datasets.data,
          maxBarThickness: 6,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1500,
        easing: "easeOutQuint",
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      scales: {
        y: {
          grid: {
            drawBorder: false,
            display: true,
            drawOnChartArea: true,
            drawTicks: false,
            color: "rgba(180, 180, 180, 0.1)", // subtle horizontal lines instead of no lines
          },
          ticks: {
            suggestedMin: 0,
            suggestedMax: 500,
            beginAtZero: true,
            padding: 15,
            font: {
              size: 14,
              family: "Roboto",
              style: "normal",
              lineHeight: 2,
            },
            color: textColor,
          },
        },
        x: {
          grid: {
            drawBorder: false,
            display: false,
            drawOnChartArea: false,
            drawTicks: false,
          },
          ticks: {
            display: true, // Display the month names beneath the bars
            color: textColor,
            padding: 10,
            font: {
              size: 12,
              family: "Roboto",
            },
          },
        },
      },
    },
  };
}

export default configs;
