import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingIndicator from "../../components/LoadingIndicator";
import ShowErrorMessage from "../../components/ShowErrorMessage";
import { IoMailOutline, IoAdd, IoPencilOutline, IoSearchOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import { SERVER_URL } from "../../router";

function BrandsScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isError, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getDataFromApi();
  }, []);

  async function getDataFromApi() {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/v1/brands`);
      setData(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const filteredData = data?.filter(brand => 
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto min-h-screen">
      {/* Dynamic Header */}
      <div className="relative mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest">
            <IoShieldCheckmarkOutline /> Verified Catalog
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Brands</h1>
          <p className="text-slate-500 max-w-md">Browse and manage your brand partnerships and manufacturer data.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Minimalist Search */}
          <div className="relative group">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Filter brands..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all w-full md:w-64 outline-none"
            />
          </div>
          
          <Link
            to={"new"}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 hover:bg-slate-900 hover:shadow-slate-200 transition-all duration-300 active:scale-95"
          >
            <IoAdd size={20} />
            <span>Add Brand</span>
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <LoadingIndicator />
          <p className="text-slate-400 text-sm font-medium animate-pulse">Fetching directory...</p>
        </div>
      )}

      {isError && (
        <ShowErrorMessage>
          <button onClick={getDataFromApi} className="underline font-bold ml-2 hover:text-red-700">Try Again</button>
        </ShowErrorMessage>
      )}

      {filteredData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredData.map((brand) => (
            <BrandCard key={brand._id} data={brand} />
          ))}
          
          {filteredData.length === 0 && !isLoading && (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium italic">No brands matching your search...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BrandCard({ data }) {
  const displayUser = data.editedBy || data.createdBy;
  const isEdited = !!data.editedBy;

  return (
    <div className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-2 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors duration-500" />

      {/* Action Button */}
      <NavLink
        to={`edit/${data._id}`}
        className="absolute top-6 right-6 p-3 bg-white shadow-sm border border-slate-100 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white hover:rotate-12 transition-all duration-300 z-10"
      >
        <IoPencilOutline size={18} />
      </NavLink>

      {/* Brand Visual */}
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-10" />
        <div className="absolute inset-0 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-black text-2xl group-hover:border-blue-200 transition-colors">
          {data.name.charAt(0)}
        </div>
      </div>

      <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
        {data.name}
      </h2>
      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-8">
        {data.description || "System manufacturer with no current description data."}
      </p>

      {/* User Stamp */}
      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50/50 transition-colors">
        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
          <span className="text-xs font-bold uppercase">{displayUser?.name?.charAt(0)}</span>
        </div>
        <div className="overflow-hidden">
          <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
            {isEdited ? "Last Edit" : "Owner"}
          </p>
          <h3 className="text-xs font-bold text-slate-700 truncate">{displayUser?.name}</h3>
        </div>
      </div>
    </div>
  );
}

export default BrandsScreen;