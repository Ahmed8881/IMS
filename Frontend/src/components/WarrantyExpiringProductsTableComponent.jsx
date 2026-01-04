import React, { useEffect, useState } from "react";
import EmptyData from "../assets/undraw_empty_re.svg";
import axios from "axios";
import { Link } from "react-router-dom";
import { SERVER_URL } from "../router";
import { IoEyeOutline, IoCalendarOutline, IoShieldCheckmarkOutline, IoAlertCircleOutline } from "react-icons/io5";

function WarrantyExpiringProductsTablesComponent({ uid }) {
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/v1/analytics/expiring`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setInventoryData(data);
      setLoading(false);
    } catch (error) {
      setError("Unable to load expiring inventory.");
      setLoading(false);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  if (isError) return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-center">
      <IoAlertCircleOutline className="mx-auto mb-2" size={24} />
      {isError}
    </div>
  );

  if (inventoryData.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
      <img src={EmptyData} alt="Empty Data" className="w-48 mb-6 opacity-60" />
      <h3 className="text-slate-500 font-semibold tracking-tight">No warranties expiring soon</h3>
    </div>
  );

  return (
    <div className="overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Product Details</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Serial Number</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Warranty Coverage</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Current Status</th>
              <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {inventoryData.map((item, index) => (
              <tr key={index} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-xs text-slate-400">ID: {item._id?.slice(-6)}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-mono font-medium">
                    {item.serialNo}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <IoShieldCheckmarkOutline size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{item.warrantyMonths} Months</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <IoCalendarOutline /> {item.dateOfPurchase.split("T")[0]}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight 
                    ${item.history[0]?.status[0]?.name?.toLowerCase() === 'active' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-amber-50 text-amber-600'}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${item.history[0]?.status[0]?.name?.toLowerCase() === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {item.history[0]?.status[0]?.name}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <Link 
                    to={`/products/history/${item._id}`} 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                  >
                    <IoEyeOutline size={16} />
                    View History
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WarrantyExpiringProductsTablesComponent;