import { useState, useRef, useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";
import ModalAccounts from "./AdminPages/ModalAccounts";

function AdminPage() {
  const [open, setOpen] = useState(true);
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
    <div>
      <div
        ref={divRef}
        className={`${
          open
            ? "transition-transform -translate-x-full duration-1000"
            : "transition-transform translate-x-0 duration-1000"
        }  flex w-52 h-screen bg-[#5885AF] transition-transform  -translate-x-full md:translate-x-0`}
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
        <div className="px-3 py-4 w-[100%]">
          <Link
            to="/"
            onClick={() => setOpen(!open)}
            className={
              "flex items-center w-[100%] p-2 rounded-lg text-white transform hover:bg-blue-400 hover:cursor-pointer"
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
            <span className="ml-3 text-white">Create Account</span>
          </Link>
          <Link
            to="/adminaccount"
            onClick={() => setOpen(!open)}
            className={
              "flex items-center w-[100%] p-2 rounded-lg text-white transform hover:bg-blue-400 hover:cursor-pointer"
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
            <span className="ml-3 text-white">Admin Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
