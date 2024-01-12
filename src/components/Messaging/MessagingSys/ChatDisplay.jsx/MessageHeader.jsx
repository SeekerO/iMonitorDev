import React from "react";

export default function MessageHeader({
  setOpenFiles_Images,
  openFiles_Images,
  userClicked,
  headerData,
}) {

  console.log(headerData)
  function avatarComponent(name) {
    return (
      <div className="flex items-end">
        <div
          // style={`${headerData?.displayColor}`}
          className={`flex text-white items-center justify-center h-[40px]  w-[40px] rounded-full font-thin border-2 border-white`}
        >{`${name?.toUpperCase().split(" ")[0][0]}`}</div>

        {/* {data.onlineStatus === "online" ? (
          <div className="bg-green-400 h-[13px] w-[13px] -ml-3 rounded-full border-2 border-white" />
        ) : (
          <div className="bg-gray-400 h-[13px] w-[13px] -ml-3 rounded-full border-2 border-white" />
        )} */}
      </div>
    );
  }

  return (
    <div className="h-[50px] w-full bg-blue-950 justify-between flex">
      <div className="flex items-center px-1 gap-1 text-white">
        {headerData?.avatarStatus ? (
          <div className="flex items-end">
            <img
              src={headerData?.imgURL}
              className="h-[40px] w-[40px] rounded-full border-2 border-white"
            />
            {/* {studinfo.onlineStatus === "online" ? (
              <div className="bg-green-400 h-[13px] w-[13px] -ml-3 border-2 border-white rounded-full" />
            ) : (
              <div className="bg-gray-400 h-[13px] w-[13px] -ml-3 border-2 border-white rounded-full " />
            )} */}
          </div>
        ) : (
          avatarComponent(headerData?.name)
        )}

        <label>{headerData?.name}</label>
      </div>
      <div className="flex items-center px-1">
        <a onClick={() => setOpenFiles_Images(!openFiles_Images)}>OpenFiles</a>
      </div>
    </div>
  );
}
