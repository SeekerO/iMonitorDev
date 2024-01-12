import React, { useState, useEffect } from "react";
import supabase from "../../../iMonitorDBconfig";
const ContactsConfig = ({
  data,
  setUserClicked,
  setInputSearch,
  setHeaderData,
}) => {
  const [img, setImg] = useState();
  const [avatar, setAvatar] = useState(false);

  var displayColor;
  const [counter, setCounter] = useState(0);
  const [notif, setNotif] = useState();

  useEffect(() => {
    displayAvatar(data.studemail || data.beneEmail || data.email);
  }, []);

  async function displayAvatar(email) {
    try {
      const { data: profilePic } = await supabase.storage
        .from("ProfilePic")
        .list(email + "/", { limit: 1, offset: 0 });

      if (profilePic) {
        setAvatar(true);
        setImg(
          `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/ProfilePic/${email}/${profilePic[0].name}`
        );
      }
    } catch (error) {
      setAvatar(false);
    }
  }

  function avatarComponent(name) {
    return (
      <div className="flex items-end">
        <div
          style={{ background: stringToColor(name) }}
          className={`flex text-white items-center justify-center h-[40px]  w-[40px] rounded-full font-thin border-2 border-white`}
        >{`${name.toUpperCase().split(" ")[0][0]}`}</div>

        {data.onlineStatus === "online" ? (
          <div className="bg-green-400 h-[13px] w-[13px] -ml-3 rounded-full border-2 border-white" />
        ) : (
          <div className="bg-gray-400 h-[13px] w-[13px] -ml-3 rounded-full border-2 border-white" />
        )}
      </div>
    );
  }

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
  const ChatClicked = () => {
    setUserClicked(data);
    setInputSearch("");
    setHeaderData({
      name: data.studname || data.beneName || data.name,
      imgURL: img,
      avatarStatus: avatar,
      displayColor: displayColor,
    });
  };
  return (
    <>
      <div onClick={() => ChatClicked()} className="flex items-center p-1">
        <div className="flex">
          {!avatar ? (
            avatarComponent(data.studname || data.beneName || data.name)
          ) : (
            <div className="flex items-end">
              <img
                src={img}
                className="h-[40px] w-[40px] rounded-full border-2 border-white"
              />
              {data.onlineStatus === "online" ||
              data.onlineStatus === "online" ? (
                <div className="bg-green-400 h-[13px] w-[13px] -ml-3 border-2 border-white rounded-full" />
              ) : (
                <div className="bg-gray-400 h-[13px] w-[13px] -ml-3 border-2 border-white rounded-full " />
              )}
            </div>
          )}
        </div>
        {data.studname || data.beneName || data.name}
      </div>
    </>
  );
};

export default ContactsConfig;
