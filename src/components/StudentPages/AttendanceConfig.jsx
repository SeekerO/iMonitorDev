import React, { useEffect, useState } from "react";
import moment from "moment";
import AttendanceSelectImageModal from "./AttendanceSelectImageModal";
import supabase from "../iMonitorDBconfig";

const AttendanceConfig = ({ attendanceinfo, companyinfo, studinfo, index }) => {
  const [showmodaluploadimage, setShowModalUploadImage] = useState(false);
  const handlecloseuploadimage = () => setShowModalUploadImage(false);

  const [In, setIn] = useState(true);
  const [Out, setOut] = useState(true);

  var currDateFull = moment().format("l");
  var currTime = moment();
  let [uuid, setUuid] = useState();

  useEffect(() => {
    datechecker();

    const intervalId = setInterval(datechecker(), 60000);
    return () => clearInterval(intervalId);
  }, [attendanceinfo]);

  function datechecker() {
    var format = moment(attendanceinfo.studDate).format("l");

    for (let index = 0; index < companyinfo.length; index++) {
      if (studinfo.companyname === companyinfo[index].companyname) {
        if (format === currDateFull) {
          if (attendanceinfo.studin === null) {
            var compStart = moment(companyinfo[index].startingtime, "HH:mm:ss");
            var compStartAdjustedBy_Minus_1Hour = compStart
              .clone()
              .subtract(1, "hours");
            var compEnd = moment(companyinfo[index].endingtime, "HH:mm:ss");

            if (
              currTime.isSameOrAfter(compStartAdjustedBy_Minus_1Hour) &&
              currTime.isBefore(compStart)
            ) {
              setIn(false);
            } else {
              setIn(true);
            }
          } else {
            if (currTime.isAfter(compEnd)) {
              setOut(false);
              return;
            }
            if (attendanceinfo.studout !== null) {
              setOut(true);
              return;
            }
            setOut(false);
          }
        }
        return;
      }
    }

    setUuid(Math.ceil(Math.random() * 99999999));
  }

  let OUT;
  // apply this to onlick OUT Button
  function timeout() {
    const timeStringOUT = moment().format("H:M");
    const arr1 = timeStringOUT.split(":"); // splitting the string by colon
    const secondsOUT = arr1[0] * 3600 + arr1[1] * 60; // converting // input string //store this in datebase
    OUT = secondsOUT;
    toHoursAndMinutes();
  }

  // add the date to the current in studentinforamtion studprgoress + hours
  function toHoursAndMinutes() {
    if (attendanceinfo.studin !== null && OUT !== null) {
      let a = OUT - attendanceinfo.studin;
      let hours = Math.floor(a / 3600);
      let minutes = (a % 3600) / 60;

      // if hours greater than 9 set it to 9 hours
      if (hours > 9) {
        hours = 8;
      }

      studinfoData(hours);
    }
  }

  const studinfoData = async (hours) => {
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

  const attendance = async () => {
    const { data, error } = await supabase
      .from("AttendanceTable")
      .update({ studout: OUT })
      .eq("id", attendanceinfo.id);

    setOut(true);
  };

  function secondsToHours(seconds) {
    const hours = seconds / 3600; // There are 3600 seconds in an hour (60 seconds * 60 minutes)
    return hours;
  }

  const computeTotalHours = (timeIN, timOUT) => {
    const hours = secondsToHours(timOUT - timeIN);

    return hours;
  };

  return (
    <div>
      {/*  */}
      <div
        className={`${
          index === 0
            ? "p-2 duration-300 shadow-black shadow-md bg-white mb-4 "
            : "bg-gray-400  mb-0.5"
        }  rounded-md flex p-1 justify-between z-0`}
      >
        <p className="text-left m-2 pl-2 font-semibold text-[17px]">
          {attendanceinfo.studDate + ""}
        </p>
        <div className="">
          {currDateFull === moment(attendanceinfo.studDate).format("L") ? (
            <>
              <button
                disabled={In}
                onClick={() => setShowModalUploadImage(true)}
                className={`${
                  In
                    ? `h-10 w-24 rounded-md  bg-gray-600 text-center mr-2 hover:cursor-not-allowed`
                    : "h-10 w-24 rounded-md hover:bg-green-400 bg-green-600 text-center mr-2 hover:cursor-pointer"
                }`}
              >
                {/* h-10 w-24 rounded-md  bg-gray-600 text-center mr-2 hover:cursor-not-allowed */}
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
            </>
          ) : (
            <div className="items-center flex h-full mr-5 font-thin gap-1">
              Total hours rendered:
              <div className="font-thin">
                {computeTotalHours(
                  attendanceinfo.studin,
                  attendanceinfo.studout
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <AttendanceSelectImageModal
        attendanceinfo={attendanceinfo}
        onClose={handlecloseuploadimage}
        visible={showmodaluploadimage}
        uuid={uuid}
        setIn={setIn}
      />
    </div>
  );
};

export default AttendanceConfig;
