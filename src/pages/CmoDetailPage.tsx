import { useRef, useState } from "react";
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

export default function CmoDetailPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [cmoName, setCmoName] = useState(getFieldValue("CMO Name"));
  const [cmoType, setCmoType] = useState(getFieldValue("Type"));

  // Refs to track draft values while editing
  const draftName = useRef(cmoName);
  const draftType = useRef(cmoType);

  const handleSave = () => {
    setCmoName(draftName.current);
    setCmoType(draftType.current);
    setIsEditing(false);
  };

  const handleCancel = () => {
    draftName.current = cmoName;
    draftType.current = cmoType;
    setIsEditing(false);
  };

  const handleEdit = () => {
    draftName.current = cmoName;
    draftType.current = cmoType;
    setIsEditing(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "white",
      }}
    >
      <NrAppBar />

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
        />

        <Box sx={{ display: "flex", gap: 4, flex: 1 }}>
          <SectionDrawer
            activeIndex={activeSection}
            onSelect={setActiveSection}
          />
          <FormSectionGrid
            activeSectionIndex={activeSection}
            isEditing={isEditing}
            onCmoNameChange={(v) => { draftName.current = v; }}
            onCmoTypeChange={(v) => { draftType.current = v; }}
          />
        </Box>
      </Box>
    </Box>
  );
}
