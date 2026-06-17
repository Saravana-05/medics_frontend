// src/components/FrontDesk/DoctorSchedule.jsx
import React, { useState } from 'react';
import { 
  Calendar, Clock, Stethoscope, ChevronLeft, ChevronRight,
  Plus, X, Check, Briefcase, Coffee, Video, Users as UsersIcon,
  MapPin, Edit, Trash2, Save, UserCog,
  CalendarClock
} from 'lucide-react';

const DoctorSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [personalSchedules, setPersonalSchedules] = useState({});
  const [newSchedule, setNewSchedule] = useState({
    timeFrom: '',
    timeTo: '',
    title: '',
    type: 'Work',
    location: '',
    doctor: ''
  });

  const doctors = [
    { id: 1, name: 'Dr. Aravind Kumar', specialty: 'General Medicine' },
    { id: 2, name: 'Dr. Priya Sharma', specialty: 'Cardiology' },
    { id: 3, name: 'Dr. Rajesh Patel', specialty: 'Orthopedics' },
    { id: 4, name: 'Dr. Sneha Reddy', specialty: 'Pediatrics' },
  ];

  // Default schedule slots
  const defaultSlots = [
    { time: '09:00 AM', doctor: 'Dr. Aravind Kumar', status: 'Available' },
    { time: '10:00 AM', doctor: 'Dr. Aravind Kumar', status: 'Booked' },
    { time: '11:00 AM', doctor: 'Dr. Priya Sharma', status: 'Available' },
    { time: '12:00 PM', doctor: 'Dr. Priya Sharma', status: 'Booked' },
    { time: '02:00 PM', doctor: 'Dr. Rajesh Patel', status: 'Available' },
    { time: '03:00 PM', doctor: 'Dr. Rajesh Patel', status: 'Available' },
    { time: '04:00 PM', doctor: 'Dr. Sneha Reddy', status: 'Booked' },
    { time: '05:00 PM', doctor: 'Dr. Sneha Reddy', status: 'Available' },
  ];

  // Personal schedules for each doctor
  const defaultPersonalSchedules = {
    'Dr. Aravind Kumar': [
      { id: 1, time: '09:30 AM - 10:30 AM', title: 'Morning Rounds', type: 'Rounds', location: 'Ward A' },
      { id: 2, time: '12:30 PM - 01:30 PM', title: 'Lunch Break', type: 'Break', location: 'Cafeteria' },
      { id: 3, time: '03:00 PM - 04:00 PM', title: 'Department Meeting', type: 'Meeting', location: 'Conference Room' },
    ],
    'Dr. Priya Sharma': [
      { id: 4, time: '09:00 AM - 10:00 AM', title: 'Patient Review', type: 'Work', location: 'Office' },
      { id: 5, time: '11:00 AM - 12:00 PM', title: 'Research Discussion', type: 'Meeting', location: 'Library' },
      { id: 6, time: '01:00 PM - 02:00 PM', title: 'Lunch Break', type: 'Break', location: 'Cafeteria' },
    ],
    'Dr. Rajesh Patel': [
      { id: 7, time: '08:30 AM - 09:30 AM', title: 'Surgery Prep', type: 'Work', location: 'OT' },
      { id: 8, time: '11:30 AM - 12:30 PM', title: 'Consultation', type: 'Work', location: 'Clinic' },
      { id: 9, time: '02:00 PM - 03:00 PM', title: 'Coffee Break', type: 'Break', location: 'Doctors Lounge' },
    ],
    'Dr. Sneha Reddy': [
      { id: 10, time: '10:00 AM - 11:00 AM', title: 'Pediatric Rounds', type: 'Rounds', location: 'Pediatric Ward' },
      { id: 11, time: '12:00 PM - 01:00 PM', title: 'Lunch Break', type: 'Break', location: 'Cafeteria' },
      { id: 12, time: '04:00 PM - 05:00 PM', title: 'Training Session', type: 'Training', location: 'Seminar Hall' },
    ],
  };

  // Initialize personal schedules state
  const [personalSchedulesState, setPersonalSchedulesState] = useState(defaultPersonalSchedules);

  const filteredSchedule = selectedDoctor === 'all' 
    ? defaultSlots 
    : defaultSlots.filter(s => s.doctor === selectedDoctor);

  const changeDate = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Meeting': return <UsersIcon size={12} />;
      case 'Break': return <Coffee size={12} />;
      case 'Virtual': return <Video size={12} />;
      case 'Rounds': return <Stethoscope size={12} />;
      case 'Training': return <Briefcase size={12} />;
      default: return <Briefcase size={12} />;
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Meeting': return '#1d4ed8';
      case 'Break': return '#d97706';
      case 'Virtual': return '#0891b2';
      case 'Rounds': return '#059669';
      case 'Training': return '#7c3aed';
      default: return 'var(--color-primary)';
    }
  };

  const getTypeBg = (type) => {
    switch(type) {
      case 'Meeting': return '#dbeafe';
      case 'Break': return '#fef3c7';
      case 'Virtual': return '#cffafe';
      case 'Rounds': return '#d1fae5';
      case 'Training': return '#ede9fe';
      default: return 'var(--color-primary-muted)';
    }
  };

  const handleAddSchedule = () => {
    if (newSchedule.title && newSchedule.timeFrom && newSchedule.timeTo && newSchedule.doctor) {
      const newEntry = {
        id: Date.now(),
        time: `${newSchedule.timeFrom} - ${newSchedule.timeTo}`,
        title: newSchedule.title,
        type: newSchedule.type,
        location: newSchedule.location || '—',
      };

      setPersonalSchedulesState(prev => ({
        ...prev,
        [newSchedule.doctor]: [...(prev[newSchedule.doctor] || []), newEntry]
      }));

      setNewSchedule({
        timeFrom: '',
        timeTo: '',
        title: '',
        type: 'Work',
        location: '',
        doctor: ''
      });
      setShowAddForm(false);
      alert('Schedule added successfully!');
    } else {
      alert('Please fill all required fields (Title, Time From, Time To, and Doctor)');
    }
  };

  const handleEditSchedule = (doctor, scheduleId) => {
    const schedule = personalSchedulesState[doctor]?.find(s => s.id === scheduleId);
    if (schedule) {
      const [timeFrom, timeTo] = schedule.time.split(' - ');
      setNewSchedule({
        timeFrom,
        timeTo,
        title: schedule.title,
        type: schedule.type,
        location: schedule.location === '—' ? '' : schedule.location,
        doctor: doctor
      });
      setEditingSchedule({ doctor, id: scheduleId });
      setShowAddForm(true);
    }
  };

  const handleUpdateSchedule = () => {
    if (editingSchedule && newSchedule.title && newSchedule.timeFrom && newSchedule.timeTo && newSchedule.doctor) {
      const updatedSchedule = {
        id: editingSchedule.id,
        time: `${newSchedule.timeFrom} - ${newSchedule.timeTo}`,
        title: newSchedule.title,
        type: newSchedule.type,
        location: newSchedule.location || '—',
      };

      setPersonalSchedulesState(prev => {
        const doctorSchedules = [...(prev[editingSchedule.doctor] || [])];
        const index = doctorSchedules.findIndex(s => s.id === editingSchedule.id);
        if (index !== -1) {
          doctorSchedules[index] = updatedSchedule;
        }
        return {
          ...prev,
          [editingSchedule.doctor]: doctorSchedules
        };
      });

      setNewSchedule({
        timeFrom: '',
        timeTo: '',
        title: '',
        type: 'Work',
        location: '',
        doctor: ''
      });
      setEditingSchedule(null);
      setShowAddForm(false);
      alert('Schedule updated successfully!');
    }
  };

  const handleDeleteSchedule = (doctor, scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setPersonalSchedulesState(prev => ({
        ...prev,
        [doctor]: prev[doctor].filter(s => s.id !== scheduleId)
      }));
    }
  };

  const handleCancelEdit = () => {
    setNewSchedule({
      timeFrom: '',
      timeTo: '',
      title: '',
      type: 'Work',
      location: '',
      doctor: ''
    });
    setEditingSchedule(null);
    setShowAddForm(false);
  };

  // Get personal schedules for selected doctor
  const getDoctorPersonalSchedules = () => {
    if (selectedDoctor === 'all') {
      // Show all schedules grouped by doctor
      const allSchedules = [];
      Object.keys(personalSchedulesState).forEach(doctor => {
        personalSchedulesState[doctor].forEach(s => {
          allSchedules.push({ ...s, doctor });
        });
      });
      return allSchedules;
    }
    return personalSchedulesState[selectedDoctor] || [];
  };

  const currentDoctorSchedules = getDoctorPersonalSchedules();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Doctor's Schedule</h1>
        <p className="text-sm text-gray-500">View and manage doctor availability and personal schedules</p>
      </div>

      {/* Date Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{formatDate(currentDate)}</span>
            </div>
            <button
              onClick={() => changeDate(1)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Doctors</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.name}>{doc.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add Schedule Button - Always Visible */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (editingSchedule) setEditingSchedule(null);
            if (!showAddForm) {
              // If a doctor is selected, pre-fill the doctor field
              if (selectedDoctor !== 'all') {
                setNewSchedule({ ...newSchedule, doctor: selectedDoctor });
              }
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          {showAddForm ? 'Cancel' : 'Add Personal Schedule'}
        </button>
      </div>

      {/* Add/Edit Form - Always visible when button is clicked */}
      {showAddForm && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock size={16} className="text-blue-600" />
            <h4 className="text-sm font-semibold text-blue-800">
              {editingSchedule ? 'Edit Personal Schedule' : 'Add Personal Schedule'}
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Doctor Selection Field */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Select Doctor *
              </label>
              <div className="relative">
                <UserCog size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={newSchedule.doctor}
                  onChange={(e) => setNewSchedule({ ...newSchedule, doctor: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a Doctor</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.name}>{doc.name} - {doc.specialty}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Schedule Title *</label>
              <input
                type="text"
                placeholder="Schedule Title"
                value={newSchedule.title}
                onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newSchedule.type}
                onChange={(e) => setNewSchedule({ ...newSchedule, type: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Work">Work</option>
                <option value="Meeting">Meeting</option>
                <option value="Break">Break</option>
                <option value="Rounds">Rounds</option>
                <option value="Virtual">Virtual</option>
                <option value="Training">Training</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Time From *</label>
              <input
                type="time"
                value={newSchedule.timeFrom}
                onChange={(e) => setNewSchedule({ ...newSchedule, timeFrom: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Time To *</label>
              <input
                type="time"
                value={newSchedule.timeTo}
                onChange={(e) => setNewSchedule({ ...newSchedule, timeTo: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Location (optional)</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={newSchedule.location}
                  onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={editingSchedule ? handleUpdateSchedule : handleAddSchedule}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {editingSchedule ? <Save size={16} /> : <Check size={16} />}
              {editingSchedule ? 'Update Schedule' : 'Add Schedule'}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X size={16} className="inline mr-1" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Schedule List - Availability Slots */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Availability Slots</h3>
        <div className="space-y-3">
          {filteredSchedule.map((slot, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-800">{slot.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{slot.doctor}</span>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                slot.status === 'Available' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {slot.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Schedules Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          {selectedDoctor === 'all' ? 'All Doctors Personal Schedules' : `${selectedDoctor}'s Personal Schedule`}
        </h3>
        <div className="space-y-3">
          {currentDoctorSchedules.length > 0 ? (
            currentDoctorSchedules.map((schedule) => {
              const typeColor = getTypeColor(schedule.type);
              const typeBg = getTypeBg(schedule.type);
              const TypeIcon = getTypeIcon(schedule.type);
              
              return (
                <div 
                  key={schedule.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg flex-shrink-0" style={{ background: typeBg }}>
                        {TypeIcon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-800">{schedule.title}</span>
                          <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded" 
                            style={{ background: typeBg, color: typeColor }}>
                            {schedule.type}
                          </span>
                          {schedule.doctor && selectedDoctor === 'all' && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Stethoscope size={10} />
                              {schedule.doctor}
                            </span>
                          )}
                        </div>
                        <div className="text-xs mt-1 flex items-center gap-3 text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {schedule.time}
                          </span>
                          {schedule.location && schedule.location !== '—' && (
                            <span className="flex items-center gap-1">
                              <MapPin size={10} />
                              {schedule.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditSchedule(schedule.doctor || selectedDoctor, schedule.id)}
                        className="p-1 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={14} className="text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.doctor || selectedDoctor, schedule.id)}
                        className="p-1 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
              <CalendarClock size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">
                {selectedDoctor === 'all' 
                  ? 'No personal schedules found for any doctor' 
                  : `No personal schedules found for ${selectedDoctor}`}
              </p>
              <p className="text-xs text-gray-400 mt-1">Click "Add Personal Schedule" to create one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;