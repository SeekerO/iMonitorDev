import React, { useState } from "react";
import BeneConfig from "./BeneConfig";

function ModalAccounts({ visible, beneinfo, studinfo, setViewAccounts }) {
  if (!visible) return null;
  return (
    <>
    {beneinfo ?     <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4 ">
        <div
          className="bg-white h-[500px] w-[1200px] rounded-md shadow-lg shadow-black"
          data-aos="zoom-in"
          data-aos-duration="500"
        >
          <div className="text-black h-[100%] text-center p-4">
            <div className="h-[90%] overflow-y-auto">
              <div className=" grid-cols-1 md:grid-cols-7 justify-start  grid mb-1 bg-blue-900 bg-opacity-[60%] rounded-md p-3 w-[100%] font-bold">
                <p> Status </p>
                <p> Name </p>
                <p> Email </p>
                <p> Program </p>
                <p> Position </p>
                <p> Update </p>
                <p> Archive </p>
              </div>
              {beneinfo
                .sort((a, b) => (a.status < b.status ? -1 : 1))
                .map((data) => (
                  <BeneConfig
                    data={data}
                    key={data.id}
                    studinfo={studinfo}
                    beneinfo={beneinfo}
                  />
                ))}
            </div>

            <button
              className="mt-2 hover:text-red-500 hover:underline text-[20px]"
              onClick={() => setViewAccounts(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div> : <div>Something Wrong with the connection</div>}
  
    </>
  );
}

export default ModalAccounts;
