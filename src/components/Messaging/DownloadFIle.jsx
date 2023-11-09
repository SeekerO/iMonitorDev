import React from "react";
import { saveAs } from "file-saver";
import axios from "axios";
import { AiFillFile } from "react-icons/ai";
import Tooltip from "@mui/material/Tooltip";
function DownloadFIle({ e, userInfo, ID }) {
  async function SaveFile() {
    try {
      const response = await axios.head(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${ID}_${userInfo.id}/${userInfo.id}/${e.name}`
      );

      return saveAs(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${ID}_${userInfo.id}/${userInfo.id}/${e.name}`,
        e.name
      );
    } catch (error) {
      return saveAs(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${ID}_${userInfo.id}/${ID}/${e.name}`,
        e.name
      );
    }
  }

  return (
    <>
      {/* <div onClick={() => SaveFile()} className="w-full flex items-center">
        <AiFillFile className="bg-gray-500 h-[25px] items-center flex" />
        <label className="h-[25px]flex items-center justify-center indent-2 bg-blue-900 text-white mt-1 rounded-r-md gap-y-1">
          {e.name}
        </label>
      </div> */}

      <div className="flex items-center mt-1 cursor-default">
        <div className="h-[60px] w-[60px] p-2 bg-slate-400 flex place-content-center items-center rounded-l-md">
          <AiFillFile className="text-slate-100" />
        </div>
        <Tooltip title={e.name} arrow placement="left-start">
          <div className="h-[60px] p-2  bg-blue-900 w-[100%] flex items-center rounded-r-md  text-white font-light  ">
            <label className="w-[160px]  truncate"> {e.name}</label>
          </div>
        </Tooltip>
      </div>
    </>
  );
}

export default DownloadFIle;
