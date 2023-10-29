import React, { useEffect, useState } from "react";
import moment from "moment";
import AttendanceSelectImageModal from "./AttendanceSelectImageModal";
import supabase from "../iMonitorDBconfig";

const AttendanceConfig = ({ attendanceinfo }) => {
  const [showmodaluploadimage, setShowModalUploadImage] = useState(false);
  const handlecloseuploadimage = () => setShowModalUploadImage(false);

  const [In, setIn] = useState(true);
  const [Out, setOut] = useState(true);

  var currDateFull = moment().format("l");
  let [uuid, setUuid] = useState();
  
  useEffect(() => {
    datechecker();
  }, []);


  function datechecker() {
    if (currDateFull === attendanceinfo.studDate) {
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
    setUuid(Math.ceil(Math.random() * 99999999));
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

    if (data) {
      console.log("Updated");
    }
    if (error) {
      console.log(error);
    }
    window.location.reload();
  };
  // add the date to the current in studentinforamtion studprgoress + hours
  function toHoursAndMinutes() {
    if (attendanceinfo.studin !== null && OUT !== null) {
      let a = OUT - attendanceinfo.studin;
      let hours = Math.floor(a / 3600);
      let minutes = (a % 3600) / 60;

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
        } else {
          console.log(error);
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
