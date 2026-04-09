import { useState } from "react";
import {
  Box,
  Breadcrumbs,
  InputAdornment,
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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NrAppBar from "../components/NrAppBar";
import { cmos } from "../data/cmoData";
import type { CmoEntry } from "../data/cmoData";

type Order = "asc" | "desc";
type OrderBy = keyof Pick<CmoEntry, "name" | "homeTerritory" | "type">;

interface Props {
  onNavigateToDetail: () => void;
}

export default function CmosOverviewPage({ onNavigateToDetail }: Props) {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<OrderBy>("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const handleSort = (column: OrderBy) => {
    if (orderBy === column) {
      setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setOrderBy(column);
      setOrder("asc");
    }
    setPage(0);
  };

  const filtered = cmos.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const cmp = a[orderBy].localeCompare(b[orderBy]);
    return order === "asc" ? cmp : -cmp;
  });

  const paginated = sorted.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const columns: { id: OrderBy; label: string }[] = [
    { id: "name", label: "CMO" },
    { id: "homeTerritory", label: "Home Territory" },
    { id: "type", label: "CMO Type" },
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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
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
        </Box>

        {/* Table */}
        <TableContainer sx={{ flex: 1 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    sortDirection={orderBy === col.id ? order : false}
                    sx={{ fontWeight: 600, bgcolor: "white" }}
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
              {paginated.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={onNavigateToDetail}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.homeTerritory}</TableCell>
                  <TableCell>{row.type}</TableCell>
                </TableRow>
              ))}

              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    No CMOs match "{search}"
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
