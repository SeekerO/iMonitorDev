import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import supabase from "../iMonitorDBconfig";
import DateConverter from "../Monitoring/DateConverter";
import Avatar from "@mui/material/Avatar";
import { AiOutlineClose } from "react-icons/ai";
import { MdPreview } from "react-icons/md";
import PrevHistoryComp from "../Monitoring/PrevHistoryComp";
import { Tooltip as ReactTooltip } from "react-tooltip";
export default function ViewProfileMasterModal({
  visible,
  onClose,
  studinfos,
  studemail,
  displayColor,
}) {
  var remarks;
  const [files, setFiles] = useState([]);
  const [avatar, setAvatar] = useState(false);
  const [displayAvatarConfig, setDisplayAvatar] = useState();

  const [viewPrev, setViewPrev] = useState(false);
  if (studinfos.studremarks === null) {
    remarks = "None";
  }

  useEffect(() => {
    // Call the function to fetch files from a specific folder
    fetchFilesInFolder(studemail);
  }, []);

  const fetchFilesInFolder = async (folderName) => {
    try {
      // Fetch files from the specific folder
      const { data, error } = await supabase.storage
        .from("StudentUploadedImages")
        .list(folderName + "/", { sortBy: { column: "name", order: "asc" } });

      if (error) {
        console.error("Error fetching files:", error);
      } else {
        // Update the state with the list of files in the folder
        setFiles(data);
      }
    } catch (error) {
      console.error("Error fetching files:", error.message);
    }
  };

  function avatarComponent(name) {
    return (
      <div
        style={{ background: displayColor }}
        className={`flex text-white items-center justify-center h-[200px]  w-[200px] rounded-full font-thin`}
      >{`${name.split(" ")[0][0]}${name.split(" ")[1][0]} `}</div>
    );
  }

  function removeCourseAcro(course) {
    const modifiedCourse = course.replace(/\([^()]*\)/g, "").trim();
    return `(${studinfos.studsection}) ` + modifiedCourse;
  }
  if (!visible) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center ">
      <div
        className="bg-slate-200  h-[75%] mt-10 md:w-[70%]  rounded-xl shadow-black shadow-2xl "
        data-aos="zoom-in"
        data-aos-duration="200"
      >
        <div className="flex justify-end ">
          <button
            onClick={() => onClose(!visible)}
            className="bg-red-600 w-[10%] h-[30px] rounded-br-none rounded-tr-md font-bold hover:bg-red-400 justify-center items-center flex text-black text-[20px]"
          >
            <AiOutlineClose />
          </button>
        </div>
        <div className="text-black rounded-xl m-[1%] h-[90%]">
          <form className=" p-2 z-50 h-[98%]  rounded-xl overflow-y-scroll ">
            <div className="flex flex-col justify-center place-content-center items-center mb-10 font-thin">
              {avatar ? (
                <img
                  src={displayAvatarConfig}
                  className="h-[200px] w-[200px] rounded-full"
                ></img>
              ) : (
                avatarComponent(studinfos.studname)
              )}
              <label className=" mt-4 text-sm text-center  text-black ">
                {studinfos.studname}
              </label>
              <label className=" mt-2 text-sm text-center  text-black ">
                {removeCourseAcro(studinfos.studprogram)}
              </label>
              <label className=" mt-2 text-sm text-center  text-black ">
                {studinfos.studSY}
              </label>
            </div>
            <div className="h-[1px] w-[100%] bg-yellow-500 mb-4" />
            <div className="flex-col text-black ">
              <div className="font-bold md:text-[25px] text-lg mb-3 flex gap-6 rounded-md text-black  p-2">
                STUDENT INFORMATION
              </div>
              <p className="  md:text-lg text-base pl-2 text-black">
                STUDENT PROGRESS: {studinfos.studprogress} /{" "}
                {studinfos.studmaxprogress}
              </p>
              <div className="grid md:grid-cols-2 grid-cols-1 pl-2 text-black font-thin">
                <label className=" mt-4 md:text-lg text-base ">
                  O365: {studinfos.studemail}
                </label>
                <label className=" mt-4 md:text-lg text-base ">
                  SECTION: {studinfos.studsection}
                </label>
                <label className=" mt-4 md:text-lg text-base ">
                  OJT START: {studinfos.ojtstart}
                </label>
                <label className=" mt-4 md:text-lg text-base ">
                  OJT END: {studinfos.ojtend}
                </label>
              </div>
              <div className="mt-3 flex pl-2 font-thin">
                <label className="md:text-lg text-base  text-black">
                  REMARKS: <p className="text-base">{remarks}</p>
                </label>
              </div>

              <p className="font-bold md:text-[25px] text-lg mt-7 rounded-md text-black p-2 flex">
                <label> COMPANY INFORMATION </label>

                {studinfos.prevComp.length > 0 && (
                  <a>
                    <MdPreview
                      data-tooltip-id="Preview"
                      className="text-[30px] hover:text-blue-600 cursor-pointer"
                      onClick={() => setViewPrev(!viewPrev)}
                    />
                  </a>
                )}

                <PrevHistoryComp
                  setViewPrev={setViewPrev}
                  viewPrev={viewPrev}
                  info={studinfos.prevComp}
                />
              </p>
              <div className="grid md:grid-cols-2 grid-cols-1 pl-2 text-black font-thin">
                <label className=" mt-4 md:text-lg text-base ">
                  COMPANY NAME: {studinfos.companyname}
                </label>
                <label className=" mt-4 md:text-lg text-base ">
                  COMPANY ADDRESS: {studinfos.companyaddress}
                </label>
                <label className=" mt-4 md:text-lg text-base ">
                  SUPERVISOR NAME: {studinfos.supervisorname}
                </label>
                <label className=" mt-4 md:text-lg text-base ">
                  SUPERVISOR CONTACT #: {studinfos.supervisorcontactnumber}
                </label>
                <label className=" mt-4 md:text-lg text-base ">
                  SUPERVISOR OFFICER #: {studinfos.supervisorofficenumber}
                </label>
                <label className=" mt-4 md:text-lg text-base ">
                  COMPANY DESIGNATION: {studinfos.companydesignation}
                </label>
                <label className=" mt-4 md:text-lg text-base   mb-[20px]">
                  COMPANY EMAIL: {studinfos.companyemail}
                </label>
              </div>
            </div>
            <div className="mt-10">
              <p className="font-bold md:text-lg text-base mb-2 rounded-md text-black  p-2">
                Uploaded image in attendance
              </p>
              <div className="h-[300px]  bg-[#5f7caa] bg-opacity-[80%] mr-[1%] rounded-md overflow-y-auto">
                <div className="p-2 grid grid-cols-2">
                  {files.map((file) => (
                    <div key={file.id} className="p-2">
                      <div className="w-[100%]">
                        <div className="flex bg-slate-300 p-1 rounded-t-md">
                          Uploaded: <DateConverter date={file.created_at} />{" "}
                        </div>
                        <div className="p-1 bg-slate-200 rounded-b-md">
                          <center>
                            <img
                              src={`https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/StudentUploadedImages/${studemail}/${file.name}`}
                              className=" w-[50%] h-[300px] "
                            />
                          </center>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ReactTooltip
        id="Preview"
        place="right"
        variant="info"
        content="Previous Company"
      />
    </div>
  );
}
