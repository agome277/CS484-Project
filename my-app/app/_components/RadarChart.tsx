import { Course } from "../types";
import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js/auto";
import { Radar } from "react-chartjs-2";

void ChartJS;

// Reusable radar chart, takes course data and returns chart for it
const RadarChart = ({ data }: { data: Course }) => {
  let labels: string[] = [];
  let values: number[] = [];
  let max = 0;

  if (data.A + data.B + data.C + data.D + data.F + data.NR > 0) {
    labels = ["A", "B", "C", "D", "F", "Not Reported"];
    values = [data.A, data.B, data.C, data.D, data.F, data.NR];
    max = Math.max(data.A, data.B, data.C, data.D, data.F, data.NR);
  } else if (data.S > 0 || data.U > 0) {
    labels = ["S", "U"];
    values = [data.S, data.U];
    max = Math.max(data.S, data.U);
  } else {
    labels = ["No Data Available"];
    values = [0];
  }

  const chartData: ChartData<"radar"> = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: "rgba(212, 31, 11, 0.35)",
        borderColor: "rgba(212, 31, 11, 0.95)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(212, 31, 11, 0.95)",
        pointBorderColor: "#fff",
        pointHoverRadius: 6,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        suggestedMax: max % 5 === 0 ? max + 1 : max,
        pointLabels: {
          font: { size: 14 },
          color: "black",
        },
      },
    },
    plugins: {
      legend: { display: false },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = Number(context.raw ?? 0);
            const dataset = context.dataset.data as number[];
            const total = dataset.reduce((a, b) => a + b, 0);
            const pct =
              total > 0 ? ` (${Math.round((value / total) * 100)}%)` : "";
            return `${context.label}: ${value}${pct}`;
          },
        },
      },
    },
  };

  return <Radar data={chartData} options={chartOptions} />;
};

export default RadarChart;
