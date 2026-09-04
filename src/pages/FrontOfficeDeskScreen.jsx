// src/pages/FrontOfficeDeskScreen.jsx
import React, { useState } from 'react';
import AppBar from '../components/AppBar/AppBar';
import FrontOfficeSidebar from '../components/FrontDesk/FrontOfficeSidebar';
import Dashboard from '../components/FrontDesk/Dashboard';
import AppointmentRegistration from '../components/FrontDesk/AppointmentRegistration';
import PatientList from '../components/FrontDesk/PatientList';
import DoctorSchedule from '../components/FrontDesk/DoctorSchedule';
import OPList from '../components/FrontDesk/OPList';
import ParkedList from '../components/FrontDesk/ParkedList';

const FrontOfficeDeskScreen = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saved, setSaved] = useState(false);
  
  // Mock user data if not provided via props
  const currentUser = user || {
    name: "Front Desk Staff",
    email: "frontdesk@medix.com",
    role: "Front Office",
    department: "Reception"
  };

  // Mock patients data
  // const [patients] = useState([
  //   { id: 1, name: "John Doe", age: 45, gender: "Male", contact: "9876543210" },
  //   { id: 2, name: "Jane Smith", age: 32, gender: "Female", contact: "9876543211" },
  //   { id: 3, name: "Robert Johnson", age: 58, gender: "Male", contact: "9876543212" },
  //   { id: 4, name: "Mary Williams", age: 28, gender: "Female", contact: "9876543213" },
  //   { id: 5, name: "Michael Brown", age: 34, gender: "Male", contact: "9876543214" },
  // ]);

  const [patients] = useState([
  { 
    id: "1042", 
    name: "Smt. Vijayalakshmi", 
    age: 29, 
    gender: "Female", 
    contact: "9855523456",
    doctor: "Dr. Aravind Kumar",
    type: "OP"
  },
  { 
    id: "2187", 
    name: "Mr. Karthik Selvam", 
    age: 27, 
    gender: "Male", 
    contact: "9000112233",
    doctor: "Dr. Priya Sharma",
    type: "OP"
  },
  { 
    id: "3301", 
    name: "Smt. Lakshmi Devi", 
    age: 52, 
    gender: "Female", 
    contact: "9876541100",
    doctor: "Dr. Rajesh Patel",
    type: "IP"
  },
  { 
    id: "PID-4456", 
    name: "Mr. Suresh Kumar", 
    age: 38, 
    gender: "Male", 
    contact: "9876543215",
    doctor: "Dr. Sneha Reddy",
    type: "OP"
  },
  { 
    id: "PID-5567", 
    name: "Mrs. Priya Anand", 
    age: 31, 
    gender: "Female", 
    contact: "9876543216",
    doctor: "Dr. Aravind Kumar",
    type: "IP"
  },
  { 
    id: "PID-6678", 
    name: "Mr. Ramkumar", 
    age: 45, 
    gender: "Male", 
    contact: "9876543217",
    doctor: "Dr. Priya Sharma",
    type: "OP"
  },
]);

  // Handle patient selection from OP List
  const handlePatientSelect = (patient) => {
    console.log("Selected patient:", patient);
    // You can navigate to patient details or open a modal
    // For example, you could switch to a patient detail view
  };

  // Handle logout - this will be passed to AppBar
  const handleLogout = () => {
    console.log("Logout clicked in FrontOfficeDeskScreen");
    if (onLogout) {
      // If parent component provided logout handler, use it
      onLogout();
    } else {
      // Fallback logout logic - redirect to login
      console.log("Performing logout - redirect to login");
      // You can add navigation logic here
      // window.location.href = '/login';
      // Or use react-router's useNavigate
    }
  };

  // Handle save action (for demo purposes)
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  // Render body content based on active menu
  const renderBodyContent = () => {
    switch(activeMenu) {
      case 'dashboard':
        return <Dashboard patients={patients} />;
      case 'appointments':
        return <AppointmentRegistration />;
      case 'patientlist':
        return <PatientList patients={patients} />;
      case 'doctorschedule':
        return <DoctorSchedule />;
      case 'oplist':
        return <OPList onSelectPatient={handlePatientSelect} />;
      case 'parkedlist':
        return <ParkedList />;
      default:
        return <Dashboard patients={patients} />;
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ 
      background: "var(--color-background)",
    }}>
      {/* AppBar - Used dynamically for both FrontOffice and OP Desk */}
      <AppBar 
        user={currentUser}
        onLogout={handleLogout}  // Pass the logout handler
        saved={saved}
        onOPListClick={handlePatientSelect}
        patients={patients}
        screenType="frontoffice"
      />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <FrontOfficeSidebar 
          activeMenu={activeMenu}
          onMenuChange={setActiveMenu}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6" style={{ 
          background: "var(--color-background)",
        }}>
          {renderBodyContent()}
        </div>
      </div>
    </div>
  );
};

export default FrontOfficeDeskScreen;