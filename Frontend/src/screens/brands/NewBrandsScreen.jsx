import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ShowErrorMessage from "../../components/ShowErrorMessage";
import LoadingIndicator from "../../components/LoadingIndicator";
import { IoArrowBack, IoCheckmarkCircle } from "react-icons/io5";
import axios from "axios";
import { SERVER_URL } from "../../router";

function NewBrandsScreen() {
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
      await axios.post(`${SERVER_URL}/api/v1/brands/`, data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setSuccess(true);
      setData({ name: "", description: "" }); // Reset form
    } catch (e) {
      setError("Failed to create brand. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <Link to={-1} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <IoArrowBack className="text-slate-600 text-xl" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Add New Brand</h1>
          <p className="text-sm text-slate-500">Create a new manufacturer category</p>
        </div>
      </div>

      {isError && (
        <div className="mb-6">
          <ShowErrorMessage>{isError}</ShowErrorMessage>
        </div>
      )}

      {success ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm animate-in fade-in zoom-in duration-300">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-600 rounded-full mb-4">
            <IoCheckmarkCircle size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Brand Created!</h2>
          <p className="text-slate-500 mt-2 mb-8">The brand has been added to the system successfully.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => setSuccess(false)}
              className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all"
            >
              Add Another
            </button>
            <Link 
              to="/" 
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <form onSubmit={handleUpdate} className="p-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="e.g. Samsung, Cisco, HP"
                value={data.name}
                onChange={onchangeHandler}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white outline-none transition-all text-slate-900"
              />
            </div>

            <div>
              <label htmlFor="desc" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Description
              </label>
              <textarea
                name="description"
                id="desc"
                placeholder="Briefly describe the brand or its product range..."
                value={data.description}
                onChange={onchangeHandler}
                required
                rows="4"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white outline-none transition-all text-slate-900"
              />
            </div>

            <div className="pt-4">
              <button
                disabled={uploading}
                type="submit"
                className="w-full sm:w-auto px-10 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  "Create Brand"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default NewBrandsScreen;