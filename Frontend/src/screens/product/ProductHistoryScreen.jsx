import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingIndicator from "../../components/LoadingIndicator";
import ShowErrorMessage from "../../components/ShowErrorMessage";
import { IoCubeOutline, IoTimeOutline, IoLocationOutline, IoShieldCheckmarkOutline, IoBusinessOutline, IoCalendarOutline } from "react-icons/io5";
import { useParams, Link } from "react-router-dom";
import { SERVER_URL } from "../../router";

function ProductHistoryScreen() {
  const params = useParams();
  const [isLoading, setLoading] = useState(true);
  const [productData, setData] = useState(null);
  const [isError, setError] = useState("");

  useEffect(() => {
    getDataFromApi();
  }, []);

  async function getDataFromApi() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${SERVER_URL}/api/v1/products/${params.id}/history`);
      setData(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (isLoading) return <div className="h-screen flex items-center justify-center"><LoadingIndicator /></div>;
  if (isError) return <div className="h-screen p-10"><ShowErrorMessage onClick={getDataFromApi}>{isError}</ShowErrorMessage></div>;

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* Header & Back Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link to="/products" className="text-xs font-black text-teal-600 uppercase tracking-widest hover:underline mb-2 block">
            ← Back to Inventory
          </Link>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <IoCubeOutline className="text-slate-400" /> {productData.title}
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mt-2">{productData.description}</p>
        </div>
        <div className="bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200">
           <span className="text-[10px] font-black text-slate-400 uppercase block">Serial Number</span>
           <code className="text-sm font-bold text-slate-700">{productData.serialNo}</code>
        </div>
      </div>

      {/* Product Specification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SpecCard icon={<IoBusinessOutline/>} label="Manufacturer" value={productData.manufacturer.name} />
        <SpecCard icon={<IoCalendarOutline/>} label="Purchase Date" value={productData.dateOfPurchase.split("T")[0]} />
        <SpecCard icon={<IoShieldCheckmarkOutline/>} label="Warranty" value={`${productData.warrantyMonths} Months`} />
        <SpecCard icon={<IoTimeOutline/>} label="Model" value={productData.model} />
        <div className="lg:col-span-2 flex gap-4">
            <Badge label="Rackmountable" active={productData.rackMountable} />
            <Badge label="Sub-Part" active={productData.isPart} />
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* History Timeline Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <IoTimeOutline className="text-teal-500" /> Asset Audit Trail
        </h2>
        
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {productData?.history.map((entry, idx) => (
            <TimelineItem key={entry._id} entry={entry} isLast={idx === productData.history.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Internal UI Components ---

const SpecCard = ({ icon, label, value }) => (
  <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
    <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const Badge = ({ label, active }) => (
  <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter border ${active ? 'bg-teal-50 border-teal-100 text-teal-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
    {label}: {active ? 'Yes' : 'No'}
  </div>
);

const TimelineItem = ({ entry }) => (
  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
    {/* Icon */}
    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-teal-600 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-500">
      <IoLocationOutline size={18} />
    </div>
    {/* Card */}
    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:border-teal-200">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h4 className="font-black text-slate-900">{entry.location.name}</h4>
        <time className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-1 rounded-lg uppercase tracking-widest">
          {new Date(entry.status[0]?.date).toLocaleDateString()}
        </time>
      </div>
      <p className="text-sm text-slate-500 mb-4 font-medium leading-relaxed">{entry.location.description}</p>
      <div className="flex flex-wrap gap-2">
        {entry.status.map((st, i) => (
          <span key={i} className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
            {st.name}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default ProductHistoryScreen;