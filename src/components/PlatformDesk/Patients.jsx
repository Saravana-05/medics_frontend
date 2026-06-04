// src/components/PlatformDesk/Patients.jsx
import { useState, useEffect } from "react";
import { Heart, Plus, Filter } from "lucide-react";
import TableUI from "../Table/TableUI";
import PatientFormModal from "../../modal/PatientFormModal";
import ViewPatientModal from "../../modal/ViewPatientModal";
import { getAllPatients, createPatient, updatePatient, deletePatient } from "../../services/patientService";
import { getAllClinics } from "../../services/clinicService";
import { getAllClinicBranches } from "../../services/clinicBranchService";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewPatient, setViewPatient] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedClinicFilter, setSelectedClinicFilter] = useState("");

  // Fetch clinics and branches for filter dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clinicsData, branchesData] = await Promise.all([
          getAllClinics(),
          getAllClinicBranches()
        ]);
        setClinics(clinicsData);
        setBranches(branchesData);
      } catch (err) {
        console.error("Error fetching reference data:", err);
      }
    };
    fetchData();
  }, []);

  // Fetch patients from API
  useEffect(() => {
    fetchPatients();
  }, [selectedClinicFilter]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      let data = await getAllPatients();
      
      // Filter by clinic if selected
      if (selectedClinicFilter) {
        data = data.filter(patient => patient.clinic_id === selectedClinicFilter);
      }
      
      // Enrich data with clinic and branch names
      const enrichedData = await Promise.all(data.map(async (patient) => {
        const clinic = clinics.find(c => c.id === patient.clinic_id);
        const branch = branches.find(b => b.id === patient.branch_id);
        return {
          ...patient,
          clinic_name: clinic ? clinic.clinic_name : "Unknown",
          branch_name: branch ? branch.branch_name : "—",
          full_name: `${patient.first_name || ""} ${patient.last_name || ""}`.trim(),
          age: patient.dob ? calculateAge(patient.dob) : null
        };
      }));
      
      setPatients(enrichedData);
      setError(null);
    } catch (err) {
      setError("Failed to load patients. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleAdd = () => {
    setSelectedPatient(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleView = (patient) => {
    // Enrich patient data with clinic and branch names for view
    const clinic = clinics.find(c => c.id === patient.clinic_id);
    const branch = branches.find(b => b.id === patient.branch_id);
    const enrichedPatient = {
      ...patient,
      clinic_name: clinic ? clinic.clinic_name : "Unknown",
      branch_name: branch ? branch.branch_name : "—",
      full_name: `${patient.first_name || ""} ${patient.last_name || ""}`.trim()
    };
    setViewPatient(enrichedPatient);
    setShowViewModal(true);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (patient) => {
    if (window.confirm(`Are you sure you want to delete patient "${patient.full_name}"?`)) {
      try {
        await deletePatient(patient.id);
        await fetchPatients();
      } catch (err) {
        console.error("Error deleting patient:", err);
        alert("Failed to delete patient. Please try again.");
      }
    }
  };

  const handleSave = async (formData) => {
    if (isEdit) {
      await updatePatient(selectedPatient.id, formData);
    } else {
      await createPatient(formData);
    }
    await fetchPatients();
    setShowModal(false);
  };

  const columns = [
    { key: "patient_no", label: "Patient No", align: "left", sortable: true },
    { key: "full_name", label: "Patient Name", align: "left", sortable: true },
    { key: "gender", label: "Gender", align: "left", sortable: true },
    { key: "age", label: "Age", align: "left", sortable: true },
    { key: "mobile", label: "Mobile", align: "left", sortable: true },
    { key: "email", label: "Email", align: "left", sortable: true },
    { key: "status", label: "Status", align: "left", sortable: true },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--color-surface-alt)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: "var(--color-danger)" }}></div>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>Loading patients...</p>
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
            onClick={fetchPatients}
            className="mt-3 px-3 py-1 rounded-lg text-xs font-semibold"
            style={{ background: "var(--color-danger)", color: "white" }}
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
              <Heart size={20} style={{ color: "var(--color-danger)" }} />
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-base)" }}>Patient Management</h2>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Manage all patients across clinics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Clinic Filter Dropdown */}
              <select
                value={selectedClinicFilter}
                onChange={(e) => setSelectedClinicFilter(e.target.value)}
                className="px-2 py-1.5 text-xs rounded-lg border outline-none"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}
              >
                <option value="">All Clinics</option>
                {clinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.clinic_name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
                style={{ background: "var(--color-danger)", color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#b91c1c"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-danger)"}
              >
                <Plus size={14} /> Add Patient
              </button>
            </div>
          </div>
        </div>

        <TableUI
          columns={columns}
          data={patients}
          title="Patients List"
          searchPlaceholder="Search by name, patient no, mobile..."
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Patient Form Modal */}
      {showModal && (
        <PatientFormModal
          patient={selectedPatient}
          isEdit={isEdit}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* View Patient Modal */}
      {showViewModal && (
        <ViewPatientModal
          patient={viewPatient}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </>
  );
}