import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import UploadLog from "./UploadLog";
import { FcExpired } from "react-icons/fc";
import moment from "moment";
function UploadStudentConfig({
  announceinfo,
  setGetId,
  setGetTitle,
  setGetMessage,
  setGetDate,
  setGetFiles,
  setGetFileName,
  RunStudentSubmission,
  setGetFileSubmit,
  setGetPostedBy,
  setCounter,
  setGetReadsBy,
}) {
  function handlePassDataToUploadLogProps() {
    setGetId(announceinfo.id);
    setGetMessage(announceinfo.announcementMessage);
    setGetTitle(announceinfo.announcementTitle);
    setGetDate(announceinfo.announcementStartDate);
    setGetPostedBy(announceinfo.PostedBy);
    setGetReadsBy(announceinfo.readsBy);
    fetchSpecificFile();
    handleGetDataFromStorageStudentSubmit();
  }

  const fetchSpecificFile = async () => {
    try {
      var state = false;
      var FileName;
      const { data, error } = await supabase.storage
        .from("AnnouncementAttachmentFiles")
        .list(announceinfo.announcementTitle);

      if (error) {
        console.error("Error fetching file list:", error);
      } else {
        for (let index = 0; index < data.length; index++) {
          FileName = data[index].name;
          setGetFileName(FileName);
          state = true;
        }
        if (state) {
          const { data: dataFile } = supabase.storage
            .from("AnnouncementAttachmentFiles")
            .getPublicUrl(`${announceinfo.announcementTitle}/${FileName}`, {
              download: true,
            });

          setGetFiles(dataFile);
        } else {
          setGetFiles(null);
        }
      }
    } catch (error) {
      console.error("No File");
      return;
    }
  };
  const [folderCount, setFolderCount] = useState(0);
  const [dataCount, setDataCount] = useState(0);
  const handleGetDataFromStorageStudentSubmit = async () => {
    const { data, error } = await supabase.storage
      .from("StudentAnnouncementSubmit")
      .list(announceinfo.announcementTitle + "/");

    if (data) {
    }
    const folderNames = Array.from(
      new Set(data.map((file) => file.name.split("/")[0]))
    );
    setGetFileSubmit(folderNames);

    const folderNames1 = data
      .map((file) => file.name.split("/")[0])
      .filter((name, index, arr) => arr.indexOf(name) === index);

    setFolderCount(folderNames1.length);

    const { count } = await supabase
      .from("StudentInformation")
      .select("*", { count: "exact" });

    setDataCount(count);
    setCounter(`${folderCount} / ${dataCount}`);
  };
  useEffect(() => {
    handleGetDataFromStorageStudentSubmit();
  }, [folderCount, dataCount]);

  const endDate = moment(new Date(announceinfo.announcementEndDate)).format(
    "Y/M/D"
  );
  const startDate = moment(new Date(announceinfo.announcementStartDate)).format(
    "Y/M/D"
  );
  const currDate = moment(new Date()).format("Y/M/D");

  return (
    <div className="hover:cursor-pointer p-2 rounded-md">
      <div
        onClick={() => handlePassDataToUploadLogProps()}
        className="z-0 bg-gray-100 p-3 text-start rounded-md hover:bg-gray-400 hover:cursor-pointer
        hover:translate-x-3  w-[230px]  h-[100px] text-[15px] overflow-hidden duration-500 hover:shadow-lg hover:shadow-black"
      >
        <label className="truncate flex items-center">
          {moment(endDate).isBefore(currDate) && (
            <em>
              <FcExpired className="text-[20px]" />
            </em>
          )}

          {announceinfo.announcementTitle}
        </label>
        <div className="grid text-[12px] font-thin">
          <label>START: {announceinfo.announcementStartDate}</label>

          <label>END: {announceinfo.announcementEndDate}</label>
        </div>
        <div className="flex text-[12px] font-thin">
          Student Submissions:
          <div className="text-blue-600 ml-2">
            {dataCount === 0 ? "-/-" : `${folderCount}/${dataCount}`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadStudentConfig;
