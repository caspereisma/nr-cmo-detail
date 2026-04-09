import { useMemo, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Chip,
  InputAdornment,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NrAppBar from "../components/NrAppBar";
import { cmos } from "../data/cmoData";
import type { CmoEntry } from "../data/cmoData";
import { nearestDeadline } from "../utils/deadlines";

type Order = "asc" | "desc";
type OrderBy = keyof Pick<CmoEntry, "name" | "homeTerritory" | "type"> | "nextDeadline" | "claimMethods";

interface Props {
  onNavigateToDetail: () => void;
}

function deadlineColor(daysUntil: number): string {
  if (daysUntil <= 31) return "error.main";
  if (daysUntil <= 92) return "warning.main";
  return "text.primary";
}

const HEADER_CELL_SX = {
  fontWeight: 600,
  bgcolor: "white",
  py: "14px",
  px: 2,
  borderBottom: "1px solid",
  borderColor: "divider",
};

const BODY_CELL_SX = { py: "14px", px: 2 };

const DEADLINE_DATE_OPTIONS = [
  { label: "Within 1 month", days: 31 },
  { label: "Within 3 months", days: 92 },
  { label: "Within 6 months", days: 183 },
  { label: "Within 1 year", days: 365 },
];

// ─── FilterChip ───────────────────────────────────────────────────────────────

interface FilterChipProps {
  label: string;
  value: string | null;
  options: string[];
  onSelect: (value: string | null) => void;
}

function FilterChip({ label, value, options, onSelect }: FilterChipProps) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  return (
    <>
      <Chip
        label={value ? `${label}: ${value}` : label}
        variant="outlined"
        size="medium"
        onClick={(e) => setAnchor(e.currentTarget)}
        onDelete={value
          ? () => { onSelect(null); }
          : (e) => setAnchor(e.currentTarget as HTMLElement)
        }
        deleteIcon={value ? undefined : <ArrowDropDownIcon />}
        color={value ? "primary" : "default"}
      />
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        {value && (
          <MenuItem
            onClick={() => { onSelect(null); setAnchor(null); }}
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            Clear
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem
            key={opt}
            selected={opt === value}
            onClick={() => { onSelect(opt); setAnchor(null); }}
            sx={{ fontSize: 14 }}
          >
            {opt}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CmosOverviewPage({ onNavigateToDetail }: Props) {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<OrderBy>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  // Filter state
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterDeadlineDate, setFilterDeadlineDate] = useState<string | null>(null);
  const [filterDeadlineType, setFilterDeadlineType] = useState<string | null>(null);

  // Pre-compute nearest deadline for each CMO
  const cmosWithDeadline = useMemo(
    () => cmos.map((c) => ({ ...c, nearest: nearestDeadline(c.deadlines) })),
    []
  );

  // Collect unique deadline types from data
  const deadlineTypeOptions = useMemo(() => {
    const types = new Set<string>();
    cmos.forEach((c) => c.deadlines.forEach((d) => types.add(d.type)));
    return Array.from(types).sort();
  }, []);

  const hasActiveFilters = filterType !== null || filterDeadlineDate !== null || filterDeadlineType !== null;

  const clearFilters = () => {
    setFilterType(null);
    setFilterDeadlineDate(null);
    setFilterDeadlineType(null);
  };

  const handleSort = (column: OrderBy) => {
    if (orderBy === column) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(column);
      setOrder("asc");
    }
    setPage(0);
  };

  const filtered = cmosWithDeadline.filter((c) => {
    if (!c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType && c.type !== filterType) return false;
    if (filterDeadlineDate) {
      const maxDays = DEADLINE_DATE_OPTIONS.find((o) => o.label === filterDeadlineDate)?.days;
      if (maxDays !== undefined) {
        if (!c.nearest || c.nearest.daysUntil > maxDays) return false;
      }
    }
    if (filterDeadlineType) {
      const hasType = c.deadlines.some((d) => d.type === filterDeadlineType);
      if (!hasType) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (orderBy === "nextDeadline") {
      const da = a.nearest?.daysUntil ?? Infinity;
      const db = b.nearest?.daysUntil ?? Infinity;
      cmp = da - db;
    } else if (orderBy === "claimMethods") {
      cmp = a.claimMethods.join(",").localeCompare(b.claimMethods.join(","));
    } else {
      cmp = a[orderBy].localeCompare(b[orderBy]);
    }
    return order === "asc" ? cmp : -cmp;
  });

  const paginated = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const columns: { id: OrderBy; label: string }[] = [
    { id: "name",          label: "CMO" },
    { id: "homeTerritory", label: "Territory" },
    { id: "type",          label: "CMO Type" },
    { id: "claimMethods",  label: "Supported Claim Methods" },
    { id: "nextDeadline",  label: "Next Deadline" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "white" }}>
      <NrAppBar activeTab={0} />

      <Box sx={{ px: 2, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Page header */}
        <Box sx={{ py: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ "& .MuiBreadcrumbs-separator": { color: "text.secondary" } }}
          >
            <Typography color="text.primary" sx={{ fontSize: "1rem" }}>
              CMOs
            </Typography>
          </Breadcrumbs>

          <Typography variant="h4">CMOs</Typography>

          <TextField
            size="small"
            placeholder="Search CMOs"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            sx={{ width: 280 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Filter row */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
            Filters:
          </Typography>
          <FilterChip
            label="CMO Type"
            value={filterType}
            options={["Rights Holder", "Performer"]}
            onSelect={(v) => { setFilterType(v); setPage(0); }}
          />
          <FilterChip
            label="Deadline date"
            value={filterDeadlineDate}
            options={DEADLINE_DATE_OPTIONS.map((o) => o.label)}
            onSelect={(v) => { setFilterDeadlineDate(v); setPage(0); }}
          />
          <FilterChip
            label="Deadline type"
            value={filterDeadlineType}
            options={deadlineTypeOptions}
            onSelect={(v) => { setFilterDeadlineType(v); setPage(0); }}
          />
          {hasActiveFilters && (
            <Typography
              variant="body2"
              onClick={clearFilters}
              sx={{ ml: 0.5, cursor: "pointer", color: "text.primary", "&:hover": { textDecoration: "underline" } }}
            >
              Clear all
            </Typography>
          )}
        </Box>

        {/* Table */}
        <TableContainer
          sx={{
            flex: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    sortDirection={orderBy === col.id ? order : false}
                    sx={HEADER_CELL_SX}
                  >
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : "asc"}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.map((row) => {
                const nd = row.nearest;
                const color = nd ? deadlineColor(nd.daysUntil) : "text.secondary";
                return (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={onNavigateToDetail}
                    sx={{ cursor: "pointer", "& td": { borderBottom: "none" } }}
                  >
                    <TableCell sx={BODY_CELL_SX}>{row.name}</TableCell>
                    <TableCell sx={BODY_CELL_SX}>{row.territoryCode}</TableCell>
                    <TableCell sx={BODY_CELL_SX}>{row.type}</TableCell>
                    <TableCell sx={BODY_CELL_SX}>{row.claimMethods.join(", ")}</TableCell>
                    <TableCell sx={BODY_CELL_SX}>
                      {nd ? (
                        <Box>
                          <Typography variant="body2" color={color} sx={{ fontWeight: 500 }}>
                            {nd.date}
                          </Typography>
                          <Typography variant="caption" color={color}>
                            {nd.countdown} · {nd.type}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.disabled">—</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: "text.secondary", borderBottom: "none" }}>
                    No CMOs match your filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onPageChange={(_e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>
    </Box>
  );
}
