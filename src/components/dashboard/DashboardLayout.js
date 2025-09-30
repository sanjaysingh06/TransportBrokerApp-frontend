import React, { useContext, useState, useMemo } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  IconButton,
} from "@mui/material";
import {
  Dashboard,
  Receipt,
  AccountBalance,
  Assessment,
  Book,
  ListAlt,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; 
import { createTheme, ThemeProvider } from "@mui/material/styles";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/" },
  { text: "Receipts", icon: <Receipt />, path: "/receipts" },
  { text: "Receipt Report", icon: <ListAlt />, path: "/report" },
  { text: "Accounts", icon: <AccountBalance />, path: "/accounts" },
  { text: "Journal", icon: <Book />, path: "/journal" },
  { text: "Ledger", icon: <ListAlt />, path: "/ledger" },
];

export default function DashboardLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Dark/Light Mode State
  const [mode, setMode] = useState("light");

  // ✅ Create theme dynamically
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          ...(mode === "dark"
            ? {
                background: {
                  default: "#121212",
                  paper: "#1d1d1d",
                },
              }
            : {}),
        },
      }),
    [mode]
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        {/* ✅ AppBar with Logout + Dark/Light toggle */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" noWrap component="div">
              Transport Broker App
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton color="inherit" onClick={toggleMode}>
                {mode === "light" ? <DarkMode /> : <LightMode />}
              </IconButton>
              <Button color="inherit" onClick={handleLogout} sx={{ textTransform: "none" }}>
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {menuItems.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton component={Link} to={item.path}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
          <Outlet /> {/* Nested routes render here */}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
