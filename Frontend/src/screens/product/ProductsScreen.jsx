import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoSearchOutline, IoAdd, IoEyeOutline, IoPencilOutline, IoCubeOutline } from "react-icons/io5";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Link, NavLink, useOutletContext } from "react-router-dom";
import { SERVER_URL } from "../../router";

function ProductsScreen() {
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, searchTerm]);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await axios.get(`${SERVER_URL}/api/v1/products`, {
        params: {
          page: currentPage,
          itemsperpage: itemsPerPage,
          search: searchTerm,
        },
      });
      setProducts(response.data.data);
      setTotalPages(response.data.pages_count);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <IoCubeOutline className="text-teal-600" /> Products
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Manage and track your inventory ecosystem.
          </p>
        </div>

        <NavLink
          to="new"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold rounded-2xl shadow-xl shadow-teal-200 hover:bg-slate-900 hover:shadow-slate-200 transition-all active:scale-95"
        >
          <IoAdd size={24} />
          <span>Create Product</span>
        </NavLink>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
          <input
            type="text"
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-sm focus:ring-4 focus:ring-teal-500/10 focus:bg-white transition-all outline-none"
            placeholder="Search by name, serial, or model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Show</span>
          <select 
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
            className="bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-2 focus:ring-2 focus:ring-teal-500/20 outline-none"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Details</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Identifiers</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 text-center">Spec</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Warranty</th>
                <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan="10" className="py-20 text-center">
                    <LoadingIndicator />
                  </td>
                </tr>
              ) : (
                products.map((product, idx) => (
                  <ProductRow
                    key={product._id}
                    index={idx}
                    product={product}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-bold text-slate-400">
            Page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-teal-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
            >
              <IoIosArrowBack size={20} />
            </button>
            
            <input
              type="number"
              className="w-12 h-10 text-center font-bold bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20"
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
            />

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-teal-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
            >
              <IoIosArrowForward size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductRow({ product, index, currentPage, itemsPerPage }) {
  const [_, user] = useOutletContext();
  const isOwner = user._id === product.createdBy;

  return (
    <tr className="group hover:bg-teal-50/30 transition-colors">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-300 w-4">
            {index + 1 + (currentPage - 1) * itemsPerPage}
          </span>
          <div>
            <h5 className="text-sm font-black text-slate-900 group-hover:text-teal-700 transition-colors">
              {product.title}
            </h5>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              {product.manufacturer.name}
            </p>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase">SN</span>
            <code className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {product.serialNo}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-400 uppercase">MD</span>
            <span className="text-xs font-bold text-slate-500">{product.model}</span>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex flex-col items-center gap-1.5">
          <Badge label="Part" active={product.isPart} color="blue" />
          <Badge label="Rack" active={product.rackMountable} color="indigo" />
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-700">{product.warrantyMonths}m</span>
          <span className="text-[10px] font-bold text-slate-400">Purchased: {product.dateOfPurchase.split("T")[0]}</span>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center justify-center gap-2">
          <Link
            to={`history/${product._id}`}
            className="p-2 bg-slate-900 text-white rounded-xl hover:bg-teal-600 transition-all shadow-lg shadow-slate-200"
            title="View History"
          >
            <IoEyeOutline size={18} />
          </Link>
          
          <NavLink
            to={!isOwner ? "#" : `edit/${product._id}`}
            className={`p-2 rounded-xl transition-all shadow-lg ${
              isOwner 
                ? "bg-white border border-slate-200 text-slate-600 hover:bg-teal-50 hover:text-teal-700" 
                : "bg-slate-50 text-slate-200 cursor-not-allowed"
            }`}
            title={isOwner ? "Edit Product" : "Unauthorized"}
          >
            <IoPencilOutline size={18} />
          </NavLink>
        </div>
      </td>
    </tr>
  );
}

// Utility Badge Component
function Badge({ label, active, color }) {
  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
      active 
        ? `bg-${color}-50 text-${color}-600 border border-${color}-100` 
        : "bg-slate-50 text-slate-300 border border-slate-100"
    }`}>
      {label}
    </span>
  );
}

export default ProductsScreen;