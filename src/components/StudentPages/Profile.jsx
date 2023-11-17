import React from "react";
import supabase from "../iMonitorDBconfig";
import { useEffect, useState } from "react";

import AOS from "aos";
import "aos/dist/aos.css";

const Profile = ({ studemail }) => {
  useEffect(() => {
    fetchstudinfo();
    AOS.init({ duration: 1000 });
    // toHoursAndMinutes();
  }, []);

  const [studName, setStudName] = useState();
  const [studfullname, setStudFullName] = useState("");
  const [studprogram, setStudProgram] = useState("");
  const [ojtstart, setOjtStart] = useState("");
  const [ojtend, setOjtEnd] = useState("");
  const [studsection, setStudSection] = useState("");
  const [studremarks, setStudRemarks] = useState("");
  const [companyname, setCompanyname] = useState("");
  const [companyaddress, setCompanyaddress] = useState("");
  const [supervisorname, setSupervisorname] = useState("");
  const [supervisorcontactnumber, setSupervisorcontactnumber] = useState("");
  const [supervisorofficenumber, setSupervisorofficenumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [companyemail, setCompanyemail] = useState("");
  const [currprog, setCurrProg] = useState();
  const [maxprog, setMaxProg] = useState();

  const fetchstudinfo = async () => {
    const { data, error } = await supabase
      .from("StudentInformation")
      .select()
      .eq("studemail", studemail)
      .single();
    setStudName(data.studname);
    //information
    setStudFullName(data.studname);
    setStudProgram(data.studprogram);
    setStudSection(data.studsection);
    setOjtStart(data.ojtstart);
    setOjtEnd(data.ojtend);
    setStudRemarks(data.studremarks);
    //company
    setCompanyname(data.companyname);
    setCompanyaddress(data.companyaddress);
    setSupervisorname(data.supervisorname);
    setSupervisorcontactnumber(data.supervisorcontactnumber);
    setSupervisorofficenumber(data.supervisorofficenumber);
    setDesignation(data.companydesignation);
    setCompanyemail(data.companyemail);
    setCurrProg(data.studprogress);
    setMaxProg(data.studmaxprogress);
  };
  return (
    <div>
      <div className="flex  place-content-center  h-screen w-[100%] ">
        <div className="h-[88%] w-[100%]  overflow-auto">
          <div className="w-[100%]  flex flex-col items-center mt-[5%] text-white  ">
            <img
              className="md:ml-0 ml-3 h-[170px] w-[170px] rounded-full shadow-lg shadow-gray-900"
              src={window.localStorage.getItem("profile")}
            ></img>

            <label className="mt-3  text-[30px] font-bold  flex">
              {studfullname.toUpperCase()}
            </label>
            <label className=" mt-0.5  text-gray-200 text-xs font-extralight mb-5">
              STUDENT SECTION {studsection}
            </label>
            <div className="bg-[#E7C01D] h-[2px] w-[95%] " />

            <div className="grid md:grid-cols-2 grid-cols-1 gap-x-14 gap-y-4 w-[80%] ">
              <div className="font-semibold  md:text-xl text-lg mt-[5%]">
                STUDENT INFORMATION
              </div>
              <div className="gap-2 mt-2 w-[100%] flex items-center">
                <label className="text-[14px]  md:text-xl text-lg font-semibold flex items-center gap-2">
                  CURRENT STUDENT PROGRESS
                </label>
                <div className="h-[25px] w-[40%] bg-slate-200 rounded-md  cursor-default shadow-md shadow-gray-500">
                  <div
                    className="h-[25px] bg-[#78D0F4] rounded-l-md rounded-r-md "
                    style={{
                      width: `${(currprog / maxprog) * 100}%`,
                    }}
                  >
                    <div
                      className={`${
                        currprog > 0
                          ? "md:pl-[60px] pl-[4px] p-1"
                          : "md:pl-[70px] pl-[10px] p-1"
                      } whitespace-nowrap z-0 md:text-[15px] text-[9px] font-mono   font-semibold mr-3 text-black items-center `}
                    >
                      {currprog} / {maxprog}
                    </div>
                  </div>
                </div>
              </div>
              <label className=" mt-4 md:text-md text-base font-semibold">
                {studprogram}
              </label>

              <label className=" mt-4 md:text-md text-base font-semibold">
                {studemail}
              </label>

              <label className="md:text-md text-base font-semibold">
                OJT START: {ojtstart}
              </label>
              <label className="  md:text-md text-base font-semibold">
                OJT END: {ojtend}
              </label>
              <label className=" md:text-md text-base font-semibold">
                REMARKS: <p className="text-base mt-1">{studremarks}</p>
              </label>
            </div>
            <div className="font-semibold  md:text-3xl text-lg mt-[5%] mb-[5%]">
              COMPANY INFORMATION
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-x-20 gap-y-4 w-[80%]  items-center">
              <label className=" mt-4 md:text-md text-base font-semibold">
                COMPANY NAME: <label className="font-thin">{companyname}</label>
              </label>
              <label className=" mt-4 md:text-md text-base font-semibold">
                COMPANY ADDRESS:{" "}
                <label className="font-thin">{companyaddress}</label>
              </label>
              <label className=" mt-4 md:text-md text-base font-semibold">
                SUPERVISOR NAME:{" "}
                <label className="font-thin">{supervisorname}</label>
              </label>
              <label className=" mt-4 md:text-lg text-base font-semibold">
                SUPERVISOR CONTACT #:{" "}
                <label className="font-thin">{supervisorcontactnumber}</label>
              </label>
              <label className=" mt-4 md:text-md text-base font-semibold">
                SUPERVISOR OFFICER #:{" "}
                <label className="font-thin">{supervisorofficenumber}</label>
              </label>
              <label className=" mt-4 md:text-md text-base font-semibold">
                COMPANY DESIGNATION:{" "}
                <label className="font-thin">{designation}</label>
              </label>
              <label className=" mt-4 md:text-md text-base font-semibold mb-20">
                COMPANY EMAIL:{" "}
                <label className="font-thin">{companyemail}</label>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
