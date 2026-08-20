import { useState } from "react";
import {
  ActivitySquare, ChevronDown, ChevronUp, Eye,
  Calculator, Droplet, Heart, Ruler, Thermometer, Weight, Wind,
} from "lucide-react";
import drugGroups from "../data/drugGroups.json";
import labTestDetails from "../data/labTestDetails.json";
import serviceFiles from "../data/serviceFiles.json";
import carePlanTemplates from "../data/carePlanTemplates.json";
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
  return <div className="grid grid-cols-[72px_10px_1fr] gap-1"><b>{label}</b><b>:</b><span>{value || "—"}</span></div>;
}

function Vital({ icon: Icon, value, label, color }) {
  return (
    <div className="flex items-center gap-1 rounded-full border px-2 py-0.5" style={{ color, borderColor: `${color}55`, background: `${color}12` }}>
      <Icon size={10} /><b>{value}</b><span className="text-[9px]">{label}</span>
    </div>
  );
}

function Drugs({ rows }) {
  const drugRows = rows || [];
  const fillerCount = Math.max(0, 10 - drugRows.length);
  return (
    <table className="w-full table-fixed border-collapse text-[12px]">
      <thead><tr className="h-9 border-b border-slate-300 bg-[#e8f4fc]">
        <th className="w-10 px-2 py-2 text-center">No</th><th className="px-2 py-2 text-center">Drug</th>
        <th className="w-12 text-center">Buy</th><th className="w-9 text-center">M</th><th className="w-9 text-center">N</th>
        <th className="w-9 text-center">E</th><th className="w-9 text-center">N</th>
      </tr></thead>
      <tbody className="text-[11.5px]">{drugRows.map((drug, index) => {
        const schedule = dosageSchedule(drug.period, drug.intake);
        return <tr key={`${drug.name}-${index}`} className="h-10 border-b border-slate-200">
          <td className="text-center font-semibold text-sky-700">{index + 1}</td>
          <td className="px-2"><b>{drug.name}</b><div className="text-[11.5px]">({drug.days} Days, {drug.period}, {drug.when})</div></td>
          <td className="text-center font-bold text-slate-700">{buyQuantity(drug)}</td>
          {schedule.map((dose, doseIndex) => <td key={doseIndex} className="text-center">{dose}</td>)}
        </tr>;
      })}
      {Array.from({ length: fillerCount }, (_, index) => <tr key={`drug-empty-${index}`} className="h-10 border-b border-slate-200"><td colSpan={7}>&nbsp;</td></tr>)}
      </tbody>
    </table>
  );
}

