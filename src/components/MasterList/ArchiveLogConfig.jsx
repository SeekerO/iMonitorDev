import React, { useState, useEffect } from "react";
import supabase from "../iMonitorDBconfig";
import moment from "moment";
function ArchiveLogConfig({ data }) {
  useEffect(() => {
    displayAvatar(data.archivedEmail);
  }, [data]);
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
        className={`flex text-white  items-center justify-center h-8  w-8 rounded-full font-thin`}
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
    <div className="bg-slate-300 p-1 flex justify-between items-center hover:p-3 hover:m-1 hover:rounded-md duration-300">
      <div className="flex items-center  gap-1">
        {avatar ? (
          <img src={displayAvatarConfig} className="h-9 w-9 rounded-full shadow-black shadow-sm"></img>
        ) : (
          avatarComponent(data.archivedName)
        )}
        <div className="grid ">
          <div className="font-base"> {data.archivedName}</div>
          <div className="text-[10px] font-thin">
            Archived By: {data.archivedBy}
          </div>
        </div>
      </div>
      <div className="text-[12px] font-thin">{moment(data.archivedDate).format("LLL")}</div>
    </div>
  );
}

export default ArchiveLogConfig;
