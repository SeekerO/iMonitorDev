import React, { Suspense, lazy, useLocation } from "react";
import { Routes, Route } from "react-router-dom";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const AdminAccounts = lazy(() => import("./AdminPages/AdminAccounts"));
const BeneficiaryCreator = lazy(() =>
  import("./AdminPages/BeneficiaryCreator")
);

const AdminRoutes = () => {
  return (
    <div>
      <Suspense fallback={         <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>}>
        <Routes>
          <Route path="/" element={<BeneficiaryCreator />} />
          <Route path="/AdminAccount" element={<AdminAccounts />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AdminRoutes;
