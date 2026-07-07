import { useState } from "react";
import { FileText, Calendar } from "lucide-react";

const MOCK_REPORTS = [
  { patientName: "Raveendran. K", report: "Complete Blood Count", type: "Lab", status: "Pending", date: "03/03/2024" },
  { patientName: "Nandhini. A", report: "Lipid Profile", type: "Lab", status: "Pending", date: "03/03/2024" },
  { patientName: "Anjali (Baby). L", report: "Liver Function Test", type: "Lab", status: "Ready", date: "02/03/2024" },
  { patientName: "Vignesh (Infant). R", report: "X-Ray Chest", type: "Service", status: "Ready", date: "02/03/2024" },
  { patientName: "Ramakrishnan. K.R", report: "ECG", type: "Service", status: "Ready", date: "01/03/2024" },
];

function ReportsPanel({ panelHeight }) {
  const headerH = 50;
  const [selectedDate, setSelectedDate] = useState("");
  const [filteredReports, setFilteredReports] = useState(MOCK_REPORTS);

  const handleDateFilter = (date) => {
    setSelectedDate(date);
    if (date) {
      setFilteredReports(MOCK_REPORTS.filter(r => r.date === date));
    } else {
      setFilteredReports(MOCK_REPORTS);
    }
  };

  const getTypeBadgeStyle = (type) => {
    if (type === "Lab") {
      return { bg: "var(--color-lab-light)", color: "var(--color-lab)" };
    }
    return { bg: "var(--color-services-light)", color: "var(--color-services)" };
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-xl"
      style={{ background: "var(--color-surface)", width: "100%", height: panelHeight }}>
      <div className="px-3 py-2 border-b flex items-center justify-between"
        style={{ background: "#679cbc", borderColor: "var(--color-border)", height: headerH }}>
        <div className="flex items-center gap-2">
          {/* <FileText size={16} style={{ color: "var(--color-primary)" }} /> */}
          <span className="text-md font-bold text-white" >Patient Reports</span>
        </div>

      </div>
      <div
        className="px-3 py-2 flex justify-end"
        style={{ borderBottom: "1px solid #e5e7eb", boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
      >
        <div className="relative">
          <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-muted)" }} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateFilter(e.target.value)}
            className="pl-9 pr-3 text-sm rounded-lg border"
            style={{ height: 40, borderColor: "var(--color-border)", background: "var(--color-surface)" }}
            placeholder="Filter by date"
          />
        </div>
      </div>
      <div className="p-3 space-y-2 overflow-y-auto" style={{ height: panelHeight - headerH }}>
        {filteredReports.length === 0 ? (
          <div className="text-center py-4 text-xs" style={{ color: "var(--color-text-muted)" }}>No reports found</div>
        ) : (
          filteredReports.map((item, i) => {
            const badgeStyle = getTypeBadgeStyle(item.type);
            return (
              <div key={i} className="flex justify-between items-center p-2 rounded-lg border"
                style={{ borderColor: "var(--color-border)" }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{item.patientName}</span>
                    <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: badgeStyle.bg, color: badgeStyle.color }}>
                      {item.type}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>{item.report}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: item.status === "Pending" ? "var(--color-lab-light)" : "var(--color-drugs-light)", color: item.status === "Pending" ? "var(--color-lab)" : "var(--color-drugs)" }}>
                  {item.status}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ReportsPanel;