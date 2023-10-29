import React from "react";
import { AiOutlineClose } from "react-icons/ai";

function ViewDataPerPerson({ open, close, data }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center ">
      <div className="bg-black bg-opacity-30 backdrop-blur-[1px] h-[650px] w-[800px]  flex justify-center items-center place-content-center">
        <div className="bg-slate-200 h-[600px] w-[700px] rounded-md text-black  shadow-lg shadow-black">
          <div className="flex justify-end  ">
            <button
              onClick={() => close(!open)}
              className="  w-[10%] h-[30px] justify-center items-center flex rounded-tr-md font-bold text-black text-[20px] hover:bg-red-400 bg-red-600 group:"
            >
              <AiOutlineClose className="" />
            </button>
          </div>
          <div className="p-2">
            <h1 className="font-bold pl-1 text-[25px] mt-[2%]">
              Student Information
            </h1>
            <div className="p-2 grid grid-cols-2 gap-y-5 gap-x-1 ">
              <div>
                <label className="font-semibold text-lg">Fullname: </label>
                <label>
                  {data.Firstname} {data.MiddleInitial} {data.Lastname}
                </label>
              </div>
              <div>
                <label className="font-semibold text-lg">Program: </label>
                <label>{data.Program}</label>
              </div>
              <div>
                <label className="font-semibold text-lg">Section: </label>
                <label>{data.Section}</label>
              </div>
              <div>
                <label className="font-semibold text-lg">OJT START: </label>
                <label>{data.ojtStarting}</label>
              </div>
              <div>
                <label className="font-semibold text-lg">OJT END: </label>
                <label>{data.ojtEnd}</label>
              </div>
              <div>
                <label className="font-semibold text-lg">Gmail: </label>
                <label>{data.gmail}</label>
              </div>
              <div>
                <label className="font-semibold text-lg">Remarks: </label>
                <label>{data.remarks}</label>
              </div>
            </div>
            <h1 className="font-bold pl-1 text-[25px] mt-[10%]">
              Company Information
            </h1>
            <div className="p-2 grid grid-cols-2 gap-y-5 ">
              <div>
                <label className="font-semibold text-lg">Company Name: </label>
                <label>{data.companyname}</label>
              </div>
              <div>
                <label className="font-semibold text-lg">
                  Company Address:{" "}
                </label>
                <label>{data.companyaddress}</label>
              </div>
              <div>
                <label className="font-semibold text-lg">
                  Supervisor Name:{" "}
                </label>
                <label>{data.supervisorName}</label>
              </div>
              <div>
                <label className="font-semibold text-lg">Designation: </label>
                <label>{data.designation}</label>
              </div>
              <div>
                <label className="font-semibold text-lg">
                  Supervisor Contact #:{" "}
                </label>
                <label>{data.supervisorContact}</label>
              </div>
              <div>
                <label className="font-semibold text-lg">Office Email: </label>
                <label>{data.officeEmail}</label>
              </div>
              <div>
                <label className="font-semibold text-lg">Office Number: </label>
                <label>{data.officeNumber}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewDataPerPerson;
