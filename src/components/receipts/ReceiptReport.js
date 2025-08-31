import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Box,
  Typography,
  Autocomplete,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import ReceiptService from "../../services/ReceiptService";
import AccountService from "../../services/AccountService";
import dayjs from "dayjs";



// Excel & PDF
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Create a custom styled TextField
const ExtraSmallTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "35px", // control total height
    fontSize: "0.85rem", // smaller font
    padding: "0 8px", // reduce padding
  },
  "& .MuiInputBase-input": {
    padding: "6px 8px", // reduce input text padding
  },
  "& .MuiFormLabel-root": {
    fontSize: "0.85rem", // smaller label
    
  },
}));


export default function ReceiptReport() {
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [filters, setFilters] = useState({
    party_account: "",
    transport_account: "",
    delivery_person: "",
    payment_type: "",
    date__gte: "",
    date__lte: "",
    search: "",
  });

  // Fetch accounts once
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await AccountService.getAccounts();
        setAccounts(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch accounts:", err);
      }
    };
    fetchAccounts();
  }, []);

  const transportAccounts = accounts.filter((a) => a.account_type === 4);
  const partyAccounts = accounts.filter((a) => a.account_type === 3);
  const deliveryAccounts = accounts.filter((a) => a.account_type === 5);

  // Fetch receipts from API with optional filters
  const fetchReceipts = async (appliedFilters = filters) => {
    try {
      let query = [];
      if (appliedFilters.party_account) query.push(`party_account=${appliedFilters.party_account}`);
      if (appliedFilters.transport_account) query.push(`transport_account=${appliedFilters.transport_account}`);
      if (appliedFilters.delivery_person) query.push(`delivery_person=${appliedFilters.delivery_person}`);
      if (appliedFilters.payment_type) query.push(`payment_type=${appliedFilters.payment_type}`);
      if (appliedFilters.date__gte) query.push(`date__gte=${appliedFilters.date__gte}`);
      if (appliedFilters.date__lte) query.push(`date__lte=${appliedFilters.date__lte}`);

      const queryString = query.length ? `?${query.join("&")}` : "";
      console.log("🔍 API Query:", queryString);

      const res = await ReceiptService.getReceipts(queryString);
      setReceipts(res.data || []);
      setFilteredReceipts(res.data || []);
    } catch (err) {
      console.error("Error fetching receipts:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReceipts();
  }, []);

  // Apply filters on button click
  const handleSearch = () => {
    fetchReceipts();
  };

  // Reset filters and fetch all receipts
  const handleResetFilters = () => {
    const resetFilters = {
      party_account: "",
      transport_account: "",
      delivery_person: "",
      payment_type: "",
      date__gte: "",
      date__lte: "",
      search: "",
    };
    setFilters(resetFilters);
    fetchReceipts(resetFilters);
  };

  // Client-side live search
  useEffect(() => {
    if (!filters.search) {
      setFilteredReceipts(receipts);
    } else {
      const searchText = filters.search.toLowerCase();
      const result = receipts.filter((r) =>
        JSON.stringify(r).toLowerCase().includes(searchText)
      );
      setFilteredReceipts(result);
    }
  }, [filters.search, receipts]);

  // Helpers
  const formatDate = (date) => (date ? dayjs(date).format("DD-MM-YYYY") : "-");
  const formatNumber = (v) =>
    v !== null && v !== undefined && !isNaN(v) ? Number(v).toFixed(2) : "0.00";

  const columns = [
    { field: "date", headerName: "Date", width: 100, renderCell: (p) => formatDate(p.row?.date) },
    { field: "receipt_no", headerName: "Receipt No", width: 100 },
    { field: "transport", headerName: "Transport", flex: 1, renderCell: (p) => p.row?.transport_account?.name || "-" },
    { field: "party", headerName: "Party", flex: 1, renderCell: (p) => p.row?.party_account?.name || "-" },
    { field: "delivery_person", headerName: "Delivery", flex: 1, renderCell: (p) => p.row?.delivery_person?.name || "-" },
    { field: "total", headerName: "Total", width: 120, renderCell: (p) => formatNumber(p.row?.total) },
    { field: "payment_type", headerName: "Payment", width: 120 },
  ];

  // Export Excel
  const exportExcel = () => {
    const data = filteredReceipts.map((r) => ({
      Date: formatDate(r.date),
      "Receipt No": r.receipt_no,
      Transport: r.transport_account?.name || "-",
      Party: r.party_account?.name || "-",
      Delivery: r.delivery_person?.name || "-",
      Total: formatNumber(r.total),
      Payment: r.payment_type,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Receipts");
    XLSX.writeFile(wb, "ReceiptReport.xlsx");
  };

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Date", "Receipt No", "Transport", "Party", "Delivery", "Total", "Payment"];
    const tableRows = filteredReceipts.map((r) => [
      formatDate(r.date),
      r.receipt_no,
      r.transport_account?.name || "-",
      r.party_account?.name || "-",
      r.delivery_person?.name || "-",
      formatNumber(r.total),
      r.payment_type,
    ]);
    doc.autoTable({ head: [tableColumn], body: tableRows });
    doc.save("ReceiptReport.pdf");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Receipt Report</Typography>

      
      <Grid container spacing={2} sx={{ mb: 2 }}>

        {/* Live search */}
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            label="Live Search"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            fullWidth
            id="outlined-size-small" 
            size="small"
          />
        </Grid>

        {/* Party Account */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Autocomplete
            options={partyAccounts}
            getOptionLabel={(option) => option.name}
            value={partyAccounts.find((acc) => acc.id === filters.party_account) || null}
            onChange={(e, newValue) => setFilters((prev) => ({ ...prev, party_account: newValue ? newValue.id : "" }))}
            renderInput={(params) => <TextField {...params} label="Party" fullWidth id="outlined-size-small" size="small"/>}
          />
        </Grid>

        {/* Transport Account */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Autocomplete
            options={transportAccounts}
            getOptionLabel={(option) => option.name}
            value={transportAccounts.find((acc) => acc.id === filters.transport_account) || null}
            onChange={(e, newValue) => setFilters((prev) => ({ ...prev, transport_account: newValue ? newValue.id : "" }))}
            renderInput={(params) => <TextField {...params} label="Transport" fullWidth id="outlined-size-small" size="small"/>}
          />
        </Grid>

        {/* Delivery Person */}
        <Grid size={{ xs: 12, md: 2 }}>
          <Autocomplete
            options={deliveryAccounts}
            getOptionLabel={(option) => option.name}
            value={deliveryAccounts.find((acc) => acc.id === filters.delivery_person) || null}
            onChange={(e, newValue) => setFilters((prev) => ({ ...prev, delivery_person: newValue ? newValue.id : "" }))}
            renderInput={(params) => <TextField {...params} label="Delivery Person" fullWidth id="outlined-size-small" size="small"/>}
          />
        </Grid>

        {/* Payment */}
        {/* <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            select
            label="Payment"
            value={filters.payment_type}
            onChange={(e) => setFilters({ ...filters, payment_type: e.target.value })}
            fullWidth
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="bank">Bank</MenuItem>
            <MenuItem value="upi">UPI</MenuItem>
          </TextField>
        </Grid> */}

        {/* Start Date */}
        <Grid item size={{ xs: 12, md: 2 }}>
          <TextField
            type="date"
            label="Start Date"
            InputLabelProps={{ shrink: true }}
            value={filters.date__gte}
            onChange={(e) => setFilters({ ...filters, date__gte: e.target.value })}
            fullWidth
            id="outlined-size-small" 
            size="small"
          />
        </Grid>

        {/* End Date */}
        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            type="date"
            label="End Date"
            InputLabelProps={{ shrink: true }}
            value={filters.date__lte}
            onChange={(e) => setFilters({ ...filters, date__lte: e.target.value })}
            fullWidth
            id="outlined-size-small" 
            size="small"
          />
        </Grid>

        {/* Buttons */}
        
        <Grid size={{ xs: 12, md: 6}}>
          <Button variant="outlined" onClick={handleResetFilters} fullWidth>Reset Filters</Button>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Button variant="contained" onClick={handleSearch} fullWidth>Apply Filters</Button>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Button variant="contained" color="success" onClick={exportExcel} fullWidth>Export Excel</Button>
        </Grid>
        <Grid size={{ xs: 12, md: 6}}>
          <Button variant="contained" color="error" onClick={exportPDF} fullWidth>Export PDF</Button>
        </Grid>

        
      </Grid>

      {/* DataGrid */}
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={filteredReceipts}
          columns={columns}
          getRowId={(row) => row.id}
          pageSizeOptions={[5, 10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}
