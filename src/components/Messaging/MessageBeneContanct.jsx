import React, { useState, useEffect } from "react";
import supabase from "../iMonitorDBconfig";
import { FaBell } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";

function MessageBeneContanct({
  studinfo,
  setGetStudName,
  message,
  setShowMessage,
  setSeen,
  beneName,
  setGetID,
  read,
  run,
  getFile,
  setGetEmail,
  setAvatarColor,
  setAvatarURL,
}) {
  const [notif, setNotif] = useState();
  const [img, setImg] = useState();
  const [avatar, setAvatar] = useState(false);
  var displayColor;
  const [displayURL, setDisplayURL] = useState();
  //Listener for new messages in supabase

  useEffect(() => {
    CheckNotification();
    displayAvatar(studinfo.beneEmail);
  }, [run]);

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

  //Notification Checker
  async function CheckNotification() {
    try {
      const { data: bene } = await supabase
        .from("Messaging")
        .select()
        .match({ name: studinfo.beneName, contactwith: beneName });

      if (bene) {
        for (let index = 0; index < bene.length; index++) {
          if (
            bene[index].name === studinfo.beneName &&
            bene[index].readmessage === false &&
            bene[index].contactwith === beneName
          ) {
            setNotif(true);
            return;
          }
          setNotif(false);
        }
      }
    } catch (error) {}
  }

  function handleclickcontact() {
    setGetStudName(studinfo.beneName);
    setGetID(studinfo.id);
    setShowMessage(true);
    CheckIfReadMessage();
    getFile(studinfo.id);
    setGetEmail(studinfo.beneEmail);
    readmessage(studinfo.beneEmail);
    setAvatarColor(displayColor);
    setAvatarURL(displayURL);
  }

  // Mark the message as read
  const readmessage = async (name) => {
    try {
      const { data: stud } = await supabase
        .from("Messaging")
        .update({ readmessage: true })
        .match({ name: studinfo.beneName, contactwith: beneName })
        .select();

      CheckNotification();
    } catch (error) {}
  };

  async function CheckIfReadMessage() {
    try {
      const { data: message1 } = await supabase
        .from("Messaging")
        .select()
        .eq("name", beneName);

      var a = message1[message1.length - 1];
      if (
        a.name === beneName &&
        a.contactwith === studinfo.beneName &&
        a.readmessage === true
      ) {
        setSeen(false);
      }
    } catch (error) {}
  }
  return (
    <div>
      {beneName !== studinfo.beneName && (
        <div
          onClick={() => handleclickcontact()}
          className="hover:bg-opacity-[60%] hover:shadow-2xl shadow-black bg-blue-900 bg-opacity-[15%] hover:text-white flex p-1 cursor-pointer hover:p-2 duration-300"
        >
          <div className="w-[100%] items-center flex gap-2">
            {!avatar ? (
              avatarComponent(studinfo.beneName)
            ) : (
              <img src={img} className="h-[30px] w-[30px] rounded-full" />
            )}
            <div className="grid">
              <p className=" text-[13px] font-sans font-semibold">
                {studinfo.beneName}
              </p>
              <p className=" text-[13px] font-sans font-semibold">
                {studinfo.position}{" "}
                {`${
                  studinfo.filterby !== "ALL" ? `| ${studinfo.filterby}` : ""
                } `}
              </p>
            </div>
          </div>
          <div className="flex">
            {notif && (
              <div className=" text-red-600 font-bold flex">
                <AiFillMessage className="text-red-600" />
                <FaBell className="text-[10px] -mt-1" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageBeneContanct;
