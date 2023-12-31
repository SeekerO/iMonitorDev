import React, { useState, useEffect } from "react";
import moment from "moment";
import supabase from "../iMonitorDBconfig";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";

const AnnouncementConfig = ({
  announcementinfo,
  setGetId,
  setGetMessage,
  setGetTitle,
  setGetDate,
  setGetEndDate,
  setGetAllow,
  setGetFiles,
  setGetFileName,
  setGetPostedBy,
  studemail,
  ReactTooltip,
}) => {
  const [Files, setFiles] = useState([]);
  const [state, setState] = useState(false);
  const [readby, setReadBy] = useState();

  const [Announcement_Notif, setAnnouncementNotif] = useState(false);
  var date = new Date();
  var announceDate = new Date(announcementinfo.announcementEndDate);

  function DateByDay(a) {
    const today = new Date(a);
    const date = today.getDate();
    return `${date}`;
  }

  function handleclick() {
    try {
      InsertReadAnnouncement();
      setGetId(announcementinfo.id);
      setGetMessage(announcementinfo.announcementMessage);
      setGetTitle(announcementinfo.announcementTitle);
      setGetDate(announcementinfo.announcementStartDate);
      setGetEndDate(announcementinfo.announcementEndDate);
      setGetAllow(announcementinfo.announcementAllow);
      setGetPostedBy(announcementinfo.PostedBy);
      fetchSpecificFile();
      logclick();
      setAnnouncementNotif(false);
    } catch (error) {}
  }

  const fetchSpecificFile = async () => {
    try {
      var state = false;
      var FileName;
      const { data, error } = await supabase.storage
        .from("AnnouncementAttachmentFiles")
        .list(announcementinfo.announcementTitle);

      if (error) {
        console.error("Error fetching file list:", error);
      } else {
        for (let index = 0; index < data.length; index++) {
          FileName = data[index].name;
          setGetFileName(FileName);
          state = true;
        }
        if (state) {
          const { data } = supabase.storage
            .from("AnnouncementAttachmentFiles")
            .getPublicUrl(`${announcementinfo.announcementTitle}/${FileName}`, {
              download: true,
            });
          setGetFiles(data);
        } else {
          setGetFiles(null);
        }
      }
    } catch (error) {
      console.error("No File");
      return;
    }
  };

  const logclick = async () => {
    try {
      var date = moment().format("LLL");

      const { data: studdata } = await supabase
        .from("StudentInformation")
        .select()
        .eq("studemail", studemail)
        .single();

      var name = studdata.studname;
      var button = announcementinfo.announcementTitle;
      const { data: actlog } = await supabase
        .from("ActivityLog")
        .insert([{ name: name, button: button, time: date }]);
    } catch (error) {}
  };

  const InsertReadAnnouncement = async () => {
    var prevArray = announcementinfo.readsBy;
    var bool = false;
    for (let index = 0; index < prevArray.length; index++) {
      if (prevArray[index] === studemail) {
        bool = true;
      }
    }
    if (!bool) {
      prevArray.push(studemail);
      const { data } = await supabase
        .from("AnnouncementTable")
        .update({ readsBy: prevArray })
        .eq("id", announcementinfo.id);
    }
  };

  useEffect(() => {
    handleNotificationForAnnouncement();
  }, [announcementinfo]);

  function handleNotificationForAnnouncement() {
    var notif = true;
    var currArray = announcementinfo.readsBy;
    for (let index = 0; index < currArray.length; index++) {
      if (currArray[index] === studemail) notif = false;
    }

    if (notif) {
      setAnnouncementNotif(true);
    }
  }

  const removeUUIDtitle = (title) => {
    var text = title.split(".")[1];
    return text;
  };

  return (
    <>
      <div>
        <div
          onClick={() => handleclick()}
          className={` ${
            moment(announceDate).isBefore(date)
              ? "bg-gray-400 text-black h-20 p-1 rounded-md "
              : `${
                  state
                    ? "bg-black"
                    : " text-black h-24 p-1 rounded-md  hover:shadow-md hover:shadow-black hover:translate-x-1 duration-300"
                }`
          } 
   `}
        >
          <div className="flex items-center gap-0.5">
            {Announcement_Notif ? (
              <IoNotificationsCircleOutline className="text-red-600 text-[20px]" />
            ) : null}
            <p className="font-bold md:text-[20px] text-[10px] line-clamp-1 flex items-center">
              {moment(announceDate).isBefore(date) && (
                <FaHistory
                  className=" bg-[#274472 rounded-full p-1 text-[25px] text-black"
                  data-tooltip-id="History"
                />
              )}{" "}
              {removeUUIDtitle(announcementinfo.announcementTitle)}
            </p>
          </div>
          <p className="md:text-[15px] text-[10px]">
            {announcementinfo.announcementStartDate}
          </p>
        </div>
      </div>
      <ReactTooltip
        id="History"
        place="right"
        variant="info"
        content="History"
      />
    </>
  );
};

export default AnnouncementConfig;
