import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const Profile = lazy(() => import("./StudentPages/Profile"));
const MessageStudent = lazy(() => import("./StudentPages/MessageStudent"));
const Attendance = lazy(() => import("./StudentPages/Attendance"));
const AnnouncementStudent = lazy(() =>
  import("./StudentPages/AnnouncementStudent")
);
function StudentRoutes({ studemail }) {
  return (
    <div>
      <Suspense
        fallback={
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        }
      >
        <Routes>
          <Route path="/*" element={<Attendance studemail={studemail} />} />
          <Route
            path="/Announcement"
            element={<AnnouncementStudent studemail={studemail} />}
          />
          <Route
            path="/Message"
            element={<MessageStudent studemail={studemail} />}
          />
          <Route path="/Profile" element={<Profile studemail={studemail} />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default StudentRoutes;
