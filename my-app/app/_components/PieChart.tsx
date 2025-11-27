import { Course } from "../types";
import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js/auto";
import { Pie } from "react-chartjs-2";

void ChartJS;

// reusable pie chart, takes course data and return chart for it
const PieChart = ({ data }: { data: Course }) => {
  let labels: string[] = [];
  const dataset = {
    data: [] as number[],
    borderWidth: 1,
    backgroundColor: [
      "rgba(255, 99, 132, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(153, 102, 255, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(255, 159, 64, 0.6)",
    ],
    borderColor: [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(255, 159, 64, 1)",
    ],
    borderRadius: 0,
  };
  if (data.A + data.B + data.C + data.D + data.F + data.NR > 0) {
    labels = ["A", "B", "C", "D", "F", "Not Reported"];
    dataset.data = [data.A, data.B, data.C, data.D, data.F, data.NR];
  } else if (data.S > 0 || data.U > 0) {
    labels = ["S", "U"];
    dataset.data = [data.S, data.U];
  } else {
    labels = ["No Data Available"];
    dataset.data = [0];
  }

  const chartData: ChartData<"pie"> = {
    labels: labels,
    datasets: [dataset],
  };

  const chartOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const raw = context.raw as number | null | undefined;
            const value = Number(raw ?? 0);
            const dataset = context.dataset.data as number[];
            const total = dataset.reduce((accumulator, currentValue) => {
              return accumulator + currentValue;
            }, 0);
            const pct =
              total > 0 ? ` (${Math.round((value / total) * 100)}%)` : "";
            return `${String(context.label ?? "")} : ${value}${pct}`;
          },
        },
      },
      title: {
        display: false,
        text: `${data.subj_cd} ${data.course_nbr}: ${data.title}`,
        font: { size: 22 },
      },
      legend: { display: true, position: "bottom" },
    },
  };
  return <Pie data={chartData} options={chartOptions} />;
};

export default PieChart;
