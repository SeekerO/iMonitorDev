import React from "react";
import { IoMdClose } from "react-icons/io";
function Confirm({ update, confirm, setDateLeft, dateLeft, disablePastDate }) {
  if (!confirm) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-slate-100 h-[200px]  w-[500px]  items-end flex flex-col">
        <a onClick={() => update(false)}>
          <IoMdClose className="text-[30px]" />
        </a>
        <div className="flex h-[100%] w-[100%] flex-col items-center p-1">
          <label className="w-[340px] text-center mb-3 text-blue-500 font-semibold">
            NOTE: To confirm on chaging the company kindly enter the date when
            the student left.
          </label>
          <div className="flex gap-1 items-center mb-2">
            Enter Date:
            <input
              min={disablePastDate()}
              onChange={(e) => setDateLeft(e.target.value)}
              type="date"
              className="p-1 bg-slate-300 rounded-md w-[200px]"
            />
          </div>
          {dateLeft && (
            <a
              onClick={() => update(true)}
              className="bg-[#145DA0] text-white p-2 rounded-md w-[100px]"
            >
              Confirm
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Confirm;
