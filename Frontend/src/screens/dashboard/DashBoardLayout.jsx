import React, { useEffect, useState } from "react";
import HeaderBar from "../../components/HeaderBar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import loginLogo from "../../assets/authenticate.svg";
import SideNavbar from "../../components/SideNavbar";
import { SERVER_URL } from "../../router";

function DashBoardLayout() {
  const navigator = useNavigate();
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const { data, status } = await axios.get(
        `${SERVER_URL}/api/v1/users/me`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (status === 200) {
        setData(data);
        setUser(data.user);
      }
    } catch (e) {
      console.error("Auth error:", e);
    } finally {
      setLoading(false);
    }
  };

  // 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative">
          <div className="h-12 w-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <h1 className="mt-4 text-sm font-semibold text-slate-600 animate-pulse uppercase tracking-widest">
          Loading Workspace
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col overflow-hidden">
      
      {/* 2. AUTHENTICATED VIEW */}
      {data ? (
        <>
          {/* Top Navigation Bar */}
          <div className="z-30 h-16 border-b border-slate-200 bg-white shadow-sm">
            <HeaderBar user={data.user} />
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Side Navigation */}
            <aside className="w-64 border-r border-slate-200 bg-white hidden md:block overflow-y-auto">
              <SideNavbar 
                isMobileOpen={isMobileSidebarOpen} 
                setIsMobileOpen={setIsMobileSidebarOpen} 
              />
            </aside>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
              <SideNavbar 
                isMobileOpen={isMobileSidebarOpen} 
                setIsMobileOpen={setIsMobileSidebarOpen} 
              />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/50">
              <div className="max-w-7xl mx-auto">
                <Outlet context={[data, user]} />
              </div>
            </main>
          </div>
        </>
      ) : (
        /* 3. UNAUTHENTICATED / LOGOUT VIEW */
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
          <div className="w-full max-w-md text-center">
            {/* Warning Message */}
            <div className="mb-8 flex items-center p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm shadow-sm">
              <span className="mr-3 text-xl">⚠️</span>
              <p className="font-medium text-left">
                Authentication Required: Please sign in to access your inventory dashboard.
              </p>
            </div>

            <div className="relative group bg-white p-8 rounded-2xl shadow-xl border border-slate-200 transition-all hover:shadow-2xl">
              <img 
                src={loginLogo} 
                alt="Authenticate" 
                className="w-48 mx-auto mb-6 opacity-80 group-hover:scale-105 transition-transform duration-500" 
              />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Session Expired</h2>
              <p className="text-slate-500 mb-8 text-sm">
                For your security, please log in again to manage your warehouse assets.
              </p>
              
              <Link
                to="/auth"
                className="inline-block w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
              >
                Go to Login
              </Link>
            </div>
            
            <p className="mt-8 text-xs text-slate-400">
              Technical Support: support@stockmaster.com
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashBoardLayout;