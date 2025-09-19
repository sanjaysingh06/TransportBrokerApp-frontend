import React from "react";
import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Dashboard, Receipt, AccountBalance, Assessment, Book, ListAlt } from "@mui/icons-material";
import { Link, Outlet } from "react-router-dom";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/" },
  { text: "Receipts", icon: <Receipt />, path: "/receipts" },
  { text: "Receipt Report", icon: <ListAlt />, path: "/report" },
  { text: "Accounts", icon: <AccountBalance />, path: "/accounts" },
  // { text: "Account Types", icon: <AccountBalance />, path: "/account-types" },
  { text: "Journal", icon: <Book />, path: "/journal" },
  { text: "Ledger", icon: <ListAlt />, path: "/ledger" },
  // { text: "Ledger Report", icon: <Assessment />, path: "/ledger-report" },
  // { text: "Trial Balance", icon: <Assessment />, path: "/trial-balance" },
];

export default function DashboardLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Transport Broker App
          </Typography>
        </Toolbar>
      </AppBar>

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
      <Box component="main" sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}>
        <Toolbar />
        <Outlet /> {/* <-- Nested routes will render here */}
      </Box>
    </Box>
  );
}
