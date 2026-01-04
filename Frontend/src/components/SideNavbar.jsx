import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { IoClose, IoMenu } from "react-icons/io5";
import { AiFillProduct } from "react-icons/ai";
import { LuShoppingBag, LuPlus } from "react-icons/lu";
import { SiBrandfolder } from "react-icons/si";
import { BiLocationPlus, BiUser } from "react-icons/bi";
import { FiBox, FiMapPin, FiUsers, FiTrendingUp } from "react-icons/fi";
import LogoutButton from "./LogoutButton";

function SideNavbar({ isMobileOpen, setIsMobileOpen }) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileOpen && !event.target.closest('.mobile-sidebar')) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen, setIsMobileOpen]);

  const navigationSections = [
    {
      title: "Overview",
      icon: <FiTrendingUp className="w-4 h-4" />,
      links: [
        { 
          link: "", 
          name: "Dashboard", 
          icon: <IoMdHome className="w-5 h-5" />, 
          end: true,
          description: "Analytics & insights" 
        }
      ]
    },
    {
      title: "Inventory",
      icon: <FiBox className="w-4 h-4" />,
      links: [
        {
          link: "/products",
          name: "Products",
          icon: <LuShoppingBag className="w-5 h-5" />,
          end: false,
          description: "Manage inventory items"
        },
        {
          link: "/products/new",
          name: "Add Product",
          icon: <AiFillProduct className="w-5 h-5" />,
          end: true,
          description: "Register new items",
          isQuick: true
        }
      ]
    },
    {
      title: "Organization",
      icon: <FiMapPin className="w-4 h-4" />,
      links: [
        {
          link: "/brands",
          name: "Brands",
          icon: <SiBrandfolder className="w-5 h-5" />,
          end: false,
          description: "Manufacturer catalog"
        },
        {
          link: "/brands/new",
          name: "Add Brand",
          icon: <LuPlus className="w-5 h-5" />,
          end: true,
          description: "Register new brand",
          isQuick: true
        },
        {
          link: "/locations",
          name: "Locations",
          icon: <BiLocationPlus className="w-5 h-5" />,
          end: false,
          description: "Warehouse sectors"
        },
        {
          link: "/locations/new",
          name: "Add Location",
          icon: <FiMapPin className="w-5 h-5" />,
          end: true,
          description: "Create new sector",
          isQuick: true
        }
      ]
    },
    {
      title: "Administration",
      icon: <FiUsers className="w-4 h-4" />,
      links: [
        {
          link: "/users",
          name: "User Management",
          icon: <BiUser className="w-5 h-5" />,
          end: false,
          description: "Manage team access"
        }
      ]
    }
  ];

  const NavSection = ({ section, index }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 px-6 mb-4">
        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
          {section.icon}
        </div>
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
          {section.title}
        </h3>
      </div>
      
      <div className="space-y-1 px-3">
        {section.links.map((link, idx) => (
          <NavLink
            key={idx}
            to={link.link}
            end={link.end}
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <div className={`transition-transform duration-200 group-hover:scale-110`}>
              {link.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm truncate">{link.name}</span>
                {link.isQuick && (
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded">
                    Quick
                  </span>
                )}
              </div>
              <p className="text-xs opacity-75 truncate">{link.description}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-sm">I</span>
            </div>
            <div>
              <h1 className="font-black text-lg text-slate-900 tracking-tight leading-none">
                INVENTORY
              </h1>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                Management System
              </p>
            </div>
          </div>
          
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        {navigationSections.map((section, index) => (
          <NavSection key={index} section={section} index={index} />
        ))}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-100">
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full bg-white">
        <SidebarContent />
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Mobile Sidebar */}
          <div className="mobile-sidebar absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Mobile Menu Button - Fixed Position */}
      <button
        onClick={() => setIsMobileOpen && setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-3 bg-white/90 backdrop-blur-md text-slate-600 rounded-xl shadow-lg border border-white/20 hover:bg-white transition-all"
      >
        <IoMenu className="w-5 h-5" />
      </button>
    </>
  );
}

export default SideNavbar;

{
  /* <div className="align-bottom left-0 w-full bottom-0">
          <Link
            to=""
            className={
              " pl-6 py-2 font-semibold text-slate-700 flex items-center gap-3 bg-white "
            }
          >
            <IoIosSettings />
            <span>Settings</span>
          </Link>
        </div>
      </div> */
}
