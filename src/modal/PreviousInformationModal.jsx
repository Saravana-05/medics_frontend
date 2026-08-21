import { useEffect, useState } from "react";
import {
  ChevronDown, ChevronUp, Eye, Pencil, X,
} from "lucide-react";
import labTestDetails from "../data/labTestDetails.json";
import serviceFiles from "../data/serviceFiles.json";
import { CARE_PLAN_VIEW_DATA } from "../pages/OPDeskScreen/mockData";
import PrescriptionTabs from "../pages/OPDeskScreen/PrescriptionTabs";
import { formatTimeWithPeriod } from "../utils/formatTimeWithPeriod";

const dosageSchedule = (period, intake) => {
  const schedules = {
    OD: [intake, "", "", ""], BD: [intake, "", "", intake],
    TDS: [intake, intake, "", intake], QID: [intake, intake, intake, intake],
    HS: ["", "", "", intake],
  };
  return schedules[period] || [intake, "", "", ""];
};

const buyQuantity = drug => {
  const doses = { OD: 1, BD: 2, TDS: 3, QID: 4, HS: 1 };
  return Math.ceil((Number(drug.days) || 1) * (doses[drug.period] || 1) * (Number(drug.intake) || 1));
};

const dateOnly = value => String(value || "—").trim().split(/\s+/)[0];
const timeOnly = value => formatTimeWithPeriod(String(value || "").trim().split(/\s+/).slice(1).join(" ") || "11:00").replace(/\s+PM$/i, "");

function InfoPair({ label, value }) {
  return <div className="grid grid-cols-[84px_10px_minmax(0,1fr)] gap-1.5 whitespace-nowrap"><b>{label}</b><b>:</b><span className="whitespace-nowrap">{value || "—"}</span></div>;
}

function Vital({ value, label, color }) {
  return (
    <div className="flex min-h-[31px] items-center justify-center gap-2 rounded-full border px-3 py-1.5" style={{ color, borderColor: `${color}55`, background: `${color}12` }}>
      <b className="text-[14px]">{value}</b><span className="text-[12px] font-medium">{label}</span>
    </div>
  );
}

function EmptyTabFooter({ background }) {
  return <div className="h-12 shrink-0 border-t border-slate-300" style={{ background }} aria-hidden="true" />;
}

