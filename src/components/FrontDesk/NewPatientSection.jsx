// src/components/FrontDesk/NewPatientSection.jsx
import React, { useState } from 'react';
import { 
  User, Phone, UserCheck, Calendar, Clock, 
  Stethoscope, Activity, CheckCircle, XCircle,
  Heart, Droplet, Thermometer, Ruler, Weight,
  AlertCircle, X, UserPlus, ChevronRight
} from 'lucide-react';
import PatientInfoForm from './PatientInfoForm';

const NewPatientSection = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    relationName: '',
    phone: '',
    sex: '',
    age: '',
    dob: '',
    address: '',
    bloodGroup: '',
    allergies: '',
    medicalHistory: '',
    vitals: {
      bpSystolic: '',
      bpDiastolic: '',
      pulse: '',
      temperature: '',
      weight: '',
      height: '',
      spo2: '',
    },
    appointmentDate: '',
    appointmentTime: '',
    doctor: '',
    visitType: 'OP',
  });

  const [showClearButton, setShowClearButton] = useState(false);
  const [showPatientInfoForm, setShowPatientInfoForm] = useState(false);
  const [patientInfoData, setPatientInfoData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    dob: '',
    address: {
      line1: '',
      line2: '',
      line3: '',
      line4: '',
    },
    attendant: {
      name: '',
      relationship: '',
      phone: '',
    },
    chiefComplaint: '',
    firstObservation: '',
    referral: '',
    insurer: {
      name: '',
      plan: '',
    },
  });

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
    // Show clear button if any field has value
    const hasValue = Object.values(formData).some(val => val !== '') ||
                     Object.values(formData.vitals).some(val => val !== '');
    setShowClearButton(hasValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      patientType: 'new'
    };
    if (onFormSubmit) {
      onFormSubmit(submitData);
    } else {
      console.log('New Patient Registration:', submitData);
      alert('Patient registered and appointment booked successfully!');
    }
    // Reset form after submission
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      patientName: '',
      relationName: '',
      phone: '',
      sex: '',
      age: '',
      dob: '',
      address: '',
      bloodGroup: '',
      allergies: '',
      medicalHistory: '',
      vitals: {
        bpSystolic: '',
        bpDiastolic: '',
        pulse: '',
        temperature: '',
        weight: '',
        height: '',
        spo2: '',
      },
      appointmentDate: '',
      appointmentTime: '',
      doctor: '',
      visitType: 'OP',
    });
    setShowClearButton(false);
  };

  // Handle clear all fields
  const handleClearAll = () => {
    handleReset();
  };

  // Handle open patient info form
  const handleOpenPatientInfo = () => {
    // Populate patient info data from form
    const updatedPatientInfo = {
      name: formData.patientName || '',
      phone: formData.phone || '',
      age: formData.age || '',
      gender: formData.sex || '',
      bloodGroup: formData.bloodGroup || '',
      dob: formData.dob || '',
      address: {
        line1: formData.address || '',
        line2: '',
        line3: '',
        line4: '',
      },
      attendant: {
        name: formData.relationName || '',
        relationship: '',
        phone: formData.phone || '',
      },
      chiefComplaint: formData.allergies || '',
      firstObservation: '',
      referral: '',
      insurer: {
        name: '',
        plan: '',
      },
    };
    setPatientInfoData(updatedPatientInfo);
    setShowPatientInfoForm(true);
  };

  // Handle save patient info
  const handleSavePatientInfo = (data) => {
    console.log('Patient info saved:', data);
    // Update form data with saved patient info
    setFormData(prev => ({
      ...prev,
      patientName: data.name || prev.patientName,
      phone: data.phone || prev.phone,
      age: data.age || prev.age,
      sex: data.gender || prev.sex,
      bloodGroup: data.bloodGroup || prev.bloodGroup,
      dob: data.dob || prev.dob,
      address: data.address?.line1 || prev.address,
      relationName: data.attendant?.name || prev.relationName,
      allergies: data.chiefComplaint || prev.allergies,
    }));
    setShowPatientInfoForm(false);
    alert('Patient details saved successfully!');
  };

  // Render vitals section - all fields in one row
  const renderVitals = () => (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
      <div>
        <label className="block text-[0.55rem] font-medium text-gray-600 mb-0.5">
          BP Sys
        </label>
        <div className="relative">
          <Heart size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="vitals.bpSystolic"
            value={formData.vitals.bpSystolic}
            onChange={handleInputChange}
            placeholder="Sys"
            className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-[0.55rem] font-medium text-gray-600 mb-0.5">
          BP Dias
        </label>
        <div className="relative">
          <Heart size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="vitals.bpDiastolic"
            value={formData.vitals.bpDiastolic}
            onChange={handleInputChange}
            placeholder="Dias"
            className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-[0.55rem] font-medium text-gray-600 mb-0.5">
          Pulse
        </label>
        <div className="relative">
          <Activity size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="vitals.pulse"
            value={formData.vitals.pulse}
            onChange={handleInputChange}
            placeholder="BPM"
            className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-[0.55rem] font-medium text-gray-600 mb-0.5">
          Temp
        </label>
        <div className="relative">
          <Thermometer size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="vitals.temperature"
            value={formData.vitals.temperature}
            onChange={handleInputChange}
            placeholder="°F"
            className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-[0.55rem] font-medium text-gray-600 mb-0.5">
          Weight
        </label>
        <div className="relative">
          <Weight size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="vitals.weight"
            value={formData.vitals.weight}
            onChange={handleInputChange}
            placeholder="kg"
            className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-[0.55rem] font-medium text-gray-600 mb-0.5">
          Height
        </label>
        <div className="relative">
          <Ruler size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="vitals.height"
            value={formData.vitals.height}
            onChange={handleInputChange}
            placeholder="cm"
            className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-[0.55rem] font-medium text-gray-600 mb-0.5">
          SpO2
        </label>
        <div className="relative">
          <Droplet size={12} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="vitals.spo2"
            value={formData.vitals.spo2}
            onChange={handleInputChange}
            placeholder="%"
            className="w-full pl-7 pr-2 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
          />
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Patient Information Section - Gradient Background from Blue to White */}
      <div className="bg-gradient-to-r from-blue-100 to-white rounded-lg border border-blue-200 p-4 relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User size={16} className="text-blue-600" />
            <h4 className="text-sm font-semibold text-blue-800">Patient Information</h4>
          </div>
          {showClearButton && (
            <button
              type="button"
              onClick={handleClearAll}
              className="p-1 hover:bg-blue-200 rounded-lg transition-colors"
              title="Clear all fields"
            >
              <X size={16} className="text-blue-600" />
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[0.6rem] font-medium text-gray-600 mb-1">
              Patient Name *
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter patient name"
                required
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
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter relation name"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.6rem] font-medium text-gray-600 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.6rem] font-medium text-gray-600 mb-1">
              Sex / Age / DOB
            </label>
            <div className="flex gap-1">
              <select
                name="sex"
                value={formData.sex}
                onChange={handleInputChange}
                className="w-1/3 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-1/3 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Age"
              />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-1/3 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vitals and Allergies Section - Gradient Background from Yellow to White */}
      <div className="p-4 bg-gradient-to-r from-yellow-100 to-white rounded-lg border border-yellow-200">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={16} className="text-yellow-600" />
          <h4 className="text-sm font-semibold text-yellow-800">Vitals & Allergies</h4>
        </div>

        {/* Vitals fields - all in one row */}
        {renderVitals()}

        {/* Allergies / Medical History - as text input instead of textarea */}
        <div className="mt-4 pt-4 border-t border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-yellow-600" />
            <label className="block text-xs font-medium text-gray-700">
              Allergies / Medical History
            </label>
          </div>
          <input
            type="text"
            name="allergies"
            value={formData.allergies}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter any allergies or medical history..."
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
              Appointment Date *
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
              Appointment Time *
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
              Doctor *
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

      {/* Create Patient Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleOpenPatientInfo}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <UserPlus size={16} />
          Create Patient Profile
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <CheckCircle size={16} />
          Register Patient & Book Appointment
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg transition-colors"
        >
          <XCircle size={16} />
          Reset
        </button>
      </div>

      {/* Patient Info Form Modal - Editable */}
      {showPatientInfoForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <PatientInfoForm 
            patient={patientInfoData}
            onSave={handleSavePatientInfo}
            onClose={() => setShowPatientInfoForm(false)}
          />
        </div>
      )}
    </form>
  );
};

export default NewPatientSection;