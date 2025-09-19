// src/App.js
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// Layout & Pages
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ReceiptsPage from "./components/receipts/ReceiptsPage";
import ReceiptReport from "./components/receipts/ReceiptReport";
import AccountManager from "./components/accounts/AccountManager";
import VoucherList from "./components/journal/VoucherList";
import AddVoucherForm from "./components/journal/AddVoucherForm";
import LedgerManager from "./components/ledger/LedgerManager";

// Auth Page
import LoginPage from "./components/auth/LoginPage";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={user ? <DashboardLayout /> : <Navigate to="/login" replace />}
        >
          {/* Dashboard */}
          <Route index element={<h1 className="text-2xl font-bold">Dashboard</h1>} />
          <Route path="dashboard" element={<h1 className="text-2xl font-bold">Dashboard</h1>} />

          {/* Receipts */}
          <Route path="receipts" element={<ReceiptsPage />} />
          <Route path="report" element={<ReceiptReport />} />

          {/* Accounts */}
          <Route path="accounts" element={<AccountManager />} />

          {/* Ledger */}
          <Route path="ledger" element={<LedgerManager />} />

          {/* Vouchers */}
          <Route path="journal" element={<VoucherList />} />
          <Route path="journal/add" element={<AddVoucherForm />} />
          <Route path="journal/edit/:id" element={<AddVoucherForm />} />
        </Route>

        {/* Catch-all route: redirect to dashboard if user is logged in, else to login */}
        <Route
          path="*"
          element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
