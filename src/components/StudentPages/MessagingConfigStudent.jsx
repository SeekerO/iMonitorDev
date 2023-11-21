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
}) {
  const [lastmess, setLastMess] = useState([]);
  const [notif, setNotif] = useState(false);

  const [img, setImg] = useState();
  const [avatar, setAvatar] = useState(false);
  var displayColor;
  const [displayURL, setDisplayURL] = useState();

  //checker if there are unread messages each name

  useEffect(() => {
    displayAvatar(beneinfo.beneEmail);
  }, []);

  useEffect(() => {
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
      <div
        style={{ background: stringToColor(name) }}
        className={`flex text-white items-center justify-center h-[30px]  w-[30px] rounded-full font-thin`}
      >{`${name.split(" ")[0][0]}`}</div>
      // ${name.split(" ")[1][0]}
    );
  }

  async function CheckNotification() {
    try {
      const { data: bene } = await supabase
        .from("Messaging")
        .select()
        .match({ name: beneinfo.beneName, contactwith: studName });

      if (bene) {
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

  console.log(img);

  return (
    <>
      {beneinfo.status === "active" && (
        <div>
          <div
            onClick={() => handleclickcontact()}
            className="hover:bg-opacity-[60%] bg-blue-900 bg-opacity-[15%] hover:text-white flex p-1 cursor-pointer hover:p-2 duration-300"
          >
            <div className="w-[100%] flex items-center gap-1">
              {!avatar ? (
                avatarComponent(beneinfo.beneName)
              ) : (
                <img src={img} className="h-[30px] w-[30px] rounded-full" />
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
                <FaBell className="text-[10px] -mt-1" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MessagingConfig;
