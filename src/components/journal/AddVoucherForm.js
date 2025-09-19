import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import AccountService from "../../services/AccountService";
import JournalService from "../../services/JournalService";

const AddVoucherForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // voucher ID for edit mode

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    narration: "",
    type: "Receipt",
    cash_account: "",
    party_account: "",
    debit_account: "",
    credit_account: "",
    amount: 0,
  });

  const [voucherNo, setVoucherNo] = useState(""); // unified voucher number
  const [partyAccounts, setPartyAccounts] = useState([]);
  const [isNarrationEdited, setIsNarrationEdited] = useState(false);

  const narrationTemplates = {
    Receipt: "Receipt from {party} on {date}",
    Payment: "Payment to {party} on {date}",
    Income: "Income received on {date}",
    Expense: "Expense paid on {date}",
    Journal: "Journal entry on {date}",
  };

  const cashAccounts = [
    { id: 1, name: "CASH IN HAND" },
    { id: 2, name: "BANK ACCOUNT" },
  ];

  // Auto-generate narration if not manually edited
  useEffect(() => {
    if (!isNarrationEdited) {
      const template = narrationTemplates[form.type] || "";
      const partyName =
        partyAccounts.find((a) => a.id === form.party_account)?.name || "";
      const formattedDate = new Date(form.date).toLocaleDateString();
      const defaultNarration = template
        .replace("{party}", partyName)
        .replace("{date}", formattedDate);
      setForm((prev) => ({ ...prev, narration: defaultNarration }));
    }
  }, [form.type, form.party_account, form.date, partyAccounts, isNarrationEdited]);

  // Fetch accounts & voucher number
  useEffect(() => {
    if (form.type === "Receipt" || form.type === "Payment") fetchPartyAccounts();

    if (!id) {
      fetchNextVoucher(); // only for new voucher
    }
  }, [form.type]);

  // Fetch voucher for edit mode
  useEffect(() => {
    if (id) {
      JournalService.getJournalEntry(id)
        .then((res) => {
          const entry = res.data;

          // find cash/bank line
          const cashLine = entry.lines.find((l) => {
            if (entry.voucher_type === "RV" || entry.voucher_type === "JV")
              return l.debit > 0;
            if (entry.voucher_type === "PV") return l.credit > 0;
            return l.debit > 0;
          });

          const counterLine = entry.lines.find((l) => l.id !== cashLine?.id);

          setForm({
            date: entry.date,
            narration: entry.narration,
            type: mapVoucherType(entry.voucher_type),
            cash_account: cashLine?.account || "",
            party_account: counterLine?.account || "",
            amount: cashLine?.debit > 0 ? cashLine.debit : cashLine?.credit || 0,
          });

          setVoucherNo(entry.voucher_no); // set correct voucher number for edit
          setIsNarrationEdited(true); // don’t overwrite narration with template
        })
        .catch((err) => console.error("Failed to fetch voucher:", err));
    }
  }, [id]);

  const mapVoucherType = (voucher_type) => {
    const map = { RV: "Receipt", PV: "Payment",JV: "Journal"  };
    return map[voucher_type] || "Receipt";
  };

  // Utility: get only leaf accounts (no children)
  const getLeafAccounts = (accounts, type) => {
    const parentIds = new Set(accounts.map(acc => acc.parent).filter(Boolean));
    return accounts.filter(acc => {
      if (acc.account_type !== type) return false;
      if (!acc.is_active) return false;
      if (parentIds.has(acc.id)) return false; // exclude parents
      return true;
    });
  };

  const fetchPartyAccounts = async () => {
    try {
      const res = await AccountService.getAccounts();
      const accounts = res.data;

      let filtered = [];

      if (form.type === "Receipt") {
        // Party Accounts (type=1) + Income Accounts (type=3)
        const receivables = getLeafAccounts(accounts, 1);
        const income = getLeafAccounts(accounts, 3);
        filtered = [...receivables, ...income];
      } 
      else if (form.type === "Payment") {
        // Payables (type=2) + Expense Accounts (type=4)
        const payables = getLeafAccounts(accounts, 2);
        const expenses = getLeafAccounts(accounts, 4);
        filtered = [...payables, ...expenses];
      } 
      else if (form.type === "Income") {
        // Only income accounts
        filtered = getLeafAccounts(accounts, 3);
      } 
      else if (form.type === "Expense") {
        // Only expense accounts
        filtered = getLeafAccounts(accounts, 4);
      }
      else if (form.type === "Journal") {
        // All leaf accounts except Party, Transport, Delivery parents
        const leafAccounts = accounts.filter(acc => {
          return acc.is_active &&
                acc.parent !== null && // only child accounts
                !["Party Accounts", "Transport Account", "Delivery Account"].includes(acc.name);
        });
        filtered = leafAccounts;
      }

      setPartyAccounts(filtered);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    }
  };


  const fetchNextVoucher = async () => {
    try {
      const res = await JournalService.getNextVoucher(form.type);
      setVoucherNo(res.data.next_voucher_no);
    } catch (error) {
      console.error("Failed to fetch next voucher number:", error);
    }
  };

  
  const handleSave = async () => {
    if (!form.amount || !form.narration || !form.cash_account) {
      alert("Please fill all required fields!");
      return;
    }

    let counterAccountId = null;
    if (form.type === "Income") counterAccountId = 3; // TODO: replace hardcoded IDs
    if (form.type === "Expense") counterAccountId = 4;
    if (form.type === "Receipt" || form.type === "Payment")
      counterAccountId = parseInt(form.party_account);

    if (!counterAccountId) {
      alert("Counterparty account not found!");
      return;
    }

    const amount = parseFloat(form.amount);
    const cashAccId = parseInt(form.cash_account);
    let lines = [];

    switch (form.type) {
      case "Receipt":
      case "Income":
        lines = [
          { account: cashAccId, debit: amount, credit: 0 },
          { account: counterAccountId, debit: 0, credit: amount },
        ];
        break;
      case "Payment":
      case "Expense":
        lines = [
          { account: counterAccountId, debit: amount, credit: 0 },
          { account: cashAccId, debit: 0, credit: amount },
        ];
        break;
      case "Journal":
        if (!form.debit_account || !form.credit_account) {
          alert("Please select both Debit and Credit accounts!");
          return;
        }
        lines = [
          { account: parseInt(form.debit_account), debit: amount, credit: 0 },
          { account: parseInt(form.credit_account), debit: 0, credit: amount },
        ];
        break;
      default:
        alert("Invalid voucher type!");
        return;
    }

    const voucherTypeMap = {
      Receipt: "RV",
      Payment: "PV",
      Journal: "JV",
      Expense: "JV",
    };
    const payload = {
      date: form.date,
      narration: form.narration,
      voucher_type: voucherTypeMap[form.type] || "JV",
      lines,
    };

    try {
      if (id) {
        await JournalService.updateJournalEntry(id, payload);
        alert("Voucher updated successfully!");
      } else {
        const res = await JournalService.createJournalEntry(payload);
        alert(
          `Voucher saved successfully! Voucher No: ${res.data.voucher_no}`
        );
      }
      navigate("/journal"); // back to list
    } catch (error) {
      console.error(
        "Failed to save voucher:",
        error.response?.data || error.message
      );
      alert(
        "Error saving voucher: " +
          JSON.stringify(error.response?.data || error.message)
      );
    }
  };

  return (
    <Box>
      {/* Title */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{id ? "Edit Voucher" : "New Voucher"}</Typography>
      </Box>

      {/* Form Fields */}
      <Grid container spacing={2}>
        {/* Voucher No */}
        <Grid size={{ xs: 6, sm: 4 }}>
          <TextField
            label="Voucher No"
            fullWidth
            value={voucherNo || "Loading..."}
            InputProps={{ readOnly: true }}
          />
        </Grid>

        {/* Voucher Type */}
        <Grid size={{ xs: 6, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Voucher Type</InputLabel>
            <Select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value, party_account: "" })
              }
            >
              <MenuItem value="Receipt">Receipt</MenuItem>
              <MenuItem value="Payment">Payment</MenuItem>
              {/* <MenuItem value="Journal">Journal</MenuItem> */}
              <MenuItem value="Expense">Expense</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Date */}
        <Grid size={{ xs: 6, sm: 4 }}>
          <TextField
            type="date"
            label="Date"
            fullWidth
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Cash Account */}
        <Grid size={{ xs: 6, sm: 4 }}>
          <Autocomplete
            options={cashAccounts}
            getOptionLabel={(option) => option.name}
            value={cashAccounts.find((a) => a.id === form.cash_account) || null}
            onChange={(e, newValue) =>
              setForm({ ...form, cash_account: newValue ? newValue.id : "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Cash/Bank Account" fullWidth />
            )}
          />
        </Grid>

        {/* Party Account */}
        {(form.type === "Receipt" || form.type === "Payment") && (
          <Grid size={{ xs: 6, sm: 4 }}>
            <Autocomplete
              options={partyAccounts}
              getOptionLabel={(option) => option.name}
              value={
                partyAccounts.find((a) => a.id === form.party_account) || null
              }
              onChange={(e, newValue) =>
                setForm({
                  ...form,
                  party_account: newValue ? newValue.id : "",
                })
              }
              renderInput={(params) => (
                <TextField {...params} label="Party Account" fullWidth />
              )}
            />
          </Grid>
        )}
        
        {form.type === "Journal" && (
  <>
    <Grid size={{ xs: 6, sm: 4 }}>
      <Autocomplete
        options={partyAccounts}
        getOptionLabel={(option) => option.name}
        value={partyAccounts.find((a) => a.id === form.debit_account) || null}
        onChange={(e, newValue) =>
          setForm({ ...form, debit_account: newValue ? newValue.id : "" })
        }
        renderInput={(params) => (
          <TextField {...params} label="Debit Account" fullWidth />
        )}
      />
    </Grid>

    <Grid size={{ xs: 6, sm: 4 }}>
      <Autocomplete
        options={partyAccounts}
        getOptionLabel={(option) => option.name}
        value={partyAccounts.find((a) => a.id === form.credit_account) || null}
        onChange={(e, newValue) =>
          setForm({ ...form, credit_account: newValue ? newValue.id : "" })
        }
        renderInput={(params) => (
          <TextField {...params} label="Credit Account" fullWidth />
        )}
      />
    </Grid>
  </>
)}


        {/* Amount */}
        <Grid size={{ xs: 6, sm: 4 }}>
          <TextField
            type="number"
            label="Amount"
            fullWidth
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: parseFloat(e.target.value) || 0 })
            }
          />
        </Grid>

        {/* Narration */}
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Narration"
            fullWidth
            value={form.narration}
            onChange={(e) => {
              setForm({ ...form, narration: e.target.value });
              setIsNarrationEdited(true);
            }}
          />
        </Grid>
      </Grid>

      {/* Bottom Buttons */}
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={() => navigate("/journal")}>
          Back
        </Button>
        <Button variant="contained" onClick={handleSave}>
          {id ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddVoucherForm;
