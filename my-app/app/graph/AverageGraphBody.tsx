"use client";
import BarChart from "../_components/BarChart";
import PieChart from "../_components/PieChart";
import { Course } from "@/app/types";
import Button from "../_components/Button";
import { useState } from "react";
import RadarChart from "../_components/RadarChart";

type GraphOptions = "bar" | "pie" | "radar";

const AverageGraphBody = ({
  data,
  num,
  subj,
  type,
}: {
  data: Course[];
  num: string | number;
  subj: string;
  type: string;
}) => {
  const [graphType, setGraphType] = useState<GraphOptions>("bar");

  return (
    <div className="flex flex-col w-200">
      {type === "average" && <Button href="./average">Back</Button>}
      {type === "instructor" && <Button href="./instructors">Back</Button>}
      {/* Title */}
      <div className="justify-items-center mb-4">
        <h1 className="text-lg font-semibold">
          {`${subj} ${num}: ${data[0].title}`}
        </h1>
        <h2 className="w-60 text-center">{`Average Grade Distribution`}</h2>
      </div>

      {/* Select chart type */}
      <select
        className="border w-fit ml-3 mb-2"
        onChange={(e) => setGraphType(e.target.value as GraphOptions)}
      >
        <option value="bar">Bar</option>
        <option value="pie">Pie</option>
        {data[0].S === 0 && data[0].U === 0 && (
          <option value="radar">Radar</option>
        )}
      </select>

      {/* Graphs */}
      {data.map((course, index) => {
        const { A, B, C, D, F, W, S, U, grade_regs } = course;

        return (
          <div key={index} className="border mx-3 p-3 mb-7">
            {/* Bar Chart if selected */}
            {graphType === "bar" && <BarChart data={data[index]} />}

            {/* Pie Chart if selected */}
            {graphType === "pie" && (
              <div className="w-6/10 justify-self-center">
                <PieChart data={data[index]} />
              </div>
            )}

            {/* Radar Chart if selected */}
            {graphType === "radar" && (
              <div className="w-6/10 justify-self-center">
                <RadarChart data={data[index]} />
              </div>
            )}

            {/* Extra Details */}
            <div className="pl-15">
              {S + U === 0 && (
                <p>
                  Average GPA:{" "}
                  {((4 * A + 3 * B + 2 * C + D) / (grade_regs - W)).toFixed(2)}
                </p>
              )}

              <p>Withdraws: {Math.ceil(W)}</p>

              {A + B + C + D + F ? (
                <p>
                  Pass Rate:{" "}
                  {(((A + B + C + D) / (grade_regs - W)) * 100).toFixed(2)}%
                </p>
              ) : (
                <p>Pass Rate: {((S / (grade_regs - W)) * 100).toFixed(2)}%</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AverageGraphBody;
