import { useState, useEffect } from "react";
import { 
  Calendar, Clock, FileText, Activity, User, CalendarDays,
  ChevronDown, ChevronUp, History, Stethoscope, Syringe,
  ArrowRight, Eye, Filter, Search, Settings, ListFilter 
} from "lucide-react";
import PrescriptionViewModal from "../../modal/PrescriptionViewModal";

// Store prescription history locally (in real app, this would come from an API/DB)
let globalPrescriptionHistory = {};

// Function to save prescription for a visit
export function savePrescriptionForVisit(visitSl, prescriptionData) {
  globalPrescriptionHistory[visitSl] = {
    ...globalPrescriptionHistory[visitSl],
    ...prescriptionData,
    savedAt: new Date().toISOString()
  };
}

// Function to get prescription for a visit
export function getPrescriptionForVisit(visitSl) {
  return globalPrescriptionHistory[visitSl] || null;
}

// Column configuration with visibility toggle option
const ALL_COLUMNS = [
  { key: "sl", label: "SL", width: "w-12", align: "right", defaultVisible: true, sortable: true },
  { key: "entryDt", label: "Entry", width: "w-28", align: "left", defaultVisible: true, sortable: true },
  { key: "docModule", label: "Module", width: "w-32", align: "left", defaultVisible: true, sortable: true },
  { key: "reportDt", label: "Report", width: "w-28", align: "left", defaultVisible: false, sortable: true },
  { key: "complaint", label: "Complaint", width: "w-32", align: "left", defaultVisible: true, sortable: true },
  { key: "vitals", label: "Vitals", width: "w-36", align: "left", defaultVisible: false, sortable: false },
  { key: "by", label: "By", width: "w-24", align: "left", defaultVisible: true, sortable: true },
  { key: "nextVisit", label: "Next", width: "w-28", align: "left", defaultVisible: false, sortable: true },
];

