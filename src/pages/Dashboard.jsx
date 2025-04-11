// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const STAGES = ['Ideation', 'Planning', 'Launch', 'Funding'];

const ProgressBar = ({ current }) => (
  <div className="flex space-x-2">
    {STAGES.map((stage) => (
      <span
        key={stage}
        className={`px-2 py-1 rounded text-white text-sm ${
          stage === current ? 'bg-green-500' : 'bg-gray-600'
        }`}
      >
        {stage}
      </span>
    ))}
  </div>
);

export default function Dashboard() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: eData } = await supabase.from('entrepreneurs').select('*').order('date', { ascending: false });
      setEntrepreneurs(eData || []);

      const { data: aData } = await supabase.from('entrepreneurs').select('id, name, business, type, referred, date');
      setActivity(aData || []);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Recent Activity Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 text-white">
            <thead>
              <tr className="bg-gray-800 text-left">
                <th className="p-2">Date</th>
                <th className="p-2">Entrepreneur</th>
                <th className="p-2">Action</th>
                <th className="p-2">Partner</th>
                <th className="p-2">Progress</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((entry) => (
                <tr key={entry.id} className="border-t border-gray-700">
                  <td className="p-2">{new Date(entry.date).toDateString()}</td>
                  <td className="p-2 font-semibold">{entry.name}</td>
                  <td className="p-2">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">Added</span>
                  </td>
                  <td className="p-2">{entry.referred}</td>
                  <td className="p-2">
                    <ProgressBar current={entry.type} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Summary Cards */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Entrepreneur Overview</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {entrepreneurs.map((e) => (
            <div key={e.id} className="bg-white text-black rounded p-4 shadow space-y-2">
              <div className="font-bold text-lg">{e.name}</div>
              <div className="text-gray-600">{e.business}</div>
              <ProgressBar current={e.type} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
