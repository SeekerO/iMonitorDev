import React from "react";
import { RiInformationFill } from "react-icons/ri";

function NoteForBatchUpload({ visible, close }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0  flex justify-center items-center">
      <div className="bg-black bg-opacity-5 backdrop-blur-[1px] h-[650px] w-[800px] flex justify-center items-center">
        <div className="bg-white h-[35%] w-[450px] shadow-lg shadow-black rounded-md flex flex-col place-content-center items-center">
          <div className="text-center flex-col justify-center items-center flex pb-[20px]">
            <RiInformationFill className="text-blue-500 text-[50px]  rounded-full   " />
            <label className="w-[500px]  ">
              Note: Kindly use this{" "}
              <a
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() =>
                  window.open(
                    "https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/Template/BatchFilingTemplate.xlsx"
                  )
                }
              >
                "Batch Filing Template"
              </a>{" "}
              when using the registration by batch.
            </label>
          </div>
          <a
            className="hover:text-red-600 cursor-pointer hover:underline text-[15px]"
            onClick={() => close(false)}
          >
            Close
          </a>
        </div>
      </div>
    </div>
  );
}

export default NoteForBatchUpload;
