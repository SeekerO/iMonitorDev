import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
//Picture

import stilogo from "./images/STILOGO4.png";
import profile from "./images/profile.png";
import profileDisplay from "./images/profile.png";
//Components
import jwt_decode from "jwt-decode";
import supabase from "./iMonitorDBconfig";
import Footer from "./Footer";
import BeneNavbar from "./BeneNavbar";
import BeneRoutes from "./BeneRoutes";
import StudentNavbar from "./StudentNavbar";
import StudentRoutes from "./StudentRoutes";
import AdminRoutes from "./AdminRoutes";
import AdminPage from "./AdminNavbar";
import Auth from "./Auth";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
// Design Animation
import AOS from "aos";
import "aos/dist/aos.css";
import moment from "moment";
import { FcGoogle } from "react-icons/fc";
import { BsMicrosoft } from "react-icons/bs";

import { AiOutlineClose, AiOutlineGoogle } from "react-icons/ai";
import { useGoogleLogin } from "@react-oauth/google";
import { Test, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import iMonitorLogo from "../components/images/iMonitor.png";
// AZURE
import { useMsal, AuthenticationResult } from "@azure/msal-react";
import { msalConfig, loginRequest } from "./Testing/authHere";
// Loading
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

function Navbar({ instance }) {
  // AOS ANIMATION
  useEffect(() => {
    AOS.init();
  }, []);
  // Checker
  const [studentchecker, setStudentChecker] = useState(false);
  const [benechecker, setBeneChecker] = useState(false);
  //Header
  var [email, setEmail] = useState();
  const [profileheader, setProfileHeader] = useState(null);
  // Currently Logged In holder
  const [user, setUser] = useState({});
  // Login modal design
  const [openLogin, setOpenLogin] = useState(false);
  const handleLogin = () => setOpenLogin(false);
  const [openadmin, setOpenAdmin] = useState(false);
  const handleopenadmin = () => setOpenAdmin(true);
  const handleopenadmin1 = () => setOpenAdmin(false);
  // Admin checker
  const [adminusername, setAdminUsername] = useState();
  const [adminpassword, setAdminPassword] = useState();
  const [adminverify, setAdminVerify] = useState(false);
  // Nav
  const navigate = useNavigate();
  // Change LOGO
  const [apple, setApple] = useState(false);
  //open profile
  const [openprofile, setOpenProfile] = useState(false);
  // User Name
  const [username, setUserName] = useState();
  // Bene Data Holder
  const [dataBene, setDataBene] = useState();
  // Stud Data Holder
  const [dataStud, setDataStud] = useState();
  // Loading
  const [load, setLoad] = useState(false);
  const [res, setRes] = useState();

  // Create a request object

  async function handleCallbackResponse(response) {
    const generatedToken = uuidv4();
    setEmail(response.username);
    setRes(response);
    Auth(
      generatedToken,
      response,
      setBeneChecker,
      setStudentChecker,
      remove,
      setProfileHeader,
      setUserName,
      greetings,
      studInfoGetter,
      beneInfoGetter,
      setEmail
    );
  }

  var loginResponse;
  const loginAZURE = async () => {
    try {
      loginResponse = await instance.loginPopup(loginRequest);

      handleCallbackResponse(loginResponse.account);
    } catch (error) {
      console.error("Authentication error", error);
    }
  };

  useEffect(() => {
    if (window.localStorage.getItem("token")) {
      checkToken();
      return;
    }

    supabase
      .channel("public-db-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "StudentInformation",
        },
        (payload) => {
          checkToken();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "BeneAccount",
        },
        (payload) => {
          checkToken();
        }
      )
      .subscribe();
  }, [window.localStorage.getItem("token")]);

  async function greetings(check) {
    if (!check) {
      toast.error("Your account is not registered", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
    } else {
      notif();
    }
  }

  function notif() {
    toast.success(`Welcome to iMonitor`, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light",
    });
  }

  // const login = useGoogleLogin({
  //   onSuccess: async (response) => {
  //     try {
  //       const data = await axios.get(
  //         "https://www.googleapis.com/oauth2/v3/userinfo",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${response.access_token}`,
  //           },
  //         }
  //       );

  //       handleCallbackResponse(data.data);
  //     } catch (error) {}
  //   },
  // });

  useEffect(() => {
    supabase.channel("public-db-changes").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "BeneAccount",
      },
      (payload) => {
        beneInfoGetter();
      }
    );
  }, []);

  async function beneInfoGetter() {
    try {
      const { data: beneInfo } = await supabase
        .from("BeneAccount")
        .select()
        .eq("accessToken", window.localStorage.getItem("token"))

        .single();

      setDataBene(beneInfo);

      return;
    } catch (error) {}
  }

  async function studInfoGetter() {
    try {
      const { data: studinfo } = await supabase
        .from("StudentInformation")
        .select()
        .eq("accessToken", window.localStorage.getItem("token"))
        .single();

      setDataStud(studinfo);

      return;
    } catch (error) {}
  }

  //token checker
  async function checkToken() {
    try {
      const { data: bene } = await supabase.from("BeneAccount").select();
      if (bene) {
        for (let index = 0; index < bene.length; index++) {
          if (
            window.localStorage.getItem("token") === bene[index].accessToken
          ) {
            getdataUserBene(bene[index].accessToken);
            beneInfoGetter();
            return;
          }
        }
      }

      const { data: stud } = await supabase.from("StudentInformation").select();
      if (stud) {
        for (let index = 0; index < stud.length; index++) {
          if (
            window.localStorage.getItem("token") === stud[index].accessToken
          ) {
            getdataUserStud(stud[index].accessToken);
            studInfoGetter();
            return;
          }
        }
      }

      let { data: admin1 } = await supabase.from("AdminAccount").select();

      for (let index = 0; index < admin1.length; index++) {
        if (
          window.localStorage.getItem("token") === admin1[index].accessToken
        ) {
          setAdminVerify(true);
          closelogins();
          remove();
          return;
        }
      }

      window.localStorage.removeItem("token");
      window.localStorage.removeItem("profile");
      handleSignOut();
    } catch (error) {}
  }

  //data  getter if true
  async function getdataUserBene(token) {
    const { data: bene } = await supabase
      .from("BeneAccount")
      .select()
      .eq("accessToken", token)
      .single();
    if (bene) {
      setBeneChecker(true);
      setEmail(bene.beneEmail);
      setProfileHeader(window.localStorage.getItem("profile"));
      remove();
    }
  }

  //data  getter if true
  async function getdataUserStud(token) {
    const { data: stud } = await supabase
      .from("StudentInformation")
      .select()
      .eq("accessToken", token)
      .single();
    if (stud) {
      setStudentChecker(true);
      setEmail(stud.studemail);
      setProfileHeader(window.localStorage.getItem("profile"));
      remove();
    }
  }

  function closelogins() {
    setOpenLogin(true);
    setOpenAdmin(false);
  }

  function remove() {
    setOpenLogin(true);

    document.getElementById("loginbutton").hidden = true;
    document.getElementById("welcome").hidden = true;
  }

  async function handleSignOut() {
    try {
      var date = moment().format("LLL");
      const { data: studinfo } = await supabase
        .from("StudentInformation")
        .select()
        .eq("accessToken", window.localStorage.getItem("token"))
        .single();

      const { data: insertactlog } = await supabase
        .from("ActivityLog")
        .insert([{ name: studinfo.studname, button: "Sign Out", time: date }]);

      window.localStorage.removeItem("token");
      window.localStorage.removeItem("profile");
      window.sessionStorage.clear();
      document.getElementById("loginbutton").hidden = false;
      document.getElementById("welcome").hidden = false;
      setUser({});
      setBeneChecker(false);
      setStudentChecker(false);
      setAdminUsername("");
      setAdminPassword("");
      setEmail();
      navigate("/");
      window.location.reload();
    } catch (error) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("profile");
      window.sessionStorage.clear();
      document.getElementById("loginbutton").hidden = false;
      document.getElementById("welcome").hidden = false;
      setUser({});
      setBeneChecker(false);
      setStudentChecker(false);
      setAdminUsername("");
      setAdminPassword("");
      setEmail();
      navigate("/");
      window.location.reload();
    }
  }

  // user Authentication
  async function handleAdminLogin() {
    try {
      const generatedToken = uuidv4();
      const fetchadmindata = async () => {
        let { data: admin } = await supabase.from("AdminAccount").select();
        var checker = false;
        if (admin) {
          for (let index = 0; index < admin.length; index++) {
            if (
              adminusername === admin[index].username &&
              adminpassword === admin[index].password
            ) {
              const { data } = await supabase
                .from("AdminAccount")
                .update({ accessToken: generatedToken })
                .eq("username", adminusername)
                .select();

              window.localStorage.setItem("token", generatedToken);
              setAdminVerify(true);
              closelogins();
              setAdminUsername("");
              setAdminPassword("");
              remove();
              greetings(true);
              return;
            }
          }
          greetings(false);
        }
      };
      fetchadmindata();
    } catch (error) {}
  }

  const divRef = useRef(null);

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setOpenProfile(false);
    }
  };

  const toggleDiv = () => {
    setOpenProfile(!openprofile);
  };



  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // EasterEGG
  function handlechange() {
    setApple(!apple);
  }

  return (
    <>
      <div className="flex flex-col absolute">
        {/* Navbar */}
        <header className="inset-auto w-screen top-0 bg-black h-[60px] flex items-center">
          <div className=" flex justify-between items-center bg-[#274472] w-[100%] h-[60px] p-4">
            {/* Logo */}
            <div className="flex ">
              {apple ? (
                <div className="md:mt-0.5 mt-0">
                  <img
                    src={iMonitorLogo}
                    alt="IMONITOR LOGO"
                    className="md:h-8 h-9 w-14 rounded-sm "
                  />
                </div>
              ) : (
                <div className="md:mt-0.5 mt-0">
                  <img
                    src={stilogo}
                    alt="STI LOGO"
                    className="md:h-8 h-9 w-14 rounded-sm"
                  />
                </div>
              )}

              <h1 className="ml-2 font-bold text-white md:text-3xl flex cursor-default text-2xl items-center">
                <p onClick={() => handlechange()} className="hover:cursor-help">
                  i
                </p>
                Monitor
              </h1>
            </div>
            {/* Login */}
            <div className=" justify-end">
              <button
                id="loginbutton"
                onClick={handleLogin}
                className="text-white bg-[#5885AF] hover:bg-[#41729F] font-medium p-1 rounded-md w-[100%] mr-2 ml-2 "
              >
                LOGIN
              </button>

              {/* Circle Profile */}
              {benechecker && (
                <div>
                  <div ref={divRef} className="flex items-center">
                    <div
                      onClick={() => toggleDiv()}
                      className="cursor-pointer w-[100%] flex-col items-center"
                    >
                      <div className="flex items-center gap-2">
                        {dataBene && (
                          <div className="flex items-center gap-1 opacity-90 md:text-base text-[11px]">
                            <label className=" text-white">
                              {dataBene && `${dataBene.beneName} `}
                            </label>
                            <label className=" text-white font-light md:flex hidden">{`${
                              dataBene.position === "ALUMNI OFFICER"
                                ? "(OFFICER)"
                                : "(ADVISER)"
                            }`}</label>
                          </div>
                        )}

                        {profileheader ? (
                          <img
                            className="md:h-10 md:w-10 h-8 w-8 rounded-full text-sm hover:ring-2 hover:ring-white"
                            src={profile}
                          />
                        ) : (
                          <img
                            className="md:h-10 md:w-10 h-8 w-8 rounded-full text-sm hover:ring-2 hover:ring-white"
                            src={profileheader}
                          />
                        )}
                      </div>

                      <div
                        className={`${
                          openprofile
                            ? "w-[120px] h-[50px] absolute  bg-white p-2 right-[1.5%] rounded-md mt-1.5 shadow-2xl"
                            : "hidden"
                        }`}
                      >
                        <div
                          onClick={(e) => handleSignOut(e)}
                          className=" p-1 rounded hover:bg-slate-300 hover:shadow-xl"
                        >
                          Sign Out
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {studentchecker && (
                <div ref={divRef} className="flex group">
                  <div
                    onClick={() => toggleDiv()}
                    className="cursor-pointer w-[100%]"
                  >
                    <div className="flex items-center gap-2 ">
                      <div className="flex items-center gap-1 opacity-90">
                        <label className=" text-white md:text-base  text-[11px]">
                          {dataStud && `${dataStud.studname} `}
                        </label>
                        <label className="font-light text-white  md:flex hidden">{`(STUDENT)`}</label>
                      </div>
                      {profileheader ? (
                        <img
                          className="md:h-10 md:w-10 h-8 w-8 rounded-full text-sm hover:ring-2 hover:ring-white "
                          src={profile}
                        />
                      ) : (
                        <img
                          className="md:h-10 md:w-10 h-8 w-8 rounded-full text-sm hover:ring-2 hover:ring-white "
                          src={profileheader}
                        />
                      )}
                    </div>

                    <div
                      className={`${
                        openprofile
                          ? "w-[120px] h-[90px] absolute  bg-white p-2 right-[1.5%] rounded-md mt-1.5 shadow-2xl"
                          : "hidden"
                      }`}
                    >
                      <Link to="/profile">
                        <p className=" p-1 rounded hover:bg-slate-300 hover:shadow-xl">
                          View Profile
                        </p>
                      </Link>
                      <div
                        onClick={(e) => handleSignOut(e)}
                        className=" p-1 rounded hover:bg-slate-300 hover:shadow-xl"
                      >
                        Sign Out
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {adminverify && (
                <div ref={divRef}>
                  <div
                    onClick={() => toggleDiv()}
                    className="cursor-pointer w-[100%]"
                  >
                    <img
                      className="md:h-10 md:w-10 h-8 w-8 rounded-full text-sm hover:ring-2 hover:ring-white"
                      src={profileDisplay}
                    />
                    <div
                      className={`${
                        openprofile
                          ? "w-[120px] h-[50px] absolute  bg-white p-2 right-[1.5%] rounded-md mt-1.5 shadow-2xl"
                          : "hidden"
                      }`}
                    >
                      <div
                        onClick={(e) => handleSignOut(e)}
                        className=" p-1 rounded hover:bg-slate-300 hover:shadow-xl"
                      >
                        Sign Out
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        {/* Navbar end */}

        {/* Login UI */}
        <div
          className={`${
            openLogin ? "hidden" : "visible"
          } fixed place-content-center justify-center`}
        >
          <div
            className={`fixed inset-0 bg-black bg-opacity-[1%] backdrop-blur-[2px] flex justify-center items-center`}
          >
            <div
              className={`bg-gray-300 md:w-[20%] w-[70%] rounded-md text-center mb-[20%]`}
            >
              <div className="w-full bg-[#274472] p-2 rounded-t-md flex justify-between">
                <p className="text-white font-bold">LOGIN</p>
                <a
                  onClick={closelogins}
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
                onClick={handleopenadmin}
                className="w-full bg-[#274472]  hover:bg-slate-400 cursor-pointer first-letter:hover:cursor-pointer p-2 rounded-b-md flex justify-between"
              >
                <p className="text-white font-base text-sm">Login as Admin</p>
              </div>
              <div
                className={`${
                  openadmin ? "" : " hidden translate-x-0 duration-300"
                }bg-slate-200 h-[35%] md:w-[20%] w-[70%] md:-mt-0 -mt-48 absolute`}
              >
                <p
                  onClick={handleopenadmin1}
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
                    type="password"
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="bg-gray-400 mt-3 ml-5 mr-5 rounded-md p-2"
                  />
                  <div
                    onClick={() => handleAdminLogin()}
                    className=" bg-[#274472] hover:bg-blue-500 hover:cursor-pointer text-center ml-5 mr-5 mt-4 p-3 rounded-md font-semibold text-white "
                  >
                    LOGIN
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Login UI End*/}

        {/* Main Div */}

        <div id="welcome">
          <div className=" place-content-center flex font-bold cursor-default text-white text-[64px] font-mono text-center  md:mt-[15%] mt-[50%] ">
            WELCOME to iMonitor
          </div>
        </div>
        <div>
          {load && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
          {benechecker && (
            <div className="relative left-0">
              <BeneNavbar email={email} Data={dataBene} />
            </div>
          )}
          {studentchecker && (
            <div className="relative left-0">
              <StudentNavbar email={email} />
            </div>
          )}
          {adminverify && <AdminPage />}
          <main className="flex-grow md:pl-52 bg-[#1e455d] bg-opacity-[60%] h-screen  ">
            {/* content here */}
            {benechecker && <BeneRoutes beneemail={email} data={dataBene} />}
            {studentchecker && <StudentRoutes studemail={email} />}
            {adminverify && (
              <AdminRoutes studemail={email} />
              // <main className="flex-grow -ml-52 h-screen  ">
              //
              // </main>
            )}
          </main>
        </div>
        {/* Main Div End*/}

        {/* Footer */}
        <footer className="fixed w-screen bottom-0">
          <Footer />
        </footer>
        {/* Footer End*/}
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default Navbar;
