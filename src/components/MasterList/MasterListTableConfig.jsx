import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ViewProfileMasterModal from "./ViewProfileMasterModal";
import supabase from "../iMonitorDBconfig";
import Avatar from "@mui/material/Avatar";
import AOS from "aos";
import "aos/dist/aos.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
const MasterListTableConfig = ({ studinfos, sy, course }) => {
  // AOS ANIMATION
  useEffect(() => {
    displayAvatar(studinfos.studemail);
    AOS.init();
  }, [sy]);

  const [showmodalprofile, setShowModalProfile] = useState(false);

  const [DateHolderSY, SetDateHolderSY] = useState();
  const [StudCreateDate, SetStudCreateDate] = useState();

  var displayColor = "";
  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    displayColor = color;
    /* eslint-enable no-bitwise */
    return color;
  }

  function avatarComponent(name) {
    return (
      <div
        style={{ background: stringToColor(name) }}
        className={`flex text-white  items-center justify-center h-9  w-9 rounded-full font-thin`}
      >{`${name.split(" ")[0][0]}${name.split(" ")[1][0]} `}</div>
    );
  }

  const [avatar, setAvatar] = useState(false);
  const [displayAvatarConfig, setDisplayAvatar] = useState();

  async function displayAvatar(email) {
    try {
      const { data: profilePic } = await supabase.storage
        .from("ProfilePic")
        .list(email + "/", { limit: 1, offset: 0 });

      if (profilePic) {
        setAvatar(true);

        setDisplayAvatar(
          `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/ProfilePic/${email}/${profilePic[0].name}`
        );
      }
    } catch (error) {
      setAvatar(false);
    }
  }

  return (
    <>
      <div className="grid grid-cols bg-slate-200 rounded-md mt-[0.5%] hover:p-1 hover:translate-x-2 duration-100 hover:shadow-lg ">
        <div className={`${studinfos.studSY !== sy && "hidden"} `}>
          <div className="md:h-[50px] h-[70px]  text-black flex p-4 font-medium rounded items-center">
            <div
              className="  md:w-[30%] w-[32%] hover:text-blue-600 hover:before:opacity-100 
            hover:cursor-pointer md:text-[16px] text-[10px]"
              onClick={() => setShowModalProfile(true)}
            >
              <div data-tooltip-id="View" className="flex items-center gap-2">
                {avatar ? (
                  <img
                    src={displayAvatarConfig}
                    className="h-9 w-9 rounded-full"
                  ></img>
                ) : (
                  avatarComponent(studinfos.studname)
                )}
                {studinfos.studname}
              </div>
            </div>
            <div className="w-[46%] ml-[15%]  md:text-[16px] text-[10px]">
              {studinfos.studsection}
            </div>

            <div className="grid md:grid-cols-2  w-[25%] md:mr-5 mr-2">
              <div className="md:text-[16px] text-[10px] text-center">
                {studinfos.studprogress}hrs/
                {studinfos.studmaxprogress}hrs
              </div>

              <div className=" w-[100%] bg-gray-400 rounded-md md:h-6 h-5  rounded-r text-center">
                <div
                  className={`${
                    studinfos.status === "complete"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  } rounded-l rounded-r md:h-6 h-5 md:text-[16px] text-[10px]  md:pt-[0%] pt-[3%]`}
                  style={{
                    width: `${100}%`,
                  }}
                >
                  {studinfos.status == "complete" ? "COMPLETE" : "INCOMPLETE"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReactTooltip
        id="View"
        place="bottom"
        variant="info"
        content="View Profile"
      />
      <ViewProfileMasterModal
        onClose={setShowModalProfile}
        visible={showmodalprofile}
        studinfos={studinfos}
        studname={studinfos.studname}
        studemail={studinfos.studemail}
        displayAvatarConfig={displayAvatarConfig}
        displayColor={displayColor}
      />
    </>
  );
};

export default MasterListTableConfig;