function DrugGroupPrescription() {
  const fillerCount = Math.max(0, 10 - drugGroups.length);
  return (
    <div className="flex h-full min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
      <div className="grid h-9 shrink-0 grid-cols-[42px_minmax(0,1fr)_52px_52px] items-center border-b border-slate-300 bg-[var(--color-primary-muted)] text-center text-[11px] font-bold text-[var(--color-primary-dark)]">
        <span>No.</span><span>Prescription Title</span><span>Days</span><span>Drugs</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {drugGroups.map((group, index) => (
          <div key={group.id} className="grid h-10 grid-cols-[42px_minmax(0,1fr)_52px_52px] items-center border-b border-slate-200 text-[11.5px] odd:bg-white even:bg-slate-50">
            <span className="text-center">{index + 1}</span>
            <span className="truncate px-2" title={group.title}>{group.title}</span>
            <span className="text-center">{group.days}</span>
            <span className="text-center">{group.medicines?.length || 0}</span>
          </div>
        ))}
        {Array.from({ length: fillerCount }, (_, index) => <div key={`group-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
      </div>
    </div>
  );
}

function DrugTabLayout({ rows }) {
  return (
    <div className="grid h-full min-w-[850px] grid-cols-[minmax(0,58fr)_minmax(0,42fr)] gap-2 bg-slate-100 px-1 pb-1">
      <div className="flex min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="min-h-0 flex-1 overflow-auto">
          <Drugs rows={rows} />
        </div>
      </div>
      <DrugGroupPrescription />
    </div>
  );
}

function LabTestTabLayout({ rows }) {
  const tests = rows || [];
  const fillerCount = Math.max(0, 10 - tests.length);
  const reportRows = tests.map(test => ({ ...labTestDetails[test.name], ...test }));

  return (
    <div className="grid h-full min-w-[850px] grid-cols-[minmax(0,58fr)_minmax(0,42fr)] gap-2 bg-slate-100 px-1 pb-1">
      <div className="flex min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="grid h-9 shrink-0 grid-cols-[52px_minmax(0,1fr)] items-center border-b border-slate-300 bg-[var(--color-lab-light)] text-center text-[11px] font-bold text-slate-900">
          <span>No.</span><span>Test Name</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {tests.map((test, index) => <div key={`${test.name}-${index}`} className="grid h-10 grid-cols-[52px_minmax(0,1fr)] items-center border-b border-slate-200 text-[11.5px] odd:bg-white even:bg-slate-50"><span className="text-center">{index + 1}</span><span className="truncate px-3" title={test.name}>{test.name}</span></div>)}
          {Array.from({ length: fillerCount }, (_, index) => <div key={`lab-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
        </div>
      </div>

      <div className="flex min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="grid h-9 shrink-0 grid-cols-[36px_80px_58px_minmax(120px,1fr)_82px] items-center border-b border-slate-300 bg-[var(--color-lab-light)] text-center text-[10px] font-bold leading-tight text-slate-900">
          <span>No.</span><span>Observed Value</span><span>Unit</span><span>Biological Reference - Interval</span><span>Specimen</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {reportRows.map((test, index) => <div key={`${test.name}-report-${index}`} className="grid h-10 grid-cols-[36px_80px_58px_minmax(120px,1fr)_82px] items-center border-b border-slate-200 text-center text-[11.5px] odd:bg-white even:bg-slate-50"><span>{index + 1}</span><span className="truncate px-1">{test.observedValue || "—"}</span><span className="truncate px-1">{test.unit || "—"}</span><span className="truncate px-1" title={test.bioRef}>{test.bioRef || "—"}</span><span className="truncate px-1" title={test.specimen}>{test.specimen || "—"}</span></div>)}
          {Array.from({ length: fillerCount }, (_, index) => <div key={`report-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
        </div>
      </div>
    </div>
  );
}

function ServiceTabLayout({ rows }) {
  const services = rows || [];
  const leftFillerCount = Math.max(0, 10 - services.length);
  const rightFillerCount = Math.max(0, 10 - serviceFiles.length);

  return (
    <div className="grid h-full min-w-[850px] grid-cols-[minmax(0,58fr)_minmax(0,42fr)] gap-2 bg-slate-100 px-1 pb-1">
      <div className="flex min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="grid h-9 shrink-0 grid-cols-[52px_minmax(0,1fr)] items-center border-b border-slate-300 bg-[var(--color-services-light)] text-center text-[11px] font-bold text-slate-900">
          <span>No.</span><span>Service Name</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {services.map((service, index) => <div key={`${service.name}-${index}`} className="grid h-10 grid-cols-[52px_minmax(0,1fr)] items-center border-b border-slate-200 text-[11.5px] odd:bg-white even:bg-slate-50"><span className="text-center">{index + 1}</span><span className="truncate px-3" title={service.name}>{service.name}</span></div>)}
          {Array.from({ length: leftFillerCount }, (_, index) => <div key={`service-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
        </div>
      </div>

      <div className="flex min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="grid h-9 shrink-0 grid-cols-[32px_minmax(90px,1fr)_42px_48px_102px_54px] items-center border-b border-slate-300 bg-[var(--color-services-light)] text-center text-[10px] font-bold text-slate-900">
          <span>No.</span><span>File Name</span><span>Type</span><span>Size</span><span>Dt-Time</span><span>Actions</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {serviceFiles.map((file, index) => <div key={file.id} className="grid h-10 grid-cols-[32px_minmax(90px,1fr)_42px_48px_102px_54px] items-center border-b border-slate-200 text-center text-[11.5px] odd:bg-white even:bg-slate-50"><span>{index + 1}</span><span className="truncate px-1 text-left" title={file.fileName}>{file.fileName}</span><span>{file.type}</span><span>{file.size}</span><span className="whitespace-nowrap text-[10.5px]">{file.dtTime}</span><span className="flex justify-center"><button type="button" className="p-1 text-[var(--color-services)]" title={`View ${file.fileName}`}><Eye size={12} /></button></span></div>)}
          {Array.from({ length: rightFillerCount }, (_, index) => <div key={`file-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
        </div>
      </div>
    </div>
  );
}

function CarePlanTabLayout({ rows }) {
  const activities = rows?.length ? rows : CARE_PLAN_VIEW_DATA;
  const leftFillerCount = Math.max(0, 10 - activities.length);
  const rightFillerCount = Math.max(0, 10 - carePlanTemplates.length);
  return (
    <div className="grid h-full min-w-[850px] grid-cols-[minmax(0,58fr)_minmax(0,42fr)] gap-2 bg-slate-100 px-1 pb-1">
      <div className="flex min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="grid h-9 shrink-0 grid-cols-[52px_120px_minmax(0,1fr)] items-center border-b border-slate-300 bg-[var(--color-primary-muted)] text-center text-[11px] font-bold text-slate-900"><span>No.</span><span>Milestone</span><span>Pathway Name</span></div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {activities.map((item, index) => <div key={item.id || index} className="grid h-10 grid-cols-[52px_120px_minmax(0,1fr)] items-center border-b border-slate-200 text-[11.5px] odd:bg-white even:bg-slate-50"><span className="text-center">{index + 1}</span><span className="text-center">{item.milestone || "—"}</span><span className="truncate px-3" title={item.pathwayName}>{item.pathwayName || "—"}</span></div>)}
          {Array.from({ length: leftFillerCount }, (_, index) => <div key={`care-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
        </div>
      </div>
      <div className="flex min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="grid h-9 shrink-0 grid-cols-[32px_76px_minmax(115px,1fr)_58px_66px] items-center border-b border-slate-300 bg-[var(--color-primary-muted)] text-center text-[10px] font-bold leading-tight text-slate-900"><span>No.</span><span>Speciality</span><span>Medical Condition</span><span>Milestone</span><span>Period</span></div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {carePlanTemplates.map((item, index) => <div key={item.id} className="grid h-10 grid-cols-[32px_76px_minmax(115px,1fr)_58px_66px] items-center border-b border-slate-200 text-center text-[11.5px] odd:bg-white even:bg-slate-50"><span>{index + 1}</span><span className="truncate px-1" title={item.speciality}>{item.speciality}</span><span className="truncate px-1 text-left" title={item.condition}>{item.condition}</span><span>{item.milestones}</span><span>{item.period}</span></div>)}
          {Array.from({ length: rightFillerCount }, (_, index) => <div key={`template-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
        </div>
      </div>
    </div>
  );
}

function IpTimelineTabLayout({ rows }) {
  const entries = rows || [];
  const fillerCount = Math.max(0, 10 - entries.length);
  const subjectFor = item => item.display?.primaryLine || item.name || item.subject || "—";
  return (
    <div className="grid h-full min-w-[850px] grid-cols-[minmax(0,58fr)_minmax(0,42fr)] gap-2 bg-slate-100 px-1 pb-1">
      <div className="flex min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="grid h-9 shrink-0 grid-cols-[32px_82px_70px_72px_minmax(90px,1fr)_minmax(90px,1fr)] items-center border-b border-slate-300 bg-[#fff1e1] text-center text-[10px] font-bold text-slate-900"><span>No.</span><span>Medic</span><span>Time</span><span>Entry Type</span><span>Subject</span><span>Notes</span></div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {entries.map((item, index) => <div key={item.id || index} className="grid h-10 grid-cols-[32px_82px_70px_72px_minmax(90px,1fr)_minmax(90px,1fr)] items-center border-b border-slate-200 text-[11.5px] odd:bg-white even:bg-slate-50"><span className="text-center">{index + 1}</span><span className="truncate px-1">{item.medic || "—"}</span><span className="text-center">{item.time || "—"}</span><span className="truncate px-1">{item.entryType || "—"}</span><span className="truncate px-1">{subjectFor(item)}</span><span className="truncate px-1">{item.notes || "—"}</span></div>)}
          {Array.from({ length: fillerCount }, (_, index) => <div key={`ip-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
        </div>
      </div>
      <div className="flex min-w-0 flex-col border border-t-0 border-slate-300 bg-white">
        <div className="grid h-9 shrink-0 grid-cols-[36px_70px_minmax(100px,1fr)_minmax(100px,1fr)] items-center border-b border-slate-300 bg-[#fff1e1] text-center text-[10px] font-bold text-slate-900"><span>No.</span><span>Entry</span><span>Subject</span><span>Notes</span></div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {entries.map((item, index) => <div key={`${item.id || index}-mirror`} className="grid h-10 grid-cols-[36px_70px_minmax(100px,1fr)_minmax(100px,1fr)] items-center border-b border-slate-200 text-[11.5px] odd:bg-white even:bg-slate-50"><span className="text-center">{index + 1}</span><span className="truncate px-1">{item.entryType || "—"}</span><span className="truncate px-1">{subjectFor(item)}</span><span className="truncate px-1">{item.notes || "—"}</span></div>)}
          {Array.from({ length: fillerCount }, (_, index) => <div key={`ip-mirror-empty-${index}`} className="h-10 border-b border-slate-200 bg-white" />)}
        </div>
      </div>
    </div>
  );
}

export default function PreviousInformationModal({ visit, patient = null, prescriptions = {}, onClose, onNavigate, currentIndex = 0, totalVisits = 1 }) {
  const [activeTab, setActiveTab] = useState("drugs");
  const [copied, setCopied] = useState(false);
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
  const hasRightPanel = ["drugs", "lab", "services", "carePlan", "iptime"].includes(activeTab);
  const activeDocumentLabel = {
    drugs: "Drug",
    lab: "Lab-Test",
    services: "Service",
    carePlan: "Care-Plan",
    iptime: "IP Timeline",
  }[activeTab];
  const toolbarDocNo = String(visit.docNo || visit.docModule || "—").split(":")[0].trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={onClose}>
      <div className="flex h-[min(94vh,770px)] w-[min(96vw,950px)] flex-col overflow-hidden bg-white shadow-2xl" onMouseDown={event => event.stopPropagation()}>
        <header className="grid h-11 shrink-0 grid-cols-[1fr_auto_1fr] items-center px-4 text-[var(--color-primary-dark)]" style={{ backgroundColor: "var(--color-primary-muted)", backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.035), rgba(0, 0, 0, 0.035))" }}>
          <h2 className="whitespace-nowrap text-[13px] font-semibold">Previous Information</h2>
          <div className="flex items-center gap-2 whitespace-nowrap text-[11px]">
            <span>{toolbarDocNo} / {activeDocumentLabel}</span>
            <div className="flex flex-col">
              <button onClick={() => currentIndex > 0 && onNavigate?.(currentIndex - 1)} disabled={currentIndex === 0}><ChevronUp size={13} /></button>
              <button onClick={() => currentIndex < totalVisits - 1 && onNavigate?.(currentIndex + 1)} disabled={currentIndex >= totalVisits - 1}><ChevronDown size={13} /></button>
            </div>
            <span className="opacity-80">{currentIndex + 1} / {totalVisits}</span>
          </div>
          <div className="flex items-center justify-self-end">
            <div className="mr-4 flex items-center overflow-hidden text-[11px] font-semibold">
              <button onClick={() => window.print()} className="h-7 px-3 text-white" style={{ background: "#8eb6ca" }}>Preview</button>
              <button onClick={copy} className="h-7 px-3 text-white" style={{ background: "#679cbc" }}>{copied ? "Copied" : "Copy"}</button>
              <button onClick={() => window.print()} className="h-7 px-3 text-white" style={{ background: "#527d96" }}>Print</button>
            </div>
            <button onClick={onClose} className="px-2 py-1 text-[12px] font-semibold hover:bg-white/10">Close</button>
          </div>
        </header>

        <section className="grid shrink-0 grid-cols-[1.25fr_0.9fr_1fr_170px] border-b border-slate-300 bg-[#f6f9fd] text-[11px]">
          <div className="space-y-1 px-4 py-2">
            <InfoPair label="First Visit" value={dateOnly(visit.firstVisit || visit.entryDt)} />
            <InfoPair label="Data From" value={visit.dataFrom || "2024-25"} />
            <InfoPair label="Data To" value={visit.dataTo || "2025-26"} />
            <InfoPair label="Period" value={visit.period || "870/1592 Days"} />
          </div>
          <div className="space-y-1 px-4 py-2">
            <InfoPair label="Doc. No" value={visit.docNo || visit.docModule || "3905: OP-OP"} />
            <InfoPair label="Doc. Dt." value={`${dateOnly(visit.entryDt)}   ${timeOnly(visit.entryDt)}`} />
            <InfoPair label="Report Dt." value={visit.reportDt || "Nil"} />
            <InfoPair label="Next Visit" value={visit.nextVisit || "—"} />
          </div>
          <div className="border-l border-slate-200 p-2 text-right">
            <b className="text-[14px]">{patientName}</b><div className="mt-1 text-slate-400">{patientDemographics}</div><div className="mt-5">{visit.by || patient?.doctor || "—"}</div>
          </div>
          <div className="row-span-2 m-2 aspect-square self-start overflow-hidden bg-white" aria-label="Patient photo">{patient?.photo && <img src={patient.photo} alt={patientName} className="h-full w-full object-cover" />}</div>
          <div className="col-span-3 grid grid-cols-[1.25fr_1.9fr] border-t border-slate-300">
            <div className="grid grid-cols-4 items-center gap-1 px-2 py-2">
              <Vital icon={ActivitySquare} value={historicalVitals.bp} label="BP" color="#db6b75" />
              <Vital icon={Thermometer} value={historicalVitals.temp} label="Temp" color="#e58b45" />
              <Vital icon={Heart} value={historicalVitals.pulse} label="Pulse" color="#766ac8" />
              <Vital icon={Wind} value={historicalVitals.spo2} label="SpO₂" color="#36a8b8" />
              <Vital icon={Droplet} value={historicalVitals.blood} label="Blood" color="#dc262f" />
              <Vital icon={Ruler} value={historicalVitals.height} label="Height" color="#8b5cf6" />
              <Vital icon={Weight} value={historicalVitals.weight} label="Weight" color="#14b8a6" />
              <Vital icon={Calculator} value={historicalVitals.bmi} label="BMI" color="#22c55e" />
            </div>
            <div className="space-y-2 border-l border-slate-200 px-4 py-2"><div><b className="mr-3 text-slate-500">Chief Complaint:</b>{visit.complaint || "—"}</div><div><b className="mr-3 text-slate-500">First Observation:</b>{visit.observation || "—"}</div></div>
          </div>
        </section>

        <nav className={`grid h-12 shrink-0 ${hasRightPanel ? "grid-cols-[minmax(0,58fr)_minmax(0,42fr)] gap-2 bg-slate-100 px-1 pt-1" : "grid-cols-1 border-b border-slate-300 bg-white"}`}>
          <div className={`flex min-w-0 overflow-hidden ${hasRightPanel ? "border border-slate-300 bg-white pl-2" : "pl-2"}`}>
            <PrescriptionTabs activeTab={activeTab} setActiveTab={setActiveTab} compact />
          </div>
          {activeTab === "drugs" && <div className="flex items-center justify-start border border-slate-300 bg-[var(--color-services-light)] px-3 text-left text-[12.5px] font-bold text-[var(--color-services)]">Drug Group Prescription</div>}
          {activeTab === "lab" && <div className="flex items-center justify-start border border-slate-300 bg-[var(--color-lab-light)] px-3 text-left text-[12.5px] font-bold text-[var(--color-lab)]">Test Report</div>}
          {activeTab === "services" && <div className="flex items-center justify-start border border-slate-300 bg-[var(--color-services-light)] px-3 text-left text-[12.5px] font-bold text-[var(--color-services)]">Service Reports &amp; Findings</div>}
          {activeTab === "carePlan" && <div className="flex items-center justify-start border border-slate-300 bg-[var(--color-primary-muted)] px-3 text-left text-[12.5px] font-bold text-[var(--color-primary)]">Care-Plan Template</div>}
          {activeTab === "iptime" && <div className="flex items-center justify-start border border-slate-300 bg-[#fff1e1] px-3 text-left text-[12.5px] font-bold text-[#9a4e16]">Patient Group Service</div>}
        </nav>
        <main className="min-h-0 flex-1 overflow-auto" style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 44px, #d5dde2 44px, #d5dde2 45px)" }}>
          {activeTab === "drugs" && <DrugTabLayout rows={prescriptions.drugs} />}
          {activeTab === "lab" && <LabTestTabLayout rows={prescriptions.labs} />}
          {activeTab === "services" && <ServiceTabLayout rows={prescriptions.services} />}
          {activeTab === "carePlan" && <CarePlanTabLayout rows={prescriptions.carePlanItems} />}
          {activeTab === "iptime" && <IpTimelineTabLayout rows={prescriptions.ipEntries || prescriptions.timeline} />}
        </main>
      </div>
    </div>
  );
}
