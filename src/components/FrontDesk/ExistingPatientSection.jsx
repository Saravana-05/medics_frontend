// src/components/FrontDesk/ExistingPatientSection.jsx
import React, { useState } from 'react';
import { 
  User, Phone, UserCheck, Heart, Activity, 
  Stethoscope, UserPlus, Calendar, Clock, 
  ChevronDown, FileText, ChevronRight, HeartPulse,
  XCircle, CheckCircle, Thermometer, Weight, Ruler, Droplet,
  X
} from 'lucide-react';
import PatientInfoPanel from '../../pages/OPDeskScreen/PatientInfoPanel';
import { MOCK_PATIENTS } from '../../pages/OPDeskScreen/mockData';

const ExistingPatientSection = ({ onFormSubmit }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [selectedPatientForInfo, setSelectedPatientForInfo] = useState(null);
  const [isEditingGynac, setIsEditingGynac] = useState(false);
  const [showSearchField, setShowSearchField] = useState(true);
  
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    relationName: '',
    phone: '',
    sex: '',
    age: '',
    dob: '',
    chiefComplaint: '',
    attender: '',
    referral: '',
    vitals: {
      bp: '',
      pulse: '',
      temperature: '',
      weight: '',
      height: '',
      spo2: '',
    },
    firstObservation: '',
    appointmentDate: '',
    appointmentTime: '',
    doctor: '',
  });

  const [gynacData, setGynacData] = useState({
    lmp: '',
    edd: '',
    pregnancies: '',
    deliveries: '',
    abortions: '',
    livingChildren: '',
    doc: '',
  });

  // Filter patients based on search term
  const filteredPatients = MOCK_PATIENTS.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle patient selection from dropdown
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      ...formData,
      patientId: patient.id,
      patientName: patient.name,
      relationName: patient.relation || '',
      phone: patient.phone || '',
      sex: patient.gender || '',
      age: patient.age || '',
      dob: patient.dob || '',
      chiefComplaint: patient.chiefComplaint || '',
      attender: patient.attender?.name || '',
      referral: patient.referral || '',
      vitals: {
        bp: patient.bp ? `${patient.bpSystolic}/${patient.bpDiastolic}` : '',
        pulse: patient.pulse || '',
        temperature: patient.temp || '',
        weight: patient.weight || '',
        height: patient.height || '',
        spo2: patient.spo2 || '',
      },
      firstObservation: patient.firstObservation || '',
    });
    setSearchTerm(patient.name);
    setShowDropdown(false);
    setShowSearchField(false); // Hide search field after selection
    
    // Check if patient has gynecology info
    if (patient.gynacInfo && patient.gender === 'Female') {
      setGynacData({
        lmp: patient.gynacInfo.lmp || '',
        edd: patient.gynacInfo.edd || '',
        pregnancies: patient.gynacInfo.pregnancies || '',
        deliveries: patient.gynacInfo.deliveries || '',
        abortions: patient.gynacInfo.abortions || '',
        livingChildren: patient.gynacInfo.livingChildren || '',
        doc: patient.gynacInfo.doc || '',
      });
      setIsEditingGynac(true);
    } else {
      setGynacData({
        lmp: '',
        edd: '',
        pregnancies: '',
        deliveries: '',
        abortions: '',
        livingChildren: '',
        doc: '',
      });
      setIsEditingGynac(false);
    }
  };

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('vitals.')) {
      const vitalKey = name.split('.')[1];
      setFormData({
        ...formData,
        vitals: {
          ...formData.vitals,
          [vitalKey]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle gynecology data change
  const handleGynacChange = (e) => {
    const { name, value } = e.target;
    setGynacData({
      ...gynacData,
      [name]: value,
    });
  };

  // Reset form fields
  const resetForm = () => {
    setSelectedPatient(null);
    setSearchTerm('');
    setShowDropdown(false);
    setShowSearchField(true);
    setFormData({
      patientId: '',
      patientName: '',
      relationName: '',
      phone: '',
      sex: '',
      age: '',
      dob: '',
      chiefComplaint: '',
      attender: '',
      referral: '',
      vitals: {
        bp: '',
        pulse: '',
        temperature: '',
        weight: '',
        height: '',
        spo2: '',
      },
      firstObservation: '',
      appointmentDate: '',
      appointmentTime: '',
      doctor: '',
    });
    setGynacData({
      lmp: '',
      edd: '',
      pregnancies: '',
      deliveries: '',
      abortions: '',
      livingChildren: '',
      doc: '',
    });
    setIsEditingGynac(false);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPatient) {
      const submitData = {
        ...formData,
        gynacData: isEditingGynac ? gynacData : null,
        patientType: 'existing'
      };
      if (onFormSubmit) {
        onFormSubmit(submitData);
      } else {
        console.log('Existing Patient Appointment:', submitData);
        alert('Appointment booked successfully!');
      }
      // Reset form after submission
      resetForm();
    }
  };

  // Handle view patient info
  const handleViewPatientInfo = () => {
    if (selectedPatient) {
      setSelectedPatientForInfo(selectedPatient);
      setShowPatientInfo(true);
    }
  };

  // Handle show search field
  const handleShowSearch = () => {
    setShowSearchField(true);
    setSelectedPatient(null);
    setSearchTerm('');
  };

  // Render dropdown item with patient details
  const renderDropdownItem = (patient) => {
    return (
      <div 
        key={patient.id}
        onClick={() => handleSelectPatient(patient)}
        className="px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">{patient.name}</span>
              <span className="text-xs text-gray-400">{patient.id}</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
              <span>{patient.relation || '—'}</span>
              <span>•</span>
              <span>{patient.phone || '—'}</span>
              <span>•</span>
              <span>{patient.age || '—'} yrs</span>
              <span>•</span>
              <span>{patient.gender || '—'}</span>
            </div>
          </div>
          {patient.gynacInfo && (
            <span className="text-[0.55rem] px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
              Gynac
            </span>
          )}
        </div>
      </div>
    );
  };

  // Render vitals section - all fields in one row with combined BP
  const renderVitals = () => (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      <div>
        <label className="block text-[0.65rem] font-semibold text-gray-600 mb-0.5">
          BP (Sys/Dias)
        </label>
        <div className="relative">
          <Heart size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="vitals.bp"
            value={formData.vitals.bp}
            onChange={handleInputChange}
            className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="120/80"
          />
        </div>
      </div>
      <div>
        <label className="block text-[0.65rem] font-semibold text-gray-600 mb-0.5">
          Pulse
        </label>
        <div className="relative">
          <Activity size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="number"
            name="vitals.pulse"
            value={formData.vitals.pulse}
            onChange={handleInputChange}
            className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="BPM"
          />
        </div>
      </div>
      <div>
        <label className="block text-[0.65rem] font-semibold text-gray-600 mb-0.5">
          Temperature
        </label>
        <div className="relative">
          <Thermometer size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="vitals.temperature"
            value={formData.vitals.temperature}
            onChange={handleInputChange}
            className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="°F"
          />
        </div>
      </div>
      <div>
        <label className="block text-[0.65rem] font-semibold text-gray-600 mb-0.5">
          Weight
        </label>
        <div className="relative">
          <Weight size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="vitals.weight"
            value={formData.vitals.weight}
            onChange={handleInputChange}
            className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="kg"
          />
        </div>
      </div>
      <div>
        <label className="block text-[0.65rem] font-semibold text-gray-600 mb-0.5">
          Height
        </label>
        <div className="relative">
          <Ruler size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="vitals.height"
            value={formData.vitals.height}
            onChange={handleInputChange}
            className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="cm"
          />
        </div>
      </div>
      <div>
        <label className="block text-[0.65rem] font-semibold text-gray-600 mb-0.5">
          SpO2
        </label>
        <div className="relative">
          <Droplet size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="vitals.spo2"
            value={formData.vitals.spo2}
            onChange={handleInputChange}
            className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="%"
          />
        </div>
      </div>
    </div>
  );

  // Render gynecology section for existing female patients
  const renderGynecologySection = () => {
    if (!selectedPatient || selectedPatient.gender !== 'Female') return null;
    
    return (
      <div className="mt-4 p-4 bg-gradient-to-r from-pink-100 to-white rounded-lg border border-pink-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HeartPulse size={16} className="text-pink-600" />
            <h4 className="text-sm font-semibold text-pink-800">Gynecology Information</h4>
          </div>
          <button
            onClick={() => setIsEditingGynac(!isEditingGynac)}
            className="text-xs font-medium text-pink-600 hover:text-pink-800"
          >
            {isEditingGynac ? 'Hide Details' : 'Edit Details'}
          </button>
        </div>
        
        {isEditingGynac && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[0.6rem] font-medium text-pink-700 mb-1">LMP</label>
              <input
                type="date"
                name="lmp"
                value={gynacData.lmp}
                onChange={handleGynacChange}
                className="w-full px-3 py-1.5 text-sm border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[0.6rem] font-medium text-pink-700 mb-1">EDD</label>
              <input
                type="date"
                name="edd"
                value={gynacData.edd}
                onChange={handleGynacChange}
                className="w-full px-3 py-1.5 text-sm border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[0.6rem] font-medium text-pink-700 mb-1">Doctor</label>
              <input
                type="text"
                name="doc"
                value={gynacData.doc}
                onChange={handleGynacChange}
                className="w-full px-3 py-1.5 text-sm border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                placeholder="Consultant Doctor"
              />
            </div>
            <div>
              <label className="block text-[0.6rem] font-medium text-pink-700 mb-1">Pregnancies</label>
              <input
                type="number"
                name="pregnancies"
                value={gynacData.pregnancies}
                onChange={handleGynacChange}
                className="w-full px-3 py-1.5 text-sm border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-[0.6rem] font-medium text-pink-700 mb-1">Deliveries</label>
              <input
                type="number"
                name="deliveries"
                value={gynacData.deliveries}
                onChange={handleGynacChange}
                className="w-full px-3 py-1.5 text-sm border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-[0.6rem] font-medium text-pink-700 mb-1">Abortions</label>
              <input
                type="number"
                name="abortions"
                value={gynacData.abortions}
                onChange={handleGynacChange}
                className="w-full px-3 py-1.5 text-sm border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-[0.6rem] font-medium text-pink-700 mb-1">Living Children</label>
              <input
                type="number"
                name="livingChildren"
                value={gynacData.livingChildren}
                onChange={handleGynacChange}
                className="w-full px-3 py-1.5 text-sm border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
                placeholder="0"
              />
            </div>
          </div>
        )}
        
        {!isEditingGynac && gynacData.lmp && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {gynacData.lmp && (
              <div className="bg-white p-2 rounded border border-pink-200">
                <span className="text-[0.6rem] text-pink-600 block">LMP</span>
                <span className="font-medium">{gynacData.lmp}</span>
              </div>
            )}
            {gynacData.edd && (
              <div className="bg-white p-2 rounded border border-pink-200">
                <span className="text-[0.6rem] text-pink-600 block">EDD</span>
                <span className="font-medium">{gynacData.edd}</span>
              </div>
            )}
            {gynacData.doc && (
              <div className="bg-white p-2 rounded border border-pink-200">
                <span className="text-[0.6rem] text-pink-600 block">Doctor</span>
                <span className="font-medium">{gynacData.doc}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Patient Search - Hidden after selection */}
      {showSearchField && (
        <div className="mb-4 relative">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Select Patient Name
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient by name, ID, or phone..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ChevronDown 
              size={16} 
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform ${
                showDropdown ? 'rotate-180' : ''
              }`}
              onClick={() => setShowDropdown(!showDropdown)}
            />
          </div>

          {/* Dropdown */}
          {showDropdown && searchTerm && (
            <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto">
              {filteredPatients.length > 0 ? (
                filteredPatients.map(renderDropdownItem)
              ) : (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  No patients found
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Patient Details Fields */}
      {selectedPatient && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Info Section with X icon - Gradient Background from Blue to White */}
          <div className="bg-gradient-to-r from-blue-100 to-white rounded-lg border border-blue-200 p-4 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User size={16} className="text-blue-600" />
                <h4 className="text-sm font-semibold text-blue-800">Patient Information</h4>
              </div>
              <button
                type="button"
                onClick={handleShowSearch}
                className="p-1 hover:bg-blue-200 rounded-lg transition-colors"
                title="Change patient"
              >
                <X size={16} className="text-blue-600" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[0.6rem] font-medium text-gray-600 mb-1">
                  Patient Name
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.6rem] font-medium text-gray-600 mb-1">
                  Father/Husband/Guardian
                </label>
                <div className="relative">
                  <UserCheck size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="relationName"
                    value={formData.relationName}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.6rem] font-medium text-gray-600 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-[0.6rem] font-medium text-gray-600 mb-1">
                  Sex / Age / DOB
                </label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    name="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    className="w-1/3 px-2 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                    readOnly
                    placeholder="Sex"
                  />
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-1/3 px-2 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                    readOnly
                    placeholder="Age"
                  />
                  <input
                    type="text"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-1/3 px-2 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                    readOnly
                    placeholder="DOB"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Chief Complaint, Attender & Referral - Separate section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Chief Complaint
              </label>
              <textarea
                name="chiefComplaint"
                value={formData.chiefComplaint}
                onChange={handleInputChange}
                rows="1"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter chief complaint..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Attender
              </label>
              <div className="relative">
                <UserPlus size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="attender"
                  value={formData.attender}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Attender name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Referral
              </label>
              <div className="relative">
                <Stethoscope size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="referral"
                  value={formData.referral}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Referral source"
                />
              </div>
            </div>
          </div>

          {/* Vitals Section - All fields in one row - Gradient Background from Yellow to White */}
          <div className="p-4 bg-gradient-to-r from-yellow-100 to-white rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} className="text-yellow-600" />
              <h4 className="text-sm font-semibold text-yellow-800">Vitals</h4>
            </div>
            {renderVitals()}

            {/* First Observation - part of vitals section */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                First Observation
              </label>
              <textarea
                name="firstObservation"
                value={formData.firstObservation}
                onChange={handleInputChange}
                rows="1"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                placeholder="Enter first observation..."
              />
            </div>
          </div>

          {/* Appointment Section - Gradient Background from Purple to White */}
          <div className="p-4 bg-gradient-to-r from-purple-100 to-white rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={16} className="text-purple-600" />
              <h4 className="text-sm font-semibold text-purple-800">Appointment Details</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Appointment Date
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Appointment Time
                </label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Doctor
                </label>
                <div className="relative">
                  <Stethoscope size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Doctor</option>
                    <option value="Dr. Aravind Kumar">Dr. Aravind Kumar</option>
                    <option value="Dr. Priya Sharma">Dr. Priya Sharma</option>
                    <option value="Dr. Rajesh Patel">Dr. Rajesh Patel</option>
                    <option value="Dr. Sneha Reddy">Dr. Sneha Reddy</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <CheckCircle size={16} />
              Book Appointment
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <XCircle size={16} />
              Reset
            </button>
          </div>

          {/* Gynecology Section for Female Patients - Gradient Background from Pink to White */}
          {renderGynecologySection()}

          {/* View Patient Info Button - Right corner */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleViewPatientInfo}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <FileText size={16} />
              View Full Patient Details
              <ChevronRight size={14} />
            </button>
          </div>
        </form>
      )}

      {/* Patient Info Panel Modal */}
      {showPatientInfo && selectedPatientForInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowPatientInfo(false)}>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPatientInfo(false)}
              className="absolute -top-3 -right-3 z-10 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <XCircle size={20} className="text-gray-500" />
            </button>
            <PatientInfoPanel 
              patient={selectedPatientForInfo}
              isPopup={true}
              popupWidth={480}
              popupHeight={600}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExistingPatientSection;