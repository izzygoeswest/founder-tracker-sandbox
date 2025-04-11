import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const STAGES = ['Ideation', 'Planning', 'Launch', 'Funding'];

const Dashboard = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);

  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      const { data, error } = await supabase.from('entrepreneurs').select('*');
      if (error) {
        console.error('Error fetching entrepreneurs:', error.message);
      } else {
        setEntrepreneurs(data);
      }
    };
    fetchEntrepreneurs();
  }, []);

  const renderStageButtons = (currentStage) => {
    return STAGES.map((stage) => {
      const isActive = stage === currentStage;
      return (
        <button
          key={stage}
          className={`px-2 py-1 rounded text-sm font-medium ${
            isActive ? 'bg-green-500 text-white' : 'bg-gray-700 text-white'
          }`}
          disabled
        >
          {stage}
        </button>
      );
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
      <table className="w-full text-sm text-left text-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Entrepreneur</th>
            <th className="px-4 py-2">Action</th>
            <th className="px-4 py-2">Partner</th>
            <th className="px-4 py-2">Progress</th>
          </tr>
        </thead>
        <tbody>
          {entrepreneurs.map((e) => (
            <tr key={e.id} className="border-t border-gray-700">
              <td className="px-4 py-2">{new Date(e.created_at).toDateString()}</td>
              <td className="px-4 py-2 font-semibold">{e.name}</td>
              <td className="px-4 py-2">
                <span className="bg-blue-500 text-white px-2 py-1 rounded">Added</span>
              </td>
              <td className="px-4 py-2">{e.referred}</td>
              <td className="px-4 py-2 flex gap-1">{renderStageButtons(e.current_stage)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
