import React from "react";
import supabase from "../iMonitorDBconfig";
import { useEffect, useState, useRef } from "react";
import { TailSpin } from "react-loader-spinner";
import AOS from "aos";
import "aos/dist/aos.css";
import { set } from "react-hook-form";
import { upload } from "@testing-library/user-event/dist/upload";

const Profile = ({ studemail }) => {
  useEffect(() => {
    fetchstudinfo();
    AOS.init({ duration: 1000 });
    // toHoursAndMinutes();
  }, []);

  const [studinfo, setStudInfo] = useState();

  const fetchstudinfo = async () => {
    const { data } = await supabase
      .from("StudentInformation")
      .select()
      .eq("studemail", studemail)
      .single();

    if (data) {
      setStudInfo(data);
    }
  };
  const fileInputRef = useRef();
  const [newProfile, setNewProfile] = useState();
  const [filename, setFileName] = useState();
  const [uploading, setUploading] = useState(false);
  const ChangeProfile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    if (event.target.files[0] !== undefined) {
      const selectedFile = event.target.files[0];
      setFileName(selectedFile.name);
      setNewProfile(event.target.files[0]);
    }
  };

  const UploadProfile = async () => {
    setUploading(true);
    var filepath = newProfile;
    var filenamepath = filename;
    setNewProfile();
    setFileName();
    
    const parts = window.localStorage.getItem("profile").split("/");
    const lastPart = parts[parts.length - 1];

    await supabase.storage
      .from("ProfilePic")
      .remove([`${studinfo.studemail}/${lastPart}`]);

    const { data: uploaded } = await supabase.storage
      .from("ProfilePic")
      .upload(studinfo.studemail + "/" + filenamepath, filepath);

    if (uploaded) {
      setTimeout(() => {
        const fetchPic = async () => {
          const { data: profilePic, error } = await supabase.storage
            .from("ProfilePic")
            .list(studinfo.studemail + "/", { limit: 1, offset: 0 });

          if (profilePic) {
            var profileURL = `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/ProfilePic/${studinfo.studemail}/${filename}`;
            window.localStorage.setItem("profile", profileURL);
            setUploading(false);
          }
        };
        fetchPic();
      }, 5000);
    }
  };

  return (
    <div>
      <div className="flex  place-content-center  h-screen w-[100%] ">
        <div className="h-[88%] w-[100%]  overflow-auto">
          {studinfo ? (
            <div className="w-[100%]  flex flex-col items-center mt-[5%] text-white  ">
              <div className="  justify-center items-center flex flex-col ">
                {!uploading ? (
                  <div className="group">
                    {newProfile ? (
                      <img
                        className="md:ml-0 ml-3 h-[170px] w-[170px] rounded-full shadow-lg shadow-gray-900 z-50"
                        src={URL.createObjectURL(newProfile)}
                      ></img>
                    ) : (
                      <img
                        className="md:ml-0 ml-3 h-[170px] w-[170px] rounded-full shadow-lg shadow-gray-900 z-50"
                        src={window.localStorage.getItem("profile")}
                      ></img>
                    )}
                    <div
                      onClick={() => ChangeProfile()}
                      className="flex justify-center -mt-10  z-0 font-semibold group-hover:opacity-100 opacity-0 cursor-pointer text-white"
                    >
                      Change Profile
                    </div>
                  </div>
                ) : (
                  <TailSpin
                    height="80"
                    width="80"
                    color="#0074B7"
                    ariaLabel="tail-spin-loading"
                    radius="0"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                )}

                <input
                  ref={fileInputRef}
                  id="Profile"
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  className="hidden"
                  onChange={handleFileChange}
                ></input>
              </div>

              {!uploading && (
                <>
                  {newProfile && (
                    <div className="flex gap-4 mt-6 ">
                      <a
                        onClick={() => setNewProfile()}
                        className="flex justify-center text-whitecursor-pointer bg-red-500 p-1 rounded-md cursor-pointer"
                      >
                        Cancel
                      </a>
                      <a
                        onClick={() => UploadProfile()}
                        className="flex justify-center text-white bg-green-500 p-1 rounded-md cursor-pointer"
                      >
                        Upload
                      </a>
                    </div>
                  )}
                </>
              )}

              <label className="mt-3  text-[30px] font-bold  flex">
                {studinfo.studname.toUpperCase()}
              </label>
              <label className=" mt-0.5  text-gray-200 text-xs font-extralight mb-5">
                STUDENT SECTION {studinfo.studsection}
              </label>
              <div className="bg-[#E7C01D] h-[2px] w-[95%] " />

              <div className="grid md:grid-cols-2 grid-cols-1 gap-x-14 gap-y-4 w-[80%] ">
                <div className="font-semibold  md:text-xl text-lg mt-[5%]">
                  STUDENT INFORMATION
                </div>
                <div className="gap-2 mt-2 w-[100%] flex items-center">
                  <label className="text-[14px]  md:text-xl text-lg font-semibold flex items-center gap-2">
                    CURRENT STUDENT PROGRESS
                  </label>
                  <div className="h-[25px] w-[40%] bg-slate-200 rounded-md  cursor-default shadow-md shadow-gray-500">
                    <div
                      className="h-[25px] bg-[#78D0F4] rounded-l-md rounded-r-md "
                      style={{
                        width: `${
                          (studinfo.studprogress / studinfo.studmaxprogress) *
                          100
                        }%`,
                      }}
                    >
                      <div
                        className={`${
                          studinfo.studprogress > 0
                            ? "md:pl-[60px] pl-[4px] p-1"
                            : "md:pl-[70px] pl-[10px] p-1"
                        } whitespace-nowrap z-0 md:text-[15px] text-[9px] font-mono   font-semibold mr-3 text-black items-center `}
                      >
                        {studinfo.studprogress} / {studinfo.studmaxprogress}
                      </div>
                    </div>
                  </div>
                </div>

                <label className=" mt-4 md:text-md text-base font-semibold">
                  {studinfo.studprogram}
                </label>

                <label className=" mt-4 md:text-md text-base font-semibold">
                  {studinfo.studemail}
                </label>

                <label className="md:text-md text-base font-semibold">
                  OJT START: {studinfo.ojtstart}
                </label>
                <label className="  md:text-md text-base font-semibold">
                  OJT END: {studinfo.ojtend}
                </label>
                <label className=" md:text-md text-base font-semibold">
                  REMARKS:{" "}
                  <p className="text-base mt-1">{studinfo.studremarks}</p>
                </label>
              </div>
              <div className="font-semibold  md:text-3xl text-lg mt-[5%] mb-[5%]">
                COMPANY INFORMATION
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-x-20 gap-y-4 w-[80%]  items-center">
                <label className=" mt-4 md:text-md text-base font-semibold">
                  COMPANY NAME:{" "}
                  <label className="font-thin">{studinfo.companyname}</label>
                </label>
                <label className=" mt-4 md:text-md text-base font-semibold">
                  COMPANY ADDRESS:{" "}
                  <label className="font-thin">{studinfo.companyaddress}</label>
                </label>
                <label className=" mt-4 md:text-md text-base font-semibold">
                  SUPERVISOR NAME:{" "}
                  <label className="font-thin">{studinfo.supervisorname}</label>
                </label>
                <label className=" mt-4 md:text-lg text-base font-semibold">
                  SUPERVISOR CONTACT #:{" "}
                  <label className="font-thin">
                    {studinfo.supervisorcontactnumber}
                  </label>
                </label>
                <label className=" mt-4 md:text-md text-base font-semibold">
                  SUPERVISOR OFFICER #:{" "}
                  <label className="font-thin">
                    {studinfo.supervisorofficenumber}
                  </label>
                </label>
                <label className=" mt-4 md:text-md text-base font-semibold">
                  COMPANY DESIGNATION:{" "}
                  <label className="font-thin">
                    {studinfo.companydesignation}
                  </label>
                </label>
                <label className=" mt-4 md:text-md text-base font-semibold mb-20">
                  COMPANY EMAIL:{" "}
                  <label className="font-thin">{studinfo.companyemail}</label>
                </label>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[100%]">
              <TailSpin
                height="80"
                width="80"
                color="#0074B7"
                ariaLabel="tail-spin-loading"
                radius="0"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
