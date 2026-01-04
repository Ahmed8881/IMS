import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingIndicator from "../../components/LoadingIndicator";
import ShowErrorMessage from "../../components/ShowErrorMessage";
import { IoMailOutline, IoLocationOutline, IoPencil, IoAdd } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { SERVER_URL } from "../../router";

function LocationsScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isError, setError] = useState("");

  useEffect(() => {
    getDataFromApi();
  }, []);

  async function getDataFromApi() {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/v1/location`);
      setData(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-full">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Warehouses & Sectors
          </h1>
          <p className="text-slate-500 mt-1">Manage and monitor physical storage distributions.</p>
        </div>
        
        <Link
          to={"new"}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
        >
          <IoAdd size={20} />
          Add Location
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <LoadingIndicator />
        </div>
      )}

      {isError && (
        <div className="max-w-md mx-auto">
          <ShowErrorMessage>
            <button onClick={getDataFromApi} className="underline font-bold ml-2">Reload Page</button>
          </ShowErrorMessage>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.map((location) => (
            <LocationCard key={location._id} data={location} />
          ))}
        </div>
      )}
    </div>
  );
}

function LocationCard({ data }) {
  const user = data.editedBy || data.createdBy;
  const isEdited = !!data.editedBy;

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1">
      
      {/* Floating Action Button */}
      <NavLink
        to={`edit/${data._id}`}
        className="absolute top-4 right-4 p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300"
      >
        <IoPencil size={18} />
      </NavLink>

      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
          <IoLocationOutline size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {data.name}
          </h2>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {data.description || "No detailed description available for this sector."}
          </p>
        </div>
      </div>

      {/* User Stamp Section */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-slate-300">
            <FaUserCircle size={32} />
          </div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-bold text-slate-800 truncate uppercase tracking-tight">
              {user?.name || "Unknown"}
            </h3>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <IoMailOutline />
              <span className="truncate">{user?.email || "No email"}</span>
            </div>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
          isEdited ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
        }`}>
          {isEdited ? "Updated" : "Primary"}
        </div>
      </div>
    </div>
  );
}

export default LocationsScreen;