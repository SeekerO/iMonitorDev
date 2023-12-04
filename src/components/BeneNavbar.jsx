import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { IoMdNotifications } from "react-icons/io";
import supabase from "./iMonitorDBconfig";

import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

function Navbar({ email, Data }) {
  const [open, setOpen] = useState(true);
  const [drop, Setdropopen] = useState(true);
  const [notif, setNotif] = useState(false);
  const [messagesNumber, setMessNumber] = useState(0);
  const [data, setData] = useState();

  useEffect(() => {
    checkmessage();
    AOS.init();
    const Messaging = supabase
      .channel("custom-filter-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Messaging",
        },
        (payload) => {
          setNotif(false);
          setMessNumber(0);
          checkmessage();
        }
      )
      .subscribe();
  }, []);

  async function checkmessage() {
    const { data: benedata } = await supabase
      .from("BeneAccount")
      .select()
      .eq("beneEmail", email)
      .single();
    setData(benedata);
    const { data: beneMess, count } = await supabase
      .from("Messaging")
      .select("*", { count: "exact" })
      .match({ contactwith: benedata.beneName, readmessage: "FALSE" });

    setMessNumber(count);
    for (let index = 0; index < beneMess.length; index++) {
      if (beneMess[index].readmessage === false) {
        setNotif(true);
        return;
      } else {
        setNotif(false);
      }
    }
  }

  function handlemessagebutton() {
    setOpen(!open);
    checkmessage();
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

  return (
    <div className="justify-between items-center ">
      <div
        ref={divRef}
        className={`${
          open
            ? "transition-transform -translate-x-full duration-300"
            : "transition-transform translate-x-0 duration-500"
        } absolute flex w-52 h-screen bg-[#5885AF]  text-[#B1D4E0] transition-transform -translate-x-full md:translate-x-0`}
      >
        <div
          className="pl-[208px] pt-[10px] absolute"
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
            } w-7 h-7 text-white hover:text-[#60A3D9] hover:cursor-pointer md:hidden visible`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>

        {Data ? (
          <div className="px-3 py-4 ">
            {/*REGISTRATION BUTTON*/}

            <Link
              to="/registration"
              onClick={() => setOpen(!open)}
              className={`${
                Data.position === ""
                  ? "hidden"
                  : `flex items-center p-2 rounded-lg text-white hover:bg-[#274472] transform hover:translate-x-2 hover:shadow-md duration-500`
              }`}
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
              <span className="ml-3">Registration</span>
            </Link>

            {/*MONITORING BUTTON*/}
            <Link
              to="/"
              onClick={() => setOpen(!open)}
              className="flex items-center p-2 rounded-lg text-white transform duration-500 hover:bg-[#274472] hover:translate-x-2 hover:shadow-md  focus:bg-[#274472] focus:translate-x-2 focus:shadow-md "
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
              <span className="ml-3">Monitoring</span>
            </Link>
            {/*MASTER LIST BUTTON*/}
            <Link
              to="/masterlist"
              onClick={() => setOpen(!open)}
              className={`${
                Data.position === ""
                  ? "hidden"
                  : `flex items-center p-2 rounded-lg text-white hover:bg-[#274472] transform hover:translate-x-2 hover:shadow-md duration-500`
              }`}
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" />
              </svg>
              <span className="ml-3">Master List</span>
            </Link>
            {/*COMPANY BUTTON*/}

            {Data.position !== "ALUMNI OFFICER" ? (
              ""
            ) : (
              <Link
                to="/company"
                onClick={() => setOpen(!open)}
                className={`flex items-center p-2 rounded-lg text-white hover:bg-[#274472] transform hover:translate-x-2 hover:shadow-md duration-500`}
              >
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 384 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M48 0C21.5 0 0 21.5 0 48V464c0 26.5 21.5 48 48 48h96V432c0-26.5 21.5-48 48-48s48 21.5 48 48v80h96c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V112zM272 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16z" />
                </svg>
                <span className="ml-3">Company</span>
              </Link>
            )}

            {/*MESSAGE BUTTON*/}
            <Link
              to="/message"
              onClick={() => handlemessagebutton()}
              className="flex items-center p-2 rounded-lg text-white hover:bg-[#274472] transform hover:translate-x-2 hover:shadow-md  duration-500"
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
                  {notif && (
                    <div className="h-[12px] w-[12px] bg-red-500 rounded-full" />
                  )}
                  {/* <IoMdNotifications className="text-red-600 ml-2 text-[20px]" /> */}
                </span>
                {notif && (
                  <label className="text-white bg-gray-500 rounded-md h-fit px-1 font-semibold font-mono text-[10px] items-center flex ml-[40px]">
                    +{messagesNumber}
                  </label>
                )}
              </div>
            </Link>
            {/*ANNOUCEMENT BUTTON*/}
            <a
              className="flex items-center p-2 rounded-lg text-white hover:bg-[#274472] hover:cursor-pointer hover:shadow-md group  duration-500"
              onClick={() => Setdropopen(!drop)}
            >
              <svg
                aria-hidden="true"
                className="h-6 text-white"
                fill="currentColor"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75H192 160 64c-35.3 0-64 28.7-64 64v96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V352l8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V300.4c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4V32zm-64 76.7V240 371.3C357.2 317.8 280.5 288 200.7 288H192V192h8.7c79.8 0 156.5-29.8 215.3-83.3z" />
              </svg>
              <span className="ml-3">Announcement</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`${
                  drop ? "rotate-180 duration-300" : "rotate-0 duration-300"
                } h-5 ml-2 text-white`}
                fill="currentColor"
                viewBox="0 0 448 512"
              >
                <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" />
              </svg>
            </a>
            {/*DROWN DOWN MENU FOR ANNOUCNEMENT SUB MODULE*/}

            <div
              className={`${
                drop
                  ? "overflow-hidden transition-all duration-[300ms] max-h-0"
                  : "overflow-visible transition-all duration-300 max-h-[130px]"
              }`}
            >
              <Link
                to="/createannouncement"
                onClick={() => setOpen(!open) || Setdropopen(!drop)}
                className="flex items-center p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#274472] transform hover:translate-x-2 hover:shadow-md  duration-500"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-white transition"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M128 32V64H80c-26.5 0-48 21.5-48 48v48H480V112c0-26.5-21.5-48-48-48H384V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H192V32c0-17.7-14.3-32-32-32s-32 14.3-32 32zM480 192H32V464c0 26.5 21.5 48 48 48H432c26.5 0 48-21.5 48-48V192zM256 248c13.3 0 24 10.7 24 24v56h56c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v56c0 13.3-10.7 24-24 24s-24-10.7-24-24V376H176c-13.3 0-24-10.7-24-24s10.7-24 24-24h56V272c0-13.3 10.7-24 24-24z" />
                </svg>
                <span className="ml-3 text-sm text-white">
                  Create Announcement
                </span>
              </Link>

              <Link
                to="/activitylog"
                onClick={() => setOpen(!open) || Setdropopen(!drop)}
                className="flex  p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#274472] transform hover:translate-x-2 hover:shadow-md  duration-500"
              >
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 text-white transition"
                  fill="currentColor"
                  viewBox="0 0 448 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
                </svg>

                <svg
                  aria-hidden="true"
                  className="w-4 h-4 text-white transition"
                  fill="currentColor"
                  viewBox="0 0 576 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                </svg>
                <span className="ml-3 text-sm text-white">Activity Log</span>
              </Link>

              <Link
                to="/uploadlog1"
                onClick={() => setOpen(!open) || Setdropopen(!drop)}
                className="flex  p-2 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-[#274472] transform hover:translate-x-2 hover:shadow-md  duration-500"
              >
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 text-white transition"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
                </svg>

                <svg
                  aria-hidden="true"
                  className="w-4 h-4 text-white transition"
                  fill="currentColor"
                  viewBox="0 0 576 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
                </svg>
                <span className="ml-3 text-sm  text-white">Upload Log</span>
              </Link>
            </div>
          </div>
        ) : (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </div>
    </div>
  );
}

export default Navbar;
