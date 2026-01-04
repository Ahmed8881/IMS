import { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";
import { SERVER_URL } from "../../../router";
import { IoStatsChart, IoPieChart, IoBarChart } from "react-icons/io5";

export const AnalyticsComponent = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/api/v1/analytics/`);
        setAnalyticsData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Shared Chart Options for a cleaner look
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20, font: { size: 12, weight: '600' } }
      }
    }
  };

  if (loading) return (
    <div className="w-full py-20 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest">Generating Insights...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Dashboard Section Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <IoStatsChart size={20} />
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight">System Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* UseBy Analytics (Pie Chart) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <IoPieChart className="text-blue-500" size={24} />
            <h2 className="text-lg font-bold text-slate-800">{analyticsData.useby.title}</h2>
          </div>
          <div className="max-w-[280px] mx-auto">
            <Pie 
              options={chartOptions}
              data={{
                labels: analyticsData.useby.labels,
                datasets: [{
                  data: analyticsData.useby.data,
                  backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#6366f1"],
                  borderWidth: 0,
                  hoverOffset: 20
                }],
              }}
            />
          </div>
        </div>

        {/* Expiry Analytics (Bar Chart) */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <IoBarChart className="text-rose-500" size={24} />
            <h2 className="text-lg font-bold text-slate-800">{analyticsData.expiry.title}</h2>
          </div>
          <Bar
            options={chartOptions}
            data={{
              labels: analyticsData.expiry.labels,
              datasets: [{
                label: 'Items',
                data: analyticsData.expiry.data,
                backgroundColor: "#f43f5e",
                borderRadius: 12,
                barThickness: 30,
              }],
            }}
          />
        </div>

        {/* Status Analytics (Wide Bar Chart) */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <IoBarChart className="text-emerald-500" size={24} />
            <h2 className="text-lg font-bold text-slate-800">{analyticsData.status.title}</h2>
          </div>
          <div className="h-[300px]">
            <Bar
              options={{...chartOptions, maintainAspectRatio: false}}
              data={{
                labels: analyticsData.status.labels,
                datasets: [{
                  label: 'Unit Count',
                  data: analyticsData.status.data,
                  backgroundColor: ["#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"],
                  borderRadius: 8,
                }],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsComponent;