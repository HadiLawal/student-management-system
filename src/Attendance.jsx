
import React, { useState, useEffect } from "react";
import {
    CalendarDays,
    Users,
    UserCheck,
    UserX,
    Clock,
} from "lucide-react";

import { useData } from "./context/DataContext";

const Attendance = () => {
    // Get shared data
    const { students, attendance, setAttendance } = useData();
    console.log("Saved attendance:", attendance);
    console.log("Registered students:", students);

    // Selected date
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    // Attendance being marked for the selected date
    const [attendanceDraft, setAttendanceDraft] = useState({});

    // Notification message
    const [message, setMessage] = useState("");

    // Load saved attendance whenever the date or student list changes
    useEffect(() => {
        const savedRecord = attendance.find(
            (record) => record.date === selectedDate
        );

        const savedStatuses = {};

        if (savedRecord) {
            savedRecord.records.forEach((record) => {
                savedStatuses[record.studentId] = record.status;
            });
        }

        setAttendanceDraft(savedStatuses);
        setMessage("");
    }, [selectedDate, attendance, students]);

    // Update a student's attendance status
    const handleStatusChange = (studentId, status) => {
        setAttendanceDraft((prev) => ({
            ...prev,
            [studentId]: status,
        }));

        setMessage("");
    };

    // Save attendance
    const handleSaveAttendance = () => {
        if (students.length === 0) {
            setMessage("Register students before marking attendance.");
            return;
        }

        const unmarkedStudents = students.filter(
            (student) => !attendanceDraft[student.id]
        );

        if (unmarkedStudents.length > 0) {
            setMessage("Please mark attendance for every student.");
            return;
        }

        const attendanceRecord = {
            date: selectedDate,
            records: students.map((student) => ({
                studentId: student.id,
                name: student.name,
                status: attendanceDraft[student.id],
            })),
        };

        // Update existing date or add a new date
        setAttendance((prevAttendance) => {
            const existingRecord = prevAttendance.some(
                (record) => record.date === selectedDate
            );

            if (existingRecord) {
                return prevAttendance.map((record) =>
                    record.date === selectedDate
                        ? attendanceRecord
                        : record
                );
            }

            return [...prevAttendance, attendanceRecord];
        });

        setMessage("Attendance saved successfully!");
    };

    // Get current attendance for registered students
    const currentStudents = students.map((student) => ({
        ...student,
        status: attendanceDraft[student.id] || "Not Marked",
    }));

    // Attendance statistics
    const totalStudents = currentStudents.length;

    const presentStudents = currentStudents.filter(
        (student) => student.status === "Present"
    ).length;

    const absentStudents = currentStudents.filter(
        (student) => student.status === "Absent"
    ).length;

    const lateStudents = currentStudents.filter(
        (student) => student.status === "Late"
    ).length;

    const attendancePercentage = totalStudents
        ? Math.round(
            ((presentStudents + lateStudents * 0.5) / totalStudents) * 100
        )
        : 0;

    // Overview cards
    const statistics = [
        {
            title: "Total Students",
            value: totalStudents,
            icon: Users,
            color: "text-blue-500",
        },
        {
            title: "Present",
            value: presentStudents,
            icon: UserCheck,
            color: "text-green-500",
        },
        {
            title: "Absent",
            value: absentStudents,
            icon: UserX,
            color: "text-red-500",
        },
        {
            title: "Late",
            value: lateStudents,
            icon: Clock,
            color: "text-yellow-500",
        },
        {
            title: "Attendance Rate",
            value: `${attendancePercentage}%`,
            icon: Clock,
            color: "text-purple-500",
        },
    ];

    // Status badge styling
    const getStatusStyle = (status) => {
        switch (status) {
            case "Present":
                return "bg-green-100 text-green-700";

            case "Absent":
                return "bg-red-100 text-red-700";

            case "Late":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-slate-100 text-slate-500";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-5 sm:p-8">

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    Attendance
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Track and manage student attendance records.
                </p>
            </div>

            {/* Attendance Overview */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">

                {statistics.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="rounded-xl bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-slate-500">
                                    {item.title}
                                </p>

                                <Icon className={item.color} size={22} />
                            </div>

                            <h2 className={`mt-3 text-3xl font-bold ${item.color}`}>
                                {item.value}
                            </h2>
                        </div>
                    );
                })}

            </div>

            {/* Attendance Register */}
            <div className="rounded-xl bg-white p-5 shadow-sm">

                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Attendance Register
                        </h2>

                        <p className="text-sm text-slate-500">
                            Mark and manage student attendance.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                        {/* Date Picker */}
                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                            <CalendarDays
                                size={18}
                                className="text-slate-500"
                            />

                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                className="text-sm text-slate-600 outline-none"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSaveAttendance}
                            disabled={students.length === 0}
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Save Attendance
                        </button>

                    </div>
                </div>

                {/* Notification */}
                {message && (
                    <div className={`mb-5 rounded-lg p-3 text-sm ${
                        message.includes("successfully")
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                    }`}>
                        {message}
                    </div>
                )}

                {/* Attendance Table */}
                {students.length === 0 ? (
                    <div className="py-12 text-center">
                        <Users
                            size={40}
                            className="mx-auto mb-3 text-slate-300"
                        />

                        <h3 className="font-semibold text-slate-700">
                            No students registered
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Register students before taking attendance.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px] text-left">

                            <thead>
                                <tr className="border-b border-slate-200 text-sm text-slate-500">
                                    <th className="px-4 py-3 font-medium">
                                        Student Name
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Status
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="border-b border-slate-100"
                                    >

                                        <td className="px-4 py-4 font-medium text-slate-700">
                                            {student.name}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(student.status)}`}>
                                                {student.status}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <select
                                                value={student.status}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        student.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                            >
                                                <option value="Not Marked" disabled>
                                                    Select Status
                                                </option>

                                                <option value="Present">
                                                    Present
                                                </option>

                                                <option value="Absent">
                                                    Absent
                                                </option>

                                                <option value="Late">
                                                    Late
                                                </option>
                                            </select>
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

export default Attendance;
