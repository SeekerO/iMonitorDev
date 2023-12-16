import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import supabase from "./iMonitorDBconfig";
import AOS from "aos";
import "aos/dist/aos.css";
import { IoMdNotifications } from "react-icons/io";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import moment from "moment";

function Navbar({ email }) {
  const [open, setOpen] = useState(true);
  const [notif, setNotif] = useState(false);
  const [message, setMessage] = useState();
  const [announcement_NOTIF, setAnnouncement_NOTIF] = useState();
  const [messagesNumber, setMessNumber] = useState(0);
  // AOS ANIMATION
  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    checkmessage();
    fetchAnnouncemnt_INFO();
    supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Messaging",
        },
        (payload) => {
          checkmessage();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "AnnouncementTable",
        },
        (payload) => {
          fetchAnnouncemnt_INFO();
        }
      )
      .subscribe();
  }, []);

  const [counter, setCounter] = useState(0);

  async function fetchAnnouncemnt_INFO() {
    const { data: announce, count } = await supabase
      .from("AnnouncementTable")
      .select("*", { count: "exact" });

    var user_email = email;
    let number_notif = 0;

    const select = (itemsRead) => {
      setCounter(count - itemsRead);

      if (itemsRead !== count) {
        setAnnouncement_NOTIF(true);
      }
      if (itemsRead === count) {
        setAnnouncement_NOTIF(false);
      }
    };

    for (let index = 0; index < announce.length; index++) {
      var per_announce = [announce[index]];
      for (let index1 = 0; index1 < per_announce.length; index1++) {
        var reads_by = per_announce[index1].readsBy;
        for (let index2 = 0; index2 < reads_by.length; index2++) {
          if (reads_by[index2] === user_email) {
            number_notif++;
          }
          select(number_notif);
        }
      }
    }
  }

  async function checkmessage() {
    const { data: studdata } = await supabase
      .from("StudentInformation")
      .select()
      .eq("studemail", email)
      .single();

    const { data: studMess, count } = await supabase
      .from("Messaging")
      .select("*", { count: "exact" })
      .match({ contactwith: studdata.studname, readmessage: "FALSE" });

    setMessNumber(count);
    for (let index = 0; index < studMess.length; index++) {
      if (studMess[index].readmessage === false) {
        setNotif(true);
      } else {
        setNotif(false);
      }
    }
    setMessage(studMess);
  }

  const divRef = useRef(null);

  const toggleDiv = () => {
    setOpen(!open);
  };

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setOpen(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    recordLogin();
  }, [email]);

  async function recordLogin() {
    var date = moment(new Date()).format("LLL");

    const { data: actlog } = await supabase
      .from("StudentInformation")
      .select()
      .eq("studemail", email)
      .single();

    if (actlog) {
      const { data: insertactlog } = await supabase
        .from("ActivityLog")
        .insert([{ name: actlog.studname, button: "Logged In", time: date }]);
    }
  }

  function handleAnnouncementButtonClicked() {
    setOpen(!open);
  }

  return (
    <div className="flex flex-col relative z-99 ">
      {/* SIDE BAR */}
      <div
        ref={divRef}
        className={`${
          open
            ? "transition-transform -translate-x-full duration-300"
            : "transition-transform translate-x-0 duration-500"
        } absolute flex w-52 h-screen  bg-[#5885AF] transition-transform  -translate-x-full md:translate-x-0`}
      >
        <div
          className="pl-[208px] pt-[10px] absolute flex"
          onClick={() => toggleDiv()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`${
              open ? "rotate-0 duration-300" : " rotate-180 duration-300"
            } w-7 h-7 text-white  hover:text-[#60A3D9] hover:cursor-pointer md:hidden visible`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
            />
          </svg>
          {notif || announcement_NOTIF ? (
            <div className="h-4 w-4  rounded-full bg-red-500 md:hidden visible" />
          ) : (
            ""
          )}
        </div>
        <aside className={"relative"}>
          <div className="px-3 py-4 ">
            {/*Attendance*/}
            <Link
              to="/"
              onClick={() => setOpen(!open)}
              className={
                "flex items-center p-2 rounded-lg text-white hover:bg-[#274472] transform hover:translate-x-2 hover:shadow-md"
              }
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 576 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
              </svg>
              <span className="ml-3">Attendance</span>
            </Link>

            {/*Announcement*/}
            <Link
              to="/Announcement"
              onClick={() => handleAnnouncementButtonClicked()}
              className="flex items-center p-2 rounded-lg text-white hover:bg-[#274472] transform hover:translate-x-2 hover:shadow-md"
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 576 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64H240l-10.7 32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H346.7L336 416H512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM512 64V288H64V64H512z" />
              </svg>
              <span className="ml-3 flex">
                Announcement{" "}
                <em>
                  {announcement_NOTIF && (
                    <div className="bg-red-500 h-3 w-3 rounded-full ml-1" />
                  )}
                </em>
              </span>
              {announcement_NOTIF && (
                <label className="text-[8px] ml-2 p-0.5 rounded-sm bg-slate-500 text-white">
                  +{counter}
                </label>
              )}
            </Link>
            {/*Message*/}
            <Link
              to="/Message"
              onClick={() => setOpen(!open)}
              className="flex items-center p-2 rounded-lg text-white hover:bg-[#274472] transform hover:translate-x-2 hover:shadow-md"
            >
              <div className="flex items-center">
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z" />
                </svg>
                <span className="ml-3 flex ">
                  Message
                  {messagesNumber > 0 && (
                    <div className="h-[12px] w-[12px] bg-red-500 rounded-full" />
                  )}
                  {/* <IoMdNotifications className="text-red-600 ml-2 text-[20px]" /> */}
                </span>
                {messagesNumber > 0 && (
                  <label className="text-white bg-gray-500 rounded-md h-fit px-1 font-semibold font-mono text-[10px] items-center flex ml-[40px]">
                    +{messagesNumber}
                  </label>
                )}
              </div>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Navbar;
