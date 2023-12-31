import React from "react";

function HistoryCompConfig({ data, setClickedData, ReactTooltip }) {
  const passData = () => {
    setClickedData({
      companyname: data.companyname,
      companyaddress: data.companyaddress,
      supervisorname: data.supervisorname,
      supervisorcontactnumber: data.supervisorcontactnumber,
      supervisorofficenumber: data.supervisorofficenumber,
      companydesignation: data.companydesignation,
      companyemail: data.companyemail,
      dateLeft: data.dateLeft,
    });
  };

  return (
    <>
      <div
        data-tooltip-id="View"
        onClick={passData}
        className="text-sm grid grid-cols-3 gap-1 hover:bg-[#ffff0048] bg-slate-200 mt-1 p-1 rounded-md  cursor-pointer"
      >
        <label className="cursor-pointer truncate">{data.companyname}</label>
        <label className="cursor-pointer truncate">{data.companyemail}</label>
        <label className="cursor-pointer truncate">{data.companyaddress}</label>{" "}
        <ReactTooltip
          id="View"
          place="bottom-start"
          variant="info"
          content="Click to view"
          className="text-xs font-normal"
        />
      </div>
    </>
  );
}

export default HistoryCompConfig;
