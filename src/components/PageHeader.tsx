import {
  Box,
  Breadcrumbs,
  Button,
  Link,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

function formatType(raw: string): string {
  return raw
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

interface PageHeaderProps {
  activeTab: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  cmoName: string;
  cmoType: string;
  onBackToOverview?: () => void;
}

export default function PageHeader({
  activeTab,
  onTabChange,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  cmoName,
  cmoType,
  onBackToOverview,
}: PageHeaderProps) {
  const displayType = formatType(cmoType);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Box sx={{ py: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {/* Breadcrumbs */}
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              sx={{
                "& .MuiBreadcrumbs-separator": {
                  color: "text.secondary",
                },
              }}
            >
              <Link
                underline="hover"
                color="text.primary"
                href="#"
                sx={{ fontSize: "1rem", cursor: "pointer" }}
                onClick={(e) => { e.preventDefault(); onBackToOverview?.(); }}
              >
                CMOs Catalog
              </Link>
              <Link
                underline="hover"
                color="text.primary"
                href="#"
                sx={{ fontSize: "1rem" }}
              >
                {cmoName}
              </Link>
            </Breadcrumbs>

            {/* Title derived from CMO Name + Type fields */}
            <Typography variant="h4">
              {cmoName} ({displayType})
            </Typography>
          </Box>

          {/* Edit / Save+Cancel buttons */}
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            {isEditing ? (
              <>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={onSave}
                >
                  Save
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={onEdit}
              >
                Edit
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Detail Tabs */}
      <Tabs
        value={activeTab}
        onChange={onTabChange}
        textColor="primary"
        indicatorColor="primary"
        TabIndicatorProps={{
          sx: { bgcolor: "#424242", height: 2 },
        }}
        sx={{
          minHeight: 42,
          "& .MuiTab-root": {
            minHeight: 42,
            py: "9px",
            px: 2,
          },
        }}
      >
        <Tab label="MAIN DETAILS" />
        <Tab label="CLIENT REGISTRATIONS" disabled />
        <Tab label="ASSET REGISTRATIONS" />
      </Tabs>
    </Box>
  );
}
