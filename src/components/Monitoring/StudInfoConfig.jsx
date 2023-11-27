import { Link } from "react-router-dom";
import supabase from "../iMonitorDBconfig";
import ArchiveModal from "./ArchiveModal";
import ViewProfileModal from "./ViewProfileModal";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Avatar from "@mui/material/Avatar";
const StudInfoConfig = ({
  studinfos,
  BeneData,
  course,
  sy,
  handleCheck,
  ReactTooltip,
}) => {
  // AOS ANIMATION
  useEffect(() => {
    displayAvatar(studinfos.studemail);
    percentage();
    AOS.init({ duration: 1000 });
  }, [sy]);

  const [showmodalarchive, setShowModalArchive] = useState(false);
  const handleclosemodalarchive = () => setShowModalArchive(false);

  const [showmodalprofile, setShowModalProfile] = useState(false);
  const handleclosemodalprofile = () => setShowModalProfile(false);

  const [avatar, setAvatar] = useState(false);
  const [displayAvatarConfig, setDisplayAvatar] = useState();
  const [percent, setPercent] = useState(
    Math.round((studinfos.studprogress / studinfos.studmaxprogress) * 100)
  );

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
        className={`flex text-white items-center justify-center h-[40px] w-[40px] rounded-full font-thin`}
      >{`${name.split(" ")[0][0]}${name.split(" ")[1][0]} `}</div>
    );
  }

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

  const percentage = (min, max) => {
    let duration = Math.round((min / max) * 100);

    return duration;
  };

  return (
    <>
      <div className={``}>
        <div className={`${studinfos.studSY !== sy && "hidden"}`}>
          <div
            className="bg-slate-200 text-black flex font-medium rounded mt-1.5 
            hover:shadow-sm hover:shadow-black duration-300 p-2 hover:p-3"
          >
            <div
              data-tip="View Information"
              className=" pl-[2%] w-[29%]  hover:text-blue-600 cursor-default  items-center flex"
            >
              <a
                data-tooltip-id="View"
                onClick={() => setShowModalProfile(true)}
                className=" md:text-[16px] text-[10px] flex gap-1 items-center  cursor-pointer"
              >
                {avatar ? (
                  <img
                    src={displayAvatarConfig}
                    className="h-9 w-9 rounded-full"
                  ></img>
                ) : (
                  avatarComponent(studinfos.studname)
                )}

                {studinfos.studname}
              </a>
            </div>

            <div className="w-[46%] pl-[10%] md:text-[16px] text-[10px] cursor-default items-center flex">
              {studinfos.studsection}
            </div>
            <div className=" h-6 w-[20%] bg-[#4d8092a7] mr-6 rounded-md  md:mt-1.5 mt-0 cursor-default items-center flex">
              <div
                className=" h-6 bg-[#78D0F4]  rounded-l rounded-r items-center flex"
                style={{
                  width: `${
                    (studinfos.studprogress / studinfos.studmaxprogress) * 100
                  }%`,
                }}
              >
                <div
                  className={`${
                    percentage(
                      studinfos.studprogress,
                      studinfos.studmaxprogress
                    ) > 80
                      ? "w-full md:ml-0 ml-0.5"
                      : "w-fit ml-1"
                  } md:text-[15px] text-[9px] font-mono   font-semibold mr-3  justify-center flex text-center`}
                >
                  {studinfos.studprogress}hrs/
                  {studinfos.studmaxprogress}hrs
                </div>
              </div>
            </div>
            <div
              id="menu"
              data-tip="Archive"
              className="pt-1  items-center flex"
            >
              <button
                data-tooltip-id="Archive"
                className="bg-slate-200 hover:cursor-pointer"
                onClick={() => setShowModalArchive(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 fill-current hover:text-blue-400"
                  viewBox="0 0 512 512"
                >
                  <path d="M32 32H480c17.7 0 32 14.3 32 32V96c0 17.7-14.3 32-32 32H32C14.3 128 0 113.7 0 96V64C0 46.3 14.3 32 32 32zm0 128H480V416c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V160zm128 80c0 8.8 7.2 16 16 16H336c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <ArchiveModal
          studinfos={studinfos}
          onClose={handleclosemodalarchive}
          visible={showmodalarchive}
        />

        <ViewProfileModal
          beneData={BeneData}
          onClose={handleclosemodalprofile}
          visible={showmodalprofile}
          studinfos={studinfos}
          studemail={studinfos.studemail}
          displayAvatarConfig={displayAvatarConfig}
          displayColor={displayColor}
        />
        <ReactTooltip
          id="View"
          place="right"
          variant="info"
          content="View Profile"
        />
        <ReactTooltip
          id="Archive"
          place="left"
          variant="info"
          content="Archive"
        />
      </div>
    </>
  );
};

export default StudInfoConfig;
