import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Clock, Filter, Play } from "lucide-react";

const FINANCIAL_PERIODS = ["2020-21", "2021-22", "2022-23", "2023-24", "2024-25", "2025-26"];

function PeriodPanel({ patient, panelHeight }) {
  const [selectedPeriod, setSelectedPeriod] = useState(FINANCIAL_PERIODS[FINANCIAL_PERIODS.length - 1]);
  const [appliedPeriod, setAppliedPeriod] = useState(FINANCIAL_PERIODS[FINANCIAL_PERIODS.length - 1]);
  const todaysVisit = patient?.todaysVisit || {};

  const headerH = 50;

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

  // Financial periods run consecutively from April 1 through March 31.
  const getVisitsByPeriod = (period) => {
    const startYear = Number(period.slice(0, 4));
    const from = new Date(startYear, 3, 1);
    const to = new Date(startYear + 1, 2, 31, 23, 59, 59, 999);
    return mockVisits.filter(visit => {
      const [day, month, year] = visit.date.split('/').map(Number);
      const visitDate = new Date(year, month - 1, day);
      return visitDate >= from && visitDate <= to;
    });
  };

  const currentVisits = getVisitsByPeriod(appliedPeriod);
  const selectedPeriodIndex = FINANCIAL_PERIODS.indexOf(selectedPeriod);
  const previousPeriod = FINANCIAL_PERIODS[selectedPeriodIndex - 1];
  const nextPeriod = FINANCIAL_PERIODS[selectedPeriodIndex + 1];

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

      {/* Today's Visit was moved here from the Profile drawer. */}
      <div className="px-3 py-2 flex-shrink-0 border-b" style={{ background: "var(--color-surface-alt)", borderColor: "var(--color-border)" }}>
        <div className="text-xs font-bold mb-2" style={{ color: "#0c324a" }}>Today's Visit</div>
        <div className="grid grid-cols-6 gap-x-3 gap-y-3">
          <div className="col-span-2">
            <div className="text-[0.55rem] font-semibold uppercase" style={{ color: "var(--color-text-muted)" }}>Visit Type</div>
            <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>{todaysVisit.type || "—"}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[0.55rem] font-semibold uppercase" style={{ color: "var(--color-text-muted)" }}>First Visit</div>
            <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>{todaysVisit.firstVisit || "—"}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[0.55rem] font-semibold uppercase" style={{ color: "var(--color-text-muted)" }}>Visit Count</div>
            <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>{todaysVisit.visitCount ?? "—"}</div>
          </div>
          <div className="col-span-3">
            <div className="text-[0.55rem] font-semibold uppercase" style={{ color: "var(--color-text-muted)" }}>Corporate</div>
            <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>{todaysVisit.corporate || "—"}</div>
          </div>
          <div className="col-span-3">
            <div className="text-[0.55rem] font-semibold uppercase" style={{ color: "var(--color-text-muted)" }}>Fee Type</div>
            <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>{todaysVisit.fee || "—"}</div>
          </div>
        </div>
      </div>
      
      {/* Six fixed, consecutive financial-year periods. Selection is staged
          until Run is clicked, then the visit data is filtered to that period. */}
      <div className="p-3 flex-shrink-0" style={{ borderBottom: "1px solid #e5e7eb", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
        <div className="text-[0.6rem] font-bold uppercase mb-2" style={{ color: "var(--color-text-muted)" }}>Select Period</div>
        <div className="flex items-stretch overflow-hidden rounded-md" style={{ border: "1px solid var(--color-border)", height: "38px" }}>
          <button type="button" disabled={!previousPeriod} onClick={() => setSelectedPeriod(previousPeriod)}
            className="w-10 flex items-center justify-center transition-all"
            style={{ background: "var(--color-surface-alt)", color: "#0c324a", opacity: previousPeriod ? 1 : 0.35, cursor: previousPeriod ? "pointer" : "not-allowed", borderRight: "1px solid var(--color-border)" }}
            title={previousPeriod ? `Previous period: ${previousPeriod}` : "First available period"}>
            <ChevronLeft size={16} />
          </button>
          <div className="flex-1 flex flex-col items-center justify-center" style={{ background: "#0c324a", color: "white" }}>
            <span className="text-sm font-bold leading-tight">{selectedPeriod}</span>
            <span className="text-[0.5rem] leading-tight" style={{ opacity: 0.75 }}>Financial year · {selectedPeriodIndex + 1} of {FINANCIAL_PERIODS.length}</span>
          </div>
          <button type="button" disabled={!nextPeriod} onClick={() => setSelectedPeriod(nextPeriod)}
            className="w-10 flex items-center justify-center transition-all"
            style={{ background: "var(--color-surface-alt)", color: "#0c324a", opacity: nextPeriod ? 1 : 0.35, cursor: nextPeriod ? "pointer" : "not-allowed", borderLeft: "1px solid var(--color-border)" }}
            title={nextPeriod ? `Next period: ${nextPeriod}` : "Last available period"}>
            <ChevronRight size={16} />
          </button>
        </div>
        <button onClick={() => setAppliedPeriod(selectedPeriod)}
          className="mt-2 w-full px-3 py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
          style={{ background: "#0c324a", color: "white" }}>
          <Play size={11} fill="currentColor" /> Run {selectedPeriod}
        </button>
        <div className="mt-2 text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>
          Showing visits for {appliedPeriod} ({currentVisits.length} visits)
        </div>
      </div>

      {/* Body — visit results only */}
      <div className="overflow-y-auto p-3 flex-1">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold" style={{ color: "var(--color-text-base)" }}>
              {currentVisits.length} Visit{currentVisits.length !== 1 ? 's' : ''} Found
            </div>
            <button className="text-[0.7rem] font-normal flex items-center gap-1 px-2 rounded"
              style={{ background: "var(--color-surface-alt)", height: "26px", boxSizing: "border-box" }}>
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
