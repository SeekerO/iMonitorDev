import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import AnnouncementConfig from "./AnnouncementConfig";
import "react-datepicker/dist/react-datepicker.module.css";
import { ToastContainer, toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import moment from "moment";
import { Tooltip as ReactTooltip } from "react-tooltip";
function AnnouncementStudent({ studemail }) {
  const [announcementinfo, setAnnouncementInfo] = useState([]);
  const [announcementinfoState, setAnnouncementInfoState] = useState(false);
  const [title, setTitle] = useState("");
  const [studname1, setStudName1] = useState();

  const [getId, setGetId] = useState("");
  const [getTitle, setGetTitle] = useState("");
  const [getMessage, setGetMessage] = useState("");
  const [getDate, setGetDate] = useState("");
  const [getEndDate, setGetEndDate] = useState("");
  const [getAllow, setGetAllow] = useState("");
  const [getPostedBy, setGetPostedBy] = useState("");

  const [getFiles, setGetFiles] = useState([]);
  const [getFileName, setGetFileName] = useState();

  const [studentFile, setStudentFile] = useState();

  const [uploading, setUploading] = useState(false);

  const [opensubmit, setOpenSubmit] = useState(false);

  useEffect(() => {
    handlefetchinfo();
    fetchstudinfo();

    const AnnouncementTable = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "AnnouncementTable" },
        (payload) => {
          handlefetchinfo();
          fetchstudinfo();
        }
      )
      .subscribe();
  }, []);

  const [isEmpty, setIsEmpty] = useState(false);
  let [file, setFile] = useState([]);
  const [filename, setFileName] = useState();

  const handleFileInputChange = (event) => {
    const files = event.target.files;
    const datafile = event.target.files[0];
    if (files.length > 0) {
      setFile(datafile);
      setFileName(datafile.name);
    }
  };

  const fetchstudinfo = async () => {
    try {
      const { data, error } = await supabase
        .from("StudentInformation")
        .select()
        .eq("studemail", studemail)
        .single();

      if (data) {
        setStudName1(data.studname);
      }
      if (error) {
      }
    } catch (error) {}
  };

  const handleUploadSubmitAnnouncement = async () => {
    try {
      if (file.length === 0) {
        nofile();
        return;
      }
      setUploading(true);
      let random = Math.floor(Math.random() * 100) + 1;
      setIsEmpty(true);
      const { data1 } = await supabase.storage
        .from("StudentAnnouncementSubmit")
        .upload(getTitle + "/" + studname1 + "/" + random + filename, file);
      // .upload(Teachers_name + "/" + Course + "/" + Section + "/" + filename, file);
      notifyuploaded();
      setFile([]);
      setUploading(false);
    } catch (error) {}
  };

  function notifyuploaded() {
    toast.info("File has been submitted!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    setTimeout(() => {
      setIsEmpty(false);
    }, 1000);
  }
  function nofile() {
    toast.warn("No File Detected!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  async function handlefetchinfo() {
    try {
      const { data, error } = await supabase.from("AnnouncementTable").select();

      if (data) {
        setAnnouncementInfo(data);
        setTitle(data.announcementTitle);
        if (data < 1) {
          setAnnouncementInfoState(false);
          return;
        }
        setAnnouncementInfoState(true);
      }
    } catch (error) {}
  }

  useEffect(() => {
    getstudfilsubmitted();
  }, [getId, uploading]);

  async function getstudfilsubmitted() {
    const { data: studfile } = await supabase.storage
      .from("StudentAnnouncementSubmit")
      .list(getTitle + "/" + studname1);

    setStudentFile(studfile);
  }
  var date = moment().format("LLL");
  var announceDate = moment(new Date(getEndDate)).format("LLL");
  const showDate = date > announceDate;

  return (
    <>
      <ToastContainer limit={1} />
      <div className=" flex items-center h-screen flex-col">
        <div className="font-bold text-[30px] text-center h-[10%] text-white">
          Announcements
        </div>
        <div className=" w-[90%] md:h-[75%] h-[60%]  gap-1 flex rounded-md">
          <div className="bg-slate-200 md:w-[25%] w-[30%] h-[100%]  rounded-l-md">
            <div className="overflow-y-auto  rounded-md  h-[100%]">
              {announcementinfoState ? (
                <div>
                  {announcementinfo
                    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                    .map((announcementinfo) => (
                      <div
                        key={announcementinfo.id}
                        className="hover:cursor-pointer p-2 rounded-md "
                      >
                        <AnnouncementConfig
                          announcementinfo={announcementinfo}
                          setGetId={setGetId}
                          setGetTitle={setGetTitle}
                          setGetDate={setGetDate}
                          setGetEndDate={setGetEndDate}
                          setGetMessage={setGetMessage}
                          setGetAllow={setGetAllow}
                          setGetFiles={setGetFiles}
                          setGetFileName={setGetFileName}
                          setGetPostedBy={setGetPostedBy}
                          studemail={studemail}
                          ReactTooltip={ReactTooltip}
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex items-center justify-center place-content-center h-[100%] w-[100%] text-center font-semibold md:text-[25px] text-[15px]">
                  No Announcement
                </div>
              )}
            </div>
          </div>
          {/* Middle Display Announcement Here */}
          <div
            className={`${
              window.innerWidth <= 768
                ? `${opensubmit ? `hidden` : `bg-slate-200  w-[100%] h-[100%]`}`
                : `bg-slate-200  w-[100%] h-[100%]`
            }`}
          >
            {getId ? (
              <div id="announcement" className="pl-[2%] pt-3 pr-[2%] h-[90%]">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-[20px]  overflow-x-auto md:h-20 h-[10%] ">
                    {getTitle}
                  </div>
                  <a
                    onClick={() => setOpenSubmit(!opensubmit)}
                    className="text-blue-600 underline cursor-pointer"
                  >
                    Submissions
                  </a>
                </div>

                <div className="font-semibold text-[13px]">
                  Posted By: {getPostedBy}
                </div>
                <div className="font-medium text-[10px] mb-10">
                  Posted on {getDate} | Until {moment(getEndDate).format("LL")}
                </div>
                <div className="p-2 font-sans font-medium text-[15px] pl-2 md:h-[50%] h-[50%] mb-2 text-start overflow-y-auto ">
                  {getMessage}

                  {getFiles && (
                    <div className="flex gap-2 mt-4">
                      <h3>Download Link:</h3>
                      <a
                        href={getFiles.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {getFileName}
                      </a>
                    </div>
                  )}
                </div>

                {uploading ? (
                  <div className="flex flex-col text-blue-600 items-center">
                    Uploading please wait...
                    <BeatLoader color="#3e4de1" size={12} />
                  </div>
                ) : (
                  <div>
                    {getAllow === "true" ? (
                      <div className="grid">
                        <div className="">
                          {showDate && (
                            <>
                              <div className="font-semibold gap-4 flex ">
                                Upload file here{" "}
                              </div>
                              <input
                                type="file"
                                onChange={handleFileInputChange}
                                className=" w-[200px] overflow-x-auto "
                              />

                              <button
                                disabled={isEmpty}
                                onClick={handleUploadSubmitAnnouncement}
                                className={`${
                                  isEmpty
                                    ? "bg-gray-400 w-[100px] rounded-md p-1 text-black mt-2 "
                                    : " mt-2 w-[100px] rounded-md p-1 bg-blue-500 hover:bg-blue-700 text-white font-semibold"
                                }`}
                              >
                                Submit
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="justify-center text-center items-center flex h-[100%] w-[100%] font-semibold font-sans md:text-[30px] text-[20px]">
                Announcement will display here
              </div>
            )}
          </div>

          {opensubmit && (
            <div
              className={`bg-slate-200 md:w-[35%] w-[100%] rounded-r-md h-[100%]`}
            >
              <div className="flex items-center md:justify-center grid-cols-2 bg-[#5885AF]">
                <a
                  onClick={() => setOpenSubmit(!opensubmit)}
                  className={`${
                    window.innerWidth >= 768
                      ? "hidden"
                      : `mr-[10%] text-white underline cursor-pointer ml-2 text-[13px]`
                  }`}
                >
                  Back
                </a>
                <div className="flex w-[100%] p-1 gap-1 items-center bg-[#5885AF] text-white rounded-tr-md">
                  <label className="text-lg flex  font-semibold">
                    Submitted:
                  </label>
                  <label className="text-lg flex  font-semibold">
                    {getTitle}
                  </label>
                </div>
              </div>
              <div className="h-[2px] bg-black w-[100%]" />
              {studentFile && (
                <div>
                  {studentFile
                    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                    .map((file) => (
                      <div
                        key={file.id}
                        className="cursor-pointer grid bg-[#274472] bg-opacity-70 text-white hover:p-3 p-2 hover:bg-opacity-90 duration-300 "
                      >
                        <a
                          onClick={() =>
                            window.open(
                              `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/StudentAnnouncementSubmit/${getTitle}/${studname1}/${file.name}`
                            )
                          }
                          className="cursor-pointer text-[13px] hover:text-blue-400 hover:underline"
                        >
                          Click to Open
                        </a>
                        <label className=" text-[13px] flex">
                          File Submitted: {file.name}
                        </label>
                        <label className=" text-[10px] flex">
                          Date Submitted:{" "}
                          {moment(file.created_at).format("LLL")}
                        </label>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AnnouncementStudent;
