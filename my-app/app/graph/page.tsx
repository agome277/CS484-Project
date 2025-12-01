// "use client";
import ExactGraphBody from "./ExactGraphBody";
import AverageGraphBody from "./AverageGraphBody";

export default async function Graph({
  searchParams,
}: {
  searchParams: {
    type: "exact" | "average" | "instructor";
    d: string;
    t: string;
    y: number;
    n: number;
    s: string;
  };
}) {
  // type, department, term, year, (course) number, and/or subj given from prev page
  const { type, d, t, y, n, s } = await searchParams;
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  let res;

  if (type === "exact") {
    res = await fetch(
      `${BASE}/course/exact?dept=${encodeURIComponent(
        d
      )}&subj=${encodeURIComponent(s)}&cn=${encodeURIComponent(
        n
      )}&term=${encodeURIComponent(t)}&year=${encodeURIComponent(y)}`
    );
  } else if (type === "average" || type === "instructor") {
    res = await fetch(
      `${BASE}/course/average?department=${encodeURIComponent(
        d
      )}&subj=${encodeURIComponent(s)}&cn=${encodeURIComponent(n)}`
    );
  }

  const data = await res!.json();
  console.log(data);
  const error = data.length === 0 ? 1 : 0; // TODO: create a full error page/component

  console.log(data);

  return (
    <div className="flex flex-col justify-center items-center py-10">
      {error === 0 && type === "exact" && <ExactGraphBody data={data} />}
      {error === 0 && (type === "average" || type === "instructor") && (
        <AverageGraphBody data={data} num={n} subj={s} type={type} />
      )}
      {error === 1 && (
        <div className="border">
          <p className="px-10 py-20 font-semibold text-2xl">Course not found</p>
        </div>
      )}
    </div>
  );
}
