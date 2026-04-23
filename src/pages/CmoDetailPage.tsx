import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import NrAppBar from "../components/NrAppBar";
import PageHeader from "../components/PageHeader";
import SectionDrawer from "../components/SectionDrawer";
import FormSectionGrid from "../components/FormSectionGrid";
import { sections } from "../components/FormSectionGrid";

function getFieldValue(label: string): string {
  for (const section of sections) {
    const field = section.fields.find((f) => f.label === label);
    if (field) return field.value;
  }
  return "";
}

export type CmoDetailMode = "view" | "create";

interface CmoDetailPageProps {
  mode?: CmoDetailMode;
}

export default function CmoDetailPage({ mode = "view" }: CmoDetailPageProps) {
  const navigate = useNavigate();
  const isCreate = mode === "create";

  const [activeTab, setActiveTab] = useState(0);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  // Start in editing mode when creating a new CMO.
  const [isEditing, setIsEditing] = useState<boolean>(isCreate);
  const [cmoName, setCmoName] = useState(isCreate ? "" : getFieldValue("CMO Name"));
  const [cmoType, setCmoType] = useState(isCreate ? "" : getFieldValue("Type"));

  // Refs to track draft values while editing
  const draftName = useRef(cmoName);
  const draftType = useRef(cmoType);

  const handleSave = () => {
    // In create mode, Save is a no-op placeholder for now (per spec).
    if (isCreate) return;
    setCmoName(draftName.current);
    setCmoType(draftType.current);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (isCreate) {
      // Creating a new CMO — cancel returns to the catalog.
      navigate("/cmo-list");
      return;
    }
    draftName.current = cmoName;
    draftType.current = cmoType;
    setIsEditing(false);
  };

  const handleEdit = () => {
    draftName.current = cmoName;
    draftType.current = cmoType;
    setIsEditing(true);
  };

  const handleBackToOverview = () => navigate("/cmo-list");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "white",
      }}
    >
      <NrAppBar activeTab={0} onNavClick={(i) => { if (i === 0) handleBackToOverview(); }} />

      <Box sx={{ px: 2, display: "flex", flexDirection: "column", flex: 1 }}>
        <PageHeader
          activeTab={activeTab}
          onTabChange={(_e, val) => setActiveTab(val)}
          isEditing={isEditing}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          cmoName={cmoName}
          cmoType={cmoType}
          onBackToOverview={handleBackToOverview}
          mode={mode}
        />

        <Box sx={{ display: "flex", gap: 4, flex: 1 }}>
          <SectionDrawer
            activeIndex={activeSection}
            onSelect={setActiveSection}
          />
          <FormSectionGrid
            activeSectionIndex={activeSection}
            isEditing={isEditing}
            mode={mode}
            onCmoNameChange={(v) => { draftName.current = v; }}
            onCmoTypeChange={(v) => { draftType.current = v; }}
          />
        </Box>
      </Box>
    </Box>
  );
}
