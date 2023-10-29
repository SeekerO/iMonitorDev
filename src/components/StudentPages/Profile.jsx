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
      <div className=" md:ml-[20%] h-screen ml-2 mr-2 md:pt-[5%] pt-[12%] overflow-hidden">
        <div
          className="md:w-[800px] w-full md:h-[80%] h-[70%] rounded-t-md bg-slate-200 rounded-b-md"
          data-aos="fade-down"
        >
          <div className=" w-[100%] h-[100%] ">
            <div className=" md:flex grid w-full  text-white bg-gradient-to-r p-4 to-slate-200 via-[#274472] from-[#274472] ">
              <label className="text-[14px] font-bold grid">
                CURRENT PROGRESS:
                <p className="text-[10px] justify-center flex">
                  {currprog}hrs/
                  {maxprog}hrs
                </p>
              </label>
              <div className="h-[40px] md:w-[70%] w-[100%] bg-slate-200 mr-6 rounded-md  md:ml-3 ml-0 md:mt-0 mt-1 cursor-default">
                <div
                  className="h-[40px] bg-[#78D0F4] rounded-l-md rounded-r-md "
                  style={{
                    width: `${(currprog / maxprog) * 100}%`,
                  }}
                >
                  <div
                    className={`${
                      currprog > 0
                        ? "md:pl-[60px] pl-[4px] p-1"
                        : "md:pl-[70px] pl-[10px] p-1"
                    } whitespace-nowrap z-0 md:text-[15px] text-[9px] font-mono   font-semibold mr-3 `}
                  ></div>
                </div>
              </div>
            </div>
            <div className="h-[85%]  overflow-y-auto">
               <div className="grid md:grid-cols-2 grid-cols-1 gap-x-10 mb-3 p-2">
              <label className=" mt-4 md:text-lg text-base font-semibold">
                FULLNAME: {studfullname}
              </label>
              <label className=" mt-4 md:text-lg text-base font-semibold">
                PROGRAM: {studprogram}
              </label>
              <label className=" mt-4 md:text-lg text-base font-semibold">
                EMAIL: {studemail}
              </label>
              <label className=" mt-4 md:text-lg text-base font-semibold">
                SECTION: {studsection}
              </label>
              <label className=" mt-4 md:text-lg text-base font-semibold">
                OJT START: {ojtstart}
              </label>
              <label className=" mt-4 md:text-lg text-base font-semibold">
                OJT END: {ojtend}
              </label>
            </div>
            <label className=" pt-6 md:text-lg text-base font-semibold p-2">
              REMARKS: <p className="text-base p-2">{studremarks}</p>
            </label>
            <p className="font-bold md:text-xl text-lg mt-7 p-2">
              COMPANY INFROMATION
            </p>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-x-5 p-2">
              <label className=" mt-4 md:text-lg text-base font-semibold">
                COMPANY NAME: {companyname}
              </label>
              <label className=" mt-4 md:text-lg text-base font-semibold">
                COMPANY ADDRESS: {companyaddress}
              </label>
              <label className=" mt-4 md:text-lg text-base font-semibold">
                SUPERVISOR NAME: {supervisorname}
              </label>
              <label className=" mt-4 md:text-lg text-base font-semibold">
                SUPERVISOR CONTACT #: {supervisorcontactnumber}
              </label>
              <label className=" mt-4 md:text-lg text-base font-semibold">
                SUPERVISOR OFFICER #: {supervisorofficenumber}
              </label>
              <label className=" mt-4 md:text-lg text-base font-semibold">
                COMPANY DESIGNATION: {designation}
              </label>
              <label className=" mt-4 md:text-lg text-base font-semibold">
                COMPANY EMAIL: {companyemail}
              </label>
            </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
