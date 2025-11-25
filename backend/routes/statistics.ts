import express from "express";
import type { Request, Response } from "express";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "courses.db");
const db = new Database(dbPath, { readonly: true });

export const statisticsRouter = express.Router();

statisticsRouter.get("/", (req: Request, res: Response) => {
  res.json([]);
});

statisticsRouter.get("/all", (req: Request, res: Response) => {
  const { department, subj, level } = req.query;
  // Normalize and validate level to avoid producing `undefined%`.
  const stringLevel = String(level).trim();
  let dbCourseLevel: string;
  if (stringLevel === "all") { //get all levels
    dbCourseLevel = "%";
  } else { //get specific level sql query looks like c.subj_cd LIKE '1%'
    dbCourseLevel = `${stringLevel.at(0)}%`;
  }
  const rows = db
    .prepare(
      `
      SELECT c.subj_cd,
        c.course_nbr,
        c.instructor,
        ROUND( ( (4.0 * c.A + 3.0 * c.B + 2.0 * c.C + c.D) / (c.grade_regs - c.W) ), 2) AS avg_gpa
      FROM courses c
      JOIN semesters s ON c.semester_id = s.id
      WHERE c.dept_name = ? AND 
            c.subj_cd = ? AND
            c.course_nbr LIKE ? AND
            c.instructor <> ' ,' AND
            (c.A + c.B + c.C + c.D + c.F) > 0
      GROUP BY c.subj_cd,
              c.course_nbr,
              c.instructor
      ORDER BY c.course_nbr ASC, avg_gpa DESC
      `
    )
    .all(department, subj, dbCourseLevel) as {
    subj_cd: string;
    course_nbr: string;
    instructor: string;
    avg_gpa: number;
  }[];

  if (!rows) {
    return res.status(400).json({ error: "DB Error" });
  }


  res.json(rows);
});

type dbEasyCourseResponse = {
  subj_cd: string;
  course_nbr: string;
  instructor: string;
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
  S: number;
  U: number;
  W: number;
  grade_regs: number;
};

type easyCourseGpa = {
  subj_cd: string;
  course_nbr: string;
  instructor: string;
  avg_gpa: number;
  percent_A_grade: number;
  pass_rate: number;
  prereq_rate: number;
  withdraw_rate: number;
}

type easyCourseSatisfaction = {
  subj_cd: string;
  course_nbr: string;
  instructor: string;
  satisfaction_rate: number;
  withdraw_rate: number;
}

statisticsRouter.get("/easy", (req: Request, res: Response) => {
  const {department, subj, level} = req.query;
  const stringLevel = String(level).trim();
  let dbCourseLevel: string;
  if (stringLevel === "all") { //get all levels
    dbCourseLevel = "%";
  } else { //get specific level sql query looks like c.subj_cd LIKE '1%'
    dbCourseLevel = `${stringLevel.at(0)}%`;
  }
  // Placeholder implementation
  const rows = db
    .prepare(
      `
      SELECT c.subj_cd,
        c.course_nbr,
        c.instructor,
        c.A,
        c.B,
        c.C,
        c.D,
        c.F,
        c.S,
        c.U,
        c.W,
        c.grade_regs,
      FROM courses c
      JOIN semesters s ON c.semester_id = s.id
      WHERE c.dept_name = ? AND
            c.subj_cd = ? AND
            c.course_nbr LIKE ?
      GROUP BY c.subj_cd,
              c.course_nbr,
              c.instructor
      ORDER BY c.course_nbr ASC
      `
    )
    .all(department, subj, dbCourseLevel) as dbEasyCourseResponse[];
  
  const easyCoursesGpa: easyCourseGpa[] = [];
  const easyCoursesSatisfaction: easyCourseSatisfaction[] = [];
  //For each course, get GPA related stats if grades exist, else get satisfaction related stats
  for (const course of rows) {
    const totalGrades = course.A + course.B + course.C + course.D + course.F;
    const totalSatisfaction = course.S + course.U;
    if (totalGrades > 0) {
      const avgGpa = (4.0 * course.A + 3.0 * course.B + 2.0 * course.C + 1.0 * course.D) / totalGrades;
      const percentAGrade = (course.A / totalGrades) * 100;
      const passRate = ((course.A + course.B + course.C + course.D) / totalGrades) * 100;
      const prereqRate = ((course.A + course.B + course.C) / totalGrades) * 100;
      const withdrawRate = (course.W / course.grade_regs) * 100;
      easyCoursesGpa.push({
        subj_cd: course.subj_cd,
        course_nbr: course.course_nbr,
        instructor: course.instructor,
        avg_gpa: parseFloat(avgGpa.toFixed(2)),
        percent_A_grade: parseFloat(percentAGrade.toFixed(2)),
        pass_rate: parseFloat(passRate.toFixed(2)),
        prereq_rate: parseFloat(prereqRate.toFixed(2)),
        withdraw_rate: parseFloat(withdrawRate.toFixed(2)),
      });
      continue; //skip satisfaction calculation if grades exist
    }
    if (totalSatisfaction > 0) {
      const satisfactionRate = (course.S / totalSatisfaction) * 100;
      const withdrawRate = (course.W / course.grade_regs) * 100;
      easyCoursesSatisfaction.push({
        subj_cd: course.subj_cd,
        course_nbr: course.course_nbr,
        instructor: course.instructor,
        satisfaction_rate: parseFloat(satisfactionRate.toFixed(2)),
        withdraw_rate: parseFloat(withdrawRate.toFixed(2)),
      });
    }
  }
  //perform lexicographical sorting on the arrays based on the most important metric first
  easyCoursesGpa.sort((a, b) => 
    a.avg_gpa - b.avg_gpa ||
    b.percent_A_grade - a.percent_A_grade ||
    b.prereq_rate - a.prereq_rate ||
    b.pass_rate - a.pass_rate ||
    b.withdraw_rate - a.withdraw_rate
  );
  easyCoursesSatisfaction.sort((a, b) => 
    b.satisfaction_rate - a.satisfaction_rate ||
    a.withdraw_rate - b.withdraw_rate
  );

  if (!rows) {
    return res.status(400).json({ error: "DB Error" });
  }

  res.json(rows);
});