
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
} from "lucide-react";

import graduation from "../src/assets/image.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    const result = login(formData.email, formData.password);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <main className="min-h-screen sm:h-[100vh] w-full bg-white flex items-center justify-center p-0 sm:p-4 lg:p-6">

      <div className="w-full max-w-6xl min-h-screen sm:min-h-[650px] lg:min-h-[680px] bg-white sm:rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-none sm:shadow-xl">

        {/* LEFT SECTION */}
        <section className="relative min-h-[280px] sm:min-h-[320px] md:min-h-full overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 flex flex-col items-center justify-center text-white px-6 py-10">

          {/* Background decoration */}
          <div className="absolute w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl -top-20 -left-20" />

          <div className="absolute w-64 h-64 rounded-full bg-green-400/10 blur-3xl bottom-0 right-0" />

          {/* Logo */}
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

          {/* Graduation illustration */}
          <img
            src={graduation}
            alt="Graduation cap and books"
            className="relative z-10 w-64 sm:w-72 md:w-[85%] max-h-64 md:max-h-80 object-contain mt-5 drop-shadow-2xl"
          />

          {/* Footer */}
          <p className="relative z-10 text-xs text-emerald-200/70 mt-3">
            Empowering education through technology
          </p>

        </section>


        {/* RIGHT SECTION */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 bg-white">

          <div className="w-full max-w-md">

            {/* Heading */}
            <div className="mb-8">

              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-5">
                <BookOpen size={25} />
              </div>

              <h2 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h2>

              <p className="text-slate-500 mt-2 text-sm">
                Sign in to your account
              </p>

            </div>


            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                    className="w-full h-12 pl-12 pr-4 border border-slate-200 rounded-xl outline-none text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 transition"
                  />

                </div>

              </div>


              {/* Password */}
              <div>

                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full h-12 pl-12 pr-12 border border-slate-200 rounded-xl outline-none text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/10 transition"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-800"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>


              {/* Remember and Forgot Password */}
              <div className="flex items-center justify-between gap-3 flex-wrap">

                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-emerald-800 w-4 h-4"
                  />

                  Remember me

                </label>

                <button
                  type="button"
                  className="text-sm font-semibold text-emerald-800 hover:text-emerald-600"
                >
                  Forgot password?
                </button>

              </div>

              {message && (
                <p className="text-sm text-red-600">
                  {message}
                </p>
              )}
              {/* Login Button */}
              <button
                type="submit"
                className="w-full h-12 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition duration-300 shadow-lg shadow-emerald-900/10"
              >
                Sign In
                <ArrowRight size={18} />
              </button>

            </form>


            {/* Divider */}
            <div className="flex items-center gap-4 my-7">

              <div className="flex-1 h-px bg-slate-200" />

              <span className="text-xs text-slate-400">
                OR
              </span>

              <div className="flex-1 h-px bg-slate-200" />

            </div>


            {/* Register Link */}
            <button
              type="button"
              className="w-full h-12 border border-slate-200 hover:border-emerald-800 hover:bg-emerald-50 rounded-xl text-slate-700 font-semibold text-sm transition"
              onClick={() => navigate("/signup")}
            >
              Create an Account
            </button>


            {/* Footer */}
            <p className="text-center text-xs text-slate-400 mt-10">
              © {new Date().getFullYear()} Student Management System.
              All rights reserved.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
};

export default Login;
