import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import supabase from "../iMonitorDBconfig";
import DateConverter from "../Monitoring/DateConverter";
import { AiOutlineClose } from "react-icons/ai";
import copy from "copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
export default function ViewStudData({
  visible,
  onClose,
  studinfos,
  studemail,
}) {
  var remarks;
  const [files, setFiles] = useState([]);

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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center ">
      <div
        className="bg-slate-200 h-[100%] w-[100%]  rounded-xl shadow-black shadow-2xl "
        data-aos="zoom-in"
        data-aos-duration="500"
      >
        <div className="flex justify-end ">
          <button
            onClick={() => onClose(!visible)}
            className="bg-red-600 w-[10%] h-[30px] rounded-br-none rounded-tr-md font-bold hover:bg-red-400 justify-center items-center flex  text-[20px]"
          >
            <AiOutlineClose />
          </button>
        </div>
        <div className=" rounded-xl m-[1%] h-[90%] text-black">
          <form className=" p-2 z-50 h-[98%]  rounded-xl overflow-y-scroll ">
            <div className="flex-col  ">
              <div className="font-bold md:text-[25px] text-lg mb-3 flex gap-6">
                STUDENT INFORMATION
              </div>
              <p className="font-semibold  md:text-lg text-base">
                STUDENT PROGRESS: {studinfos.studprogress} /{" "}
                {studinfos.studmaxprogress}
              </p>
              <div className="grid md:grid-cols-2 grid-cols-1 ">
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  FULLNAME: {studinfos.studname}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  PROGRAM: {studinfos.studprogram}
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  EMAIL: {studinfos.studemail}
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
              <div className="mt-3 flex">
                <label className="md:text-lg text-base font-semibold">
                  REMARKS: <p className="text-base">{remarks}</p>
                </label>
              </div>
              <div className="h-[1px] w-[100%] bg-yellow-500 mt-4" />
              <p className="font-bold md:text-[25px] text-lg mt-7">
                COMPANY INFROMATION
              </p>
              <div className="grid md:grid-cols-2 grid-cols-1 ">
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
                  onClick={() => copyText(studinfos.companyemail)}
                  className=" mt-4 md:text-lg text-base font-semibold"
                >
                  COMPANY EMAIL:{" "}
                  <label className="hover:text-blue-500 hover:underline cursor-pointer">
                    {studinfos.companyemail}
                  </label>
                </label>
              </div>
            </div>
            <div className="mt-10">
              <p className="font-bold md:text-lg text-base">
                Uploaded image in attendance
              </p>
              <div className="h-[300px]  bg-[#5f7caa]  mr-[1%] rounded-md overflow-y-auto">
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
    </div>
  );
}