function Drugs({ rows, onChange }) {
  const [drugRows, setDrugRows] = useState(rows || []);
  const [viewedDrug, setViewedDrug] = useState(null);
  useEffect(() => setDrugRows(rows || []), [rows]);

  const editDrug = (drug, index) => {
    const name = window.prompt("Drug name", drug.name);
    if (name === null) return;
    const days = window.prompt("Number of days", drug.days);
    if (days === null) return;
    setDrugRows(current => {
      const updated = current.map((item, itemIndex) => itemIndex === index
        ? { ...item, name: name.trim() || item.name, days: days.trim() || item.days }
        : item);
      onChange?.(updated);
      return updated;
    });
  };

  const removeDrug = (drug, index) => {
    if (window.confirm(`Remove ${drug.name} from this prescription?`)) {
      setDrugRows(current => {
        const updated = current.filter((_, itemIndex) => itemIndex !== index);
        onChange?.(updated);
        return updated;
      });
    }
  };

  const fillerCount = Math.max(0, 10 - drugRows.length);
  return (
    <>
    <table className="w-full table-fixed border-collapse text-[12px]">
      <thead><tr className="h-9 border-b border-slate-300 bg-[var(--color-services)] text-white">
        <th className="w-[6%] px-2 py-2 text-center">No</th><th className="w-[44%] px-2 py-2 text-center">Drug</th>
        <th className="w-[8%] text-center">Buy</th><th className="w-[7%] text-center">M</th><th className="w-[7%] text-center">N</th>
        <th className="w-[7%] text-center">E</th><th className="w-[7%] text-center">N</th><th className="w-[14%] text-center">Actions</th>
      </tr></thead>
      <tbody className="text-[11.5px]">{drugRows.map((drug, index) => {
        const schedule = dosageSchedule(drug.period, drug.intake);
        return <tr key={`${drug.name}-${index}`} className="h-10 border-b border-slate-200">
          <td className="text-center font-semibold text-sky-700">{index + 1}</td>
          <td className="px-2"><b>{drug.name}</b><div className="text-[11.5px]">({drug.days} Days, {drug.period}, {drug.when})</div></td>
          <td className="text-center font-bold text-slate-700">{buyQuantity(drug)}</td>
          {schedule.map((dose, doseIndex) => <td key={doseIndex} className="text-center">{dose}</td>)}
          <td className="text-center"><span className="inline-flex items-center justify-center gap-1"><button type="button" onClick={() => editDrug(drug, index)} className="p-1 text-[var(--color-primary)]" title={`Edit ${drug.name}`}><Pencil size={13} /></button><button type="button" onClick={() => setViewedDrug(drug)} className="p-1 text-[var(--color-info)]" title={`View ${drug.name}`}><Eye size={13} /></button><button type="button" onClick={() => removeDrug(drug, index)} className="p-1 text-[var(--color-danger)]" title={`Close ${drug.name}`}><X size={13} /></button></span></td>
        </tr>;
      })}
      {Array.from({ length: fillerCount }, (_, index) => <tr key={`drug-empty-${index}`} className="h-10 border-b border-slate-200"><td colSpan={8}>&nbsp;</td></tr>)}
      </tbody>
    </table>
    {viewedDrug && (
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4" onMouseDown={() => setViewedDrug(null)}>
        <div className="w-[min(92vw,420px)] bg-white shadow-2xl" onMouseDown={event => event.stopPropagation()}>
          <div className="flex items-center justify-between bg-[var(--color-primary-dark)] px-4 py-3 text-white"><b className="text-sm">Drug Details</b><button type="button" onClick={() => setViewedDrug(null)} className="p-1" title="Close drug details"><X size={15} /></button></div>
          <div className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 p-4 text-sm"><b>Drug</b><span>{viewedDrug.name}</span><b>Form</b><span>{viewedDrug.form || "—"}</span><b>Days</b><span>{viewedDrug.days || "—"}</span><b>Dosage</b><span>{viewedDrug.period || "—"}</span><b>Intake</b><span>{viewedDrug.intake || "—"}</span><b>When</b><span>{viewedDrug.when || "—"}</span><b>Buy Quantity</b><span>{buyQuantity(viewedDrug)}</span></div>
          <div className="flex justify-end border-t border-slate-200 px-4 py-3"><button type="button" onClick={() => setViewedDrug(null)} className="bg-[var(--color-primary)] px-4 py-1.5 text-xs font-semibold text-white">Close</button></div>
        </div>
      </div>
    )}
    </>
  );
}

function DrugTabLayout({ rows, onChange }) {
  return (
    <div className="h-full w-full bg-slate-100 px-1 pb-1">
      <div className="flex h-full min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="min-h-0 flex-1 overflow-auto">
          <Drugs rows={rows} onChange={onChange} />
        </div>
        <EmptyTabFooter background="var(--color-services-light)" />
      </div>
    </div>
  );
}

