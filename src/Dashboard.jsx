
import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Users,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
  ArrowUpRight,
  FileText,
} from "lucide-react";

import { useData } from "./context/DataContext";

const Dashboard = () => {
  const navigate = useNavigate();

  // Get shared application data
  const { students, courses, attendance, results } = useData();

  // Attendance calculations
  const attendanceRecords = attendance.flatMap(
    (record) => record.records || []
  );

  const presentCount = attendanceRecords.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = attendanceRecords.filter(
    (record) => record.status === "Absent"
  ).length;

  const lateCount = attendanceRecords.filter(
    (record) => record.status === "Late"
  ).length;

  const markedCount = presentCount + absentCount + lateCount;

  const attendanceRate = markedCount
    ? Math.round(
        ((presentCount + lateCount * 0.5) / markedCount) * 100
      )
    : 0;

  // Attendance percentages
  const presentPercentage = markedCount
    ? Math.round((presentCount / markedCount) * 100)
    : 0;

  const absentPercentage = markedCount
    ? Math.round((absentCount / markedCount) * 100)
    : 0;

  const latePercentage = markedCount
    ? Math.round((lateCount / markedCount) * 100)
    : 0;

  // Enrollment by course
  const enrollmentByCourse = courses.map((course) => {
    const enrolledStudents = students.filter(
      (student) =>
        String(student.course).toLowerCase() ===
          String(course.name).toLowerCase() ||
        String(student.course) === String(course.id)
    ).length;

    return {
      name: course.name,
      students: enrolledStudents,
    };
  });

  const maxEnrollment = Math.max(
    ...enrollmentByCourse.map((item) => item.students),
    1
  );

  // Recent students
  const recentStudents = [...students].reverse().slice(0, 4);

  // Dashboard statistics
  const statistics = [
    {
      title: "Total Students",
      value: students.length,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Courses",
      value: courses.length,
      icon: BookOpen,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Attendance Rate",
      value: `${attendanceRate}%`,
      icon: ClipboardCheck,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Results Recorded",
      value: results.length,
      icon: GraduationCap,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="space-y-8 p-5 sm:p-8">

      {/* WELCOME SECTION */}
      <section>
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Welcome back, Admin
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Here's what's happening in your institution today.
        </p>
      </section>

      {/* STATISTICS CARDS */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${item.color}`}>
                  <Icon size={22} />
                </div>
              </div>

              <p className="mt-5 text-sm text-slate-500">
                {item.title}
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-800">
                {item.value}
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Current records
              </p>
            </div>
          );
        })}
      </section>

      {/* CHARTS SECTION */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ENROLLMENT BY COURSE */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-2">

          <div>
            <h3 className="font-bold text-slate-800">
              Student Enrollment
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Number of students registered in each course
            </p>
          </div>

          {enrollmentByCourse.length === 0 ? (
            <div className="flex h-56 flex-col items-center justify-center text-center">
              <BookOpen size={35} className="mb-3 text-slate-300" />

              <p className="font-medium text-slate-600">
                No courses available
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Add courses to view enrollment statistics.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              {enrollmentByCourse.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="truncate text-sm text-slate-600">
                      {item.name}
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      {item.students}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{
                        width: `${(item.students / maxEnrollment) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ATTENDANCE OVERVIEW */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

          <h3 className="font-bold text-slate-800">
            Attendance Overview
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Overall attendance rate
          </p>

          <div className="flex flex-col items-center py-8">
            <div
              className="relative flex h-40 w-40 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(
                  #059669 0% ${presentPercentage}%,
                  #eab308 ${presentPercentage}% ${presentPercentage + latePercentage}%,
                  #ef4444 ${presentPercentage + latePercentage}% 100%
                )`,
              }}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white">
                <h3 className="text-3xl font-bold text-slate-800">
                  {attendanceRate}%
                </h3>

                <p className="text-xs text-slate-400">
                  Attendance
                </p>
              </div>
            </div>

            <div className="mt-7 w-full space-y-4">

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  Present
                </span>

                <span className="font-semibold text-slate-800">
                  {presentPercentage}%
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                  Late
                </span>

                <span className="font-semibold text-slate-800">
                  {latePercentage}%
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  Absent
                </span>

                <span className="font-semibold text-slate-800">
                  {absentPercentage}%
                </span>
              </div>

              {markedCount === 0 && (
                <p className="pt-2 text-center text-xs text-slate-400">
                  No attendance records available.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* RECENT STUDENTS */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm xl:col-span-2">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">
                Recent Students
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                Recently registered students
              </p>
            </div>

            <button
              onClick={() => navigate("/students")}
              className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-emerald-700"
            >
              View All
              <ArrowUpRight size={15} />
            </button>
          </div>

          {recentStudents.length === 0 ? (
            <div className="py-12 text-center">
              <Users
                size={35}
                className="mx-auto mb-3 text-slate-300"
              />

              <p className="font-medium text-slate-600">
                No students registered yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Registered students will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[550px] text-left">

                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-400">
                    <th className="pb-4 font-medium">Student</th>
                    <th className="pb-4 font-medium">Course</th>
                    <th className="pb-4 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-slate-50 last:border-0"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                            {student.name
                              ?.split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              {student.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 text-sm text-slate-500">
                        {student.course || "Not assigned"}
                      </td>

                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            student.status === "Active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {student.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

        {/* ACADEMIC OVERVIEW */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">

          <h3 className="font-bold text-slate-800">
            Academic Overview
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Current system records
          </p>

          <div className="mt-6 space-y-6">

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <UserCheck size={20} />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700">
                  Attendance Records
                </h4>

                <p className="mt-1 text-xs text-slate-400">
                  {attendance.length} recorded dates
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                <FileText size={20} />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700">
                  Results
                </h4>

                <p className="mt-1 text-xs text-slate-400">
                  {results.length} results recorded
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                <Clock size={20} />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700">
                  Students Without Results
                </h4>

                <p className="mt-1 text-xs text-slate-400">
                  {Math.max(students.length - new Set(
                    results.map((result) => String(result.studentId))
                  ).size, 0)} students
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;
