// src/components/FrontDesk/PatientInfoForm.jsx
import React, { useState } from 'react';
import {
  User, Phone, Calendar, Clock, AlertCircle,
  Baby, Hospital, FileText, Heart, Activity,
  Shield, CheckCircle, XCircle, TrendingUp,
  UserCheck, Stethoscope, Briefcase,
  UserPlus, CalendarDays, HeartPulse,
  DoorOpen, UserRound, Building2, Wallet,
  ChevronRight, Camera, MapPin, Save, Droplet,
  Thermometer, Ruler, Weight
} from 'lucide-react';

function EditableInfoCard({ label, value, icon: Icon, color, onChange, fieldName, type = 'text', options = [] }) {
  return (
    <div className="p-3 rounded-lg border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-[0.6rem] font-bold uppercase tracking-wide mb-1" style={{ color: "var(--color-text-muted)" }}>
            {label}
          </div>
          {type === 'select' ? (
            <select
              value={value || ''}
              onChange={(e) => onChange(fieldName, e.target.value)}
              className="w-full text-sm font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              style={{ color: "var(--color-text-base)" }}
            >
              <option value="">Select {label}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : type === 'date' ? (
            <input
              type="date"
              value={value || ''}
              onChange={(e) => onChange(fieldName, e.target.value)}
              className="w-full text-sm font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              style={{ color: "var(--color-text-base)" }}
            />
          ) : (
            <input
              type={type}
              value={value || ''}
              onChange={(e) => onChange(fieldName, e.target.value)}
              className="w-full text-sm font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              style={{ color: "var(--color-text-base)" }}
              placeholder={`Enter ${label}`}
            />
          )}
        </div>
        {Icon && (
          <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: `${color}15`, color: color }}>
            <Icon size={16} />
          </div>
        )}
      </div>
    </div>
  );
}

function EditableDetailRow({ label, value, icon: Icon, onChange, fieldName, type = 'text', options = [] }) {
  return (
    <div className="flex items-start py-2 border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="w-24 flex items-center gap-1.5">
        {Icon && <Icon size={12} style={{ color: "var(--color-text-muted)" }} />}
        <span className="text-[0.68rem] font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
          {label}
        </span>
      </div>
      <div className="flex-1">
        {type === 'select' ? (
          <select
            value={value || ''}
            onChange={(e) => onChange(fieldName, e.target.value)}
            className="w-full text-sm font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
            style={{ color: "var(--color-text-base)" }}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(fieldName, e.target.value)}
            className="w-full text-sm font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors resize-none"
            style={{ color: "var(--color-text-base)" }}
            placeholder={`Enter ${label}`}
            rows="2"
          />
        ) : (
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(fieldName, e.target.value)}
            className="w-full text-sm font-medium bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
            style={{ color: "var(--color-text-base)" }}
            placeholder={`Enter ${label}`}
          />
        )}
      </div>
    </div>
  );
}

function EditableSection({ title, icon: Icon, color, children }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2 pb-1 border-b-2" style={{ borderColor: color }}>
        <Icon size={16} style={{ color }} />
        <h4 className="text-[0.75rem] font-extrabold uppercase tracking-wide" style={{ color }}>{title}</h4>
      </div>
      {children}
    </div>
  );
}

