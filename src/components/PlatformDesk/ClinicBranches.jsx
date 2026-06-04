// src/components/PlatformDesk/ClinicBranches.jsx
import { useState, useEffect } from "react";
import { MapPin, Plus, Building2 } from "lucide-react";
import TableUI from "../Table/TableUI";
import ClinicBranchFormModal from "../../modal/ClinicBranchFormModal";
import { getAllClinicBranches, createClinicBranch, updateClinicBranch, deleteClinicBranch } from "../../services/clinicBranchService";
import { getAllClinics } from "../../services/clinicService";
import ViewClinicBranchModal from "../../modal/ViewClinicBranchModal";

export default function ClinicBranches() {
  const [branches, setBranches] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedClinicFilter, setSelectedClinicFilter] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewBranch, setViewBranch] = useState(null);

  // Fetch clinics for filter dropdown
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const data = await getAllClinics();
        setClinics(data);
      } catch (err) {
        console.error("Error fetching clinics:", err);
      }
    };
    fetchClinics();
  }, []);

  // Fetch branches from API
  useEffect(() => {
    fetchBranches();
  }, [selectedClinicFilter]);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      let data = await getAllClinicBranches();
      
      // Filter by clinic if selected
      if (selectedClinicFilter) {
        data = data.filter(branch => branch.clinic_id === selectedClinicFilter);
      }
      
      // Enrich data with clinic names
      const enrichedData = await Promise.all(data.map(async (branch) => {
        const clinic = clinics.find(c => c.id === branch.clinic_id);
        return {
          ...branch,
          clinic_name: clinic ? clinic.clinic_name : "Unknown"
        };
      }));
      
      setBranches(enrichedData);
      setError(null);
    } catch (err) {
      setError("Failed to load clinic branches. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedBranch(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleView = (branch) => {
  // Enrich branch data with clinic name
  const clinic = clinics.find(c => c.id === branch.clinic_id);
  const enrichedBranch = {
    ...branch,
    clinic_name: clinic ? clinic.clinic_name : "Unknown"
  };
  setViewBranch(enrichedBranch);
  setShowViewModal(true);
};

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (branch) => {
    if (window.confirm(`Are you sure you want to delete branch "${branch.branch_name}"?`)) {
      try {
        await deleteClinicBranch(branch.id);
        await fetchBranches();
      } catch (err) {
        console.error("Error deleting branch:", err);
        alert("Failed to delete branch. Please try again.");
      }
    }
  };

  const handleSave = async (formData) => {
    if (isEdit) {
      await updateClinicBranch(selectedBranch.id, formData);
    } else {
      await createClinicBranch(formData);
    }
    await fetchBranches();
    setShowModal(false);
  };

  const getClinicName = (clinicId) => {
    const clinic = clinics.find(c => c.id === clinicId);
    return clinic ? clinic.clinic_name : "Unknown";
  };

  const columns = [
    { key: "branch_code", label: "Branch Code", align: "left", sortable: true },
    { key: "branch_name", label: "Branch Name", align: "left", sortable: true },
    { 
      key: "clinic_name", 
      label: "Clinic Name", 
      align: "left", 
      sortable: true,
      render: (row) => getClinicName(row.clinic_id)
    },
    { key: "email", label: "Email", align: "left", sortable: true },
    { key: "mobile", label: "Mobile", align: "left", sortable: true },
    { key: "city", label: "City", align: "left", sortable: true },
    { key: "status", label: "Status", align: "left", sortable: true },
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "var(--color-surface-alt)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: "var(--color-drugs)" }}></div>
          <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>Loading branches...</p>
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
            onClick={fetchBranches}
            className="mt-3 px-3 py-1 rounded-lg text-xs font-semibold"
            style={{ background: "var(--color-drugs)", color: "white" }}
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
              <MapPin size={20} style={{ color: "var(--color-drugs)" }} />
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text-base)" }}>Clinic Branches</h2>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Manage all clinic branches across locations</p>
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
                style={{ background: "var(--color-drugs)", color: "white" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#146b4c"}
                onMouseLeave={(e) => e.currentTarget.style.background = "var(--color-drugs)"}
              >
                <Plus size={14} /> Add Branch
              </button>
            </div>
          </div>
        </div>

        <TableUI
          columns={columns}
          data={branches}
          title="Branches List"
          searchPlaceholder="Search by name, code, clinic..."
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Clinic Branch Form Modal */}
      {showModal && (
        <ClinicBranchFormModal
          branch={selectedBranch}
          isEdit={isEdit}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {showViewModal && (
  <ViewClinicBranchModal
    branch={viewBranch}
    onClose={() => setShowViewModal(false)}
  />
)}
    </>
  );
}