export default function PreviousVisitsTable({ visits = [] }) {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterText, setFilterText] = useState("");
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [currentVisitIndex, setCurrentVisitIndex] = useState(0);
  const [prescriptions, setPrescriptions] = useState({});
  const [visibleColumns, setVisibleColumns] = useState(() => {
    // Load saved column visibility from localStorage
    const saved = localStorage.getItem("previousVisitsTableColumns");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: col.defaultVisible }), {});
      }
    }
    return ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: col.defaultVisible }), {});
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  // Save column visibility to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("previousVisitsTableColumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // Load prescriptions for visits when visits change
  useEffect(() => {
    const loadedPrescriptions = {};
    visits.forEach(visit => {
      const savedPrescription = getPrescriptionForVisit(visit.sl);
      if (savedPrescription) {
        loadedPrescriptions[visit.sl] = savedPrescription;
      } else {
        // Demo data for existing visits
        loadedPrescriptions[visit.sl] = {
          drugs: [
            { name: "Paracetamol 500mg", form: "Tab", intake: "1", period: "TDS", when: "AF", detail: "After meals", days: 5 },
            { name: "Amoxicillin 250mg", form: "Cap", intake: "1", period: "BD", when: "BF", detail: "Before meals", days: 7 }
          ],
          labs: [
            { name: "Complete Blood Count (CBC)", detail: "Fasting" },
            { name: "Lipid Profile", detail: "Fasting" }
          ],
          services: [
            { type: "X-Ray", name: "Chest X-Ray PA", detail: "Chest" }
          ],
          findings: {
            diagnosis: "Upper Respiratory Tract Infection",
            clinicalNotes: "Patient presented with fever and cough",
            advice: "Take rest and stay hydrated",
            nextVisit: "10/03/2024",
            referTo: "",
            followupNote: "Review after 7 days"
          }
        };
      }
    });
    setPrescriptions(loadedPrescriptions);
  }, [visits]);

  const moduleColor = (mod) => {
    if (mod.includes("OP")) return { bg: "var(--color-primary-muted)", text: "var(--color-primary)", badge: "OP" };
    if (mod.includes("IP")) return { bg: "var(--color-lab-light)", text: "var(--color-lab)", badge: "IP" };
    return { bg: "#f0f0f0", text: "#5a5a5a", badge: "OT" };
  };

  const getVitalsDisplay = (vitals) => {
    if (!vitals) return "—";
    const parts = vitals.split('/');
    if (parts.length >= 6) {
      return {
        bp: `${parts[3]}/${parts[4]}`,
        pulse: parts[5],
        temp: parts[1]
      };
    }
    return { bp: "—", pulse: "—", temp: "—" };
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewRow = (visit, index) => {
    setSelectedVisit(visit);
    setCurrentVisitIndex(index);
  };

  const closeModal = () => {
    setSelectedVisit(null);
  };

  const handleNavigate = (newIndex) => {
    setCurrentVisitIndex(newIndex);
    setSelectedVisit(filteredVisits[newIndex]);
  };

  const toggleColumn = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const sortedVisits = [...visits].sort((a, b) => {
    if (!sortField) return 0;
    
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === "sl") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }
    
    if (sortField === "entryDt") {
      const aDate = new Date(aVal.split(' ')[0].split('/').reverse().join('-'));
      const bDate = new Date(bVal.split(' ')[0].split('/').reverse().join('-'));
      return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
    }
    
    if (typeof aVal === 'string') {
      return sortDirection === "asc" 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
    
    return 0;
  });

  const filteredVisits = sortedVisits.filter(visit => 
    filterText === "" || 
    visit.complaint?.toLowerCase().includes(filterText.toLowerCase()) ||
    visit.docModule?.toLowerCase().includes(filterText.toLowerCase()) ||
    visit.by?.toLowerCase().includes(filterText.toLowerCase())
  );

  // Get only visible columns
  const visibleColumnsList = ALL_COLUMNS.filter(col => visibleColumns[col.key]);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={10} className="opacity-40" />;
    return sortDirection === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />;
  };

  return (
    <>
      <div className="h-full flex flex-col rounded-sm overflow-hidden shadow-sm" style={{ 
        background: "var(--color-surface)", 
        fontFamily: "var(--font-body)"
      }}>
        
        {/* Header Section with FULL background color */}
        <div className="flex-shrink-0 px-4 py-[0.44rem] border-b flex justify-between items-center" style={{ 
          background: "var(--color-primary-muted)",
          borderColor: "var(--color-border)"
        }}>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg" style={{ background: "var(--color-primary)", color: "white" }}>
              <History size={14} />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: "var(--color-primary-dark)" }}>
                Previous Visits
              </h3>
              <p className="text-[0.6rem] font-medium mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                {visits.length} visit{visits.length !== 1 ? 's' : ''} recorded
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Column Visibility Button */}
            <div className="relative">
              <button
                onClick={() => setShowColumnMenu(!showColumnMenu)}
                className="p-1.5 rounded-lg transition-all"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                title="Toggle Columns"
              >
                <ListFilter  size={14} style={{ color: "var(--color-text-muted)" }} />
              </button>
              
              {showColumnMenu && (
                <div 
                  className="absolute right-0 top-full mt-1 w-40 rounded-lg shadow-xl z-50 animate-fade-in"
                  style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                  onMouseLeave={() => setShowColumnMenu(false)}
                >
                  <div className="p-2 border-b" style={{ borderColor: "var(--color-border)" }}>
                    <span className="text-xs font-semibold">Show/Hide Columns</span>
                  </div>
                  <div className="p-2 space-y-1">
                    {ALL_COLUMNS.map(col => (
                      <label key={col.key} className="flex items-center gap-2 cursor-pointer text-xs py-1 hover:bg-surface-alt px-1 rounded transition-all">
                        <input
                          type="checkbox"
                          checked={visibleColumns[col.key]}
                          onChange={() => toggleColumn(col.key)}
                          className="w-3.5 h-3.5 rounded"
                          style={{ accentColor: "var(--color-primary)" }}
                        />
                        <span style={{ color: "var(--color-text-base)" }}>{col.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Search Input */}
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 transform -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
              <input
                type="text"
                placeholder="Search visits..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg w-36 focus:w-48 transition-all duration-200 outline-none"
                style={{ 
                  border: "1px solid var(--color-border)", 
                  background: "var(--color-surface)",
                  color: "var(--color-text-base)"
                }}
              />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 z-10">
              <tr style={{ background: "var(--color-primary-muted)" }}>
                {visibleColumnsList.map(col => (
                  <th 
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`${col.width} px-3 py-2.5 ${col.align === 'right' ? 'text-right' : 'text-left'} ${col.sortable ? 'cursor-pointer hover:bg-opacity-80' : ''} transition-all select-none`}
                    style={{ 
                      borderBottom: "1px solid var(--color-border)",
                      fontSize: "0.65rem",
                      fontWeight: "700",
                      letterSpacing: "0.05em",
                      color: "var(--color-primary-dark)",
                      textTransform: "uppercase"
                    }}
                  >
                    <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                      {col.label}
                      {col.sortable && <SortIcon field={col.key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumnsList.length} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <History size={32} style={{ color: "var(--color-text-subtle)" }} />
                      <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                        {visits.length === 0 ? "No visit records found" : "No matching records"}
                      </p>
                      {filterText && (
                        <button
                          onClick={() => setFilterText("")}
                          className="text-xs px-3 py-1 rounded-lg transition-all"
                          style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}
                        >
                          Clear filter
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVisits.map((visit, index) => {
                  const module = moduleColor(visit.docModule);
                  const vitals = getVitalsDisplay(visit.vitals);
                  
                  return (
                    <tr 
                      key={visit.sl}
                      className="transition-all duration-150 hover:shadow-sm hover:bg-primary-muted/30 cursor-pointer group"
                      style={{ 
                        borderBottom: "1px solid var(--color-border)",
                        background: "var(--color-surface)"
                      }}
                      onClick={() => handleViewRow(visit, index)}
                    >
                      {visibleColumnsList.map(col => {
                        const value = visit[col.key];
                        
                        if (col.key === "docModule") {
                          return (
                            <td key={col.key} className={`${col.width} px-3 py-2.5 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[0.6rem] font-bold" style={{ background: module.bg, color: module.text }}>
                                {value}
                              </span>
                            </td>
                          );
                        }
                        
                        if (col.key === "reportDt") {
                          return (
                            <td key={col.key} className={`${col.width} px-3 py-2.5 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                              {value ? (
                                <div className="flex items-center gap-1.5">
                                  <FileText size={11} style={{ color: "var(--color-success)" }} />
                                  <span className="font-mono text-[0.65rem]" style={{ color: "var(--color-success)" }}>
                                    {value}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[0.65rem]" style={{ color: "var(--color-text-subtle)" }}>—</span>
                              )}
                            </td>
                          );
                        }
                        
                        if (col.key === "vitals") {
                          return (
                            <td key={col.key} className={`${col.width} px-3 py-2.5 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[0.55rem] font-bold uppercase" style={{ color: "var(--color-text-muted)" }}>BP</span>
                                    <span className="text-[0.65rem] font-mono font-semibold" style={{ color: "var(--color-primary)" }}>{vitals.bp}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[0.55rem] font-bold uppercase" style={{ color: "var(--color-text-muted)" }}>Pulse</span>
                                    <span className="text-[0.65rem] font-mono" style={{ color: "var(--color-drugs)" }}>{vitals.pulse}</span>
                                  </div>
                                </div>
                                <div className="w-px h-6" style={{ background: "var(--color-border)" }} />
                                <div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-[0.55rem] font-bold uppercase" style={{ color: "var(--color-text-muted)" }}>Temp</span>
                                    <span className="text-[0.65rem] font-mono" style={{ color: "var(--color-lab)" }}>{vitals.temp}°F</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          );
                        }
                        
                        if (col.key === "nextVisit") {
                          return (
                            <td key={col.key} className={`${col.width} px-3 py-2.5 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                              {value && value !== "<None>" ? (
                                <div className="flex items-center gap-1.5">
                                  <CalendarDays size={11} style={{ color: "var(--color-success)" }} />
                                  <span className="text-[0.65rem] font-semibold" style={{ color: "var(--color-success)" }}>
                                    {value}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-[0.65rem] italic" style={{ color: "var(--color-text-subtle)" }}>No follow-up</span>
                              )}
                            </td>
                          );
                        }
                        
                        if (col.key === "actions") {
                          return (
                            <td key={col.key} className="w-8 px-2 py-2.5 text-center">
                              <button
                                className="p-1.5 rounded-lg transition-all opacity-60 group-hover:opacity-100"
                                style={{ 
                                  background: "var(--color-primary-muted)", 
                                  color: "var(--color-primary)"
                                }}
                                title="View Details & Prescription"
                              >
                                <Eye size={12} />
                              </button>
                            </td>
                          );
                        }
                        
                        return (
                          <td key={col.key} className={`${col.width} px-3 py-2.5 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                            {col.key === "sl" ? (
                              <span className="font-bold" style={{ color: "var(--color-primary)" }}>{value}</span>
                            ) : col.key === "entryDt" ? (
                              <div className="flex items-center gap-1.5">
                                <Calendar size={11} style={{ color: "var(--color-text-muted)" }} />
                                <span className="font-mono text-[0.65rem]" style={{ color: "var(--color-text-base)" }}>
                                  {value}
                                </span>
                              </div>
                            ) : col.key === "complaint" ? (
                              <div className="flex items-center gap-1.5">
                                <Activity size={11} style={{ color: "var(--color-danger)" }} />
                                <span className="text-[0.7rem] font-medium line-clamp-2" style={{ color: "var(--color-text-base)" }}>
                                  {value}
                                </span>
                              </div>
                            ) : col.key === "by" ? (
                              <div className="flex items-center gap-1.5">
                                <User size={11} style={{ color: "var(--color-primary)" }} />
                                <span className="text-[0.7rem] font-medium truncate block max-w-[70px]" style={{ color: "var(--color-text-base)" }}>
                                  {value}
                                </span>
                              </div>
                            ) : (
                              <span style={{ color: "var(--color-text-base)" }}>{value || "—"}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with summary */}
        {filteredVisits.length > 0 && (
          <div className="flex-shrink-0 px-4 py-2 border-t flex justify-between items-center" style={{ 
            background: "var(--color-surface-alt)", 
            borderColor: "var(--color-border)"
          }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-primary)" }} />
                <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>OP Visit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-lab)" }} />
                <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>IP Visit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-drugs)" }} />
                <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>Report Ready</span>
              </div>
            </div>
            <div className="text-[0.6rem] font-medium" style={{ color: "var(--color-text-muted)" }}>
              Showing {filteredVisits.length} of {visits.length} records
            </div>
          </div>
        )}
      </div>

      {/* Prescription View Modal */}
      {selectedVisit && (
        <PrescriptionViewModal 
          visit={selectedVisit}
          prescriptions={prescriptions[selectedVisit.sl] || {}}
          onClose={closeModal}
          onNavigate={handleNavigate}
          currentIndex={currentVisitIndex}
          totalVisits={filteredVisits.length}
        />
      )}
    </>
  );
}