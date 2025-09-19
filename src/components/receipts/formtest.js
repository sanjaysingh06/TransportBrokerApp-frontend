import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Autocomplete,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReceiptService from "../../services/ReceiptService";
import AccountService from "../../services/AccountService";

// Custom styled TextField
const ExtraSmallTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "31px",
    fontSize: "0.85rem",
    padding: "0 8px",
  },
  "& .MuiInputBase-input": {
    padding: "6px 8px",
  },
  "& .MuiFormLabel-root": {
    fontSize: "0.85rem",
  },
}));

const initialForm = {
  receipt_no: "",
  date: "",
  transport_account_id: null,
  party_account_id: null,
  delivery_person_id: null,
  gr_no: "",
  container: "",
  pkgs: "",
  weight: "",
  freight: "",
  comm: "",
  pkg_rate: "",
  cartage: "",
  labour: "",
  other: "",
  remark: "",
  delivery_date: "",
  delivery_rate: "",
  delivery_charge: "",
  total: 0,
};

const num = (v) => (v === "" || isNaN(v) ? 0 : Number(v));

const ReceiptForm = ({ initialData, onSaved, onClose }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);

  // Fetch accounts
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

  // Prefill form for edit
  useEffect(() => {
    if (initialData && accounts.length > 0) {
      setForm({
        ...initialForm,
        ...initialData,
        transport_account_id: initialData.transport_account?.id || null,
        party_account_id: initialData.party_account?.id || null,
        delivery_person_id: initialData.delivery_person?.id || null,
      });
    } else if (!initialData) {
      setForm(initialForm);
    }
  }, [initialData, accounts]);

  // Filter accounts based on hierarchy
  const transportAccounts = accounts.filter(
    (a) => a.parent_name?.includes("Transport Accounts") && a.account_type === 2
  );
  const partyAccounts = accounts.filter(
    (a) => a.parent_name?.includes("Party Accounts") && a.account_type === 1
  );
  const deliveryAccounts = accounts.filter(
    (a) => a.parent_name?.includes("Delivery Accounts") && a.account_type === 2
  );

  // Auto-calculations
  useEffect(() => {
    const pkgs = num(form.pkgs);
    const pkg_rate = num(form.pkg_rate);
    const delivery_rate = num(form.delivery_rate);

    const cartage = pkgs * pkg_rate;
    const delivery_charge = pkgs * delivery_rate;

    const total =
      num(form.freight) +
      num(form.comm) +
      cartage +
      num(form.labour) +
      num(form.other) +
      delivery_charge;

    setForm((prev) => ({
      ...prev,
      cartage,
      delivery_charge,
      total,
    }));
  }, [
    form.pkgs,
    form.pkg_rate,
    form.freight,
    form.comm,
    form.labour,
    form.other,
    form.delivery_rate,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value ? value.id : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        pkgs: num(form.pkgs),
        weight: num(form.weight),
        freight: num(form.freight),
        comm: num(form.comm),
        pkg_rate: num(form.pkg_rate),
        cartage: num(form.cartage),
        labour: num(form.labour),
        other: num(form.other),
        delivery_rate: num(form.delivery_rate),
        delivery_charge: num(form.delivery_charge),
        total: num(form.total),
      };

      if (initialData?.id) {
        await ReceiptService.updateReceipt(initialData.id, payload);
        alert("✅ Receipt updated successfully!");
      } else {
        await ReceiptService.createReceipt(payload);
        alert("✅ Receipt saved successfully!");
      }

      setForm(initialForm);
      if (onSaved) onSaved();
      if (onClose) onClose();
    } catch (err) {
      console.error("❌ Failed to save receipt:", err.response?.data || err);
      alert("Failed to save receipt. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Grid container spacing={0.9} alignItems="center">
        {/* Date & Receipt No */}
        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            label="Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            label="Receipt No"
            name="receipt_no"
            value={form.receipt_no}
            onChange={handleChange}
            required
            fullWidth
            size="small"
            disabled={!!initialData}
          />
        </Grid>

        {/* Transport Account */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Autocomplete
            options={transportAccounts}
            getOptionLabel={(option) => option.name}
            value={
              transportAccounts.find((acc) => acc.id === form.transport_account_id) ||
              null
            }
            onChange={(e, newValue) =>
              handleAccountChange("transport_account_id", newValue)
            }
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <ExtraSmallTextField
                {...params}
                label="Transport Account"
                fullWidth
                size="small"
              />
            )}
          />
        </Grid>

        {/* Party Account */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Autocomplete
            options={partyAccounts}
            getOptionLabel={(option) => option.name}
            value={partyAccounts.find((acc) => acc.id === form.party_account_id) || null}
            onChange={(e, newValue) =>
              handleAccountChange("party_account_id", newValue)
            }
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <ExtraSmallTextField
                {...params}
                label="Party Account"
                fullWidth
                size="small"
              />
            )}
          />
        </Grid>

        {/* Delivery Person */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Autocomplete
            options={deliveryAccounts}
            getOptionLabel={(option) => option.name}
            value={deliveryAccounts.find(
              (acc) => acc.id === form.delivery_person_id
            ) || null}
            onChange={(e, newValue) =>
              handleAccountChange("delivery_person_id", newValue)
            }
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <ExtraSmallTextField
                {...params}
                label="Delivery Person"
                fullWidth
                size="small"
              />
            )}
          />
        </Grid>

        {/* GR, Container, Pkgs, Weight */}
        <Grid size={{ xs: 6, md: 3 }}>
          <ExtraSmallTextField
            label="GR No"
            name="gr_no"
            value={form.gr_no}
            onChange={handleChange}
            fullWidth
            size="small"
            type="number"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <ExtraSmallTextField
            label="Container"
            name="container"
            value={form.container}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            label="Weight"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            type="number"
            fullWidth
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
          />
        </Grid>
        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            label="Pkgs"
            name="pkgs"
            value={form.pkgs}
            onChange={handleChange}
            type="number"
            fullWidth
            size="small"
          />
        </Grid>

        {/* PKG Rate */}
        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            label="Pkg Rate"
            name="pkg_rate"
            value={form.pkg_rate}
            onChange={handleChange}
            type="number"
            fullWidth
            size="small"
          />
        </Grid>

        {/* Freight */}
        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            label="Freight"
            name="freight"
            value={form.freight}
            onChange={handleChange}
            type="number"
            fullWidth
            size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        {/* Cartage */}
        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            label="Cartage"
            name="cartage"
            value={form.cartage}
            type="number"
            fullWidth
            size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              readOnly: true,
            }}
          />
        </Grid>

        {/* Commission */}
        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            label="Commission"
            name="comm"
            value={form.comm}
            type="number"
            fullWidth
            size="small"
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        {/* Labour */}
        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            label="Labour"
            name="labour"
            value={form.labour}
            type="number"
            fullWidth
            size="small"
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        {/* Other */}
        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            label="Other"
            name="other"
            value={form.other}
            type="number"
            fullWidth
            size="small"
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        {/* Delivery Rate */}
        <Grid size={{ xs: 6, md: 3 }}>
          <ExtraSmallTextField
            label="Delivery Rate"
            name="delivery_rate"
            value={form.delivery_rate}
            onChange={handleChange}
            type="number"
            fullWidth
            size="small"
          />
        </Grid>

        {/* Delivery Charge */}
        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            label="Delivery Charge"
            name="delivery_charge"
            value={form.delivery_charge}
            type="number"
            fullWidth
            size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              readOnly: true,
            }}
          />
        </Grid>

        {/* Total */}
        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            label="Total"
            name="total"
            value={form.total}
            type="number"
            fullWidth
            size="small"
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              readOnly: true,
            }}
          />
        </Grid>

        {/* Remarks */}
        <Grid size={{ xs: 12, md: 12 }}>
          <ExtraSmallTextField
            label="Remarks"
            name="remark"
            value={form.remark}
            onChange={handleChange}
            fullWidth
            size="small"
          />
        </Grid>

        {/* Delivery Date */}
        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            label="Delivery Date"
            type="date"
            name="delivery_date"
            value={form.delivery_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
          />
        </Grid>

        {/* Submit */}
        <Grid size={{ xs: 12, md: 12 }}>
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            fullWidth
            size="small"
          >
            {loading ? "Saving..." : initialData ? "Update Receipt" : "Save Receipt"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReceiptForm;
