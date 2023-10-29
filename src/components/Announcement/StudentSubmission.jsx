import React, { useState } from "react";
import StudentUploadedFileConfig from "./StudentUploadedFileConfig";

function StudentSubmission({ getTitle, counter, getFileSubmit }) {

  return (
    <div className="h-[300px]">
      <div className="bg-black h-[100%]w-[98%] mt-2  rounded-br-md">
        <div className="bg-[#60A3D9] text-center p-2 font-semibold text-[20px]">
          Student Submissions
        </div>
        <div className="p-2 h-[250px] bg-white">
          <p className="flex">Number of Submissions: {counter} </p>

          <div className=" h-[200px] w-full overflow-y-auto">
            {getFileSubmit.map((folder, index) => (
              <StudentUploadedFileConfig
                key={index}
                studname={folder}
                announcementTitle={getTitle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentSubmission;
