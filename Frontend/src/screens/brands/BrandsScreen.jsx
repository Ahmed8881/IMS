import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingIndicator from "../../components/LoadingIndicator";
import ShowErrorMessage from "../../components/ShowErrorMessage";
import { IoMailOutline, IoAdd, IoPencilOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { SERVER_URL } from "../../router";

function BrandsScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isError, setError] = useState("");

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

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto min-h-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Brands</h1>
          <p className="text-slate-500 mt-1">Manage manufacturers and product brands</p>
        </div>
        
        <Link
          to={"new"}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold rounded-lg shadow-lg shadow-slate-200 hover:bg-blue-600 hover:shadow-blue-200 transition-all duration-300 active:scale-95"
        >
          <IoAdd className="text-xl" />
          <span>Add New Brand</span>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <LoadingIndicator />
        </div>
      )}

      {isError && (
        <ShowErrorMessage>
          <button onClick={getDataFromApi} className="underline font-bold ml-2">Retry Loading</button>
        </ShowErrorMessage>
      )}

      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((brand) => (
            <BrandCard key={brand._id} data={brand} />
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No brands found. Start by adding one!</p>
          </div>
        )
      )}
    </div>
  );
}

function BrandCard({ data }) {
  // Determine which user to display (Edited takes priority)
  const displayUser = data.editedBy || data.createdBy;
  const isEdited = !!data.editedBy;

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1">
      {/* Edit Button - Stylish Icon overlay */}
      <NavLink
        to={`edit/${data._id}`}
        className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
        title="Edit Brand"
      >
        <IoPencilOutline size={18} />
      </NavLink>

      {/* Brand Icon Placeholder */}
      <div className="w-12 h-12 mb-4 bg-gradient-to-br from-blue-50 to-slate-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl uppercase">
        {data.name.charAt(0)}
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
        {data.name}
      </h2>
      <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px] leading-relaxed">
        {data.description || "No description provided for this brand."}
      </p>

      {displayUser && (
        <div className="mt-6 pt-5 border-t border-slate-50">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${isEdited ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
              {isEdited ? "Updated By" : "Created By"}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-slate-300 text-2xl" />
            <div className="overflow-hidden">
              <h3 className="text-sm font-semibold text-slate-800 truncate">
                {displayUser.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <IoMailOutline />
                <span className="truncate">{displayUser.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandsScreen;