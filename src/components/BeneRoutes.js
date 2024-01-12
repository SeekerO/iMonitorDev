import Registration from "../components/Registration/Registration";
import Monitoring from "../components/Monitoring/Monitoring";
import Company from "../components/Company/Company";
import MasterList from "../components/MasterList/MasterList";
import Message from "./Messaging/Message";
import CreateAnnouncement from "./Announcement/CreateAnnouncement";
import UpdateProfile from "./Monitoring/UpdateProfile";
import UploadLog from "./Announcement/UploadLog";
import ActivityLog from "../components/Announcement/ActivityLog";
import { Routes, Route } from "react-router-dom";
import { lazy } from "react";

function BeneRoutes({ beneemail, data }) {
  return (
    <>
      {data && (
        <div>
          {data.filterby === "ALL" ? (
            <Routes>
              <Route path="/UpdateProfile/:id" element={<UpdateProfile />} />
              <Route path="/Registration" element={<Registration />} />

              <Route path="/Masterlist" element={<MasterList Data={data} />} />
              <Route path="/Company" element={<Company Data={data} />} />
              <Route
                path="/Message"
                element={<Message beneemail={beneemail} user={data} />}
              />
              <Route
                path="/Announcement/CreateAnnouncement"
                element={<CreateAnnouncement Data={data} />}
              />
              <Route path="/Announcement/UploadLog" element={<UploadLog />} />
              <Route
                path="/Announcement/ActivityLog"
                element={<ActivityLog />}
              />
              <Route path="/" element={<Monitoring Data={data} />} />
              <Route path="*" element={<Monitoring Data={data} />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/Registration" element={<Registration />} />
              <Route path="/" element={<Monitoring Data={data} replace />} />
              <Route path="*" element={<Monitoring Data={data} />} />
              <Route path="/Masterlist" element={<MasterList Data={data} />} />
              <Route
                path="/Message"
                element={<Message beneemail={beneemail} />}
              />
              <Route
                path="/Announcement/CreateAnnouncement"
                element={<CreateAnnouncement />}
              />
              <Route path="/Announcement/UploadLog" element={<UploadLog />} />
              <Route
                path="/Announcement/ActivityLog"
                element={<ActivityLog />}
              />
            </Routes>
          )}
        </div>
      )}
    </>
  );
}

export default BeneRoutes;
