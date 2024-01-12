import React from "react";
import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

const Profile = lazy(() => import("./StudentPages/Profile"));
const MessageStudent = lazy(() => import("./StudentPages/MessageStudent"));
const Attendance = lazy(() => import("./StudentPages/Attendance"));
const AnnouncementStudent = lazy(() =>
  import("./StudentPages/AnnouncementStudent")
);
function StudentRoutes({ studemail }) {
  return (
    <div>
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
    </div>
  );
}

export default StudentRoutes;
