// src/components/PlatformDesk/Clinic.jsx
import { useState, useEffect } from "react";
import { Plus, Building2, Edit2, Eye, Trash2 } from "lucide-react";
import TableUI from "../Table/TableUI";
import ClinicFormModal from "../../modal/ClinicFormModal";
import { getAllClinics, createClinic, updateClinic, deleteClinic } from "../../services/clinicService";
import ViewClinicModal from "../../modal/ViewClinicModal";

export default function Clinic() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewClinic, setViewClinic] = useState(null);

  // Fetch clinics from API
  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const data = await getAllClinics();
      setClinics(data);
      setError(null);
    } catch (err) {
      setError("Failed to load clinics. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedClinic(null);
    setIsEdit(false);
    setShowModal(true);
  };

 const handleView = (clinic) => {
  setViewClinic(clinic);
  setShowViewModal(true);
};


  const handleEdit = (clinic) => {
    setSelectedClinic(clinic);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (clinic) => {
    if (window.confirm(`Are you sure you want to delete clinic "${clinic.clinic_name}"?`)) {
      try {
        await deleteClinic(clinic.id);
        await fetchClinics(); // Refresh list
      } catch (err) {
        console.error("Error deleting clinic:", err);
        alert("Failed to delete clinic. Please try again.");
      }
    }
  };

  const handleSave = async (formData) => {
    if (isEdit) {
      await updateClinic(selectedClinic.id, formData);
    } else {
      await createClinic(formData);
    }
    await fetchClinics();
  };

  const columns = [
    { key: "clinic_code", label: "Clinic Code", align: "left", sortable: true },
    { key: "clinic_name", label: "Clinic Name", align: "left", sortable: true },
    { key: "email", label: "Email", align: "left", sortable: true },
    { key: "mobile", label: "Mobile", align: "left", sortable: true },
    { key: "city", label: "City", align: "left", sortable: true },
    { key: "state", label: "State", align: "left", sortable: true },
    { key: "pincode", label: "Pincode", align: "left", sortable: true },
    { key: "status", label: "Status", align: "left", sortable: true },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--color-surface-alt)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: "var(--color-primary)" }}></div>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>Loading clinics...</p>
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
            onClick={fetchClinics}
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 size={20} style={{ color: "var(--color-primary)" }} />
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-base)" }}>Clinic Management</h2>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Manage all clinics registered in the platform</p>
              </div>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
              style={{ background: "var(--color-primary)", color: "white" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--color-primary-light)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-primary)"}
            >
              <Plus size={14} /> Add Clinic
            </button>
          </div>
        </div>

        <TableUI
          columns={columns}
          data={clinics}
          title="Clinics List"
          searchPlaceholder="Search by name, code, email..."
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Clinic Form Modal */}
      {showModal && (
        <ClinicFormModal
          clinic={selectedClinic}
          isEdit={isEdit}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {showViewModal && (
  <ViewClinicModal
    clinic={viewClinic}
    onClose={() => setShowViewModal(false)}
  />
)}
    </>
  );
}