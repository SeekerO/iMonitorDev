import React, { useEffect, useState , useRef} from "react";
import supabase from "../iMonitorDBconfig";
import moment from "moment";
import AttendanceLogConfig from "./AttendanceLogConfig";
import { IoClose } from "react-icons/io5";

function AttendanceLog({ attendanceLog, setAttendanceLog, Data }) {
  const [data, setData] = useState([]);
  const [course, setCourse] = useState("ALL");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");

  const currDate = moment(new Date()).format("L");

  useEffect(() => {
    FetchAttendanceLog();

    supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "AttendanceTable" },
        (payload) => {
          FetchAttendanceLog();
        }
      )
      .subscribe();
  }, [attendanceLog]);

  const FetchAttendanceLog = async () => {
    if (Data.position !== "ADVISER") {
      const { data: log } = await supabase
        .from("AttendanceTable")
        .select("*")
        .not("studin", "is", null)
        .eq("studDate", currDate);

      setData(log);
    } else {
      const { data: log } = await supabase
        .from("AttendanceTable")
        .select("*")
        .not("studin", "is", null)
        .match({ studDate: currDate, course: Data.filterby });

      setData(log);
    }
  };

  useEffect(() => {
    const filter = async () => {
      if (Data.position !== "ADVISER") {
        if (course === "ALL" && date === "") {
          const { data: log } = await supabase
            .from("AttendanceTable")
            .select("*")
            .not("studin", "is", null)
            .eq("studDate", currDate);

          setData(log);
        } else if (course !== "ALL" && date === "") {
          const { data: log } = await supabase
            .from("AttendanceTable")
            .select("*")
            .not("studin", "is", null)
            .match({ studDate: currDate, course: course });

          setData(log);
        } else if (course === "ALL" && date !== "") {
          const { data: log } = await supabase
            .from("AttendanceTable")
            .select("*")
            .not("studin", "is", null)
            .match({ studDate: date });

          setData(log);
        } else if (course !== "ALL" && date !== "") {
          const { data: log } = await supabase
            .from("AttendanceTable")
            .select("*")
            .not("studin", "is", null)
            .match({ studDate: date, course: course });

          setData(log);
        }
      } else {
        if (date === "") {
          const { data: log } = await supabase
            .from("AttendanceTable")
            .select("*")
            .not("studin", "is", null)
            .match({ studDate: currDate, course: Data.filterby });

          setData(log);
        } else {
          const { data: log } = await supabase
            .from("AttendanceTable")
            .select("*")
            .not("studin", "is", null)
            .match({ studDate: date, course: Data.filterby });

          setData(log);
        }
      }
    };
    filter();
  }, [course, date]);

  const close = () => {
    setAttendanceLog(!attendanceLog);
    setDate();
    setCourse("ALL");
  };

  const divRef = useRef(null);

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setAttendanceLog(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!attendanceLog) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-5 flex justify-center items-center z-50">
      <div
        ref={divRef}
        className="bg-slate-100 h-[500px] w-[800px] text-black rounded-md shadow-md shadow-black "
      >
        <div className="flex justify-end">
          <button
            onClick={() => close()}
            className="bg-red-500 hover:bg-red-200 p-1  px-4 rounded-tr-md"
          >
            <IoClose />
          </button>
        </div>
        <div className="flex flex-col justify-center items-center  place-content-center h-[90%]  w-[100%]">
          <div className="justify-center flex w-full gap-1 mb-2 text-black">
            {Data.position !== "ADVISER" && (
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className={`h-[25px] md:text-base text-sm rounded-md bg-slate-300 outline-none text-black`}
              >
                <option value={"ALL"}>ALL</option>
                <option value={"BSIT"}>BSIT</option>
                <option value={"BSAIS"}>BSAIS</option>
                <option value={"BSTM"}>BSTM</option>
                <option value={"BSHM"}>BSHM</option>
                <option value={"BSCPE"}>BSCPE</option>
                <option value={"BSCS"}>BSCS</option>
              </select>
            )}

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-[25px] md:text-base text-sm rounded-md bg-slate-300 outline-none p-1 text-black"
            />
            <input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[25px] p-1 pl-2 bg-slate-300  md:text-base text-sm rounded-md  outline-none"
            />
          </div>
          <div className="grid grid-cols-4 h-fit w-full p-1 bg-[#274472] text-white font-semibold">
            <div className="">NAME</div>
            <div className="flex justify-center">TIME IN</div>
            <div className="flex justify-center">TIME OUT</div>
            <div className="flex justify-center">DATE</div>
          </div>
          <div className="h-[90%] overflow-y-auto w-[100%] bg-white grid ">
            {data && data.length > 0 ? (
              <>
                {data
                  ?.filter((val) => {
                    try {
                      if (search === "") {
                        return val;
                      } else if (
                        val.studname
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      ) {
                        return val;
                      }
                    } catch (error) {}
                  })
                  .map((data, index) => (
                    <AttendanceLogConfig key={index} data={data} />
                  ))}
              </>
            ) : (
              <div className="w-full flex justify-center font-semibold  ">
                NO DATA
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceLog;
