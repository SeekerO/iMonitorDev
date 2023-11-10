import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import { ToastContainer, toast } from "react-toastify";
import { IoIosArrowBack } from "react-icons/io";

function Archive({ visible, close, data }) {
  const [status, setStatus] = useState();
  const [archiveid, setArchiveId] = useState(data.id);
  const [archivename, setArchiveName] = useState(data.beneName);
  const [archivestatus, setArchiveStatus] = useState(data.status);
  const [performerrorarchive, setPerformErrorArchive] = useState("");
  useEffect(() => {
    setStatus(archivestatus);
  }, [data]);
  // ARCHIVE Function
  async function archiveaccount() {
    if (!archivename) {
      setPerformErrorArchive("Please input the name or search for it");
      return;
    }
    if (status === null) {
      setStatus(archivestatus);
    }

    var run = true;
    if (run === true) {
      const { data: archive } = await supabase
        .from("BeneAccount")
        .update({ status: archivestatus })
        .eq("beneName", archivename);

      toast.success("Account Archive Successfully!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      close();
    } else {
      toast.warning("Account Archive Not Successful!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex justify-center items-center p-4 ">
      <div className="w-[500px]" data-aos="zoom-in" data-aos-duration="500">
        {/* Archive */}
        <div className="bg-white w-[100%] md:h-[270px] h-[320px]  rounded-md shadow-lg shadow-slate-600">
          <div className="flex md:text-center text-start font-bold text-[30px] bg-blue-900 rounded-t-sm font-mono text-white">
            <a
              onClick={() => close()}
              className="justify-start ml-2 md:mr-[110px] mr-[10px] flex items-center cursor-pointer"
            >
              <IoIosArrowBack />
            </a>
            <p className="flex "> ARCHIVE ACCOUNT</p>
          </div>

          <div>
            <p className=" font-semibold mt-4">
              NAME
              <input
                type="text"
                value={archivename}
                onChange={(e) => setArchiveName(e.target.value)}
                placeholder="Update name here"
                className="bg-gray-200 md:w-[80%] w-[280px] ml-5 mb-2 pl-2 p-1 rounded-sm"
              ></input>
            </p>
            <p className=" font-semibold mt-7">
              STATUS
              <select
                value={archivestatus}
                className="ml-5 bg-gray-200 p-1 md:w-[78%] w-[280px]"
                onChange={(e) => setArchiveStatus(e.target.value)}
              >
                <option>active</option>
                <option>deactive</option>
              </select>
            </p>
            {status && (
              <div
                className={`${
                  status === "active"
                    ? "ml-5 text-[14px] text-green-600 mt-2"
                    : "ml-5 text-[14px] text-red-600 mt-2"
                } `}
              >
                The current status of this account is {status}
              </div>
            )}
            {performerrorarchive && (
              <p className="ml-[20px] text-red-600 mt-2">
                {performerrorarchive}
              </p>
            )}
            <button
              onClick={() => archiveaccount()}
              className="bg-[#12557c] hover:bg-[#1b7fb9] text-white font-bold w-[95%] p-2  mt-5"
            >
              ARCHIVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Archive;
