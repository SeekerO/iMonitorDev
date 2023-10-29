import React, { useState, useEffect } from "react";
import RegisSuccessModal from "./RegisSuccessModal";
import options from "../programoptions.json";
import supabase from "../iMonitorDBconfig";
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";
import { ToastContainer, toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import BatchUpload from "./BatchUpload";
import { BsFiles } from "react-icons/bs";

function Registration() {
  useEffect(() => {
    fetchcompanyinfo();
    getStudentInfo();
    AOS.init();
  }, []);

  const [sy] = useState("S.Y. 2023-2024");
  //MODAL VAR
  const [showmodalregis, setShowModalRegis] = useState(false);
  const handleclosemodalregis = () => setShowModalRegis(false);

  //STUD INFO VAR
  const [studfname, setStudFName] = useState("");
  const [studlname, setStudLName] = useState("");
  const [studmname, setStudMName] = useState("");
  const [studprogram, setStudProgram] = useState("");
  const [studemail, setStudemail] = useState("");
  const [ojtstart, setOjtStart] = useState("");
  const [ojtend, setOjtEnd] = useState("");
  const [studsection, setStudSection] = useState("");
  const [studremarks, setStudRemarks] = useState("");

  // //Company name var
  const [value, setValue] = useState("");
  const [companyinfos, setStudCompanyInfos] = useState("");

  const [companyaddress, setCompanyaddress] = useState("");
  const [supervisorname, setSupervisorname] = useState("");
  const [supervisorcontactnumber, setSupervisorcontactnumber] = useState("");
  const [supervisorofficenumber, setSupervisorofficenumber] = useState("");
  const [designation, setDesignation] = useState("");
  const [companyemail, setCompanyemail] = useState("");

  //ERROR VAR
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Student Info
  const [studinfo, setStudinfo] = useState();

  // Open Batch Upload Modal
  const [batchupload, setBatchUpload] = useState(false);

  useEffect(() => {
    fetchcompanyinfo();
  }, [formSuccess]);

  async function getStudentInfo() {
    const { data: info } = await supabase.from("StudentInformation").select();
    setStudinfo(info);
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
  }

  const FilterCompany = async () => {
    try {
      let a;
      let b;
      var c;
      const { data } = await supabase.from("CompanyTable").select();

      for (let index = 0; index < data.length; index++) {
        if (value === data[index].companyname) {
          a = data[index].id;
          b = parseInt(data[index].companyOJT) + 1;
          c = data[index].companyname;

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
        });
      }
    } catch (error) {}
  };

  // INSERT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !studfname ||
      !studlname ||
      !studemail ||
      !studprogram ||
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
      setFormError("Please Fill All FIELDS CORRECTLY!");
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
            theme: "light",
          });
          return;
        }
      }
    }

    if (studmname === null) {
      setStudMName("");
    }

    if (studremarks === null) {
      setStudRemarks(null);
    }

    var studfullname = studfname + " " + studmname + " " + studlname;
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
    FilterCompany();

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
      },
    ]);

    if (error) {
      setFormSuccess(null);
    }
    if (data) {
      setFormError(null);
    }
    setFormError(null);
    setShowModalRegis(true);
    clearfield();
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
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
  };

  const [region, setregion] = useState();
  const [country, setcountry] = useState();


  return (
    <>
      <div className="overflow-hidden md:pt-[2%] pt-[5%]">
        <div
          className="pt-8 md:p-5 p-1 text-white "
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          <div className="md:flex grid items-center ">
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

          {/*First line*/}
          <div className="text-black"></div>
          <form
            onSubmit={handleSubmit}
            className="grid  w-[100%] bg-black bg-opacity-[2%] p-1 overflow-y-auto  md:h-[540px] h-[520px]"
            data-aos="fade-down"
            data-aos-duration="1000"
          >
            {/* Line 1 */}
            <div className="w-[100%] md:flex grid  gap-1 h-fit">
              <label className="font-semibold text-[20px] md:w-[10%] w-[100%]">
                FULL NAME:
              </label>
              <div className=" md:flex flex-grow grid gap-y-5 gap-2 w-fill">
                <input
                  type="text"
                  className="rounded-md p-1 w-[100%]  text-black"
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
                  type="text"
                  className="rounded-md p-1 w-[100%] text-black"
                  placeholder="Last Name"
                  id="studlname"
                  value={studlname}
                  onChange={(e) => setStudLName(e.target.value)}
                ></input>
              </div>
            </div>
            {/* Line 2 */}
            <div className="grid md:flex grid-cols-1  gap-4 pt-4 w-[100%]">
              <label className="font-semibold text-[19px]">PROGRAM</label>

              <div className="w-[100%]">
                <select
                  value={studprogram}
                  className="w-full text-black rounded-md pl-2 text-justify p-1"
                  onChange={(e) => setStudProgram(e.target.value)}
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
                value={ojtstart}
                type="date"
                className="rounded-md md:w-[100%] min-w-[395px] h-[32px] text-black pl-2"
                onChange={(e) => setOjtStart(e.target.value)}
              />
              <label className="font-semibold text-[19px] w-[20%]">
                OJT END
              </label>
              <input
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
                type="text"
                className="rounded-md p-1 w-[100%]  text-black"
                value={studemail}
                onChange={(e) => setStudemail(e.target.value)}
                placeholder="GMAIL"
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
            <label className="font-semibold text-[25px] underline ">
              COMPANY INFROMATION
            </label>
            {/* Line 7 */}
            <div className="grid md:flex grid-cols-1 w-[100%]  gap-4 pt-4">
              <label className="font-semibold text-[19px] md:w-[15%] w-[100%]">
                COMPANY NAME
              </label>

              <div className=" w-[100%] text-black  ">
                <input
                  value={value}
                  onChange={onChange}
                  type="text"
                  className="rounded-md w-[100%] h-[32px] md:h-7 text-black pl-2"
                />

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

            {formError && (
              <p className="text-red-400 mb-1 font-bold w-[25%] text-center">
                {formError}
              </p>
            )}
            {formSuccess && (
              <p className="text-green-500 mb-1 font-bold w-[25%] text-center">
                {formSuccess}
              </p>
            )}
            <button className=" bg-[#145DA0] w-[99.9%] h-[40px] rounded-md font-bold hover:bg-blue-400 mb-10 mt-2">
              REGISTER
            </button>
          </form>
        </div>
        <RegisSuccessModal
          onClose={handleclosemodalregis}
          visible={showmodalregis}
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
        <BatchUpload visible={batchupload} close={setBatchUpload} sy={sy} />
      </div>
    </>
  );
}

export default Registration;
