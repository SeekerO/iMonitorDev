import React, { useEffect, useState, useRef } from "react";
import supabase from "../iMonitorDBconfig";
import MessagingConfig from "./MessagingConfig";
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
import { IoSend } from "react-icons/io5";
import { Backdrop } from "@mui/material";
import { TailSpin } from "react-loader-spinner";
import { TbMessage2Share } from "react-icons/tb";
import { FaChevronCircleDown } from "react-icons/fa";

import { Radio } from "react-loader-spinner";

// Toastify
import { ToastContainer, toast } from "react-toastify";
import MessageBeneContanct from "./MessageBeneContanct";

import { tailspin } from "ldrs";

tailspin.register();

const Message = ({ beneemail }) => {
  // search name
  const [search, setSearch] = useState("");
  // student information
  const [studinfo, setStudInfo] = useState([]);
  const [studname, setStudName] = useState();
  const [getstudname, setGetStudName] = useState("");
  const [getID, setGetID] = useState();
  const [onlineStatus, setOnlineStatus] = useState();
  // bene information
  const [beneName, setBeneName] = useState([]);
  const [beneinfo, setBeneInfo] = useState([]);
  const [allbeneinfo, setallbeneinfo] = useState([]);
  const [isRole, getRole] = useState();
  // message
  const [message, setMessage] = useState("");
  const [havemessage, setHaveMessage] = useState(true);
  // fetching message
  const [receivedmessages, setReceivedMessages] = useState([]);
  const [allmess, setAllMess] = useState();
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

  const [sendFile, setSendFile] = useState(false);
  const [sendFileX, setSendFileX] = useState(false);

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

  const [getemail, setGetEmail] = useState();
  const [avatarColor, setAvatarColor] = useState();
  const [avatarURL, setAvatarURL] = useState();

  const [messLoad, setMessLoad] = useState(false);

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
  }, []);

  // Runs once
  useEffect(() => {
    DataGetter();
    supabase
      .channel("custom-update-channel")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "StudentInformation" },
        (payload) => {
          DataGetter();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "BeneAccount" },
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
        {
          event: "INSERT",
          schema: "public",
          table: "Messaging",
          filter: `contactwith=eq.${beneName}`,
        },
        (payload) => {
          MessageGetter();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Messaging",
          filter: `name=eq.${beneName}`,
        },
        (payload) => {
          MessageGetter();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Messaging",
          filter: `contactwith=eq.${beneName}`,
        },
        (payload) => {
          MessageGetter();
        }
      )
      .on("presence", { event: "sync", table: "Messaging" }, (newState) => {
        const insert = async () => {
          await supabase
            .from("BeneAccount")
            .update({ onlineStatus: "online" })
            .eq("beneEmail", beneemail)
            .single();
        };

        insert();
      })
      .subscribe();
  }, [getstudname]);

  // useEffect(() => {
  //   messageEndRef.current?.scrollIntoView();
  // }, [receivedmessages]);

  // Data Getter In SupaBase
  var ID = "";
  async function DataGetter() {
    const { data: allBeneInfo } = await supabase.from("BeneAccount").select();

    setallbeneinfo(allBeneInfo);
    const { data: beneinfo } = await supabase
      .from("BeneAccount")
      .select()
      .eq("beneEmail", beneemail)
      .single();
    if (beneinfo) {
      setBeneName(beneinfo.beneName);
      setBeneInfo(beneinfo);
      ID = beneinfo.id;

      if (beneinfo.filterby === "ALL") {
        const { data: studinfo, count } = await supabase
          .from("StudentInformation")
          .select("*", { count: "exact" });

        setStudInfo(studinfo);
        setCount(count);
      } else {
        const { data: studinfo, count } = await supabase
          .from("StudentInformation")
          .select("*", { count: "exact" })
          .match({ studcourse: beneinfo.filterby });

        setStudInfo(studinfo);
        setCount(count);
      }
    }
  }

  // Message Getter In SupaBase
  const MessageGetter = async () => {
    try {
      const { data: bene } = await supabase
        .from("Messaging")
        .select()
        .order("created_at", { ascending: false })
        .limit(10)
        .match({ name: beneName, contactwith: getstudname });
      const { data: stud } = await supabase
        .from("Messaging")
        .select()
        .order("created_at", { ascending: false })
        .limit(10)
        .match({ name: getstudname, contactwith: beneName });
      await setReceivedMessages(bene.concat(stud));

      messageEndRef.current?.scrollIntoView();
      const { data: allbene } = await supabase
        .from("Messaging")
        .select()
        .order("created_at", { ascending: false })
        .match({ name: beneName, contactwith: getstudname });

      const { data: allstud } = await supabase
        .from("Messaging")
        .select()
        .order("created_at", { ascending: false })
        .match({ name: getstudname, contactwith: beneName });

      await setAllMess(allbene.concat(allstud));
    } catch (error) {}
  };

  const fetchAnother = async () => {
    try {
      for (let index = 0; index < allmess.length; index++) {
        if (receivedmessages[index].id !== allmess[index].id) {
          setMessLoad(true);
          const { data: recentMessages } = await supabase
            .from("Messaging")
            .select()
            .order("created_at", { ascending: false })
            .limit(10)
            .match({ name: beneName, contactwith: getstudname });

          const { data: olderMessages } = await supabase
            .from("Messaging")
            .select()
            .order("created_at", { ascending: false })
            .limit(10)
            .lt(
              "created_at",
              recentMessages[recentMessages.length - 1].created_at
            ) // Fetch messages older than the last message in recentMessages
            .match({ name: beneName, contactwith: getstudname });

          const { data: recentMessagesSTUD } = await supabase
            .from("Messaging")
            .select()
            .order("created_at", { ascending: false })
            .limit(10)
            .match({ name: getstudname, contactwith: beneName });

          const { data: olderMessagesSTUD } = await supabase
            .from("Messaging")
            .select()
            .order("created_at", { ascending: false })
            .limit(10)
            .lt(
              "created_at",
              recentMessagesSTUD[recentMessagesSTUD.length - 1].created_at
            ) // Fetch messages older than the last message in recentMessages
            .match({ name: getstudname, contactwith: beneName });

          // Combine the older messages with the recent messages

          const combinedMessagesBENE = recentMessages.concat(olderMessages);
          const combinedMessagesSTUD =
            recentMessagesSTUD.concat(olderMessagesSTUD);

          const combine2user =
            combinedMessagesBENE.concat(combinedMessagesSTUD);
          // Update receivedMessages state with the combined messages
          setReceivedMessages(combine2user);
          setMessLoad(false);
          return;
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
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

  // Allows user to press enter when sending
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handlesendmessage();
    }
  };

  // Sending Message
  async function handlesendmessage() {
    if (message.trim() !== "") {
      const { data, error } = await supabase.from("Messaging").insert([
        {
          name: beneName,
          message: message.trim(),
          contactwith: getstudname,
          userID: beneinfo.id,
        },
      ]);

      var newMessage = {
        name: beneName,
        message: message.trim(),
        contactwith: getstudname,
        userID: beneinfo.id,
        created_at: moment().format(),
      };

      setReceivedMessages(
        receivedmessages.concat(receivedmessages.push(newMessage))
      );

      const { data: modif } = await supabase
        .from("BeneAccount")
        .update({ last_Modif: moment().format() })
        .eq("beneName", beneName);

      setSeen(false);
      setMessage("");
      setHaveMessage(true);
    }
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

    var newMessage = {
      name: beneName,
      message: "👍🏻",
      contactwith: getstudname,
      userID: beneinfo.id,
      created_at: moment().format(),
    };

    setReceivedMessages(
      receivedmessages.concat(receivedmessages.push(newMessage))
    );

    readmess();
   await supabase
      .from("BeneAccount")
      .update({ last_Modif: moment().format() })
      .eq("beneName", beneName);

    setSeen(false);
    setMessage("");
    setHaveMessage(true);
    messageEndRef.current?.scrollIntoView();
  }

  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
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

  const sendingFile = async () => {
    var uuid = Math.ceil(Math.random() * 99999999);
    const { data: file, error: error } = await supabase.storage
      .from("MessageFileUpload")
      .upload(
        getID +
          "_" +
          beneinfo.id +
          "/" +
          beneinfo.id +
          "/" +
          uuid +
          "." +
          filename,
        fileholder
      );

    if (file) {
      const { data: modif } = await supabase
        .from("BeneAccount")
        .update({ last_Modif: moment().format() })
        .eq("beneName", beneName);

      const { data } = await supabase.from("Messaging").insert([
        {
          name: beneName,
          message: uuid + "." + filename,
          contactwith: getstudname,
          userID: beneinfo.id,
        },
      ]);

      setFileHolder();
      setFileName();
      setShowUpload(false);
      setSendFile(false);
      setSendFileX(false);
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
      setSendFile(false);
      setSendFileX(false);
    }
    return;
  };

  async function SendFile() {
    setSendFile(true);
    setSendFileX(true);
    setSeen(false);
    setMessage("");
    setHaveMessage(true);

    if (isRole === "") {
      sendingFile();
      return;
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

  function avatarComponent(name) {
    return (
      <div className="flex items-end">
        <div
          style={{ background: avatarColor }}
          className={`flex text-white items-center justify-center h-[40px]  w-[40px] rounded-full font-thin border-2 border-[#274472] hover:no-underline`}
        >{`${name.toUpperCase().split(" ")[0][0]}`}</div>

        {onlineStatus === "online" ? (
          <div className="bg-green-400 h-[13px] w-[13px] -ml-3 rounded-full border-2 border-[#274472]" />
        ) : (
          <div className="bg-gray-400 h-[13px] w-[13px] -ml-3 rounded-full border-2 border-[#274472]" />
        )}
      </div>
    );
  }
  const myMessageDiv = useRef();
  const [backToScroll, setBackToScroll] = useState(false);

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = myMessageDiv.current;
    if (scrollTop === 0 && scrollHeight >= clientHeight) {
      setBackToScroll(true);
    }
    if (scrollTop === 0 && scrollHeight > clientHeight) {
      fetchAnother();
    } else if (scrollTop === 0 && scrollHeight > clientHeight) {
      fetchAnother();
    } else {
      setBackToScroll(false);
    }
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
        <div className="  h-[87%] w-[100%] md:p-5 p-0 flex md:gap-3 gap-1 rounded-md bg-[#90bbdf] bg-opacity-40 shadow-2xl items-center">
          {/* Contact */}
          <div
            id="contact"
            className={`${
              window.innerWidth <= 768
                ? `  ${
                    showMessage
                      ? "hidden"
                      : "md:w-[250px] w-[100%]  md:flex-col bg-white rounded-l-md"
                  }`
                : ""
            }
            md:w-[250px] w-[100%] h-[100%] md:flex-col bg-white rounded-l-md  shadow-md shadow-black`}
          >
            <div className="font-bold text-[25px] h-[51px] text-center pt-1 text-white rounded-tl-md bg-[#274472] flex items-center justify-center ">
              <IoMdContacts className="text-[25px] text-white mr-0.5  mt-1" />
              Contacts
            </div>
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

            <div className="h-[96%]">
              {studinfo && allbeneinfo ? (
                <>
                  <div className="h-[85%] md:max-h-[80%]  rounded-bl-md overflow-y-auto scroll-smooth">
                    {studinfo.length >= 0 ? (
                      <>
                        {allbeneinfo.length === 1 ? (
                          ""
                        ) : (
                          <>
                            <label className="flex justify-center bg-[#274472] font-semibold text-white p-1">
                              APO & ADVISER
                            </label>
                            {allbeneinfo
                              .sort((a, b) => {
                                const dateA = new Date(a.last_Modif);
                                const dateB = new Date(b.last_Modif);

                                if (dateA.getTime() <= dateB.getTime()) {
                                  return 1; // dates are equal
                                } else {
                                  return -1; // sort by date and time
                                }
                              })
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
                                    val.position
                                      .toLowerCase()
                                      .includes(search.toLowerCase())
                                  ) {
                                    return val;
                                  }
                                } catch (error) {}
                              })
                              .slice(pageVisited, pageVisited + userPerPage)
                              .map((bene, index) => (
                                <MessageBeneContanct
                                  key={bene.id}
                                  studinfo={bene}
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
                                  setGetEmail={setGetEmail}
                                  setAvatarColor={setAvatarColor}
                                  setAvatarURL={setAvatarURL}
                                  setOnlineStatus={setOnlineStatus}
                                  getRole={getRole}
                                  setBackToScroll={setBackToScroll}
                                />
                              ))}
                          </>
                        )}

                        <label className="flex justify-center bg-[#274472] font-semibold text-white p-1">
                          STUDENT
                        </label>
                        {studinfo ? (
                          <>
                            {studinfo.length > 0 ? (
                              <>
                                {studinfo
                                  .sort((a, b) => {
                                    var aDate = new Date(a.last_Modif);
                                    var bDate = new Date(b.last_Modif);
                                    var currDate = new Date();
                                    if (aDate.getTime() <= bDate.getTime()) {
                                      return 1; // dates are equal
                                    } else {
                                      return -1; // sort by date and time
                                    }
                                  })
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
                                      setGetEmail={setGetEmail}
                                      setAvatarColor={setAvatarColor}
                                      setAvatarURL={setAvatarURL}
                                      setOnlineStatus={setOnlineStatus}
                                      getRole={getRole}
                                      setBackToScroll={setBackToScroll}
                                    />
                                  ))}
                              </>
                            ) : (
                              <div className="flex justify-center mt-10 font-semibold">
                                NO DATA
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex justify-center mt-10 font-semibold">
                            <Radio
                              visible={true}
                              height="80"
                              width="80"
                              colors={["  #4f8bec", "#3760a2", "#274472"]}
                              ariaLabel="radio-loading"
                              wrapperStyle={{}}
                              wrapperClass="radio-wrapper"
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className=" h-[77%]   place-content-center flex justify-center items-center">
                        <label className="font-bold text-[20px]">No user</label>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center place-content-center h-[100%]">
                  <TailSpin
                    height="80"
                    width="80"
                    color="#0074B7"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                </div>
              )}
              <div className=" bg-[#274472] w-[100%] bottom-0">
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
          </div>
          {/* Message */}
          <div
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
            {getstudname && receivedmessages ? (
              <>
                <div className=" p-2 flex">
                  {/* Header Design */}

                  {isMobile && (
                    <div onClick={() => openmessage()} className=" pt-1 group">
                      <MdArrowBackIos className="text-[25px] text-white group-hover:text-slate-400 " />
                    </div>
                  )}
                  <>
                    <div
                      onClick={() => closeMessage()}
                      className=" flex items-center pl-[1%] mt-0.5 text-[15px] w-[100%] gap-1
                       font-semibold text-white cursor-pointer  "
                    >
                      {avatarURL ? (
                        <div className="flex items-end">
                          <img
                            src={avatarURL}
                            className="h-[40px] w-[40px] rounded-full border-2 border-[#274472]"
                          />
                          {onlineStatus === "online" ? (
                            <div className="bg-green-400 h-[13px] w-[13px] -ml-3 rounded-full border-2 border-[#274472]" />
                          ) : (
                            <div className="bg-gray-400 h-[13px] w-[13px] -ml-3 rounded-full border-2 border-[#274472]" />
                          )}
                        </div>
                      ) : (
                        avatarComponent(getstudname)
                      )}
                      <label className="hover:text-blue-500 hover:underline capitalize">
                        {getstudname}
                      </label>
                    </div>
                  </>
                </div>

                {/* Message Container Design */}
                {receivedmessages ? (
                  <div
                    ref={myMessageDiv}
                    onScroll={handleScroll}
                    className={`w-[100%] bg-[#bfd7eddc] p-3 overflow-y-auto overflow-x-hidden md:h-[78%] h-[80%]`}
                  >
                    {backToScroll && !messLoad && (
                      <div
                        onClick={() => messageEndRef.current?.scrollIntoView()}
                        className="  justify-center flex "
                      >
                        <FaChevronCircleDown className="mt-2 text-[30px] text-[#274472]" />
                      </div>
                    )}
                    {backToScroll && messLoad && (
                      <div className="flex justify-center items-center gap-1">
                        <l-tailspin
                          size="35"
                          stroke="5"
                          speed="0.9"
                          color="#274472"
                        ></l-tailspin>
                      </div>
                    )}
                    {receivedmessages
                      .sort((a, b) => (a.created_at <= b.created_at ? -1 : 1))
                      .map((message, index) => (
                        <div key={index}>
                          <UserMessagesDisplay
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
                            avatarURL={avatarURL}
                            isRole={isRole}
                            receivedmessages={receivedmessages}
                          />
                        </div>
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
                    {isRole === "" && (
                      <button
                        className="button-upload ml-1 mt-4 hover:bg-slate-300 bg-white p-2 rounded-full h-fit items-center justify-center "
                        onClick={handleClick}
                      >
                        <GrAttachment className="" />
                      </button>
                    )}

                    {showUpload ? (
                      <div className={`absolute -mt-[35px] ml-[2%] `}>
                        <div className="flex w-[100%] gap-2 items-center">
                          <a
                            disabled={sendFileX}
                            onClick={() => removeImage()}
                            className={`${
                              sendFileX
                                ? "hidden"
                                : "rounded-full bg-slate-600 h-[20px] w-[20px] p-4 justify-center flex items-center hover:bg-red-400 cursor-pointer text-white hover:text-black"
                            }`}
                          >
                            X
                          </a>
                          <div className="flex bg-[#5584ab] rounded-md ">
                            <label className="flex items-center pl-2 pr-2 text-white min-w-[100px] max-w-[300px]  truncate overflow-hidden ">
                              {filename}
                            </label>
                            <button
                              onClick={() => SendFile()}
                              className={`${
                                sendFile
                                  ? "bg-gray-500"
                                  : "bg-[#60A3D9] hover:bg-blue-500 hover:shadow-lg"
                              } h-[20px] p-4 flex text-slate-200  hover:text-black  font-semibold justify-center items-center rounded-sm ml-2`}
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
                        onChange={(e) => setMessage(e.target.value)}
                        onClick={() => readmess()}
                        rows="3"
                        className="mt-2 mb-2 ml-1 p-1 w-[100%] h-[50px] text-sm text-gray-900  rounded-md resize-none"
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
                          className=" bg-[#60A3D9] group  h-[50px] w-[55px] rounded-full flex items-center justify-center ml-[10px] mr-[10px] mt-[8px] hover:ring-1 hover:ring-white"
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
          {openfile && isRole === "" ? (
            <div className="h-[100%]">
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
                      {file.map((e, index) => (
                        <div key={index}>
                          {checker(e.name) === false && (
                            <DownloadFIle
                              e={e}
                              userInfo={beneinfo}
                              ID={getID}
                              receivedmessages={receivedmessages}
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
                        .map((e, index) => (
                          <div
                            key={index}
                            className="bg-gray-300  mt-0.5 rounded-md"
                          >
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
