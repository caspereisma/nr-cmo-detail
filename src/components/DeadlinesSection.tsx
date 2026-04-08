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

// ─── constants ────────────────────────────────────────────────────────────────

const DEADLINE_TYPES = [
  "Asset registrations",
  "Sales Reports",
  "Lorem ipsum dolor sit amet",
  "Consectetur adipiscing elit",
  "Sed do eiusmod tempor",
];

const REPEAT_OPTIONS = ["Annually", "Semi-annually", "Quarterly", "Monthly"] as const;
type RepeatOption = (typeof REPEAT_OPTIONS)[number];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
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
  month: string;  // used by Annually, Semi-annually
  day: string;    // used by all
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function nextDueDate(d: Deadline): Date | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthIdx = MONTHS.indexOf(d.month);
  const dayNum = (m: number, y: number) =>
    d.day === "Last day"
      ? new Date(y, m + 1, 0).getDate()
      : Math.min(parseInt(d.day), new Date(y, m + 1, 0).getDate());

  if (d.repeats === "Annually") {
    const y = today.getFullYear();
    let next = new Date(y, monthIdx, dayNum(monthIdx, y));
    if (next <= today) next = new Date(y + 1, monthIdx, dayNum(monthIdx, y + 1));
    return next;
  }

  if (d.repeats === "Semi-annually") {
    const y = today.getFullYear();
    const candidates = [
      new Date(y, monthIdx, dayNum(monthIdx, y)),
      new Date(y, monthIdx + 6, dayNum(monthIdx + 6, y)),
      new Date(y + 1, monthIdx, dayNum(monthIdx, y + 1)),
    ];
    return candidates.find((c) => c > today) ?? candidates[2];
  }

  if (d.repeats === "Quarterly") {
    const quarterEnds = [2, 5, 8, 11]; // Mar, Jun, Sep, Dec
    const y = today.getFullYear();
    for (const m of quarterEnds) {
      const c = new Date(y, m, dayNum(m, y));
      if (c > today) return c;
    }
    return new Date(y + 1, 2, dayNum(2, y + 1));
  }

  if (d.repeats === "Monthly") {
    const y = today.getFullYear();
    const m = today.getMonth();
    let c = new Date(y, m, dayNum(m, y));
    if (c <= today) c = new Date(y, m + 1, dayNum(m + 1, y));
    return c;
  }

  return null;
}

function formatNextDue(d: Deadline): { date: string; countdown: string } {
  const next = nextDueDate(d);
  if (!next) return { date: "—", countdown: "" };

  const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dateStr = `${next.getDate()} ${MONTH_ABBR[next.getMonth()]} ${next.getFullYear()}`;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((next.getTime() - today.getTime()) / 86_400_000);

  let countdown =
    diffDays === 0 ? "today"
    : diffDays === 1 ? "tomorrow"
    : diffDays < 0 ? `${Math.abs(diffDays)}d overdue`
    : `in ${diffDays}d`;

  return { date: dateStr, countdown };
}

function makeDeadline(): Deadline {
  return {
    id: crypto.randomUUID(),
    type: "Asset registrations",
    repeats: "Annually",
    month: "March",
    day: "31",
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
          startIcon={<AddIcon />}
          size="small"
          onClick={add}
          sx={{ alignSelf: "flex-start", mt: 0.5, color: "primary.main" }}
        >
          Add deadline
        </Button>
      )}
    </Box>
  );
}
