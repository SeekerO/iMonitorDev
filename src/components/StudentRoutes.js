import React, { useEffect } from "react";
import Attendance from "./StudentPages/Attendance";
import { Routes, Route } from "react-router-dom";
import AnnouncementStudent from "./StudentPages/AnnouncementStudent";
import MessageStudent from "./StudentPages/MessageStudent";
import Profile from "./StudentPages/Profile";
import supabase from "./iMonitorDBconfig";

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
