import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="page-container max-w-2xl">
      <h1 className="page-title">Settings</h1>

      <div className="space-y-4">
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-white text-sm font-medium">Email</div>
                <div className="text-dark-400 text-xs">{user?.email}</div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-white text-sm font-medium">Member Since</div>
                <div className="text-dark-400 text-xs">June 2026</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-sm">Email Notifications</div>
                <div className="text-dark-400 text-xs">Receive buddy request emails</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white text-sm">Push Notifications</div>
                <div className="text-dark-400 text-xs">Receive app notifications</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">About</h2>
          <div className="space-y-3 text-sm text-dark-300">
            <p>FitConnect v1.0.0</p>
            <p>Smart Gym Buddy Finder</p>
            <p className="text-dark-400 text-xs">
              Built with React, Node.js, MongoDB, and Socket.IO
            </p>
          </div>
        </div>

        <button
          className="btn-danger w-full"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
