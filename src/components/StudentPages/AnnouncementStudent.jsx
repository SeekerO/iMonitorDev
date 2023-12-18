import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import AnnouncementConfig from "./AnnouncementConfig";
import "react-datepicker/dist/react-datepicker.module.css";
import { ToastContainer, toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import moment from "moment";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { FaRectangleList } from "react-icons/fa6";
import { FaFileCircleCheck } from "react-icons/fa6";
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
  var date = moment(new Date()).format("LLL");
  var announceDate = moment(new Date(getEndDate)).format("LLL");

  const removeUUIDtitle = (title) => {
    var text = title.split(".")[1];
    return text;
  };

  const [search, setSearch] = useState("");
  return (
    <>
      <ToastContainer limit={1} />
      <div className=" flex justify-center h-screen ">
        <div className="mt-[5%] h-[70%] flex gap-2 md:p-1 p-10">

          <div className="md:w-[240px] w-[140px] h-[100%] bg-slate-200 rounded-l-md shadow-md shadow-black">
            <div className="flex items-center justify-center gap-1 md:text-[24px] text-[12px] bg-[#274472] text-white p-2 font-semibold">
              <span>
                <FaRectangleList className="md:text-[30px] text-[12px] h-fit " />
              </span>
              Announcement
            </div>
            <div className="grid justify-center mt-2 w-[100%]">
              <input
                type="search"
                placeholder="Search"
                className="pl-2  text-center rounded-md p-1 w-full focus:shadow-black shadow-sm outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></input>
            </div>
            <div className="overflow-y-auto overflow-x-hidden  w-full md:h-[80%] h-[60%] ">
              {announcementinfoState ? (
                <div className="w-full">
                  {announcementinfo

                    .sort((a, b) =>
                      a.announcementEndDate < b.announcementEndDate ? 1 : -1
                    )
                    .filter((announce) => {
                      try {
                        var text = announce.announcementTitle
                          .split(".")[1]
                          .toLowerCase();
                        if (search === "") {
                          return announce;
                        } else if (text.includes(search.toLowerCase())) {
                          return announce;
                        }
                      } catch (error) {}
                    })
                    .map((announcementinfo) => (
                      <div
                        key={announcementinfo.id}
                        className="hover:cursor-pointer p-1 rounded-md "
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

          <div
            className={`${
              window.innerWidth <= 768
                ? `${
                    opensubmit
                      ? `hidden`
                      : `bg-slate-200  w-[100%] min-h-[100%] max-h-auto `
                  }`
                : `w-[700px] h-[100%] bg-slate-200 rounded-r-md shadow-md shadow-black  `
            } `}
          >
            {getId ? (
              <div id="announcement" className="pl-[2%] pt-3 pr-[2%] h-[90%]">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-[20px]  overflow-x-auto md:min-h-10 md:max-h-20 h-[10%] ">
                    {removeUUIDtitle(getTitle)}
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
                <div className="p-2 font-sans font-medium text-[15px] pl-2 h-[50%] mb-2 text-start overflow-y-auto ">
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
                  <div className="">
                    {getAllow === "true" && (
                      <div className="grid">
                        <div className="">
                          {moment(date).isBefore(announceDate) && (
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
              className={`bg-slate-200 md:w-[300px] w-[200px] rounded-md h-[100%] shadow-md shadow-black`}
            >
              <div className="flex items-center md:justify-center grid-cols-2 bg-[#274472]">
                <a
                  onClick={() => setOpenSubmit(!opensubmit)}
                  className={`${
                    window.innerWidth >= 768
                      ? "hidden "
                      : `mr-[10%] text-white underline cursor-pointer ml-2 text-[13px]`
                  } duration-300 `}
                >
                  Back
                </a>
                <div className="flex w-[100%] p-1 gap-1 items-center justify-center bg-[#274472] text-white rounded-tr-md">
                  <label className="text-lg flex  font-semibold">
                    Submitted
                  </label>
                </div>
              </div>

              {studentFile && (
                <div className=" w-full">
                  {studentFile
                    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                    .map((file) => (
                      <div
                        onClick={() =>
                          window.open(
                            `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/StudentAnnouncementSubmit/${getTitle}/${studname1}/${file.name}`
                          )
                        }
                        key={file.id}
                        className="flex items-center w-[300px] h-[60px] bg-slate-400 gap-1 mb-0.5 hover:shadow-md hover:shadow-black duration-300 hover:translate-x-1 cursor-pointer default:cursor-pointer"
                      >
                        <div className="bg-slate-500 flex justify-center  h-[60px]  w-[50px] items-center text-white">
                          <FaFileCircleCheck className="text-[20px] cursor-pointer " />
                        </div>
                        <div className="w-full h-[50px]  flex flex-col font-thin">
                          <label className=" w-[250px] overflow-hidden truncate ... cursor-pointer">
                            {file.name}
                          </label>
                          <label className="text-[12px] cursor-pointer">
                            {moment(file.created_at).format("LLL")}
                          </label>
                        </div>
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
