import React, { useState, useEffect } from "react";
import RegisSuccessModal from "./RegisSuccessModal";
import options from "../programoptions.json";
import supabase from "../iMonitorDBconfig";
import { ToastContainer, toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import BatchUpload from "./BatchUpload";
import { BsFiles } from "react-icons/bs";
import moment from "moment";

function Registration({ dataUser }) {
  useEffect(() => {
    fetchcompanyinfo();
    getStudentInfo();
    AOS.init();
  }, []);

  const [sy, setSY] = useState();

  //MODAL VAR
  const [showmodalregis, setShowModalRegis] = useState(false);

  //STUD INFO VAR
  const [studfname, setStudFName] = useState("");
  const [studlname, setStudLName] = useState("");
  const [studmname, setStudMName] = useState("");
  const [studsuffix, setStudSuffix] = useState("");
  const [studprogram, setStudProgram] = useState("");
  const [studemail, setStudemail] = useState("");
  const [ojtstart, setOjtStart] = useState("");
  const [ojtend, setOjtEnd] = useState("");
  const [studsection, setStudSection] = useState("");
  const [studremarks, setStudRemarks] = useState("");

  // //Company name var
  const [value, setValue] = useState("");
  const [companyinfos, setStudCompanyInfos] = useState("");
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [companyaddress, setCompanyaddress] = useState("");
  const [supervisorname, setSupervisorname] = useState("");
  const [supervisorcontactnumber, setSupervisorcontactnumber] = useState("");
  const [supervisorofficenumber, setSupervisorofficenumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [companyemail, setCompanyemail] = useState("");

  const [formSuccess, setFormSuccess] = useState("");

  // Student Info
  const [studinfo, setStudinfo] = useState();

  // Bene Info
  const [beneinfo, setBeneInfo] = useState();

  // Open Batch Upload Modal
  const [batchupload, setBatchUpload] = useState(false);

  const [registring, setIsRegistring] = useState(false);

  const [closeSuggestion, setCloseSuggestion] = useState();

  useEffect(() => {
    fetchcompanyinfo();
    var curryear = moment().year();
    var nextyear = curryear + 1;
    setSY("S.Y. " + curryear + "-" + nextyear);
  }, [formSuccess]);

  async function getStudentInfo() {
    const { data: stud } = await supabase.from("StudentInformation").select();
    setStudinfo(stud);
    const { data: bene } = await supabase.from("BeneAccount").select();
    setBeneInfo(bene);
  }

  function clearfield() {
    //information
    setStudFName("");
    setStudLName("");
    setStudMName("");
    setStudProgram("");
    setStudSection("");
    setOjtStart("");
    setOjtEnd("");
    setStudemail("");
    setStudRemarks("");
    //company
    setValue("");
    setCompanyaddress("");
    setSupervisorname("");
    setSupervisorcontactnumber("");
    setSupervisorofficenumber("");
    setDesignation("");
    setCompanyemail("");
    setStartTime("");
    setEndTime("");
  }

  function isValidEmail(email) {
    return /\S+@stamaria\.sti\.edu\.ph$/.test(email);
  }

  var insert = false;
  // INSERT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      studfname.trim().length === 0 ||
      studlname.trim().length === 0 ||
      studemail.trim().length === 0 ||
      studprogram.trim().length === 0 ||
      studsection.trim().length === 0 ||
      !ojtstart ||
      !ojtend ||
      value.trim().length === 0 ||
      companyaddress.trim().length === 0 ||
      supervisorname.trim().length === 0 ||
      supervisorcontactnumber.trim().length === 0 ||
      supervisorofficenumber.trim().length === 0 ||
      designation.trim().length === 0 ||
      companyemail.trim().length === 0
    ) {
      toast.warning("No Empty Input", {
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

    if (studemail) {
      for (let index = 0; index < studinfo.length; index++) {
        if (studinfo[index].studemail === studemail) {
          toast.warn("Please use different Email", {
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
          toast.warn("Please use different Email", {
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
    }
    setIsRegistring(true);
    setShowModalRegis(true);
    if (studmname === null) {
      setStudMName("");
    }

    if (studremarks === null) {
      setStudRemarks(null);
    }

    FilterCompany();

    var studfullname =
      studfname +
      `${studmname === "" ? " " : ` ${studmname} `}` +
      studlname +
      " " +
      `${studsuffix === "" ? " " : ` ${studsuffix} `}`;
    var program = studprogram.toString();
    var studcourse;
    let studmaxduration;
    let studprogress = 0;

    if (program === "(BSIT)Bachelor of Science in Information Technology") {
      studmaxduration = 486;
      studcourse = "BSIT";
    }
    if (
      program === "(BSAIS)Bachelor of Science in Accounting Information Systems"
    ) {
      studmaxduration = 600;
      studcourse = "BSAIS";
    }
    if (program === "(BSHM)Bachelor of Science in Hospitality Management") {
      studmaxduration = 600;
      studcourse = "BSHM";
    }
    if (program === "(BSTM)Bachelor of Science in Tourism Management") {
      studmaxduration = 600;
      studcourse = "BSTM";
    }
    if (program === "(BSCPE)Bachelor of Science in Computer Engineering") {
      studmaxduration = 486;
      studcourse = "BSCPE";
    }
    if (program === "(BSCS)Bachelor of Science in Computer Science") {
      studmaxduration = 300;
      studcourse = "BSCS";
    }

    const { data, error } = await supabase.from("StudentInformation").insert([
      {
        studname: studfullname,
        studprogram: program,
        studemail: studemail,
        ojtstart: ojtstart,
        ojtend: ojtend,
        studsection: studsection,
        studremarks: studremarks,
        companyname: value,
        companyaddress: companyaddress,
        supervisorname: supervisorname,
        supervisorcontactnumber: supervisorcontactnumber,
        supervisorofficenumber: supervisorofficenumber,
        companydesignation: designation,
        companyemail: companyemail,
        studmaxprogress: studmaxduration,
        studprogress: studprogress,
        studcourse: studcourse,
        studSY: sy,
        created_by: dataUser.beneName,
      },
    ]);

    if (error) {
      setFormSuccess(null);
    }

    clearfield();
    setIsRegistring(false);
  };

  const FilterCompany = async () => {
    try {
      let a;
      let b;
      var c;
      const { data } = await supabase.from("CompanyTable").select();

      for (let index1 = 0; index1 < data.length; index1++) {
        if (value === data[index1].companyname) {
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

      if (c !== value) {
        const { data1 } = await supabase.from("CompanyTable").insert({
          companyname: value,
          companyaddress: companyaddress,
          supervisorname: supervisorname,
          supervisorcontactnumber: supervisorcontactnumber,
          supervisorofficenumber: supervisorofficenumber,
          companydesignation: designation,
          companyemail: companyemail,
          companyOJT: 1,
          startingtime: startTime,
          endingtime: endTime,
        });
      }
    } catch (error) {}
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

  //filter comapanyname

  const onChange = (event) => {
    setValue(event.target.value);
    setCloseSuggestion(true);
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
  };

  const disablePastDate = () => {
    const today = new Date();
    const dd = String(today.getDate() + 1).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
  };

  const emailFill = (e) => {
    const inputValue = e.target.value;

    if (
      inputValue.endsWith("@") &&
      !inputValue.endsWith("tamaria.sti.edu.ph")
    ) {
      setStudemail(inputValue + "stamaria.sti.edu.ph");
    } else {
      setStudemail(inputValue);
    }
  };

  const setProgramToAcro = (e) => {
    setStudProgram(e.target.value);
    for (let index = 0; index < options.length; index++) {
      if (options[index].Program === e.target.value) {
        setStudSection(options[index].Acro);
        return;
      }
    }
  };
  return (
    <>
      <div className="overflow-hidden md:pt-[2%] pt-[5%] ">
        <div
          className="pt-5 text-white h-screen"
          data-aos="fade-down"
          data-aos-duration="300"
        >
          <div className="md:flex grid items-center p-4 ">
            <header className="font-bold md:text-4xl text-3xl mb-4 pl-1">
              REGISTRATION
            </header>
            <div className="flex justify-between w-[100%] ">
              <a
                onClick={() => setBatchUpload(!batchupload)}
                className="md:pl-5 pl-0 hover:underline hover:text-blue-500 cursor-pointer text-sm flex gap-1 items-center"
              >
                <BsFiles /> Batch Upload
              </a>
              <label className="font-sans font-light">{sy}</label>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid  w-[100%] bg-black bg-opacity-[2%] overflow-y-auto
             overflow-x-hidden max-h-[68%] md:pl-5 pl-1 md:pr-5 pr-1"
            data-aos="fade-down"
            data-aos-duration="1000"
          >
            {/* Line 1 */}
            <div className="w-[100%] md:flex grid  gap-1 h-fit mt-1">
              <label className="font-semibold text-[20px] md:w-[10%] w-[100%]">
                FULL NAME:
              </label>
              <div className=" md:flex flex-grow grid gap-y-5 gap-2 w-fill">
                <input
                  required
                  type="text"
                  className="rounded-md p-1 w-[100%]  text-black "
                  placeholder="First Name"
                  id="studfname"
                  value={studfname}
                  onChange={(e) => setStudFName(e.target.value)}
                ></input>
                <input
                  type="text"
                  className="rounded-md p-1 md:w-[10%] w-[100%]  text-black"
                  placeholder="M.I"
                  id="studmname"
                  value={studmname}
                  onChange={(e) => setStudMName(e.target.value)}
                ></input>
                <input
                  required
                  type="text"
                  className="rounded-md p-1 w-[100%] text-black"
                  placeholder="Last Name"
                  id="studlname"
                  value={studlname}
                  onChange={(e) => setStudLName(e.target.value)}
                ></input>
                <input
                  type="text"
                  className="rounded-md p-1 md:w-[10%] w-[100%] text-black"
                  placeholder="Suffix"
                  value={studsuffix}
                  onChange={(e) => setStudSuffix(e.target.value)}
                ></input>
              </div>
            </div>
            {/* Line 2 */}
            <div className="grid md:flex grid-cols-1  gap-4 pt-4 w-[100%]">
              <label className="font-semibold text-[19px]">PROGRAM</label>

              <div className="w-[100%]">
                <select
                  required
                  value={studprogram}
                  className="w-full text-black rounded-md pl-2 text-justify p-1"
                  onChange={(e) => setProgramToAcro(e)}
                >
                  {options.map((options) => (
                    <option key={options.id} className="pt-4 text-black">
                      {options.Program}
                    </option>
                  ))}
                </select>
              </div>
              <label className="font-semibold text-[19px]">SECTION</label>
              <input
                required
                value={studsection}
                onChange={(e) => setStudSection(e.target.value)}
                type="text"
                placeholder="Enter Section"
                className="rounded-md w-[100%] text-black pl-2 p-1"
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
                className="rounded-md md:w-[100%] min-w-[395px] h-[32px] text-black pl-2"
                onChange={(e) => setOjtStart(e.target.value)}
              />
              <label className="font-semibold text-[19px] w-[20%]">
                OJT END
              </label>
              <input
                min={disablePastDate()}
                required
                value={ojtend}
                type="date"
                className="rounded-md md:w-[100%] min-w-[395px] text-black pl-2"
                onChange={(e) => setOjtEnd(e.target.value)}
              />
            </div>
            {/* Line 4 */}
            <div className="grid md:flex grid-cols-1 w-[100%]  gap-4 pt-4">
              <label className="font-semibold text-[19px] w-[5%]">O365</label>
              <input
                onClick={() => setStudemail("")}
                required
                type="email"
                className="rounded-md p-1 w-[100%]  text-black"
                value={studemail}
                onChange={(e) => emailFill(e)}
                placeholder="example123456@stamaria.sti.edu.ph"
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
            <label className="font-semibold text-[25px] ">
              COMPANY INFORMATION
            </label>
            {/* Line 7 */}
            <div className="flex  gap-5 pt-2">
              <label className="gap-3 flex font-semibold text-[19px] ">
                START TIME
                <input
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

              <div className=" w-[100%] text-black  ">
                <input
                  required
                  value={value}
                  onChange={onChange}
                  type="text"
                  placeholder="Enter Company Name"
                  className="rounded-md w-[100%] h-[32px] md:h-7 text-black pl-2"
                />
                {closeSuggestion && (
                  <>
                    {companyinfos && (
                      <div className="overflow-auto w-[100%] max-h-24 rounded-md  ">
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
                                  setCompanyaddress(
                                    companyinfos.companyaddress
                                  ) ||
                                  setSupervisorname(
                                    companyinfos.supervisorname
                                  ) ||
                                  setSupervisorcontactnumber(
                                    companyinfos.supervisorcontactnumber
                                  ) ||
                                  setSupervisorofficenumber(
                                    companyinfos.supervisorofficenumber
                                  ) ||
                                  setDesignation(
                                    companyinfos.companydesignation
                                  ) ||
                                  setCompanyemail(companyinfos.companyemail) ||
                                  setStartTime(companyinfos.startingtime) ||
                                  setEndTime(companyinfos.endingtime) ||
                                  setCloseSuggestion(!closeSuggestion)
                                }
                                className="hover:bg-blue-400  rounded-md w-[100%]"
                              >
                                {companyinfos.companyname}
                              </p>
                            </div>
                          ))}
                      </div>
                    )}
                  </>
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
            <button
              disabled={registring}
              className={`${
                registring ? "bg-gray-500" : "bg-[#145DA0] hover:bg-blue-400"
              }  w-[99.9%] h-[40px] rounded-md font-bold  mb-10 mt-2`}
            >
              REGISTER
            </button>
          </form>
        </div>
        <RegisSuccessModal
          onClose={setShowModalRegis}
          visible={showmodalregis}
          registring={registring}
        />
        <ToastContainer
          position="top-right"
          autoClose={5000}
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
        <BatchUpload visible={batchupload} close={setBatchUpload} sy={sy} dataUser={dataUser} />
      </div>
    </>
  );
}

export default Registration;
