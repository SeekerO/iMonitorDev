import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import React from "react";
import supabase from "../iMonitorDBconfig";
import options from "../programoptions.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Stud old name var
  const [oldstudname, setOldStudName] = useState("");
  // Student inf var
  const [studfullname, setStudFullName] = useState("");
  const [studprogram, setStudProgram] = useState("");
  const [studemail, setStudemail] = useState("");
  const [ojtstart, setOjtStart] = useState("");
  const [ojtend, setOjtEnd] = useState("");
  const [studsection, setStudSection] = useState("");
  const [studremarks, setStudRemarks] = useState("");
  const [studHours, setStudHours] = useState("");
  const [studHoursLimit, setStudHoursLimit] = useState("");
  // Companny var
  const [companyaddress, setCompanyaddress] = useState("");
  const [supervisorname, setSupervisorname] = useState("");
  const [supervisorcontactnumber, setSupervisorcontactnumber] = useState("");
  const [supervisorofficenumber, setSupervisorofficenumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [companyemail, setCompanyemail] = useState("");

  const [value, setValue] = useState("");
  const [companyinfos, setStudCompanyInfos] = useState("");

  useEffect(() => {
    fetchcompanyinfo();
    fetchstudinfo();
  }, [id, navigate]);

  const fetchstudinfo = async () => {
    const { data } = await supabase
      .from("StudentInformation")
      .select()
      .eq("id", id)
      .single();

    if (data) {
      //information
      setOldStudName(data.studname);
      setStudFullName(data.studname);
      setStudProgram(data.studprogram);
      setStudSection(data.studsection);
      setOjtStart(data.ojtstart);
      setOjtEnd(data.ojtend);
      setStudemail(data.studemail);
      setStudHoursLimit(data.studmaxprogress);
      setStudHours(data.studprogress);
      setStudRemarks(data.studremarks);
      //company
      setValue(data.companyname);
      setCompanyaddress(data.companyaddress);
      setSupervisorname(data.supervisorname);
      setSupervisorcontactnumber(data.supervisorcontactnumber);
      setSupervisorofficenumber(data.supervisorofficenumber);
      setDesignation(data.companydesignation);
      setCompanyemail(data.companyemail);
    }
    if (data.studremarks === null) {
      setStudRemarks("No Remarks");
    }
  };

  const fetchcompanyinfo = async () => {
    const { data, error } = await supabase.from("CompanyTable").select();
    if (error) {
      console.log(error);
    }
    if (data) {
      setStudCompanyInfos(data);
    }
  };
 
  const handlesubmit = async (e) => {
    e.preventDefault();
    if (
      !studfullname ||
      !studprogram ||
      !studemail ||
      !ojtstart ||
      !ojtend ||
      !studsection ||
      !value ||
      !companyaddress ||
      !supervisorname ||
      !supervisorcontactnumber ||
      !supervisorofficenumber ||
      !designation ||
      !companyemail
    ) {
      console.log(studHours);
      toast.warn("Fill all the input", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (studHours > studHoursLimit) {
      toast.warn("Invalid Progress", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (oldstudname !== studfullname) {
      const { data: studmessage } = await supabase
        .from("Messaging")
        .update({ name: studfullname })
        .eq("name", oldstudname)
        .select();

      const { data: studmessagecontactwith } = await supabase
        .from("Messaging")
        .update({ contactwith: studfullname })
        .eq("contactwith", oldstudname)
        .select();

      const { data: update } = await supabase
        .from("ActivityLog")
        .update({ name: studfullname })
        .eq("name", oldstudname)
        .select();
    }

    var studcourseUpdate;
    var studmaxprog;
    if (studprogram === "(BSIT)Bachelor of Science in Information Technology") {
      studmaxprog = 486;
      studcourseUpdate = "BSIT";
    }
    if (
      studprogram ===
      "(BSAIS)Bachelor of Science in Accounting Information Systems"
    ) {
      studmaxprog = 600;
      studcourseUpdate = "BSAIS";
    }
    if (studprogram === "(BSHM)Bachelor of Science in Hospitality Management") {
      studmaxprog = 600;
      studcourseUpdate = "BSHM";
    }
    if (studprogram === "(BSTM)Bachelor of Science in Tourism Management") {
      studmaxprog = 600;
      studcourseUpdate = "BSTM";
    }
    if (studprogram === "(BSCPE)Bachelor of Science in Computer Engineering") {
      studmaxprog = 486;
      studcourseUpdate = "BSCPE";
    }
    if (studprogram === "(BSCS)Bachelor of Science in Computer Science") {
      studmaxprog = 300;
      studcourseUpdate = "BSCS";
    }

    const { data, error } = await supabase
      .from("StudentInformation")
      .update({
        studname: studfullname,
        studemail: studemail,
        ojtstart: ojtstart,
        ojtend: ojtend,
        studprogram: studprogram,
        studsection: studsection,
        studprogress: studHours,
        studmaxprogress: studmaxprog,
        studremarks: studremarks,
        studcourse: studcourseUpdate,
        companyname: value,
        companyaddress: companyaddress,
        supervisorname: supervisorname,
        supervisorcontactnumber: supervisorcontactnumber,
        supervisorofficenumber: supervisorofficenumber,
        companydesignation: designation,
        companyemail: companyemail,
      })
      .eq("id", id);
    FilterCompany();
  };

  const FilterCompany = async () => {
    try {
      let a;
      let b;
      var c;
      const { data, error } = await supabase.from("CompanyTable").select();

      for (let index = 0; index < data.length; index++) {
        if (value === data[index].companyname) {
          a = data[index].id;
          b = parseInt(data[index].companyOJT) + 1;
          c = data[index].companyname;

          const { data1, error } = await supabase
            .from("CompanyTable")
            .update({ companyOJT: b })
            .eq("id", a);
        }
      }

      if (c !== value) {
        const { data1, error } = await supabase.from("CompanyTable").insert({
          companyname: value,
          companyaddress: companyaddress,
          supervisorname: supervisorname,
          supervisorcontactnumber: supervisorcontactnumber,
          supervisorofficenumber: supervisorofficenumber,
          companydesignation: designation,
          companyemail: companyemail,
          companyOJT: 1,
        });
      }

      notifycomplete();
    } catch (error) {}
  };

  //filter comapanyname
  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
  };

  let menuRef = useRef();
  useEffect(() => {
    let handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  function notifycomplete() {
    toast.success(`Account of ${studfullname} is Updated!`, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  }

  return (
    <div className="overflow-hidden">
      <div
        className="pt-8 md:p-5 p-1 text-white overflow-hidden"
        data-aos="fade-down"
        data-aos-duration="1000"
      >
        <header className="font-bold md:text-4xl text-3xl mb-8">
          EDIT STUDENT INFORMATION
        </header>
        {/*First line*/}
        <form
          onSubmit={handlesubmit}
          className="grid  w-[100%] bg-black bg-opacity-[1%] p-1 overflow-y-auto overflow-x-hidden  md:h-[530px] h-[540px]"
        >
          {/* Line 1 */}
          <div className="w-[100%] md:flex grid  gap-1 h-fit">
            <label className="font-semibold text-[20px] md:w-[10%] w-[100%]">
              FULL NAME:
            </label>
            <div className=" md:flex flex-grow grid gap-y-5 gap-2 w-fill">
              <input
                type="text"
                className="rounded-md p-1 w-[100%] 0 text-black"
                placeholder="First Name"
                id="studfname"
                value={studfullname}
                onChange={(e) => setStudFullName(e.target.value)}
              ></input>
            </div>
          </div>
          {/* Line 2 */}
          <div className="grid md:flex grid-cols-1  gap-4 pt-4 w-[100%]">
            <label className="font-semibold text-[19px]">PROGRAM</label>

            <div className="w-[100%]" ref={menuRef}>
              <select
                value={studprogram}
                className="w-full text-black rounded-md pl-2 text-justify p-1"
                onChange={(e) => setStudProgram(e.target.value)}
              >
                {options.map((options) => (
                  <>
                    {options.Hours < studHours ? (
                      <option
                        disabled
                        key={options.id}
                        className="pt-4 text-black"
                      >
                        {options.Program}
                      </option>
                    ) : (
                      <option key={options.id} className="pt-4 text-black">
                        {options.Program}
                      </option>
                    )}
                  </>
                ))}
              </select>
            </div>
            <label className="font-semibold text-[19px]">SECTION</label>
            <input
              value={studsection}
              onChange={(e) => setStudSection(e.target.value)}
              type="text"
              placeholder="Enter Section"
              className="rounded-md w-[100%] text-black pl-2"
            ></input>
          </div>
          {/* Line 3 */}
          <div className="grid md:flex grid-cols-1  gap-4 pt-4 w-[100%]">
            <label className="font-semibold text-[19px] w-[26%]">
              OJT STARTING
            </label>
            <input
              value={ojtstart}
              type="date"
              className="rounded-md md:w-[100%] min-w-[405px] h-[32px] text-black pl-2"
              onChange={(e) => setOjtStart(e.target.value)}
            />
            <label className="font-semibold text-[19px] w-[20%]">OJT END</label>
            <input
              value={ojtend}
              type="date"
              className="rounded-md md:w-[100%] min-w-[405px] text-black pl-2"
              onChange={(e) => setOjtEnd(e.target.value)}
            />
          </div>
          {/* Line 4 */}
          <div className="grid md:flex grid-cols-1 w-[100%]  gap-4 pt-4">
            <label className="font-semibold text-[19px] w-[5%]">GMAIL</label>
            <input
              type="text"
              className="rounded-md p-1 md:w-[65%] w-[100%]  text-black"
              value={studemail}
              onChange={(e) => setStudemail(e.target.value)}
              placeholder="GMAIL"
            ></input>
            <label className="font-semibold text-[19px] w-[16%]">
              STUDENT PROGRESS
            </label>
            <input
              type="text"
              className="rounded-md p-1 md:w-[12%] w-[100%]  text-black"
              value={studHours}
              onChange={(e) => setStudHours(e.target.value)}
              placeholder="Hours"
            ></input>
          </div>
          {/* Line 5 */}
          <div className="grid md:flex grid-cols-1  gap-4 pt-4 mb-10">
            <label className="font-semibold text-[19px] w-[6%]">REMARKS</label>
            <textarea
              rows="4"
              className="p-1 w-[100%] text-sm text-gray-900  rounded-md"
              placeholder="Write Remaks Here.."
              value={studremarks}
              onChange={(e) => setStudRemarks(e.target.value)}
            ></textarea>
          </div>
          {/* Line 6  */}
          <label className="font-semibold text-[25px] underline ">
            COMPANY INFROMATION
          </label>
          <div className="grid md:flex grid-cols-1 w-[100%]  gap-4 pt-4">
            <label className="font-semibold text-[19px] md:w-[15%] w-[100%]">
              COMPANY NAME
            </label>

            <div id="compRelative" className=" w-[100%] text-black  ">
              <input
                value={value}
                onChange={onChange}
                type="text"
                className="rounded-md w-[100%] h-[32px] md:h-7 text-black pl-2"
              />

              {companyinfos && (
                <div
                  id="compAbsolute"
                  className="overflow-auto w-[100%] max-h-24 rounded-md "
                >
                  {companyinfos
                    .filter((item) => {
                      const searchTerm = value.toLowerCase();
                      const companyname = item.companyname.toLowerCase();

                      return (
                        searchTerm &&
                        companyname.includes(searchTerm) &&
                        companyname !== searchTerm
                      );
                    })

                    .map((companyinfos) => (
                      <div
                        className=" w-[100%] p-1 bg-slate-200 "
                        key={companyinfos.id}
                      >
                        <p
                          onClick={() =>
                            onSearch(companyinfos.companyname) ||
                            setCompanyaddress(companyinfos.companyaddress) ||
                            setSupervisorname(companyinfos.supervisorname) ||
                            setSupervisorcontactnumber(
                              companyinfos.supervisorcontactnumber
                            ) ||
                            setSupervisorofficenumber(
                              companyinfos.supervisorofficenumber
                            ) ||
                            setDesignation(companyinfos.companydesignation) ||
                            setCompanyemail(companyinfos.companyemail)
                          }
                          className="hover:bg-blue-400  rounded-md w-[100%]"
                        >
                          {companyinfos.companyname}
                        </p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          {/* Line 8 */}

          <div className="grid md:flex grid-cols-1 w-[100%] gap-4 pt-4">
            <label className="font-semibold text-[19px] w-[100%] md:w-[17%]">
              COMPANY ADDRESS
            </label>
            <input
              value={companyaddress}
              onChange={(e) => setCompanyaddress(e.target.value)}
              type="text"
              className="rounded-md w-[100%] h-[32px] md:h-7 text-black pl-2"
            />
          </div>
          {/* Line 9 */}
          <div className="grid md:flex grid-cols-1 w-[100%] gap-4 pt-4">
            <label className="font-semibold text-[19px] w-[39%] ">
              SUPERVISOR NAME
            </label>
            <input
              value={supervisorname}
              onChange={(e) => setSupervisorname(e.target.value)}
              type="text"
              className="rounded-md w-[100%] h-[32px]  text-black pl-2"
            ></input>
            <label className="font-semibold text-[19px] w-[15%]">
              DESIGNATION
            </label>
            <input
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              type="text"
              className="rounded-md w-[100%] text-black pl-2 h-[32px]"
            ></input>
          </div>
          {/* Line 10 */}
          <div className="grid md:flex grid-cols-1 w-[100%] gap-4 pt-4 mb-3">
            <label className="font-semibold text-[19px]  w-[55%]">
              SUPERVISOR CONTACT #
            </label>
            <input
              value={supervisorcontactnumber}
              onChange={(e) => setSupervisorcontactnumber(e.target.value)}
              type="text"
              className="rounded-md w-[100%] h-[32px] text-black pl-2"
            ></input>
            <label className="font-semibold text-[19px]  w-[100%] md:w-[30%] mb-3 ">
              OFFICE EMAIL
            </label>
            <input
              value={companyemail}
              onChange={(e) => setCompanyemail(e.target.value)}
              type="text"
              className="rounded-md w-[100%]  h-[32px] text-black pl-2"
            ></input>
          </div>
          {/* Line 11 */}

          <div className="w-[100%] md:flex grid">
            <label className="font-semibold text-[19px] w-[15%]">
              OFFICE NUMBER
            </label>

            <input
              value={supervisorofficenumber}
              onChange={(e) => setSupervisorofficenumber(e.target.value)}
              type="text"
              className="rounded-md w-[100%] text-black pl-2 h-[32px]"
            ></input>
          </div>
          <button className=" bg-[#145DA0] w-[99.9%] h-[40px] rounded-md font-bold hover:bg-blue-400 mb-[10%] mt-2">
            UPDATE
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default UpdateProfile;
