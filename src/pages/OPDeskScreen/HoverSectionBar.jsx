import { useState } from "react";
import TopBarSection from "./TopBarSection";
import RightSidebar from "./RightSidebar";

export default function ParentExample({ patient, onSelectPatient }) {
  const [activePanel, setActivePanel] = useState(null);     // tablet tap state (already existed)
  const [highlightedTab, setHighlightedTab] = useState(null); // NEW: desktop hover / active key

  return (
    <div className="flex">

      <TopBarSection
        patient={patient}
        onPark={() => {/* existing handler */}}
        onFinalize={() => {/* existing handler */}}
        onIPList={() => {/* existing handler */}}
        onSelectPatient={onSelectPatient}
        highlightedTab={highlightedTab}   // NEW prop
      />

      <RightSidebar
        activePanel={activePanel}
        onPanelChange={setActivePanel}
        onHoverChange={setHighlightedTab} // NEW prop
      />
    </div>
  );
}