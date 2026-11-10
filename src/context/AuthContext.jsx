
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem("currentAdmin");
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  // CREATE ACCOUNT
  const signup = ({ fullName, email, password }) => {
    const existingAdmins = JSON.parse(
      localStorage.getItem("adminAccounts") || "[]"
    );

    const normalizedEmail = email.trim().toLowerCase();

    const emailExists = existingAdmins.some(
      (admin) => admin.email === normalizedEmail
    );

    if (emailExists) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const newAdmin = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
    };

    localStorage.setItem(
      "adminAccounts",
      JSON.stringify([...existingAdmins, newAdmin])
    );

    return {
      success: true,
      message: "Account created successfully!",
    };
  };

  // LOGIN
  const login = (email, password) => {
    const existingAdmins = JSON.parse(
      localStorage.getItem("adminAccounts") || "[]"
    );

    const admin = existingAdmins.find(
      (user) =>
        user.email === email.trim().toLowerCase() &&
        user.password === password
    );

    if (!admin) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const loggedInAdmin = {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
    };

    localStorage.setItem(
      "currentAdmin",
      JSON.stringify(loggedInAdmin)
    );

    setCurrentAdmin(loggedInAdmin);

    return {
      success: true,
      message: "Login successful!",
    };
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("currentAdmin");
    setCurrentAdmin(null);
  };

  // DELETE ACCOUNT
  const deleteAccount = () => {
    if (!currentAdmin) {
      return {
        success: false,
        message: "No administrator is currently logged in.",
      };
    }

    const adminId = currentAdmin.id;

    const existingAdmins = JSON.parse(
      localStorage.getItem("adminAccounts") || "[]"
    );

    const remainingAdmins = existingAdmins.filter(
      (admin) => admin.id !== adminId
    );

    // Remove the administrator's account
    localStorage.setItem(
      "adminAccounts",
      JSON.stringify(remainingAdmins)
    );

    // Remove only this administrator's data
    const dataKeys = [
      "students",
      "courses",
      "attendance",
      "results",
    ];

    dataKeys.forEach((key) => {
      localStorage.removeItem(`${key}_${adminId}`);
    });

    // Remove old shared data if this was the last account
    if (remainingAdmins.length === 0) {
      dataKeys.forEach((key) => {
        localStorage.removeItem(key);
      });
    }

    // Log out the administrator
    localStorage.removeItem("currentAdmin");
    setCurrentAdmin(null);

    return {
      success: true,
      message: "Your account has been deleted successfully.",
    };
  };

  return (
    <AuthContext.Provider
      value={{
        currentAdmin,
        signup,
        login,
        logout,
        deleteAccount,
        isAuthenticated: Boolean(currentAdmin),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
