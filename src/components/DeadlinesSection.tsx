import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import {
  MONTHS,
  REPEAT_OPTIONS,
  type RepeatOption,
  formatNextDue,
} from "../utils/deadlines";

// ─── constants ────────────────────────────────────────────────────────────────

const DEADLINE_TYPES = [
  "Asset registrations",
  "Sales Reports",
  "Lorem ipsum dolor sit amet",
  "Consectetur adipiscing elit",
  "Sed do eiusmod tempor",
];

const DAY_OPTIONS = [
  ...Array.from({ length: 31 }, (_, i) => String(i + 1)),
  "Last day",
];

// ─── types ────────────────────────────────────────────────────────────────────

interface Deadline {
  id: string;
  type: string;
  repeats: RepeatOption;
  month: string;
  day: string;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeDeadline(): Deadline {
  return {
    id: crypto.randomUUID(),
    type: "",
    repeats: "Annually",
    month: "",
    day: "",
  };
}

const INITIAL_DEADLINES: Deadline[] = [
  { id: "1", type: "Asset registrations", repeats: "Annually",    month: "March", day: "31" },
  { id: "2", type: "Sales Reports",       repeats: "Quarterly",   month: "March", day: "Last day" },
];

// ─── component ────────────────────────────────────────────────────────────────

interface Props {
  isEditing: boolean;
}

export default function DeadlinesSection({ isEditing }: Props) {
  const [deadlines, setDeadlines] = useState<Deadline[]>(INITIAL_DEADLINES);

  const update = (id: string, patch: Partial<Deadline>) =>
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...patch } : d))
    );

  const remove = (id: string) =>
    setDeadlines((prev) => prev.filter((d) => d.id !== id));

  const add = () => setDeadlines((prev) => [...prev, makeDeadline()]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {deadlines.map((deadline) => {
        const { date, countdown } = formatNextDue(deadline);
        const showMonth =
          deadline.repeats === "Annually" || deadline.repeats === "Semi-annually";

        return (
          <Box
            key={deadline.id}
            sx={{
              display: "flex",
              alignItems: "flex-end",
              gap: 2,
              border: "1px solid",
              borderColor: "grey.300",
              borderRadius: 1,
              px: 2.5,
              py: 2,
              flexWrap: "wrap",
            }}
          >
            {/* Type */}
            <TextField
              select={isEditing}
              label="Type"
              value={deadline.type}
              onChange={(e) => update(deadline.id, { type: e.target.value })}
              variant="standard"
              size="small"
              sx={{ flex: "1 1 160px", minWidth: 140 }}
              slotProps={{ input: { readOnly: !isEditing } }}
            >
              {DEADLINE_TYPES.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>

            {/* Repeats */}
            <TextField
              select={isEditing}
              label="Repeats"
              value={deadline.repeats}
              onChange={(e) =>
                update(deadline.id, { repeats: e.target.value as RepeatOption })
              }
              variant="standard"
              size="small"
              sx={{ flex: "0 0 140px" }}
              slotProps={{ input: { readOnly: !isEditing } }}
            >
              {REPEAT_OPTIONS.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
              ))}
            </TextField>

            {/* Month — only for Annually / Semi-annually */}
            {showMonth && (
              <TextField
                select={isEditing}
                label="Month"
                value={deadline.month}
                onChange={(e) => update(deadline.id, { month: e.target.value })}
                variant="standard"
                size="small"
                sx={{ flex: "0 0 120px" }}
                slotProps={{ input: { readOnly: !isEditing } }}
              >
                {MONTHS.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </TextField>
            )}

            {/* Day */}
            <TextField
              select={isEditing}
              label={showMonth ? "Day" : "Day of month"}
              value={deadline.day}
              onChange={(e) => update(deadline.id, { day: e.target.value })}
              variant="standard"
              size="small"
              sx={{ flex: "0 0 110px" }}
              slotProps={{ input: { readOnly: !isEditing } }}
            >
              {DAY_OPTIONS.map((d) => (
                <MenuItem key={d} value={d}>{d}</MenuItem>
              ))}
            </TextField>

            {/* Next due — always read-only */}
            <Box sx={{ flex: "0 0 150px", pb: "4px" }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Next due
              </Typography>
              <Typography variant="body2" color="text.primary">
                {date}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {countdown}
              </Typography>
            </Box>

            {/* Delete */}
            {isEditing && (
              <IconButton
                size="small"
                onClick={() => remove(deadline.id)}
                sx={{ mb: "2px", color: "grey.400", "&:hover": { color: "grey.700" } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        );
      })}

      {isEditing && (
        <Button
          variant="text"
          size="medium"
          startIcon={<AddIcon />}
          onClick={add}
          sx={{ alignSelf: "flex-start", mt: 0.5 }}
        >
          Add deadline
        </Button>
      )}
    </Box>
  );
}
