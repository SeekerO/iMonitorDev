import React, { useEffect, useState, useRef } from "react";
import supabase from "../iMonitorDBconfig";
import ArchiveLogConfig from "./ArchiveLogConfig";

function ArchiveLog({ archiveLog, setArchiveLog, Data }) {
  const [archiveData, setArchiveData] = useState();

  useEffect(() => {
    ArchiveLogGetter();
  }, []);

  console.log(Data);
  const ArchiveLogGetter = async () => {
    if (Data.position !== "ADVISER") {
      const { data: archive } = await supabase.from("ArchiveLog").select();
      setArchiveData(archive);
    } else {
      const { data: archive } = await supabase
        .from("ArchiveLog")
        .select()
        .match({ archivedCourse: Data.filterby });
      setArchiveData(archive);
    }
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
  const [search, setSearch] = useState("");
  const [noData, setNoData] = useState(false);
  if (!archiveLog) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center">
      <div
        ref={divRef}
        className="h-[400px] w-[500px] bg-slate-200 rounded-md shadow-lg shadow-black"
      >
        <label className="flex justify-center p-2 text-[20px] font-semibold text-white bg-[#274472] rounded-t-sm">
          ARCHIVE LOG
        </label>
        <div className="h-[80%] w-full">
          <div className="flex justify-center">
            <input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-2 p-1 mt-1 mb-1 rounded-md bg-slate-300 w-[90%] outline-none focus:shadow-md focus:shadow-black"
            ></input>
          </div>
          {archiveData?.length === 0 ? (
            <div className="flex justify-center font-semibold">NO DATA</div>
          ) : (
            <>
              {archiveData
                ?.filter((val) => {
                  try {
                    if (search === "") {
                      return val;
                    } else if (
                      val.archivedBy
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    ) {
                      return val;
                    } else if (
                      val.archivedName
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    ) {
                      return val;
                    } else {
                    }
                  } catch (error) {}
                })
                .map((data, index) => (
                  <ArchiveLogConfig data={data} key={index} />
                ))}
            </>
          )}
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
