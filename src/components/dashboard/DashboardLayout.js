import React, { useContext } from "react";
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
} from "@mui/material";
import {
  Dashboard,
  Receipt,
  AccountBalance,
  Assessment,
  Book,
  ListAlt,
} from "@mui/icons-material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // ✅ import context

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* ✅ AppBar with Logout */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            Transport Broker App
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ textTransform: "none" }}
          >
            Logout
          </Button>
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
  );
}
