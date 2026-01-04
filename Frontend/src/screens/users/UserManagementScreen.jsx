import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoSearchOutline, IoFilterOutline, IoPeopleOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import LoadingIndicator from "../../components/LoadingIndicator";
import ShowErrorMessage from "../../components/ShowErrorMessage";
import { useOutletContext } from "react-router-dom";
import ManageUserTableRow from "./components/ManageUserTableRow";
import { SERVER_URL } from "../../router";

function UserManagementScreen() {
  const [data, user] = useOutletContext();
  const [isLoading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    getDataFromApi();
  }, [currentPage, itemsPerPage, searchTerm, roleFilter]);

  async function getDataFromApi() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${SERVER_URL}/api/v1/users/all`, {
        params: {
          page: currentPage,
          itemsPerPage,
          search: searchTerm,
          role: roleFilter,
        },
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <IoPeopleOutline className="text-indigo-600" /> Team Access
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Manage user permissions and administrative privileges.
          </p>
        </div>
        
        {user?.role === "admin" && (
           <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-700 text-xs font-bold uppercase tracking-widest">
             <IoShieldCheckmarkOutline size={16}/> Admin Mode Active
           </div>
        )}
      </div>

      {error && (
        <ShowErrorMessage
          children={<span className="underline cursor-pointer font-bold ml-2">Reload Page</span>}
          message={error}
        />
      )}

      {/* Advanced Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
          <div className="relative group min-w-[300px]">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative group min-w-[160px]">
            <IoFilterOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm appearance-none focus:ring-4 focus:ring-indigo-500/10 outline-none cursor-pointer font-bold text-slate-600"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="user">Users Only</option>
              <option value="admin">Admins Only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rows per page</span>
          <select 
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
            className="bg-slate-100 border-none rounded-xl text-xs font-black px-4 py-2 outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">User Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 text-center">Security Role</th>
                {user?.role === "admin" && (
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="py-24 text-center">
                    <LoadingIndicator />
                    <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing directory...</p>
                  </td>
                </tr>
              ) : (
                users.map((_user) => (
                  <ManageUserTableRow key={_user._id} role={user.role} user={_user} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-8 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm font-bold text-slate-400">
            Page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p-1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-900 hover:text-white disabled:opacity-30 transition-all"
            >
              <IoIosArrowBack /> Prev
            </button>

            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (totalPages > 5 && Math.abs(currentPage - pageNum) > 1 && pageNum !== 1 && pageNum !== totalPages) return null;
                    return (
                        <button 
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${currentPage === pageNum ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-white'}`}
                        >
                            {pageNum}
                        </button>
                    )
                })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold shadow-sm hover:bg-slate-900 hover:text-white disabled:opacity-30 transition-all"
            >
              Next <IoIosArrowForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagementScreen;