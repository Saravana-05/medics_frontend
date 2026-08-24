import { useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, GripVertical, Info, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const opAppointmentStyles = ".opa-screen{--opa-navy:#173c55;--opa-teal:#2f8f86;--opa-line:#d6dee5;display:flex;min-width:1180px;height:100vh;flex-direction:column;overflow:hidden;background:#eef2f5;color:#18232f;font:13px Inter,\"Segoe UI\",sans-serif}.opa-screen *{box-sizing:border-box}.opa-header{display:grid;height:58px;flex:0 0 58px;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 20px;background:linear-gradient(90deg,#112f43,#173c55 58%,#1a465f);color:#fff;box-shadow:0 2px 8px #0c1f2c2e}.opa-brand{display:flex;align-items:center;gap:11px}.opa-brand>span{display:grid;width:31px;height:31px;place-items:center;border-radius:7px;background:#ffffff1f;font-weight:800}.opa-brand h1,.opa-brand p,.opa-panel-head h2,.opa-panel-head p{margin:0}.opa-brand h1{font-size:18px}.opa-brand p{margin-top:3px;color:#c9d7e0;font-size:11px}.opa-back{justify-self:start}.opa-staff{justify-self:end;border:1px solid #ffffff2e;border-radius:7px;padding:7px 11px;font-size:11px}.opa-back,.opa-actions button,.opa-tools button,.opa-slot-footer button{height:30px;border:1px solid #c5ced8;border-radius:6px;background:#fff;color:#34424e;padding:0 12px;font-weight:650;cursor:pointer}.opa-back{display:flex;align-items:center;gap:6px;border-color:#ffffff38;background:#ffffff14;color:#fff}.opa-workspace{display:grid;min-height:0;flex:1;grid-template-columns:minmax(540px,42%) minmax(660px,58%);gap:12px;padding:12px}.opa-panel{position:relative;display:flex;min-width:0;min-height:0;flex-direction:column;overflow:hidden;border:1px solid var(--opa-line);border-radius:10px;background:#fff;box-shadow:0 8px 24px #142a3c14}.opa-panel-head{display:flex;height:46px;flex:0 0 46px;align-items:center;justify-content:space-between;padding:0 14px 0 16px;border-bottom:1px solid var(--opa-line);background:#fbfcfd}.opa-panel-head h2{color:var(--opa-navy);font-size:14px}.opa-panel-head p{margin-top:2px;color:#66727f;font-size:10.5px}.opa-status{border:1px solid #c9e5df;border-radius:999px;background:#e8f4f1;color:#326159;padding:4px 8px;font-size:10px;font-weight:700}.opa-status:before{display:inline-block;width:6px;height:6px;margin-right:6px;border-radius:50%;background:var(--opa-teal);content:\"\"}.opa-scroll{min-height:0;flex:1;overflow:auto;padding:10px}.opa-card{margin-bottom:9px;overflow:hidden;border:1px solid var(--opa-line);border-radius:8px}.opa-card h3{display:flex;height:30px;align-items:center;justify-content:space-between;margin:0;padding:0 10px;border-bottom:1px solid var(--opa-line);background:#f7f9fb;color:#334554;font-size:11px;letter-spacing:.45px;text-transform:uppercase}.opa-card h3 small{color:#7a8792;font-size:9.5px;font-weight:500;letter-spacing:0;text-transform:none}.opa-card-body{padding:8px}.opa-form-grid{display:grid;grid-template-columns:120px minmax(130px,1fr) 110px minmax(120px,1fr);gap:6px 7px;align-items:center}.opa-label{display:flex;min-height:29px;align-items:center;border:1px solid #d7dce1;border-radius:5px;background:#e6eaee;padding:5px 8px;color:#44515d;font-size:10.5px;font-weight:650}.opa-field{min-width:0}.opa-field.opa-wide{grid-column:span 3}.opa-input,.opa-tools input{width:100%;height:29px;border:1px solid #c5ced8;border-radius:5px;background:#fff;padding:0 8px;color:#151b22;font:inherit;font-size:11px;outline:none}.opa-input:focus,.opa-tools input:focus{border-color:#6fa8c8;box-shadow:0 0 0 2px #4186b01a}.opa-link{color:#1769aa;font-weight:600;text-decoration:underline;text-underline-offset:2px}.opa-date{color:#18794e;font-weight:600;text-decoration:underline;text-underline-offset:2px}.opa-people{display:grid;grid-template-columns:82px 1.25fr .9fr .85fr 1fr;gap:5px;align-items:center;margin-top:5px}.opa-people>strong{font-size:10px;color:#44515d}.opa-people-head{margin-top:8px;color:#6a7782;font-size:9.5px;font-weight:650}.opa-vitals{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.opa-vitals label{border:1px solid var(--opa-line);border-radius:6px;background:#fbfcfd;padding:6px}.opa-vitals span{display:block;margin-bottom:4px;color:#68747f;font-size:9px;font-weight:650}.opa-reminders{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.opa-reminders div{border:1px solid var(--opa-line);border-radius:6px;background:#fbfcfd;padding:7px}.opa-reminders span,.opa-reminders strong{display:block}.opa-reminders span{margin-bottom:4px;color:#65727d;font-size:9.5px;font-weight:700}.opa-reminders strong{color:#18794e;font-size:10.5px;text-decoration:underline}.opa-actions{display:flex;height:48px;flex:0 0 48px;align-items:center;justify-content:flex-end;gap:8px;padding:8px 10px;border-top:1px solid var(--opa-line);background:#fbfcfd}.opa-screen button.primary{border-color:var(--opa-teal);background:var(--opa-teal);color:#fff}.opa-screen button:disabled{cursor:not-allowed;opacity:.42}.opa-slot-body{display:flex;min-height:0;flex:1;flex-direction:column;gap:8px;padding:10px}.opa-empty{position:absolute;inset:46px 0 0;z-index:5;display:flex;align-items:center;justify-content:center;flex-direction:column;background:#f4f7f9e8;text-align:center;backdrop-filter:blur(2px)}.opa-empty svg{color:var(--opa-navy)}.opa-empty h3{margin:12px 0 5px;font-size:13px}.opa-empty p{margin:0;color:#6d7882;font-size:10.5px}.opa-stats{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px}.opa-stats div{min-width:0;border:1px solid var(--opa-line);border-radius:7px;background:#fbfcfd;padding:7px 8px}.opa-stats span,.opa-stats strong{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.opa-stats span{margin-bottom:4px;color:#71808b;font-size:8.8px;font-weight:650}.opa-stats strong{color:#1769aa;font-size:11px;text-decoration:underline}.opa-tools{display:flex;align-items:end;gap:6px;border:1px solid var(--opa-line);border-radius:8px;background:#fbfcfd;padding:7px}.opa-tools label{margin-right:auto;color:#6c7883;font-size:9px;font-weight:650}.opa-tools label>span{display:flex;align-items:center;gap:5px}.opa-tools label>span:first-child{margin-bottom:4px}.opa-tools input{width:66px}.opa-tools>b{height:30px;border:1px solid var(--opa-line);border-radius:6px;background:#fff;padding:7px 9px;font-size:9.5px;white-space:nowrap}.opa-tools button.active{background:#edf6fa;color:#205873}.opa-tools button.break.active{background:#fff8e8;color:#7b571c}.opa-tools button.buffer.active{background:#f7f0fb;color:#614276}.opa-legend{display:flex;align-items:center;gap:12px;padding:0 2px;color:#6c7983;font-size:9px}.opa-legend span{display:flex;align-items:center;gap:4px}.opa-legend i{width:8px;height:8px;border:1px solid #cfd7de;border-radius:2px;background:#fff}.opa-legend i.selected{border-color:#7dbbb0;background:#dff1ed}.opa-legend i.break{border-color:#ddbd78;background:#fff1ce}.opa-legend i.buffer{border-color:#c1a5d1;background:#efe4f5}.opa-legend i.booked{border-color:#9cb8d0;background:#e3edf7}.opa-legend strong{margin-left:auto}.opa-grid-wrap{min-height:0;flex:1;overflow:auto;border:1px solid var(--opa-line);border-radius:8px}.opa-grid-wrap table{width:100%;border-collapse:separate;border-spacing:0;table-layout:fixed}.opa-grid-wrap th{position:sticky;top:0;z-index:2;border-right:1px solid var(--opa-line);border-bottom:1px solid #c5ced8;background:#edf2f5;padding:6px 5px;color:#445461;font-size:9.5px}.opa-grid-wrap th:nth-child(3n){text-align:left}.opa-grid-wrap td{height:24px;border-right:1px solid #edf0f2;border-bottom:1px solid #edf0f2;padding:3px 5px;font-size:9.4px;cursor:pointer}.opa-grid-wrap td:nth-child(3n+1),.opa-grid-wrap td:nth-child(3n+2){text-align:center}.opa-grid-wrap td:nth-child(3n){overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.opa-grid-wrap td.break{background:#fff1ce}.opa-grid-wrap td.buffer{background:#efe4f5}.opa-grid-wrap td.booked{background:#e3edf7}.opa-grid-wrap td.selected{background:#dff1ed;color:#176c61;font-weight:700}.opa-slot-footer{display:flex;min-height:32px;align-items:center;gap:6px}.opa-slot-footer span{display:flex;align-items:center;gap:5px;margin-right:auto;color:#65727c;font-size:9.6px}@media(max-width:1450px){.opa-form-grid{grid-template-columns:108px minmax(120px,1fr) 98px minmax(110px,1fr)}.opa-stats{grid-template-columns:repeat(3,minmax(0,1fr))}.opa-tools{flex-wrap:wrap}}\n";

const confirmationStyles = `.opa-status.confirmed{border-color:#9ed5c7;background:#dff4ed;color:#176c58}.opa-status.saved{border-color:#b8d5e6;background:#eaf5fb;color:#245d7a}.opa-confirm-overlay{position:fixed;inset:0;z-index:50;display:grid;place-items:center;background:#102a3a73;padding:24px}.opa-confirm-card{width:min(520px,94vw);overflow:hidden;border-radius:12px;background:#fff;box-shadow:0 24px 70px #102a3a4d}.opa-confirm-head{display:flex;align-items:center;gap:12px;padding:18px 20px;background:#e5f5f0;color:#176c58}.opa-confirm-head svg{flex:none}.opa-confirm-head h2,.opa-confirm-head p{margin:0}.opa-confirm-head h2{font-size:17px}.opa-confirm-head p{margin-top:3px;font-size:11px;color:#4d756a}.opa-confirm-summary{display:grid;grid-template-columns:140px 1fr;gap:10px 16px;padding:20px;font-size:13px}.opa-confirm-summary span{color:#687681}.opa-confirm-summary strong{color:#203440}.opa-confirm-reminder{margin:0 20px 18px;border:1px solid #cfe2ed;border-radius:7px;background:#eff8fd;padding:10px 12px;color:#365c70;font-size:11px}.opa-confirm-actions{display:flex;justify-content:flex-end;gap:8px;border-top:1px solid #d6dee5;background:#f7fbfd;padding:12px 20px}.opa-confirm-actions button{height:32px;border:1px solid #c5ced8;border-radius:6px;background:#fff;padding:0 14px;font-weight:650;cursor:pointer}.opa-confirm-actions .primary{border-color:#2f8f86;background:#2f8f86;color:#fff}.opa-screen.is-complete .opa-workspace input,.opa-screen.is-complete .opa-workspace select,.opa-screen.is-complete .opa-tools button,.opa-screen.is-complete .opa-slot-footer button{pointer-events:none}.opa-screen.is-complete .opa-workspace input,.opa-screen.is-complete .opa-workspace select{background:#f5f8fa}`;

const schedulingStyles = `.opa-details .opa-form-grid{grid-template-columns:112px minmax(120px,185px) 104px minmax(120px,185px);justify-content:start}.opa-details .opa-input{max-width:185px}.opa-details .opa-field.opa-wide{grid-column:span 3}.opa-details .opa-field.opa-wide .opa-input{max-width:481px}.opa-reminder-add{display:flex;align-items:end;gap:6px;grid-column:1/-1;border-style:dashed!important}.opa-reminder-add label{flex:1}.opa-reminder-add label span{margin-bottom:4px}.opa-reminder-add input{width:100%;height:29px;border:1px solid #c5ced8;border-radius:5px;padding:0 8px}.opa-reminder-add button,.opa-reminders button{height:29px;border:1px solid #c5ced8;border-radius:5px;background:#fff;padding:0 10px;font-size:10px;font-weight:650}.opa-reminders div{position:relative}.opa-reminders .remove-reminder{position:absolute;top:5px;right:5px;width:22px;height:22px;padding:0;color:#a43b3b}.opa-leave-note{grid-column:1/-1;border:1px solid #efc6c6;border-radius:6px;background:#fff2f2;padding:7px 9px;color:#9b3434;font-size:10.5px}.opa-schedule-controls{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px}.opa-schedule-controls label{font-size:9px;color:#687681}.opa-schedule-controls select,.opa-schedule-controls input{display:block;width:100%;height:29px;margin-top:4px;border:1px solid #c5ced8;border-radius:5px;background:#fff;padding:0 7px;font-size:11px}.opa-empty.leave{color:#9b3434}.opa-empty.leave svg{color:#b34a4a}`;

const slotListStyles = `.opa-slots .opa-panel-head{height:54px;flex-basis:54px;border-bottom:0;background:linear-gradient(135deg,var(--color-primary-dark,#173c55) 0%,#063a59 100%);color:#fff}.opa-slots .opa-panel-head h2{color:#fff;font-size:16px}.opa-slots .opa-panel-head p{color:#cfe0ea;font-size:11px}.opa-slots .opa-status{border-color:#ffffff40;background:#ffffff20;color:#fff}.opa-slots .opa-status:before{background:#8fe0c8}.opa-grid-wrap th:first-child{width:90px;text-align:center}.opa-grid-wrap th:nth-child(2){width:150px;text-align:center}.opa-grid-wrap th:nth-child(3){text-align:left}.opa-grid-wrap td:first-child,.opa-grid-wrap td:nth-child(2){text-align:center}.opa-grid-wrap td:nth-child(3){text-align:left}.opa-grid-wrap tr[draggable=true]{cursor:grab}.opa-grid-wrap tr.dragging{opacity:.45}.opa-grid-wrap tr.drop-target td{box-shadow:inset 0 0 0 2px #2f8f86}.opa-patient-editor{width:100%;height:25px;border:0;background:transparent;padding:0 6px;font:inherit}.opa-patient-editor:focus{outline:1px solid #7dbbb0;background:#fff}.opa-save-note{color:#18794e!important;font-weight:700}`;

const sizingStyles = `.opa-screen{min-width:1060px;font-size:14px}.opa-workspace{width:min(1400px,calc(100vw - 24px));margin:0 auto;grid-template-columns:minmax(700px,70%) minmax(300px,30%)}.opa-details .opa-panel-head>div{display:flex;min-width:0;align-items:center;gap:10px;white-space:nowrap}.opa-details .opa-panel-head p{margin-top:0;padding-left:10px;border-left:1px solid var(--opa-line);overflow:hidden;text-overflow:ellipsis}.opa-details .opa-scroll{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:auto auto minmax(0,1fr);gap:7px;overflow:hidden;padding:7px}.opa-details .opa-card{min-height:0;margin:0}.opa-details .opa-card:first-child{grid-column:1/-1}.opa-details .opa-card h3{height:26px}.opa-details .opa-card-body{padding:6px}.opa-details .opa-card:not(:first-child) .opa-form-grid{grid-template-columns:94px minmax(0,1fr);gap:4px 5px}.opa-details .opa-card:not(:first-child) .opa-field.opa-wide{grid-column:span 1}.opa-details .opa-card:not(:first-child) .opa-input,.opa-details .opa-card:not(:first-child) .opa-field.opa-wide .opa-input{max-width:none}.opa-details .opa-card:not(:first-child) .opa-label{min-height:25px;padding:3px 6px}.opa-details .opa-card:not(:first-child) .opa-input{height:25px}.opa-details .opa-vitals{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:1fr;gap:5px}.opa-details .opa-vitals label{display:flex;min-width:0;flex-direction:column;justify-content:center;padding:5px}.opa-details .opa-vitals span{margin-bottom:3px;white-space:nowrap}.opa-details .opa-vitals .opa-input{width:100%;max-width:none}.opa-details .opa-reminders{gap:4px}.opa-details .opa-reminders div{padding:4px 5px}.opa-details .opa-reminders span{margin-bottom:2px}.opa-details .opa-reminder-add{padding:4px!important}.opa-details .opa-reminder-add input,.opa-details .opa-reminder-add button{height:25px}.opa-panel-head h2{font-size:15px}.opa-panel-head p{font-size:12px}.opa-card h3{font-size:12px}.opa-card h3 small{font-size:11px}.opa-label{font-size:12px}.opa-input,.opa-tools input{font-size:13px}.opa-people>strong{font-size:11.5px}.opa-people-head{font-size:11px}.opa-vitals span{font-size:11px}.opa-reminders span{font-size:11px}.opa-reminders strong{font-size:12px}.opa-stats span{font-size:11.5px}.opa-stats strong{font-size:12px}.opa-tools label{font-size:11px}.opa-tools button,.opa-tools>b{font-size:11px}.opa-legend{font-size:11px}.opa-grid-wrap th{font-size:12px}.opa-grid-wrap td,.opa-patient-editor{font-size:13px}.opa-slot-footer span{font-size:11.5px}.opa-actions button,.opa-slot-footer button{font-size:11.5px}@media(max-width:1200px){.opa-workspace{grid-template-columns:minmax(700px,70%) minmax(300px,30%)}}`;

const screenshotStyles = `.opa-counts{display:flex;align-items:center;gap:6px;margin-left:auto}.opa-counts b{min-width:72px;height:28px;border:1px solid #c9d6df;background:#fff;padding:6px 9px;text-align:center;font-size:11px;font-weight:600}.opa-view-toggle{display:flex;margin-left:auto}.opa-view-toggle button{height:28px;min-width:88px;border:1px solid #c6d3dc;background:#fff;color:#263d4c;font-size:11px;font-weight:650}.opa-view-toggle button.active{border-color:#0d7a7d;background:#0d7a7d;color:#fff}.opa-date-band{height:34px;display:flex;align-items:center;justify-content:center;background:linear-gradient(90deg,#126c76,#0d7475);color:#fff;font-size:12px;font-weight:750;letter-spacing:.2px}.opa-grid-wrap th:nth-child(1){width:82px}.opa-grid-wrap th:nth-child(2){width:135px}.opa-grid-wrap th:nth-child(3){width:112px;text-align:center}.opa-grid-wrap th:nth-child(4){width:auto;text-align:left}.opa-grid-wrap th:nth-child(5){width:78px;text-align:center}.opa-grid-wrap td:nth-child(3),.opa-grid-wrap td:nth-child(5){text-align:center}.opa-token-cell{display:flex;align-items:center;justify-content:center;gap:5px}.opa-token-cell svg{color:#526d7d}.opa-status-chip{display:inline-flex;min-width:53px;justify-content:center;border-radius:3px;padding:4px 7px;font-size:10px;font-weight:700;text-transform:capitalize}.opa-status-chip.booked{background:#e6f0ff;color:#1260d5}.opa-status-chip.free{background:#e6f8ed;color:#16854a}.opa-status-chip.break{background:#fff0d5;color:#d67500}.opa-status-chip.buffer{background:#f1e5fa;color:#8954b9}.opa-action-menu{border:0;background:transparent;color:#203b4c;padding:2px 8px;cursor:pointer}.opa-bottom-area{display:grid;grid-template-columns:1fr auto;gap:8px;border-top:1px solid #c6d9e4;background:#fff;padding:10px}.opa-guidance{display:flex;align-items:flex-start;gap:7px;border:1px solid #cce0ee;border-radius:6px;background:#f4faff;padding:8px 10px;color:#355468;font-size:11px;line-height:1.45}.opa-guidance svg{flex:none;color:#1673dc}.opa-bottom-actions{display:flex;align-items:center;gap:8px}.opa-bottom-actions button{height:34px;border:1px solid #c5d2db;background:#fff;padding:0 15px;font-weight:650}.opa-bottom-actions button.primary{border-color:#087d7d;background:#087d7d;color:#fff}.opa-legend{gap:18px}.opa-legend i.onhold{border-color:#e6ad1c;background:#f5b91e}`;

const fullWidthStyles = `.opa-header{display:none}.opa-workspace{width:100%;margin:0;gap:6px;padding:6px}.opa-panel{border-radius:4px;box-shadow:none}.opa-details .opa-panel-head{height:58px;flex-basis:58px;padding:0 18px}.opa-details .opa-panel-head h2{font-size:18px}.opa-details .opa-panel-head p{font-size:12px}.opa-details .opa-scroll{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:auto auto auto minmax(0,1fr);gap:0;overflow:hidden;padding:0}.opa-details .opa-card{border:0;border-bottom:1px solid var(--opa-line);border-radius:0}.opa-details .opa-card:first-child,.opa-details .opa-card:nth-child(4),.opa-details .opa-card:nth-child(5){grid-column:1/-1}.opa-details .opa-card:nth-child(2){border-right:1px solid var(--opa-line)}.opa-details .opa-card h3{height:38px;min-width:0;gap:8px;border-bottom:1px solid var(--opa-line);background:#fff;padding:0 16px;color:#124f87;font-size:12px}.opa-details .opa-card h3 small{min-width:0;overflow:hidden;text-overflow:ellipsis}.opa-details .opa-card-body{padding:10px 16px}.opa-details .opa-panel-head h2,.opa-details .opa-panel-head p,.opa-details .opa-card h3,.opa-details .opa-card h3 small,.opa-details .opa-label{white-space:nowrap}.opa-details .opa-label{overflow:hidden;border:0;background:transparent;padding:0;text-overflow:ellipsis}.opa-details .opa-card:not(:first-child) .opa-form-grid{grid-template-columns:110px minmax(0,1fr);gap:8px 10px}.opa-details .opa-vitals{grid-template-columns:repeat(8,minmax(0,1fr));gap:12px}.opa-details .opa-vitals label{border:0;background:transparent;padding:0}.opa-details .opa-vitals .opa-input{height:32px}.opa-details .opa-reminders{grid-template-columns:repeat(5,minmax(0,1fr));gap:0}.opa-details .opa-reminders>div{border:0;border-right:1px dashed #bfd0dc;border-radius:0;background:transparent;padding:0 16px}.opa-details .opa-reminders>div:first-child{padding-left:0}.opa-details .opa-reminders>div:last-child{border-right:0}.opa-details .opa-reminder-add{display:flex;grid-column:auto!important;padding:0 0 0 16px!important}.opa-details .opa-actions{height:54px;flex-basis:54px;padding-right:16px}.opa-slots .opa-panel-head{height:58px;flex-basis:58px}.opa-slots .opa-stats>div:nth-child(3){grid-column:1}.opa-legend{justify-content:flex-start;gap:12px}.opa-bottom-area{padding:8px}`;

const equalWidthStyles = `.opa-workspace{grid-template-columns:minmax(0,50%) minmax(0,30%);justify-content:end}.opa-details .opa-card:first-child .opa-form-grid{width:100%;grid-template-columns:112px minmax(140px,185px) minmax(20px,1fr) 112px minmax(140px,185px)}.opa-details .opa-card:first-child .opa-form-grid>.opa-label:nth-child(3){grid-column:4}.opa-details .opa-card:first-child .opa-form-grid>.opa-field:nth-child(4){grid-column:5}`;

const familyCareStyles = `.opa-details .opa-card:first-child .opa-people{grid-template-columns:112px minmax(140px,185px) minmax(20px,1fr) 112px minmax(140px,185px)}.opa-family-toggle{display:flex;align-items:center;gap:7px;color:#24465f;font-size:10px;font-weight:700;text-transform:none;letter-spacing:0}.opa-family-toggle input{accent-color:var(--opa-teal)}.opa-family-toggle select{height:24px;border:1px solid #c5ced8;border-radius:4px;background:#fff;padding:0 5px;font-size:10px}.opa-baby-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:7px}.opa-baby-card{display:grid;grid-template-columns:auto minmax(0,1fr) 62px;align-items:center;gap:5px;border:1px solid #cfe0e8;border-radius:5px;background:#f7fbfd;padding:5px}.opa-baby-card strong{color:#124f87;font-size:10px;white-space:nowrap}.opa-baby-card .opa-input{height:25px;max-width:none;font-size:10px}.opa-baby-card span{grid-column:1/-1;color:#18794e;font-size:9px;font-weight:650}`;

const brandingRailStyles = `.opa-workspace{position:relative}.opa-workspace:before{position:absolute;inset:6px auto 6px 6px;width:calc(20% - 12px);background:linear-gradient(#eef2f5b8,#eef2f5b8),url('/hospital-team.png') center 68%/95% auto no-repeat;content:"";filter:grayscale(1);opacity:.72}.opa-branding-rail{position:absolute;z-index:1;top:50%;left:3.4%;display:flex;align-items:center;gap:2px;color:#26465a;writing-mode:vertical-rl;transform:translateY(-50%) rotate(180deg);text-shadow:0 1px 0 #fff;white-space:nowrap}.opa-branding-rail strong{font-family:"Sacramento","Segoe Script","Brush Script MT",cursive;font-size:clamp(42px,4.4vw,72px);font-weight:400;line-height:1}.opa-branding-rail span{margin-top:-2px;font-size:clamp(12px,1vw,17px);font-style:italic;font-weight:500;letter-spacing:.5px;text-transform:none}.opa-details,.opa-slots{z-index:1}`;

const brandingPositionStyles = `.opa-branding-rail{top:50%;margin-top:-50px;margin-left:50px}`;

const brandingSeparationStyles = `.opa-workspace:before{inset:auto;top:50%;left:10%;width:calc(100vh - 12px);height:calc(20vw - 12px);background-image:url('/hospital-team.png');background-position:center;background-repeat:no-repeat;background-size:contain;filter:grayscale(1) contrast(1.05);opacity:.28;transform:translate(-50%,-50%) rotate(-90deg)}.opa-branding-rail{z-index:2}`;

const doctorSchedules = {
  "Dr. Anand": { start: 9 * 60, end: 17 * 60, duration: 10 },
  "Dr. Priya": { start: 10 * 60, end: 18 * 60, duration: 15 },
  "Dr. Karthik": { start: 8 * 60 + 30, end: 14 * 60 + 30, duration: 10 },
};

const slotStateStyles = `.opa-grid-wrap tr.break td{background:#fff1ce}.opa-grid-wrap tr.buffer td{background:#efe4f5}.opa-grid-wrap tr.booked td{background:#e3edf7}.opa-grid-wrap tr.selected td{background:#dff1ed;color:#176c61;font-weight:700}`;

const slotActionStyles = `.opa-grid-wrap tr.hold td{background:#fff7d6}.opa-status-chip.hold{background:#fff0b8;color:#8a6200}.opa-action-cell{position:relative;overflow:visible!important}.opa-action-popover{position:absolute;z-index:20;top:30px;right:8px;width:170px;border:1px solid #b9cbd7;border-radius:6px;background:#fff;padding:4px;box-shadow:0 8px 24px #173c5530;text-align:left}.opa-action-popover button{display:block;width:100%;height:28px;border:0;border-radius:4px;background:#fff;padding:0 8px;color:#263d4c;text-align:left;font-size:10px;cursor:pointer}.opa-action-popover button:hover{background:#edf6fa}.opa-action-popover button.danger{color:#a33b3b}.opa-action-popover hr{margin:4px;border:0;border-top:1px solid #e1e7eb}.opa-slot-notice{font-weight:700}`;

const compactReferenceStyles = `.opa-slots{border-radius:0;border-color:#b9cbd7;box-shadow:none}.opa-slots .opa-panel-head{height:54px;flex-basis:54px;padding:0 17px;background:#075078}.opa-slots .opa-panel-head h2{font-size:15px;font-weight:700}.opa-slots .opa-panel-head p{margin-top:2px;font-size:10px;color:#d8e9f2}.opa-slots .opa-status{border:0;border-radius:3px;background:#ffffff24;padding:6px 9px}.opa-slot-body{gap:0;padding:0;background:#fff}.opa-stats{grid-template-columns:repeat(3,minmax(0,1fr));gap:0;border-bottom:1px solid #c8d6df;background:#f3f7fb}.opa-stats div{display:flex;min-height:43px;align-items:center;gap:7px;border:0;border-right:1px solid #d5e0e7;border-bottom:1px solid #d5e0e7;border-radius:0;background:transparent;padding:7px 13px}.opa-stats span,.opa-stats strong{display:block;margin:0;overflow:visible;text-overflow:clip}.opa-stats span{min-width:82px;color:#142433;font-size:10px;font-weight:700}.opa-stats span:after{float:right;margin-left:6px;content:':'}.opa-stats strong{color:#253d4d;font-size:10.5px;font-weight:500;text-decoration:none}.opa-tools{min-height:44px;align-items:center;gap:5px;border:0;border-bottom:1px solid #b9cbd7;border-radius:0;background:#fff;padding:5px 10px}.opa-tools label{display:flex;align-items:center;gap:8px;margin-right:auto}.opa-tools label>span:first-child{margin:0;color:#1f3342;font-weight:700}.opa-tools button{height:27px;border-radius:0;padding:0 10px;font-size:9.5px}.opa-tools>b{height:27px;border-radius:0;padding:6px 8px}.opa-tools input{height:27px;border-radius:0}.opa-legend{min-height:31px;border-bottom:1px solid #b9cbd7;background:#f4f8fb;padding:0 10px}.opa-grid-wrap{border:0;border-radius:0}.opa-grid-wrap th{height:35px;border-right:0;border-bottom:1px solid #8db2c8;background:#70a6c4;color:#fff;font-size:10.5px;font-weight:700}.opa-grid-wrap td{height:36px;border-right:0;border-bottom:1px solid #d9e3e9;padding:4px 8px;font-size:11px}.opa-grid-wrap tbody tr:nth-child(even) td{background-color:#fbfdfe}.opa-patient-editor{height:27px;font-size:11px}.opa-slot-footer{min-height:45px;border-top:1px solid #9fcde4;background:#eef8fd;padding:7px 10px}.opa-slot-footer button{height:29px;border-radius:0}.opa-empty{inset:54px 0 0;border-radius:0;background:#f3f7fbeF}@media(max-width:1450px){.opa-stats{grid-template-columns:repeat(2,minmax(0,1fr))}}`;

const doctors = Object.keys(doctorSchedules);
const initialPeople = [
  ["Patient", "Mrs. Sowmya Suresh", "9684590444", "", "Phone"],
  ["Mother (If Baby)", "-", "-", "-", "<None>"],
  ["Attendant-1", "Suresh", "9589834545", "Husband", "WhatsApp"],
  ["Attendant-2", "Srinidhi", "9787643678", "Daughter", "WhatsApp"],
];
const vitals = [["BP", "120/80"], ["Temperature", "100.8 F"], ["Pulse", "85"], ["SpO₂", "96"], ["Blood Group", "O+"], ["Height", "169 cm"], ["Weight", "64 kg"], ["BMI", "30.5 kg/m²"]];

function formatTime(minutes) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}

