import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

//Picture
import stilogo from "./images/STILOGO4.png";

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
import icon from "./images/Icon.json";
import Lottie from "lottie-react";

import { Test, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import iMonitorLogo from "../components/images/iMonitor.png";
// AZURE
import { loginRequest } from "./authHere";

// Loading
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import LoginComponent from "./LoginComponent";

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

  const [openadmin, setOpenAdmin] = useState(false);

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

  const [hi, setHi] = useState(false);

  // Create a request object

  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState(null);

  useEffect(() => {
    if (prevLocation && location.pathname !== prevLocation.pathname) {
      // User has navigated to a different page

      if (location.pathname !== "/message" && benechecker) {
        const insert = async () => {
          await supabase
            .from("BeneAccount")
            .update({ onlineStatus: "offline" })
            .eq("beneEmail", email)
            .single();
        };
        insert();
      }
      if (location.pathname !== "/messagestudent" && studentchecker) {
        const insert1 = async () => {
          await supabase
            .from("StudentInformation")
            .update({ onlineStatus: "offline" })
            .eq("studemail", email)
            .single();
        };
        insert1();
      }
    }

    setPrevLocation(location);
  }, [location, prevLocation]);

  var loginResponse;
  const loginAZURE = async () => {
    try {
      loginResponse = await instance.loginPopup(loginRequest);

      handleCallbackResponse(loginResponse.account);
    } catch (error) {
      console.error("Authentication error", error);
    }
  };

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
      setUserName,
      greetings,
      studInfoGetter,
      beneInfoGetter,
      setEmail
    );
    await getUserProfile(loginResponse);
  }

  const getUserProfile = async (a) => {
    try {
      const response = await axios.get(
        "https://graph.microsoft.com/v1.0/me/photo/$value",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${a.accessToken}`,
          },
          responseType: "arraybuffer",
        }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const folderName = a.account.username;

        const { data: existingFiles, error } = await supabase.storage
          .from("ProfilePic")
          .list(folderName);

        if (error) console.log("Error", error);

        if (existingFiles.length === 0) {
          const fileName = uuidv4() + ".png";

          const { data } = await supabase.storage
            .from("ProfilePic")
            .upload(folderName + "/" + fileName, blob, {
              cacheControl: "3600",
              upsert: false,
            });

          if (data) {
            getProfilePic(a.account.username);
          }
        } else {
          getProfilePic(a.account.username);
        }
      }
    } catch (error) {
      console.error("Error fetching user avatar:", error);
    }
  };

  async function getProfilePic(email) {
    const { data: profilePic, error } = await supabase.storage
      .from("ProfilePic")
      .list(email + "/", { limit: 1, offset: 0 });

    if (profilePic) {
      var profileURL = `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/ProfilePic/${email}/${profilePic[0].name}`;
      window.localStorage.setItem("profile", profileURL);
    }
  }

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

  async function greetings(check, deactivated) {
    if (deactivated) {
      toast.error("Your account is deactivated", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
      });
      return;
    }
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

      if (studinfo) {
        setDataStud(studinfo);
      }
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
      if (adminusername === "seeker" && adminpassword === "sheesh") {
        setHi(true);
      } else {
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

                if (admin[index].status === "deactivate") {
                  toast.error("Your account is deactivate", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                  });
                  return;
                } else {
                  window.localStorage.setItem("token", generatedToken);
                  setAdminVerify(true);
                  closelogins();
                  setAdminUsername("");
                  setAdminPassword("");
                  remove();
                  greetings(true);
                  return;
                }
                return;
              }
            }
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

            return;
          }
        };
        fetchadmindata();
      }
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

              <h1 className="select-none ml-2 font-bold text-white md:text-3xl flex cursor-default text-2xl items-center  ">
                <p onClick={() => handlechange()} className=" select-none  ">
                  i
                </p>
                <p>Monitor</p>
              </h1>
            </div>

            {/* Login Button*/}
            <div className=" justify-end">
              <button
                id="loginbutton"
                onClick={() => setOpenLogin(!openLogin)}
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
                      {dataBene && (
                        <div className="flex items-center gap-2">
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

                          <img
                            className="md:h-10 md:w-10 h-8 w-8 rounded-full text-sm hover:ring-2 hover:ring-white"
                            src={window.localStorage.getItem("profile")}
                          />
                        </div>
                      )}
                      <div
                        className={`${
                          openprofile
                            ? "w-[120px] h-[50px] absolute  bg-white p-2 right-[1.5%] rounded-md mt-2 shadow-2xl"
                            : "hidden"
                        }`}
                      >
                        <div
                          className="w-0 h-0 justify-end flex items-end absolute ml-[95px] -mt-[15px]
                            border-l-[7px] border-l-transparent
                            border-b-[10px] border-b-white
                            border-r-[7px] border-r-transparent"
                        />
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
                        {dataStud && (
                          <>
                            <label className=" text-white md:text-base  text-[11px]">
                              {dataStud && `${dataStud.studname}`}
                            </label>
                            <label className="font-light text-white  md:flex hidden">{`(STUDENT)`}</label>
                          </>
                        )}
                      </div>
                      <img
                        src={window.localStorage.getItem("profile")}
                        className="md:h-10 md:w-10 h-8 w-8 rounded-full text-sm hover:ring-2 hover:ring-white "
                        alt="User Avatar"
                      />
                    </div>

                    <div
                      className={`${
                        openprofile
                          ? "w-[120px] h-[90px] absolute  bg-white p-2 right-[1.5%] rounded-md mt-2 shadow-2xl"
                          : "hidden"
                      }`}
                    >
                      <div
                        className="w-0 h-0 justify-end flex items-end absolute ml-[95px] -mt-[15px]
                            border-l-[7px] border-l-transparent
                            border-b-[10px] border-b-white
                            border-r-[7px] border-r-transparent"
                      />
                      <Link to="/Profile">
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
                          ? "w-[120px] h-[50px] absolute  bg-white p-2 right-[1.5%] rounded-md mt-2 shadow-2xl"
                          : "hidden"
                      }`}
                    >
                      <div
                        className="w-0 h-0 justify-end flex items-end absolute ml-[95px] -mt-[15px]
                            border-l-[7px] border-l-transparent
                            border-b-[10px] border-b-white
                            border-r-[7px] border-r-transparent"
                      />
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

        <LoginComponent
          openadmin={openadmin}
          setOpenAdmin={setOpenAdmin}
          setOpenLogin={setOpenLogin}
          openLogin={openLogin}
          setAdminUsername={setAdminUsername}
          setAdminPassword={setAdminPassword}
          handleAdminLogin={handleAdminLogin}
          loginAZURE={loginAZURE}
        />

        {/* Main Div */}

        <div id="welcome" className="  ">
          <div
            className="select-none place-content-center flex font-bold cursor-default text-white text-[64px] font-sans text-center 
           md:mt-[15%] mt-[50%] "
          >
            Welcome To iMonitor
          </div>
        </div>

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
        {adminverify && (
          <div className="relative left-0">
            <AdminPage />
          </div>
        )}
        <main className="flex-grow md:pl-52 bg-[#1e455d] bg-opacity-[60%] h-screen">
          {/* content here */}
          {benechecker && <BeneRoutes beneemail={email} data={dataBene} />}
          {studentchecker && <StudentRoutes studemail={email} />}
          {adminverify && <AdminRoutes studemail={email} />}
        </main>

        {/* Main Div End*/}

        {/* Footer */}
        <footer className="fixed w-screen bottom-0">
          <Footer />
        </footer>
        {/* Footer End*/}
      </div>
      <ToastContainer limit={1} />
      {hi && (
        <div className="fixed inset-0 bg-black bg-opacity-[1%] backdrop-blur-[2px] flex justify-center items-center text-white flex-col text-[30px] font-bold place-content-center">
          <Lottie animationData={icon} className="h-[400px]" />
          YOU FOUND MY BIRD!
        </div>
      )}
    </>
  );
}

export default Navbar;
