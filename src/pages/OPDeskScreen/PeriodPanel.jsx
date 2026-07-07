import { useState } from "react";
import { Calendar, Clock, Filter, ChevronDown, X } from "lucide-react";

function PeriodPanel({ patient, panelHeight }) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showCustomRange, setShowCustomRange] = useState(false);

  const headerH = 50;

  // Generate years from 2022 to current year
  const years = [];
  for (let year = 2022; year <= currentYear; year++) {
    years.push(year);
  }

  // Mock visit data for display
  const mockVisits = [
    { date: "15/03/2024", type: "Follow-up", doctor: "Dr. Aravind", department: "General Medicine" },
    { date: "02/03/2024", type: "Consultation", doctor: "Dr. Sheela", department: "Obstetrics" },
    { date: "28/02/2024", type: "Follow-up", doctor: "Dr. Aravind", department: "General Medicine" },
    { date: "15/02/2024", type: "Emergency", doctor: "Dr. Karthik", department: "Emergency" },
    { date: "10/01/2024", type: "Consultation", doctor: "Dr. Meera", department: "Rheumatology" },
    { date: "20/12/2023", type: "Follow-up", doctor: "Dr. Aravind", department: "General Medicine" },
    { date: "05/11/2023", type: "Consultation", doctor: "Dr. Raj", department: "Endocrinology" },
    { date: "15/10/2023", type: "Emergency", doctor: "Dr. Karthik", department: "Emergency" },
    { date: "20/09/2023", type: "Follow-up", doctor: "Dr. Aravind", department: "General Medicine" },
    { date: "10/08/2023", type: "Consultation", doctor: "Dr. Sheela", department: "Obstetrics" },
    { date: "05/07/2023", type: "Follow-up", doctor: "Dr. Meera", department: "Rheumatology" },
    { date: "15/06/2023", type: "Consultation", doctor: "Dr. Raj", department: "Endocrinology" },
    { date: "20/05/2023", type: "Emergency", doctor: "Dr. Karthik", department: "Emergency" },
    { date: "10/04/2023", type: "Follow-up", doctor: "Dr. Aravind", department: "General Medicine" },
    { date: "05/03/2023", type: "Consultation", doctor: "Dr. Sheela", department: "Obstetrics" },
    { date: "15/02/2023", type: "Follow-up", doctor: "Dr. Meera", department: "Rheumatology" },
    { date: "20/01/2023", type: "Consultation", doctor: "Dr. Raj", department: "Endocrinology" },
    { date: "10/12/2022", type: "Emergency", doctor: "Dr. Karthik", department: "Emergency" },
    { date: "05/11/2022", type: "Follow-up", doctor: "Dr. Aravind", department: "General Medicine" },
    { date: "15/10/2022", type: "Consultation", doctor: "Dr. Sheela", department: "Obstetrics" },
  ];

  // Filter visits by year
  const getVisitsByYear = (year) => {
    return mockVisits.filter(visit => {
      const visitYear = parseInt(visit.date.split('/')[2]);
      return visitYear === year;
    });
  };

  // Filter visits by custom date range
  const getVisitsByDateRange = () => {
    if (!fromDate || !toDate) return mockVisits;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return mockVisits.filter(visit => {
      const [day, month, year] = visit.date.split('/');
      const visitDate = new Date(`${year}-${month}-${day}`);
      return visitDate >= from && visitDate <= to;
    });
  };

  const currentVisits = showCustomRange ? getVisitsByDateRange() : getVisitsByYear(selectedYear);

  const handleClearCustomRange = () => {
    setFromDate("");
    setToDate("");
    setShowCustomRange(false);
  };

  return (
    <div
      className="overflow-hidden rounded-lg shadow-xl flex flex-col"
      style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}
    >
      <div className="px-3 py-2 border-b flex items-center justify-between"
        style={{ background: "#0c324a", borderColor: "var(--color-border)", height: headerH, flexShrink: 0 }}>
        <div className="flex items-center gap-2">
          {/* <Calendar size={16} style={{ color: "#ffffff" }} /> */}
          <span className="text-md font-bold text-white" style={{ color: "#ffffff" }}>Visit Period</span>
        </div>
        
      </div>
      
      {/* Second row — period selector controls (light-grey divider + drop shadow) */}
      <div className="p-3 flex-shrink-0" style={{ borderBottom: "1px solid #e5e7eb", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
        <button
          onClick={() => setShowCustomRange(!showCustomRange)}
          className="text-[0.6rem] font-semibold px-2 py-1 rounded transition-all"
          style={{
            background: showCustomRange ? "rgba(255,255,255,0.2)" : "var(--color-surface)",
            color: showCustomRange ? "#ffffff" : "#0c324a",
            border: "1px solid rgba(255,255,255,0.4)"
          }}
        >
          {showCustomRange ? "Year View" : "Custom Range"}
        </button>
        {/* Year Selector or Custom Range */}
        {!showCustomRange ? (
          // Year Selector - Display years from 2022 to current
          <div className="mb-4">
            <div className="text-[0.6rem] font-bold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>
              Select Period
            </div>
            <div className="flex gap-2 flex-wrap">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
                  style={{
                    background: selectedYear === year ? "#0c324a" : "var(--color-surface-alt)",
                    color: selectedYear === year ? "white" : "var(--color-text-muted)",
                    border: "1px solid var(--color-border)"
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
            <div className="mt-2 text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>
              Showing visits for {selectedYear} ({currentVisits.length} visits)
            </div>
          </div>
        ) : (
          // Custom Range (Revised Period)
          <div className="mb-4">
            <div className="text-[0.6rem] font-bold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>
              Revised Period
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[0.55rem] font-medium mb-1 block" style={{ color: "var(--color-text-muted)" }}>
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-md text-xs border outline-none"
                    style={{
                      background: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-base)"
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[0.55rem] font-medium mb-1 block" style={{ color: "var(--color-text-muted)" }}>
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-md text-xs border outline-none"
                    style={{
                      background: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-base)"
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCustomRange(false)}
                  className="flex-1 px-2 py-1 rounded text-xs font-semibold flex items-center justify-center gap-1"
                  style={{ background: "#d97706", color: "white" }}
                >
                  <Calendar size={12} /> Apply Range
                </button>
                <button
                  onClick={handleClearCustomRange}
                  className="px-3 py-1 rounded text-xs font-semibold flex items-center justify-center gap-1"
                  style={{ background: "#fee2e2", color: "var(--color-danger)", border: "1px solid #fecaca" }}
                >
                  <X size={12} /> Clear
                </button>
              </div>
              {fromDate && toDate && (
                <div className="text-[0.6rem] mt-1" style={{ color: "var(--color-text-muted)" }}>
                  Showing {currentVisits.length} visits from {fromDate} to {toDate}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Body — visit results only */}
      <div className="overflow-y-auto p-3 flex-1">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>
              {currentVisits.length} Visit{currentVisits.length !== 1 ? 's' : ''} Found
            </div>
            <button className="text-[0.6rem] flex items-center gap-1 px-2 py-1 rounded"
              style={{ background: "var(--color-surface-alt)" }}>
              <Filter size={10} /> Filter
            </button>
          </div>

          {/* Visit List */}
          {currentVisits.length === 0 ? (
            <div className="text-center py-8 text-xs" style={{ color: "var(--color-text-muted)" }}>
              <Calendar size={32} style={{ color: "var(--color-text-subtle)" }} className="mx-auto mb-2" />
              No visits found for this period
            </div>
          ) : (
            <div className="space-y-2">
              {currentVisits.map((visit, index) => (
                <div key={index} className="p-2 rounded-lg border hover:shadow-sm transition-all" 
                  style={{ borderColor: "var(--color-border)" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>
                        {visit.type}
                      </div>
                      <div className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>
                        {visit.doctor} • {visit.department}
                      </div>
                    </div>
                    <div className="text-[0.6rem] font-medium flex items-center gap-1" 
                      style={{ color: "var(--color-text-muted)" }}>
                      <Clock size={10} />
                      {visit.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PeriodPanel;