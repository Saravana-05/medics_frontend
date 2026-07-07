// src/components/FrontDesk/Dashboard.jsx
import React from 'react';
import { Users, Calendar, ClipboardList, Clock } from 'lucide-react';

const Dashboard = ({ patients }) => {
  const stats = [
    { 
      title: "Total Patients", 
      value: patients?.length || 0, 
      icon: Users, 
      color: "#3b82f6",
      bg: "bg-blue-50"
    },
    { 
      title: "Today's Appointments", 
      value: 12, 
      icon: Calendar, 
      color: "var(--color-vital-height)",
      bg: "bg-purple-50"
    },
    { 
      title: "OP Visits", 
      value: 8, 
      icon: ClipboardList, 
      color: "#22c55e",
      bg: "bg-green-50"
    },
    { 
      title: "Pending Registrations", 
      value: 3, 
      icon: Clock, 
      color: "var(--color-warning)",
      bg: "bg-yellow-50"
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome to Front Office Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon size={20} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users size={14} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">New patient registered</p>
                <p className="text-xs text-gray-400">2 minutes ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;