const PatientInfoForm = ({ patient, onSave, onClose }) => {
  const [formData, setFormData] = useState(patient || {});
  const [showGynac, setShowGynac] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const relationshipOptions = ['Husband', 'Wife', 'Father', 'Mother', 'Son', 'Daughter', 'Brother', 'Sister', 'Guardian', 'Other'];

  const handleChange = (field, value) => {
    // Handle nested fields (e.g., address.line1)
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    if (onClose) {
      onClose();
    }
  };

  const getInitials = () => {
    const name = formData.name || "Patient";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Check if patient is female for Gynecology section
  const isFemale = formData.gender === 'Female';

  return (
    <div
      className="flex flex-col overflow-hidden rounded-lg shadow-2xl"
      style={{
        width: 700,
        height: 700,
        background: "linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-alt) 100%)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 p-4 border-b"
        style={{
          background: "linear-gradient(135deg, var(--color-primary-muted) 0%, var(--color-surface) 100%)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0 rounded-full overflow-hidden"
            style={{ width: 56, height: 56,
              background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)" }}>
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{getInitials()}</span>
            </div>
            <button className="absolute bottom-0 right-0 p-1 rounded-full bg-white shadow-md">
              <Camera size={10} style={{ color: "var(--color-primary)" }} />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold truncate" style={{ color: "var(--color-text-base)" }}>
              {formData.name || "New Patient"}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
                <Activity size={10} /> {formData.age || "—"} yrs
              </span>
              <span className="w-1 h-1 rounded-full" style={{ background: "var(--color-text-muted)" }} />
              <span className="text-xs flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
                <Heart size={10} /> {formData.bloodGroup || "—"}
              </span>
              {formData.gender && (
                <>
                  <span className="w-1 h-1 rounded-full" style={{ background: "var(--color-text-muted)" }} />
                  <span className="text-xs flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
                    <User size={10} /> {formData.gender}
                  </span>
                </>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
            style={{ background: "var(--color-surface)" }}
          >
            <XCircle size={18} style={{ color: "var(--color-text-muted)" }} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto p-4 flex-1">
        {/* Basic Information */}
        <EditableSection title="Basic Information" icon={User} color="var(--color-primary)">
          <div className="grid grid-cols-2 gap-2">
            <EditableInfoCard 
              label="Patient Name" 
              value={formData.name} 
              icon={User} 
              color="var(--color-primary)"
              onChange={handleChange}
              fieldName="name"
              type="text"
            />
            <EditableInfoCard 
              label="Phone" 
              value={formData.phone} 
              icon={Phone} 
              color="var(--color-primary)"
              onChange={handleChange}
              fieldName="phone"
              type="tel"
            />
            <EditableInfoCard 
              label="Age" 
              value={formData.age} 
              icon={CalendarDays} 
              color="var(--color-primary)"
              onChange={handleChange}
              fieldName="age"
              type="number"
            />
            <EditableInfoCard 
              label="Gender" 
              value={formData.gender} 
              icon={UserCheck} 
              color="var(--color-primary)"
              onChange={handleChange}
              fieldName="gender"
              type="select"
              options={genderOptions}
            />
            <EditableInfoCard 
              label="Blood Group" 
              value={formData.bloodGroup} 
              icon={HeartPulse} 
              color="var(--color-primary)"
              onChange={handleChange}
              fieldName="bloodGroup"
              type="select"
              options={bloodGroupOptions}
            />
            <EditableInfoCard 
              label="DOB" 
              value={formData.dob} 
              icon={Calendar} 
              color="var(--color-primary)"
              onChange={handleChange}
              fieldName="dob"
              type="date"
            />
          </div>
        </EditableSection>

        {/* Address Section */}
        <EditableSection title="Address" icon={MapPin} color="var(--color-info)">
          <div className="space-y-2">
            <EditableDetailRow 
              label="Line 1" 
              value={formData.address?.line1} 
              icon={MapPin}
              onChange={handleChange}
              fieldName="address.line1"
              type="text"
            />
            <EditableDetailRow 
              label="Line 2" 
              value={formData.address?.line2} 
              icon={MapPin}
              onChange={handleChange}
              fieldName="address.line2"
              type="text"
            />
            <EditableDetailRow 
              label="City/State" 
              value={formData.address?.line3} 
              icon={MapPin}
              onChange={handleChange}
              fieldName="address.line3"
              type="text"
            />
            <EditableDetailRow 
              label="Pincode" 
              value={formData.address?.line4} 
              icon={MapPin}
              onChange={handleChange}
              fieldName="address.line4"
              type="text"
            />
          </div>
        </EditableSection>

        {/* Attendant Section */}
        <EditableSection title="Attendant" icon={UserPlus} color="var(--color-success)">
          <div className="grid grid-cols-2 gap-2">
            <EditableInfoCard 
              label="Name" 
              value={formData.attendant?.name} 
              icon={User} 
              color="var(--color-success)"
              onChange={handleChange}
              fieldName="attendant.name"
              type="text"
            />
            <EditableInfoCard 
              label="Relationship" 
              value={formData.attendant?.relationship} 
              icon={UserCheck} 
              color="var(--color-success)"
              onChange={handleChange}
              fieldName="attendant.relationship"
              type="select"
              options={relationshipOptions}
            />
            <EditableInfoCard 
              label="Phone" 
              value={formData.attendant?.phone} 
              icon={Phone} 
              color="var(--color-success)"
              onChange={handleChange}
              fieldName="attendant.phone"
              type="tel"
            />
          </div>
        </EditableSection>

        {/* Medical Information */}
        <EditableSection title="Medical Information" icon={Stethoscope} color="var(--color-warning)">
          <EditableDetailRow 
            label="Chief Complaint" 
            value={formData.chiefComplaint} 
            icon={Activity}
            onChange={handleChange}
            fieldName="chiefComplaint"
            type="textarea"
          />
          <EditableDetailRow 
            label="First Observation" 
            value={formData.firstObservation} 
            icon={FileText}
            onChange={handleChange}
            fieldName="firstObservation"
            type="textarea"
          />
          <EditableDetailRow 
            label="Referral" 
            value={formData.referral} 
            icon={Stethoscope}
            onChange={handleChange}
            fieldName="referral"
            type="text"
          />
        </EditableSection>

        {/* Gynecology Information - Only for Female Patients */}
        {isFemale && (
          <EditableSection title="Gynecology Information" icon={Baby} color="#d946ef">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="pregnancy"
                checked={showGynac || formData.gynacInfo?.pregnancy === 'Yes'}
                onChange={(e) => {
                  setShowGynac(e.target.checked);
                  if (e.target.checked) {
                    handleChange('gynacInfo.pregnancy', 'Yes');
                  } else {
                    handleChange('gynacInfo.pregnancy', 'No');
                  }
                }}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <label htmlFor="pregnancy" className="text-sm font-medium text-gray-700">
                Pregnancy
              </label>
            </div>
            
            {(showGynac || formData.gynacInfo?.pregnancy === 'Yes') && (
              <div className="grid grid-cols-2 gap-2 mt-2 p-3 bg-pink-50 rounded-lg border border-pink-200">
                <EditableInfoCard 
                  label="LMP" 
                  value={formData.gynacInfo?.lmp} 
                  icon={Calendar} 
                  color="#d946ef"
                  onChange={handleChange}
                  fieldName="gynacInfo.lmp"
                  type="date"
                />
                <EditableInfoCard 
                  label="EDD" 
                  value={formData.gynacInfo?.edd} 
                  icon={CalendarDays} 
                  color="#d946ef"
                  onChange={handleChange}
                  fieldName="gynacInfo.edd"
                  type="date"
                />
                <EditableInfoCard 
                  label="Doctor" 
                  value={formData.gynacInfo?.doc} 
                  icon={Stethoscope} 
                  color="#d946ef"
                  onChange={handleChange}
                  fieldName="gynacInfo.doc"
                  type="text"
                />
                <EditableInfoCard 
                  label="Pregnancies" 
                  value={formData.gynacInfo?.pregnancies} 
                  icon={Baby} 
                  color="#d946ef"
                  onChange={handleChange}
                  fieldName="gynacInfo.pregnancies"
                  type="number"
                />
                <EditableInfoCard 
                  label="Deliveries" 
                  value={formData.gynacInfo?.deliveries} 
                  icon={Hospital} 
                  color="#d946ef"
                  onChange={handleChange}
                  fieldName="gynacInfo.deliveries"
                  type="number"
                />
                <EditableInfoCard 
                  label="Abortions" 
                  value={formData.gynacInfo?.abortions} 
                  icon={AlertCircle} 
                  color="#d946ef"
                  onChange={handleChange}
                  fieldName="gynacInfo.abortions"
                  type="number"
                />
                <EditableInfoCard 
                  label="Living Children" 
                  value={formData.gynacInfo?.livingChildren} 
                  icon={User} 
                  color="#d946ef"
                  onChange={handleChange}
                  fieldName="gynacInfo.livingChildren"
                  type="number"
                />
              </div>
            )}
          </EditableSection>
        )}

        {/* Insurance Details */}
        <EditableSection title="Insurance" icon={Shield} color="var(--color-primary)">
          <div className="grid grid-cols-2 gap-2">
            <EditableInfoCard 
              label="Provider" 
              value={formData.insurer?.name} 
              icon={Building2} 
              color="var(--color-primary)"
              onChange={handleChange}
              fieldName="insurer.name"
              type="text"
            />
            <EditableInfoCard 
              label="Plan" 
              value={formData.insurer?.plan} 
              icon={Wallet} 
              color="var(--color-primary)"
              onChange={handleChange}
              fieldName="insurer.plan"
              type="text"
            />
          </div>
        </EditableSection>
      </div>

      {/* Footer with Save Button */}
      <div
        className="flex-shrink-0 px-4 py-3 border-t flex items-center justify-end gap-3"
        style={{ borderColor: "var(--color-border)" }}
      >
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Save size={16} />
          Save Patient Details
        </button>
      </div>
    </div>
  );
};

export default PatientInfoForm;