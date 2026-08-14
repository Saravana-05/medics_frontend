import { useState, useEffect, useRef } from "react";
import { 
  
  ChevronDown, ChevronUp,
  ArrowRight, Eye, Filter, Search, Settings, ListFilter 
} from "lucide-react";
import PrescriptionViewModal from "../../modal/PrescriptionViewModal";
import useFillRowCount from "../../hooks/useFillRowCount";

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
  { key: "sl", label: "No.", width: "w-12", align: "left", defaultVisible: true, sortable: true },
  { key: "entryDt", label: "Entry", width: "w-28", align: "left", defaultVisible: true, sortable: true },
  { key: "docModule", label: "Module", width: "w-32", align: "left", defaultVisible: true, sortable: true },
  { key: "reportDt", label: "Report", width: "w-28", align: "left", defaultVisible: false, sortable: true },
  { key: "complaint", label: "Complaint", width: "w-32", align: "left", defaultVisible: true, sortable: true },
  { key: "vitals", label: "Vitals", width: "w-36", align: "left", defaultVisible: false, sortable: false },
  { key: "by", label: "By", width: "w-24", align: "left", defaultVisible: true, sortable: true },
  { key: "nextVisit", label: "Next", width: "w-28", align: "left", defaultVisible: false, sortable: true },
];

/* Fixed row height (px) used to compute how many blank rows fill the remaining
   visible space — see useFillRowCount. */
const ROW_HEIGHT_PX = 32;

