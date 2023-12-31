import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import React from "react";
import supabase from "../iMonitorDBconfig";
import options from "../programoptions.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Oval } from "react-loader-spinner";
const UpdateProfile = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [studinfo, setStudinfo] = useState([]);
  const [beneinfo, setBeneinfo] = useState([]);
  // Stud old name var
  const [oldstudname, setOldStudName] = useState("");
  const [oldcompanyname, setOldCompanyName] = useState("");
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
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [companyaddress, setCompanyaddress] = useState("");
  const [supervisorname, setSupervisorname] = useState("");
  const [supervisorcontactnumber, setSupervisorcontactnumber] = useState("");
  const [supervisorofficenumber, setSupervisorofficenumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [companyemail, setCompanyemail] = useState("");

  const [value, setValue] = useState("");
  const [companyinfos, setStudCompanyInfos] = useState("");

  const [disableTime, setDisableTime] = useState(true);

  const [suggestion, setSuggestion] = useState(false);
  const [NumberOfStudent, setNumberOfStudent] = useState(0);
  const [prevComp, setPrevComp] = useState([]);

  const [oldCompData, setOldCompData] = useState([]);

  useEffect(() => {
    fetchcompanyinfo();
    fetchstudinfo();

    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "BeneAccount" },
        (payload) => {
          fetchstudinfo();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "StudentInformation" },
        (payload) => {
          fetchstudinfo();
        }
      )
      .subscribe();
  }, [id]);

  const fetchstudinfo = async () => {
    const { data, error } = await supabase
      .from("StudentInformation")
      .select()
      .eq("id", id)
      .single();

    if (data) {
      if (data.studremarks === null) {
        setStudRemarks("No Remarks");
      }
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
      setOldCompanyName(data.companyname);
      setCompanyaddress(data.companyaddress);
      setSupervisorname(data.supervisorname);
      setSupervisorcontactnumber(data.supervisorcontactnumber);
      setSupervisorofficenumber(data.supervisorofficenumber);
      setDesignation(data.companydesignation);
      setCompanyemail(data.companyemail);
      setPrevComp(data.prevComp);
      setStudinfo(data);

      setOldCompData({
        companyname: data.companyname,
        companyaddress: data.companyaddress,
        supervisorname: data.supervisorname,
        supervisorcontactnumber: data.supervisorcontactnumber,
        supervisorofficenumber: data.supervisorofficenumber,
        companydesignation: data.companydesignation,
        companyemail: data.companyemail,
      });

      const { data: time } = await supabase
        .from("CompanyTable")
        .select()
        .eq("companyname", data.companyname);

      setStartTime(time[0].startingtime);
      setEndTime(time[0].endingtime);
      setNumberOfStudent(time[0].companyOJT);
    }
    if (error) nav("/");

    const { data: bene } = await supabase.from("BeneAccount").select();
    setBeneinfo(bene);
  };

  const fetchcompanyinfo = async () => {
    const { data } = await supabase.from("CompanyTable").select();

    if (data) {
      setStudCompanyInfos(data);
    }
  };

  function isValidEmail(email) {
    return /\S+@stamaria\.sti\.edu\.ph$/.test(email);
  }

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

    if (!isValidEmail(studemail)) {
      toast.warning("Invalid Email", {
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

    for (let index = 0; index < studinfo.length; index++) {
      if (studinfo[index].studemail === studemail) {
        toast.warn("The email is already registered", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          limit: 1,
          theme: "light",
        });
        return;
      }
    }
    for (let index = 0; index < beneinfo.length; index++) {
      if (beneinfo[index].beneEmail === studemail) {
        toast.warn("The email is already registered", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          limit: 1,
          theme: "light",
        });
        return;
      }
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

    var studcourseUpdate = 0;
    var studmaxprog = 0;
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

    await supabase
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
    CompanyCheckerForUpdate();
  };

  async function CompanyCheckerForUpdate() {
    const { data: info } = await supabase.from("CompanyTable").select();

    let CompNumber;
    let DecreasedCompNumber;

    if (oldcompanyname === value) {
      notifycomplete();
    } else {
      for (let index = 0; index < info.length; index++) {
        if (info[index].companyname === value) {
          CompNumber = parseInt(info[index].companyOJT) + 1;
          await supabase
            .from("CompanyTable")
            .update({ companyOJT: CompNumber })
            .eq("id", info[index].id);

          DecreasedCompNumber = parseInt(NumberOfStudent) - 1;
          console.log(oldcompanyname);
          await supabase
            .from("CompanyTable")
            .update({ companyOJT: DecreasedCompNumber })
            .eq("companyname", oldcompanyname);

          StorePrevCompany();
          notifycomplete();
          return;
        }
      }

      if (oldcompanyname !== value) {
        await supabase.from("CompanyTable").insert({
          startingtime: startTime,
          endingtime: endTime,
          companyname: value,
          companyaddress: companyaddress,
          supervisorname: supervisorname,
          supervisorcontactnumber: supervisorcontactnumber,
          supervisorofficenumber: supervisorofficenumber,
          companydesignation: designation,
          companyemail: companyemail,
          companyOJT: 1,
        });

        DecreasedCompNumber = parseInt(NumberOfStudent) - 1;

        await supabase
          .from("CompanyTable")
          .update({ companyOJT: DecreasedCompNumber })
          .eq("companyname", oldcompanyname);

        StorePrevCompany();
        notifycomplete();
        return;
      }

      return (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          afasdf
        </div>
      );
    }
  }

  async function StorePrevCompany() {
    var preComp = {
      companyname: oldCompData.companyname,
      companyaddress: oldCompData.companyaddress,
      supervisorname: oldCompData.supervisorname,
      supervisorcontactnumber: oldCompData.supervisorcontactnumber,
      supervisorofficenumber: oldCompData.supervisorofficenumber,
      companydesignation: oldCompData.companydesignation,
      companyemail: oldCompData.companyemail,
      dateLeft: new Date(),
    };

    var array = [];
    array = array.concat(...prevComp, preComp);

    if (prevComp.length <= 0) {
      await supabase
        .from("StudentInformation")
        .update({ prevComp: array })
        .eq("id", id);
      return;
    } else {
      for (let index = 0; index < prevComp.length; index++) {
        if (prevComp[index].companyname !== oldcompanyname) {
          await supabase
            .from("StudentInformation")
            .update({ prevComp: array })
            .eq("id", id);
          return;
        }
      }
    }
  }

  //filter comapanyname
  const onChange = (event) => {
    setValue(event.target.value);
    setSuggestion(true);
    for (let index = 0; index < companyinfos.length; index++) {
      if (companyinfos[index].companyname !== value) {
        setDisableTime(false);
      } else if (oldcompanyname === value) {
        setDisableTime(false);
      } else {
        setDisableTime(true);
      }
    }
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
    nav("/");
  }

  const optionDispaly = (opt, i) => {
    if (opt.Hours < studHours) {
      return (
        <option key={i} disabled className="pt-4 text-black">
          {opt.Program}
        </option>
      );
    } else {
      return (
        <option key={i} className="pt-4 text-black">
          {opt.Program}
        </option>
      );
    }
  };

  return (
    <div className="overflow-hidden">
      {studinfo ? (
        <div
          className="pt-8 md:p-5 p-1 text-white overflow-hidden h-screen"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <a className="font-bold md:text-4xl text-3xl mb-8">
            EDIT STUDENT INFORMATION
          </a>
          {/*First line*/}
          <form
            onSubmit={handlesubmit}
            className="grid  w-[100%] bg-black bg-opacity-[1%] p-1 overflow-y-auto overflow-x-hidden  md:h-[80%] h-[70%] "
          >
            {/* Line 1 */}
            <div className="w-[100%] md:flex grid  gap-1 h-fit">
              <label className="font-semibold text-[20px] md:w-[10%] w-[100%]">
                FULL NAME:
              </label>
              <div className=" md:flex flex-grow grid gap-y-5 gap-2 w-fill">
                <input
                  required
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
                  {options.map((options, index) =>
                    optionDispaly(options, index)
                  )}
                </select>
              </div>
              <label className="font-semibold text-[19px]">SECTION</label>
              <input
                required
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
                required
                value={ojtstart}
                type="date"
                className="rounded-md md:w-[100%] min-w-[405px] h-[32px] text-black pl-2"
                onChange={(e) => setOjtStart(e.target.value)}
              />
              <label className="font-semibold text-[19px] w-[20%]">
                OJT END
              </label>
              <input
                required
                value={ojtend}
                type="date"
                className="rounded-md md:w-[100%] min-w-[405px] text-black pl-2"
                onChange={(e) => setOjtEnd(e.target.value)}
              />
            </div>
            {/* Line 4 */}
            <div className="grid md:flex grid-cols-1 w-[100%]  gap-4 pt-4">
              <label className="font-semibold text-[19px] w-[5%]">O365</label>
              <input
                required
                type="email"
                className="rounded-md p-1 md:w-[65%] w-[100%]  text-black"
                value={studemail}
                onChange={(e) => setStudemail(e.target.value)}
                placeholder="example123456@stamaria.sti.edu.ph"
              ></input>
              <label className="font-semibold text-[19px] w-[16%]">
                STUDENT PROGRESS
              </label>
              <input
                required
                type="number"
                className="rounded-md p-1 md:w-[12%] w-[100%]  text-black"
                value={studHours}
                onChange={(e) => setStudHours(e.target.value)}
                placeholder="Hours"
              ></input>
            </div>
            {/* Line 5 */}
            <div className="grid md:flex grid-cols-1  gap-4 pt-4 mb-10">
              <label className="font-semibold text-[19px] w-[6%]">
                REMARKS
              </label>
              <textarea
                rows="4"
                className="p-1 w-[100%] text-sm text-gray-900  rounded-md"
                placeholder="Write Remaks Here.."
                value={studremarks}
                onChange={(e) => setStudRemarks(e.target.value)}
              ></textarea>
            </div>
            {/* Line 6  */}
            <label className="font-semibold text-[25px]  ">
              COMPANY INFORMATION
            </label>
            <div className="flex  gap-5 pt-2">
              <label className="gap-3 flex font-semibold text-[19px] ">
                START TIME
                <input
                  disabled={disableTime}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  type="time"
                  className="rounded-md text-black pl-1 h-[30px] "
                />
              </label>
              <label className="gap-3 flex font-semibold text-[19px]">
                END TIME
                <input
                  disabled={disableTime}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  type="time"
                  className="rounded-md text-black pl-1 h-[30px] "
                />
              </label>
            </div>
            <div className="grid md:flex grid-cols-1 w-[100%]  gap-4 pt-4">
              <label className="font-semibold text-[19px] md:w-[15%] w-[100%]">
                COMPANY NAME
              </label>

              <div className="grid w-[100%] h-fit text-black">
                <input
                  required
                  value={value}
                  onChange={onChange}
                  type="text"
                  placeholder="Enter Company Name"
                  className="rounded-md w-[100%] h-[32px] md:h-7 text-black pl-2"
                />

                {companyinfos && suggestion && (
                  <div className="overflow-auto w-[100%] max-h-24 rounded-md ">
                    {companyinfos
                      .filter((item) => {
                        var searchTerm = value.toLowerCase();
                        var companyname1 = item.companyname.toLowerCase();

                        return (
                          searchTerm &&
                          companyname1.includes(searchTerm) &&
                          companyname1 !== searchTerm
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
                              setCompanyemail(companyinfos.companyemail) ||
                              setStartTime(companyinfos.startingtime) ||
                              setEndTime(companyinfos.endingtime) ||
                              setSuggestion(false) ||
                              setDisableTime(true)
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
                required
                value={companyaddress}
                onChange={(e) => setCompanyaddress(e.target.value)}
                type="text"
                placeholder="Enter Company Address"
                className="rounded-md w-[100%] h-[32px] md:h-7 text-black pl-2"
              />
            </div>
            {/* Line 9 */}
            <div className="grid md:flex grid-cols-1 w-[100%] gap-4 pt-4">
              <label className="font-semibold text-[19px] w-[39%] ">
                SUPERVISOR NAME
              </label>
              <input
                required
                value={supervisorname}
                onChange={(e) => setSupervisorname(e.target.value)}
                type="text"
                placeholder="Enter Supervisor Name"
                className="rounded-md w-[100%] h-[32px]  text-black pl-2"
              ></input>
              <label className="font-semibold text-[19px] w-[15%]">
                DESIGNATION
              </label>
              <input
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                type="text"
                placeholder="Enter Designation"
                className="rounded-md w-[100%] text-black pl-2 h-[32px]"
              ></input>
            </div>
            {/* Line 10 */}
            <div className="grid md:flex grid-cols-1 w-[100%] gap-4 pt-4 mb-3">
              <label className="font-semibold text-[19px]  w-[55%]">
                SUPERVISOR CONTACT #
              </label>
              <input
                required
                value={supervisorcontactnumber}
                onChange={(e) => setSupervisorcontactnumber(e.target.value)}
                type="text"
                placeholder="Enter Supervisor Contact #"
                className="rounded-md w-[100%] h-[32px] text-black pl-2"
              ></input>
              <label className="font-semibold text-[19px]  w-[100%] md:w-[30%] mb-3 ">
                OFFICE EMAIL
              </label>
              <input
                required
                value={companyemail}
                onChange={(e) => setCompanyemail(e.target.value)}
                type="text"
                placeholder="Enter Office Email"
                className="rounded-md w-[100%]  h-[32px] text-black pl-2"
              ></input>
            </div>
            {/* Line 11 */}

            <div className="w-[100%] md:flex grid">
              <label className="font-semibold text-[19px] w-[15%]">
                OFFICE NUMBER
              </label>

              <input
                required
                value={supervisorofficenumber}
                onChange={(e) => setSupervisorofficenumber(e.target.value)}
                type="text"
                placeholder="Enter Office Number"
                className="rounded-md w-[100%] text-black pl-2 h-[32px]"
              ></input>
            </div>
            <button className=" bg-[#145DA0] w-[99.9%] h-[40px] rounded-md font-bold hover:bg-blue-400 mb-[10%] mt-2">
              UPDATE
            </button>
          </form>
        </div>
      ) : (
        <div className="flex items-center justify-center place-content-center mt-[20%]">
          <Oval
            height={80}
            width={80}
            color="#145DA0"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#fffff"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      )}

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
