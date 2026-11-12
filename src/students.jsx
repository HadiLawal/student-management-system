
import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { useData } from "./context/DataContext";

const Students = () => {
  // Shared data
  const {
    students,
    setStudents,
    courses,
    results,
    setResults,
    attendance,
    setAttendance,
  } = useData();

  // Local page states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const initialFormData = {
    name: "",
    email: "",
    studentId: "",
    courseId: "",
    status: "Active",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");

  // Get a student's course
  // Supports both new courseId records and older course-name records
  const getStudentCourse = (student) => {
    if (student.courseId !== undefined && student.courseId !== null) {
      return courses.find(
        (course) => String(course.id) === String(student.courseId)
      );
    }

    return courses.find(
      (course) =>
        course.name.toLowerCase() ===
        (student.course || "").toLowerCase()
    );
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setEditingStudent(null);
    setShowForm(false);
    setError("");
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Find the selected course
    const selectedCourse = courses.find(
      (course) => String(course.id) === String(formData.courseId)
    );

    if (!selectedCourse) {
      setError("Please select an available course.");
      return;
    }

    // Check duplicate student ID
    const studentIdExists = students.some(
      (student) =>
        student.studentId.toLowerCase() ===
          formData.studentId.trim().toLowerCase() &&
        student.id !== editingStudent
    );

    // Check duplicate email
    const emailExists = students.some(
      (student) =>
        student.email.toLowerCase() ===
          formData.email.trim().toLowerCase() &&
        student.id !== editingStudent
    );

    if (studentIdExists) {
      setError("This Student ID already exists.");
      return;
    }

    if (emailExists) {
      setError("This email address is already registered.");
      return;
    }

    // Prepare student data
    const studentData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      studentId: formData.studentId.trim(),
      courseId: selectedCourse.id,
      status: formData.status,
    };

    if (editingStudent !== null) {
      // Update existing student
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === editingStudent
            ? {
                ...student,
                ...studentData,
              }
            : student
        )
      );
    } else {
      // Register new student
      const newStudent = {
        id: Date.now(),
        ...studentData,
      };

      setStudents((prevStudents) => [
        ...prevStudents,
        newStudent,
      ]);
    }

    resetForm();
  };

  // Open edit form
  const handleEdit = (student) => {
    const studentCourse = getStudentCourse(student);

    setFormData({
      name: student.name,
      email: student.email,
      studentId: student.studentId,
      courseId: studentCourse ? String(studentCourse.id) : "",
      status: student.status,
    });

    setEditingStudent(student.id);
    setShowForm(true);
    setError("");
  };

  // Delete student
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student? Their results and attendance records will also be deleted."
    );

    if (!confirmDelete) return;

    // Delete student
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== id)
    );

    // Delete the student's results
    setResults((prevResults) =>
      prevResults.filter(
        (result) => String(result.studentId) !== String(id)
      )
    );

    // Delete the student's attendance records
    setAttendance((prevAttendance) =>
      prevAttendance
        .map((record) => ({
          ...record,
          records: record.records.filter(
            (item) => String(item.studentId) !== String(id)
          ),
        }))
        .filter((record) => record.records.length > 0)
    );
  };

  // Student statistics
  const statistics = [
    {
      title: "Total Students",
      value: students.length,
      color: "bg-blue-100 text-blue-600",
      icon: Users,
    },
    {
      title: "Active Students",
      value: students.filter(
        (student) => student.status === "Active"
      ).length,
      color: "bg-emerald-100 text-emerald-600",
      icon: Users,
    },
    {
      title: "Pending Students",
      value: students.filter(
        (student) => student.status === "Pending"
      ).length,
      color: "bg-orange-100 text-orange-600",
      icon: Users,
    },
    {
      title: "Graduated Students",
      value: students.filter(
        (student) => student.status === "Graduated"
      ).length,
      color: "bg-purple-100 text-purple-600",
      icon: Users,
    },
  ];

  // Search and filter students
  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase();
    const studentCourse = getStudentCourse(student);

    const courseName =
      studentCourse?.name || student.course || "";

    const courseCode = studentCourse?.code || "";

    const matchesSearch =
      student.name.toLowerCase().includes(search) ||
      student.email.toLowerCase().includes(search) ||
      student.studentId.toLowerCase().includes(search) ||
      courseName.toLowerCase().includes(search) ||
      courseCode.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Status badge styles
  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-700";

      case "Pending":
        return "bg-orange-100 text-orange-700";

      case "Graduated":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5 sm:p-8">

      {/* PAGE HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Students
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and monitor your registered students.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex w-fit items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          <UserPlus size={18} />
          Add New Student
        </button>
      </div>

      {/* ADD / EDIT STUDENT FORM */}
      {showForm && (
        <section className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">

          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              {editingStudent !== null
                ? "Edit Student"
                : "Register New Student"}
            </h2>

            <button
              onClick={resetForm}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >

            {/* FULL NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                required
              />
            </div>

            {/* STUDENT ID */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Student ID
              </label>

              <input
                type="text"
                placeholder="Enter student ID"
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    studentId: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                required
              />
            </div>

            {/* COURSE SELECTION */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Select Course
              </label>

              <select
                value={formData.courseId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    courseId: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
                required
              >
                <option value="">
                  {courses.length === 0
                    ? "No courses available"
                    : "Choose a course"}
                </option>

                {courses.map((course) => (
                  <option
                    key={course.id}
                    value={course.id}
                  >
                    {course.name} ({course.code})
                  </option>
                ))}
              </select>

              {courses.length === 0 && (
                <p className="mt-2 text-xs text-red-500">
                  Please create a course on the Courses page before registering a student.
                </p>
              )}
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Status
              </label>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>

            {/* FORM BUTTONS */}
            <div className="flex items-end gap-3">
              <button
                type="submit"
                disabled={courses.length === 0}
                className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editingStudent !== null
                  ? "Update Student"
                  : "Save Student"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>

          </form>
        </section>
      )}

      {/* STUDENT STATISTICS */}
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

              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {item.value}
              </h2>
            </div>
          );
        })}

      </section>

      {/* SEARCH AND FILTER */}
      <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">

        {/* SEARCH */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 md:w-80">
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm outline-none"
          />
        </div>

        {/* STATUS FILTER */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
        >
          <option value="All">All Students</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Graduated">Graduated</option>
        </select>

      </section>

      {/* STUDENTS TABLE */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

        {/* TABLE HEADER */}
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-bold text-slate-800">
            All Students
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            A list of all registered students.
          </p>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">

            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
                <th className="p-4 font-semibold">Student</th>
                <th className="p-4 font-semibold">Student ID</th>
                <th className="p-4 font-semibold">Course</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center">
                    <Users
                      className="mx-auto mb-3 text-slate-300"
                      size={35}
                    />

                    <p className="font-semibold text-slate-600">
                      {students.length === 0
                        ? "No students found"
                        : "No matching students"}
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      {students.length === 0
                        ? "Add a student to see their details here."
                        : "Try changing your search or filter."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const studentCourse = getStudentCourse(student);

                  return (
                    <tr
                      key={student.id}
                      className="border-b border-slate-50 last:border-0"
                    >

                      <td className="p-4">
                        <p className="text-sm font-semibold text-slate-700">
                          {student.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {student.email}
                        </p>
                      </td>

                      <td className="p-4 text-sm text-slate-500">
                        {student.studentId}
                      </td>

                      <td className="p-4">
                        <p className="text-sm text-slate-600">
                          {studentCourse?.name ||
                            student.course ||
                            "Course unavailable"}
                        </p>

                        {studentCourse?.code && (
                          <p className="mt-1 text-xs text-slate-400">
                            {studentCourse.code}
                          </p>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(student.status)}`}
                        >
                          {student.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">

                          <button
                            onClick={() => handleEdit(student)}
                            title="Edit student"
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => handleDelete(student.id)}
                            title="Delete student"
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}

            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default Students;
