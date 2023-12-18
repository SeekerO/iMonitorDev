import React from "react";
import { saveAs } from "file-saver";
import axios from "axios";
import { AiFillFile } from "react-icons/ai";
import { Tooltip as ReactTooltip } from "react-tooltip";
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
  var title;
  const removeUUIDtitle = (title) => {
    var text = title.split(".")[1];
    title = text;
    return text;
  };
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
          <label className="w-[160px]  truncate">
            {removeUUIDtitle(e.name)}{" "}
          </label>
        </div>
      </div>
    </>
  );
}

export default DownloadFIle;
