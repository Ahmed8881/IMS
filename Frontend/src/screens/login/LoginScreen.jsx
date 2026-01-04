import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../router";

function LoginScreen() {
  const [formData, setData] = useState({
    email: "",
    password: "",
  });

  const history = useNavigate();

  function handInputChange(e) {
    setData({ ...formData, [e.target.id]: e.target.value });
  }

  async function handleSignIn(e) {
    e.preventDefault();
    try {
      const { data, status } = await axios.post(
        `${SERVER_URL}/api/v1/users/login`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (status === 201 || status === 200) {
        history("/");
      } else {
        alert("Wrong credentials. Check Email and password");
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      alert("Something went wrong");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-slate-200/50 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-2xl md:flex-row md:flex-1 lg:max-w-screen-lg">
        
        {/* Left Panel: Branding & Info */}
        <div className="relative p-8 text-white bg-slate-950 md:w-[400px] md:flex-shrink-0 flex flex-col justify-between overflow-hidden">
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="text-3xl font-extrabold tracking-tight">
              <span className="text-blue-500">Stock</span>Master.
            </div>
            <h2 className="mt-12 text-4xl font-bold leading-tight">
              Manage your inventory <br /> 
              <span className="text-slate-400">with precision.</span>
            </h2>
            <p className="mt-6 text-slate-400 font-light leading-relaxed">
              Log in to access your dashboard, monitor real-time stock levels, and optimize your supply chain operations.
            </p>
          </div>

          <div className="relative z-10 pt-12">
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-sm italic text-slate-300">
                "This platform has completely transformed how we track our global warehouse assets."
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-blue-400">
                — Enterprise Solutions Team
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="flex-1 p-8 py-12 bg-white md:p-16">
          <div className="max-w-sm mx-auto">
            <div className="mb-10">
              <h3 className="text-3xl font-bold text-slate-900">Welcome Back</h3>
              <p className="mt-2 text-slate-500">Please enter your details to sign in.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSignIn}>
              <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  onChange={handInputChange}
                  type="email"
                  id="email"
                  placeholder="name@company.com"
                  autoFocus
                  required
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  onChange={handInputChange}
                  id="password"
                  placeholder="••••••••"
                  required
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 border-slate-300 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="text-sm text-slate-600">
                  Keep me signed in
                </label>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-3.5 text-sm font-bold text-white transition-all bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-[0.98]"
              >
                Sign In to Dashboard
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm text-slate-500">
                New to the platform?{" "}
                <Link to={"/signup"} className="font-bold text-blue-600 hover:underline">
                  Create an account
                </Link>
              </p>
              <div className="mt-8 flex items-center justify-center space-x-4 text-xs text-slate-400">
                <a href="#" className="hover:text-slate-600">Privacy Policy</a>
                <span>•</span>
                <a href="#" className="hover:text-slate-600">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;