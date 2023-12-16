import React, { useEffect, useState } from "react";
import ViewStudData from "./ViewStudData";
import Avatar from "@mui/material/Avatar";
import supabase from "../iMonitorDBconfig";

function StudentData({ studinfo, setHide }) {
  useEffect(() => {
    displayAvatar(studinfo.studemail);
  }, [studinfo]);

  var displayColor = "";
  var number;

  const [open, setOpen] = useState(false);

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    number = hash;

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
        className={`flex text-white items-center justify-center h-9  w-9 rounded-full font-thin`}
      >{`${name.toUpperCase().split(" ")[0][0]}${name.toUpperCase().split(" ")[1][0]} `}</div>
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

  function openmodal() {
    setOpen(!open);
  }

  return (
    <>
      <div
        onClick={() => openmodal()}
        className="grid grid-cols-2 cursor-pointer hover:bg-[#5885AF] hover:bg-opacity-[80%]  hover:text-blue-100 p-1 rounded-md "
      >
        <div className="flex gap-1 items-center capitalize ">
          {avatar ? (
            <img
              src={displayAvatarConfig}
              className="h-9 w-9 rounded-full"
            ></img>
          ) : (
            <>{avatarComponent(studinfo.studname)}</>
          )}
          {studinfo.studname}
        </div>
        <div>{studinfo.studsection}</div>
      </div>

      <ViewStudData
        onClose={setOpen}
        visible={open}
        studinfos={studinfo}
        studname={studinfo.studname}
        studemail={studinfo.studemail}
        displayColor={displayColor}
      />
    </>
  );
}

export default StudentData;
