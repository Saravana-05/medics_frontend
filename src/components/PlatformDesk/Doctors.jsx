// src/components/PlatformDesk/Doctors.jsx
import { useState, useEffect } from "react";
import { Stethoscope, Plus, Filter } from "lucide-react";
import TableUI from "../Table/TableUI";
import DoctorFormModal from "../../modal/DoctorFormModal";
import ViewDoctorModal from "../../modal/ViewDoctorModal";
import { getAllDoctors, createDoctor, updateDoctor, deleteDoctor } from "../../services/doctorService";
import { getAllStaff } from "../../services/staffService";
import { getAllDepartments } from "../../services/departmentService";
import { getAllClinics } from "../../services/clinicService";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [viewDoctor, setViewDoctor] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("");

  // Fetch staff, departments, and clinics for enrichment
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffData, deptData, clinicsData] = await Promise.all([
          getAllStaff(),
          getAllDepartments(),
          getAllClinics()
        ]);
        setStaffList(staffData);
        setDepartments(deptData);
        setClinics(clinicsData);
      } catch (err) {
        console.error("Error fetching reference data:", err);
      }
    };
    fetchData();
  }, []);

  // Fetch doctors from API
  useEffect(() => {
    fetchDoctors();
  }, [selectedDepartmentFilter]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      let data = await getAllDoctors();
      
      // Filter by department if selected
      if (selectedDepartmentFilter) {
        data = data.filter(doctor => doctor.department_id === selectedDepartmentFilter);
      }
      
      // Enrich data with staff, clinic, and department names
      const enrichedData = await Promise.all(data.map(async (doctor) => {
        const staff = staffList.find(s => s.id === doctor.staff_id);
        const department = departments.find(d => d.id === doctor.department_id);
        const clinic = clinics.find(c => c.id === staff?.clinic_id);
        return {
          ...doctor,
          ...staff,
          staff_name: staff ? `${staff.first_name} ${staff.last_name || ""}` : "Unknown",
          department_name: department ? department.department_name : "—",
          clinic_name: clinic ? clinic.clinic_name : "Unknown",
          full_name: staff ? `${staff.first_name} ${staff.last_name || ""}` : "Unknown",
          gender: staff?.gender,
          dob: staff?.dob,
          mobile: staff?.mobile,
          email: staff?.email,
          address_line1: staff?.address_line1,
          address_line2: staff?.address_line2,
          city: staff?.city,
          state: staff?.state,
          country: staff?.country,
          pincode: staff?.pincode,
          joining_date: staff?.joining_date
        };
      }));
      
      setDoctors(enrichedData);
      setError(null);
    } catch (err) {
      setError("Failed to load doctors. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedDoctor(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleView = (doctor) => {
    // Enrich doctor data with clinic and department names for view
    const staff = staffList.find(s => s.id === doctor.staff_id);
    const department = departments.find(d => d.id === doctor.department_id);
    const clinic = clinics.find(c => c.id === staff?.clinic_id);
    const enrichedDoctor = {
      ...doctor,
      ...staff,
      clinic_name: clinic ? clinic.clinic_name : "Unknown",
      department_name: department ? department.department_name : "—",
      full_name: staff ? `${staff.first_name} ${staff.last_name || ""}` : "Unknown",
      gender: staff?.gender,
      dob: staff?.dob,
      mobile: staff?.mobile,
      email: staff?.email,
      address_line1: staff?.address_line1,
      address_line2: staff?.address_line2,
      city: staff?.city,
      state: staff?.state,
      country: staff?.country,
      pincode: staff?.pincode,
      joining_date: staff?.joining_date
    };
    setViewDoctor(enrichedDoctor);
    setShowViewModal(true);
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (doctor) => {
    if (window.confirm(`Are you sure you want to delete doctor "${doctor.full_name}"?`)) {
      try {
        await deleteDoctor(doctor.id);
        await fetchDoctors();
      } catch (err) {
        console.error("Error deleting doctor:", err);
        alert("Failed to delete doctor. Please try again.");
      }
    }
  };

  const handleSave = async (formData) => {
    if (isEdit) {
      await updateDoctor(selectedDoctor.id, formData);
    } else {
      await createDoctor(formData);
    }
    await fetchDoctors();
    setShowModal(false);
  };

  const columns = [
    { key: "doctor_registration_no", label: "Reg No", align: "left", sortable: true },
    { key: "full_name", label: "Doctor Name", align: "left", sortable: true },
    { key: "specialization", label: "Specialization", align: "left", sortable: true },
    { key: "qualification", label: "Qualification", align: "left", sortable: true },
    { key: "experience_years", label: "Experience", align: "left", sortable: true },
    { key: "consultation_fee", label: "Fee", align: "left", sortable: true },
    { key: "status", label: "Status", align: "left", sortable: true },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--color-surface-alt)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: "var(--color-primary)" }}></div>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--color-surface-alt)" }}>
        <div className="text-center">
          <div className="p-3 rounded-full bg-red-100 mx-auto w-12 h-12 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>{error}</p>
          <button 
            onClick={fetchDoctors}
            className="mt-3 px-3 py-1 rounded-lg text-xs font-semibold"
            style={{ background: "var(--color-primary)", color: "white" }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4" style={{ background: "var(--color-surface-alt)", minHeight: "100%" }}>
        <div className="mb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Stethoscope size={20} style={{ color: "var(--color-primary)" }} />
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-base)" }}>Doctor Management</h2>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Manage all doctors across departments</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Department Filter Dropdown */}
              <select
                value={selectedDepartmentFilter}
                onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
                className="px-2 py-1.5 text-xs rounded-lg border outline-none"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
                style={{ background: "var(--color-primary)", color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-light)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-primary)"}
              >
                <Plus size={14} /> Add Doctor
              </button>
            </div>
          </div>
        </div>

        <TableUI
          columns={columns}
          data={doctors}
          title="Doctors List"
          searchPlaceholder="Search by name, specialization, reg no..."
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Doctor Form Modal */}
      {showModal && (
        <DoctorFormModal
          doctor={selectedDoctor}
          isEdit={isEdit}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* View Doctor Modal */}
      {showViewModal && (
        <ViewDoctorModal
          doctor={viewDoctor}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </>
  );
}