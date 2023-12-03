import React, { useEffect, useState, useRef } from "react";
import profile from "../images/profile.png";
import supabase from "../iMonitorDBconfig";
import MessagingConfigStudent from "./MessagingConfigStudent";
import DateConverter from "../StudentPages/DateConverter";
import MessagingConfig from "./MessagingConfigStudent";
import UserMessagesDisplay from "../Messaging/UserMessagesDisplay";
import moment from "moment";
import ImageStud from "./ImageStud";
import DownloadFileSTUD from "./DownloadFileSTUD";
// Icons
import { MdArrowBackIos } from "react-icons/md";
import { BsFillImageFill } from "react-icons/bs";
import { IoMdContacts, IoMdThumbsUp } from "react-icons/io";
import { AiFillCheckCircle, AiFillFolderOpen } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { GrAttachment } from "react-icons/gr";
import { TbMessage2Share } from "react-icons/tb";
import { TailSpin } from "react-loader-spinner";
// Toast
import { ToastContainer, toast } from "react-toastify";

const MessageStudent = ({ studemail }) => {
  // search name
  const [search, setSearch] = useState("");
  // bene information
  const [beneinfo, setBeneInfo] = useState([]);
  const [getbeneName, setGetBeneName] = useState("");
  const [getID, setGetID] = useState();
  const [onlineStatus, setOnlineStatus] = useState();
  // stud information
  const [studName, setStudName] = useState([]);
  const [studinfo, setStudinfo] = useState([]);

  // message
  const [message, setMessage] = useState("");
  const [havemessage, setHaveMessage] = useState(true);
  // fetching messagers
  const [receivedmessages, setReceivedMessages] = useState();
  //end of the message
  const messageEndRef = useRef(null);

  // Mobile Identifier
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  const [showContact, setShowContacts] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  // seen shower
  const [seen, setSeen] = useState(false);

  //delivered
  const [delivered, setDelivered] = useState(false);

  // set readmessage
  const [read, setRead] = useState(false);

  // Send File and File holder
  const [fileholder, setFileHolder] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [filename, setFileName] = useState("");

  const [openfile, setOpenFile] = useState(false);

  // File Var
  const [file, setFile] = useState();

  const [sendFile, setSendFile] = useState(false);
  const [sendFileX, setSendFileX] = useState(true);
  const [showFile, setShowFile] = useState(false);

  const [getemail, setGetEmail] = useState();
  const [avatarColor, setAvatarColor] = useState();
  const [avatarURL, setAvatarURL] = useState();

  // Resize
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
  }, [receivedmessages]);

  // Runs once
  useEffect(() => {
    DataGetter();

    const BeneAccount = supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "BeneAccount" },
        (payload) => {
          DataGetter();
        }
      )
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
    const Messaging = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Messaging",
          filter: `contactwith=eq.${studName}`,
        },
        (payload) => {
          MessageGetter();
        }
      )
      .on("presence", { event: "sync", table: "Messaging" }, (newState) => {
        const insert = async () => {
          await supabase
            .from("StudentInformation")
            .update({ onlineStatus: "online" })
            .eq("studemail", studemail)
            .single();
        };

        insert();
      })
      .subscribe();
  }, [getbeneName]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView();
  }, [receivedmessages]);

  // Data Getter In SupaBase
  async function DataGetter() {
    const { data: studInfo } = await supabase
      .from("StudentInformation")
      .select()
      .eq("studemail", studemail)
      .single();

    if (studInfo) {
      setStudName(studInfo.studname);
      setStudinfo(studInfo);

      const { data: beneInfo } = await supabase
        .from("BeneAccount")
        .select()
        .match({ filterby: studInfo.studcourse });

      const { data: beneInfoALL } = await supabase
        .from("BeneAccount")
        .select()
        .match({ filterby: "ALL" });

      if (beneInfo) setBeneInfo(beneInfo.concat(beneInfoALL));
    }
  }

  // Message Getter In SupaBase
  const MessageGetter = async () => {
    try {
      const { data: bene } = await supabase
        .from("Messaging")
        .select()
        .eq("name", studName);

      const { data: stud } = await supabase
        .from("Messaging")
        .select()
        .eq("name", getbeneName);

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
        name: studName,
        message: message,
        contactwith: getbeneName,
        readmessage: false,
        userID: studinfo.id,
      },
    ]);

    var newMessage = {
      name: studName,
      message: message.trim(),
      contactwith: getbeneName,
      userID: studinfo.id,
      created_at: moment().format(),
    };

    setReceivedMessages(
      receivedmessages.concat(receivedmessages.push(newMessage))
    );

    const { data: modif } = await supabase
      .from("StudentInformation")
      .update({ last_Modif: moment().format() })
      .eq("studname", studName);

    setSeen(false);
    setMessage("");
    setHaveMessage(true);
  }

  // Sending Message LIKE
  async function handlesendmessageLIKE() {
    const { data, error } = await supabase.from("Messaging").insert([
      {
        name: studName,
        message: "👍🏻",
        contactwith: getbeneName,
        readmessage: false,
        userID: studinfo.id,
      },
    ]);

    var newMessage = {
      name: studName,
      message: "👍🏻",
      contactwith: getbeneName,
      userID: studinfo.id,
      created_at: moment().format(),
    };

    setReceivedMessages(
      receivedmessages.concat(receivedmessages.push(newMessage))
    );

    const { data: modif } = await supabase
      .from("StudentInformation")
      .update({ last_Modif: moment().format() })
      .eq("studname", studName);

    setSeen(false);
    setMessage("");
    setHaveMessage(true);
  }

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  function removeImage() {
    setFileHolder();
    setShowUpload(false);
  }

  async function readmess() {
    const { data: stud } = await supabase
      .from("Messaging")
      .update({ readmessage: true })
      .match({ name: getbeneName, contactwith: studName })
      .select();
  }

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];

    if (fileUploaded !== undefined) {
      setFileHolder(fileUploaded);
      setFileName(fileUploaded.name);
      if (fileUploaded) {
        setShowUpload(true);
      }
    }
  };

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
    setSendFile(true);
    setSendFileX(true);
    setSeen(false);
    setMessage("");
    setHaveMessage(true);

    var uuid = Math.ceil(Math.random() * 99999999);
    const { data: file, error } = await supabase.storage
      .from("MessageFileUpload")
      .upload(
        studinfo.id +
          "_" +
          getID +
          "/" +
          studinfo.id +
          "/" +
          uuid +
          "." +
          filename,
        fileholder
      );

    if (file) {
      const { data } = await supabase.from("Messaging").insert([
        {
          name: studName,
          message: uuid + "." + filename,
          contactwith: getbeneName,
          userID: studinfo.id,
        },
      ]);

      const { data: modif } = await supabase
        .from("StudentInformation")
        .update({ last_Modif: moment().format() })
        .eq("studname", studName);

      setSendFile(false);
      setSendFileX(false);
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
      .list(`${studinfo.id + "_" + id}` + "/" + studinfo.id, {
        limit: 50,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    const { data: stud } = await supabase.storage
      .from("MessageFileUpload")
      .list(`${studinfo.id + "_" + id}` + "/" + id, {
        limit: 50,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    setFile(stud.concat(bene));
  }
  const [displayimage, setDisplayImage] = useState([]);
  const [displayfile, setDisplayFile] = useState([]);
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
  const documentExtenstions = ["docx", "pdf", "ods", "pptx", "xlsx"];

  const checker = (e) => {
    if (imageExtensions.includes(e.split(".").pop().toLowerCase())) return true;
    else if (documentExtenstions.includes(e.split(".").pop().toLowerCase()))
      return false;
  };

  function avatarComponent(name) {
    return (
      <div className="flex items-end">
        <div
          style={{ background: avatarColor }}
          className={`flex text-white items-center justify-center h-[40px]  w-[40px] rounded-full font-thin  border-2 border-[#274472]`}
        >{`${name.split(" ")[0][0]}`}</div>

        {onlineStatus === "online" ? (
          <div className="bg-green-400 h-[13px] w-[13px] -ml-3 rounded-full border-2 border-[#274472]" />
        ) : (
          <div className="bg-gray-400 h-[13px] w-[13px] -ml-3 rounded-full border-2 border-[#274472]" />
        )}
      </div>
    );
  }



  return (
    <>
      <div className="w-[100%] h-screen md:pt-[2%] pt-[12%] p-10 flex justify-center ">
        <div className="  h-[87%] w-[100%] md:p-5 p-0 flex md:gap-3 gap-1 rounded-md  bg-[#90bbdf] bg-opacity-20">
          <div
            id="contact"
            className={`${
              window.innerWidth <= 768
                ? `  ${
                    showMessage
                      ? "hidden"
                      : "md:w-[250px] w-[100%] md:h-[100%] h-[90%] md:flex-col bg-slate-100 rounded-l-md shadow-md shadow-black"
                  }`
                : "md:w-[250px] w-[100%] md:h-[100%] h-[90%] md:flex-col bg-slate-100 rounded-l-md shadow-md shadow-black"
            }`}
          >
            <p className="font-bold text-[25px] h-[51px] text-center pt-1 text-white rounded-tl-md bg-[#274472] flex items-center justify-center ">
              <IoMdContacts className="text-[25px] text-white mr-0.5  mt-1" />
              Contacts
            </p>
            <center>
              <div className="bg-slate-300 flex w-[96%] rounded-md place-content-center mt-2 mb-2 ">
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

            {beneinfo && (
              <div className="h-[80%] rounded-bl-md overflow-y-auto scroll-smooth">
                {beneinfo
                  .filter((val) => {
                    try {
                      if (search === "") {
                        return val;
                      } else if (
                        val.beneName
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      ) {
                        return val;
                      } else if (
                        val.beneEmail
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      ) {
                        return val;
                      }
                    } catch (error) {}
                  })
                  .sort((a, b) => {
                    const dateA = new Date(a.last_Modif);
                    const dateB = new Date(b.last_Modif);

                    if (dateA.getTime() <= dateB.getTime()) {
                      return 1; // dates are equal
                    } else {
                      return -1; // sort by date and time
                    }
                  })
                  .map((beneinfo) => (
                    <MessagingConfig
                      key={beneinfo.id}
                      beneinfo={beneinfo}
                      setGetBeneName={setGetBeneName}
                      setShowMessage={setShowMessage}
                      setShowContacts={setShowContacts}
                      message={receivedmessages}
                      studName={studName}
                      read={read}
                      setGetID={setGetID}
                      getFile={getFile}
                      setAvatarColor={setAvatarColor}
                      setAvatarURL={setAvatarURL}
                      setOnlineStatus={setOnlineStatus}
                    />
                  ))}
              </div>
            )}
          </div>
          <div
            id="message"
            className={` ${
              window.innerWidth <= 768
                ? `  ${
                    showMessage || openfile
                      ? "w-[100%] md:h-[100%] h-[90%] bg-[#274472] rounded-r-md shadow-md shadow-black"
                      : "hidden"
                  }`
                : "w-[100%] md:h-[100%] h-[90%] bg-[#274472] rounded-r-md shadow-md shadow-black"
            }`}
          >
            {getbeneName ? (
              <>
                <div className=" p-2 flex">
                  {/* Header Design */}

                  {isMobile && (
                    <div onClick={() => openmessage()} className=" pt-1 group">
                      <MdArrowBackIos className="text-[25px] text-white group-hover:text-slate-400 " />
                    </div>
                  )}
                  {avatarURL ? (
                    <div className="flex">
                      <img
                        src={avatarURL}
                        className="h-[40px] w-[40px] rounded-full border-2 border-[#274472]"
                      ></img>
                      {onlineStatus === "online" ? (
                        <div className="bg-green-400 h-[13px] w-[13px] -ml-3 rounded-full  border-2 border-[#274472]" />
                      ) : (
                        <div className="bg-gray-400 h-[13px] w-[13px] -ml-3 rounded-full  border-2 border-[#274472]" />
                      )}
                    </div>
                  ) : (
                    avatarComponent(getbeneName)
                  )}
                  <p
                    onClick={() => closeMessage()}
                    className=" flex items-center p-1 pl-[1%] mt-0.5 text-[15px] w-[100%] font-semibold text-white cursor-pointer hover:underline hover:text-blue-500"
                  >
                    {getbeneName}
                  </p>
                </div>
                {/* Message Container Design */}
                {receivedmessages ? (
                  <div
                    className={` md:h-[76%] h-[80%] w-[100%] bg-[#bfd7eddc]  p-3 overflow-y-auto`}
                  >
                    {receivedmessages
                      .sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
                      .map((message) => (
                        <UserMessagesDisplay
                          key={message.id}
                          message={message}
                          getstudname={getbeneName}
                          beneName={studName}
                          beneinfo={studinfo}
                          studID={getID}
                          file={file}
                          displayfile={displayfile}
                          avatarURL={avatarURL}
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
                        Seen by {getbeneName}
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
                            disabled={sendFileX}
                            onClick={() => removeImage()}
                            className={`${
                              !sendFileX
                                ? "hidden"
                                : "rounded-full bg-slate-600 h-[20px] w-[20px] p-4 justify-center flex items-center hover:bg-red-400 cursor-pointer text-white hover:text-black"
                            }`}
                          >
                            X
                          </a>
                          <div className="flex bg-[#5584ab] rounded-md">
                            <label className="flex items-center pl-2 pr-2 text-white ">
                              {filename}
                            </label>
                            <button
                              onClick={() => SendFile()}
                              className={`${
                                sendFile
                                  ? "bg-gray-500"
                                  : "bg-[#60A3D9] hover:bg-blue-500 hover:shadow-lg"
                              } h-[20px] p-4 flex text-slate-200  hover:text-black  font-semibold justify-center items-center rounded-sm`}
                            >
                              {sendFile ? (
                                <div className="flex gap-1 text-white">
                                  Sending
                                  <TailSpin
                                    height="25"
                                    width="25"
                                    color="#ffffff"
                                    ariaLabel="tail-spin-loading"
                                    radius="0"
                                    wrapperStyle={{}}
                                    visible={true}
                                  />
                                </div>
                              ) : (
                                "SEND"
                              )}
                            </button>
                          </div>
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
                        className="mt-2 mb-2 ml-1 p-1 w-[100%]  h-[50px] text-sm text-gray-900  rounded-md resize-none"
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
            ) : (
              <div className="flex flex-col place-content-center items-center justify-center h-[100%] text-white">
                <TbMessage2Share className="text-[200px]" />
                <label className="text-[30px] font-bold">
                  No chats selected
                </label>
              </div>
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
                  {getbeneName}
                </div>

                {showFile ? (
                  <div className="">
                    <div className="md:w-[100%] p-2">
                      {file.map((e) => (
                        <div>
                          {checker(e.name) === false && (
                            <DownloadFileSTUD
                              e={e}
                              ID={getID}
                              userInfo={studinfo}
                            />
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
                          <div className="mt-0.5 rounded-md bg-gray-300">
                            {checker(e.name) === true && (
                              <ImageStud
                                e={e}
                                key={e.id}
                                userInfo={studinfo}
                                ID={getID}
                                name={getbeneName}
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

export default MessageStudent;
