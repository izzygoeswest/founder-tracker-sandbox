import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ProgressBar from '../components/ProgressBar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function Dashboard() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEntrepreneurs = async () => {
    const { data, error } = await supabase.from('entrepreneurs').select('*');
    if (!error) {
      setEntrepreneurs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntrepreneurs();
  }, []);

  const total = entrepreneurs.length;

  const typeCounts = entrepreneurs.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  const recentContacts = entrepreneurs
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const partnerCounts = entrepreneurs.reduce((acc, curr) => {
    acc[curr.referred] = (acc[curr.referred] || 0) + 1;
    return acc;
  }, {});

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const stageOrder = ['Ideation', 'Planning', 'Launch', 'Funding'];

  const trends = stageOrder.map(stage => ({
    name: stage,
    value: entrepreneurs.filter(e => e.stage === stage).length,
  }));

  const pieData = Object.entries(typeCounts).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <div className="p-6 space-y-6 text-white">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Top Summary Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded shadow">
              <h2 className="text-lg font-bold">Total Entrepreneurs</h2>
              <p className="text-2xl">{total}</p>
            </div>

            <div className="bg-gray-800 p-4 rounded shadow">
              <h2 className="text-lg font-bold">Business Types</h2>
              <ul className="text-sm">
                {Object.entries(typeCounts).map(([type, count]) => (
                  <li key={type}>
                    {type}: {count}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800 p-4 rounded shadow">
              <h2 className="text-lg font-bold">Recent Contacts</h2>
              <ul className="text-sm">
                {recentContacts.map(e => (
                  <li key={e.id}>
                    {e.name} – {new Date(e.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800 p-4 rounded shadow">
              <h2 className="text-lg font-bold">Partner Referrals</h2>
              <ul className="text-sm">
                {Object.entries(partnerCounts).map(([partner, count]) => (
                  <li key={partner}>
                    {partner}: {count}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
            {recentContacts.map(e => (
              <div key={e.id} className="mb-3 p-2 border-b border-gray-600">
                <div className="font-semibold">{e.name}</div>
                <div className="text-sm text-gray-400">
                  {new Date(e.date).toLocaleDateString()} – {e.referred}
                </div>
                <ProgressBar currentStage={e.stage} />
              </div>
            ))}
          </div>

          {/* Monthly Trends Bar Chart */}
          <div className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Monthly Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Business Type Distribution Pie Chart */}
          <div className="bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-4">Business Type Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
