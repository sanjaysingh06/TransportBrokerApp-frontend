import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Autocomplete,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';

import ReceiptService from "../../services/ReceiptService";
import AccountService from "../../services/AccountService";


// Create a custom styled TextField
const ExtraSmallTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    height: "31px", // control total height
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
  payment_type: "",
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

  // Prefill form for edit after accounts are loaded
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

  // Filter accounts by type
  const transportAccounts = accounts.filter((a) => a.account_type === 2);
  const partyAccounts = accounts.filter((a) => a.account_type === 1);
  const deliveryAccounts = accounts.filter((a) => a.account_type === 3);

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
      num(form.other);

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

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Autocomplete selection
  const handleAccountChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value ? value.id : null,
    }));
  };

  // Submit form
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
        {/* Receipt No & Date */}
        <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 0 }}>
          <ExtraSmallTextField 
            label="Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
            // size="small"
            id="outlined-size-small"
          />
        </Grid>
        <Grid size={{ xs: 4, md: 2 }} offset={{ md: 8 }}>
          <ExtraSmallTextField
            label="Serial No"
            id="outlined-size-small"
            // defaultValue="Serial No"
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
            id="outlined-size-small"
            disabled={!!initialData}
          />
        </Grid>
        

        {/* Transport Account */}
        <Grid size={{ xs: 6, md: 5 }}>
          <Autocomplete
            options={transportAccounts}
            getOptionLabel={(option) => option.name}
            value={
              transportAccounts.find(
                (acc) => acc.id === form.transport_account_id
              ) || null
            }
            onChange={(e, newValue) =>
              handleAccountChange("transport_account_id", newValue)
            }
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <ExtraSmallTextField {...params} 
                label="Transport Account" 
                fullWidth 
                // select 
                size="small"
                id="outlined-size-small"
                />
            )}
          />
        </Grid>

        {/* Party Account */}
        <Grid size={{ xs: 6, md: 5 }}>
          <Autocomplete
            options={partyAccounts}
            getOptionLabel={(option) => option.name}
            value={
              partyAccounts.find((acc) => acc.id === form.party_account_id) ||
              null
            }
            onChange={(e, newValue) =>
              handleAccountChange("party_account_id", newValue)
            }
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <ExtraSmallTextField {...params} 
                label="Party Account" 
                fullWidth 
                size="small"
                id="outlined-size-small"
              />
            )}
          />
        </Grid>

        {/* GR / Container / Pkgs / Weight */}
        <Grid size={{ xs: 6, md: 3 }}>
          <ExtraSmallTextField
            label="GR No"
            name="gr_no"
            value={form.gr_no}
            onChange={handleChange}
            fullWidth
            id="outlined-size-small"
            size="small"
            type="number"
          />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <ExtraSmallTextField
            label="Contain"
            name="container"
            value={form.container}
            onChange={handleChange}
            fullWidth
            id="outlined-size-small"
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
            // fullWidth
            id="outlined-size-small"
            size="small"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">kg</InputAdornment>,
              },
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
            id="outlined-size-small"
            size="small"
          />
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
              label="Pkgs rate"
              name="pkg_rate"
              onChange={handleChange}
              id="outlined-size-small"
              size="small"
              type="number"
              fullWidth
            />
        </Grid>

        <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 10 }}>
          <ExtraSmallTextField
            fullWidth
            label="Freight"
            name="freight"
            type="number"
            size="small"
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
          />
        </Grid>
        
        {/* Line 5 */}
        <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 10 }}>
          <ExtraSmallTextField
            fullWidth
            label="Cartage"
            name="cartage"
            type="number"
            value={form.cartage}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              readOnly: true,
            }}
          />
        </Grid>

        {/* Line 7 */}
        <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 10 }}>
          <ExtraSmallTextField
            fullWidth
            label="Commission"
            name="comm"
            type="number"
            value={form.comm}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        {/* Line 7 */}
        <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 10 }}>
          <ExtraSmallTextField
            fullWidth
            label="Labour"
            name="labour"
            type="number"
            value={form.labour}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        {/* Line 7 */}
        <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 10 }}>
          <ExtraSmallTextField
            fullWidth
            label="Other"
            name="other"
            type="number"
            value={form.other}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
            }}
          />
        </Grid>

        {/* Line 8 */}
        <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 10 }}>
          <ExtraSmallTextField
            fullWidth
            label="Total"
            name="total"
            type="number"
            value={form.total}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              readOnly: true,
            }}
          />
        </Grid>


        {/* Remarks */}
        <Grid size={{ xs: 12,  md: 12}}>
          <ExtraSmallTextField
            label="Remarks"
            name="remark"
            id="outlined-size-small"
            size="small"
            value={form.remark}
            onChange={handleChange}
            fullWidth
            // multiline
            // rows={2}
          />
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            label="Delivery Date"
            type="date"
            name="delivery_date"
            id="outlined-size-small"
            size="small"
            value={form.delivery_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>

        {/* Delivery Person */}
        <Grid size={{ xs: 6, md: 5 }}>
          <Autocomplete
            options={deliveryAccounts}
            getOptionLabel={(option) => option.name}
            value={
              deliveryAccounts.find(
                (acc) => acc.id === form.delivery_person_id
              ) || null
            }
            onChange={(e, newValue) =>
              handleAccountChange("delivery_person_id", newValue)
            }
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <ExtraSmallTextField {...params} 
                label="Delivery Person" 
                fullWidth 
                id="outlined-size-small"
                size="small"
              />
            )}
          />
        </Grid>

        
        <Grid size={{ xs: 6, md: 3 }}>
          <ExtraSmallTextField
            label="Delivery Rate"
            name="delivery_rate"
            id="outlined-size-small"
            size="small"
            value={form.delivery_rate}
            onChange={handleChange}
            type="number"
            fullWidth
          />
        </Grid>

        <Grid size={{ xs: 6, md: 2 }}>
          <ExtraSmallTextField
            fullWidth
            size="small"
            label="Delivery Charge"
            name="delivery_charge"
            value={form.delivery_charge}
            InputProps={{
              startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              readOnly: true,
            }}
            type="number"
          />
        </Grid>


        {/* Payment Type */}
        {/* <Grid item xs={6} md={3}>
          <TextField
            label="Payment Type"
            name="payment_type"
            value={form.payment_type}
            onChange={handleChange}
            select
            fullWidth
          >
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="bank">Bank</MenuItem>
            <MenuItem value="upi">UPI</MenuItem>
          </TextField>
        </Grid> */}

        {/* Submit */}
        <Grid size={{ xs: 12, md:12 }}>
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            fullWidth
            size="small"
          >
            {loading
              ? "Saving..."
              : initialData
              ? "Update Receipt"
              : "Save Receipt"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReceiptForm;
