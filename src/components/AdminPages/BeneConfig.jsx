import React, { useState } from "react";
import { FaArchive } from "react-icons/fa";
import { MdOutlineBrowserUpdated } from "react-icons/md";
import Update from "./Update";
import Archive from "./Archive";

function BeneConfig({ data, studinfo, beneinfo }) {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openarchive, setOpenArchive] = useState(false);
  return (
    <div
      key={data.id}
      className=" md:grid-cols-7 grid-cols-1 justify-start  grid mb-1 bg-slate-300 rounded-md p-3 w-[100%] cursor-default"
    >
      <Update
        visible={openUpdate}
        data={data}
        close={setOpenUpdate}
        beneinfo={beneinfo}
        studinfo={studinfo}
      />
      <Archive
        visible={openarchive}
        data={data}
        close={setOpenArchive}
        beneinfo={beneinfo}
        studinfo={studinfo}
      />
      <div
        className={`${
          data.status === "active"
            ? "text-green-500 font-semibold"
            : "text-red-500 font-semibold"
        } flex justify-center items-center gap-1`}
      >
        <div
          className={`${
            data.status === "active"
              ? "bg-green-500 font-semibold h-[10px] w-[10px] rounded-full"
              : "bg-red-500 font-semibold h-[10px] w-[10px] rounded-full"
          }`}
        />
        {data.status.toUpperCase()}{" "}
      </div>
      <p> {data.beneName} </p>
      <p className="truncate w-[220px] "> {data.beneEmail} </p>
      <p>{data.filterby}</p>
      <p>{data.position.toLowerCase()}</p>
      <a
        onClick={() => setOpenUpdate(!openUpdate)}
        className="flex items-center gap-2 place-content-center cursor-pointer hover:text-orange-400"
      >
        <MdOutlineBrowserUpdated className="cursor-pointer" /> Update
      </a>
      <a
        onClick={() => setOpenArchive(!openarchive)}
        className="flex items-center gap-2 place-content-center hover:text-blue-600 cursor-pointer"
      >
        <FaArchive /> Archive{" "}
      </a>
    </div>
  );
}

export default BeneConfig;
