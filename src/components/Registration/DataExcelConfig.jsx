import React, { useState } from "react";
import ViewDataPerPerson from "./ViewDataPerPerson";

function DataExcelConfig({ data }) {
  const [viewprofile, setViewProfile] = useState(false);

  return (
    <>
      <div
        onClick={() => setViewProfile(!viewprofile)}
        key={data.gmail}
        className="grid grid-cols-6 p-1 hover:bg-[#377abe60] cursor-pointer"
      >
     
        <label className="cursor-pointer"> {data.Firstname}</label>
        <label className="cursor-pointer">{data.MiddleInitial}</label>
        <label className="cursor-pointer">{data.Lastname}</label>
        <label className="cursor-pointer">{data.Suffix}</label>
        <label className="cursor-pointer">{data.Program}</label>
        <label className="cursor-pointer">{data.Section}</label>
      </div>
      <ViewDataPerPerson
        open={viewprofile}
        close={setViewProfile}
        data={data}
      />
    </>
  );
}

export default DataExcelConfig;
