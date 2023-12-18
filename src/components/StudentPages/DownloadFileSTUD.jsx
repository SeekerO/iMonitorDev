import React from "react";
import { saveAs } from "file-saver";
import axios from "axios";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { AiFillFile } from "react-icons/ai";
function DownloadFileSTUD({ e, userInfo, ID }) {
  async function SaveFile() {
    try {
      const response = await axios.head(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${userInfo.id}_${ID}/${userInfo.id}/${e.name}`
      );

      return saveAs(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${userInfo.id}_${ID}/${userInfo.id}/${e.name}`,
        e.name
      );
    } catch (error) {
      return saveAs(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${userInfo.id}_${ID}/${ID}/${e.name}`,
        e.name
      );
    }
  }
  return (
    <>
      <div
        onClick={() => SaveFile()}
        className="flex items-center mt-1 cursor-default"
      >
        <div className="h-[60px] w-[60px] p-2 bg-slate-400 flex place-content-center items-center rounded-l-md">
          <AiFillFile className="text-slate-100" />
        </div>

        <div className="h-[60px] p-2  bg-blue-900 w-[100%] flex items-center rounded-r-md  text-white font-light  ">
          <label className="w-[160px]  truncate"> {e.name}</label>
        </div>
      </div>
    </>
  );
}

export default DownloadFileSTUD;