function formatScheduleDate(value) {
  if (!value) return "SELECT APPOINTMENT DATE";
  const date = new Date(`${value}T12:00:00`);
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const [year, month, day] = value.split("-");
  return `${weekday}, ${day}-${month}-${year}`;
}

function Field({ label, children, wide = false }) {
  return <><label className="opa-label">{label}</label><div className={wide ? "opa-field opa-wide" : "opa-field"}>{children}</div></>;
}

export default function OPAppointmentsScreen() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState("");
  const [duration, setDuration] = useState(6);
  const [mode, setMode] = useState("select");
  const [confirmed, setConfirmed] = useState(false);
  const [selected, setSelected] = useState(null);
  const [appointment, setAppointment] = useState({ date: "2026-08-22", token: "", time: "" });
  const [patientName, setPatientName] = useState(initialPeople[0][1]);
  const [slots, setSlots] = useState([]);
  const [appointmentStatus, setAppointmentStatus] = useState("draft");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [schedulePattern, setSchedulePattern] = useState("daily");
  const [reminders, setReminders] = useState(["On confirmation", "Appointment date · 07:00 AM", "60 min before reporting", "30 min before reporting"]);
  const [reminderDraft, setReminderDraft] = useState("");
  const [draggedSlot, setDraggedSlot] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [slotsSaved, setSlotsSaved] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);
  const [slotNotice, setSlotNotice] = useState("");
  const [motherWithBabies, setMotherWithBabies] = useState(false);
  const [babyCount, setBabyCount] = useState(1);
  const [babies, setBabies] = useState([{ name: "", age: "" }, { name: "", age: "" }, { name: "", age: "" }]);

  const updateBaby = (index, field, value) => {
    setBabies(current => current.map((baby, babyIndex) => babyIndex === index ? { ...baby, [field]: value } : baby));
  };

  const updatePrimaryPatient = value => {
    const previousName = patientName;
    setPatientName(value);
    setSlots(current => current.map(slot => slot.patient === previousName && slot.kind === "booked" ? { ...slot, patient: value, kind: value.trim() ? "booked" : "" } : slot));
    setAppointmentStatus("draft");
    setSlotsSaved(false);
  };

  const generateSlots = (selectedDoctor = doctor, requestedDuration) => {
    if (!selectedDoctor) return;
    const schedule = doctorSchedules[selectedDoctor];
    const minutes = Math.max(1, Number(requestedDuration ?? duration) || schedule.duration);
    setSlots(Array.from({ length: Math.floor((schedule.end - schedule.start) / minutes) }, (_, index) => ({
      token: index + 1,
      time: formatTime(schedule.start + index * minutes),
      patient: "",
      kind: "",
    })));
    setSelected(null);
    setConfirmed(true);
    setSlotsSaved(false);
    setAppointmentStatus("draft");
    setAppointment(current => ({ ...current, token: "", time: "" }));
  };

  const counts = useMemo(() => ({
    break: slots.filter(slot => slot.kind === "break").length,
    buffer: slots.filter(slot => slot.kind === "buffer").length,
    booked: slots.filter(slot => slot.kind === "booked").length,
    available: slots.filter(slot => !slot.kind).length,
    hold: slots.filter(slot => slot.kind === "hold").length,
  }), [slots]);

  const availableSlots = useMemo(() => slots.filter(slot => !["break", "buffer", "booked", "hold"].includes(slot.kind) || slot.token === Number(appointment.token)), [slots, appointment.token]);

  const selectTimeSlot = value => {
    if (!patientName.trim()) {
      setSlotNotice("Enter the patient name before selecting a time slot.");
      return;
    }
    const token = Number(value);
    const slotIndex = slots.findIndex(slot => slot.token === token);
    if (slotIndex < 0) {
      setAppointment(current => ({ ...current, token: "", time: "" }));
      setSelected(null);
      return;
    }
    const chosen = slots[slotIndex];
    setSlots(current => current.map((slot, index) => {
      if (index === slotIndex) return { ...slot, patient: patientName.trim(), kind: "booked" };
      if (slot.patient === patientName.trim() && slot.kind === "booked") return { ...slot, patient: "", kind: "" };
      return slot;
    }));
    setAppointment(current => ({ ...current, token: chosen.token, time: chosen.time }));
    setSelected(null);
    setAppointmentStatus("draft");
    setSlotsSaved(false);
  };

  const addReminder = () => {
    const value = reminderDraft.trim();
    if (!value) return;
    setReminders(current => [...current, value]);
    setReminderDraft("");
  };

  const updateSlot = index => {
    const slot = slots[index];
    if (!slot || slot.kind === "booked") return;
    if (mode === "select") {
      if (confirmed && !slot.kind) setSelected(index);
      return;
    }
    setSlots(current => current.map((item, itemIndex) => itemIndex !== index ? item : {
      ...item,
      kind: mode === "clear" || item.kind === mode ? "" : mode,
    }));
  };

  const movePatient = targetIndex => {
    if (draggedSlot === null || draggedSlot === targetIndex) return;
    const source = slots[draggedSlot];
    const target = slots[targetIndex];
    if (!source?.patient || ["break", "buffer", "hold"].includes(target?.kind)) return;
    setSlots(current => current.map((slot, index) => {
      if (index === draggedSlot) return { ...slot, patient: target.patient || "", kind: target.patient ? "booked" : "" };
      if (index === targetIndex) return { ...slot, patient: source.patient, kind: "booked" };
      return slot;
    }));
    if (source.patient === patientName.trim()) setAppointment(current => ({ ...current, token: target.token, time: target.time }));
    setDraggedSlot(null);
    setDropTarget(null);
    setSlotsSaved(false);
  };

  const updatePatientName = (index, patient) => {
    setSlots(current => current.map((slot, itemIndex) => itemIndex === index ? { ...slot, patient, kind: slot.kind === "hold" ? "hold" : patient ? "booked" : "" } : slot));
    setSlotsSaved(false);
  };

  const runSlotAction = (index, action) => {
    const slot = slots[index];
    if (!slot) return;
    setActionMenu(null);
    setSlotsSaved(false);

    if (action === "patient") {
      const patient = window.prompt("Enter patient name", slot.patient || "");
      if (patient === null) return;
      updatePatientName(index, patient.trim());
      setSlotNotice(patient.trim() ? `Patient updated for token ${slot.token}.` : `Patient removed from token ${slot.token}.`);
      return;
    }

    if (action === "reschedule") {
      if (!slot.patient) {
        setSlotNotice(`Add a patient to token ${slot.token} before rescheduling.`);
        return;
      }
      const requestedToken = window.prompt("Move patient to token number", "");
      if (requestedToken === null) return;
      const targetIndex = slots.findIndex(item => item.token === Number(requestedToken));
      const target = slots[targetIndex];
      if (targetIndex < 0 || targetIndex === index || target.patient || ["break", "buffer", "hold"].includes(target?.kind)) {
        setSlotNotice("Choose a different free token for rescheduling.");
        return;
      }
      setSlots(current => current.map((item, itemIndex) => itemIndex === index ? { ...item, patient: "", kind: "" } : itemIndex === targetIndex ? { ...item, patient: slot.patient, kind: "booked" } : item));
      if (slot.patient === patientName.trim()) setAppointment(current => ({ ...current, token: target.token, time: target.time }));
      setSlotNotice(`${slot.patient} moved from token ${slot.token} to token ${target.token}.`);
      return;
    }

    if (["break", "buffer"].includes(action) && slot.patient) {
      setSlotNotice(`Remove or reschedule the patient before adding ${action}.`);
      return;
    }

    setSlots(current => current.map((item, itemIndex) => {
      if (itemIndex !== index) return item;
      if (action === "hold") return { ...item, kind: item.kind === "hold" ? (item.patient ? "booked" : "") : "hold" };
      if (action === "break" || action === "buffer") return { ...item, patient: "", kind: item.kind === action ? "" : action };
      return { ...item, patient: "", kind: "" };
    }));
    const label = action === "clear" ? "cleared" : slot.kind === action ? `${action} removed` : `${action} set`;
    setSlotNotice(`Token ${slot.token} ${label}.`);
  };

  const saveSlotChanges = () => {
    if (!doctor || !appointment.date) return;
    window.localStorage.setItem(`op-slots:${doctor}:${appointment.date}`, JSON.stringify({ duration, schedulePattern, slots }));
    setSlotsSaved(true);
  };

  const clearAppointment = () => {
    setDoctor("");
    setSlots([]);
    setSelected(null);
    setConfirmed(false);
    setMode("select");
    setAppointment({ date: "2026-08-22", token: "", time: "" });
    setAppointmentStatus("draft");
    setShowConfirmation(false);
    setSchedulePattern("daily");
    setActionMenu(null);
    setSlotNotice("");
    setMotherWithBabies(false);
    setBabyCount(1);
    setBabies([{ name: "", age: "" }, { name: "", age: "" }, { name: "", age: "" }]);
    setPatientName("");
  };

  const confirmAppointment = () => {
    if (!patientName.trim() || !doctor || !appointment.date || !appointment.token || !appointment.time) return;
    setAppointmentStatus("confirmed");
    setShowConfirmation(true);
  };

  return <main className={`opa-screen ${appointmentStatus === "confirmed" ? "is-complete" : ""}`}>
    <style>{opAppointmentStyles + confirmationStyles + schedulingStyles + slotListStyles + compactReferenceStyles + slotStateStyles + slotActionStyles + sizingStyles + screenshotStyles + fullWidthStyles + equalWidthStyles + familyCareStyles + brandingRailStyles + brandingPositionStyles + brandingSeparationStyles}</style>
    <header className="opa-header">
      <button className="opa-back" type="button" onClick={() => navigate("/dashboard")}><ArrowLeft size={17} /> Main Menu</button>
      <div className="opa-brand"><span>OP</span><div><h1>Out-Patient Appointments</h1><p>Appointment planning, patient details and slot allocation</p></div></div>
      <div className="opa-staff">Duty Staff: <strong>Mrs. Stella</strong></div>
    </header>

    <div className="opa-workspace">
      <aside className="opa-branding-rail" aria-label="E-Medic for doctor's desk"><strong>E-Medic</strong><span>...for doctor's desk</span></aside>
      <section className="opa-panel opa-details">
        <div className="opa-panel-head"><div><h2>Out-Patient Appointments</h2><p>Patient request, appointment details, clinical notes & reminders</p></div><span className={`opa-status ${appointmentStatus}`}>{appointmentStatus === "confirmed" ? "Appointment Confirmed" : appointmentStatus === "saved" ? "Draft Saved" : "Draft Appointment"}</span></div>
        <div className="opa-scroll">
          <article className="opa-card"><h3>Request & People <label className="opa-family-toggle"><input type="checkbox" checked={motherWithBabies} onChange={event => setMotherWithBabies(event.target.checked)} /> Mother with baby/babies {motherWithBabies && <select value={babyCount} onChange={event => setBabyCount(Number(event.target.value))} onClick={event => event.stopPropagation()} aria-label="Number of babies"><option value={1}>1 Baby</option><option value={2}>Twins</option><option value={3}>Triplets</option></select>}</label></h3><div className="opa-card-body">
            <div className="opa-form-grid"><Field label="Duty Staff Name"><input className="opa-input opa-link" defaultValue="Mrs. Stella" /></Field><Field label="Request Dt-Time"><input className="opa-input opa-date" type="datetime-local" defaultValue="2026-08-21T19:00" /></Field></div>
            <div className="opa-people opa-people-head"><span></span><span>Name</span><span>Phone</span><span>Relationship</span><span>Message Via</span></div>
            {initialPeople.map(person => <div className="opa-people" key={person[0]}>{person.map((value, column) => column === 0 ? <strong key={column}>{value}</strong> : column === 1 && person[0] === "Patient" ? <input className="opa-input" key={column} value={patientName} onChange={event => updatePrimaryPatient(event.target.value)} placeholder="Enter patient name" aria-label="Patient name" /> : column === 4 ? <select className="opa-input opa-link" key={column} defaultValue={value}><option>{value}</option><option>Phone</option><option>WhatsApp</option><option>&lt;None&gt;</option></select> : <input className="opa-input" key={column} defaultValue={value} aria-label={`${person[0]} ${column}`} />)}</div>)}
            {motherWithBabies && <div className="opa-baby-grid">{babies.slice(0, babyCount).map((baby, index) => <div className="opa-baby-card" key={index}><strong>Baby-{index + 1}</strong><input className="opa-input" value={baby.name} onChange={event => updateBaby(index, "name", event.target.value)} placeholder="Baby name" aria-label={`Baby ${index + 1} name`} /><input className="opa-input" value={baby.age} onChange={event => updateBaby(index, "age", event.target.value)} placeholder="Age" aria-label={`Baby ${index + 1} age`} /><span>Same complaint and care plan as mother</span></div>)}</div>}
          </div></article>

          <article className="opa-card"><h3>Appointment Assignment <small>Selecting a doctor activates Appointment Slots</small></h3><div className="opa-card-body opa-form-grid">
            <Field label="Doctor Name"><select className="opa-input opa-link" value={doctor} onChange={event => { const selectedDoctor = event.target.value; setDoctor(selectedDoctor); if (selectedDoctor) { const doctorDuration = doctorSchedules[selectedDoctor].duration; setDuration(doctorDuration); generateSlots(selectedDoctor, doctorDuration); } else { setSlots([]); } }}><option value="">Select Doctor</option>{doctors.map(name => <option key={name}>{name}</option>)}</select></Field>
            <Field label="Appointment Date"><input className="opa-input opa-date" type="date" value={appointment.date} onChange={event => setAppointment({ ...appointment, date: event.target.value })} /></Field>
            <Field label="Time-Slot"><select className="opa-input opa-date" value={appointment.token} onChange={event => selectTimeSlot(event.target.value)} disabled={!doctor || !confirmed}><option value="">Select available time</option>{availableSlots.map(slot => <option key={slot.token} value={slot.token}>{slot.time} · Token {slot.token}</option>)}</select></Field><Field label="Token No."><input className="opa-input" readOnly value={appointment.token} /></Field>
          </div></article>

          <article className="opa-card"><h3>Visit Details</h3><div className="opa-card-body opa-form-grid">
            <Field label="What For"><select className="opa-input opa-link"><option>Follow-up</option><option>New Patient</option><option>New Need</option></select></Field><Field label="Priority"><select className="opa-input opa-link"><option>Normal</option><option>Important (OS)</option><option>Urgent</option><option>Emergency</option></select></Field>
            <Field label="Chief Complaint" wide><input className="opa-input" defaultValue="Cough, Cold & Fever" /></Field><Field label="First Observation" wide><input className="opa-input" defaultValue="Viral Infection" /></Field>
          </div></article>

          <article className="opa-card"><h3>Vitals</h3><div className="opa-card-body opa-vitals">{vitals.map(([label, value]) => <label key={label}><span>{label}</span><input className="opa-input" defaultValue={value} /></label>)}</div></article>
          <article className="opa-card"><h3>Appointment Reminders <small>Add another reminder when required by the doctor</small></h3><div className="opa-card-body opa-reminders">{reminders.map((value, index) => <div key={`${value}-${index}`}><span>Reminder-{index + 1}</span><strong>{value}</strong>{index >= 4 && <button className="remove-reminder" type="button" onClick={() => setReminders(current => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove reminder ${index + 1}`}>×</button>}</div>)}<div className="opa-reminder-add"><label><span>Additional Reminder</span><input value={reminderDraft} onChange={event => setReminderDraft(event.target.value)} placeholder="e.g. 1 day before appointment" onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); addReminder(); } }} /></label><button type="button" onClick={addReminder}>Add Reminder</button></div></div></article>
        </div>
        <footer className="opa-actions"><button type="button" onClick={clearAppointment}>New Appointment</button><button type="button" onClick={() => setAppointmentStatus("saved")} disabled={!patientName.trim() || appointmentStatus === "confirmed"}>Save Draft</button><button className="primary" type="button" onClick={confirmAppointment} disabled={!patientName.trim() || !doctor || !appointment.date || !appointment.token || appointmentStatus === "confirmed"}>{appointmentStatus === "confirmed" ? "Appointment Confirmed" : "Confirm Appointment"}</button></footer>
      </section>

      <section className={`opa-panel opa-slots ${doctor ? "" : "is-disabled"}`}>
        <div className="opa-panel-head"><div><h2>Appointment Slots</h2><p>Doctor-wise Token · Time · Patient schedule</p></div><span className="opa-status">{doctor ? "Schedule Loaded" : "Awaiting Doctor"}</span></div>
        {!doctor && <div className="opa-empty"><CalendarDays size={34} /><h3>Select a Doctor to activate Appointment Slots</h3><p>The doctor’s working hours and appointment duration create the slot list automatically.</p></div>}
        <div className="opa-slot-body">
          <div className="opa-stats">{[["Doctor Name", doctor || "—"], ["Appt.Date", appointment.date || "—"], ["OP Start Time", doctor ? formatTime(doctorSchedules[doctor].start) : "—"], ["OP End Time", doctor ? formatTime(doctorSchedules[doctor].end) : "—"], ["Slot Duration", `${duration} minutes`]].map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</div>
          <div className="opa-tools"><label><span>One Appt. Duration</span><span><input type="number" min="1" value={duration} onChange={event => setDuration(event.target.value)} /> Minutes</span></label><button className="primary" onClick={() => generateSlots()}>Generate</button><div className="opa-counts"><b>Total {slots.length}</b><b>Booked {counts.booked}</b><b>Free {counts.available}</b><b>Break {counts.break}</b></div></div>
          <div className="opa-legend"><span><i className="booked" />Booked</span><span><i className="available" />Free</span><span><i className="break" />Break</span><span><i className="buffer" />Buffer</span><span><i className="onhold" />On Hold / Rescheduled</span></div>
          <div className="opa-date-band">{formatScheduleDate(appointment.date)}</div>
          <div className="opa-grid-wrap"><table><thead><tr><th>Token</th><th>Time</th><th>Status</th><th>Patient / Info</th><th>Action</th></tr></thead><tbody>{slots.map((slot, index) => { const status = slot.kind || "free"; return <tr key={slot.token} draggable={Boolean(slot.patient)} className={`${slot.kind} ${selected === index ? "selected" : ""} ${draggedSlot === index ? "dragging" : ""} ${dropTarget === index ? "drop-target" : ""}`} onClick={() => updateSlot(index)} onDragStart={() => setDraggedSlot(index)} onDragOver={event => { event.preventDefault(); setDropTarget(index); }} onDragLeave={() => setDropTarget(null)} onDrop={event => { event.preventDefault(); movePatient(index); }} onDragEnd={() => { setDraggedSlot(null); setDropTarget(null); }}><td><span className="opa-token-cell"><GripVertical size={13} />{slot.token}</span></td><td>{slot.time}</td><td><span className={`opa-status-chip ${status}`}>{status}</span></td><td><input className="opa-patient-editor" value={slot.patient} placeholder={slot.kind === "break" ? "Tea Break" : slot.kind === "buffer" ? "Buffer time" : slot.kind === "hold" ? "On hold" : "--"} disabled={["break", "buffer"].includes(slot.kind)} onClick={event => event.stopPropagation()} onChange={event => updatePatientName(index, event.target.value)} /></td><td className="opa-action-cell"><button className="opa-action-menu" type="button" title={`Actions for token ${slot.token}`} onClick={event => { event.stopPropagation(); setActionMenu(current => current === index ? null : index); }}><MoreHorizontal size={17} /></button>{actionMenu === index && <div className="opa-action-popover" onClick={event => event.stopPropagation()}><button type="button" onClick={() => runSlotAction(index, "patient")}>Change Patient</button><button type="button" onClick={() => runSlotAction(index, "reschedule")}>Reschedule Patient</button><button type="button" onClick={() => runSlotAction(index, "hold")}>{slot.kind === "hold" ? "Release Hold" : "Place on Hold"}</button><hr /><button type="button" onClick={() => runSlotAction(index, "break")}>{slot.kind === "break" ? "Remove Break" : "Add Break"}</button><button type="button" onClick={() => runSlotAction(index, "buffer")}>{slot.kind === "buffer" ? "Remove Buffer" : "Add Buffer"}</button><button className="danger" type="button" onClick={() => runSlotAction(index, "clear")}>Clear Slot</button></div>}</td></tr>; })}</tbody></table></div>
          <div className="opa-bottom-area"><div className={`opa-guidance ${slotsSaved ? "opa-save-note" : ""}`}><Info size={16} /><span className={slotNotice ? "opa-slot-notice" : ""}>{slotNotice || (slotsSaved ? "Slot changes saved in this browser." : <>Use the row action menu to change or reschedule a patient, place a hold, or set break and buffer time.<br />Drag a booked patient to another free time slot for quick rescheduling.</>)}</span></div><div className="opa-bottom-actions"><button type="button" onClick={() => generateSlots()}>Reset</button><button className="primary" type="button" disabled={!doctor || !slots.length} onClick={saveSlotChanges}>Save Slot Changes</button></div></div>
        </div>
      </section>
    </div>
    {showConfirmation && <div className="opa-confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="appointment-confirmed-title">
      <section className="opa-confirm-card">
        <div className="opa-confirm-head"><CheckCircle2 size={34} /><div><h2 id="appointment-confirmed-title">Appointment confirmed successfully</h2><p>The selected token is booked and the appointment reminders are scheduled.</p></div></div>
        <div className="opa-confirm-summary">
          <span>Patient</span><strong>{patientName}</strong>
          <span>Doctor</span><strong>{doctor}</strong>
          <span>Appointment Date</span><strong>{appointment.date}</strong>
          <span>Token Number</span><strong>{appointment.token}</strong>
          <span>Time Slot</span><strong>{appointment.time}</strong>
          <span>Reporting Time</span><strong>15 minutes before the slot</strong>
        </div>
        <p className="opa-confirm-reminder">Confirmation is recorded under the {schedulePattern} schedule. Reminder 1 is sent immediately; {reminders.length - 1} additional reminder{reminders.length === 2 ? "" : "s"} will follow the configured appointment schedule.</p>
        <footer className="opa-confirm-actions"><button type="button" onClick={() => navigate("/dashboard")}>Main Menu</button><button type="button" onClick={clearAppointment}>New Appointment</button><button className="primary" type="button" onClick={() => setShowConfirmation(false)}>View Appointment</button></footer>
      </section>
    </div>}
  </main>;
}
