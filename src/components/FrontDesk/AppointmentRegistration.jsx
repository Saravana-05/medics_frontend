// src/components/FrontDesk/AppointmentRegistration.jsx
import React, { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import ExistingPatientSection from './ExistingPatientSection';
import NewPatientSection from './NewPatientSection';

const AppointmentRegistration = () => {
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' or 'new'

  const handleFormSubmit = (data) => {
    console.log('Form submitted:', data);
    // Handle form submission - send to API or parent component
    if (data.patientType === 'existing') {
      console.log('Existing patient appointment booked:', data);
      alert('Appointment booked successfully for existing patient!');
    } else {
      console.log('New patient registered:', data);
      alert('New patient registered and appointment booked successfully!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Appointment & Registration</h1>
        <p className="text-sm text-gray-500">Book appointments or register new patients</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-lg shadow-sm border border-gray-100 p-1">
        <button
          onClick={() => setActiveTab('existing')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'existing' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users size={16} />
          Existing Patient
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'new' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <UserPlus size={16} />
          New Patient
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {activeTab === 'existing' ? (
          <ExistingPatientSection onFormSubmit={handleFormSubmit} />
        ) : (
          <NewPatientSection onFormSubmit={handleFormSubmit} />
        )}
      </div>
    </div>
  );
};

export default AppointmentRegistration;