// src/components/FrontDesk/ParkedList.jsx
import React, { useState } from 'react';
import { Archive, User, Clock, Calendar, Check, X, Search, Stethoscope, AlertCircle, UserCheck } from 'lucide-react';

const ParkedList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');

  const parkedPatients = [
    { 
      id: 1, 
      name: 'Michael Brown', 
      age: 34, 
      phone: '9876543214',
      doctor: 'Dr. Aravind Kumar',
      reason: 'Waiting for insurance verification',
      parkedSince: '2024-01-15 10:30 AM',
      status: 'lab',
      priority: 'High',
      token: 'P001'
    },
    { 
      id: 2, 
      name: 'Sarah Davis', 
      age: 29, 
      phone: '9876543215',
      doctor: 'Dr. Priya Sharma',
      reason: 'Need to upload documents',
      parkedSince: '2024-01-15 11:00 AM',
      status: 'lab',
      priority: 'Medium',
      token: 'P002'
    },
    { 
      id: 3, 
      name: 'David Wilson', 
      age: 42, 
      phone: '9876543216',
      doctor: 'Dr. Rajesh Patel',
      reason: 'Awaiting lab results',
      parkedSince: '2024-01-14 4:00 PM',
      status: 'service',
      priority: 'Low',
      token: 'P003'
    },
    { 
      id: 4, 
      name: 'Emily Johnson', 
      age: 38, 
      phone: '9876543217',
      doctor: 'Dr. Sneha Reddy',
      reason: 'Payment pending',
      parkedSince: '2024-01-16 9:30 AM',
      status: 'lab',
      priority: 'High',
      token: 'P004'
    },
    { 
      id: 5, 
      name: 'James Wilson', 
      age: 55, 
      phone: '9876543218',
      doctor: 'Dr. Aravind Kumar',
      reason: 'Awaiting specialist consultation',
      parkedSince: '2024-01-16 10:00 AM',
      status: 'service',
      priority: 'Medium',
      token: 'P005'
    },
  ];

  // Extract unique doctors from parked patients
  const getUniqueDoctors = () => {
    const doctors = new Set();
    parkedPatients.forEach(patient => {
      if (patient.doctor) {
        doctors.add(patient.doctor);
      }
    });
    return Array.from(doctors);
  };

  const doctors = getUniqueDoctors();

  const filteredPatients = parkedPatients.filter(patient => {
    // Search filter
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.phone.includes(searchTerm) ||
                          patient.token?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    
    // Doctor filter
    const matchesDoctor = filterDoctor === 'all' || patient.doctor === filterDoctor;
    
    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'lab': return 'bg-yellow-100 text-yellow-700';
      case 'service': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'High': return <AlertCircle size={12} className="text-red-600" />;
      case 'Medium': return <Clock size={12} className="text-orange-600" />;
      case 'Low': return <Check size={12} className="text-green-600" />;
      default: return null;
    }
  };

  // Count patients by status for stats
  const getStatusCount = (status) => {
    return parkedPatients.filter(p => p.status === status).length;
  };

  // Count patients by priority for stats
  const getPriorityCount = (priority) => {
    return parkedPatients.filter(p => p.priority === priority).length;
  };

  // Handle approve action
  const handleApprove = (patientId) => {
    console.log('Approved patient:', patientId);
    // Implement approve logic
    alert('Patient approved successfully!');
  };

  // Handle reject action
  const handleReject = (patientId) => {
    console.log('Rejected patient:', patientId);
    // Implement reject logic
    alert('Patient rejected successfully!');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Parked List</h1>
        <p className="text-sm text-gray-500">Manage pending registrations and verifications</p>
      </div>

      {/* Status Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 text-center">
          <div className="text-xs text-gray-500">Total Parked</div>
          <div className="text-xl font-bold text-gray-800">{parkedPatients.length}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-100 p-3 text-center">
          <div className="text-xs text-yellow-600">Pending</div>
          <div className="text-xl font-bold text-yellow-700">{getStatusCount('Pending')}</div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-100 p-3 text-center">
          <div className="text-xs text-blue-600">In Progress</div>
          <div className="text-xl font-bold text-blue-700">{getStatusCount('In Progress')}</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow-sm border border-red-100 p-3 text-center">
          <div className="text-xs text-red-600">High Priority</div>
          <div className="text-xl font-bold text-red-700">{getPriorityCount('High')}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, token or reason..."
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
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
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
            Showing {filteredPatients.length} of {parkedPatients.length} parked patients
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

      {/* Parked List */}
      <div className="space-y-3">
        {filteredPatients.map((patient) => (
          <div 
            key={patient.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  patient.priority === 'High' ? 'bg-red-100' : 
                  patient.priority === 'Medium' ? 'bg-orange-100' : 'bg-yellow-100'
                }`}>
                  <Archive size={18} className={
                    patient.priority === 'High' ? 'text-red-600' : 
                    patient.priority === 'Medium' ? 'text-orange-600' : 'text-yellow-600'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-gray-800">{patient.name}</h3>
                    <span className="text-xs text-gray-400">• {patient.age} yrs</span>
                    <span className={`text-[0.55rem] px-2 py-0.5 rounded-full border ${getPriorityColor(patient.priority)}`}>
                      {getPriorityIcon(patient.priority)}
                      {patient.priority}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span>{patient.phone}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Stethoscope size={10} className="text-gray-400" />
                      {patient.doctor}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <UserCheck size={10} className="text-gray-400" />
                      Token: {patient.token}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} className="text-gray-400" />
                    {patient.reason}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} className="text-gray-400" />
                  Parked: {patient.parkedSince}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                  {patient.status}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApprove(patient.id)}
                    className="p-1.5 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                    title="Approve"
                  >
                    <Check size={14} className="text-green-600" />
                  </button>
                  <button 
                    onClick={() => handleReject(patient.id)}
                    className="p-1.5 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                    title="Reject"
                  >
                    <X size={14} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredPatients.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <Archive size={32} className="text-gray-300" />
              <p className="text-sm text-gray-500">No parked patients found</p>
              <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkedList;