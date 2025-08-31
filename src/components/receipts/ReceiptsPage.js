import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Add, Edit, Delete, Refresh } from "@mui/icons-material";
import ReceiptService from "../../services/ReceiptService";
import dayjs from "dayjs";

// Import your ReceiptForm component
import ReceiptForm from "./ReceiptForm";

export default function ReceiptPage() {
  const [receipts, setReceipts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchReceipts = async () => {
    try {
      const res = await ReceiptService.getReceipts();
      setReceipts(res.data || []);
    } catch (err) {
      console.error("Error fetching receipts:", err);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this receipt?")) return;
    try {
      await ReceiptService.deleteReceipt(id);
      fetchReceipts();
    } catch (err) {
      console.error("Error deleting receipt:", err);
    }
  };

  const formatNumber = (v) =>
    v !== null && v !== undefined && !isNaN(v) ? Number(v).toFixed(2) : "0.00";

  const formatDate = (date) => (date ? dayjs(date).format("DD-MM-YYYY") : "-");

  const columns = [
    { field: "date", headerName: "Date", width: 100, renderCell: (params) => formatDate(params.row?.date) },
    { field: "receipt_no", headerName: "Receipt No", width: 90 },
    { field: "transport", headerName: "Transport",width: 130, flex: 1, renderCell: (params) => params.row?.transport_account?.name || "-" },
    { field: "party", headerName: "Party",width: 130, flex: 1, renderCell: (params) => params.row?.party_account?.name || "-" },
    // { field: "delivery_person", headerName: "Delivery Person", width: 130,flex: 1, renderCell: (params) => params.row?.delivery_person?.name || "-" },
    { field: "freight", headerName: "Freight", width: 100, renderCell: (p) => formatNumber(p.row?.freight) },
    { field: "comm", headerName: "Comm", width: 80, renderCell: (p) => formatNumber(p.row?.comm) },
    { field: "cartage", headerName: "Cartage", width: 80, renderCell: (p) => formatNumber(p.row?.cartage) },
    // { field: "labour", headerName: "Labour", width: 100, renderCell: (p) => formatNumber(p.row?.labour) },
    // { field: "other", headerName: "Other", width: 100, renderCell: (p) => formatNumber(p.row?.other) },
    // { field: "delivery_charge", headerName: "Delivery Charge", width: 130, renderCell: (p) => formatNumber(p.row?.delivery_charge) },
    { field: "total", headerName: "Total", width: 100, renderCell: (p) => formatNumber(p.row?.total) },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => {
              setSelectedReceipt(params.row);
              setOpenForm(true);
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDelete(params.row?.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
        <Typography variant="h5">Receipts</Typography>
        <Box>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchReceipts} sx={{ mr: 1 }}>
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedReceipt(null);
              setOpenForm(true);
            }}
          >
            Create
          </Button>
        </Box>
      </Box>

      <Box sx={{ height: 400, width: 950 }}>
        <DataGrid
          rows={receipts}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Receipt Form Modal */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} 
        maxWidth="md" 
        fullWidth
        sx={{
            '& .MuiDialog-paper': { // Target the paper element within the Dialog
            minWidth: '80vw', // Set minimum width to 80% of viewport width
            maxWidth: '90vw', // Set maximum width to 90% of viewport width
            minHeight: '90vh', // Set minimum height to 70% of viewport height
            maxHeight: '90vh', // Set maximum height to 80% of viewport height
            },
        }}
        >
        <DialogTitle>{selectedReceipt ? "Edit Receipt" : "Create Receipt"}</DialogTitle>
        <DialogContent>
          <ReceiptForm
            initialData={selectedReceipt} // ✅ pass as initialData
            onClose={() => setOpenForm(false)}
            onSaved={() => {
              setOpenForm(false);
              fetchReceipts();
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
