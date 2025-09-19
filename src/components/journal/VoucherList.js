import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import JournalService from "../../services/JournalService";

const VoucherList = () => {
  const [journals, setJournals] = useState([]);
  const navigate = useNavigate();

  const fetchEntries = async () => {
    try {
      const res = await JournalService.getJournalEntries();
      const voucherTypeDisplayMap = {
        RV: "Receipt",
        PV: "Payment",
        JV: "Journal",
        CN: "Contra",
        DN: "Debit Note",
        CNV: "Credit Note",
      };
      const flattened = res.data.flatMap((entry) =>
        entry.lines.map((line) => ({
          id: `${entry.id}-${line.id}`,
          date: entry.date,
          voucher_no: entry.voucher_no,
          voucher_type: voucherTypeDisplayMap[entry.voucher_type] || "Journal",
          description: entry.narration || "",
          account: line.account_name,
          debit: line.debit,
          credit: line.credit,
          journal_id: entry.id, // For editing/deleting whole voucher
        }))
      );
      setJournals(flattened);
    } catch (error) {
      console.error("Failed to fetch vouchers:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleEdit = (journalId) => {
    // Navigate to edit form with the voucher id
    navigate(`/journal/edit/${journalId}`);
  };

  const handleDelete = async (journalId) => {
    if (window.confirm("Are you sure you want to delete this voucher?")) {
      try {
        await JournalService.deleteJournalEntry(journalId);
        fetchEntries(); // Refresh list
      } catch (error) {
        console.error("Failed to delete voucher:", error);
      }
    }
  };

  const columns = [
    { field: "date", headerName: "Date", flex: 1 },
    { field: "voucher_no", headerName: "Voucher No", flex: 1 },
    { field: "voucher_type", headerName: "VoucherType", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "account", headerName: "Account", flex: 1 },
    { field: "debit", headerName: "Debit", flex: 1, type: "number" },
    { field: "credit", headerName: "Credit", flex: 1, type: "number" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row.journal_id)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.journal_id)}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Vouchers</Typography>
        <Button variant="contained" onClick={() => navigate("/journal/add")}>
          Create
        </Button>
      </Box>

      <div style={{ width: "100%" }}>
        <DataGrid
          rows={journals}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          autoHeight
          showToolbar 
        />
      </div>
    </Box>
  );
};

export default VoucherList;
