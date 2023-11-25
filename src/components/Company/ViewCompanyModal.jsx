import React, { useState, useRef, useEffect } from "react";
import supabase from "../iMonitorDBconfig";
import StudentData from "./StudentData";
import { AiOutlineClose } from "react-icons/ai";
import Tooltip from "@mui/material/Tooltip";
export default function ViewProfileModal({
  visible,
  onClose,
  companyinfos,
  number,
  Data,
  compName,
}) {
  let menuRef = useRef();
  const [studinfo, setStudInfo] = useState();
  const [openstudinfo, setOpenStudInfo] = useState(false);

  useEffect(() => {
    handleGetStudentInformation();
  }, [companyinfos]);

  async function handleGetStudentInformation() {
    const { data: studinfo } = await supabase
      .from("StudentInformation")
      .select()
      .eq("companyname", compName);
    setStudInfo(studinfo);
  }
  const [hideData, setHide] = useState(false);

  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        ref={menuRef}
        className="bg-slate-200 h-[75%] mt-10 md:w-[70%]  w-[100%] rounded-xl shadow-black shadow-2xl  "
        data-aos="zoom-in"
        data-aos-duration="200"
      >
        <div className="flex  justify-end">
          <button
            onClick={onClose}
            className="  w-[10%] h-[30px] rounded-tr-md flex justify-center place-content-center items-center  hover:bg-red-400 bg-red-600"
          >
            <AiOutlineClose className="font-bold text-[20px]" />
          </button>
        </div>
        <div className=" rounded-xl m-[1%] p-2">
          <div className="pt-1 md:text-[25px] text-base font-semibold text-black w-[600px] rounded-md ">
            NUMBER OF STUDENT CURRENTLY IN OJT: {number}
          </div>
          <form
            className={`${
              openstudinfo
                ? "hidden"
                : "gap-x-10  grid md:grid-cols-2 grid-cols-1 overflow-y-auto h-[270px] pt-5 slate-200 rounded-xl pl-2 text-black"
            } font-thin`}
          >
            <label className=" mt-2 md:text-lg text-base">
              COMPANY NAME: {companyinfos.companyname}
            </label>
            <label className=" mt-2 md:text-lg text-base">
              COMPANY ADDRESS: {companyinfos.companyaddress}
            </label>
            <label className=" mt-2 md:text-lg text-base">
              SUPERVISOR NAME: {companyinfos.supervisorname}
            </label>
            <label className=" mt-2 md:text-lg text-base">
              SUPERVISOR CONTACT #: {companyinfos.supervisorcontactnumber}
            </label>
            <label className=" mt-2 md:text-lg text-base">
              SUPERVISOR OFFICER #: {companyinfos.supervisorofficenumber}
            </label>
            <label className=" mt-2 md:text-lg text-base">
              COMPANY DESIGNATION: {companyinfos.companydesignation}
            </label>
            <label className=" mt-2 md:text-lg text-base  mb-[20px]">
              COMPANY EMAIL: {companyinfos.companyemail}
            </label>
          </form>
          <Tooltip title="Expand" arrow placement="right">
            <a
              onClick={() => setOpenStudInfo(!openstudinfo)}
              className="font-semibold text-black hover:text-blue-500 hover:underline rounded-md w-[300px] mb-2 text-[20px] cursor-pointer"
            >
              STUDENT INFORMATION {`(Current Enrolled)`}
            </a>
          </Tooltip>
          {/* Student name display in div */}
          {!hideData && (
            <div
              className={`${
                openstudinfo
                  ? "h-[400px] transition-all duration-300 "
                  : "h-[150px] "
              } overflow-auto bg-[#5f7caa] text-black p-1 rounded-md`}
            >
              <div className="pl-2">
                <div className="grid grid-cols-2 ">
                  <div className="font-semibold text-[19px] ">Student Name</div>
                  <div className="font-semibold text-[19px] ">Student Section</div>
                </div>

                {studinfo.map((studinfo) => (
                  <StudentData
                    key={studinfo.id}
                    studinfo={studinfo}
                    Data={Data}
                    setHide={setHide}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
