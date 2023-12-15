import React, { useEffect, useState, useRef } from "react";
import supabase from "../iMonitorDBconfig";
import UploadStudentConfig from "./UploadStudentConfig";
import StudentUploadedFileConfig from "./StudentUploadedFileConfig";
import AOS from "aos";
import "aos/dist/aos.css";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { MdRemoveRedEye } from "react-icons/md";
import SeenAnnouncement from "./SeenAnnouncement";
import { Tooltip as ReactTooltip } from "react-tooltip";

function UploadLog() {
  const [studsubmitinfo, setStudSubmitInfo] = useState([]);
  const [announceinfo, setAnnounceInfo] = useState([]);

  const [getId, setGetId] = useState("");
  const [getTitle, setGetTitle] = useState("");
  const [getMessage, setGetMessage] = useState("");
  const [getDate, setGetDate] = useState("");
  const [getPostedBy, setGetPostedBy] = useState("");
  const [getAllow, setGetAllow] = useState("");
  const [getFiles, setGetFiles] = useState([]);
  const [getFileName, setGetFileName] = useState();
  const [counter, setCounter] = useState();
  const [getFileSubmit, setGetFileSubmit] = useState([]);
  const [getreadsBy, setGetReadsBy] = useState();

  const [seen, setSeen] = useState(false);

  //design
  const [open, setOpen] = useState(false);

  // AOS ANIMATION
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    handleGetsubmitedAnnouncement();
    setOpen(true);
    const channels = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "AnnouncementTable" },
        () => {
          handleGetsubmitedAnnouncement();
        }
      )
      .subscribe();
  }, []);

  const handleGetsubmitedAnnouncement = async () => {
    const { data, error } = await supabase.from("AnnouncementTable").select();
    if (data) {
      setAnnounceInfo(data);
    }
    if (error) console.log(error);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
      setIsDesktop(window.innerWidth >= 768);

      if (window.innerWidth <= 768) {
        setOpen(false);
      }
      if (window.innerWidth >= 768) {
        setOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  function openannouncement() {
    if (window.innerWidth <= 768) {
      setOpen(!open);
    }
  }

  const SeenRef = useRef(null);

  const handleClickOutsideSeen = (event) => {
    if (SeenRef.current && !SeenRef.current.contains(event.target)) {
      setSeen(false);
    }
  };

  const divRef = useRef(null);

  const handleClickOutside = (event) => {
    if (window.innerWidth <= 768) {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutsideSeen);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutsideSeen);
    };
  }, []);

  const removeUUIDtitle = (title) => {
    var text = title.split(".")[1];
    return text;
  };

  const [search, setSearch] = useState("");
  return (
    <div
      className={`flex gap-1 md:pl-5 pl-1 bg-black bg-opacity-20  h-screen md:pt-0 pt-10`}
    >
      <div
        ref={divRef}
        onClick={() => openannouncement()}
        className={`${
          open
            ? " bg-[#c8d7e5] md:h-[85%] h-[75%] items-center rounded-l-md mt-5   "
            : "w-[50px] bg-[#c8d7e5] md:h-[85%] h-[75%] rounded-l-md mt-5 md:ml-0 ml-2"
        } shadow-black shadow-md`}
      >
        <div
          onClick={() => setOpen(!open)}
          className={`${
            open
              ? " text-[25px] justify-center flex group"
              : "flex pl-[20px] z-10 text-[19px] text-blue-500"
          }   font-bold pt-3 pb-3 rounded-tl-md duration-100`}
        >
          {open ? (
            <div className=" pr-2 pl-2 ">Announcement</div>
          ) : (
            <div className="  text-center font-mono -ml-1 mt-10">
              <div>A</div>
              <div>N</div>
              <div>N</div>
              <div>O</div>
              <div>U</div>
              <div>N</div>
              <div>C</div>
              <div>E</div>
              <div>M</div>
              <div>E</div>
              <div>N</div>
              <div>T</div>
            </div>
          )}
        </div>
        <div className="h-screen">
          {announceinfo.length !== 0 ? (
            <div
              className={`${
                open ? "" : "hidden"
              }  duration-500  overflow-y-auto overflow-x-hidden md:h-[70%] h-[55%] w-auto p-2`}
            >
              <div className="mt-1 flex justify-center">
                <input
                  type="search"
                  placeholder="Search"
                  className="pl-2 rounded-md  w-[230px] "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                ></input>
              </div>
              {announceinfo
                .sort((a, b) => (a.announcementEndDate < b.announcementEndDate ? 1 : -1))
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
                  <UploadStudentConfig
                    key={announcementinfo.id}
                    announceinfo={announcementinfo}
                    setGetId={setGetId}
                    setGetTitle={setGetTitle}
                    setGetMessage={setGetMessage}
                    setGetDate={setGetDate}
                    setGetPostedBy={setGetPostedBy}
                    setGetFiles={setGetFiles}
                    setGetFileName={setGetFileName}
                    setGetFileSubmit={setGetFileSubmit}
                    setCounter={setCounter}
                    setGetReadsBy={setGetReadsBy}
                  />
                ))}
            </div>
          ) : (
            <div
              className={`${
                !open && "hidden"
              } text-center mt-[70%] font-semibold md:text-[25px] text-[15px]`}
            >
              No Announcement
            </div>
          )}
          {/* {open && (
            <center>
              <MdOutlineArrowBackIos className="-rotate-90 text-[25px] mt-2 text-slate-400" />
            </center>
          )} */}
        </div>
      </div>

      <div className="flex flex-col w-[100%] duration-500">
        <div className="flex-col mt-5   bg-[#c8d7e5] md:h-[38%] h-[28%] p-3 rounded-tr-md overflow-y-auto w-[98%] shadow-black shadow-md">
          <div className="">
            {getId ? (
              <div className=" overflow-y-auto  p-5">
                <div className="font-bold text-[25px] md:flex grid items-center">
                  <div className="relative ">
                    <MdRemoveRedEye
                      onClick={() => setSeen(true)}
                      className="hover:text-blue-500 text-[20px] cursor-pointer"
                    />
                    <div
                      ref={SeenRef}
                      className="bg-[#5885afe2] max-h-[100px] min-w-[200px] w-auto text-sm absolute text-slate-100 overflow-x-auto  rounded-md"
                    >
                      <SeenAnnouncement seen={seen} getreadsBy={getreadsBy} />
                    </div>
                  </div>
                  Announcement Title: {removeUUIDtitle(getTitle)}
                </div>
                <div className="font-semibold grid text-[12px] mb-10">
                  <label>Posted By: {getPostedBy}</label>
                  <label>Posted: {getDate}</label>
                </div>
                <div className="mb-2 font-semibold"> Announcement Message:</div>
                <div className="text-justify">{getMessage}</div>
                {getFiles && (
                  <div className="flex gap-2 mt-4">
                    <h3>Download Link:</h3>
                    <a
                      href={getFiles.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {getFileName}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center  font-bold text-[25px] mt-[10%]">
                Announcement Information will display here
              </div>
            )}
          </div>

          {getId && <div className="flex gap-1 items-center"></div>}
        </div>

        <div className="bg-[#c8d7e5] h-[46.5%]  overflow-y-auto w-[98%] mt-1 rounded-br-md shadow-black shadow-md">
          <div className="bg-[#5885AF] text-center p-2 font-semibold text-[20px]">
            Student Submissions
          </div>
          {getId ? (
            <div className="p-2 h-[100%]">
              <div className="flex ">Student Submitted: {counter} </div>
              {getFileSubmit && getFileSubmit.length > 0 ? (
                <>
                  {getFileSubmit.map((folder, index) => (
                    <StudentUploadedFileConfig
                      key={index}
                      studname={folder}
                      announcementTitle={getTitle}
                    />
                  ))}
                </>
              ) : (
                <div className=" flex items-center justify-center place-content-center text-[20px] mt-[10%] font-semibold">
                  No Submissions
                </div>
              )}
            </div>
          ) : (
            <div className="text-center  font-semibold text-[20px] mt-[10%]">
              Student submission will display here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadLog;
