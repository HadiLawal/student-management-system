
import React, { useState, useEffect } from "react";
import {
    Users,
    TrendingUp,
    CalendarDays,
    Download,
    Award,
} from "lucide-react";
import { useData } from "./context/DataContext";

const Reports = () => {
    const {
        students,
        courses,
        attendance,
        results,
    } = useData();

    const [selectedPeriod, setSelectedPeriod] = useState("This Month");

    // Get date range
    const getDateRange = () => {
        const today = new Date();
        const start = new Date(today);
        const end = new Date(today);

        if (selectedPeriod === "This Week") {
            const day = today.getDay();
            const difference = day === 0 ? 6 : day - 1;

            start.setDate(today.getDate() - difference);
        } else if (selectedPeriod === "This Month") {
            start.setDate(1);
        } else if (selectedPeriod === "This Year") {
            start.setMonth(0, 1);
        } else {
            return null;
        }

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return { start, end };
    };

    // Filter attendance by period
    const dateRange = getDateRange();

    const filteredAttendance = attendance.filter((record) => {
        if (!dateRange) return true;

        if (!record.date) return false;

        const recordDate = new Date(`${record.date}T00:00:00`);

        return (
            !isNaN(recordDate.getTime()) &&
            recordDate >= dateRange.start &&
            recordDate <= dateRange.end
        );
    });

    // Collect attendance entries
    const attendanceEntries = filteredAttendance.flatMap(
        (record) => record.records || []
    );

    // Normalize attendance statuses
    const normalizedEntries = attendanceEntries.map((item) => ({
        ...item,
        normalizedStatus: String(item.status || "")
            .trim()
            .toLowerCase(),
    }));

    const presentCount = normalizedEntries.filter(
        (item) => item.normalizedStatus === "present"
    ).length;

    const absentCount = normalizedEntries.filter(
        (item) => item.normalizedStatus === "absent"
    ).length;

    const lateCount = normalizedEntries.filter(
        (item) => item.normalizedStatus === "late"
    ).length;

    const markedAttendance = presentCount + absentCount + lateCount;

    // Attendance percentages
    const presentPercentage = markedAttendance
        ? Math.round((presentCount / markedAttendance) * 100)
        : 0;

    const absentPercentage = markedAttendance
        ? Math.round((absentCount / markedAttendance) * 100)
        : 0;

    const latePercentage = markedAttendance
        ? Math.round((lateCount / markedAttendance) * 100)
        : 0;

    // Late students count as having attended
    const attendanceRate = markedAttendance
        ? Math.round(
            ((presentCount + lateCount) / markedAttendance) * 100
        )
        : 0;

    // Debug attendance data
    useEffect(() => {
        console.log("Attendance records:", attendance);
        console.log("Filtered attendance:", filteredAttendance);
        console.log("Attendance entries:", attendanceEntries);
        console.log("Present:", presentCount);
        console.log("Absent:", absentCount);
        console.log("Late:", lateCount);
        console.log("Attendance rate:", attendanceRate);
    }, [
        attendance,
        selectedPeriod,
        presentCount,
        absentCount,
        lateCount,
        attendanceRate,
    ]);

    // Result statistics
    const averageScore = results.length
        ? Math.round(
            results.reduce(
                (total, result) => total + Number(result.score || 0),
                0
            ) / results.length
        )
        : 0;

    const passRate = results.length
        ? Math.round(
            (results.filter(
                (result) => Number(result.score) >= 50
            ).length / results.length) * 100
        )
        : 0;

    // Subject performance
    const subjectPerformance = Object.values(
        results.reduce((groups, result) => {
            const subject = result.subject || "Unknown Subject";

            if (!groups[subject]) {
                groups[subject] = {
                    subject,
                    totalScore: 0,
                    count: 0,
                };
            }

            groups[subject].totalScore += Number(result.score || 0);
            groups[subject].count += 1;

            return groups;
        }, {})
    ).map((item) => ({
        subject: item.subject,
        score: Math.round(item.totalScore / item.count),
    }));

    // Grade categories
    const gradeCategories = [
        {
            grade: "A",
            color: "bg-green-500",
            light: "bg-green-50",
            text: "text-green-600",
            min: 80,
            max: 100,
        },
        {
            grade: "B",
            color: "bg-blue-500",
            light: "bg-blue-50",
            text: "text-blue-600",
            min: 70,
            max: 79,
        },
        {
            grade: "C",
            color: "bg-purple-500",
            light: "bg-purple-50",
            text: "text-purple-600",
            min: 60,
            max: 69,
        },
        {
            grade: "D",
            color: "bg-yellow-500",
            light: "bg-yellow-50",
            text: "text-yellow-600",
            min: 50,
            max: 59,
        },
        {
            grade: "F",
            color: "bg-red-500",
            light: "bg-red-50",
            text: "text-red-600",
            min: 0,
            max: 49,
        },
    ];

    const gradeDistribution = gradeCategories.map((category) => ({
        ...category,
        count: results.filter((result) => {
            const score = Number(result.score);

            return score >= category.min && score <= category.max;
        }).length,
    }));

    // Export report as CSV
    const handleExportReport = () => {
        const reportData = [
            ["School Performance Report"],
            ["Reporting Period", selectedPeriod],
            [],
            ["General Statistics"],
            ["Total Registered Students", students.length],
            ["Total Registered Courses", courses.length],
            ["Total Results", results.length],
            ["Average Score", `${averageScore}%`],
            ["Pass Rate", `${passRate}%`],
            [],
            ["Attendance Summary"],
            ["Attendance Records", markedAttendance],
            ["Present", `${presentPercentage}%`],
            ["Absent", `${absentPercentage}%`],
            ["Late", `${latePercentage}%`],
            ["Attendance Rate", `${attendanceRate}%`],
            [],
            ["Subject Performance"],
            ["Subject", "Average Score"],
            ...subjectPerformance.map((item) => [
                item.subject,
                `${item.score}%`,
            ]),
            [],
            ["Grade Distribution"],
            ["Grade", "Number of Results"],
            ...gradeDistribution.map((item) => [
                item.grade,
                item.count,
            ]),
        ];

        const escapeCSV = (value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`;

        const csvContent = reportData
            .map((row) => row.map(escapeCSV).join(","))
            .join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "school-report.csv";
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-5 sm:p-8">

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    Reports & Analytics
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Monitor school performance and generate reports.
                </p>

                <button
                    onClick={handleExportReport}
                    className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            {/* Reports Overview */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Total Students
                        </p>
                        <Users size={22} className="text-blue-500" />
                    </div>

                    <h2 className="mt-3 text-3xl font-bold text-slate-800">
                        {students.length}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Attendance Rate
                        </p>
                        <CalendarDays size={22} className="text-green-500" />
                    </div>

                    <h2 className="mt-3 text-3xl font-bold text-green-600">
                        {attendanceRate}%
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Average Score
                        </p>
                        <TrendingUp size={22} className="text-purple-500" />
                    </div>

                    <h2 className="mt-3 text-3xl font-bold text-purple-600">
                        {averageScore}%
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Pass Rate
                        </p>
                        <Award size={22} className="text-orange-500" />
                    </div>

                    <h2 className="mt-3 text-3xl font-bold text-orange-600">
                        {passRate}%
                    </h2>
                </div>

            </div>

            {/* Report Period Filter */}
            <div className="mb-8 flex flex-col justify-between gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">

                <div>
                    <h2 className="font-bold text-slate-800">
                        Report Overview
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Select a period to filter attendance statistics.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <CalendarDays size={20} className="text-slate-500" />

                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
                    >
                        <option value="This Week">This Week</option>
                        <option value="This Month">This Month</option>
                        <option value="This Year">This Year</option>
                        <option value="All Time">All Time</option>
                    </select>
                </div>

            </div>

            {/* Subject Performance */}
            <div className="mb-8 rounded-xl bg-white p-5 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-800">
                        Subject Performance
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Average scores across registered courses.
                    </p>
                </div>

                {subjectPerformance.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">
                        No results available to calculate subject performance.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {subjectPerformance.map((item) => (
                            <div key={item.subject}>
                                <div className="mb-2 flex justify-between">
                                    <span className="text-sm font-medium text-slate-700">
                                        {item.subject}
                                    </span>

                                    <span className="text-sm font-semibold text-slate-700">
                                        {item.score}%
                                    </span>
                                </div>

                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-blue-600 transition-all"
                                        style={{ width: `${item.score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Attendance Summary */}
            <div className="mb-8 rounded-xl bg-white p-5 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-800">
                        Attendance Summary
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Attendance records for {selectedPeriod.toLowerCase()}.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

                    <div className="rounded-xl bg-green-50 p-5">
                        <p className="text-sm font-medium text-green-700">
                            Present
                        </p>

                        <h3 className="mt-2 text-3xl font-bold text-green-700">
                            {presentPercentage}%
                        </h3>

                        <div className="mt-3 h-2 rounded-full bg-green-100">
                            <div
                                className="h-full rounded-full bg-green-500"
                                style={{ width: `${presentPercentage}%` }}
                            />
                        </div>

                        <p className="mt-2 text-xs text-green-700">
                            {presentCount} records
                        </p>
                    </div>

                    <div className="rounded-xl bg-red-50 p-5">
                        <p className="text-sm font-medium text-red-700">
                            Absent
                        </p>

                        <h3 className="mt-2 text-3xl font-bold text-red-700">
                            {absentPercentage}%
                        </h3>

                        <div className="mt-3 h-2 rounded-full bg-red-100">
                            <div
                                className="h-full rounded-full bg-red-500"
                                style={{ width: `${absentPercentage}%` }}
                            />
                        </div>

                        <p className="mt-2 text-xs text-red-700">
                            {absentCount} records
                        </p>
                    </div>

                    <div className="rounded-xl bg-yellow-50 p-5">
                        <p className="text-sm font-medium text-yellow-700">
                            Late
                        </p>

                        <h3 className="mt-2 text-3xl font-bold text-yellow-700">
                            {latePercentage}%
                        </h3>

                        <div className="mt-3 h-2 rounded-full bg-yellow-100">
                            <div
                                className="h-full rounded-full bg-yellow-500"
                                style={{ width: `${latePercentage}%` }}
                            />
                        </div>

                        <p className="mt-2 text-xs text-yellow-700">
                            {lateCount} records
                        </p>
                    </div>

                </div>

                {markedAttendance === 0 && (
                    <p className="mt-5 rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500">
                        No attendance has been recorded for this period.
                    </p>
                )}
            </div>

            {/* Grade Distribution */}
            <div className="mb-8 rounded-xl bg-white p-5 shadow-sm">
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-800">
                        Grade Distribution
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Distribution of results across grade categories.
                    </p>
                </div>

                {results.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">
                        No results available to calculate grade distribution.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                        {gradeDistribution.map((item) => {
                            const percentage = Math.round(
                                (item.count / results.length) * 100
                            );

                            return (
                                <div
                                    key={item.grade}
                                    className={`${item.light} rounded-xl p-4`}
                                >
                                    <p className={`text-sm font-medium ${item.text}`}>
                                        Grade {item.grade}
                                    </p>

                                    <h3 className={`mt-2 text-3xl font-bold ${item.text}`}>
                                        {item.count}
                                    </h3>

                                    <div className="mt-3 h-2 rounded-full bg-white">
                                        <div
                                            className={`h-full rounded-full ${item.color}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>

                                    <p className="mt-2 text-xs text-slate-500">
                                        {percentage}% of results
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Reports;
