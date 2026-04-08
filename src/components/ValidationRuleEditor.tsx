import { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  Chip,
  Checkbox,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  assetFieldNames,
  productFieldNames,
  formatValues,
  validationRules,
  assetFieldFormatMap,
  productFieldFormatMap,
} from "./validationData";

interface FieldValidationRow {
  id: string;
  fieldName: string;
  format: string;
  rules: string[];
  reregister: boolean;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

const sampleAssetRows: FieldValidationRow[] = [
  {
    id: "a1",
    fieldName: "isrcCode",
    format: "ISRC",
    rules: ["Mandatory", "Already exists in catalog"],
    reregister: false,
  },
  {
    id: "a2",
    fieldName: "title",
    format: "string",
    rules: ["Mandatory", "Range=1-300 characters"],
    reregister: false,
  },
];

const sampleProductRows: FieldValidationRow[] = [
  {
    id: "p1",
    fieldName: "Barcode/UPC/EAN",
    format: "UPC",
    rules: ["Mandatory"],
    reregister: false,
  },
];

interface ValidationSubsectionProps {
  title: string;
  fieldNames: string[];
  isEditing: boolean;
  formatMap?: Record<string, string>;
}

function ValidationSubsection({
  title,
  fieldNames,
  isEditing,
  formatMap,
}: ValidationSubsectionProps) {
  const initial =
    title === "Asset" ? sampleAssetRows : sampleProductRows;
  const [rows, setRows] = useState<FieldValidationRow[]>(initial);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: generateId(), fieldName: "", format: "", rules: [], reregister: false },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const updateField = (id: string, value: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const format = formatMap ? (formatMap[value] ?? "") : r.format;
        return { ...r, fieldName: value, format };
      })
    );
  };

  const updateFormat = (id: string, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, format: value } : r))
    );
  };

  const updateRules = (id: string, event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const newRules = typeof value === "string" ? value.split(",") : value;
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, rules: newRules } : r))
    );
  };

  const handleDeleteRule = (rowId: string, rule: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? { ...r, rules: r.rules.filter((ru) => ru !== rule) }
          : r
      )
    );
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>

      <TableContainer sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, width: "25%", py: 2 }}>
                Field Name
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: "20%", py: 2 }}>
                Format
              </TableCell>
              <TableCell sx={{ fontWeight: 600, py: 2 }}>
                Validation Rules
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: 160, py: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  Reregister on update
                  <Tooltip title="Yes=changes the asset status to NOT APPLICABLE when this field is updated after claiming" placement="top">
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.secondary", cursor: "default" }} />
                  </Tooltip>
                </Box>
              </TableCell>
              {isEditing && (
                <TableCell sx={{ fontWeight: 600, width: 48, py: 2 }} />
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} sx={{ verticalAlign: "top" }}>
                {/* Field Name */}
                <TableCell sx={{ py: 2 }}>
                  {isEditing ? (
                    <Select
                      value={row.fieldName}
                      onChange={(e) => updateField(row.id, e.target.value)}
                      variant="standard"
                      size="small"
                      fullWidth
                      displayEmpty
                      renderValue={(val) =>
                        val || (
                          <Typography color="text.disabled" variant="body2">
                            Select field…
                          </Typography>
                        )
                      }
                      sx={{ minHeight: 0 }}
                    >
                      {fieldNames.map((f) => (
                        <MenuItem key={f} value={f}>
                          {f}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Typography variant="body2">
                      {row.fieldName || "—"}
                    </Typography>
                  )}
                </TableCell>

                {/* Format */}
                <TableCell sx={{ py: 2 }}>
                  {isEditing && !formatMap ? (
                    <Select
                      value={row.format}
                      onChange={(e) => updateFormat(row.id, e.target.value)}
                      variant="standard"
                      size="small"
                      fullWidth
                      displayEmpty
                      renderValue={(val) =>
                        val || (
                          <Typography color="text.disabled" variant="body2">
                            Select format…
                          </Typography>
                        )
                      }
                      sx={{ minHeight: 0 }}
                    >
                      {formatValues.map((f) => (
                        <MenuItem key={f} value={f}>
                          {f}
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Typography variant="body2">
                      {row.format || "—"}
                    </Typography>
                  )}
                </TableCell>

                {/* Validation Rules — multi-select with checkmarks + chips */}
                <TableCell sx={{ py: 2 }}>
                  {isEditing ? (
                    <Select
                      multiple
                      value={row.rules}
                      onChange={(e) => updateRules(row.id, e as SelectChangeEvent<string[]>)}
                      variant="standard"
                      size="small"
                      fullWidth
                      displayEmpty
                      renderValue={(selected) =>
                        selected.length === 0 ? (
                          <Typography color="text.disabled" variant="body2">
                            Select rules…
                          </Typography>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                            }}
                          >
                            {selected.map((rule) => (
                              <Chip
                                key={rule}
                                label={rule}
                                size="small"
                                variant="outlined"
                                onDelete={(e) => {
                                  e.stopPropagation();
                                  handleDeleteRule(row.id, rule);
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                              />
                            ))}
                          </Box>
                        )
                      }
                      sx={{ minHeight: 0 }}
                      MenuProps={{
                        PaperProps: { style: { maxHeight: 300 } },
                      }}
                    >
                      {validationRules.map((rule) => (
                        <MenuItem key={rule} value={rule}>
                          <Checkbox
                            checked={row.rules.includes(rule)}
                            size="small"
                          />
                          <ListItemText
                            primary={rule}
                            primaryTypographyProps={{ variant: "body2" }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {row.rules.length > 0
                        ? row.rules.map((rule) => (
                            <Chip
                              key={rule}
                              label={rule}
                              size="small"
                              variant="outlined"
                            />
                          ))
                        : <Typography variant="body2" color="text.disabled">—</Typography>
                      }
                    </Box>
                  )}
                </TableCell>

                {/* Reregister on update */}
                <TableCell sx={{ py: 2 }}>
                  <Checkbox
                    checked={row.reregister}
                    onChange={isEditing ? (e) => setRows((prev) =>
                      prev.map((r) => r.id === row.id ? { ...r, reregister: e.target.checked } : r)
                    ) : undefined}
                    disabled={!isEditing}
                    size="small"
                  />
                </TableCell>

                {/* Delete button */}
                {isEditing && (
                  <TableCell sx={{ py: 2, pr: 0 }}>
                    <IconButton
                      size="small"
                      onClick={() => removeRow(row.id)}
                      sx={{ color: "error.main" }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}

            {/* Add row */}
            {isEditing && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{ borderBottom: "none", p: 2 }}
                >
                  <Button
                    variant="text"
                    size="medium"
                    startIcon={<AddIcon />}
                    onClick={addRow}
                  >
                    Add field rule
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

interface ValidationRuleEditorProps {
  isEditing: boolean;
}

export default function ValidationRuleEditor({
  isEditing,
}: ValidationRuleEditorProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <ValidationSubsection
        title="Asset"
        fieldNames={assetFieldNames}
        isEditing={isEditing}
        formatMap={assetFieldFormatMap}
      />
      <ValidationSubsection
        title="Product"
        fieldNames={productFieldNames}
        isEditing={isEditing}
        formatMap={productFieldFormatMap}
      />
    </Box>
  );
}
