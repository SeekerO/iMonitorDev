import React, { Suspense, lazy, useLocation } from "react";
import { Routes, Route } from "react-router-dom";

const AdminAccounts = lazy(() => import("./AdminPages/AdminAccounts"));
const BeneficiaryCreator = lazy(() =>
  import("./AdminPages/BeneficiaryCreator")
);

const AdminRoutes = () => {
  return (
    <div>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Routes>
          <Route path="/" element={<BeneficiaryCreator />} />
          <Route path="/AdminAccount" element={<AdminAccounts />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AdminRoutes;
