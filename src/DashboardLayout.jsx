
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  FileText,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

import { useAuth } from "./context/AuthContext";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const { currentAdmin, logout } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // Logout functionality
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Generate admin initials
  const adminInitials = currentAdmin?.fullName
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Students", icon: Users, path: "/students" },
    { name: "Courses", icon: BookOpen, path: "/courses" },
    { name: "Attendance", icon: ClipboardCheck, path: "/attendance" },
    { name: "Results", icon: GraduationCap, path: "/results" },
    { name: "Reports", icon: FileText, path: "/reports" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-emerald-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-700 p-2">
              <GraduationCap size={25} />
            </div>

            <h1 className="text-xl font-bold">Edu-Manage</h1>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 px-4 py-8">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Main Menu
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-emerald-700 text-white"
                        : "text-emerald-100 hover:bg-white/10"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* ADMIN PROFILE AND LOGOUT */}
        <div className="border-t border-white/10 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 font-semibold">
                {adminInitials || "AD"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {currentAdmin?.fullName || "Admin User"}
                </p>

                <p className="text-xs text-emerald-300">
                  Administrator
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="rounded-lg p-2 text-emerald-200 transition hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-h-screen lg:ml-64">

        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8 dark:border-slate-700 dark:bg-slate-800 transition-colors duration-300">

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Edu-Manage
              </h2>

              <p className="hidden text-xs text-slate-400 sm:block">
                Overview of your institution
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">

            {/* DARK MODE */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={21} /> : <Moon size={21} />}
            </button>

            {/* SEARCH */}
            <div className="hidden items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 md:flex">
              <Search size={18} className="text-slate-400" />

              <input
                type="text"
                placeholder="Search anything..."
                className="w-36 bg-transparent text-sm outline-none lg:w-48"
              />
            </div>

            {/* NOTIFICATIONS */}
            <button className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100">
              <Bell size={21} />

              <span className="absolute right-4 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* ADMIN AVATAR */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-800">
              {adminInitials || "AD"}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <Outlet />

      </main>
    </div>
  );
};

export default DashboardLayout;
