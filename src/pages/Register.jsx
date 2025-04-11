import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const token = uuidv4(); // Generate confirmation token

    // Step 1: Register the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setErrorMsg(error.message);
      return;
    }

    const userId = data?.user?.id || data?.session?.user?.id;

    // Step 2: Insert profile into the 'profiles' table
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: userId,
        email,
        is_confirmed: false,
        confirmation_token: token
      }
    ]);

    if (profileError) {
      setErrorMsg(profileError.message);
      return;
    }

    // Step 3: Send confirmation email
    try {
      const response = await fetch('/.netlify/functions/send-confirmation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token })
      });

      const result = await response.json();
      if (response.ok) {
        alert('Registration successful! Check your email to confirm.');
        navigate('/login');
      } else {
        console.error('Email error:', result);
        setErrorMsg('Registered, but email failed.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setErrorMsg('Registered, but could not send confirmation email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black px-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left */}
        <div className="bg-white p-10 space-y-6">
          <h1 className="text-2xl font-bold text-gray-900">Founder Tracker</h1>
          <p className="text-gray-700">
            A collaborative platform to track entrepreneurs on their journey.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>✅ Track Progress</li>
            <li>✅ Collaborate</li>
            <li>✅ Analytics</li>
          </ul>
        </div>

        {/* Right */}
        <form onSubmit={handleRegister} className="bg-gray-100 p-10 space-y-4">
          <h2 className="text-xl font-bold text-center text-gray-900">Register</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Register
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
