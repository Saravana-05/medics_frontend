// src/components/FrontDesk/OPList.jsx
import React, { useState } from 'react';
import { Search, User, Calendar, Clock, CheckCircle, XCircle, Stethoscope } from 'lucide-react';

const OPList = ({ onSelectPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');

  const opPatients = [
    { 
      id: 1, 
      name: 'John Doe', 
      age: 45, 
      phone: '9876543210', 
      doctor: 'Dr. Aravind Kumar',
      appointmentTime: '10:00 AM',
      status: 'Waiting',
      token: '001'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      age: 32, 
      phone: '9876543211', 
      doctor: 'Dr. Priya Sharma',
      appointmentTime: '11:30 AM',
      status: 'In Progress',
      token: '002'
    },
    { 
      id: 3, 
      name: 'Robert Johnson', 
      age: 58, 
      phone: '9876543212', 
      doctor: 'Dr. Rajesh Patel',
      appointmentTime: '2:00 PM',
      status: 'Completed',
      token: '003'
    },
    { 
      id: 4, 
      name: 'Mary Williams', 
      age: 28, 
      phone: '9876543213', 
      doctor: 'Dr. Sneha Reddy',
      appointmentTime: '3:30 PM',
      status: 'Waiting',
      token: '004'
    },
    { 
      id: 5, 
      name: 'David Wilson', 
      age: 42, 
      phone: '9876543214', 
      doctor: 'Dr. Aravind Kumar',
      appointmentTime: '4:00 PM',
      status: 'Waiting',
      token: '005'
    },
    { 
      id: 6, 
      name: 'Sarah Davis', 
      age: 29, 
      phone: '9876543215', 
      doctor: 'Dr. Priya Sharma',
      appointmentTime: '5:00 PM',
      status: 'In Progress',
      token: '006'
    },
  ];

  // Extract unique doctors from OP patients
  const getUniqueDoctors = () => {
    const doctors = new Set();
    opPatients.forEach(patient => {
      if (patient.doctor) {
        doctors.add(patient.doctor);
      }
    });
    return Array.from(doctors);
  };

  const doctors = getUniqueDoctors();

  const filteredPatients = opPatients.filter(patient => {
    // Search filter
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.phone.includes(searchTerm) ||
                          patient.token?.includes(searchTerm);
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    
    // Doctor filter
    const matchesDoctor = filterDoctor === 'all' || patient.doctor === filterDoctor;
    
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Waiting': return 'bg-yellow-100 text-yellow-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Waiting': return <Clock size={12} className="text-yellow-600" />;
      case 'In Progress': return <CheckCircle size={12} className="text-blue-600" />;
      case 'Completed': return <CheckCircle size={12} className="text-green-600" />;
      default: return null;
    }
  };

  // Count patients by status for stats
  const getStatusCount = (status) => {
    return opPatients.filter(p => p.status === status).length;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">OP List</h1>
        <p className="text-sm text-gray-500">Manage outpatient appointments</p>
      </div>

      {/* Status Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center">
          <div className="text-xs text-gray-500">Total</div>
          <div className="text-xl font-bold text-gray-800">{opPatients.length}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-100 p-3 text-center">
          <div className="text-xs text-yellow-600">Waiting</div>
          <div className="text-xl font-bold text-yellow-700">{getStatusCount('Waiting')}</div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-100 p-3 text-center">
          <div className="text-xs text-blue-600">In Progress</div>
          <div className="text-xl font-bold text-blue-700">{getStatusCount('In Progress')}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow-sm border border-green-100 p-3 text-center">
          <div className="text-xs text-green-600">Completed</div>
          <div className="text-xl font-bold text-green-700">{getStatusCount('Completed')}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone or token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="Waiting">Waiting</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
          >
            <option value="all">All Doctors</option>
            {doctors.map((doctor, index) => (
              <option key={index} value={doctor}>{doctor}</option>
            ))}
          </select>
        </div>

        {/* Filter summary */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Showing {filteredPatients.length} of {opPatients.length} patients
          </span>
          {(filterStatus !== 'all' || filterDoctor !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterDoctor('all');
                setSearchTerm('');
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* OP List Cards */}
      <div className="space-y-3">
        {filteredPatients.map((patient) => (
          <div 
            key={patient.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectPatient && onSelectPatient(patient)}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center relative">
                  <User size={18} className="text-blue-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[8px] flex items-center justify-center font-bold">
                    {patient.token || patient.id}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">{patient.name}</h3>
                  <p className="text-xs text-gray-500">{patient.age} yrs • {patient.phone}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Stethoscope size={14} className="text-gray-400" />
                  {patient.doctor}
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={14} className="text-gray-400" />
                  {patient.appointmentTime}
                </div>
                <span className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                  {getStatusIcon(patient.status)}
                  {patient.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredPatients.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <User size={32} className="text-gray-300" />
              <p className="text-sm text-gray-500">No OP patients found</p>
              <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OPList;