import React, { useState } from "react";
import ViewImage from "../Monitoring/ViewImage";

function ImageStud({ e, userInfo, ID, name, receivedmessages }) {
  const [url, setUrl] = useState();
  const [view, setView] = useState();

  console.log(userInfo);

  var FILE_NAME;
  const imageRender = (filename) => {
    FILE_NAME = filename;
    return (
      <>
        {receivedmessages.map((mess) => (
          <div>
            {mess.name === userInfo.beneName && filename === mess.message && (
              <img
                onClick={() => url1()}
                className="w-[220px] h-[200px]"
                src={`https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${userInfo.id}_${ID}/${userInfo.id}/${filename}`}
              ></img>
            )}
            {mess.name === name && filename === mess.message && (
              <img
                onClick={() => url2()}
                className="w-[220px] h-[200px] "
                src={`https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${userInfo.id}_${ID}/${ID}/${filename}`}
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
      `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${userInfo.id}_${ID}/${userInfo.id}/${FILE_NAME}`
    );
  }

  function url2() {
    setView(!view);
    setUrl(
      `https://ouraqybsyczzrrlbvenz.supabase.co/storage/v1/object/public/MessageFileUpload/${userInfo.id}_${ID}/${ID}/${FILE_NAME}`
    );
  }
  return (
    <div className=" w-[300px]">
      {imageRender(e.name)}
      <ViewImage imgsrc={url} name={e.name} onClose={setView} visible={view} />
    </div>
  );
}

export default ImageStud;
