import { Course } from "../types";
import { Chart as ChartJS, ChartData, ChartOptions } from "chart.js/auto";
import { Bar } from "react-chartjs-2";

void ChartJS;

// reusable bar chart, takes course data and return chart for it
const BarChart = ({ data }: { data: Course }) => {
  let labels: string[] = [];
  const dataset = {
    data: [] as number[],
    borderWidth: 1,
    backgroundColor: "rgba(212, 31, 11, .7)",
    borderColor: "rgba(212, 31, 11,.7)",
    borderRadius: 10,
    hoverBackgroundColor: "rgba(212, 31, 11, 1)",
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

  const chartData: ChartData<"bar"> = {
    labels: labels,
    datasets: [dataset],
  };

  const chartOptions: ChartOptions<"bar"> = {
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
      legend: { display: false },
    },
    scales: {
      x: {
        title: { text: "Grade", display: true, font: { size: 16 } },
      },
      y: {
        title: { text: "# of students", display: true, font: { size: 16 } },
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default BarChart;
