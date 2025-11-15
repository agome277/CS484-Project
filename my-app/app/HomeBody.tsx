"use client";
import {useRouter} from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import Button from "./_components/Button";
import Select from "./_components/Select";

// TODO: make this page type safe

export default function HomeBody() {
  const router = useRouter();
  //State for departments
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [departmentsArr, setDepartmentsArr] = useState<string[]>([]);
  //State for years
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [yearsArr, setYearsArr] = useState<number[]>([]);
  //State for seasons/terms
  const [seasonsArr, setSeasonsArr] = useState<string[]>(["FA", "SP", "SU"]);
  const [selectedSeason, setSelectedSeason] = useState<string>("FA");
  //State for course numbers
  const [courseNumbersArr, setCourseNumbersArr] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  //On page load, fetch departments and years from backend
  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
      //Fetch departments and convert to array of strings
      const departmentsRes = await fetch("http://localhost:3001/department");
      const departmentsData: { dept_name: string }[] = await departmentsRes.json();
      const temp_deptNames: string[] = departmentsData.map((dept) => dept.dept_name);

      //Fetch years and convert to array of numbers
      const yearsRes = await fetch("http://localhost:3001/year");
      const yearsData: { year: number }[] = await yearsRes.json();

      if(temp_deptNames[0].trim() === ""){
        temp_deptNames.splice(0, 1); //remove empty department name
      }

      const seasonsRes = await fetch(
        `http://localhost:3001/semesters?department=${temp_deptNames[0]}&year=${yearsData[0]?.year}`
      );
      const seasonsData: string[] = await seasonsRes.json();

      //Fetch course numbers for default department, year, and season
      const coursesRes = await fetch(
        `http://localhost:3001/semesters/courses?department=${temp_deptNames[0]}&year=${yearsData[0]?.year}&season=${seasonsData[0]}`
      );
      const coursesData: string[] = await coursesRes.json();
    
      const temp_yearsArr: number[] = yearsData.map((y) => y.year);
      if (isMounted) {
        //Set state arrays
        setDepartmentsArr(temp_deptNames);
        setYearsArr(temp_yearsArr);
        setSeasonsArr(seasonsData);
        setCourseNumbersArr(coursesData);
        //Set default selected department, year, season, and course
        setSelectedDepartment(temp_deptNames[0]);
        setSelectedYear(temp_yearsArr[0]);
        setSelectedSeason(seasonsData[0] || "FA");
        setSelectedCourse(coursesData[0] || "");
      }
    };
    fetchInitialData();

    return() =>{
      isMounted = false;
    };
  }, []);

  //When selected department, year, or season changes, update course numbers
  useEffect(() => {
    const fetchCourseNumbers = async () => {
      //get valid seasons
      const seasonsRes = await fetch(
        `http://localhost:3001/semesters?department=${selectedDepartment}&year=${selectedYear}`
      );
      const seasonsData: string[] = await seasonsRes.json();
      setSeasonsArr(seasonsData);
      //only update selected season if current selected season is not valid
      if(!seasonsData.includes(selectedSeason)){
        setSelectedSeason(seasonsData[0] || "FA");
      }

      //get course numbers
      const coursesRes = await fetch(
        `http://localhost:3001/semesters/courses?department=${selectedDepartment}&year=${selectedYear}&season=${selectedSeason}`
      );
      const coursesData: string[] = await coursesRes.json();
      setCourseNumbersArr(coursesData);
      setSelectedCourse(coursesData[0] || "");
    };
    fetchCourseNumbers();
  }, [selectedDepartment, selectedYear, selectedSeason]);

  function handleGetGraph() {
    router.push(`/graph?d=${selectedDepartment}&t=${selectedSeason}&y=${selectedYear}&n=${selectedCourse}`);
  }

  return (
    <div>
      <Button href="./easyCourses">Find Easy Courses</Button>
      <div className="flex flex-col gap-3 border-1 w-fit p-6 my-10">
        <Select
          label="Departments"
          items={departmentsArr}
          onChange={setSelectedDepartment}
          value={selectedDepartment}
        />
        <Select
          label="Terms"
          items={seasonsArr}
          onChange={setSelectedSeason}
          value={selectedSeason}
        />
        <Select 
          label="Year" 
          items={yearsArr} 
          onChange={setSelectedYear} 
          value={selectedYear} 
        />
        <Select
          label="Course Numbers"
          items={courseNumbersArr}
          onChange={setSelectedCourse}
          value={selectedCourse}
        />
        <button onClick={handleGetGraph}>
          Get Graph
        </button>
      </div>
    </div>
  );
}
