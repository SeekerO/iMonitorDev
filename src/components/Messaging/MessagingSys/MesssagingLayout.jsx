import React, { useState, useEffect } from "react";
import Contacts from "./Contacts/Contacts";
import MessagesDisplay from "./ChatDisplay.jsx/MessagesDisplay";
import Files_ImagesDisplay from "./ChatDisplay.jsx/Files_ImagesDisplay";

export default function MesssagingLayout({ user }) {
  const [openFiles_Images, setOpenFiles_Images] = useState(false);
  const [screenSize, setScreenSize] = useState(768);
  const [userClicked, setUserClicked] = useState();
  const [headerData, setHeaderData] = useState();

  useEffect(() => {
    const handleResize = () => {
      if (768 < window.innerWidth) {
        setScreenSize(false);
      } else {
        setScreenSize(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-full flex">
      <Contacts
        user={user}
        setUserClicked={setUserClicked}
        setHeaderData={setHeaderData}
      />
      <MessagesDisplay
        setOpenFiles_Images={setOpenFiles_Images}
        openFiles_Images={openFiles_Images}
        userClicked={userClicked}
        headerData={headerData}
      />
      {openFiles_Images && <Files_ImagesDisplay />}
    </div>
  );
}
