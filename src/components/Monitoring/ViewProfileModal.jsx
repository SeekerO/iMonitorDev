import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "../iMonitorDBconfig";
import StudentUploadedImage from "./StudentUploadedImage";
import { AiOutlineClose } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";

import { ToastContainer, toast } from "react-toastify";

import copy from "copy-to-clipboard";
export default function ViewProfileModal({
  visible,
  onClose,
  studinfos,
  studemail,
  beneData,
}) {
  var remarks = "";
  const [files, setFiles] = useState([]);
  const [date, setDate] = useState();

  const [viewPicture, setViewPicture] = useState(false);

  useEffect(() => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="bg-gradient-to-r  to-slate-400 via-[#3a62a2] from-[#355b98]  h-[75%] mt-10 md:w-[70%]  rounded-xl shadow-black shadow-2xl "
        data-aos="zoom-in"
        data-aos-duration="500"
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
            <div className="flex-col text-black">
              <div className="flex">
                <span className="font-bold md:text-[25px] text-lg mb-3 rounded-md text-white w-[35%]  p-2">
                  STUDENT INFORMATION
                </span>
              </div>
              <Link
                to={"/" + studinfos.id}
                className={`${
                  beneData.filterby !== "ALL"
                    ? "hidden"
                    : " mb-7 pt-[0.5%] text-center w-fit  text-blue-100 hover:underline hover:text-red-500 font-semibold pl-2 flex items-center gap-1 "
                }`}
              >
                <BsPencilSquare /> EDIT
              </Link>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-x-10  mb-3 pl-2 text-white">
                <label className=" mt-4 md:text-lg text-base font-semibold ">
                  FULLNAME: {studinfos.studname}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  PROGRAM: {studinfos.studprogram}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  O365: {studinfos.studemail}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  SECTION: {studinfos.studsection}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  OJT START: {studinfos.ojtstart}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  OJT END: {studinfos.ojtend}
                </label>
              </div>
              <label className=" pt-6 md:text-lg text-base font-semibold pl-2 text-white">
                REMARKS: <p className="text-base">{remarks}</p>
              </label>
              <p className="font-bold md:text-[25px] text-lg mt-7 rounded-md text-white  p-2">
                COMPANY INFROMATION
              </p>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-x-5 pl-2 text-white">
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  COMPANY NAME: {studinfos.companyname}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  COMPANY ADDRESS: {studinfos.companyaddress}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  SUPERVISOR NAME: {studinfos.supervisorname}
                </label>
                <label
                  onClick={() => copyText(studinfos.supervisorcontactnumber)}
                  className=" mt-4 md:text-lg text-base font-semibold cursor-pointer"
                >
                  SUPERVISOR CONTACT #:{" "}
                  <label className="hover:text-blue-500 hover:underline cursor-pointer">
                    {studinfos.supervisorcontactnumber}
                  </label>
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  SUPERVISOR OFFICER #: {studinfos.supervisorofficenumber}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  COMPANY DESIGNATION: {studinfos.companydesignation}
                </label>
                <label
                  onClick={() => copyText(studinfos.supervisorcontactnumber)}
                  className=" mt-4 md:text-lg text-base font-semibold"
                >
                  COMPANY EMAIL:{" "}
                  <label className="hover:text-blue-500 hover:underline cursor-pointer">
                    {studinfos.companyemail}
                  </label>
                </label>
              </div>

              <div className="mt-10">
                <p className="font-bold md:text-lg text-base mb-2 rounded-md text-white p-2">
                  Uploaded image in attendance
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
        </div>
      </div>
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
