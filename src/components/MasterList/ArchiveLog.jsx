import React, { useEffect, useState, useRef } from "react";
import supabase from "../iMonitorDBconfig";
import ArchiveLogConfig from "./ArchiveLogConfig";

function ArchiveLog({ archiveLog, setArchiveLog }) {
  const [archiveData, setArchiveData] = useState();

  useEffect(() => {
    ArchiveLogGetter();
  }, []);

  const ArchiveLogGetter = async () => {
    const { data: archive } = await supabase.from("ArchiveLog").select();
    setArchiveData(archive);
  };
  const divRef = useRef(null);

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setArchiveLog(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!archiveLog) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center">
      <div ref={divRef} className="h-[400px] w-[500px] bg-slate-200 rounded-md">
        <label className="flex justify-center p-2 text-[20px] font-semibold text-white bg-[#274472] rounded-t-sm">
          ARCHIVE LOG
        </label>
        <div className="h-[80%] w-full">
          {archiveData?.map((data, index) => (
            <ArchiveLogConfig data={data} key={index} />
          ))}
        </div>
        <div className="flex justify-center">
          <a
            onClick={() => setArchiveLog(!archiveLog)}
            className="cursor-pointer hover:text-red-600"
          >
            Close
          </a>
        </div>
      </div>
    </div>
  );
}

export default ArchiveLog;
