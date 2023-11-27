import React, { useState } from "react";
import HistoryCompConfig from "./HistoryCompConfig";

import { IoMdClose } from "react-icons/io";
import { MdArrowBackIos } from "react-icons/md";
import moment from "moment";
function PrevHistoryComp({ viewPrev, setViewPrev, info, ReactTooltip }) {
  const [clickedData, setClickedData] = useState(false);

  const close = () => {
    setViewPrev(!viewPrev);
    setClickedData(false);
  };
  const dateconverter = (date) => {
    var upDate = moment(new Date(date)).format("LLL");
    return upDate;
  };
  if (!viewPrev) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className={`${
          clickedData ? "h-[280px]" : "h-[300px]"
        } bg-slate-200 w-[600px]  p-2 rounded-md shadow-md shadow-black`}
      >
        <a
          onClick={() => close()}
          className="flex items-center justify-end cursor-pointer hover:text-red-500"
        >
          <IoMdClose />
        </a>
        {info && (
          <div className="grid">
            <label className="text-[20px] flex items-center">
              {clickedData && (
                <MdArrowBackIos
                  onClick={() => setClickedData(false)}
                  className="hover:text-yellow-500 cursor-pointer text-[30px] ml-2"
                />
              )}
              PREVIOUS COMPANY INFORMATION
            </label>
            <div className="bg-yellow-500 w-[99%] h-[1px] mt-2" />
            <div className="h-[200px] overflow-y-auto">
              {!clickedData ? (
                <>
                  <div className="text-[12px] grid grid-cols-3 gap-1 bg-[#5885AF] mt-1 p-1 rounded-md text-slate-100">
                    <label>COMPANY NAME</label>
                    <label>EMAIL</label>
                    <label>ADDRESS</label>
                  </div>
                  {info.map((data, index) => (
                    <HistoryCompConfig
                      data={data}
                      key={index}
                      setClickedData={setClickedData}
                      ReactTooltip={ReactTooltip}
                    />
                  ))}
                </>
              ) : (
                <div className="p-2">
                  <div className="grid grid-cols-2 mt-2 gap-y-4">
                    <label className="font-thin text-base">
                      COMPANY NAME: {clickedData.companyname}
                    </label>
                    <label className="font-thin text-base">
                      COMPANY ADDRESS: {clickedData.companyaddress}
                    </label>
                    <label className="font-thin text-base">
                      COMPANY EMAIL: {clickedData.companyemail}
                    </label>
                    <label className="font-thin text-base">
                      SUPERVISOR NAME: {clickedData.supervisorname}
                    </label>
                    <label className="font-thin text-base">
                      SUPERVISOR CONTACT#: {clickedData.supervisorcontactnumber}
                    </label>
                    <label className="font-thin text-base">
                      SUPERVISOR OFFICE#: {clickedData.supervisorofficenumber}
                    </label>
                    <label className="font-thin text-base">
                      COMPANY DESIGNATION: {clickedData.companydesignation}
                    </label>
                  </div>
                  <label className="font-thin text-sm mt-1 text-red-900">
                    UPDATED ON: {dateconverter(clickedData.dateLeft)}
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrevHistoryComp;
