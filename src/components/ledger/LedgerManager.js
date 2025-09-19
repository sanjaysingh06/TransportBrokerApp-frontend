import React, { useEffect, useState, useMemo } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Autocomplete,
} from "@mui/material";
import AccountService from "../../services/AccountService";
import LedgerService from "../../services/LedgerService";

const LedgerManager = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch accounts & journal entries
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const [accountsRes, entriesRes] = await Promise.all([
        AccountService.getAccounts(),
        LedgerService.getLedgerEntries(),
      ]);

      // ✅ filter only leaf accounts (exclude parent/system grouping accounts)
      const filteredAccounts = accountsRes.data.filter(
        (acc) =>
          !accountsRes.data.some((child) => child.parent === acc.id) // no children
      );

      setAccounts(filteredAccounts);
      setJournalEntries(entriesRes);
    } catch (err) {
      console.error("Failed to fetch ledger data:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);



  // Compute ledger with adjusted opening balance
  const { ledger, openingBalance, totalDebit, totalCredit, closingBalance } =
    useMemo(() => {
      if (!selectedAccount) {
        return {
          ledger: [],
          openingBalance: 0,
          totalDebit: 0,
          totalCredit: 0,
          closingBalance: 0,
        };
      }

      const accountId = parseInt(selectedAccount.id);
      let baseOpeningBalance = parseFloat(selectedAccount.opening_balance || 0);

      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      if (startDate) {
        journalEntries.forEach((entry) => {
          const entryDate = new Date(entry.date);
          if (entryDate < startDate) {
            entry.lines.forEach((line) => {
              if (line.account === accountId) {
                baseOpeningBalance += parseFloat(line.debit || 0);
                baseOpeningBalance -= parseFloat(line.credit || 0);
              }
            });
          }
        });
      }

      let balance = baseOpeningBalance;
      let totalDebit = 0;
      let totalCredit = 0;

      const entries = journalEntries.filter((entry) => {
        const entryDate = new Date(entry.date);
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        if (startDate && entryDate < startDate) return false;
        if (endDate && entryDate > endDate) return false;
        return true;
      });

      let lines = [];
      entries.forEach((entry) => {
        entry.lines.forEach((line) => {
          if (line.account === accountId) {
            const debit = parseFloat(line.debit || 0);
            const credit = parseFloat(line.credit || 0);
            totalDebit += debit;
            totalCredit += credit;
            balance += debit - credit;
            lines.push({
              id: `${entry.id}-${line.id}`,
              date: entry.date,
              voucher_no: entry.voucher_no,
              debit,
              credit,
              balance,
            });
          }
        });
      });

      lines.sort((a, b) => new Date(a.date) - new Date(b.date));

      if (search.trim() !== "") {
        const term = search.toLowerCase();
        lines = lines.filter((line) =>
          [line.date, line.voucher_no]
            .some((f) => f && f.toLowerCase().includes(term)) ||
          [line.debit, line.credit, line.balance]
            .some((num) => num.toString().includes(term))
        );
      }

      return {
        ledger: lines,
        openingBalance: baseOpeningBalance,
        totalDebit,
        totalCredit,
        closingBalance: balance,
      };
    }, [selectedAccount, journalEntries, dateRange, search]);

  // DataGrid columns (fit full width)
  const columns = [
    { field: "date", headerName: "Date", flex: 1, minWidth: 120 },
    { field: "voucher_no", headerName: "Voucher No", flex: 1, minWidth: 140 },
    {
      field: "debit",
      headerName: "Debit (₹)",
      flex: 1,
      minWidth: 120,
      align: "right",
      headerAlign: "right",
      valueFormatter: (params) => params.value?.toFixed(2),
    },
    {
      field: "credit",
      headerName: "Credit (₹)",
      flex: 1,
      minWidth: 120,
      align: "right",
      headerAlign: "right",
      valueFormatter: (params) => params.value?.toFixed(2),
    },
    {
      field: "balance",
      headerName: "Balance (₹)",
      flex: 1,
      minWidth: 140,
      align: "right",
      headerAlign: "right",
      valueFormatter: (params) => params.value?.toFixed(2),
      cellClassName: (params) =>
        params.value >= 0 ? "text-green-600" : "text-red-600",
    },
  ];

  return (
    <Box p={1}>
      <Typography variant="h5" gutterBottom>
        📒 Ledger
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm:4 }}>
            <Autocomplete
              options={accounts}
              getOptionLabel={(option) => option.name || ""}
              value={selectedAccount}
              onChange={(e, newValue) => setSelectedAccount(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Search Account" fullWidth />
              )}
            />
          </Grid>

          <Grid size={{ xs: 6, sm:4}}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
          </Grid>

          <Grid size={{ xs: 6, sm:4 }}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
            />
          </Grid>
          </Grid>

          {/* Ledger Summary */}
          {selectedAccount && (
            // <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2} alignItems="center" sx={{my: 2 }}>
  <Grid size={{ xs: 12, md: 3 }}>
    <Box
      sx={{
        p: 2,
        bgcolor: "grey.100",
        borderRadius: 1,
        textAlign: "center",
      }}
    >
      <Box sx={{ fontSize: "0.8rem", color: "text.secondary" }}>Opening Balance</Box>
      <Box
        sx={{
          fontWeight: "bold",
          fontSize: "1.2rem",
          color: openingBalance >= 0 ? "green" : "red",
        }}
      >
        ₹ {openingBalance.toFixed(2)}
      </Box>
    </Box>
  </Grid>

  <Grid size={{ xs: 12, md: 3 }}>
    <Box
      sx={{
        p: 2,
        bgcolor: "grey.100",
        borderRadius: 1,
        textAlign: "center",
      }}
    >
      <Box sx={{ fontSize: "0.8rem", color: "text.secondary" }}>Total Debit</Box>
      <Box sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>₹ {totalDebit.toFixed(2)}</Box>
    </Box>
  </Grid>

  <Grid size={{ xs: 12, md: 3 }}>
    <Box
      sx={{
        p: 2,
        bgcolor: "grey.100",
        borderRadius: 1,
        textAlign: "center",
      }}
    >
      <Box sx={{ fontSize: "0.8rem", color: "text.secondary" }}>Total Credit</Box>
      <Box sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>₹ {totalCredit.toFixed(2)}</Box>
    </Box>
  </Grid>

  <Grid size={{ xs: 12, md: 3 }}>
    <Box
      sx={{
        p: 2,
        bgcolor: "grey.100",
        borderRadius: 1,
        textAlign: "center",
      }}
    >
      <Box sx={{ fontSize: "0.8rem", color: "text.secondary" }}>Closing Balance</Box>
      <Box
        sx={{
          fontWeight: "bold",
          fontSize: "1.2rem",
          color: closingBalance >= 0 ? "green" : "red",
        }}
      >
        ₹ {closingBalance.toFixed(2)}
      </Box>
    </Box>
  </Grid>
</Grid>

            // </Grid>
          )}
        {/* </Grid> */}
      </Paper>

      {/* <TextField
            label="Search Transactions"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}

      {/* Ledger DataGrid */}
      <Paper sx={{ height: 400, width: "100%", mb: 2 }}>
        <DataGrid
          rows={ledger}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          getRowId={(row) => row.id}
          showToolbar 
        />
      </Paper>

      
    </Box>
  );
};

export default LedgerManager;
