import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ShowErrorMessage from "../../components/ShowErrorMessage";
import { IoArrowBack, IoLocationSharp, IoCheckmarkCircle } from "react-icons/io5";
import axios from "axios";
import { SERVER_URL } from "../../router";

function NewLocationScreen() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [data, setData] = useState({ name: "", description: "" });
  const [isError, setError] = useState("");

  function onchangeHandler(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      setError("");
      setUploading(true);

      await axios.post(
        `${SERVER_URL}/api/v1/location/`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setSuccess(true);
      setData({ name: "", description: "" }); // Clear form
    } catch (e) {
      setError("Failed to create location. Please check your connection.");
      console.log(e);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-6 lg:p-12 max-w-2xl mx-auto min-h-full">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4 mb-10">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all"
        >
          <IoArrowBack size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <IoLocationSharp className="text-blue-600" />
            Add New Location
          </h1>
          <p className="text-sm text-slate-500">Define a new warehouse, rack, or office sector.</p>
        </div>
      </div>

      {isError && (
        <div className="mb-6 animate-in slide-in-from-top duration-300">
          <ShowErrorMessage>{isError}</ShowErrorMessage>
        </div>
      )}

      {success ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xl shadow-slate-200/50 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <IoCheckmarkCircle size={50} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Location Created!</h2>
          <p className="text-slate-500 mt-2">The new sector has been registered and is ready for asset assignment.</p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => setSuccess(false)}
              className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95"
            >
              Add Another
            </button>
            <Link 
              to="/locations" 
              className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              View All Locations
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <form onSubmit={handleUpdate} className="p-8 space-y-6">
            {/* Input Field: Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Location Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Main Warehouse, Rack A-12"
                value={data.name}
                onChange={onchangeHandler}
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Input Field: Description */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Description / Purpose
              </label>
              <textarea
                name="description"
                placeholder="Describe what is stored here or specific entry instructions..."
                value={data.description}
                onChange={onchangeHandler}
                required
                rows="4"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                disabled={uploading}
                type="submit"
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Registering...</span>
                  </>
                ) : (
                  "Create Location"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default NewLocationScreen;