function LabTestTabLayout({ rows }) {
  const tests = rows || [];
  const fillerCount = Math.max(0, 10 - tests.length);
  const reportRows = tests.map(test => ({ ...labTestDetails[test.name], ...test }));

  return (
    <div className="grid h-full min-w-[850px] grid-cols-[minmax(0,56fr)_minmax(0,44fr)] gap-[2px] bg-slate-100 px-1 pb-1">
      <div className="flex min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="grid h-9 shrink-0 grid-cols-[52px_minmax(0,1fr)] items-center border-b border-slate-300 bg-[#d67d7d] text-center text-[11px] font-bold text-slate-900">
          <span>No.</span><span>Test Name</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {tests.map((test, index) => <div key={`${test.name}-${index}`} className="grid h-[45px] grid-cols-[52px_minmax(0,1fr)] items-center border-b border-slate-200 text-[11.5px] odd:bg-white even:bg-slate-50"><span className="text-center">{index + 1}</span><span className="min-w-0 px-3" title={test.name}><b className="block truncate">{test.name}</b>{test.detail && <small className="mt-0.5 block truncate text-[10px]">{test.detail}</small>}</span></div>)}
          {Array.from({ length: fillerCount }, (_, index) => <div key={`lab-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
        </div>
        <EmptyTabFooter background="#f8e5e5" />
      </div>

      <div className="flex min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="grid h-9 shrink-0 grid-cols-[36px_80px_58px_minmax(120px,1fr)_82px] items-center border-b border-slate-300 bg-[#d67d7d] text-center text-[10px] font-bold leading-tight text-slate-900">
          <span>No.</span><span>Observed Value</span><span>Unit</span><span>Biological Reference - Interval</span><span>Specimen</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {reportRows.map((test, index) => <div key={`${test.name}-report-${index}`} className="grid h-[45px] grid-cols-[36px_80px_58px_minmax(120px,1fr)_82px] items-center border-b border-slate-200 text-center text-[11.5px] odd:bg-white even:bg-slate-50"><span>{index + 1}</span><span className="truncate px-1">{test.observedValue || "—"}</span><span className="truncate px-1 font-semibold">{test.unit || "—"}</span><span className="truncate px-1" title={test.bioRef}>{test.bioRef || "—"}</span><span className="truncate px-1 font-semibold" title={test.specimen}>{test.specimen || "—"}</span></div>)}
          {Array.from({ length: fillerCount }, (_, index) => <div key={`report-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
        </div>
        <EmptyTabFooter background="#f8e5e5" />
      </div>
    </div>
  );
}

function ServiceTabLayout({ rows, files = serviceFiles, onFilesChange }) {
  const [services, setServices] = useState(rows || []);
  const [reportFiles, setReportFiles] = useState(files || serviceFiles);
  useEffect(() => setServices(rows || []), [rows]);
  useEffect(() => setReportFiles(files || serviceFiles), [files]);

  const editReportFile = (file, index) => {
    const fileName = window.prompt("Report / finding name", file.fileName);
    if (fileName === null) return;
    const dtTime = window.prompt("Report date and time", file.dtTime || "");
    if (dtTime === null) return;
    setReportFiles(current => {
      const updated = current.map((item, itemIndex) => itemIndex === index
        ? { ...item, fileName: fileName.trim() || item.fileName, dtTime: dtTime.trim() || item.dtTime }
        : item);
      onFilesChange?.(updated);
      return updated;
    });
  };

  const leftFillerCount = Math.max(0, 10 - services.length);
  const rightFillerCount = Math.max(0, 10 - reportFiles.length);

  return (
    <div className="grid h-full min-w-[850px] grid-cols-[minmax(0,56fr)_minmax(0,44fr)] gap-[2px] bg-slate-100 px-1 pb-1">
      <div className="flex min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="grid h-9 shrink-0 grid-cols-[52px_minmax(0,1fr)] items-center border-b border-slate-300 bg-[#a9cb77] text-center text-[11px] font-bold text-slate-900">
          <span>No.</span><span>Service Name</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {services.map((service, index) => <div key={`${service.name}-${index}`} className="grid h-10 grid-cols-[52px_minmax(0,1fr)] items-center border-b border-slate-200 text-[11.5px] odd:bg-white even:bg-slate-50"><span className="text-center">{index + 1}</span><span className="truncate px-3" title={service.detail || service.name}>{service.name}</span></div>)}
          {Array.from({ length: leftFillerCount }, (_, index) => <div key={`service-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
        </div>
        <EmptyTabFooter background="#eef5e3" />
      </div>

      <div className="flex min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="grid h-9 shrink-0 grid-cols-[32px_minmax(90px,1fr)_42px_48px_102px_70px] items-center border-b border-slate-300 bg-[#a9cb77] text-center text-[10px] font-bold text-slate-900">
          <span>No.</span><span>File Name</span><span>Type</span><span>Size</span><span>Dt-Time</span><span>Actions</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {reportFiles.map((file, index) => <div key={file.id || index} className="grid h-10 grid-cols-[32px_minmax(90px,1fr)_42px_48px_102px_70px] items-center border-b border-slate-200 text-center text-[11.5px] odd:bg-white even:bg-slate-50"><span>{index + 1}</span><span className="truncate px-1 text-left" title={file.fileName}>{file.fileName}</span><span>{file.type}</span><span>{file.size}</span><span className="whitespace-nowrap text-[10.5px]">{file.dtTime}</span><span className="flex justify-center gap-1"><button type="button" onClick={() => editReportFile(file, index)} className="p-1 text-[var(--color-primary)]" title={`Edit ${file.fileName}`}><Pencil size={12} /></button><button type="button" onClick={() => window.alert(`${file.fileName}\nType: ${file.type || "—"}\nSize: ${file.size || "—"}\nDate-Time: ${file.dtTime || "—"}`)} className="p-1 text-[var(--color-services)]" title={`View ${file.fileName}`}><Eye size={12} /></button></span></div>)}
          {Array.from({ length: rightFillerCount }, (_, index) => <div key={`file-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
        </div>
        <EmptyTabFooter background="#eef5e3" />
      </div>
    </div>
  );
}

function CarePlanTabLayout({ rows }) {
  const activities = rows?.length ? rows : CARE_PLAN_VIEW_DATA;
  const fillerCount = Math.max(0, 10 - activities.length);
  const carePlanColumns = "42px 120px 100px 80px 110px 90px minmax(180px,1fr) 95px";
  return (
    <div className="h-full w-full bg-slate-100 px-1 pb-1">
      <div className="flex h-full min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="grid h-9 shrink-0 items-center border-b border-slate-300 bg-[var(--color-primary)] text-center text-[10px] font-bold leading-tight text-white" style={{ gridTemplateColumns: carePlanColumns }}><span>No.</span><span>Medical Condition</span><span>Schedule Date</span><span>Milestone</span><span>Pathway Name</span><span>Activity Type</span><span>Activity Description</span><span>Schedule Status</span></div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {activities.map((item, index) => <div key={item.id || index} className="grid h-10 items-center border-b border-slate-200 text-[11px] odd:bg-white even:bg-slate-50" style={{ gridTemplateColumns: carePlanColumns }}><span className="text-center">{index + 1}</span><span className="truncate px-2" title={item.name}>{item.name || "—"}</span><span className="text-center">{item.schDate || "—"}</span><span className="text-center">{item.milestone || "—"}</span><span className="truncate px-2" title={item.pathwayName}>{item.pathwayName || "—"}</span><span className="truncate px-2 text-center" title={item.activityType}>{item.activityType || "—"}</span><span className="truncate px-2" title={item.activityDescription}>{item.activityDescription || "—"}</span><span className="truncate px-2 text-center" title={item.schStatus}>{item.schStatus || "—"}</span></div>)}
          {Array.from({ length: fillerCount }, (_, index) => <div key={`care-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
        </div>
        <EmptyTabFooter background="var(--color-primary-muted)" />
      </div>
    </div>
  );
}

function IpTimelineTabLayout({ rows }) {
  const entries = rows || [];
  const fillerCount = Math.max(0, 10 - entries.length);
  const subjectFor = item => item.display?.primaryLine || item.name || item.subject || "—";
  const timelineColumns = "42px 130px 100px 110px 200px minmax(180px,1fr) 90px";
  return (
    <div className="h-full w-full bg-slate-100 px-1 pb-1">
      <div className="flex h-full min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="grid h-9 shrink-0 items-center border-b border-slate-300 bg-[#f0a866] text-center text-[10px] font-bold text-slate-900" style={{ gridTemplateColumns: timelineColumns }}><span>No.</span><span>Medic</span><span>Time</span><span>Entry Type</span><span>Subject</span><span>Notes</span><span>Actions</span></div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {entries.map((item, index) => <div key={item.id || index} className="grid h-10 items-center border-b border-slate-200 text-[11.5px] odd:bg-white even:bg-slate-50" style={{ gridTemplateColumns: timelineColumns }}><span className="text-center">{index + 1}</span><span className="truncate px-2">{item.medic || "—"}</span><span className="text-center">{item.time || "—"}</span><span className="truncate px-2 text-center">{item.entryType || "—"}</span><span className="truncate px-2">{subjectFor(item)}</span><span className="truncate px-2">{item.notes || "—"}</span><span className="flex justify-center"><button type="button" className="p-1 text-[#9a4e16]" title={`View ${subjectFor(item)}`}><Eye size={13} /></button></span></div>)}
          {Array.from({ length: fillerCount }, (_, index) => <div key={`ip-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
        </div>
        <EmptyTabFooter background="#fff1e1" />
      </div>
    </div>
  );
}

const tabForDocument = (documentName) => {
  const moduleName = String(documentName || "").toUpperCase();
  if (moduleName.includes("-DP")) return "drugs";
  if (moduleName.includes("-LP")) return "lab";
  if (moduleName.includes("-SP")) return "services";
  if (moduleName.includes("-CP")) return "carePlan";
  return null;
};

export default function PreviousInformationModal({ visit, patient = null, prescriptions = {}, onClose, onNavigate, onUpdatePrescription, currentIndex = 0, navigationVisits = [] }) {
  const [activeTab, setActiveTab] = useState("drugs");
  const [navigationTab, setNavigationTab] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const documentTab = tabForDocument(visit?.docModule || visit?.docNo);
    if (documentTab) setActiveTab(documentTab);
  }, [visit]);

  if (!visit) return null;

  const vitalParts = String(visit.vitals || "").split("/");
  const bloodPressureParts = String(vitalParts[2] || "").split(":");
  const historicalVitals = {
    bp: visit.bpSystolic && visit.bpDiastolic ? `${visit.bpSystolic}/${visit.bpDiastolic}` : bloodPressureParts[0] && bloodPressureParts[1] ? `${bloodPressureParts[0]}/${bloodPressureParts[1]}` : "—",
    temp: visit.temp || vitalParts[3] || "—",
    pulse: visit.pulse || bloodPressureParts[2] || "—",
    spo2: visit.oxygenLevel || visit.spo2 || patient?.oxygenLevel || "—",
    blood: visit.bloodGroup || patient?.bloodGroup || "—",
    height: visit.height || patient?.height || "—",
    weight: visit.weight || vitalParts[0] || patient?.weight || "—",
    bmi: visit.bmi || vitalParts[1] || patient?.bmi || "—",
  };
  const copy = async () => {
    await navigator.clipboard.writeText(`Previous Information\n${visit.entryDt || ""}\n${visit.complaint || ""}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  const patientName = visit.patientName || patient?.name || visit.name || "—";
  const patientDemographics = visit.demographics || [patient?.gender, patient?.dob, patient?.age ? `${patient.age}y` : ""].filter(Boolean).join(" * ") || "—";
  const hasRightPanel = ["lab", "services"].includes(activeTab);
  const activeDocumentLabel = {
    drugs: "Drug",
    lab: "Lab-Test",
    services: "Service",
    carePlan: "Care-Plan",
    iptime: "IP Timeline",
  }[activeTab];
  const tabVisits = navigationVisits
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !navigationTab || tabForDocument(item.docModule || item.docNo) === navigationTab);
  const tabPosition = tabVisits.findIndex(({ index }) => index === currentIndex);
  const navigateWithinTab = (direction) => {
    if (!tabVisits.length) return;
    const nextPosition = tabPosition < 0
      ? (direction === "up" ? 0 : tabVisits.length - 1)
      : tabPosition + (direction === "up" ? 1 : -1);
    const target = tabVisits[nextPosition];
    if (target) onNavigate?.(target.index);
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setNavigationTab(tab);
    const matchingVisits = navigationVisits
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => tabForDocument(item.docModule || item.docNo) === tab);
    if (matchingVisits.length && !matchingVisits.some(({ index }) => index === currentIndex)) {
      const nearest = matchingVisits.reduce((best, candidate) => (
        Math.abs(candidate.index - currentIndex) < Math.abs(best.index - currentIndex) ? candidate : best
      ));
      onNavigate?.(nearest.index);
    }
  };
  const shownPosition = tabPosition >= 0 ? tabPosition + 1 : 0;
  const canNavigateUp = tabPosition < 0 ? tabVisits.length > 0 : tabPosition < tabVisits.length - 1;
  const canNavigateDown = tabPosition < 0 ? tabVisits.length > 0 : tabPosition > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-8" onMouseDown={onClose}>
      <div className="flex h-[90vh] w-[min(96vw,1051px)] flex-col overflow-hidden bg-white shadow-2xl" onMouseDown={event => event.stopPropagation()}>
        <header className="grid h-[54px] shrink-0 grid-cols-[1fr_auto_1fr] items-center px-5 text-white" style={{ background: "linear-gradient(135deg, var(--color-primary-dark) 0%, #063a59 100%)" }}>
          <h2 className="whitespace-nowrap text-[16px] font-semibold">Previous Information</h2>
          <div className="flex items-center gap-3 whitespace-nowrap text-[12.5px]">
            <button
              type="button"
              onClick={() => setNavigationTab(null)}
              className={`rounded px-2 py-1 font-semibold transition-colors ${navigationTab ? "hover:bg-white/15" : "bg-white/25"}`}
              title="Show and navigate all records"
            >
              All
            </button>
            {navigationTab && <span className="rounded bg-white/25 px-2 py-1 font-semibold">{activeDocumentLabel}</span>}
            <div className="flex flex-col">
              <button onClick={() => navigateWithinTab("up")} disabled={!canNavigateUp}><ChevronUp size={13} /></button>
              <button onClick={() => navigateWithinTab("down")} disabled={!canNavigateDown}><ChevronDown size={13} /></button>
            </div>
            <span className="opacity-80">{shownPosition} / {tabVisits.length}</span>
          </div>
          <div className="flex items-center justify-self-end">
            <div className="mr-5 flex items-center overflow-hidden text-[12px] font-semibold">
              <button onClick={() => window.print()} className="h-7 px-3 text-white" style={{ background: "#8eb6ca" }}>Preview</button>
              <button onClick={copy} className="h-7 px-3 text-white" style={{ background: "#679cbc" }}>{copied ? "Copied" : "Copy"}</button>
              <button onClick={() => window.print()} className="h-7 px-3 text-white" style={{ background: "#527d96" }}>Print</button>
            </div>
            <button onClick={onClose} className="px-3 py-1.5 text-[13px] font-semibold hover:bg-white/10">Close</button>
          </div>
        </header>

        <section className="grid shrink-0 grid-cols-[1.25fr_0.9fr_1fr_170px] border-b border-slate-300 bg-[#f6f9fd] text-[12.5px]">
          <div className="space-y-1.5 px-5 py-3">
            <InfoPair label="First Visit" value={dateOnly(visit.firstVisit || visit.entryDt)} />
            <InfoPair label="Data From" value={visit.dataFrom || "2024-25"} />
            <InfoPair label="Data To" value={visit.dataTo || "2025-26"} />
            <InfoPair label="Period" value={visit.period || "870/1592 Days"} />
          </div>
          <div className="space-y-1.5 px-5 py-3">
            <InfoPair label="Doc. No" value={visit.docNo || visit.docModule || "3905: OP-OP"} />
            <InfoPair label="Doc. Dt." value={`${dateOnly(visit.entryDt)}   ${timeOnly(visit.entryDt)}`} />
            <InfoPair label="Report Dt." value={visit.reportDt || "Nil"} />
            <InfoPair label="Next Visit" value={visit.nextVisit || "—"} />
          </div>
          <div className="border-l border-slate-200 px-3 py-3 text-right">
            <b className="text-[15px]">{patientName}</b><div className="mt-1.5 text-[12px] text-slate-400">{patientDemographics}</div><div className="mt-5 text-[12.5px]">{visit.by || patient?.doctor || "—"}</div>
          </div>
          <div className="m-2 h-[104px] self-start overflow-hidden bg-white" aria-label="Patient photo">{patient?.photo && <img src={patient.photo} alt={patientName} className="h-full w-full object-cover" />}</div>
          <div className="col-span-4 grid min-h-[76px] grid-cols-[1.5fr_2.2fr] border-t border-slate-300">
            <div className="grid grid-cols-4 items-center gap-2 px-3 py-3">
              <Vital value={historicalVitals.bp} label="BP" color="#db6b75" />
              <Vital value={historicalVitals.temp} label="Temp" color="#e58b45" />
              <Vital value={historicalVitals.pulse} label="Pulse" color="#766ac8" />
              <Vital value={historicalVitals.spo2} label="SpO₂" color="#36a8b8" />
              <Vital value={historicalVitals.blood} label="Blood" color="#dc262f" />
              <Vital value={historicalVitals.height} label="Height" color="#8b5cf6" />
              <Vital value={historicalVitals.weight} label="Weight" color="#14b8a6" />
              <Vital value={historicalVitals.bmi} label="BMI" color="#22c55e" />
            </div>
            <div className="grid grid-rows-2 gap-2 border-l border-slate-200 px-5 py-3 text-[14px]"><div className="flex min-h-[31px] items-center"><b className="mr-3 shrink-0 text-slate-500">Chief Complaint:</b><span>{visit.complaint || patient?.chiefComplaint || "—"}</span></div><div className="flex min-h-[31px] items-center"><b className="mr-3 shrink-0 text-slate-500">First Observation:</b><span>{visit.observation || patient?.firstObservation || "—"}</span></div></div>
          </div>
        </section>

        <nav className={`mt-[2px] grid h-[50px] shrink-0 ${hasRightPanel ? "grid-cols-[minmax(0,56fr)_minmax(0,44fr)] gap-[2px] bg-slate-100" : "grid-cols-1 bg-white"}`}>
          <div className="flex h-[50px] min-w-0 overflow-hidden border border-slate-300 bg-white pl-2">
            <PrescriptionTabs activeTab={activeTab} setActiveTab={handleTabChange} compact fullBorder />
          </div>
          {activeTab === "lab" && <div className="flex items-center justify-start border border-slate-300 bg-[var(--color-lab-light)] px-3 text-left text-[12.5px] font-bold text-[var(--color-lab)]">Test Report</div>}
          {activeTab === "services" && <div className="flex items-center justify-start border border-slate-300 bg-[#eef5e3] px-3 text-left text-[12.5px] font-bold text-[#a9cb77]">Service Reports &amp; Findings</div>}
        </nav>
        <main className="min-h-0 flex-1 overflow-auto" style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 44px, #d5dde2 44px, #d5dde2 45px)" }}>
          {activeTab === "drugs" && <DrugTabLayout rows={prescriptions.drugs} onChange={drugs => onUpdatePrescription?.({ drugs })} />}
          {activeTab === "lab" && <LabTestTabLayout rows={prescriptions.labs} />}
          {activeTab === "services" && <ServiceTabLayout rows={prescriptions.services} files={prescriptions.serviceFiles} onFilesChange={serviceFiles => onUpdatePrescription?.({ serviceFiles })} />}
          {activeTab === "carePlan" && <CarePlanTabLayout rows={prescriptions.carePlanItems} />}
          {activeTab === "iptime" && <IpTimelineTabLayout rows={prescriptions.ipEntries || prescriptions.timeline} />}
        </main>
      </div>
    </div>
  );
}
