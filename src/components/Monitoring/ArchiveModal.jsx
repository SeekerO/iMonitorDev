import React, { useState } from "react";
import supabase from "../iMonitorDBconfig";

import { RiInformationFill } from "react-icons/ri";
import { TailSpin } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import Check from "./Check.json";
import Lottie from "lottie-react";
import moment from "moment";

export default function ArchiveModal({
  visible,
  onClose,
  studinfos,
  BeneData,
}) {
  const [upload, setIsUploading] = useState(false);
  const [check, setCheck] = useState(false);
  if (!visible) return null;

  function refresh() {
    onClose();
  }

  // Archive
  const handlearchive = async () => {
    setIsUploading(true);
    //set status of the student
    if (studinfos.studprogress !== studinfos.studmaxprogress) {
      studinfos.status = "incomplete";
    }
    if (studinfos.studprogress === studinfos.studmaxprogress) {
      studinfos.status = "complete";
    }
    await supabase.from("MasterListTable1").insert([
      {
        studname: studinfos.studname,
        studemail: studinfos.studemail,
        ojtstart: studinfos.ojtstart,
        ojtend: studinfos.ojtend,
        studprogram: studinfos.studprogram,
        status: studinfos.status,
        studsection: studinfos.studsection,
        studremarks: studinfos.studremarks,
        companyname: studinfos.companyname,
        companyaddress: studinfos.companyaddress,
        supervisorname: studinfos.supervisorname,
        supervisorcontactnumber: studinfos.supervisorcontactnumber,
        supervisorofficenumber: studinfos.supervisorofficenumber,
        companydesignation: studinfos.companydesignation,
        companyemail: studinfos.companyemail,
        studmaxprogress: studinfos.studmaxprogress,
        studprogress: studinfos.studprogress,
        filterby: studinfos.studcourse,
        prevComp: studinfos.prevComp,
        studSY: "S.Y. 2023-2024",
      },
    ]);

    var date = moment().format("LLL");

    await supabase.from("ArchiveLog").insert([
      {
        archivedBy: BeneData.beneName,
        archivedDate: date,
        archivedName: studinfos.studname,
        archivedEmail: studinfos.studemail,
        archivedCourse: studinfos.studcourse
      },
    ]);

    setIsUploading(true);
    setCheck(true);
    setTimeout(() => {
      handledelete();
      onClose();
      refresh();
    }, 1300);

    // toast.success("Archived Sucessfully!", {
    //   position: "top-center",
    //   autoClose: 1000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: false,
    //   draggable: true,
    //   progress: undefined,
    //   theme: "light",
    // });
  };

  const handledelete = async () => {
    await supabase.from("StudentInformation").delete().eq("id", studinfos.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4">
      <div
        className="bg-white  h-[220px] w-[400px] rounded-md grid p-4 gap-5  shadow-black shadow-2xl "
        data-aos="zoom-in"
        data-aos-duration="500"
      >
        {!upload ? (
          <>
            <div className="text-black text-center md:text-base text-[12px] font-semibold">
              Confirming this will transfer the student information to the
              Master List and will be mark as Complete or Incomplete.
            </div>
            <label className="md:text-base text-[12px] opacity-80 flex gap-0.5 place-content-center items-center text-blue-500">
              <RiInformationFill className="text-blue-500 text-[25px] rounded-full bg-gray-200" />
              Note: Confirming this cannot be undo.
            </label>
            <div className="flex justify-center ">
              <button
                onClick={onClose}
                className="bg-[#0074B7] hover:bg-[#0074B7] hover:bg-opacity-80 h-10 w-20 mr-[2%] rounded-md"
              >
                Cancel
              </button>

              <button
                disabled={upload}
                onClick={() => handlearchive()}
                className={`${
                  upload
                    ? "bg-gray-500"
                    : " bg-[#0074B7] hover:bg-[#0074B7] hover:bg-opacity-80"
                }  h-10 w-20 ml-[2%] rounded-md`}
              >
                Confirm
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            {check ? (
              <>
                <Lottie animationData={Check} />
              </>
            ) : (
              <TailSpin
                height="80"
                width="80"
                color="#0074B7"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            )}
          </div>
        )}
      </div>
      <ToastContainer limit={1} />
    </div>
  );
}
