import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ReceiptsPage from "./components/receipts/ReceiptsPage";
import ReceiptReport from "./components/receipts/ReceiptReport";
import AccountTypeManager from "./components/accounts/AccountTypeManager";
import AccountManager from "./components/accounts/AccountManager";
import JournalManager from "./components/journal/JournalManager";
import LedgerManager from "./components/ledger/LedgerManager";
import LedgerReport from "./components/reports/LedgerReport";
import TrialBalanceReport from "./components/reports/TrialBalanceReport";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<h1 className="text-2xl font-bold">Dashboard</h1>} />
          <Route path="receipts" element={<ReceiptsPage />} />
          <Route path="report" element={<ReceiptReport />} />
          <Route path="account-types" element={<AccountTypeManager />} />
          <Route path="accounts" element={<AccountManager />} />
          <Route path="journal" element={<JournalManager />} />
          <Route path="ledger" element={<LedgerManager />} />
          <Route path="ledger-report" element={<LedgerReport />} />
          <Route path="trial-balance" element={<TrialBalanceReport />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