export default function PreviousVisitsTable({ visits = [] }) {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterText, setFilterText] = useState("");
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [currentVisitIndex, setCurrentVisitIndex] = useState(0);
  const [selectedRowSl, setSelectedRowSl] = useState(null);
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
            { name: "Paracetamol 500mg", form: "Tab", intake: "1", period: "TDS", when: "After Food", detail: "After meals", days: 5 },
            { name: "Amoxicillin 250mg", form: "Cap", intake: "1", period: "BD", when: "Before Food", detail: "Before meals", days: 7 }
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
    if (mod.includes("OP")) return { bg: "var(--color-primary-muted)", text: "var(--color-primary)", dot: "var(--color-primary)", badge: "OP" };
    if (mod.includes("IP")) return { bg: "var(--color-lab-light)", text: "var(--color-lab)", dot: "var(--color-lab)", badge: "IP" };
    return { bg: "#f0f0f0", text: "#5a5a5a", dot: "var(--color-drugs)", badge: "OT" };
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
    setSelectedRowSl(visit.sl);
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

  const rowsScrollRef = useRef(null);
  const fillRowCount = useFillRowCount(rowsScrollRef, ROW_HEIGHT_PX, filteredVisits.length);

  // Get only visible columns
  const visibleColumnsList = ALL_COLUMNS.filter(col => visibleColumns[col.key]);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={10} className="opacity-40" />;
    return sortDirection === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />;
  };

  return (
    <>
      <div className="h-full flex flex-col overflow-hidden" style={{
        background: "var(--color-surface)",
        fontFamily: "var(--font-body)"
      }}>
        
        {/* Header Section with FULL background color */}
        <div className="flex-shrink-0 px-3 py-1.5 border-b flex justify-between items-center" style={{
          height: "48px",
          boxSizing: "border-box",
          background: "var(--color-primary-muted)",
          borderColor: "var(--color-border)"
        }}>
          <div className="flex items-center">
            <div className="flex flex-col gap-1">
              <h3 className="font-bold leading-tight" style={{ color: "var(--color-primary-dark)", fontSize: "12.5px" }}>
                Previous Information
              </h3>
              <p className="text-[0.58rem] font-normal leading-tight" style={{ color: "var(--color-text-muted)" }}>
                {visits.length} Entries{visits.length !== 1 ? 's' : ''} Recorded
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Column Visibility Button */}
            <div className="relative">
              <button
                onClick={() => setShowColumnMenu(!showColumnMenu)}
                className="p-1 rounded-md transition-all"
                style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
                title="Toggle Columns"
              >
                <ListFilter  size={12} style={{ color: "var(--color-text-muted)" }} />
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
              <Search size={11} className="absolute left-2.5 top-1/2 transform -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
              <input
                type="text"
                placeholder="Search Entries..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-7 pr-2 py-1 text-[0.7rem] rounded-lg w-28 focus:w-40 transition-all duration-200 outline-none"
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
        <div ref={rowsScrollRef} className="flex-1 overflow-auto min-h-0 no-scrollbar">
          <table className="w-full border-collapse text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="table-header-text" style={{ background: "var(--color-primary-muted)", height: "34px", boxSizing: "border-box" }}>
                {visibleColumnsList.map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`${col.width} px-3 py-1 text-left ${col.sortable ? 'cursor-pointer hover:bg-opacity-80' : ''} transition-all select-none`}
                    style={{
                      borderBottom: "1px solid var(--color-border)",
                      fontSize: "0.62rem",
                      fontWeight: "700",
                      letterSpacing: "0.03em",
                      lineHeight: 1,
                      color: "var(--color-primary-dark)",
                      textTransform: "none"
                    }}
                  >
                    <div className="flex items-center justify-start gap-1">
                      {col.label}
                      {col.sortable && <SortIcon field={col.key} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {filteredVisits.length === 0 && visits.length > 0 && filterText ? (
                <tr>
                  <td colSpan={visibleColumnsList.length} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <History size={32} style={{ color: "var(--color-text-subtle)" }} />
                      <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
                        No matching records
                      </p>
                      <button
                        onClick={() => setFilterText("")}
                        className="text-xs px-3 py-1 rounded-lg transition-all"
                        style={{ background: "var(--color-primary-muted)", color: "var(--color-primary)" }}
                      >
                        Clear filter
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                {filteredVisits.map((visit, index) => {
                  const module = moduleColor(visit.docModule);
                  const vitals = getVitalsDisplay(visit.vitals);
                  
                  return (
                    <tr
                      key={visit.sl}
                      tabIndex={0}
                      className="previous-info-data-row transition-all duration-150 hover:shadow-sm hover:bg-primary-muted/30 cursor-pointer outline-none group"
                      style={{
                        borderBottom: "1px solid var(--color-border)",
                        background: selectedRowSl === visit.sl ? "var(--color-primary-muted)" : "var(--color-surface)",
                        boxShadow: selectedRowSl === visit.sl ? "inset 0 0 0 1px var(--color-primary)" : "none",
                        height: `${ROW_HEIGHT_PX}px`,
                        boxSizing: "border-box",
                      }}
                      onClick={() => handleViewRow(visit, index)}
                      onFocus={() => setSelectedRowSl(visit.sl)}
                    >
                      {visibleColumnsList.map(col => {
                        const value = visit[col.key];
                        
                        if (col.key === "docModule") {
                          return (
                            <td key={col.key} className={`${col.width} px-3 py-1 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                              <span className="inline-flex items-center text-xs font-normal" style={{ color: "var(--color-text-base)" }}>
                                {value}
                              </span>
                            </td>
                          );
                        }

                        if (col.key === "reportDt") {
                          return (
                            <td key={col.key} className={`${col.width} px-3 py-1 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                              {value ? (
                                <div className="flex items-center gap-1.5">

                                  <span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>
                                    {value}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>—</span>
                              )}
                            </td>
                          );
                        }

                        if (col.key === "vitals") {
                          return (
                            <td key={col.key} className={`${col.width} px-3 py-1 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs font-normal uppercase" style={{ color: "var(--color-text-base)" }}>BP</span>
                                    <span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{vitals.bp}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs font-normal uppercase" style={{ color: "var(--color-text-base)" }}>Pulse</span>
                                    <span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{vitals.pulse}</span>
                                  </div>
                                </div>
                                <div className="w-px h-6" style={{ background: "var(--color-border)" }} />
                                <div>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs font-normal uppercase" style={{ color: "var(--color-text-base)" }}>Temp</span>
                                    <span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{vitals.temp}°F</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          );
                        }

                        if (col.key === "nextVisit") {
                          return (
                            <td key={col.key} className={`${col.width} px-3 py-1 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                              {value && value !== "<None>" ? (
                                <div className="flex items-center gap-1.5">
                                  {/* <CalendarDays size={11} style={{ color: "var(--color-success)" }} /> */}
                                  <span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>
                                    {value}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>No follow-up</span>
                              )}
                            </td>
                          );
                        }
                        
                        if (col.key === "actions") {
                          return (
                            <td key={col.key} className="w-8 px-2 py-1 text-center">
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
                          <td key={col.key} className={`${col.width} px-3 py-1 ${col.align === 'right' ? 'text-right' : 'text-left'}`}>
                            {col.key === "sl" ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-normal" style={{ color: "var(--color-text-base)" }}>
                                <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: module.dot }} />
                                {value}
                              </span>
                            ) : col.key === "entryDt" ? (
                              <div className="flex items-center gap-1.5">
                                {/* <Calendar size={11} style={{ color: "var(--color-text-muted)" }} /> */}
                                <span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>
                                  {value}
                                </span>
                              </div>
                            ) : col.key === "complaint" ? (
                              <div className="flex items-center gap-1.5">

                                <span className="text-xs font-normal line-clamp-2" style={{ color: "var(--color-text-base)" }}>
                                  {value}
                                </span>
                              </div>
                            ) : col.key === "by" ? (
                              <div className="flex items-center gap-1.5">

                                <span className="text-xs font-normal truncate block max-w-[70px]" style={{ color: "var(--color-text-base)" }}>
                                  {value}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs font-normal" style={{ color: "var(--color-text-base)" }}>{value || "—"}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {Array.from({ length: fillRowCount }).map((_, index) => (
                  <tr key={`empty-${index}`} style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-surface)", height: `${ROW_HEIGHT_PX}px`, boxSizing: "border-box" }}>
                    {visibleColumnsList.map(col => (
                      <td key={col.key} className={`${col.width} px-3 py-1`}>&nbsp;</td>
                    ))}
                  </tr>
                ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with summary — always shown, even before any visit data arrives.
            Height matches the Drug Type / Group List footer bars in the other two
            columns so all three bottom rows line up as one continuous strip. */}
        <div className="flex-shrink-0 px-4 border-t flex justify-between items-center" style={{
          height: "48px",
          boxSizing: "border-box",
          background: "var(--color-primary-muted)",
          borderColor: "var(--color-border)"
        }}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-primary)" }} />
              <span style={{ color: "var(--color-text-muted)", fontSize: "13px", fontWeight: 400 }}>OP Visit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: "var(--color-lab)" }} />
              <span style={{ color: "var(--color-text-muted)", fontSize: "13px", fontWeight: 400 }}>IP Visit</span>
            </div>
          </div>
          <div style={{ color: "var(--color-text-muted)", fontSize: "13px", fontWeight: 400 }}>
            Showing {filteredVisits.length}/{visits.length}
          </div>
        </div>
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
