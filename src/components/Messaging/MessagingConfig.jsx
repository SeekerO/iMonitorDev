import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import { FaBell } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import Message from "./Message";
function MessagingConfig({
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
}) {
  const [notif, setNotif] = useState();

  //Listener for new messages in supabase

  useEffect(() => {
    CheckNotification();
  }, [run]);

  //Notification Checker
  async function CheckNotification() {
    try {
      const { data: bene } = await supabase
        .from("Messaging")
        .select()
        .match({ name: studinfo.studname, contactwith: beneName });

      if (bene) {
        for (let index = 0; index < bene.length; index++) {
          if (
            bene[index].name === studinfo.studname &&
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
    setGetStudName(studinfo.studname);
    setGetID(studinfo.id);
    setShowMessage(true);
    CheckIfReadMessage();
    getFile(studinfo.id);
    readmessage();
  }

  // Mark the message as read
  const readmessage = async (name) => {
    try {
      const { data: stud } = await supabase
        .from("Messaging")
        .update({ readmessage: true })
        .match({ name: studinfo.studname, contactwith: beneName })
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
        a.contactwith === studinfo.studname &&
        a.readmessage === true
      ) {
        setSeen(false);
      }
    } catch (error) {}
  }

  return (
    <div>
      <div
        onClick={() => handleclickcontact()}
        className="hover:bg-opacity-[60%] hover:shadow-2xl shadow-black bg-blue-900 bg-opacity-[15%] hover:text-white flex p-1 cursor-pointer hover:p-2 duration-300"
      >
        <div className="w-[100%]">
          <p className=" text-[13px] font-sans font-semibold">
            {studinfo.studname}
          </p>
          <p className=" text-[13px] font-sans font-semibold">
            {studinfo.studsection}
          </p>
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
    </div>
  );
}

export default MessagingConfig;
