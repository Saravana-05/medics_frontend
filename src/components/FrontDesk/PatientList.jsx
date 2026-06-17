// src/components/FrontDesk/PatientList.jsx
import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2, User, Phone, Calendar, Stethoscope } from 'lucide-react';

const PatientList = ({ patients = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');

  // Extract unique doctors from patients data
  const getUniqueDoctors = () => {
    const doctors = new Set();
    patients.forEach(patient => {
      if (patient.doctor) {
        doctors.add(patient.doctor);
      }
    });
    return Array.from(doctors);
  };

  const doctors = getUniqueDoctors();

  const filteredPatients = patients.filter(patient => {
    // Search filter
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.contact?.includes(searchTerm) ||
                          patient.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter (OP/IP)
    const matchesType = filter === 'all' || patient.type === filter;
    
    // Doctor filter
    const matchesDoctor = filterDoctor === 'all' || patient.doctor === filterDoctor;
    
    return matchesSearch && matchesType && matchesDoctor;
  });

  // Function to get status badge color
  const getStatusBadge = (type) => {
    if (type === 'OP') {
      return 'bg-green-100 text-green-700';
    } else if (type === 'IP') {
      return 'bg-blue-100 text-blue-700';
    }
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patient List</h1>
        <p className="text-sm text-gray-500">View and manage all registered patients</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
          >
            <option value="all">All Types</option>
            <option value="OP">OP Patients</option>
            <option value="IP">IP Patients</option>
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
            Showing {filteredPatients.length} of {patients.length} patients
          </span>
          {(filter !== 'all' || filterDoctor !== 'all') && (
            <button
              onClick={() => {
                setFilter('all');
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

      {/* Patient Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age/Gender</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-800">{patient.name}</span>
                          {patient.id && (
                            <div className="text-[0.55rem] text-gray-400">{patient.id}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {patient.age} yrs / {patient.gender}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone size={12} className="text-gray-400" />
                        {patient.contact}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Stethoscope size={12} className="text-gray-400" />
                        {patient.doctor || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(patient.type || 'OP')}`}>
                        {patient.type || 'OP'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-1 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Patient"
                        >
                          <Eye size={14} className="text-blue-600" />
                        </button>
                        <button 
                          className="p-1 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit Patient"
                        >
                          <Edit size={14} className="text-yellow-600" />
                        </button>
                        <button 
                          className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Patient"
                        >
                          <Trash2 size={14} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <User size={32} className="text-gray-300" />
                      <p className="text-sm text-gray-500">No patients found</p>
                      <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientList;