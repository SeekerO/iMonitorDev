import React from "react";

import { AiOutlineClose } from "react-icons/ai";
function LoginComponent({
  openadmin,
  setOpenAdmin,
  openLogin,
  setOpenLogin,
  loginAZURE,
  handleAdminLogin,
  setAdminPassword,
  setAdminUsername,
}) {
  if (openLogin) return null;
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-[1%] backdrop-blur-[2px] flex justify-center items-center`}
    >
      <div
        className={`bg-gray-300 md:w-[20%] w-[70%] rounded-md text-center mb-[20%] shadow-black shadow-md`}
      >
        <div className="w-full bg-[#274472] p-2 rounded-t-md flex justify-between">
          <p className="text-white font-bold">LOGIN</p>
          <a
            onClick={() => setOpenLogin(!openLogin)}
            className="text-white font-bold text-[20px] w-5 hover:cursor-pointer hover:text-red-600"
          >
            <AiOutlineClose />
          </a>
        </div>
        <div
          className={`${
            openadmin
              ? "hidden duration-300"
              : "mt-10 mb-10 flex place-content-center duration-300"
          }`}
        >
          <div className="flex bg-[#d33f3f] p-2 rounded-md text-white font-sans font-semibold hover:bg-opacity-60 hover:text-slate-300 gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="30"
              height="30"
              viewBox="0 0 48 48"
              className="flex items-center"
            >
              <path
                fill="#FFFFFF"
                d="M36.883,7.341C38.726,7.85,40,9.508,40,11.397v25.162c0,1.906-1.301,3.57-3.168,4.065L25.29,43.863 L29,36V11l-3.148-6.885L36.883,7.341z"
              ></path>
              <path
                fill="#A7AAB4"
                d="M29,35v3.927c0,3.803-3.824,6.249-7.019,4.491l-6.936-4.445c-0.802-0.466-1.236-1.462-0.964-2.457 C14.334,35.59,15.202,35,16.115,35L29,35z"
              ></path>
              <path
                fill="#767A89"
                d="M15.456,32.228l-3.4,1.502C10.694,34.532,9,33.518,9,31.901V14.904c0-1.536,0.811-2.95,2.116-3.691 l11.83-6.687C25.669,2.983,29,5.014,29,8.218v3.09l-10.037,3.486C17.78,15.263,17,16.436,17,17.743v11.742 C17,30.618,16.41,31.665,15.456,32.228z"
              ></path>
            </svg>

            {/* <BsMicrosoft className="text-[25px] mr-1" /> */}
            <button onClick={loginAZURE}>LOGIN WITH OFFICE 365</button>
          </div>
        </div>

        <div
          onClick={() => setOpenAdmin(!openadmin)}
          className="w-full bg-[#274472]  hover:bg-slate-400 cursor-pointer first-letter:hover:cursor-pointer p-2 rounded-b-md flex justify-between"
        >
          <p className="text-white font-base text-sm">Login as Admin</p>
        </div>
        <div
          className={`${
            openadmin ? "" : " hidden translate-x-0 duration-300"
          }bg-slate-200 md:w-[20%] w-[70%] md:-mt-0 -mt-48 absolute`}
        >
          <p
            onClick={() => setOpenAdmin(!openadmin)}
            className="text-white font-base text-sm bg-[#274472] -mt-9 hover:bg-slate-400 p-2 bg-text-center w-full hover:cursor-pointer "
          >
            Close Login Admin
          </p>

          <div className="flex flex-col text-start">
            <p className=" font-semibold mt-3 ml-5">Username</p>
            <input
              type="text"
              onChange={(e) => setAdminUsername(e.target.value)}
              className="bg-gray-400 mt-3 ml-5 mr-5 rounded-md p-2"
            />
            <p className=" font-semibold mt-3 ml-5">Password</p>
            <input
              type="Password"
              onChange={(e) => setAdminPassword(e.target.value)}
              className="bg-gray-400 mt-3 ml-5 mr-5 rounded-md p-2"
            />
            <div
              onClick={() => handleAdminLogin()}
              className=" bg-[#274472] mb-5 hover:bg-blue-500 hover:cursor-pointer text-center ml-5 mr-5 mt-4 p-3 rounded-md font-semibold text-white "
            >
              LOGIN
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
