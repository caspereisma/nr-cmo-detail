import {
  AppBar,
  Toolbar,
  Box,
  Tab,
  Tabs,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const navItems = [
  { label: "CMOS", hasDropdown: false },
  { label: "CLIENTS", hasDropdown: true },
  { label: "USER MANAGEMENT", hasDropdown: false },
  { label: "EVENTS", hasDropdown: false },
];

interface NrAppBarProps {
  activeTab?: number;
  onNavClick?: (index: number) => void;
}

export default function NrAppBar({ activeTab = 0, onNavClick }: NrAppBarProps) {
  return (
    <AppBar
      position="static"
      sx={{ bgcolor: "#221c1c", boxShadow: "none" }}
    >
      <Toolbar variant="dense" sx={{ px: 1, minHeight: 48 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1 }}>
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              bgcolor: "black",
              pr: 1,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: 700,
                  fontFamily: "'Nunito Sans', sans-serif",
                }}
              >
                NR
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                sx={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: "1.25px",
                  textTransform: "uppercase",
                  lineHeight: "normal",
                  fontFamily: "'Nunito Sans', sans-serif",
                }}
              >
                neighbouring rights
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  lineHeight: "normal",
                  fontFamily: "'Nunito Sans', sans-serif",
                }}
              >
                Powered by FUGA
              </Typography>
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ width: 32 }} />

          {/* Navigation Tabs */}
          <Tabs
            value={activeTab}
            textColor="inherit"
            TabIndicatorProps={{
              sx: { bgcolor: "#eee", height: 2 },
            }}
            sx={{
              minHeight: 48,
              "& .MuiTab-root": {
                color: "rgba(255,255,255,0.7)",
                minHeight: 48,
                py: 0.5,
                px: 2,
                "&.Mui-selected": {
                  color: "#eee",
                },
              },
            }}
          >
            {navItems.map((item, index) => (
              <Tab
                key={item.label}
                label={item.label}
                icon={
                  item.hasDropdown ? (
                    <ArrowDropDownIcon
                      sx={{ color: "rgba(255,255,255,0.7)" }}
                    />
                  ) : undefined
                }
                iconPosition="end"
                onClick={() => onNavClick?.(index)}
              />
            ))}
          </Tabs>
        </Stack>

        {/* Right side icons */}
        <Stack direction="row">
          <IconButton sx={{ color: "rgba(255,255,255,0.7)" }}>
            <CloudUploadOutlinedIcon />
          </IconButton>
          <IconButton sx={{ color: "rgba(255,255,255,0.7)" }}>
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton sx={{ color: "rgba(255,255,255,0.7)" }}>
            <AccountCircleIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
