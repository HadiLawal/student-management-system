
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import DashboardLayout from "./DashboardLayout";
import Dashboard from "./Dashboard";
import Students from "./students";
import Login from "./login";
import Signup from "./SignUp";
import Courses from "./courses";
import Attendance from "./Attendance";
import Results from "./Results";
import Reports from "./Reports";
import Settings from "./Settings";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

// Protect dashboard and management pages
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Redirect logged-in admins away from login/signup
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    children
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DataProvider>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/results" element={<Results />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Unknown Routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DataProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
