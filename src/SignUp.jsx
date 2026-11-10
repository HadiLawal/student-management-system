
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import graduation from "../src/assets/image.png";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setMessage("Please agree to the Terms and Conditions.");
      return;
    }

    const result = signup({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    alert(result.message);
    navigate("/login");
  };

  return (
    <div className="w-full mx-auto max-w-6xl min-h-screen sm:min-h-[650px] lg:min-h-[680px] bg-white sm:rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-none sm:shadow-xl">

      {/* LEFT SECTION */}
      <section className="relative min-h-[280px] sm:min-h-[320px] md:min-h-full overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 flex flex-col items-center justify-center text-white px-6 py-10">

        <div className="absolute w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl -top-20 -left-20" />

        <div className="absolute w-64 h-64 rounded-full bg-green-400/10 blur-3xl bottom-0 right-0" />

        <div className="relative z-10 flex flex-col items-center text-center">

          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
            <GraduationCap size={36} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            Student
            <br />
            Management
            <br />
            System
          </h1>

          <p className="text-emerald-100 font-extrabold text-sm mt-3">
            Learn · Manage · Excel
          </p>

        </div>

        <img
          src={graduation}
          alt="Graduation cap and books"
          className="relative z-10 w-64 sm:w-72 md:w-[85%] max-h-64 md:max-h-80 object-contain mt-5 drop-shadow-2xl"
        />

        <p className="relative z-10 text-xs text-emerald-200/70 mt-3">
          Empowering education through technology
        </p>

      </section>

      {/* RIGHT SECTION */}
      <div className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-16">

        <div className="w-full max-w-md">

          <div className="mb-8 text-center md:hidden">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <GraduationCap size={30} />
            </div>

            <h1 className="text-2xl font-bold text-emerald-900">
              EduManage
            </h1>
          </div>

          <div className="mb-8">

            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-600">
              Get Started
            </p>

            <h2 className="text-3xl font-bold text-slate-900">
              Create an account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter your details to create your administrator account.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* FULL NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Use at least 8 characters.
              </p>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>

              <div className="relative">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* TERMS */}
            <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 accent-emerald-600"
              />

              <span>
                I agree to the{" "}
                <span className="font-semibold text-emerald-700">
                  Terms and Conditions
                </span>
              </span>
            </label>

            {/* ERROR MESSAGE */}
            {message && (
              <p className="text-sm text-red-600">
                {message}
              </p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-700 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-700/20 transition hover:bg-emerald-800"
            >
              Create Account
              <ArrowRight size={18} />
            </button>

          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signup;
