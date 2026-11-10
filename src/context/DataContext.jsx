
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { useAuth } from "./AuthContext";

const DataContext = createContext();

// Load data belonging to a particular administrator
const loadAdminData = (adminId, dataName) => {
  if (!adminId) return [];

  const adminKey = `${dataName}_${adminId}`;

  // Check whether this admin already has saved data
  const savedData = localStorage.getItem(adminKey);

  if (savedData !== null) {
    try {
      return JSON.parse(savedData);
    } catch {
      return [];
    }
  }

  // Check whether this is the first registered admin
  const admins = JSON.parse(
    localStorage.getItem("adminAccounts") || "[]"
  );

  const isFirstAdmin = admins[0]?.id === adminId;

  // Preserve and copy existing unassigned records
  if (isFirstAdmin) {
    const oldData = localStorage.getItem(dataName);

    if (oldData !== null) {
      try {
        const parsedData = JSON.parse(oldData);

        localStorage.setItem(
          adminKey,
          JSON.stringify(parsedData)
        );

        return parsedData;
      } catch {
        return [];
      }
    }
  }

  return [];
};

const AdminDataProvider = ({ children, adminId }) => {

  // Students
  const [students, setStudents] = useState(() =>
    loadAdminData(adminId, "students")
  );

  // Courses
  const [courses, setCourses] = useState(() =>
    loadAdminData(adminId, "courses")
  );

  // Attendance
  const [attendance, setAttendance] = useState(() =>
    loadAdminData(adminId, "attendance")
  );

  // Results
  const [results, setResults] = useState(() =>
    loadAdminData(adminId, "results")
  );

  // Save students
  useEffect(() => {
    if (!adminId) return;

    localStorage.setItem(
      `students_${adminId}`,
      JSON.stringify(students)
    );
  }, [students, adminId]);

  // Save courses
  useEffect(() => {
    if (!adminId) return;

    localStorage.setItem(
      `courses_${adminId}`,
      JSON.stringify(courses)
    );
  }, [courses, adminId]);

  // Save attendance
  useEffect(() => {
    if (!adminId) return;

    localStorage.setItem(
      `attendance_${adminId}`,
      JSON.stringify(attendance)
    );
  }, [attendance, adminId]);

  // Save results
  useEffect(() => {
    if (!adminId) return;

    localStorage.setItem(
      `results_${adminId}`,
      JSON.stringify(results)
    );
  }, [results, adminId]);

  return (
    <DataContext.Provider
      value={{
        students,
        setStudents,
        courses,
        setCourses,
        attendance,
        setAttendance,
        results,
        setResults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Main Data Provider
export const DataProvider = ({ children }) => {
  const { currentAdmin } = useAuth();

  const adminId = currentAdmin?.id || null;

  return (
    <AdminDataProvider
      key={adminId || "guest"}
      adminId={adminId}
    >
      {children}
    </AdminDataProvider>
  );
};

export const useData = () => useContext(DataContext);
