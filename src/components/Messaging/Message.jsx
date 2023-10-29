import React, { useEffect, useState, useRef } from "react";
import profile from "../Messaging/profile.png";
import supabase from "../iMonitorDBconfig";
import MessagingConfig from "./MessagingConfig";
import DateConverter from "./DateConverter";
import moment from "moment";
import UserMessagesDisplay from "./UserMessagesDisplay";
import CircularProgress from "@mui/material/CircularProgress";
import ReactPaginate from "react-paginate";
import Image from "./Image";
import DownloadFIle from "./DownloadFIle";
// React Icons
import { BsFillImageFill } from "react-icons/bs";
import { IoMdContacts, IoMdThumbsUp } from "react-icons/io";
import { MdArrowBackIos } from "react-icons/md";
import { AiFillCheckCircle, AiFillFolderOpen } from "react-icons/ai";
import { GrAttachment } from "react-icons/gr";
import { FadeLoader } from "react-spinners";
import { IoSend } from "react-icons/io5";
import { Backdrop } from "@mui/material";
// Toastify
import { ToastContainer, toast } from "react-toastify";

const Message = ({ beneemail }) => {
  // search name
  const [search, setSearch] = useState("");
  // student information
  const [studinfo, setStudInfo] = useState([]);
  const [studname, setStudName] = useState();
  const [getstudname, setGetStudName] = useState("");
  const [getID, setGetID] = useState();
  // bene information
  const [beneName, setBeneName] = useState([]);
  const [beneinfo, setBeneInfo] = useState([]);
  // message
  const [message, setMessage] = useState("");
  const [havemessage, setHaveMessage] = useState(true);
  // fetching message
  const [receivedmessages, setReceivedMessages] = useState([]);

  //end of the message
  const messageEndRef = useRef(null);

  // Mobile Identifier
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const [showContact, setShowContacts] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // seen shower
  const [seen, setSeen] = useState(false);

  // delivered
  const [delivered, setDelivered] = useState(false);

  // Send File and File holder
  const [fileholder, setFileHolder] = useState();
  const [filename, setFileName] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [count, setCount] = useState(0);

  const [run, SetRun] = useState();

  const [openfile, setOpenFile] = useState(false);

  // Pagination MessageContact
  const [pageNumber, setPageNumber] = useState(0);
  const userPerPage = 20;
  const pageVisited = pageNumber * userPerPage;
  const pageCount = Math.ceil(count / userPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  // File Var
  const [file, setFile] = useState();

  const [showFile, setShowFile] = useState(false);
  const [displayimage, setDisplayImage] = useState([]);
  const [displayfile, setDisplayFile] = useState([]);
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
  const documentExtenstions = ["docx", "pdf", "ods", "pptx", "xlsx"];

  // Resize Depending on the width of the screen
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsDesktop(window.innerWidth >= 768);

      if (window.innerWidth <= 768 && showMessage === true) {
        setShowMessage(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    SetRun(!run);
  }, [receivedmessages]);

  // Runs once
  useEffect(() => {
    DataGetter();
    const StudentInformation = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "StudentInformation" },
        (payload) => {
          DataGetter();
        }
      )
      .subscribe();
  }, []);

  // Listener & Getter in Messaging
  useEffect(() => {
    MessageGetter();
    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Messaging" },
        (payload) => {
          MessageGetter();
        }
      )
      .subscribe();
  }, [getstudname, beneemail]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [receivedmessages]);

  // Data Getter In SupaBase
  async function DataGetter() {
    const { data: studinfo, count } = await supabase
      .from("StudentInformation")
      .select("*", { count: "exact" });

    setStudInfo(studinfo);
    setCount(count);

    const { data: beneinfo } = await supabase
      .from("BeneAccount")
      .select()
      .eq("beneEmail", beneemail)
      .single();
    if (beneinfo) {
      setBeneName(beneinfo.beneName);
      setBeneInfo(beneinfo);
    }
  }

  // Message Getter In SupaBase
  const MessageGetter = async () => {
    try {
      const { data: bene } = await supabase
        .from("Messaging")
        .select()
        .eq("name", beneName);

      const { data: stud } = await supabase
        .from("Messaging")
        .select()
        .eq("name", getstudname);

      await setReceivedMessages(bene.concat(stud));
    } catch (error) {}
  };

  // Message Opener
  function openmessage() {
    setShowMessage(!showMessage);
    if (showContact === false) {
      setShowContacts(true);
    } else {
      setShowContacts(false);
    }
  }

  // Check if textbox is not empty
  function handlemessage(e) {
    if (e.target.value.length >= 0) {
      setMessage(e.target.value);
      setHaveMessage(false);
    }
    if (e.target.value.length <= 1) {
      setHaveMessage(true);
    }
  }

  // Allows user to press enter when sending
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (message.split("\n")[message.split("\n").length - 1].length > 0) {
        handlesendmessage();
      }
    }
  };

  // Sending Message
  async function handlesendmessage() {
    const { data, error } = await supabase.from("Messaging").insert([
      {
        name: beneName,
        message: message,
        contactwith: getstudname,

        userID: beneinfo.id,
      },
    ]);

    const { data: modif } = await supabase
      .from("BeneAccount")
      .update({ last_Modif: moment().format("MMMM Do YYYY, h:mm:ss a") })
      .eq("beneName", beneName);

    setSeen(false);
    setMessage("");
    setHaveMessage(true);
  }

  // Update to all messages to read of this current user
  async function readmess() {
    const { data: stud } = await supabase
      .from("Messaging")
      .update({ readmessage: true })
      .match({ name: getstudname, contactwith: beneName })
      .select();
  }

  // Sending Message LIKE
  async function handlesendmessageLIKE() {
    const { data, error } = await supabase.from("Messaging").insert([
      {
        name: beneName,
        message: "👍🏻",
        contactwith: getstudname,
        userID: beneinfo.id,
      },
    ]);
    readmess();
    const { data: modif } = await supabase
      .from("BeneAccount")
      .update({ last_Modif: moment().format("MMMM Do YYYY, h:mm:ss a") })
      .eq("beneName", beneName);

    setSeen(false);
    setMessage("");
    setHaveMessage(true);
  }

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    setFileHolder(fileUploaded);
    setFileName(fileUploaded.name);
    if (fileUploaded) {
      setShowUpload(true);
    }
  };

  function removeImage() {
    setFileHolder();
    setFileName();
    setShowUpload(false);
  }

  function closeMessage() {
    setOpenFile(!openfile);

    if (window.innerWidth <= 768) {
      if (!openfile) {
        document.getElementById("contact").hidden = true;
        document.getElementById("message").hidden = true;
      } else {
        document.getElementById("contact").hidden = false;
        document.getElementById("message").hidden = false;
      }
    }
  }

  async function SendFile() {
    const { data } = await supabase.from("Messaging").insert([
      {
        name: beneName,
        message: filename,
        contactwith: getstudname,
        userID: beneinfo.id,
      },
    ]);

    const { data: modif } = await supabase
      .from("BeneAccount")
      .update({ last_Modif: moment().format("MMMM Do YYYY, h:mm:ss a") })
      .eq("beneName", beneName);

    setSeen(false);
    setMessage("");
    setHaveMessage(true);

    var uuid = Math.ceil(Math.random() * 99999999);
    const { data: file, error } = await supabase.storage
      .from("MessageFileUpload")
      .upload(
        getID + "_" + beneinfo.id + "/" + beneinfo.id + "/" + filename,
        fileholder
      );

    if (file) {
      setFileHolder();
      setFileName();
      setShowUpload(false);
    }
    if (error) {
      toast.warn("Something went wrong please try again..", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function getFile(id) {
    const { data: bene } = await supabase.storage
      .from("MessageFileUpload")
      .list(`${id + "_" + beneinfo.id}` + "/" + beneinfo.id, {
        limit: 50,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    const { data: stud } = await supabase.storage
      .from("MessageFileUpload")
      .list(`${id + "_" + beneinfo.id}` + "/" + id, {
        limit: 50,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });
    setFile(stud.concat(bene));
  }

  const checker = (e) => {
    if (imageExtensions.includes(e.split(".").pop().toLowerCase())) return true;
    else if (documentExtenstions.includes(e.split(".").pop().toLowerCase()))
      return false;
  };

  return (
    <>
      <div className="w-[100%] h-screen md:pt-[2%] pt-[12%] md:p-5 p-1 flex justify-center   ">
        {studinfo === null ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          ""
        )}
        <div className="  h-[87%] w-[100%] md:p-5 p-0 flex md:gap-3 gap-1 rounded-md bg-[#90bbdf] bg-opacity-40 shadow-2xl">
          {/* Contact */}
          <div
            id="contact"
            className={`${
              window.innerWidth <= 768
                ? `  ${
                    showMessage
                      ? "hidden"
                      : "md:w-[250px] w-[100%] md:h-[100%] h-[90%] md:flex-col bg-white rounded-l-md"
                  }`
                : ""
            }
            md:w-[250px] w-[100%] md:h-[100%] h-[90%] md:flex-col bg-white rounded-l-md  shadow-md shadow-black`}
          >
            <p className="font-bold text-[25px] h-[51px] text-center pt-1 text-white rounded-tl-md bg-[#274472] flex items-center justify-center ">
              <IoMdContacts className="text-[25px] text-white mr-0.5  mt-1" />
              Contacts
            </p>
            <center>
              <div className="bg-slate-300 flex w-[96%] rounded-md place-content-center mt-2 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="h-[13px] w-10 mt-2.5 ml-2"
                >
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  className="w-[100%] bg-slate-300 p-1 border-0 outline-none rounded-md"
                  placeholder="Search Here"
                ></input>
              </div>
            </center>
            {studinfo ? (
              <div className="h-[77%]  rounded-bl-md overflow-y-auto scroll-smooth">
                {studinfo && (
                  <>
                    {studinfo
                      .sort((a, b) => (a.last_Modif > b.created_at ? -1 : 1))
                      .filter((val) => {
                        try {
                          if (search === "") {
                            return val;
                          } else if (
                            val.studname
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          ) {
                            return val;
                          } else if (
                            val.studsection
                              .toLowerCase()
                              .includes(search.toLowerCase())
                          ) {
                            return val;
                          }
                        } catch (error) {}
                      })
                      .slice(pageVisited, pageVisited + userPerPage)
                      .map((studinfo, index) => (
                        <MessagingConfig
                          key={studinfo.id}
                          studinfo={studinfo}
                          setGetStudName={setGetStudName}
                          setShowMessage={setShowMessage}
                          setGetID={setGetID}
                          setSeen={setSeen}
                          message={receivedmessages}
                          beneName={beneName}
                          read={seen}
                          run={run}
                          getFile={getFile}
                          index={index}
                        />
                      ))}
                  </>
                )}
              </div>
            ) : (
              <div className=" mt-[50%] place-content-center flex justify-center">
                <FadeLoader
                  color="#3658d6"
                  className="justify-center text-center"
                />
              </div>
            )}
            <div className=" bg-[#274472] w-[100%]  ">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={`${
                  pageCount > 5
                    ? "flex justify-center flex items-center font-semibold"
                    : "flex justify-center flex items-center font-semibold gap-2"
                }`}
                previousLinkClassName="bg-[#274472] p-1 rounded-md flex items-center text-white"
                nextLinkClassName="bg-[#274472] p-1 rounded-md flex items-center text-white"
                disabledLinkClassName="bg-[#274472] p-1 rounded-md text-white"
                activeLinkClassName="bg-[#274472] p-1 rounded-md text-white "
              />
            </div>
          </div>
          {/* Message */}
          <div
            id="message"
            className={`${
              window.innerWidth <= 768
                ? `${
                    showMessage || openfile
                      ? " w-[100%] md:h-[100%] h-[90%] bg-[#274472] "
                      : "hidden"
                  }`
                : "w-[100%] md:h-[100%] h-[90%] bg-[#274472]   shadow-md shadow-black"
            }`}
          >
            {getstudname && (
              <>
                <div className=" p-2 flex">
                  {/* Header Design */}

                  {isMobile && (
                    <div onClick={() => openmessage()} className=" pt-1 group">
                      <MdArrowBackIos className="text-[25px] text-white group-hover:text-slate-400 " />
                    </div>
                  )}
                  <img
                    className="md:h-10 md:w-10 h-8 w-8 rounded-full"
                    src={profile}
                  />
                  <p
                    onClick={() => closeMessage()}
                    className=" flex items-center p-1 pl-[1%] mt-0.5 text-[15px] w-[100%] font-semibold text-white cursor-pointer hover:underline hover:text-blue-500"
                  >
                    {getstudname}
                  </p>
                </div>
                {/* Message Container Design */}
                {receivedmessages ? (
                  <div
                    className={`w-[100%] bg-[#bfd7eddc] p-3 overflow-y-auto md:h-[78%] h-[80%]`}
                  >
                    {receivedmessages
                      .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
                      .map((message) => (
                        <UserMessagesDisplay
                          key={message.id}
                          message={message}
                          getstudname={getstudname}
                          beneName={beneName}
                          beneinfo={beneinfo}
                          file={file}
                          studID={getID}
                          setDisplayImage={setDisplayImage}
                          displayimage={displayimage}
                          setDisplayFile={setDisplayFile}
                          displayfile={displayfile}
                        />
                      ))}
                    <div ref={messageEndRef} />
                    {delivered && (
                      <div className="text-[10px] text-blue-700 flex justify-end">
                        Delivered
                        <AiFillCheckCircle className="mt-0.5 ml-0.5" />
                      </div>
                    )}
                    {seen && (
                      <div className=" flex justify-end text-[10px]">
                        Seen by {getstudname}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>No Messages Found</div>
                )}

                <div className="flex flex-col w-[100%] h-[50%] ">
                  <input
                    accept="e.g:.jpg,.jpeg,.png,.gif,.bmp,.docx,.pdf,.ods,.pptx,.xlsx"
                    type="file"
                    onChange={handleChange}
                    ref={hiddenFileInput}
                    style={{ display: "none" }} // Make the file input element invisible
                  />
                  <div className="flex w-[100%] h-[100%] ">
                    <button
                      className="button-upload ml-1 mt-4 hover:bg-slate-300 bg-white p-2 rounded-full h-fit items-center justify-center "
                      onClick={handleClick}
                    >
                      <GrAttachment className="" />
                    </button>
                    {showUpload ? (
                      <div className={`absolute -mt-[35px] ml-[2%] `}>
                        <div className="flex w-[100%] gap-2">
                          <a
                            onClick={() => removeImage()}
                            className="rounded-full bg-slate-600 h-[20px] w-[20px] p-4 justify-center flex items-center hover:bg-red-400 cursor-pointer text-white hover:text-black"
                          >
                            X
                          </a>
                          <label className="flex items-center">
                            {" "}
                            {filename}
                          </label>
                          <button
                            onClick={() => SendFile()}
                            className="bg-[#60A3D9] h-[20px] p-4 flex text-slate-200 hover:bg-blue-500 hover:text-black hover:shadow-lg font-semibold justify-center items-center rounded-sm"
                          >
                            SEND
                          </button>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    <div
                      className={`visible w-full h-auto justify-center flex`}
                    >
                      <textarea
                        onKeyDown={handleKeyDown}
                        value={message}
                        onChange={handlemessage}
                        onClick={() => readmess()}
                        rows="3"
                        className="mt-2 ml-1 p-1 w-[100%]  h-[20%] text-sm text-gray-900  rounded-md resize-none"
                        placeholder="Write Remaks Here.."
                      />
                      {message === "" ? (
                        <button
                          onClick={() => handlesendmessageLIKE()}
                          className={`bg-[#60A3D9] group h-[50px] w-[55px] rounded-full flex items-center justify-center ml-[10px] mr-[10px] mt-[8px]  `}
                        >
                          <IoMdThumbsUp
                            className={` text-[#274472] group-hover:text-white md:text-[30px] text-[25px]`}
                          />
                        </button>
                      ) : (
                        <button
                          onClick={() => handlesendmessage()}
                          disabled={havemessage}
                          className={`${
                            havemessage
                              ? " bg-[#60A3D9] group  h-[50px] w-[55px] rounded-full flex items-center justify-center ml-[10px] mr-[10px] mt-[8px] hover:ring-1 hover:ring-white"
                              : "bg-[#60A3D9] group  h-[50px] w-[55px] rounded-full flex items-center justify-center ml-[10px] mr-[10px] mt-[8px] hover:ring-1 hover:ring-white"
                          }`}
                        >
                          <IoSend
                            className={`${
                              havemessage
                                ? " text-[#274472] md:text-[30px] text-[20px]"
                                : " text-[#274472] group-hover:text-white md:text-[30px] text-[20px]"
                            }  `}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* File Uploaded */}
          {openfile ? (
            <div className="">
              <div
                className={`${
                  window.innerWidth <= 768
                    ? `${
                        openfile
                          ? " w-screen  bg-slate-200 h-[100%] overflow-auto shadow-md shadow-black rounded-r-md "
                          : "hidden "
                      }`
                    : "  w-[250px] bg-slate-200 h-[100%] overflow-auto shadow-md shadow-black rounded-r-md "
                }  `}
              >
                <div className="bg-[#274472] p-3 flex text-[15px] gap-1 text-white font-bold rounded-tr-md">
                  {isMobile && (
                    <div onClick={() => closeMessage()} className=" pt-1 group">
                      <MdArrowBackIos className="text-[25px] text-white group-hover:text-slate-400 " />
                    </div>
                  )}
                  <div className="grid grid-cols-2 w-[100%] ">
                    <a
                      onClick={() => setShowFile(!showFile)}
                      className={`${
                        showFile ? "" : "bg-slate-200 text-slate-700"
                      } hover:text-blue-400 flex items-center gap-1 cursor-pointer rounded-md p-1 justify-center`}
                    >
                      <BsFillImageFill className="text-[20px]" />
                      IMAGE
                    </a>
                    <a
                      onClick={() => setShowFile(!showFile)}
                      className={`${
                        showFile ? "bg-slate-200 text-slate-700" : ""
                      } hover:text-blue-400 flex items-center gap-1 cursor-pointer rounded-md p-1 justify-center`}
                    >
                      <AiFillFolderOpen className="text-[20px]" />
                      FILE
                    </a>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-1 mt-2 text-[10px] font-semibold">
                  <p>File Uploaded By: </p>
                  {getstudname}
                </div>

                {showFile ? (
                  <div className="">
                    <div className="md:w-[100%] p-2">
                      {file.map((e) => (
                        <div>
                          {checker(e.name) === false && (
                            <DownloadFIle e={e} userInfo={beneinfo} ID={getID} receivedmessages={receivedmessages} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <div className="w-[100%] p-1">
                      {file
                        .sort((a, b) => (a.created_at <= b.created_at ? 1 : -1))
                        .map((e) => (
                          <div className="bg-gray-300 mt-0.5 rounded-md">
                            {checker(e.name) === true && (
                              <Image
                                e={e}
                                key={e.id}
                                userInfo={beneinfo}
                                ID={getID}
                                name={getstudname}
                                receivedmessages={receivedmessages}
                              />
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </>
  );
};

export default Message;
