import React, { useEffect, useState, useMemo } from "react";
import AccountService from "../../services/AccountService";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CATEGORY_MAP = {
  Party : { typeCode: "ASSET", parentCode: "2100" },
  Transport : { typeCode: "LIAB", parentCode: "1100" },
  Delivery: { typeCode: "LIAB", parentCode: "1200" },
  Income: { typeCode: "INC", parentCode: "501" },
  Expense: { typeCode: "EXP", parentCode: "601" },
};

// 🔹 Helper function to generate account codes
const generateAccountCode = (parentCode, siblings, isTopLevel = false) => {
  if (isTopLevel) {
    if (siblings.length === 0) {
      return parentCode.toString();
    }
    const maxCode = Math.max(...siblings.map((acc) => parseInt(acc.code)));
    return (maxCode + 1).toString();
  } else {
    if (siblings.length === 0) {
      return (parseInt(parentCode) + 1).toString();
    }
    const maxCode = Math.max(...siblings.map((acc) => parseInt(acc.code)));
    return (maxCode + 1).toString();
  }
};

const AccountManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    opening_balance: "0.00",
  });
  const [editing, setEditing] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchAccounts();
    fetchAccountTypes();
  }, []);

  const fetchAccounts = async () => {
    const res = await AccountService.getAccounts();
    setAccounts(res.data);
  };

  const fetchAccountTypes = async () => {
    const res = await AccountService.getAccountTypes();
    setAccountTypes(res.data);
  };

  // Build lookup for account type names (id → name)
  const accountTypeLookup = useMemo(() => {
    const map = {};
    accountTypes.forEach((t) => {
      map[t.id] = t.name;
    });
    return map;
  }, [accountTypes]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) return;

    const { typeCode, parentCode } = CATEGORY_MAP[form.category];
    const typeObj = accountTypes.find((t) => t.code === typeCode);
    if (!typeObj) return showSnackbar("Account type not found", "error");

    let parentAccount = null;
    let newCode = "";

    if (form.category === "Income" || form.category === "Expense") {
      const existingAccounts = accounts.filter(
        (acc) => acc.account_type === typeObj.id
      );
      newCode = generateAccountCode(parentCode, existingAccounts, true);
    } else {
      parentAccount = accounts.find((acc) => acc.code === parentCode);
      const siblings = accounts.filter((acc) => acc.parent === parentAccount?.id);
      newCode = generateAccountCode(parentCode, siblings, false);
    }

    const payload = {
      name: form.name,
      account_type: typeObj.id,
      parent: parentAccount?.id || null,
      code: newCode,
      opening_balance: form.opening_balance,
    };

    try {
      if (editing) {
        await AccountService.updateAccount(editing.id, payload);
        showSnackbar("Account updated successfully!");
        setEditing(null);
      } else {
        await AccountService.createAccount(payload);
        showSnackbar("Account created successfully!");
      }
      setForm({ name: "", category: "", opening_balance: "0.00" });
      fetchAccounts();
    } catch (error) {
      showSnackbar(
        error.response?.data?.error || "Failed to save account",
        "error"
      );
    }
  };

  const handleEdit = (account) => {
    setEditing(account);
    const category = Object.keys(CATEGORY_MAP).find(
      (key) => CATEGORY_MAP[key].typeCode === account.account_type_code
    );
    setForm({
      name: account.name,
      category: category || "",
      opening_balance: account.opening_balance,
    });
  };

  const handleDelete = async (id) => {
    try {
      await AccountService.deleteAccount(id);
      fetchAccounts();
      showSnackbar("Account deleted successfully!");
    } catch (error) {
      showSnackbar(
        error.response?.data?.error || "Failed to delete account",
        "error"
      );
    }
  };

  const columns = [
    { field: "code", headerName: "Code", width: 120 },
    { field: "name", headerName: "Name", width: 200 },
    {
      field: "account_type",
      headerName: "Type",
      width: 150,
      renderCell: (params) => accountTypeLookup[params.value] || params.value,
    },
    {
      field: "parent_name",
      headerName: "Parent",
      width: 200,
      renderCell: (params) =>
        params.row.parent_name ||
        (params.row.account_type ===
        accountTypes.find((t) => t.code === "INC")?.id
          ? "-"
          : params.row.account_type ===
            accountTypes.find((t) => t.code === "EXP")?.id
          ? "-"
          : ""),
    },
    {
      field: "opening_balance",
      headerName: "Opening Balance",
      width: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            color: Number(params.value) < 0 ? "red" : "green",
            fontWeight: "bold",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" gutterBottom>
        Accounts
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm:3 }}>
            <TextField
              fullWidth
              label="Account Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Grid>

          <Grid size={{ xs: 12, sm:3}}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                label="Category"
              >
                {Object.keys(CATEGORY_MAP).map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm:3}}>
            <TextField
              fullWidth
              type="number"
              label="Opening Balance"
              value={form.opening_balance}
              onChange={(e) =>
                setForm({ ...form, opening_balance: e.target.value })
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm:3}}>
            <Button
              sx={{ height: "100%" }}
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
            >
              {editing ? "Update Account" : "Add Account"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ height: 400 }}>
        <DataGrid
          rows={accounts}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          getRowId={(row) => row.id}
          showToolbar 
        />
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AccountManager;
