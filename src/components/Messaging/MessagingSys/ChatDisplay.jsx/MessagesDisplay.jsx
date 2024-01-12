import React from "react";
import MessageHeader from "./MessageHeader";

export default function MessagesDisplay({
  setOpenFiles_Images,
  openFiles_Images,
  userClicked,
  headerData,
}) {
  return (
    <div className="h-screen w-[100%] bg-slate-400">
      <MessageHeader
        setOpenFiles_Images={setOpenFiles_Images}
        openFiles_Images={openFiles_Images}
        userClicked={userClicked}
        headerData={headerData}
      />
    </div>
  );
}
