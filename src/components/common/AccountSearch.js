import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import AccountService from "../../services/AccountService";

const AccountSearch = ({ label, accountTypeId, value, onChange }) => {
  const [options, setOptions] = useState([]);

  const handleSearch = async (event, newInput) => {
    if (newInput.length < 1) return;
    try {
      const response = await AccountService.searchAccounts(accountTypeId, newInput);
      setOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching accounts", error);
    }
  };

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.name || ""}
      onInputChange={handleSearch}
      onChange={(event, newValue) => onChange(newValue)}
      value={value}
      renderInput={(params) => <TextField {...params} label={label} fullWidth />}
    />
  );
};

export default AccountSearch;
