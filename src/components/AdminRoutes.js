import React from "react";
import { Routes, Route } from "react-router-dom";

import AdminAccounts from "./AdminPages/AdminAccounts";
import BeneficiaryCreator from "./AdminPages/BeneficiaryCreator";
const AdminRoutes = () => {
  return (
    <div>
    
      <Routes>
        <Route path="/" element={<BeneficiaryCreator />} />
        <Route path="/adminaccount" element={<AdminAccounts />} />
      </Routes>
    </div>
  );
};

export default AdminRoutes;
