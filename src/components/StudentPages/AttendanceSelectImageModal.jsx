import React, { useEffect, useState, Component } from "react";
import moment from "moment";
import supabase from "../iMonitorDBconfig";
import { ToastContainer, toast } from "react-toastify";
import { BeatLoader } from "react-spinners";

const AttendanceSelectImageModal = ({
  visible,
  attendanceinfo,
  onClose,
  uuid,
}) => {
  const [file, setFile] = useState([]);
  const [uploading, setUploading] = useState(false);

  let IN;

  const [isEmpty, setIsEmpty] = useState(false);
  const [uploadProgress, setUploadProgress] = useState();

  const handleFileInputChange = (event) => {
    try {
      const files = event.target.files;
      const datafile = event.target.files[0];
      if (files.length > 0) {
        setIsEmpty(true);
        setFile(datafile);
      } else {
        setIsEmpty(false);
      }
    } catch (error) {}
  };

  const Run = async () => {
    if (isEmpty === false) {
      toast.warn("No File Detected", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      setUploading(true);
      document.getElementById("xButton").hidden = true;

      const { data } = await supabase.storage
        .from("StudentUploadedImages")
        .upload(attendanceinfo.studemail + "/" + uuid, file);

      toast.success("Successfully Uploaded", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      timein();
    }
  };

  function clear() {
    onClose();
    setFile(null);
  }

  // apply this to onlick IN Button
  function timein() {
    const timeStringIN = moment().format("H:M"); // input string
    const arr = timeStringIN.split(":"); // splitting the string by colon
    const secondsIN = arr[0] * 3600 + arr[1] * 60; // converting //store this in datebase
    IN = secondsIN;
    attendance();
  }

  const attendance = async () => {
    const { data, error } = await supabase
      .from("AttendanceTable")
      .update({ studin: IN })
      .eq("id", attendanceinfo.id);

    if (data) {
      console.log(data);
    }
    if (error) {
      console.log(error);
    }

    setTimeout(() => {
      setUploading(false);
      document.getElementById("xButton").hidden = false;
      onClose();
      window.location.reload();
    }, 900);
  };

  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="bg-[#dddede] h-[25%] mt-10 md:w-[30%] rounded-xl flex flex-col "
        data-aos="zoom-in"
        data-aos-duration="300"
      >
        <button
          id="xButton"
          onClick={() => clear()}
          className="bg-red-600 w-14 rounded-tl-md"
        >
          X
        </button>
        <div className="justify-center items-center flex flex-col mt-3 p-2">
          {uploading ? (
            <div className="mt-[12%] flex-col flex items-center p-4">
              <div className="font-semibold text-blue-500 flex">
                Image is uploading please wait{" "}
              </div>
              <BeatLoader color="#4d9eff" size={10} />
            </div>
          ) : (
            <div className="justify-center items-center flex flex-col">
              <p className="font-semibold text-lg mb-4">
                Upload your image here to verify
              </p>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileInputChange}
              ></input>
              {isEmpty && <p>File selected.</p>}
              <button
                onClick={() => Run()}
                className="w-[80%] rounded-md hover:bg-blue-300 hover:text-slate-900  mt-5 bg-blue-500 text-white font-semibold"
              >
                UPLOAD
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AttendanceSelectImageModal;
