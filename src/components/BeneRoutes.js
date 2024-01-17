// import Registration from "../components/Registration/Registration";
// import Monitoring from "../components/Monitoring/Monitoring";
// import Company from "../components/Company/Company";
// import MasterList from "../components/MasterList/MasterList";
// import Message from "./Messaging/Message";
// import CreateAnnouncement from "./Announcement/CreateAnnouncement";
// import UpdateProfile from "./Monitoring/UpdateProfile";
// import UploadLog from "./Announcement/UploadLog";
// import ActivityLog from "../components/Announcement/ActivityLog";
import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const UpdateProfile = lazy(() => import("./Monitoring/UpdateProfile"));
const UploadLog = lazy(() => import("./Announcement/UploadLog"));
const ActivityLog = lazy(() =>
  import("../components/Announcement/ActivityLog")
);
const CreateAnnouncement = lazy(() =>
  import("./Announcement/CreateAnnouncement")
);
const Message = lazy(() => import("./Messaging/Message"));
const MasterList = lazy(() => import("../components/MasterList/MasterList"));
const Company = lazy(() => import("../components/Company/Company"));
const Monitoring = lazy(() => import("../components/Monitoring/Monitoring"));
const Registration = lazy(() =>
  import("../components/Registration/Registration")
);

function BeneRoutes({ beneemail, data }) {
  return (
    <>
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
        {data && (
          <div>
            {data.filterby === "ALL" ? (
              <Routes>
                <Route path="/UpdateProfile/:id" element={<UpdateProfile />} />
                <Route
                  path="/Registration"
                  element={<Registration dataUser={data} />}
                />

                <Route
                  path="/Masterlist"
                  element={<MasterList Data={data} />}
                />
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
                <Route
                  path="/Masterlist"
                  element={<MasterList Data={data} />}
                />
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
      </Suspense>
    </>
  );
}

export default BeneRoutes;
