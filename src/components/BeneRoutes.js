import Registration from "../components/Registration/Registration";
import Monitoring from "../components/Monitoring/Monitoring";
import Company from "../components/Company/Company";
import MasterList from "../components/MasterList/MasterList";
import Message from "./Messaging/Message";
import CreateAnnouncement from "./Announcement/CreateAnnouncement";
import UpdateProfile from "./Monitoring/UpdateProfile";
import UploadLog from "./Announcement/UploadLog";
import ActivityLog from "../components/Announcement/ActivityLog";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./iMonitorDBconfig";

function BeneRoutes({ beneemail, data }) {
  return (
    <>
      {data && (
        <div>
          {data.filterby === "ALL" ? (
            <Routes>
              <Route path="/:id" element={<UpdateProfile />} />
              <Route path="/registration" element={<Registration />} />

              <Route path="/masterlist" element={<MasterList Data={data} />} />
              <Route path="/company" element={<Company Data={data} />} />
              <Route
                path="/message"
                element={<Message beneemail={beneemail} />}
              />
              <Route
                path="/createannouncement"
                element={<CreateAnnouncement Data={data} />}
              />
              <Route path="/uploadlog1" element={<UploadLog />} />
              <Route path="/activitylog" element={<ActivityLog />} />
              <Route path="/" element={<Monitoring Data={data} />} />
              <Route path="*" element={<Monitoring Data={data} />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/registration" element={<Registration />} />
              <Route path="/*" element={<Monitoring Data={data} replace />} />
              <Route path="/masterlist" element={<MasterList Data={data} />} />
              <Route
                path="/message"
                element={<Message beneemail={beneemail} />}
              />
              <Route
                path="/createannouncement"
                element={<CreateAnnouncement />}
              />
              <Route path="/uploadlog1" element={<UploadLog />} />
              <Route path="/activitylog" element={<ActivityLog />} />
            </Routes>
          )}
        </div>
      )}
    </>
  );
}

export default BeneRoutes;
