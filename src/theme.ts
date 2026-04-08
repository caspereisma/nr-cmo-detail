import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#424242",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "rgba(0,0,0,0.87)",
      secondary: "rgba(0,0,0,0.6)",
      disabled: "rgba(0,0,0,0.38)",
    },
    divider: "rgba(0,0,0,0.12)",
  },
  typography: {
    fontFamily: "'Nunito Sans', sans-serif",
    h4: {
      fontSize: "2.125rem",
      fontWeight: 400,
      lineHeight: 1.235,
      letterSpacing: "0.25px",
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: "0.15px",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0.15px",
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: "0.15px",
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: "24px",
      letterSpacing: "0.4px",
      textTransform: "uppercase",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: "0.4px",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          minHeight: 63,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "'Nunito Sans', sans-serif",
          fontWeight: 500,
          fontSize: "0.875rem",
          letterSpacing: "0.4px",
          textTransform: "uppercase",
          minHeight: 42,
        },
      },
    },
  },
});

export default theme;
