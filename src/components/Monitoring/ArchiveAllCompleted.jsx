import React, { useState } from "react";
import supabase from "../iMonitorDBconfig";
import { Link } from "react-router-dom";
import { RiInformationFill } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import Check from "./Check.json";
import Lottie from "lottie-react";
import { BsInfoCircleFill } from "react-icons/bs";

export default function ArchiveAllCompleted({ visible, onClose }) {
  const [upload, setIsUploading] = useState(false);
  const [info, setInfo] = useState(false);
  const [check, setCheck] = useState(false);
  if (!visible) return null;

  async function handleArchiveCompleted() {
    setIsUploading(true);
    const { data: studinfos } = await supabase
      .from("StudentInformation")
      .select();

    let count = 0;
    let studentcount = studinfos.length;
    for (let index = 0; index < studinfos.length; index++) {
      if (studinfos[index].studprogress === studinfos[index].studmaxprogress) {
        count--;
        var stat;
        if (studinfos.studprogress !== studinfos.studmaxprogress) {
          stat = "incomplete";
        }
        if (studinfos.studprogress === studinfos.studmaxprogress) {
          stat = "complete";
        }

        const { data: insert } = await supabase
          .from("MasterListTable1")
          .insert([
            {
              studname: studinfos[index].studname,
              studemail: studinfos[index].studemail,
              ojtstart: studinfos[index].ojtstart,
              ojtend: studinfos[index].ojtend,
              studprogram: studinfos[index].studprogram,
              status: stat,
              studsection: studinfos[index].studsection,
              studremarks: studinfos[index].studremarks,
              companyname: studinfos[index].companyname,
              companyaddress: studinfos[index].companyaddress,
              supervisorname: studinfos[index].supervisorname,
              supervisorcontactnumber: studinfos[index].supervisorcontactnumber,
              supervisorofficenumber: studinfos[index].supervisorofficenumber,
              companydesignation: studinfos[index].companydesignation,
              companyemail: studinfos[index].companyemail,
              studmaxprogress: studinfos[index].studmaxprogress,
              studprogress: studinfos[index].studprogress,
              filterby: studinfos[index].studcourse,
              studSY: "S.Y. 2023-2024",
            },
          ]);

        const { error } = await supabase
          .from("StudentInformation")
          .delete()
          .eq("id", studinfos[index].id);
      }
      count++;
    }
    // No Data
    if (studentcount === count) {
      setInfo(true);
      setCheck(true);
    }
    // With Data
    else {
      setCheck(true);

      setTimeout(() => {
        setIsUploading(false);
        onClose(!visible);
      }, 1200);
    }
  }
  const ok = () => {
    onClose(!visible);
    setInfo(false);
    setCheck(false);
    setIsUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4">
      <div
        className="bg-white h-[220px] w-[400px] rounded-md grid p-4 gap-5  shadow-black shadow-2xl "
        data-aos="zoom-in"
        data-aos-duration="500"
      >
        {!upload ? (
          <>
            <div className="text-black text-center md:text-base text-[12px] font-semibold">
              Confirming this will transfer all the student information that is
              completed to the masterlist.
            </div>
            <label className="md:text-base text-[12px] opacity-80 flex gap-0.5 place-content-center items-center text-blue-500">
              <RiInformationFill className="text-blue-500 text-[25px] rounded-full bg-gray-200" />
              Note: Confirming this cannot be undo.
            </label>
            <div className="flex justify-center ">
              <button
                onClick={() => onClose(!visible)}
                className="bg-[#0074B7] hover:bg-[#0074B7] hover:bg-opacity-80 h-10 w-20 mr-[2%] rounded-md"
              >
                Cancel
              </button>

              <button
                disabled={upload}
                onClick={() => handleArchiveCompleted()}
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
                {info ? (
                  <div className="flex flex-col gap-y-3 items-center justify-center">
                    <label className="text-blue-500 font-semibold text-[15px] flex items-center gap-x-1">
                      <BsInfoCircleFill className="text-[20px]" /> It appears
                      that nobody is completed.
                    </label>
                    <button
                      onClick={() => ok()}
                      className="bg-[#0074B7] hover:bg-[#0074B7] hover:bg-opacity-80 w-[100px] p-1 px-5 rounded-md"
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <Lottie animationData={Check} className="h-[110px]" />
                )}
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
