import React, { useEffect, useState } from "react";
import moment from "moment";
import AttendanceSelectImageModal from "./AttendanceSelectImageModal";
import supabase from "../iMonitorDBconfig";

const AttendanceConfig = ({ attendanceinfo, companyinfo, studinfo }) => {
  const [showmodaluploadimage, setShowModalUploadImage] = useState(false);
  const handlecloseuploadimage = () => setShowModalUploadImage(false);

  const [In, setIn] = useState(true);
  const [Out, setOut] = useState(true);

  var currDateFull = moment().format("l");
  var currTime;
  var start;
  var adjustedStart;
  var end;
  let [uuid, setUuid] = useState();

  useEffect(() => {
    timeChecker();

    const intervalId = setInterval(timeChecker, 60000);
    return () => clearInterval(intervalId);
  }, [attendanceinfo]);

  // function timeChecker() {
  //   for (let index = 0; index < companyinfo.length; index++) {
  //     if (studinfo.companyname === companyinfo[index].companyname) {
  //       start = new Date(
  //         "1970-01-01T" + companyinfo[index].startingtime + "Z"
  //       ).toLocaleTimeString("en-US", {
  //         timeZone: "UTC",
  //         hour12: true,
  //         hour: "numeric",
  //         minute: "numeric",
  //         second: "numeric",
  //       });

  //       // Convert start to a Date object to perform arithmetic operations
  //       const startDateObject = new Date(
  //         "1970-01-01T" + companyinfo[index].startingtime + "Z"
  //       );

  //       // Subtract 1 hour from startDateObject
  //       startDateObject.setHours(startDateObject.getHours() - 1);

  //       // Format the adjustedStartDate as a string in the desired format
  //       const adjustedStartDate = startDateObject.toLocaleTimeString("en-US", {
  //         timeZone: "UTC",
  //         hour12: true,
  //         hour: "numeric",
  //         minute: "numeric",
  //         second: "numeric",
  //       });

  //       adjustedStart = adjustedStartDate; // Adjusted start date with 1 hour less

  //       end = new Date(
  //         "1970-01-01T" + companyinfo[index].endingtime + "Z"
  //       ).toLocaleTimeString("en-US", {
  //         timeZone: "UTC",
  //         hour12: true,
  //         hour: "numeric",
  //         minute: "numeric",
  //         second: "numeric",
  //       });

  //       datechecker();

  //       break;
  //     }
  //   }
  // }

  function datechecker() {
    if (currDateFull === attendanceinfo.studDate) {
      if (currTime <= start) {
        if (currTime >= adjustedStart) {
          if (attendanceinfo.studin === null) {
            setIn(false);
            setOut(true);
          } else {
            setIn(true);
            if (attendanceinfo.studout === null) {
              setOut(false);
            } else {
              setOut(true);
            }
          }
        }
      }
      if (currTime >= end) {
        setIn(true);
        setOut(true);
      }
    }
    setUuid(Math.ceil(Math.random() * 99999999));
  }

  function timeChecker() {
    for (let index = 0; index < companyinfo.length; index++) {
      if (studinfo.companyname === companyinfo[index].companyname) {
        const startingTime = parseTime(companyinfo[index].startingtime);
        const endingTime = parseTime(companyinfo[index].endingtime);

        if (startingTime && endingTime) {
          const startT = formatTime(startingTime);
          const endT = formatTime(endingTime);
          const adjustedStartT = adjustStartingTime(startT);
          const currtimeT = moment().format("LTS");

          start = timeToSeconds(startT);
          adjustedStart = timeToSeconds(adjustedStartT);
          end = timeToSeconds(endT);
          currTime = timeToSeconds(currtimeT);
          // Perform the necessary operations with 'start', 'end', or other variables

          datechecker();

          break;
        } else {
        }
      }
    }
  }

  function timeToSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(":");

    // Calculate the total number of seconds
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const cleanTime = removeAMPM(totalSeconds);
    return cleanTime;
  }

  function removeAMPM(timeString) {
    // Check if the string contains 'AM' or 'PM' and remove it
    const withoutAMPM = timeString.replace(/\b(?:AM|PM)\b/g, " ").trim();
    return withoutAMPM;
  }

  function adjustStartingTime(startTime) {
    const [hours, minutes, seconds] = startTime.split(":");

    var adjustedHours = hours - 1;

    return `${adjustedHours}:${minutes}:${seconds}`;
  }

  function parseTime(timeString) {
    // Assuming timeString is in HH:MM:SS format
    const [hours, minutes, seconds] = timeString.split(":");
    return new Date(1970, 0, 1, hours, minutes, seconds);
  }

  function formatTime(time) {
    return time.toLocaleTimeString("en-US", {
      timeZone: "Asia/Shanghai",
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  }

  let OUT;
  // apply this to onlick OUT Button
  function timeout() {
    // const timeStringOUT = moment().format("H:M");
    const timeStringOUT = moment().format("H:M");
    const arr1 = timeStringOUT.split(":"); // splitting the string by colon
    const secondsOUT = arr1[0] * 3600 + arr1[1] * 60; // converting // input string //store this in datebase
    OUT = secondsOUT;
    toHoursAndMinutes();
  }

  const attendance = async () => {
    const { data, error } = await supabase
      .from("AttendanceTable")
      .update({ studout: OUT })
      .eq("id", attendanceinfo.id);

    // window.location.reload();
  };
  // add the date to the current in studentinforamtion studprgoress + hours
  function toHoursAndMinutes() {
    if (attendanceinfo.studin !== null && OUT !== null) {
      let a = OUT - attendanceinfo.studin;
      let hours = Math.floor(a / 3600);
      let minutes = (a % 3600) / 60;

      if (hours < 9) {
        hours = 9;
      }

      const studinfo = async () => {
        const { data, error } = await supabase
          .from("StudentInformation")
          .select()
          .eq("studemail", attendanceinfo.studemail)
          .single();
        if (data) {
          let progress = data.studprogress;
          let result = progress + hours;
          const { data1, error } = await supabase
            .from("StudentInformation")
            .update({ studprogress: result })
            .eq("studemail", attendanceinfo.studemail);

          attendance();
        }
      };
      studinfo();
    }
  }

  return (
    <div>
      <div className="bg-white  rounded-md flex p-1 justify-between mb-2 z-0">
        <p className="text-left m-2 pl-2 font-semibold text-[17px]">
          {attendanceinfo.studDate + ""}
        </p>
        <div className="">
          <button
            disabled={In}
            onClick={() => setShowModalUploadImage(true)}
            className={`${
              In
                ? "h-10 w-24 rounded-md  bg-gray-600 text-center mr-2 hover:cursor-not-allowed"
                : "h-10 w-24 rounded-md hover:bg-green-400 bg-green-600 text-center mr-2 hover:cursor-pointer"
            }`}
          >
            TIME IN
          </button>
          <button
            disabled={Out}
            onClick={() => timeout()}
            className={`${
              Out
                ? "h-10 w-24 rounded-md  bg-gray-600 text-center mr-2 hover:cursor-not-allowed"
                : "h-10 w-24 rounded-md hover:bg-red-400 bg-red-600 text-center mr-2 hover:cursor-pointer"
            }`}
          >
            TIME OUT
          </button>
        </div>
      </div>
      <AttendanceSelectImageModal
        attendanceinfo={attendanceinfo}
        onClose={handlecloseuploadimage}
        visible={showmodaluploadimage}
        uuid={uuid}
      />
    </div>
  );
};

export default AttendanceConfig;
