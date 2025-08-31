// src/components/receipts/ReceiptForm.js
import React, { useState } from "react";

// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Box,
} from "@mui/material";
import ReceiptService from "../../services/ReceiptService";

const initial = {
  receipt_no: "",
  date: "",
  transport_name: "",
  party_name: "",
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
  delivery_person: "",
  delivery_rate: "",
  delivery_charge: "",
  payment_type: "",
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const num = (v) => (v === "" || v === null || v === undefined ? 0 : Number(v));

const ReceiptForm = ({ onSaved }) => {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        receipt_no: form.receipt_no,
        date: form.date || null,
        transport_name: form.transport_name || null,
        party_name: form.party_name || null,
        gr_no: form.gr_no || null,
        container: form.container || null,
        pkgs: num(form.pkgs),
        weight: num(form.weight),
        freight: num(form.freight),
        comm: num(form.comm),
        pkg_rate: num(form.pkg_rate),
        cartage: num(form.cartage),
        labour: num(form.labour),
        other: num(form.other),
        delivery_date: form.delivery_date || null,
        delivery_person: form.delivery_person || null,
        delivery_rate: num(form.delivery_rate),
        delivery_charge: num(form.delivery_charge),
        payment_type: form.payment_type || null,
        remark: form.remark || null,
      };

      await ReceiptService.createReceipt(payload);
      alert("Receipt saved successfully!");
      setForm(initial);
      if (onSaved) onSaved();
    } catch (err) {
      console.error("Failed to save receipt:", err?.response?.data || err);
      alert("Failed to save receipt. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }} elevation={3}>
      <Typography variant="h6" gutterBottom>
        New Receipt
      </Typography>

      {/* Receipt Info */}
        <Box >
            <Grid container spacing={1}>
            <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 0 }}>
                <TextField
                    // label="Size"
                    id="outlined-size-small"
                    defaultValue="Date"
                    size="small"
                    required
                    fullWidth
                />
            </Grid>
            <Grid size={{ xs: 4, md: 2 }} offset={{ md: 8 }}>
                <TextField
                    // label="Size"
                    id="outlined-size-small"
                    defaultValue="Serial No"
                    size="small"
                />
            </Grid>
            
            {/* </Grid>
            <Grid container spacing={2}> */}
            {/* Line 2 */}
            <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                    label="Receipt No"
                    name="receipt_no"
                    value={form.receipt_no}
                    onChange={handleChange}
                    id="outlined-size-small"
                    size="small"
                    type="number"
                />
            </Grid>
            <Grid size={{ xs: 6, md: 5 }}>
                <TextField
                    label="Transport A/C"
                    name=""
                    id="outlined-size-small"
                    size="small"
                    fullWidth
                    select
                />
            </Grid>
            <Grid size={{ xs: 6, md: 5 }}>
                <TextField
                    label="Party A/C"
                    name=""
                    id="outlined-size-small"
                    size="small"
                    fullWidth
                    select
                />
            </Grid>
            

            {/* Line 3 */}
            <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                    label="G R No"
                    id="outlined-size-small"
                    size="small"
                    type="number"
                />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
                <TextField
                    label="Contain"
                    name=""
                    id="outlined-size-small"
                    size="small"
                />
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <TextField
                label="Weight"
                id="outlined-start-adornment"
                size="small"
                fullWidth
                // sx={{ m: 1, width: '25ch' }}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">kg</InputAdornment>,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                    label="Pkgs"
                    name=""
                    id="outlined-size-small"
                    size="small"
                    type="number"
                    fullWidth
                />
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <TextField
                  label="Pkgs rate"
                  name=""
                  id="outlined-size-small"
                  size="small"
                  type="number"
                  fullWidth
                />
            </Grid>

            <Divider />
            {/* sx={{ my: 1 }}  */}

            {/* Line 4 */}
            <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 10 }}>
              <FormControl fullWidth >
                <InputLabel htmlFor="outlined-adornment-amount">Freight</InputLabel>
                <OutlinedInput
                  id="outlined-size-small"
                  startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                  label="Freight"
                  size="small"
                  type="number"
                />
              </FormControl>
            </Grid>

            {/* Line 5 */}
            <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 10 }}>
              <FormControl fullWidth >
                <InputLabel htmlFor="outlined-adornment-amount">Cartage</InputLabel>
                <OutlinedInput
                  id="outlined-size-small"
                  startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                  label="Cartage"
                  size="small"
                  type="number"
                />
              </FormControl>
            </Grid>

            {/* Line 7 */}
            <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 10 }}>
              <FormControl fullWidth >
                <InputLabel htmlFor="outlined-adornment-amount">Commission</InputLabel>
                <OutlinedInput
                  id="outlined-size-small"
                  startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                  label="Commission"
                  size="small"
                  type="number"
                />
              </FormControl>
            </Grid>

            {/* Line 6 */}
            <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 10 }}>
              <FormControl fullWidth >
                <InputLabel htmlFor="outlined-adornment-amount">Cartage</InputLabel>
                <OutlinedInput
                  id="outlined-size-small"
                  startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                  label="Cartage"
                  size="small"
                  type="number"
                />
              </FormControl>
            </Grid>

            {/* Line 7 */}
            <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 10 }}>
              <FormControl fullWidth >
                <InputLabel htmlFor="outlined-adornment-amount">Labour</InputLabel>
                <OutlinedInput
                  id="outlined-size-small"
                  startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                  label="Labour"
                  size="small"
                  type="number"
                />
              </FormControl>
            </Grid>

            {/* Line 7 */}
            <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 10 }}>
                <FormControl fullWidth >
                  <InputLabel htmlFor="outlined-adornment-amount">Other</InputLabel>
                  <OutlinedInput
                    id="outlined-size-small"
                    startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                    label="Other"
                    size="small"
                    type="number"
                  />
                </FormControl>
            </Grid>

            {/* Line 8 */}
            <Grid size={{ xs: 6, md: 2 }} offset={{ xs: 3, md: 10 }}>
                <FormControl fullWidth >
                  <InputLabel htmlFor="outlined-adornment-amount">Total</InputLabel>
                  <OutlinedInput
                    id="outlined-size-small"
                    startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                    label="Total"
                    size="small"
                    type="number"
                  />
                </FormControl>
            </Grid>

            
            {/* Line 10 */}
            <Grid size={{ xs: 12,  md: 12}}>
                <TextField
                    label="Remarks"
                    id="outlined-size-small"
                    size="small"
                    fullWidth
                />
            </Grid>

            {/* Shipment */}
            <Grid size={{ xs: 6, md: 2 }}>
              <TextField
                  label="Delivery Date"
                  id="outlined-size-small"
                  size="small"
                  fullWidth
              />
            </Grid>
            <Grid size={{ xs: 6, md: 5 }}>
                <TextField
                    label="Delivery Person A/C"
                    name=""
                    id="outlined-size-small"
                    size="small"
                    fullWidth
                    select
                />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <TextField
                  label="Delivery Pkgs Rate "
                  name=""
                  id="outlined-size-small"
                  size="small"
                  type="number"
                  fullWidth
              />
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <FormControl fullWidth >
                <InputLabel htmlFor="outlined-adornment-amount">Delivery Charge</InputLabel>
                <OutlinedInput
                  id="outlined-size-small"
                  startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                  label="Delivery Charge"
                  size="small"
                  type="number"
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>


      <Divider sx={{ my: 3 }} />


      <Box component="form" onSubmit={handleSubmit}>
        {/* Receipt Info */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <TextField
              label="Receipt No"
              name="receipt_no"
              value={form.receipt_no}
              onChange={handleChange}
              fullWidth
              required
              id="outlined-size-small"
                size="small"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="GR No"
              name="gr_no"
              value={form.gr_no}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Container"
              name="container"
              value={form.container}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Accounts */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Transport Account"
              name="transport_name"
              value={form.transport_name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Party Account"
              name="party_name"
              value={form.party_name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Shipment */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Pkgs"
              name="pkgs"
              type="number"
              value={form.pkgs}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Weight"
              name="weight"
              type="number"
              value={form.weight}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Pkg Rate"
              name="pkg_rate"
              type="number"
              value={form.pkg_rate}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Charges */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <TextField
              label="Freight"
              name="freight"
              type="number"
              value={form.freight}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Commission"
              name="comm"
              type="number"
              value={form.comm}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Cartage"
              name="cartage"
              type="number"
              value={form.cartage}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Labour"
              name="labour"
              type="number"
              value={form.labour}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Other"
              name="other"
              type="number"
              value={form.other}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Delivery */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Delivery Date"
              type="date"
              name="delivery_date"
              value={form.delivery_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Delivery Person"
              name="delivery_person"
              value={form.delivery_person}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Delivery Rate"
              name="delivery_rate"
              type="number"
              value={form.delivery_rate}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Delivery Charge"
              name="delivery_charge"
              type="number"
              value={form.delivery_charge}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Payment + Remark */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="payment-type-label">Payment Type</InputLabel>
              <Select
                labelId="payment-type-label"
                name="payment_type"
                value={form.payment_type}
                onChange={handleChange}
              >
                <MenuItem value="">—</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="bank">Bank</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              label="Remark"
              name="remark"
              value={form.remark}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Receipt"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ReceiptForm;
