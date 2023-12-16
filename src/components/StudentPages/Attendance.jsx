import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import moment from "moment";
import AOS, { refresh } from "aos";
import "aos/dist/aos.css";
import { GiDiploma } from "react-icons/gi";
import AttendanceConfig from "./AttendanceConfig";
import { TailSpin } from "react-loader-spinner";
import FaceDetector from "./FaceDetector";

const Attendance = ({ studemail }) => {
  // CONDITIONAL VARIABLES
  var starter = false;
  var a = false;
  const [ojtfinished, setojtfinished] = useState(false);
  const [ojtnotstarted, setojtnotstarted] = useState(false);

  // DATA VARIABLES
  const [attendanceinfo, setAttendanceinfo] = useState();
  const [studprog, setStudProg] = useState("");
  const [studmaxprog, setStudMaxProg] = useState("");

  var currDateFull = moment(new Date()).format("l");
  // Fetch Info's
  const [companyinfo, setCompanyInfo] = useState();
  const [studinfo, setStudInfo] = useState();

  // specific
  const [companyinfoTime, setCompanyInfoTime] = useState();

  useEffect(() => {
    AOS.init({ duration: 1000 });

    fetchstudinfo();

    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "AttendanceTable" },
        (payload) => {
          fetchstudinfo();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "AttendanceTable" },
        (payload) => {
          fetchstudinfo();
        }
      )
      .subscribe();
  }, [studemail]);

  // STUDENT INFORMATION TABLE
  const fetchstudinfo = async () => {
    let { data } = await supabase
      .from("StudentInformation")
      .select()
      .eq("studemail", studemail)
      .single();

    if (data) {
      setStudInfo(data);
      setStudProg(data.studprogress);
      setStudMaxProg(data.studmaxprogress);

      var end = moment(data.ojtend).format("L");
      var start = moment(data.ojtstart).format("L");

      // Get the current date
      const currentDate = moment();
      const hasStarted = currentDate.isSameOrAfter(start);
      const hasEnded = currentDate.isAfter(end);
      const hasNotStarted = currentDate.isBefore(start);

      // Output the results
      if (hasStarted) {
        FetchAttendanceInfo();
        starter = true;
      }
      if (hasEnded) {
        setojtfinished(true);
        a = false;
      }
      // Output the result
      if (hasNotStarted) {
        setojtnotstarted(true);
      }
      fetchcompanyinfo();
    }
  };

  // COMPANY INFORMATION TABLE
  async function fetchcompanyinfo() {
    let { data: CompanyTable, error } = await supabase
      .from("CompanyTable")
      .select();

    setCompanyInfo(CompanyTable);
  }

  const DataInsertInAttendance = async (info) => {
    await supabase.from("AttendanceTable").insert({
      studemail: studemail,
      studDate: currDateFull,
      course: info?.studcourse,
      studname: info?.studname,
    });
  };

  // DATA in attendance Table
  const FetchAttendanceInfo = async () => {
    try {
      let { data: attenInfo, error } = await supabase
        .from("AttendanceTable")
        .select()
        .eq("studemail", studemail);

      const { data: info } = await supabase
        .from("StudentInformation")
        .select()
        .eq("studemail", studemail)
        .single();

      const { data: compInfo } = await supabase
        .from("CompanyTable")
        .select()
        .eq("companyname", info.companyname)
        .single();
      setCompanyInfoTime(compInfo);

      if (info && attenInfo.length === 0) {
        DataInsertInAttendance(info);
        setAttendanceinfo(attenInfo);
      } else if (info && attenInfo.length > 0) {
        for (let index = 0; index < attenInfo.length; index++) {
          var date = moment(attenInfo[index].studDate).format("L");

          if (currDateFull === date) {
            setAttendanceinfo(attenInfo);
            return;
          }
        }
        DataInsertInAttendance(info);
        return;
      }
    } catch (error) {}
  };

  const timeConverter = (time) => {
    return moment(time, "HH:mm").format("hh:mm A");
  };

  const MinusAnHourConverter = (time) => {
    const updatedTime = moment(time, "HH:mm")
      .subtract(1, "hours")
      .format("hh:mm A");

    return updatedTime;
  };

  return (
    <div className="h-screen">
      {attendanceinfo || ojtnotstarted || ojtfinished ? (
        <div className="">
          <div
            className="md:pt-[5%] pt-[10%]"
            data-aos="fade-down"
            data-aos-duration="1000"
          >
            <div className="font-bold text-white text-4xl flex md:ml-[30%] ml-[5%] md:mt-1 mt-5 mb-5">
              ATTENDANCE
            </div>
            <div className=" md:ml-[30%] ml-5 mr-5">
              <div className="md:w-[500px] w-full h-[450px] rounded-t-md bg-slate-200 rounded-b-md">
                <div className="w-full bg-[#274472] rounded-t-md p-2 flex-col md:gap-10 gap-1">
                  <div className="mt-3 mb-3 flex text-white">
                    <div className="md:text-[15px] text-[10px] text-center font-semibold  mr-2">
                      OJT DURATION:
                      <div
                        className={` whitespace-nowrap z-0 md:text-[15px] text-[10px] font-mono font-light mr-3 `}
                      >
                        {studprog} / {studmaxprog}
                      </div>
                    </div>

                    <div className=" w-[70%] bg-gray-100 rounded-sm  md:h-10 h-7 ">
                      <div
                        className=" md:h-10 h-7 w-[1%] bg-[#78D0F4] rounded-sm  "
                        style={{
                          width: `${(studprog / studmaxprog) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                {/*  Attendance */}
                {ojtfinished && (
                  <div className="">
                    <div className="font-bold text-[25px] text-center mt-[22%]">
                      YOUR OJT IS FINISHED
                    </div>
                    <GiDiploma className="text-8xl ml-[40%] text-center" />
                  </div>
                )}
                {ojtnotstarted && (
                  <div className="justify-center flex flex-col">
                    <div className="font-bold text-[25px] justify-center text-center mt-[20%]">
                      YOUR OJT HAVEN'T STARTED YET
                    </div>
                    <div
                      data-tip="Your Attendance will be shown when the OJT starts"
                      className="hover:text-blue-600 hover:cursor-help text-blue-900 font-semibold underline justify-center text-center
  
                      before:text-sm
                      before:content-[attr(data-tip)]
                      before:absolute
                      before:px-3 before: py-2
                      before:left/1 before: top-3
                      before:w-max before:max-w-xs
                      before:-translate-x-1/3 before:-translate-y-full
                    before:bg-gray-200 before:text-black
                    before:border-black
                      before:border-2
                      before:rounded-md before:opacity-0
                      before:transition-all
                      hover:before:opacity-100"
                    >
                      Learn More
                    </div>
                  </div>
                )}

                {ojtnotstarted === true || ojtfinished === true ? (
                  ""
                ) : (
                  <div>
                    <div className="flex justify-center items-center font-thin text-[12px]">
                      <div className="bg-green-100 w-full p-1 justify-center flex gap-1">
                        Time in starts
                        <em className="font-normal">
                          {MinusAnHourConverter(companyinfoTime.startingtime)} -{" "}
                          {timeConverter(companyinfoTime.startingtime)}
                        </em>{" "}
                        only
                      </div>
                      <div className="bg-red-100 w-full p-1 justify-center flex gap-1">
                        Time out ends
                        <em className="font-normal">
                          {timeConverter(companyinfoTime.endingtime)}
                        </em>
                      </div>
                    </div>
                    {companyinfo && (
                      <div className="p-2 h-[335px] rounded-md overflow-y-auto">
                        {attendanceinfo
                          .sort((a, b) => (a.studDate < b.studDate ? 1 : -1))
                          .map((attendanceinfo, index) => (
                            <AttendanceConfig
                              key={attendanceinfo.id}
                              attendanceinfo={attendanceinfo}
                              studinfo={studinfo}
                              companyinfo={companyinfo}
                              index={index}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Attendance */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[90%]">
          <TailSpin
            height="80"
            width="80"
            color="#0074B7"
            ariaLabel="tail-spin-loading"
            radius="0"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
    </div>
  );
};

export default Attendance;
