import React from "react";
import stilogo from "../images/STILOGO4.png";

function PdfLayoutMasterList({ data, layout, course, sy }) {
  const status = (status) => {
    if (status === "incomplete") {
      return <div className="h-3 w-3 bg-red-500 rounded-full" />;
    } else {
      return <div className="h-3 w-3 bg-green-500 rounded-full" />;
    }
  };
  return (
    <div ref={layout} className="p-1 ">
      <div className="flex items-center  gap-2 ml-1">
        <img src={stilogo} alt="STI LOGO" className=" h-15 w-20 rounded-sm" />
        <label className="font-bold text-[30px] font-sans text-[#0874B9]">
          iMonitor
        </label>
      </div>
      <div className="h-[1px] bg-black w-[99%] mt-4" />
      {data && (
        <div className="">
          <div className=" grid justify-center mb-1 mt-1 text-[30px] font-bold">
            <label>MASTERLIST </label>
            <div className="flex gap-4 justify-center text-[9px] font-semibold">
              <label>COURSES: {course} </label>
              <label> {sy} </label>
            </div>
          </div>

          <div className="p-3 ">
            {data
              .sort((a, b) => (a.status < b.status ? -1 : 1))
              .map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 mb-2.5 p-2 text-[12px] bg-slate-200 font-thin rounded-md  "
                >
                  <label className="flex gap-1 items-center font-normal">
                    {item.status.toUpperCase()}
                    {status(item.status)}
                  </label>
                  <div className="grid grid-cols-3 bg-slate-300 px-1 p-1">
                    <label>NAME: {item.studname}</label>
                    <label>O365: {item.studemail}</label>
                    <label>PROGRAM: {item.studprogram}</label>
                  </div>
                  <div className="grid grid-cols-3 bg-slate-400 px-1 p-1">
                    <label>SECTION: {item.studsection}</label>
                    <label>START: {item.ojtstart}</label>
                    <label>END: {item.ojtend}</label>
                  </div>
                  <div className="grid grid-cols-3 bg-slate-300 px-1 p-1">
                    <label>COMPANY NAME: {item.companyname}</label>
                    <label>COMPANY ADDRESS: {item.companyaddress}</label>
                    <label>COMPANY EMAIL: {item.companyemail}</label>
                  </div>
                  <div className="grid grid-cols-3 bg-slate-400 px-1 p-1">
                    <label>DESIGNATION: {item.companydesignation}</label>
                    <label>SUPERVISOR NAME:{item.supervisorname}</label>
                    <label>
                      SUPERVISOR CONTACT: {item.supervisorcontactnumber}
                    </label>
                    <label>OFFICE NUMBER: {item.supervisorofficenumber}</label>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      <div className="h-[1px] bg-black w-[99%] mt-4" />
      <label className="flex justify-center text-[12px]">
        © 2023 STI College. All Rights Reserved.
      </label>
    </div>
  );
}

export default PdfLayoutMasterList;
