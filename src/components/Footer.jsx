import React, { useState } from "react";
import { BsFillBarChartFill } from "react-icons/bs";
import { BiSolidMessageCheck, BiSolidUserAccount } from "react-icons/bi";
import { AiFillFile } from "react-icons/ai";
import { MdOutlineManageSearch } from "react-icons/md";

const Footer = () => {
  const [openAbout, setOpenAbout] = useState(true);
  return (
    <>
      <div className={`${openAbout ? "hidden" : "visible"} fixed `}>
        <div className="fixed inset-0 bg-black  bg-opacity-10 backdrop-blur-sm flex place-content-center items-center">
          <div
            className={`bg-slate-300  md:w-[50%] w-[70%] shadow-lg shadow-black rounded-md text-center mb-[10%]`}
          >
            <div className=" p-10">
              <div className="text-start">
                <p className="font-semibold">Welcome to iMonitor</p>
                <p className="pt-1 font-light ">
                  This web application is intended for monitoring the student
                  trainees of STI College of Santa Maria.
                </p>
                <div className="mt-[5%] grid gap-y-2 mb-[5%]">
                  <p className="font-semibold mb-1 md:text-base text-sm">
                    The web application consist the following features:
                  </p>
                  <p className="flex md:text-base text-sm">
                    <BsFillBarChartFill className="text-[20px] mr-1" /> Progress
                    Tracker
                  </p>
                  <p className="flex md:text-base text-sm">
                    <BiSolidMessageCheck className="text-[20px] mr-1" />{" "}
                    Messaging System
                  </p>
                  <p className="flex md:text-base text-sm">
                    <AiFillFile className="text-[20px] mr-1" /> File Storing
                  </p>
                  <p className="flex md:text-base text-sm">
                    <MdOutlineManageSearch className="text-[20px] mr-1" />{" "}
                    Information Management
                  </p>
                  <p className="flex md:text-base text-sm">
                    <BiSolidUserAccount className="text-[20px] mr-1" />{" "}
                    Attendance System
                  </p>
                </div>
              </div>
              <a
                onClick={() => setOpenAbout(!openAbout)}
                className="hover:text-red-500 cursor-pointer"
              >
                CLOSE
              </a>
            </div>
            <p className="font-ligt text-[9px] text-right mr-[7px]">
              Developed by SeekerDev
            </p>
          </div>
        </div>
      </div>
      {/*  */}
      <div className="bg-[#274472] py-1 h-6 w-full text-white">
        <footer className="">
          <div className="justify-between flex text-xs">
            <span className="text-white pl-2">
              © 2023{" "}
              <a href="https://sti.edu/" className="hover:underline">
                STI College
              </a>
              . All Rights Reserved.
            </span>

            <a
              onClick={() => setOpenAbout(!openAbout)}
              className="mr-4 hover:underline  text-white cursor-pointer"
            >
              About
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Footer;
