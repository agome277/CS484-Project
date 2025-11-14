"use client";
import { useEffect, useState } from "react";
import Select from "../_components/Select";
import "../styles/easyCourses.css";

type EasyCourse = {
    subj_cd: string;
    course_nbr: string;
    instructor: string;
    avg_gpa: number;
};

export default function EasyCoursesPage() {
    const courseLevels: string[] = ["all", "100", "200", "300", "400", "500"];
    const [departmentArray, setDepartmentArray] = useState<string[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [selectedLevel, setSelectedLevel] = useState<string>("all");
    const [easyCoursesArray, setEasyCoursesArray] = useState<EasyCourse[]>([]);
    const [existsEasyCourses, setExistsEasyCourses] = useState<boolean>(false);

    useEffect(() => {
        const fetchDepartments = async () => {
            const res = await fetch("http://localhost:3001/department");
            const data = await res.json();
            setDepartmentArray(data.map((dept: { dept_name: string }) => dept.dept_name));
            setSelectedDepartment(data[1]?.dept_name || "");
        }
        fetchDepartments(); 
    }, []);

    async function findEasyCourseHandler(): Promise<void> {
        const fetchEasyCourses = async () => {
            const easyCoursesRes = await fetch(
                `http://localhost:3001/statistics/easy?department=${selectedDepartment}&level=${selectedLevel}`
            );
            const easyCoursesData: EasyCourse[] = await easyCoursesRes.json();
            setEasyCoursesArray(easyCoursesData);
            setExistsEasyCourses(easyCoursesData.length > 0);
        };
        fetchEasyCourses(); 
    }

    return (
        <div className="flex flex-col items-center py-10">
                <Select
                    label="Departments"
                    items={departmentArray}
                    onChange={setSelectedDepartment}
                    value={selectedDepartment}
                />
                <Select
                    label="Course Levels"
                    items={courseLevels}
                    onChange={setSelectedLevel}
                    value={selectedLevel}
                />
                <button id="easy-course-find-button" onClick={findEasyCourseHandler}>Find</button>
                {easyCoursesArray.length > 0 ? (
                    <table id="easy-courses-table">
                        <thead>
                            <tr>
                                <th>Subject Code</th>
                                <th>Course Number</th>
                                <th>Instructor</th>
                                <th>Average GPA</th>
                                <th>Average Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {easyCoursesArray.map((course, index) => (
                                <tr key={index}>
                                    <td>{course.subj_cd}</td>
                                    <td>{course.course_nbr}</td>
                                    <td>{course.instructor}</td>
                                    <td>{course.avg_gpa.toFixed(2)}</td>
                                    <td>{course.avg_gpa / 4.0 * 100}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No entries</p>
                )}
            <div>

            </div>
        </div>
    );
}
