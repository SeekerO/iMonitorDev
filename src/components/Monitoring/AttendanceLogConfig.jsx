import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import moment from "moment";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
function AttendanceLogConfig({ data }) {
  const [studData, setStudData] = useState([]);
  const [avatar, setAvatar] = useState(false);
  const [displayAvatarConfig, setDisplayAvatar] = useState();

  useEffect(() => {
    AvatarFetch();
    displayAvatar(data.studemail);
  }, [data]);

  const checkTimeInAndTimeOut = (time) => {
    if (time !== null) return true;
    else return false;
  };

  const AvatarFetch = async () => {
    const { data: student } = await supabase
      .from("StudentInformation")
      .select()
      .match({ studemail: data.studemail })
      .single();

    setStudData(student);
  };

  const secondConverter = (totalSeconds) => {
    if (totalSeconds === null) {
      return "";
    } else {
      const duration = moment.duration(totalSeconds, "seconds");

      // Format the duration as a time string
      const formattedTime = moment
        .utc(duration.asMilliseconds())
        .format("hh:mm:ss A");

      return formattedTime;
    }
  };

  var displayColor = "";

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string?.length; i += 1) {
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
      >{`${name?.split(" ")[0][0]}`}</div>
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

  return (
    <div className="grid items-center gap-1 h-fit bg-slate-300 p-1 grid-cols-4 font-thin hover:p-3 hover:m-1 hover:rounded-md duration-300" >
      <div className="flex items-center gap-1 ">
        {avatar && studData?.studname ? (
          <img src={displayAvatarConfig} className="h-9 w-9 rounded-full"></img>
        ) : (
          avatarComponent(data?.studname)
        )}
        <div className=" text-[14px]">{data?.studname}</div>
      </div>

      <div className="flex justify-center items-center gap-1">
        {checkTimeInAndTimeOut(data?.studin) ? (
          <IoMdCheckmarkCircleOutline className="text-green-500 md:text-[25px] text-[20px]" />
        ) : (
          <RxCross2 className="text-red-500 md:text-[25px] text-[20px]" />
        )}
        {secondConverter(data?.studin)}
      </div>
      <div className="flex justify-center items-center gap-1">
        {checkTimeInAndTimeOut(data?.studout) ? (
          <IoMdCheckmarkCircleOutline className="text-green-500 md:text-[25px] text-[20px]" />
        ) : (
          <RxCross2 className="text-red-500 md:text-[25px] text-[20px]" />
        )}
        {secondConverter(data?.studout)}
      </div>
      <div className="flex justify-center">{data?.studDate}</div>
    </div>
  );
}

export default AttendanceLogConfig;
