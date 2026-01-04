import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoNotificationsOutline, IoSettingsOutline, IoLogOutOutline, IoMenu, IoClose } from "react-icons/io5";
import adminLogo from "../assets/admin-logo.svg";
import userLogo from "../assets/user-logo.svg";

function HeaderBar({ user }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Premium Glass Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-md z-[100]">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-bold text-slate-800 animate-pulse">Synchronizing...</p>
          </div>
        </div>
      )}

      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        {/* Main Header Container */}
        <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg shadow-slate-200/50 rounded-2xl px-4 py-2 flex items-center justify-between">
          
          {/* Brand/Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-black text-xl italic tracking-tighter">I</span>
            </div>
            <h1 className="hidden sm:block text-lg font-black text-slate-900 tracking-tight">
              INV<span className="text-blue-600">ENTORY</span>
            </h1>
          </div>

          {/* Right Actions Section */}
          <div className="flex items-center gap-2 sm:gap-6">
            
            {/* Notification & Tools (Hidden on small mobile) */}
            <div className="hidden md:flex items-center gap-4 text-slate-400">
              <button className="hover:text-blue-600 transition-colors"><IoNotificationsOutline size={22}/></button>
              <button className="hover:text-blue-600 transition-colors"><IoSettingsOutline size={22}/></button>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right hidden lg:block">
                <h3 className="text-sm font-bold text-slate-900 leading-none">{user.name}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${user.role === 'admin' ? 'text-blue-600' : 'text-emerald-600'}`}>
                   {user.role}
                </span>
              </div>
              
              <div className="relative group cursor-pointer" onClick={() => setShowMenu(!showMenu)}>
                <img
                  src={user.role === "user" ? userLogo : adminLogo}
                  alt="Avatar"
                  className={`h-10 w-10 rounded-xl object-cover ring-2 ring-offset-2 transition-all group-hover:ring-blue-500 ${
                    user.role === "user" ? "ring-emerald-100" : "ring-blue-100"
                  }`}
                />
                {/* Online Status Dot */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>

              {/* Mobile/Burger Menu Button - Hide since sidebar has its own */}
              {/* <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {showMenu ? <IoClose size={24}/> : <IoMenu size={24}/>}
              </button> */}
            </div>
          </div>
        </div>

        {/* Floating Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-20 right-8 w-64 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-300/50 p-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="lg:hidden pb-4 mb-4 border-b border-slate-50">
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
            
            <ul className="space-y-1">
              <li>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all">
                  <IoSettingsOutline />
                  <span className="text-sm font-medium">Account Settings</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { /* Logout Logic */ }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <IoLogOutOutline />
                  <span className="text-sm font-bold">Sign Out</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </header>
      
      {/* Spacer to push content below fixed header */}
      <div className="h-24"></div>
    </>
  );
}

export default HeaderBar;