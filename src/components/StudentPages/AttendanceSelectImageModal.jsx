import React, { useEffect, useState, Component } from "react";
import moment from "moment";
import supabase from "../iMonitorDBconfig";
import { ToastContainer, toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import FaceDetector from "./FaceDetector";

const AttendanceSelectImageModal = ({
  visible,
  attendanceinfo,
  onClose,
  uuid,
  setIn,
  companyTime,
}) => {
  const [file, setFile] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState();

  let IN;

  const [isEmpty, setIsEmpty] = useState(false);
  const [uploadProgress, setUploadProgress] = useState();

  const Run = async () => {
    if (image === false) {
      toast.warn("No Image Detected", {
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

      const base64Image = image.split(",")[1]; // Extract base64 data
      const file = base64toFile(image, "selfie.jpg");

      const { data } = await supabase.storage
        .from("StudentUploadedImages")
        .upload(
          attendanceinfo.studemail + "/" + `user_selfies_${Date.now()}.jpg`,
          file,
          {
            cacheControl: "3600",
            contentType: "image/jpeg", // Specify content type
          }
        );
      timein();
    }
  };

  // Function to convert base64 to File object
  const base64toFile = (base64String, filename) => {
    const arr = base64String.split(",");
    if (arr.length < 2) {
      throw new Error("Invalid base64 string format");
    }

    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  function clear() {
    onClose();
    setFile(null);
    setImage(false);
  }

  // apply this to onlick IN Button
  function timein() {
    var momentTime = moment();
    var seconds = momentTime.hours() * 3600 + momentTime.minutes() * 60;

    IN = seconds;
    attendance();
  }

  var currTime = moment().format("hh:mm:ss A");

  const attendance = async () => {
    var status;
    const compTime = moment(companyTime.startingtime, "hh:mm:ss A");
    const compTime1 = moment(currTime, "hh:mm:ss A");

    if (compTime.isAfter(compTime1)) {
      status = "ON TIME";
    } else {
      status = "LATE";
    }

    const { data, error } = await supabase
      .from("AttendanceTable")
      .update({ studin: IN, status: status })
      .eq("id", attendanceinfo.id);

    if (data) {
      setUploading(false);
    }
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
    setIn(true);
    setTimeout(() => {
      setUploading(false);
      document.getElementById("xButton").hidden = false;
      onClose();
      setImage();
      // window.location.reload();
    }, 900);
  };

  if (!visible) return null;
  return (
    <div className="fixed h-screen inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        className="bg-[#dddede]  md:w-[30%] w-[99%] rounded-xl flex flex-col "
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
        <div className=" items-center grid  ">
          {uploading ? (
            <div className=" justify-center flex-col flex items-center p-4">
              <div className="font-semibold text-blue-500 flex">
                Image is uploading please wait{" "}
              </div>
              <BeatLoader color="#4d9eff" size={10} />
            </div>
          ) : (
            <div className="mb-10">
              <p className="font-semibold text-lg mb-4 text-center">
                Upload your image here to time in
              </p>
              <FaceDetector setImage={setImage} Run={Run} />
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
