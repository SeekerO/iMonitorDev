import React, { useState, useEffect } from "react";
import supabase from "../iMonitorDBconfig";
import { FaBell } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
function MessagingConfig({
  beneinfo,
  setGetBeneName,
  message,
  setShowMessage,
  studName,
  read,
  setGetID,
  getFile,
  setAvatarColor,
  setAvatarURL,
  setOnlineStatus,
}) {
  const [lastmess, setLastMess] = useState([]);
  const [notif, setNotif] = useState(false);

  const [img, setImg] = useState();
  const [avatar, setAvatar] = useState(false);
  var displayColor;
  const [displayURL, setDisplayURL] = useState();
  const [counter, setCounter] = useState(0);

  //checker if there are unread messages each name

  useEffect(() => {
    displayAvatar(beneinfo.beneEmail);
  }, []);

  useEffect(() => {
    setNotif(false);
    CheckNotification();
  }, [message]);

  useEffect(() => {
    readmessage();
  }, [read]);

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

    /* eslint-enable no-bitwise */
    displayColor = color;
    return color;
  }

  async function displayAvatar(email) {
    try {
      const { data: profilePic } = await supabase.storage
        .from("ProfilePic")
        .list(email + "/", { limit: 1, offset: 0 });

      if (profilePic) {
        setAvatar(true);
        setDisplayURL(
          `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/ProfilePic/${email}/${profilePic[0].name}`
        );
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
        >{`${name.split(" ")[0][0]}`}</div>

        {beneinfo.onlineStatus === "online" ? (
          <div className="bg-green-400 h-[13px] w-[13px] -ml-3 rounded-full border-2 border-white" />
        ) : (
          <div className="bg-gray-400 h-[13px] w-[13px] -ml-3 rounded-full border-2 border-white" />
        )}
      </div>
    );
  }

  async function CheckNotification() {
    try {
      const { data: bene, count } = await supabase
        .from("Messaging")
        .select("*", { count: "exact" })
        .match({
          name: beneinfo.beneName,
          contactwith: studName,
          readmessage: "FALSE",
        });

      if (bene) {
        setCounter(count);
        for (let index = 0; index < bene.length; index++) {
          if (
            bene[index].name === beneinfo.beneName &&
            bene[index].readmessage === false &&
            bene[index].contactwith === studName
          ) {
            setNotif(true);
            setLastMess(bene[index]);
            break;
          } else {
            setNotif(false);
          }
        }
      }
    } catch (error) {}
  }

  function handleclickcontact() {
    setGetBeneName(beneinfo.beneName);
    setGetID(beneinfo.id);
    setShowMessage(true);
    getFile(beneinfo.id);
    readmessage();
    setAvatarColor(displayColor);
    setAvatarURL(displayURL);
    setOnlineStatus(beneinfo.onlineStatus);
  }

  const readmessage = async () => {
    try {
      const { data: bene } = await supabase
        .from("Messaging")
        .update({ readmessage: true })
        .match({ name: beneinfo.beneName, contactwith: studName })
        .select();

      CheckNotification();
    } catch (error) {}
  };

  return (
    <>
      {beneinfo.status === "active" && (
        <div>
          <div
            onClick={() => handleclickcontact()}
            className="hover:bg-[#0047ab2d] hover:text-white flex p-1 cursor-pointer hover:p-2 duration-300"
          >
            <div className="w-[100%] flex items-center gap-1">
              {!avatar ? (
                avatarComponent(beneinfo.beneName)
              ) : (
                <div className="flex items-end">
                  <img src={img} className="h-[40px] w-[40px] rounded-full border-2 border-white" />
                  {beneinfo.onlineStatus === "online" ? (
                    <div className="bg-green-400 h-[13px] w-[13px] -ml-3 rounded-full border-2 border-white" />
                  ) : (
                    <div className="bg-gray-400 h-[13px] w-[13px] -ml-3 rounded-full border-2 border-white" />
                  )}
                </div>
              )}
              <div className="grid">
                <p className="text-black text-[13px] font-sans font-semibold">
                  {beneinfo.beneName}
                </p>
                <p className="text-black text-[10px] font-sans font-semibold">
                  {`${
                    beneinfo.position !== "ADVISER"
                      ? `${beneinfo.position}`
                      : `${beneinfo.position} | ${beneinfo.filterby}`
                  }`}
                </p>
              </div>
            </div>
            {notif && (
              <div className=" text-red-600 font-bold flex">
                <AiFillMessage className="text-red-600" />
                <label className="text-[10px]">+{counter}</label>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MessagingConfig;
