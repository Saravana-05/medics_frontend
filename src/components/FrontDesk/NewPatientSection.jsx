// src/components/FrontDesk/NewPatientSection.jsx
import React, { useState } from 'react';
import { 
  User, Phone, UserCheck, Calendar, Clock, 
  Stethoscope, Activity, CheckCircle, XCircle,
  Heart, Droplet, Thermometer, Ruler, Weight,
  AlertCircle
} from 'lucide-react';

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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Patient Information Section - Blue background */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <User size={16} className="text-blue-600" />
          <h4 className="text-sm font-semibold text-blue-800">Patient Information</h4>
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

        {/* Address and Blood Group - inside Patient Information section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-200">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Blood Group
            </label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="1"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter address"
            />
          </div>
        </div>
      </div>

      {/* Vitals and Allergies Section - Yellow background */}
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={16} className="text-yellow-600" />
          <h4 className="text-sm font-semibold text-yellow-800">Vitals & Allergies</h4>
        </div>

        {/* Vitals fields */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[0.6rem] font-medium text-gray-600 mb-1">BP Systolic</label>
            <div className="relative">
              <Heart size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="vitals.bpSystolic"
                value={formData.vitals.bpSystolic}
                onChange={handleInputChange}
                placeholder="Systolic"
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[0.6rem] font-medium text-gray-600 mb-1">BP Diastolic</label>
            <div className="relative">
              <Heart size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="vitals.bpDiastolic"
                value={formData.vitals.bpDiastolic}
                onChange={handleInputChange}
                placeholder="Diastolic"
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[0.6rem] font-medium text-gray-600 mb-1">Pulse</label>
            <div className="relative">
              <Activity size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="vitals.pulse"
                value={formData.vitals.pulse}
                onChange={handleInputChange}
                placeholder="BPM"
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[0.6rem] font-medium text-gray-600 mb-1">Temperature</label>
            <div className="relative">
              <Thermometer size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="vitals.temperature"
                value={formData.vitals.temperature}
                onChange={handleInputChange}
                placeholder="°F/°C"
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[0.6rem] font-medium text-gray-600 mb-1">Weight (kg)</label>
            <div className="relative">
              <Weight size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="vitals.weight"
                value={formData.vitals.weight}
                onChange={handleInputChange}
                placeholder="kg"
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[0.6rem] font-medium text-gray-600 mb-1">Height (cm)</label>
            <div className="relative">
              <Ruler size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="vitals.height"
                value={formData.vitals.height}
                onChange={handleInputChange}
                placeholder="cm"
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[0.6rem] font-medium text-gray-600 mb-1">SpO2 (%)</label>
            <div className="relative">
              <Droplet size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="vitals.spo2"
                value={formData.vitals.spo2}
                onChange={handleInputChange}
                placeholder="%"
                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Allergies / Medical History - inside Vitals section */}
        <div className="mt-4 pt-4 border-t border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-yellow-600" />
            <label className="block text-xs font-medium text-gray-700">
              Allergies / Medical History
            </label>
          </div>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleInputChange}
            rows="2"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter any allergies or medical history..."
          />
        </div>
      </div>

      {/* Appointment Section - Purple background */}
      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
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

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4 mt-4 border-t border-gray-200">
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
          className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          <XCircle size={16} className="inline mr-1" />
          Reset
        </button>
      </div>
    </form>
  );
};

export default NewPatientSection;