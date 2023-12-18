import React, { useState } from "react";
import ViewImage from "../Monitoring/ViewImage";

function Image({ e, userInfo, ID, name, receivedmessages, allbeneinfo }) {
  const [url, setUrl] = useState();
  const [view, setView] = useState();
  console.log(receivedmessages);
  var FILE_NAME;
  const imageRender = (filename) => {
    FILE_NAME = filename;
    return (
      <>
        {receivedmessages.map((mess, index) => (
          <div key={index}>
            {mess.name === userInfo.beneName && filename === mess.message && (
              <img
                onClick={() => url1()}
                className="w-[240px] h-[200px]"
                src={`https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${ID}_${userInfo.id}/${userInfo.id}/${filename}`}
              ></img>
            )}
            {mess.name === name && filename === mess.message && (
              <img
                onClick={() => url2()}
                className="w-[240px] h-[200px] bg-gray-500"
                src={`https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${ID}_${userInfo.id}/${ID}/${filename}`}
              ></img>
            )}
            {mess.name === userInfo.beneName && filename === mess.message && (
              <img
                onClick={() => url3()}
                className="w-[240px] h-[200px]"
                src={`https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${userInfo.id}_${ID}/${ID}/${filename}`}
                // https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/108_121/121/56209992.EasterEgg.png
              ></img>
            )}
          </div>
        ))}
      </>
    );
  };

  function url1() {
    setView(!view);
    setUrl(
      `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${ID}_${userInfo.id}/${userInfo.id}/${FILE_NAME}`
    );
  }

  function url2() {
    setView(!view);
    setUrl(
      `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${ID}_${userInfo.id}/${ID}/${FILE_NAME}`
    );
  }

  function url3() {
    setView(!view);
    setUrl(
      `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${ID}_${userInfo.id}/${ID}/${FILE_NAME}`
    );
  }

  return (
    <div className="">
      <div>{imageRender(e.name)}</div>
      <ViewImage imgsrc={url} name={e.name} onClose={setView} visible={view} />
    </div>
  );
}

export default Image;
