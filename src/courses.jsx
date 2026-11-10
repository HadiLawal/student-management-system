
import React, { useState, useEffect } from "react";
import {
    BookOpen,
    Plus,
    Search,
    Trash2,
    Pencil,
    X,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

import { useData } from "./context/DataContext";

const Courses = () => {
    // Shared courses from DataContext
    const { courses, setCourses } = useData();

    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [notification, setNotification] = useState({
        message: "",
        type: "",
    });

    const initialFormData = {
        name: "",
        code: "",
        instructor: "",
        duration: "",
    };

    const [formData, setFormData] = useState(initialFormData);

    // Notification function
    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
    };

    // Automatically remove notification after 3 seconds
    useEffect(() => {
        if (!notification.message) return;

        const timer = setTimeout(() => {
            setNotification({ message: "", type: "" });
        }, 3000);

        return () => clearTimeout(timer);
    }, [notification]);

    // Reset form
    const resetForm = () => {
        setFormData(initialFormData);
        setEditId(null);
        setShowForm(false);
    };

    // Add and update courses
    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.code.trim() ||
            !formData.instructor.trim() ||
            !formData.duration.trim()
        ) {
            showNotification("Please fill in all fields", "error");
            return;
        }

        // Check for duplicate course code
        const duplicateCode = courses.some(
            (course) =>
                course.code.trim().toLowerCase() ===
                    formData.code.trim().toLowerCase() &&
                course.id !== editId
        );

        if (duplicateCode) {
            showNotification(
                "This course code already exists!",
                "error"
            );
            return;
        }

        const cleanedData = {
            name: formData.name.trim(),
            code: formData.code.trim(),
            instructor: formData.instructor.trim(),
            duration: formData.duration.trim(),
        };

        if (editId !== null) {
            setCourses((prevCourses) =>
                prevCourses.map((course) =>
                    course.id === editId
                        ? { ...course, ...cleanedData }
                        : course
                )
            );

            showNotification("Course updated successfully!");
        } else {
            const newCourse = {
                id: Date.now(),
                ...cleanedData,
            };

            setCourses((prevCourses) => [
                ...prevCourses,
                newCourse,
            ]);

            showNotification("Course added successfully!");
        }

        resetForm();
    };

    // Search courses
    const filteredCourses = courses.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Delete course
    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmDelete) return;

        setCourses((prevCourses) =>
            prevCourses.filter((course) => course.id !== id)
        );

        showNotification("Course deleted successfully!");
    };

    // Edit course
    const handleEdit = (course) => {
        setFormData({
            name: course.name,
            code: course.code,
            instructor: course.instructor,
            duration: course.duration,
        });

        setEditId(course.id);
        setShowForm(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-5 sm:p-8">

            {/* Notification */}
            {notification.message && (
                <div
                    className={`fixed right-5 top-5 z-50 flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-medium text-white shadow-lg ${
                        notification.type === "success"
                            ? "bg-emerald-600"
                            : "bg-red-600"
                    }`}
                >
                    {notification.type === "success" ? (
                        <CheckCircle size={20} />
                    ) : (
                        <AlertCircle size={20} />
                    )}

                    {notification.message}

                    <button
                        onClick={() =>
                            setNotification({ message: "", type: "" })
                        }
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Page Header */}
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Courses
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage and monitor all available courses.
                    </p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="flex w-fit items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                    <Plus size={18} />
                    Add New Course
                </button>
            </div>

            {/* Course Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >

                    <h2 className="mb-6 text-lg font-bold text-slate-800">
                        {editId !== null ? "Edit Course" : "Add New Course"}
                    </h2>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                        {/* Course Name */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Course Name
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. Computer Science"
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

                        {/* Course Code */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Course Code
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. CSC101"
                                value={formData.code}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        code: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                                required
                            />
                        </div>

                        {/* Instructor */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Instructor
                            </label>

                            <input
                                type="text"
                                placeholder="Enter instructor name"
                                value={formData.instructor}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        instructor: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                                required
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Duration
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. 12 weeks"
                                value={formData.duration}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        duration: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                                required
                            />
                        </div>

                    </div>

                    {/* Form Buttons */}
                    <div className="mt-6 flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={resetForm}
                            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                        >
                            {editId !== null
                                ? "Update Course"
                                : "Save Course"}
                        </button>

                    </div>
                </form>
            )}

            {/* Search */}
            <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5">
                <div className="relative max-w-md">

                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-600"
                    />

                </div>
            </div>

            {/* Courses Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                    <div>
                        <h2 className="font-bold text-slate-800">
                            All Courses
                        </h2>

                        <p className="text-sm text-slate-500">
                            {courses.length} courses available
                        </p>
                    </div>

                    <BookOpen className="text-emerald-700" size={22} />
                </div>

                {filteredCourses.length === 0 ? (
                    <div className="p-10 text-center">
                        <BookOpen
                            size={35}
                            className="mx-auto mb-3 text-slate-300"
                        />

                        <h3 className="font-semibold text-slate-700">
                            {courses.length === 0
                                ? "No courses found"
                                : "No matching courses"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            {courses.length === 0
                                ? "Start by adding your first course."
                                : "Try searching with another keyword."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[750px] text-left text-sm">

                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Actions</th>
                                    <th className="px-6 py-4">Course Name</th>
                                    <th className="px-6 py-4">Course Code</th>
                                    <th className="px-6 py-4">Instructor</th>
                                    <th className="px-6 py-4">Duration</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {filteredCourses.map((course) => (
                                    <tr
                                        key={course.id}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleEdit(course)}
                                                className="rounded-lg p-2 text-blue-500 hover:bg-blue-50"
                                                title="Edit course"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                                title="Delete course"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>

                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                            {course.name}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {course.code}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {course.instructor}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {course.duration}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>
                        </table>

                    </div>
                )}

            </div>

        </div>
    );
};

export default Courses;
