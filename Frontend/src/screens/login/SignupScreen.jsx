import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../router";

function SignupScreen() {
  const navigator = useNavigate();

  const [formData, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handInputChange(e) {
    setData({ ...formData, [e.target.id]: e.target.value });
  }

  async function handleSignIN(e) {
    e.preventDefault();
    try {
      const { data, status } = await axios.post(
        `${SERVER_URL}/api/v1/users/new`,
        formData
      );

      if (status === 201) {
        navigator("/", { replace: true });
      } else {
        alert("Something went wrong");
      }
    } catch (e) {
      console.error(e);
      alert("User Already exists with same email");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-slate-200/50 blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-2xl md:flex-row md:flex-1 lg:max-w-4xl">
        
        {/* Left Panel: Branding (Matching Login) */}
        <div className="relative p-8 text-white bg-slate-950 md:w-[380px] md:flex-shrink-0 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="text-3xl font-extrabold tracking-tight">
              <span className="text-blue-500">Stock</span>Master.
            </div>
            <h2 className="mt-12 text-4xl font-bold leading-tight">
              Join the <br /> 
              <span className="text-slate-400">Network.</span>
            </h2>
            <p className="mt-6 text-slate-400 font-light leading-relaxed">
              Create an account to start streamlining your warehouse operations and inventory tracking today.
            </p>
          </div>

          <div className="relative z-10 pt-12">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                <span>Real-time Analytics</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-slate-300">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">✓</div>
                <span>Multi-warehouse Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Signup Form */}
        <div className="flex-1 p-8 py-10 bg-white md:p-14">
          <div className="max-w-sm mx-auto">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-slate-900">Get Started</h3>
              <p className="mt-2 text-slate-500">Create your professional account.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSignIN}>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  autoFocus
                  onChange={handInputChange}
                  required
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="work@company.com"
                  onChange={handInputChange}
                  required
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  onChange={handInputChange}
                  required
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full px-4 py-3.5 text-sm font-bold text-white transition-all bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-[0.98]"
                >
                  Create Account
                </button>
              </div>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link to={"/auth"} className="font-bold text-blue-600 hover:underline">
                  Log in here
                </Link>
              </p>
              
              <p className="mt-8 text-[11px] leading-relaxed text-slate-400">
                By signing up, you agree to our{" "}
                <a href="#" className="underline hover:text-slate-600">Terms of Service</a> and{" "}
                <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupScreen;