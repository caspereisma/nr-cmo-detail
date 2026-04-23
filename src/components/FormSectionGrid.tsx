import {
  Box,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
  FormGroup,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ValidationRuleEditor from "./ValidationRuleEditor";
import DeadlinesSection from "./DeadlinesSection";
import ContactsTable from "./ContactsTable";
import { countries } from "../data/countries";

interface FieldDef {
  label: string;
  value: string;
  type?: "text" | "select" | "boolean" | "date" | "checkboxGroup";
  options?: string[];
  /**
   * When true, the field is always read-only, even while the form is in edit mode.
   * Used for core identity fields that should be locked after the initial CMO setup
   * (e.g. CMO Name, Type, Home Territory).
   */
  lockedAfterSetup?: boolean;
}

interface Section {
  title: string;
  fields: FieldDef[];
}

const sections: Section[] = [
  {
    title: "General Information",
    fields: [
      {
        label: "CMO Name",
        value: "SCPP",
        lockedAfterSetup: true,
      },
      {
        label: "Type",
        value: "RIGHTS_HOLDER",
        type: "select",
        options: ["PERFORMER", "RIGHTS_HOLDER"],
        lockedAfterSetup: true,
      },
      {
        label: "Home Territory",
        value: "FR",
        type: "select",
        options: countries.map((c) => c.code),
        lockedAfterSetup: true,
      },
      {
        label: "Exploitation Type",
        value: "BROADCAST,DUBBING,PRIVATE_COPYING,SIMULCAST",
        type: "checkboxGroup",
        options: [
          "BROADCAST",
          "DUBBING",
          "PRIVATE_COPYING",
          "SIMULCAST",
          "PUBLIC_PERFORMANCE",
          "ONLINE",
        ],
      },
      {
        label: "Claim Method",
        value: "AGENT,EXCLUSIVE_LICENSE",
        type: "checkboxGroup",
        options: [
          "AGENT",
          "EXCLUSIVE_LICENSE",
          "NON_EXCLUSIVE_LICENSE",
          "DIRECT_LICENSE",
          "MANDATE",
        ],
      },
      {
        label: "Export Type",
        value: "XML",
        type: "select",
        options: ["XLSX", "XML"],
      },
      {
        label: "Is Competing",
        value: "true",
        type: "boolean",
      },
      {
        label: "DDEX ID",
        value: "PADPIDA2007061301U",
      },
      {
        label: "IPR Date",
        value: "2017-09-12",
        type: "date",
      },
    ],
  },
  {
    title: "Contact Details",
    fields: [],
  },
  {
    title: "Web & Address",
    fields: [
      {
        label: "Web Resource URL",
        value: "https://www.scpp.fr",
      },
      {
        label: "Physical Address",
        value:
          "SCPP, 14, Boulevard du Général Leclerc, 92527 Neuilly-Sur-Seine Cedex, France",
      },
    ],
  },
  {
    title: "Exporting",
    fields: [
      {
        label: "Export Options",
        value: "Change status to Exported",
        type: "checkboxGroup",
        options: [
          "Change status to Exported",
          "Split by client",
          "Split by Asset rows",
        ],
      },
    ],
  },
  {
    title: "Deadlines",
    fields: [],
  },
  {
    title: "Field Validation Rules",
    fields: [],
  },
];

interface FormSectionGridProps {
  activeSectionIndex?: number | null;
  isEditing?: boolean;
  /**
   * "view" renders existing CMO data and locks core fields.
   * "create" starts with empty values and unlocks the core fields for initial setup.
   */
  mode?: "view" | "create";
  onCmoNameChange?: (value: string) => void;
  onCmoTypeChange?: (value: string) => void;
}

export default function FormSectionGrid({
  activeSectionIndex: _activeSectionIndex,
  isEditing = false,
  mode = "view",
  onCmoNameChange,
  onCmoTypeChange,
}: FormSectionGridProps) {
  const isCreate = mode === "create";
  return (
    <Box sx={{ flex: 1, pt: 4, pb: 8, display: "flex", flexDirection: "column", gap: 5 }}>
      {sections.map((section) => (
        <Box
          key={section.title}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 3,
            alignItems: "flex-start",
            bgcolor: "white",
            overflow: "hidden",
          }}
        >
          <Box id={sectionId(section.title)} sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="h5">{section.title}</Typography>
          </Box>

          {section.title === "Contact Details" && (
            <ContactsTable isEditing={isEditing} />
          )}

          {section.title === "Deadlines" && (
            <Box sx={{ gridColumn: "1 / -1" }}>
              <DeadlinesSection isEditing={isEditing} />
            </Box>
          )}

          {section.title === "Field Validation Rules" && (
            <Box sx={{ gridColumn: "1 / -1" }}>
              <ValidationRuleEditor isEditing={isEditing} />
            </Box>
          )}

          {section.title === "Exporting" && (
            <>
              <Box sx={{ gridColumn: "1 / -1" }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Template
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    border: "2px dashed",
                    borderColor: "grey.300",
                    borderRadius: 2,
                    textAlign: "center",
                    bgcolor: "grey.50",
                    cursor: "pointer",
                    "&:hover": { borderColor: "grey.400", bgcolor: "grey.100" },
                  }}
                >
                  <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: "grey.500", mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Drag & drop a template file here, or click to browse
                  </Typography>
                  <Button variant="outlined" size="small" sx={{ mt: 1.5 }} disabled={!isEditing}>
                    Upload Template
                  </Button>
                </Paper>
              </Box>

              {!isCreate && (
                <Box sx={{ gridColumn: "1 / -1" }}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}
                  >
                    <InsertDriveFileOutlinedIcon sx={{ color: "grey.600" }} />
                    <Stack sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        scpp_export_template_v3.xlsx
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        24 KB &middot; Uploaded 14 Feb 2025 &middot; by Vitalii Antipa
                      </Typography>
                    </Stack>
                  </Paper>
                </Box>
              )}

              <TextField
                label="Template Comments"
                defaultValue=""
                placeholder="Add notes about this template..."
                variant="standard"
                size="small"
                fullWidth
                multiline
                minRows={2}
                sx={{ gridColumn: "1 / -1" }}
                slotProps={{
                  input: { readOnly: !isEditing },
                }}
              />

            </>
          )}

          {section.fields.map((field) => {
            // In create mode, `lockedAfterSetup` is overridden — initial setup is exactly
            // when those core identity fields need to be editable.
            const lockedNow = !isCreate && !!field.lockedAfterSetup;
            const fieldEditable = isEditing && !lockedNow;
            const defaultValue = isCreate ? "" : field.value;
            const helperText = lockedNow ? "Locked after initial setup" : undefined;

            if (field.type === "boolean") {
              return (
                <FormControlLabel
                  key={field.label}
                  control={
                    <Checkbox
                      defaultChecked={isCreate ? false : field.value === "true"}
                      disabled={!fieldEditable}
                    />
                  }
                  label={field.label}
                  sx={{ color: "text.primary" }}
                />
              );
            }

            if (field.type === "checkboxGroup") {
              const selectedValues = isCreate ? [] : field.value.split(",");
              return (
                <FormControl
                  key={field.label}
                  component="fieldset"
                  sx={{ gridColumn: "1 / -1" }}
                  disabled={!fieldEditable}
                >
                  <FormLabel component="legend" sx={field.label === "Export Options" ? { typography: "h6" } : undefined}>{field.label}</FormLabel>
                  <FormGroup row>
                    {field.options?.map((opt) => (
                      <FormControlLabel
                        key={opt}
                        control={
                          <Checkbox
                            defaultChecked={selectedValues.includes(opt)}
                          />
                        }
                        label={opt}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              );
            }

            if (field.type === "select") {
              const isCountrySelect = field.label === "Home Territory";
              return (
                <TextField
                  key={field.label}
                  select
                  label={field.label}
                  defaultValue={defaultValue}
                  variant="standard"
                  size="small"
                  fullWidth
                  disabled={!fieldEditable}
                  helperText={helperText}
                  slotProps={{
                    input: { readOnly: !fieldEditable },
                  }}
                  onChange={
                    field.label === "Type"
                      ? (e) => onCmoTypeChange?.(e.target.value)
                      : undefined
                  }
                >
                  {field.options?.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {isCountrySelect ? countryLabel(opt) : opt}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }

            if (field.type === "date") {
              return (
                <TextField
                  key={field.label}
                  label={field.label}
                  type="date"
                  defaultValue={defaultValue}
                  variant="standard"
                  size="small"
                  fullWidth
                  disabled={!fieldEditable}
                  helperText={helperText}
                  slotProps={{
                    input: { readOnly: !fieldEditable },
                    inputLabel: { shrink: true },
                  }}
                />
              );
            }

            return (
              <TextField
                key={field.label}
                label={field.label}
                defaultValue={defaultValue}
                variant="standard"
                size="small"
                fullWidth
                disabled={!fieldEditable}
                helperText={helperText}
                slotProps={{
                  input: { readOnly: !fieldEditable },
                }}
                onChange={
                  field.label === "CMO Name"
                    ? (e) => onCmoNameChange?.(e.target.value)
                    : undefined
                }
              />
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

function sectionId(title: string) {
  return title.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-");
}

function countryLabel(code: string): string {
  const match = countries.find((c) => c.code === code);
  return match ? `${match.name} (${match.code})` : code;
}

export { sections, sectionId };
