// Not In Use Currently 

import React, { useEffect, useState } from "react";
import AccountService from "../../services/AccountService";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AccountTypeManager = () => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", description: "" });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    const res = await AccountService.getAccountTypes();
    setAccountTypes(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.code) return;

    if (editing) {
      await AccountService.updateAccountType(editing.id, form);
      setEditing(null);
    } else {
      await AccountService.createAccountType(form);
    }

    setForm({ name: "", code: "", description: "" });
    fetchTypes();
  };

  const handleEdit = (type) => {
    setEditing(type);
    setForm({ name: type.name, code: type.code, description: type.description || "" });
  };

  const handleDelete = async (id) => {
    await AccountService.deleteAccountType(id);
    fetchTypes();
  };

  const columns = [
    { field: "code", headerName: "Code", width: 120 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Account Types
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Type Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={1} sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
            >
              {editing ? "Update" : "Add"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={accountTypes}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row.id}
        />
      </Paper>
    </Box>
  );
};

export default AccountTypeManager;
