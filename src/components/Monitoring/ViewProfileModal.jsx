import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../iMonitorDBconfig";
import StudentUploadedImage from "./StudentUploadedImage";
import { AiOutlineClose } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { MdPreview } from "react-icons/md";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { FaBuilding, FaFileImage } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { IoEyeSharp } from "react-icons/io5";
import Avatar from "@mui/material/Avatar";
import copy from "copy-to-clipboard";
import PrevHistoryComp from "./PrevHistoryComp";
export default function ViewProfileModal({
  visible,
  onClose,
  studinfos,
  studemail,
  beneData,
  displayColor,
  ReactTooltip,
}) {
  var remarks = "";
  const [files, setFiles] = useState([]);
  const [date, setDate] = useState();

  const [avatar, setAvatar] = useState(false);
  const [displayAvatarConfig, setDisplayAvatar] = useState();

  const [viewPrev, setViewPrev] = useState(false);
  useEffect(() => {
    displayAvatar(studinfos.studemail);
    // Call the function to fetch files from a specific folder
    fetchFilesInFolder(studemail);
  }, [studinfos]);

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

  function copyText(text) {
    copy(text);
    toast.info(`Copied: ${text}`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  }

  if (!visible) return null;

  if (studinfos.studremarks === null) {
    remarks = "NONE";
  }

  function avatarComponent(name) {
    return (
      <div
        style={{ background: displayColor }}
        className={`flex text-white items-center justify-center h-[200px]  w-[200px] rounded-full font-thin text-[30px] shadow-md shadow-black`}
      >{`${name.split(" ")[0][0]}${name.split(" ")[1][0]} `}</div>
    );
  }

  async function displayAvatar(email) {
    try {
      const { data: profilePic } = await supabase.storage
        .from("ProfilePic")
        .list(email + "/", { limit: 1, offset: 0 });

      if (profilePic) {
        setAvatar(true);

        setDisplayAvatar(
          `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/ProfilePic/${email}/${profilePic[0].name}`
        );
      }
    } catch (error) {
      setAvatar(false);
    }
  }

  function removeCourseAcro(course) {
    const modifiedCourse = course.replace(/\([^()]*\)/g, "").trim();
    return `(${studinfos.studsection}) ` + modifiedCourse;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="bg-slate-200 h-[75%] mt-10 md:w-[70%]  rounded-xl shadow-black shadow-2xl "
        data-aos="zoom-in"
        data-aos-duration="200"
      >
        <div className="flex justify-end  ">
          <button
            onClick={onClose}
            className="  w-[10%] h-[30px] justify-center items-center flex rounded-tr-md font-bold text-black text-[20px] hover:bg-red-400 bg-red-600 group:"
          >
            <AiOutlineClose className="" />
          </button>
        </div>
        <div className=" rounded-xl  m-[1%] h-[90%]">
          <form className="p-2 z-50 grid overflow-y-auto h-[100%]  rounded-xl ">
            <div className="flex flex-col justify-center place-content-center items-center mb-10">
              {avatar ? (
                <img
                  src={displayAvatarConfig}
                  className="h-[200px] w-[200px] rounded-full shadow-md shadow-black object-cover "
                ></img>
              ) : (
                avatarComponent(studinfos.studname)
              )}
              <label className=" mt-4  text-sm text-center font-thin text-black capitalize ">
                {studinfos.studname}
              </label>
              <label className=" mt-2  text-sm text-center font-thin text-black ">
                {removeCourseAcro(studinfos.studprogram)}
              </label>
              <label className=" mt-2  text-sm text-center font-thin text-black ">
                {studinfos.studSY}
              </label>
            </div>
            <div className="h-[1px] w-[100%] bg-yellow-500 mb-4" />
            <div className="flex-col text-black">
              <div className="flex items-center">
                <span className="font-bold flex md:text-[25px]  items-center text-lg rounded-md text-black  gap-1 p-2">
                  <BsFillPersonLinesFill className=" text-[25px]" /> STUDENT
                  INFORMATION
                  <div className="flex items-center">
                    {beneData.filterby === "ALL" && (
                      <Link to={"/UpdateProfile/" + studinfos.id}>
                        <button
                          className="hover:shadow-md hover:shadow-black bg-yellow-500 text-base p-0.5 px-2 rounded-md text-center w-fit   text-white 
                                       font-semibold  flex items-center gap-1 "
                        >
                          <BsPencilSquare /> EDIT
                        </button>{" "}
                      </Link>
                    )}
                  </div>
                </span>
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-x-10  mb-3 pl-2 text-black font-thin">
                <label className=" mt-4 md:text-lg text-base ">
                  O365: {studinfos.studemail}
                </label>{" "}
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
              <label className=" pt-6 md:text-lg text-base pl-2 text-black font-thin">
                REMARKS: <p className="text-base">{remarks}</p>
              </label>

              <div className="font-bold md:text-[25px] text-lg mt-7 rounded-md text-black  p-2 flex items-center gap-1 ">
                <label className="flex items-center gap-1">
                  <FaBuilding className="text-[20px]" /> COMPANY INFORMATION
                </label>

                {studinfos.prevComp.length > 0 && (
                  <a
                    data-tooltip-id="Preview"
                    onClick={() => setViewPrev(!viewPrev)}
                    className=" border-2 border-yellow-500 h-[25px] w-[25px] justify-center items-center flex rounded-full hover:shadow-black hover:shadow-md"
                  >
                    <IoEyeSharp className="text-[20px] cursor-pointer text-yellow-500" />
                  </a>
                )}

                <PrevHistoryComp
                  setViewPrev={setViewPrev}
                  viewPrev={viewPrev}
                  info={studinfos.prevComp}
                  ReactTooltip={ReactTooltip}
                />
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-x-5 pl-2 text-black">
                <label className=" mt-4 md:text-lg text-base font-thin">
                  COMPANY NAME: {studinfos.companyname}
                </label>
                <label className=" mt-4 md:text-lg text-base font-thin">
                  COMPANY ADDRESS: {studinfos.companyaddress}
                </label>
                <label className=" mt-4 md:text-lg text-base font-thin">
                  SUPERVISOR NAME: {studinfos.supervisorname}
                </label>
                <label
                  onClick={() => copyText(studinfos.supervisorcontactnumber)}
                  className=" mt-4 md:text-lg text-base font-thin cursor-pointer"
                >
                  SUPERVISOR CONTACT #:
                  <label className="hover:text-blue-500 hover:underline cursor-pointer">
                    {studinfos.supervisorcontactnumber}
                  </label>
                </label>
                <label className=" mt-4 md:text-lg text-base font-thin">
                  SUPERVISOR OFFICE #: {studinfos.supervisorofficenumber}
                </label>
                <label className=" mt-4 md:text-lg text-base font-thin">
                  COMPANY DESIGNATION: {studinfos.companydesignation}
                </label>
                <label
                  onClick={() => copyText(studinfos.supervisorcontactnumber)}
                  className=" mt-4 md:text-lg text-base font-thin"
                >
                  COMPANY EMAIL:{" "}
                  <label className="hover:text-blue-500 hover:underline cursor-pointer">
                    {studinfos.companyemail}
                  </label>
                </label>
              </div>

              <div className="mt-10">
                <p className="font-bold flex gap-1 items-center md:text-lg text-base mb-2 rounded-md text-black p-2">
                  <FaFileImage className="text-[20px]" /> Uploaded image in
                  attendance
                </p>
                <div className="h-[300px]  bg-[#5f7caa] bg-opacity-[80%]  mr-[1%] rounded-md overflow-y-auto">
                  <div className="p-2 grid grid-cols-2">
                    {files
                      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                      .map((file) => (
                        <StudentUploadedImage
                          key={file.id}
                          file={file}
                          studemail={studemail}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>{" "}
      </div>
      <ReactTooltip
        id="Preview"
        place="right"
        variant="info"
        content="Previous Company"
      />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
}
