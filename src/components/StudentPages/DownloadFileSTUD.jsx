import React from "react";
import { saveAs } from "file-saver";
import axios from "axios";

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
    <div
      onClick={() => SaveFile()}
      className="w-[100%] truncate bg-blue-900 text-white p-1 mt-1 rounded-md"
    >
      {e.name}
    </div>
  );
}

export default DownloadFileSTUD;
