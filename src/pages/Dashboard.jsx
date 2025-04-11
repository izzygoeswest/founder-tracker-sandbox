import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function Dashboard() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('entrepreneurs').select('*');
      if (error) console.error('Error fetching data:', error.message);
      else setEntrepreneurs(data);
    };

    fetchData();
  }, []);

  const getMonthlyTrends = () => {
    const counts = {};
    entrepreneurs.forEach(e => {
      const month = new Date(e.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      counts[month] = (counts[month] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const values = Object.values(counts);

    return {
      labels,
      datasets: [{
        label: 'Monthly Trends',
        data: values,
        backgroundColor: '#3B82F6',
      }],
    };
  };

  const getBusinessTypeData = () => {
    const counts = { Ideation: 0, Startup: 0, Established: 0 };
    entrepreneurs.forEach(e => {
      if (counts[e.type]) counts[e.type]++;
    });

    return {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Business Types',
        data: Object.values(counts),
        backgroundColor: ['#8b5cf6', '#0ea5e9', '#10b981'],
      }],
    };
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4 text-white">Dashboard</h1>

      {/* Monthly Trends & Business Type Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-4 rounded shadow">
          <h2 className="text-white text-lg font-semibold mb-2">Monthly Trends</h2>
          <Bar data={getMonthlyTrends()} />
        </div>
        <div className="bg-gray-900 p-4 rounded shadow">
          <h2 className="text-white text-lg font-semibold mb-2">Business Type Distribution</h2>
          <Pie data={getBusinessTypeData()} />
        </div>
      </div>
    </div>
  );
}
