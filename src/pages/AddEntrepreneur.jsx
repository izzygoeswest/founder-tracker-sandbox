import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth';

const AddEntrepreneur = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [testName, setTestName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from('entrepreneurs')
      .insert([{ name: testName || 'Test', user_id: user.id }]); // Only testing minimal insert

    if (error) {
      console.error('Insert test failed:', error);
      alert('Test insert failed');
    } else {
      alert('Test insert worked!');
      navigate('/entrepreneurs'); // Optional
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Test Insert</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="testName"
          placeholder="Name to Insert (Test)"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          className="w-full p-2 rounded text-black"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Run Insert Test
        </button>
      </form>
    </div>
  );
};

export default AddEntrepreneur;
