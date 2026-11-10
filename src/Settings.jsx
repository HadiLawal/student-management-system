
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User,
  Bell,
  Shield,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";

import { useAuth } from "./context/AuthContext";

const Settings = () => {
  const navigate = useNavigate();
  const { currentAdmin, deleteAccount } = useAuth();

  const [adminInfo, setAdminInfo] = useState({
    name: currentAdmin?.fullName || "",
    email: currentAdmin?.email || "",
    role: "Administrator",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    attendance: true,
    results: false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  // CHANGE PASSWORD
  const handleChangePassword = () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Please fill in all password fields.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    alert("Password updated successfully!");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // DELETE ACCOUNT
  const handleDeleteAccount = () => {
    if (deleteConfirmation !== "DELETE") {
      setDeleteMessage('Please type "DELETE" to confirm.');
      return;
    }

    const result = deleteAccount();

    if (!result.success) {
      setDeleteMessage(result.message);
      return;
    }

    alert("Your account has been deleted successfully.");

    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5 sm:p-8">

      {/* PAGE HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your system preferences.
        </p>
      </div>

      {/* ADMIN PROFILE */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3">
            <User size={22} className="text-blue-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Admin Profile
            </h2>

            <p className="text-sm text-slate-500">
              Manage your administrator account details.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Full Name
          </label>

          <input
            type="text"
            value={adminInfo.name}
            onChange={(e) =>
              setAdminInfo({ ...adminInfo, name: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Enter admin name"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email Address
          </label>

          <input
            type="email"
            value={adminInfo.email}
            onChange={(e) =>
              setAdminInfo({ ...adminInfo, email: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Enter admin email"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Role
          </label>

          <input
            type="text"
            value={adminInfo.role}
            onChange={(e) =>
              setAdminInfo({ ...adminInfo, role: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Enter admin role"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => alert("Profile updated successfully!")}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* NOTIFICATION PREFERENCES */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-3">
            <Bell size={22} className="text-purple-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Notification Preferences
            </h2>

            <p className="text-sm text-slate-500">
              Choose which notifications you want to receive.
            </p>
          </div>
        </div>

        {[
          {
            key: "email",
            title: "Email Notifications",
            description: "Receive general updates through email.",
          },
          {
            key: "attendance",
            title: "Attendance Notifications",
            description: "Receive updates about student attendance.",
          },
          {
            key: "results",
            title: "Results Notifications",
            description: "Receive updates when student results are added.",
          },
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0"
          >
            <div>
              <h3 className="font-medium text-slate-700">
                {item.title}
              </h3>

              <p className="text-sm text-slate-500">
                {item.description}
              </p>
            </div>

            <input
              type="checkbox"
              checked={notifications[item.key]}
              onChange={(e) =>
                setNotifications({
                  ...notifications,
                  [item.key]: e.target.checked,
                })
              }
              className="h-5 w-5 accent-purple-600"
            />
          </div>
        ))}
      </div>

      {/* SECURITY SETTINGS */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-green-100 p-3">
            <Shield size={22} className="text-green-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Security Settings
            </h2>

            <p className="text-sm text-slate-500">
              Manage your account password.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Current Password
          </label>

          <input
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                currentPassword: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500"
            placeholder="Enter current password"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            New Password
          </label>

          <input
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                newPassword: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500"
            placeholder="Enter new password"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Confirm New Password
          </label>

          <input
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-green-500"
            placeholder="Confirm new password"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleChangePassword}
            className="rounded-lg bg-green-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-green-700"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="mt-6 rounded-xl border border-red-200 bg-white p-6 shadow-sm">

        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-red-100 p-3">
            <AlertTriangle size={22} className="text-red-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-red-700">
              Danger Zone
            </h2>

            <p className="text-sm text-slate-500">
              Permanently delete your administrator account.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold text-slate-700">
              Delete Account
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              This will permanently remove your account and its records.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setDeleteConfirmation("");
              setDeleteMessage("");
              setShowDeleteModal(true);
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700"
          >
            <Trash2 size={17} />
            Delete Account
          </button>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-red-100 p-3">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Delete Account?
                  </h2>

                  <p className="text-xs text-red-600">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm leading-6 text-slate-600">
              You are about to permanently delete{" "}
              <strong>{currentAdmin?.fullName}</strong>'s account.
              Your students, courses, attendance records, and results
              will also be deleted. Other administrators' data will
              remain untouched.
            </p>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Type DELETE to confirm
              </label>

              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => {
                  setDeleteConfirmation(e.target.value);
                  setDeleteMessage("");
                }}
                placeholder="Type DELETE"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
              />

              {deleteMessage && (
                <p className="mt-2 text-sm text-red-600">
                  {deleteMessage}
                </p>
              )}
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== "DELETE"}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 size={17} />
                Permanently Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
