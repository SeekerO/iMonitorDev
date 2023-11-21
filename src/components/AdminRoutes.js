import React from "react";
import { Routes, Route } from "react-router-dom";
import BeneficiaryCreator from "./AdminPages/BeneficiaryCreator";
import AdminAccounts from "./AdminPages/AdminAccounts";
const AdminRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="*" element={<BeneficiaryCreator />} />
        <Route path="/" element={<BeneficiaryCreator />} />
        <Route path="/adminaccount" element={<AdminAccounts />} />
      </Routes>
    </div>
  );
};

export default AdminRoutes;
