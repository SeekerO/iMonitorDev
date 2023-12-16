import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import DataExcelConfig from "./DataExcelConfig";
import supabase from "../iMonitorDBconfig";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import { BsFillCloudCheckFill } from "react-icons/bs";
import NoteForBatchUpload from "./NoteForBatchUpload";
import { AiOutlineClose } from "react-icons/ai";
import Check from "../Monitoring/Check.json";
import Lottie from "lottie-react";

function BatchUpload({ visible, close, sy }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataHolder, setDataHolder] = useState();
  const [displayData, setDisplayData] = useState(false);
  const [buttonUpload, setButtonUpload] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [checking, setChecking] = useState(false);

  const [load, setLoad] = useState(0);
  const [maxload, setMaxLoad] = useState();
  const [succes, setSucces] = useState(false);

  const [openNote, setOpenNote] = useState(true);

  const readExcel = async (e) => {
    setSelectedFile(e.target.files[0]);

    if (e.target.files[0] === undefined) {
      return;
    }

    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        for (let index = 0; index < jsonData.length; index++) {
          if (jsonData[index].o365) {
            break;
          } else {
            toast.warn("Invalid File!", {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              progress: undefined,
              theme: "light",
            });
            return;
          }
        }

        setDataHolder(jsonData);
        setButtonUpload(true);
        setDisplayData(true);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  function closemodal() {
    setSelectedFile();
    setDataHolder();
    setDisplayData(false);
    setOpenNote(true);
    close(!visible);
  }

  function ExcelTimeReder(time) {
    const startCompTime = time * 24 * 60 * 60 * 1000;
    const date = new Date(startCompTime);
    const formattedTime = moment(date).format("LTS");

    return formattedTime;
  }

  async function UploadDataExcel() {
    const { data: studinfo } = await supabase
      .from("StudentInformation")
      .select();

    let nameOccurrences = {};
    let emailOccurrences = {};
    // // Check Repeated Name
    // for (let index = 0; index < dataHolder.length; index++) {
    //   var name =
    //     dataHolder[index].Firstname +
    //     `${
    //       dataHolder[index].MiddleInitial
    //         ? ` ${dataHolder[index].MiddleInitial} `
    //         : " "
    //     }` +
    //     dataHolder[index].Lastname +
    //     `${dataHolder[index].Suffix ? ` ${dataHolder[index].Suffix} ` : ""}`;

    //   if (nameOccurrences[name]) {
    //     nameOccurrences[name]++;
    //   } else {
    //     nameOccurrences[name] = 1;
    //   }
    // }

    // // If name is repeated
    // for (let name in nameOccurrences) {
    //   if (nameOccurrences[name] > 1) {
    //     toast.warn(`Input has duplicate names`, {
    //       position: "top-right",
    //       autoClose: 1000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: false,
    //       progress: undefined,
    //       theme: "light",
    //     });
    //     return;
    //   }
    // }

    // Check Repeated Email
    for (let index = 0; index < dataHolder.length; index++) {
      var email = dataHolder[index].o365;

      if (emailOccurrences[email]) {
        emailOccurrences[email]++;
      } else {
        emailOccurrences[email] = 1;
      }
    }

    // If email is repeated
    for (let email in emailOccurrences) {
      if (emailOccurrences[email] > 1) {
        toast.warn(`Input has duplicate emails`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    }

    // Check Invalid Date
    for (let index = 0; index < dataHolder.length; index++) {
      const moment = require("moment"); // Import Moment.js library

      // Check if the dateString represents a valid date
      let isValidDateSTART = moment(
        ExcelDateToJSDate(dataHolder[index].ojtStarting),
        "YYYY-MM-DD",
        true
      ).isValid();

      let isValidDateEND = moment(
        ExcelDateToJSDate(dataHolder[index].ojtEnd),
        "YYYY-MM-DD",
        true
      ).isValid();

      if (!isValidDateSTART) {
        toast.warn(`Invalid Start Date`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      if (!isValidDateEND) {
        toast.warn(`Invalid Start Date`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    }

    // Check Email is already exist in DataBase
    for (let index = 0; index < studinfo.length; index++) {
      var name =
        dataHolder[index].Firstname +
        `${
          dataHolder[index].MiddleInitial
            ? ` ${dataHolder[index].MiddleInitial} `
            : " "
        }` +
        dataHolder[index].Lastname +
        `${dataHolder[index].Suffix ? ` ${dataHolder[index].Suffix} ` : ""}`;

      if (dataHolder[index].o365 === studinfo[index].studemail) {
        toast.warn(`Input email has already exist`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          progress: undefined,
          theme: "light",
        });
        return;
      }
    }

    // Invalid program
    for (let index = 0; index < dataHolder.length; index++) {
      switch (dataHolder[index].Program) {
        case "BSIT":
        case "BSTM":
        case "BSAIS":
        case "BSHM":
        case "BSCS":
        case "BSCPE":
          break;
        default:
          toast.warn(`Invalid Program`, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            progress: undefined,
            theme: "light",
          });
          return;
      }
    }

    StoreData();
  }

  async function StoreData() {
    let count = 0;

    for (let index = 0; index < dataHolder.length; index++) {
      let maxprog;
      var course;
      if (dataHolder[index].Program === "BSIT") {
        maxprog = 486;
        course = "(BSIT)Bachelor of Science in Information Technology";
      } else if (dataHolder[index].Program === "BSAIS") {
        maxprog = 600;
        course = "(BSAIS)Bachelor of Science in Accounting Information Systems";
      } else if (dataHolder[index].Program === "BSHM") {
        maxprog = 600;
        course = "(BSHM)Bachelor of Science in Hospitality Management";
      } else if (dataHolder[index].Program === "BSTM") {
        maxprog = 600;
        course = "(BSTM)Bachelor of Science in Tourism Management";
      } else if (dataHolder[index].Program === "BSCPE") {
        maxprog = 486;
        course = "(BSCPE)Bachelor of Science in Computer Engineering";
      } else if (dataHolder[index].Program === "BSCS") {
        maxprog = 300;
        course = "(BSCS)Bachelor of Science in Computer Science";
      }

      try {
        let a;
        let b;
        var c;
        const { data } = await supabase.from("CompanyTable").select();

        for (let index1 = 0; index1 < data.length; index1++) {
          if (dataHolder[index].companyname === data[index1].companyname) {
            a = data[index1].id;
            b = parseInt(data[index1].companyOJT) + 1;
            c = data[index1].companyname;

            const { data1 } = await supabase
              .from("CompanyTable")
              .update({ companyOJT: b })
              .eq("id", a);
            break;
          }
        }

        var comptimeSTART = ExcelTimeReder(dataHolder[index].startingtime);
        var comptimeEND = ExcelTimeReder(dataHolder[index].endingtime);

        if (c !== dataHolder[index].companyname) {
          const { data1 } = await supabase.from("CompanyTable").insert({
            companyname: dataHolder[index].companyname,
            companyaddress: dataHolder[index].companyaddress,
            supervisorname: dataHolder[index].supervisorName,
            supervisorcontactnumber: dataHolder[index].supervisorContact,
            supervisorofficenumber: dataHolder[index].officeNumber,
            companydesignation: dataHolder[index].designation,
            companyemail: dataHolder[index].officeEmail,
            startingtime: comptimeSTART,
            endingtime: comptimeEND,
            companyOJT: 1,
          });
        }
      } catch (error) {}

      var ojtstart = ExcelDateToJSDate(dataHolder[index].ojtStarting);
      var ojtend = ExcelDateToJSDate(dataHolder[index].ojtEnd);

      const { data: register, error } = await supabase
        .from("StudentInformation")
        .insert([
          {
            studname:
              dataHolder[index].Firstname +
              `${
                dataHolder[index].MiddleInitial
                  ? ` ${dataHolder[index].MiddleInitial} `
                  : " "
              }` +
              dataHolder[index].Lastname +
              `${
                dataHolder[index].Suffix ? ` ${dataHolder[index].Suffix} ` : ""
              }`,
            studprogram: course,
            studemail: dataHolder[index].o365,
            ojtstart: moment(ojtstart).format("l"),
            ojtend: moment(ojtend).format("l"),
            studsection: dataHolder[index].Section,
            studremarks: dataHolder[index].remarks,
            companyname: dataHolder[index].companyname,
            companyaddress: dataHolder[index].companyaddress,
            supervisorname: dataHolder[index].supervisorName,
            supervisorcontactnumber: dataHolder[index].supervisorContact,
            supervisorofficenumber: dataHolder[index].officeNumber,
            companydesignation: dataHolder[index].designation,
            companyemail: dataHolder[index].officeEmail,
            studmaxprogress: maxprog,
            studprogress: 0,
            studcourse: dataHolder[index].Program,
            studSY: sy,
          },
        ]);
      if (error) {
        toast.warn("Invalid Input!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      setUploading(true);
      count++;
      setLoad(count);
      setMaxLoad(dataHolder.length);
    }

    if (dataHolder.length === count) {
      setSucces(true);

      setTimeout(() => {
        setSelectedFile();
        setDataHolder();
        setUploading(false);
        setDisplayData(false);
        setSucces(false);
      }, 3000);
    }
  }

  function ExcelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    );
  }
  function OpenDisplay() {
    if (displayData) {
      setDisplayData(false);
    }
  }

  if (!visible) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
        {!uploading ? (
          <div className="">
            {succes ? (
              <div className=" font-semibold h-[200px] w-[400px] text-white bg-[#b5dbff] rounded p-2 flex flex-col place-content-center justify-center items-center">
                <label className="text-[20px] text-center mb-2 ">
                  <Lottie animationData={Check} className="h-[100px]" />{" "}
                </label>
              </div>
            ) : (
              <div className="h-[200px] w-[400px] bg-[#5885AF] text-white rounded p-2 flex flex-col place-content-center justify-center items-center">
                <label className="font-semibold mb-2">
                  Please wait the file is uploading
                </label>

                <div className="md:h-6 h-8 w-[90%]  bg-gray-400 rounded-md  md:mt-1.5 mt-0 cursor-default">
                  <div
                    className="md:h-6 h-8 bg-[#78D0F4] rounded-l rounded-r "
                    style={{
                      width: `${(load / maxload) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#274472] h-[650px] w-[800px] rounded-md text-black flex-col flex place-content-center">
            <div className="flex justify-end ">
              <button
                onClick={() => closemodal()}
                className=" -mt-0.5 w-[70px] h-[30px] justify-center items-center flex rounded-tr-md font-bold text-black text-[20px] hover:bg-red-400 bg-red-600"
              >
                <AiOutlineClose className="" />
              </button>
            </div>
            <NoteForBatchUpload visible={openNote} close={setOpenNote} />
            <div className="h-[95%] w-[100%]  flex flex-col p-2">
              <div className="flex gap-2 mt-2 items-center text-white">
                <label className="font-bold text-[18px] ">
                  Upload Excel File Here:
                </label>
                <input
                  onClick={() => OpenDisplay()}
                  onChange={readExcel}
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
              </div>

              <div className="bg-slate-300 h-[550px] p-1 rounded-sm mt-1">
                {displayData ? (
                  <div className="grid grid-cols-6 p-1 font-semibold">
                    <label>FirstName</label>
                    <label>M.I</label>
                    <label>LastName</label>
                    <label>Suffix</label>
                    <label>Program</label>
                    <label>Section</label>
                  </div>
                ) : (
                  <div className="flex place-content-center items-center h-[100%]">
                    Data will be display here (
                    <a
                      className="hover:text-blue-700 cursor-pointer hover:underline"
                      onClick={() => setOpenNote(!openNote)}
                    >
                      Get Template
                    </a>
                    )
                  </div>
                )}
                {displayData && (
                  <div className="h-[420px] overflow-y-auto md:text-base text-sm">
                    {dataHolder.map((data, index) => (
                      <DataExcelConfig key={index} data={data} />
                    ))}
                  </div>
                )}
              </div>

              {displayData && (
                <button
                  onClick={() => UploadDataExcel()}
                  className="bg-[#5885AF] text-white hover:bg-green-600  h-fit p-2 mt-1 rounded-sm"
                >
                  Register
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <ToastContainer limit={1} />
    </>
  );
}

export default BatchUpload;
