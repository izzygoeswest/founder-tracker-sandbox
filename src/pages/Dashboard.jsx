
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import ProgressBar from '../components/ProgressBar';

const Dashboard = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('entrepreneurs').select('*');
      if (error) {
        console.error('Error fetching entrepreneurs:', error.message);
      } else {
        setEntrepreneurs(data);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid gap-4">
        {entrepreneurs.map((ent) => (
          <div key={ent.id} className="bg-white text-black p-4 rounded shadow">
            <h3 className="text-lg font-bold">{ent.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{ent.business}</p>
            <ProgressBar currentStage={ent.stage} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
