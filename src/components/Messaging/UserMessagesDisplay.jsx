import React, { useEffect, useState } from "react";
import DateConverter from "./DateConverter";
import profile from "../Messaging/profile.png";
import { BsCheckAll, BsFillFileEarmarkTextFill } from "react-icons/bs";
import ViewImage from "../Monitoring/ViewImage";
import { HiDownload } from "react-icons/hi";
import { saveAs } from "file-saver";

function UserMessagesDisplay({
  message,
  beneName,
  getstudname,
  beneinfo,
  file,
  studID,
  avatarURL,
  isRole,
  receivedmessages,
}) {
  const [seen, setSeen] = useState(false);
  const [imagebroken, setImageBroken] = useState();
  const [userImage, setUserImage] = useState(
    `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${studID}_${beneinfo.id}/${beneinfo.id}/${message.message}`
  );
  const [currentUserImage, setCurrentUserImage] = useState(
    `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${studID}_${beneinfo.id}/${studID}/${message.message}`
  );
  const [viewPicture, setViewPicture] = useState(false);

  useEffect(() => {
    seenChecker();
  }, [message]);

  useEffect(() => {
    if (beneinfo.ROLE !== "BENE") {
      setUserImage(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${beneinfo.id}_${studID}/${beneinfo.id}/${message.message}`
      );
      setCurrentUserImage(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${beneinfo.id}_${studID}/${studID}/${message.message}`
      );
    }
  }, [beneinfo]);

  function seenChecker() {
    if (
      message.name === beneName &&
      message.contactwith === getstudname &&
      message.readmessage === true
    ) {
      setSeen(true);
    }
  }

  function handleUser(Name) {
    try {
      for (let index = 0; index < file.length; index++) {
        if (file[index].name === message.message) {
          if (beneinfo.ROLE === "BENE") {
            if (Name === "Current") {
              FileReaderUser();
            } else {
              FileReaderCurrentUser();
            }
          } else {
            if (Name === "Current") {
              FileReaderUserSTUD();
            } else {
              FileReaderCurrentUserSTUD();
            }
          }
        }
      }
    } catch (error) {}
  }

  function FileReaderUser() {
    try {
      saveAs(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${studID}_${beneinfo.id}/${beneinfo.id}/${message.message}`,
        message.message
      );
    } catch (error) {}
  }

  function FileReaderCurrentUser() {
    try {
      saveAs(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${studID}_${beneinfo.id}/${studID}/${message.message}`,
        message.message
      );
    } catch (error) {}
  }

  function FileReaderUserSTUD() {
    try {
      saveAs(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${beneinfo.id}_${studID}/${beneinfo.id}/${message.message}`,
        message.message
      );
    } catch (error) {}
  }

  function FileReaderCurrentUserSTUD() {
    try {
      saveAs(
        `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${beneinfo.id}_${studID}/${studID}/${message.message}`,
        message.message
      );
    } catch (error) {}
  }

  function brokenimage() {
    setImageBroken(message.message);
  }

  const messageSorter = () => {
    try {
      const fileExtenstion = message.message.split(".").pop().toLowerCase();
      const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp"];
      const documentExtenstions = ["docx", "pdf", "ods", "pptx", "xlsx"];

      if (imageExtensions.includes(fileExtenstion)) {
        return (
          // Image returned if src is true else returns as message
          <div className="flex flex-col justify-center max-w-[300px] max-h-[300px] bg-white p-2 ml-2 rounded-md">
            <div className="text-right break-words ">
              <div className="text-right grid ">
                {message.name === getstudname &&
                message.contactwith === beneName ? (
                  <div className="flex gap-2 items-center">
                    {imagebroken ? (
                      <div className="cursor-default"> {imagebroken}</div>
                    ) : (
                      <>
                        <img
                          onClick={() => setViewPicture(!viewPicture)}
                          className="max-w-[240px] max-h-[250px] min-h-[150px] min-w-[180px]"
                          onError={brokenimage}
                          src={currentUserImage}
                        ></img>
                        <ViewImage
                          name={message.message}
                          imgsrc={currentUserImage}
                          visible={viewPicture}
                          onClose={setViewPicture}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    {imagebroken ? (
                      <div className="cursor-default">{imagebroken}</div>
                    ) : (
                      <>
                        <img
                          onClick={() => setViewPicture(!viewPicture)}
                          className="max-w-[240px] max-h-[250px] min-h-[150px] min-w-[180px]"
                          onError={brokenimage}
                          src={userImage || currentUserImage}
                        ></img>
                        <ViewImage
                          name={message.message}
                          imgsrc={userImage}
                          visible={viewPicture}
                          onClose={setViewPicture}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      } else if (documentExtenstions.includes(fileExtenstion)) {
        return (
          // File is returned
          <div className="flex flex-col justify-center max-w-[300px] h-auto bg-blue-900 text-white font-semibold  p-3 ml-2 rounded-md ">
            <div className="text-right break-words  flex items-center gap-2 ">
              <BsFillFileEarmarkTextFill className="text-[20px] " />
              {message.name === getstudname &&
              message.contactwith === beneName ? (
                <div
                  onClick={() => handleUser("User")}
                  className="text-left  w-[100%] hover:underline cursor-pointer"
                >
                  {message.message}
                </div>
              ) : (
                <div
                  onClick={() => handleUser("Current")}
                  className="text-right w-[100%] hover:underline cursor-pointer"
                >
                  {message.message}
                </div>
              )}
            </div>
          </div>
        );
      } else {
        // if fileExtenstion doesnt includes imageExtensions and documentExtenstions returns text message
        return (
          <div className="flex flex-col justify-center max-w-[300px] h-auto bg-white p-2 ml-2 rounded-md cursor-default">
            <div className="text-right break-words cursor-default ">
              <div
                onClick={() => handleUser("Current")}
                className="text-right cursor-default"
              >
                {message.message}
              </div>
            </div>
          </div>
        );
      }
    } catch (error) {}
  };

  return (
    <>
      {message && (
        <div>
          {message.name === getstudname && message.contactwith === beneName && (
            <div className=" mb-2 flex place-content-start ">
              <div className="flex flex-col">
                <div className=" h-auto  flex">
                  {avatarURL ? (
                    <img
                      src={avatarURL}
                      className="  h-[40px] justify-center rounded-full"
                    />
                  ) : (
                    <img
                      src={profile}
                      className="  h-[40px] justify-center rounded-full"
                    />
                  )}

                  {messageSorter()}
                </div>

                <div className="text-right text-[9px] flex pt-1 ml-10 cursor-default">
                  <DateConverter date={message.created_at} />
                  {seen && (
                    <BsCheckAll className="text-[15px] ml-1 text-green-600" />
                  )}
                </div>
              </div>
            </div>
          )}

          {message && (
            <div>
              {message.name === beneName &&
                message.contactwith === getstudname && (
                  <>
                    <div className=" mb-2 flex place-content-end">
                      <div className="flex flex-col">
                        <div className=" flex place-content-end">
                          {messageSorter()}
                        </div>

                        <div className="place-content-end text-[9px] flex pt-1  cursor-default">
                          <DateConverter date={message.created_at} />
                          {seen && (
                            <BsCheckAll className="text-[15px] ml-1 text-green-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
            </div>
          )}

          {!message && "Something's wrong with the connection"}
        </div>
      )}
    </>
  );
}

export default UserMessagesDisplay;
