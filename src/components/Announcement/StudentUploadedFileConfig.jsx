import React, { useState, useRef, useEffect } from "react";
import supabase from "../iMonitorDBconfig";
import moment from "moment";
import DateConverter from "./DateConverter";
import AOS from "aos";
import "aos/dist/aos.css";

function StudentUploadedFileConfig({ studname, announcementTitle }) {
  const [file, setFile] = useState([]);
  const [fileURL, setFileURL] = useState([]);
  const [open, setOpen] = useState(false);

  // AOS ANIMATION
  useEffect(() => {
    AOS.init({ duration: 500 });
  }, []);

  function test() {
    setOpen(!open);
    fetchStudentFile();
  }

  const fetchStudentFile = async () => {
    const { data, error } = await supabase.storage
      .from("StudentAnnouncementSubmit")
      .list(announcementTitle + "/" + studname + "/");
    setFile(data);
  };

  const divRef = useRef(null);

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        ref={divRef}
        onClick={() => test()}
        className="bg-slate-200  hover:translate-x-2 hover:shadow-md hover:shadow-black duration-500 cursor-pointer  p-2 mt-2 rounded-md"
      >
        <p className="font-semibold"> {studname}</p>

        {open && (
          <div>
            <div className="font-semibold text-[14px] h-[100px] overflow-y-auto">
              File Submitted:
              {file
                .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                .map((file, index) => (
                  <div
                    key={file.name}
                    className={`${
                      index === 0
                        ? " text-[14px] shadow-[0_0px_20px_-15px_rgba(0,0,0,2)] p-3"
                        : "text-[10px] bg-slate-300 p-2"
                    } rounded-md mt-2`}
                  >
                    <div className="flex">
                      Submitted: <DateConverter date={file.created_at} />
                    </div>
                    Donwload File:
                    <a
                      onClick={() =>
                        window.open(
                          `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/StudentAnnouncementSubmit/${announcementTitle}/${studname}/${file.name}`
                        )
                      }
                      className="hover:underline text-blue-700 w-fit ml-1"
                    >
                      {file.name}
                    </a>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default StudentUploadedFileConfig;
