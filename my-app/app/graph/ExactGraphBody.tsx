"use client";
import BarChart from "../_components/BarChart";
import PieChart from "../_components/PieChart";
import { Course } from "@/app/types";
import Button from "../_components/Button";
import { useState } from "react";
import RadarChart from "../_components/RadarChart";
import Card from "../_components/Card";
import LabelBar from "../_components/LabelBar";

const seasonMap = {
  FA: "Fall",
  SP: "Spring",
  SU: "Summer",
  "": "",
} as const;

type GraphOptions = "bar" | "pie" | "radar";

const ExactGraphBody = ({ data }: { data: Course[] }) => {
  const [graphType, setGraphType] = useState<GraphOptions>("bar");

  return (
    <div className="flex flex-col justify-center items-center border border-amber-200 w-screen">
      <Button href="./exact">Back</Button>
      {/* Title */}
      <div className="justify-items-center mb-4">
        <h1 className="text-lg font-semibold">
          {`${data[0].subj_cd} ${data[0].course_nbr}: ${data[0].title}`}
        </h1>
        <h2>{`${seasonMap[data[0].season]} ${data[0].year}`}</h2>
      </div>

      {/* Select chart type */}
      <div className="flex gap-1">
        <label>Graph Type:</label>
        <select
          className="border w-fit ml-3 mb-2 rounded-md"
          onChange={(e) => setGraphType(e.target.value as GraphOptions)}
        >
          <option value="bar">Bar</option>
          <option value="pie">Pie</option>
          {data[0].S === 0 && data[0].U === 0 && (
            <option value="radar">Radar</option>
          )}
        </select>
      </div>

      {/* Graphs */}
      {data.map((course, index) => {
        return (
          <div key={index} className="mb-7 w-6/10">
            <Card>
              {/* Name of instructor */}
              <h1 className="ml-3 mb-6 p-2 text-xl opacity-70 rounded-md bg-zinc-200 border border-slate-400 hover:border-slate-800 hover:bg-zinc-300">
                Instructor: {course.instructor}
              </h1>
              <div className="flex flex-col items-center">
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
              </div>
              {/* Info section */}
              <LabelBar course={course} />
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default ExactGraphBody;
