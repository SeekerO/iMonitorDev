import React, { useState } from "react";
import { Puff } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
const ConfirmTimeOut = ({
  TimeOutConfirmation,
  setTimeOutConfirmation,
  timeout,
}) => {
  const [confirm, setConfirm] = useState(false);

  const confirm_TimeOut = () => {
    setConfirm(true);
    if (timeout()) {
      toast.success("Succesfully TimeOut", {
        position: "top-right",
        autoClose: 1200,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeOutConfirmation(!TimeOutConfirmation);
      setConfirm(false);
    }
  };

  if (!TimeOutConfirmation) return null;
  return (
    <div className="fixed inset-0 h-screen w-screen justify-center items-center flex backdrop-blur-[1px]">
      <div className="h-[200px] w-[400px] bg-slate-300 rounded-md shadow-md shadow-black flex flex-col  items-center justify-center">
        <label className="mb-3 font-semibold">
          Are you sure you want to time out?
        </label>
        {confirm ? (
          <div className="">
            <Puff
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="puff-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          <div className="gap-2 flex">
            <button
              onClick={() => setTimeOutConfirmation(!TimeOutConfirmation)}
              className="TOConfirmButton bg-red-500"
            >
              Cancel
            </button>
            <button
              onClick={() => confirm_TimeOut()}
              className="TOConfirmButton bg-green-500"
            >
              Confirm
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ConfirmTimeOut;
