import { useState } from "react";
import React from "react";
import ViewImage from "./ViewImage";
import DateConverter from "../Monitoring/DateConverter";
function StudentUploadedImage({ file, studemail }) {
  const [viewPicture, setViewPicture] = useState(false);
  return (
    <div
      onClick={() => setViewPicture(!viewPicture)}
      key={file.id}
      className="p-2"
    >
      <div className="w-[100%] h-[100%]">
        <div className="flex bg-slate-300 p-1 rounded-t-md">
          Uploaded: <DateConverter date={file.created_at} />{" "}
        </div>
        <div className="p-1 bg-slate-200 rounded-b-md w-[100%] ">
          <center>
            <img
              src={`https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/StudentUploadedImages/${studemail}/${file.name}`}
              className=" w-[50%] h-[300px]"
            />
            <ViewImage
              imgsrc={`https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/StudentUploadedImages/${studemail}/${file.name}`}
              visible={viewPicture}
              onClose={setViewPicture}
            />
          </center>
        </div>
      </div>
    </div>
  );
}

export default StudentUploadedImage;
