
import React, { useState } from "react";
import {
    Award,
    Users,
    BookOpen,
    TrendingUp,
    Plus,
    Search,
    Pencil,
    Trash2,
} from "lucide-react";
import { useData } from "./context/DataContext";

const Results = () => {
    const { results, setResults, students, courses } = useData();

    const [searchTerm, setSearchTerm] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        studentId: "",
        courseId: "",
        score: "",
    });

    // Results statistics
    const totalStudents = new Set(
        results.map((result) => result.studentId ?? result.student)
    ).size;

    const totalSubjects = new Set(
        results.map((result) => result.courseId ?? result.subject)
    ).size;

    const averageScore = results.length
        ? Math.round(
            results.reduce((total, result) => total + Number(result.score), 0) /
            results.length
        )
        : 0;

    const passRate = results.length
        ? Math.round(
            (results.filter((result) => result.score >= 50).length /
                results.length) * 100
        )
        : 0;

    // Search results
    const filteredResults = results.filter((result) =>
        result.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reset form
    const resetForm = () => {
        setFormData({
            studentId: "",
            courseId: "",
            score: "",
        });

        setEditId(null);
        setShowForm(false);
    };

    // Add or update result
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.studentId || !formData.courseId || formData.score === "") {
            alert("Please fill in all fields.");
            return;
        }

        const score = Number(formData.score);

        if (!Number.isFinite(score) || score < 0 || score > 100) {
            alert("Score must be between 0 and 100.");
            return;
        }

        const selectedStudent = students.find(
            (student) => String(student.id) === formData.studentId
        );

        const selectedCourse = courses.find(
            (course) => String(course.id) === formData.courseId
        );

        if (!selectedStudent || !selectedCourse) {
            alert("Please select a valid student and course.");
            return;
        }

        const resultData = {
            studentId: selectedStudent.id,
            student: selectedStudent.name,
            courseId: selectedCourse.id,
            subject: selectedCourse.name,
            score,
        };

        if (editId !== null) {
            setResults((prevResults) =>
                prevResults.map((result) =>
                    result.id === editId
                        ? { ...result, ...resultData }
                        : result
                )
            );
        } else {
            setResults((prevResults) => [
                ...prevResults,
                {
                    id: Date.now(),
                    ...resultData,
                },
            ]);
        }

        resetForm();
    };

    // Edit result
    const handleEditResult = (result) => {
        setEditId(result.id);

        setFormData({
            studentId: String(result.studentId ?? ""),
            courseId: String(result.courseId ?? ""),
            score: String(result.score),
        });

        setShowForm(true);
    };

    // Delete result
    const handleDeleteResult = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this result?"
        );

        if (!confirmDelete) return;

        setResults((prevResults) =>
            prevResults.filter((result) => result.id !== id)
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 p-5 sm:p-8">

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    Academic Results
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Manage and monitor students' academic performance.
                </p>
            </div>

            {/* Results Overview */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">Total Students</p>
                        <Users className="text-blue-500" size={22} />
                    </div>
                    <h2 className="mt-3 text-3xl font-bold text-slate-800">
                        {totalStudents}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">Total Subjects</p>
                        <BookOpen className="text-purple-500" size={22} />
                    </div>
                    <h2 className="mt-3 text-3xl font-bold text-purple-600">
                        {totalSubjects}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">Average Score</p>
                        <TrendingUp className="text-green-500" size={22} />
                    </div>
                    <h2 className="mt-3 text-3xl font-bold text-green-600">
                        {averageScore}%
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">Pass Rate</p>
                        <Award className="text-orange-500" size={22} />
                    </div>
                    <h2 className="mt-3 text-3xl font-bold text-orange-600">
                        {passRate}%
                    </h2>
                </div>

            </div>

            {/* Results Table */}
            <div className="rounded-xl bg-white p-5 shadow-sm">

                {/* Add/Edit Result Form */}
                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5"
                    >
                        <h3 className="mb-5 text-lg font-semibold text-slate-800">
                            {editId !== null ? "Edit Result" : "Add New Result"}
                        </h3>

                        {students.length === 0 || courses.length === 0 ? (
                            <p className="mb-4 text-sm text-red-600">
                                {students.length === 0
                                    ? "Register at least one student before adding results."
                                    : "Add at least one course before adding results."}
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                {/* Student Selection */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">
                                        Student Name
                                    </label>

                                    <select
                                        value={formData.studentId}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                studentId: e.target.value,
                                            })
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    >
                                        <option value="">Select student</option>

                                        {students.map((student) => (
                                            <option
                                                key={student.id}
                                                value={String(student.id)}
                                            >
                                                {student.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Course Selection */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">
                                        Course
                                    </label>

                                    <select
                                        value={formData.courseId}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                courseId: e.target.value,
                                            })
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    >
                                        <option value="">Select course</option>

                                        {courses.map((course) => (
                                            <option
                                                key={course.id}
                                                value={String(course.id)}
                                            >
                                                {course.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Score */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-600">
                                        Score
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.score}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                score: e.target.value,
                                            })
                                        }
                                        placeholder="Enter score (0-100)"
                                        required
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                                    />
                                </div>

                            </div>
                        )}

                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={students.length === 0 || courses.length === 0}
                                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {editId !== null ? "Update Result" : "Save Result"}
                            </button>
                        </div>
                    </form>
                )}

                {/* Table Header and Search */}
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Student Results
                        </h2>
                        <p className="text-sm text-slate-500">
                            View students' academic performance.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                            <Search size={18} className="text-slate-400" />

                            <input
                                type="text"
                                placeholder="Search by student or subject..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full text-sm outline-none"
                            />
                        </div>

                        <button
                            onClick={() => {
                                if (showForm) {
                                    resetForm();
                                } else {
                                    setEditId(null);
                                    setFormData({
                                        studentId: "",
                                        courseId: "",
                                        score: "",
                                    });
                                    setShowForm(true);
                                }
                            }}
                            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <Plus size={18} />
                            Add Result
                        </button>
                    </div>
                </div>

                {/* Results Table */}
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left">

                        <thead>
                            <tr className="border-b border-slate-200 text-sm text-slate-500">
                                <th className="px-4 py-3 font-medium">Student Name</th>
                                <th className="px-4 py-3 font-medium">Course</th>
                                <th className="px-4 py-3 font-medium">Score</th>
                                <th className="px-4 py-3 font-medium">Grade</th>
                                <th className="px-4 py-3 font-medium">Remark</th>
                                <th className="px-4 py-3 font-medium">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredResults.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 py-10 text-center text-sm text-slate-500"
                                    >
                                        {results.length === 0
                                            ? "No results have been added yet."
                                            : "No results match your search."}
                                    </td>
                                </tr>
                            ) : (
                                filteredResults.map((result) => {
                                    const grade =
                                        result.score >= 80 ? "A" :
                                            result.score >= 70 ? "B" :
                                                result.score >= 60 ? "C" :
                                                    result.score >= 50 ? "D" : "F";

                                    const remark =
                                        result.score >= 50 ? "Passed" : "Failed";

                                    return (
                                        <tr
                                            key={result.id}
                                            className="border-b border-slate-100"
                                        >
                                            <td className="px-4 py-4 font-medium text-slate-700">
                                                {result.student}
                                            </td>

                                            <td className="px-4 py-4 text-slate-600">
                                                {result.subject}
                                            </td>

                                            <td className="px-4 py-4 font-semibold text-slate-700">
                                                {result.score}%
                                            </td>

                                            <td className="px-4 py-4">
                                                <span className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
                                                    {grade}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        remark === "Passed"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {remark}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditResult(result)}
                                                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                                        title="Edit Result"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteResult(result.id)}
                                                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                                                        title="Delete Result"
                                                    >
                                                        <Trash2 size={18} />
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

            </div>
        </div>
    );
};

export default Results;
