import React, { useEffect, useState } from "react";
import axios from "axios";
import ShowSuccessMesasge from "../../components/ShowSuccessMesasge";
import { SERVER_URL } from "../../router";

function AddNewProductScreen() {
  const [allLocations, setAllLocations] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    locationId: "",
    status: "not in use",
    title: "",
    description: "",
    serialNo: "",
    rackMountable: false,
    isPart: false,
    manufacturer: "",
    model: "",
    warrantyMonths: "",
    user: "department",
    dateOfPurchase: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  useEffect(() => {
    fetchNecessaryData();
  }, []);

  const fetchNecessaryData = async () => {
    try {
      const [manufacturersRes, locationsRes] = await Promise.all([
        axios.get(`${SERVER_URL}/api/v1/brands`),
        axios.get(`${SERVER_URL}/api/v1/location`)
      ]);
      
      setAllLocations(locationsRes.data);
      setManufacturer(manufacturersRes.data);
      
      if (locationsRes.data.length > 0 && manufacturersRes.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          manufacturer: manufacturersRes.data[0]._id,
          locationId: locationsRes.data[0]._id,
        }));
      }
    } catch (e) {
      setError("Failed to load setup data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      await axios.post(`${SERVER_URL}/api/v1/products`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setSuccessMessage("Product registered successfully");
      // Reset form logic as per your original requirement
    } catch (error) {
      setError("Failed to add product. Please check details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Add New Product</h1>
        <p className="text-slate-500 text-sm">Register a new asset into the inventory system.</p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Section 1: Basic Information */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600">Basic Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Product Title</label>
              <input
                type="text" name="title" value={formData.title} onChange={handleChange}
                placeholder="e.g. Dell PowerEdge R740" required
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-sm"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
              <textarea
                name="description" value={formData.description} onChange={handleChange} rows="2"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Section 2: Hardware Details */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600">Technical Specifications</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Manufacturer</label>
              <select 
                name="manufacturer" value={formData.manufacturer} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-blue-600 outline-none text-sm"
              >
                {manufacturer.map(man => <option key={man._id} value={man._id}>{man.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Model</label>
              <input
                type="text" name="model" value={formData.model} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-blue-600 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Serial Number</label>
              <input
                type="text" name="serialNo" value={formData.serialNo} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-blue-600 outline-none text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Warranty (Months)</label>
              <input
                type="number" name="warrantyMonths" value={formData.warrantyMonths} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-blue-600 outline-none text-sm"
              />
            </div>
            <div className="flex items-end space-x-6 pb-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="rackMountable" checked={formData.rackMountable} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm text-slate-600 font-medium">Rack Mount</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="isPart" checked={formData.isPart} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-sm text-slate-600 font-medium">Spare Part</span>
                </label>
            </div>
          </div>

          {/* Section 3: Logistics */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-600">Logistics & Assignment</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Location</label>
              <select 
                name="locationId" value={formData.locationId} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:border-blue-600 outline-none text-sm"
              >
                {allLocations.map(loc => <option key={loc._id} value={loc._id}>{loc.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assigned User</label>
              <select name="user" value={formData.user} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-blue-600 outline-none text-sm">
                <option value="department">Department</option>
                <option value="admin">Admin</option>
                <option value="normal user">Normal User</option>
              </select>
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-blue-600 outline-none text-sm">
                    <option value="not in use">Not In Use</option>
                    <option value="in use">In Use</option>
                    <option value="repair">Under Repair</option>
                </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Purchase Date</label>
              <input
                type="datetime-local" name="dateOfPurchase" value={formData.dateOfPurchase} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-blue-600 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end space-x-4">
          <button type="button" onClick={() => window.history.back()} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
            Cancel
          </button>
          <button
            type="submit" disabled={isLoading}
            className="px-8 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-70 flex items-center"
          >
            {isLoading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                </>
            ) : "Register Product"}
          </button>
        </div>
      </form>

      {successMessage && (
        <ShowSuccessMesasge>
          <div className="font-semibold">{successMessage}</div>
        </ShowSuccessMesasge>
      )}
    </div>
  );
}

export default AddNewProductScreen;