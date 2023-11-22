import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { FaCamera } from "react-icons/fa";
import { PiCameraRotateFill } from "react-icons/pi";
const FaceDetector = ({ setImage }) => {
  const webcamRef = React.useRef(null);
  const [imageUserHolder, setImageUserHolder] = useState(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setImageUserHolder(imageSrc);
  }, [webcamRef, setImageUserHolder]);

  function reCapture() {
    setImage(false);
    setImageUserHolder(false);
  }

  const [facingMode, setFacingMode] = useState("user"); // 'user' for front camera, 'environment' for back camera

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const isUserOnLaptop = () => {
    const screenWidth = window.screen.width;
    const isLaptop = screenWidth > 768; // Example threshold for screen width indicating a laptop

    return isLaptop;
  };
  return (
    <div>
      {imageUserHolder ? (
        <div>
          <img src={imageUserHolder} alt="Captured selfie" className="md:h-[200px] rounded-md shadow-md shadow-black" />
          <button
            onClick={() => reCapture()}
            className="flex text-center justify-center  items-center gap-1 w-full bg-blue-950 text-white mt-3 p-1 rounded-md "
          >
            <FaCamera className="text-[20px]" />
            Re-Capture
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            mirrored={true} // Adjust mirror effect based on camera view
            videoConstraints={{ facingMode }}
            className="md:h-[200px] rounded-md shadow-md shadow-black"
          />
          <div className="flex gap-5 items-center h-fit w-fit mt-3">
            <button
              onClick={capture}
              className=" rounded-full h-[50px] w-[50px] flex text-center justify-center  items-center gap-1 
             bg-blue-950 text-white mt-2 p-1 "
            >
              <FaCamera className="text-[20px]" />
            </button>
            {isUserOnLaptop() ? (
              ""
            ) : (
              <button
                onClick={switchCamera}
                className=" rounded-full h-[50px] w-[50px] flex text-center justify-center  items-center gap-1 
             bg-blue-800 text-white mt-2 p-1 "
              >
                <PiCameraRotateFill className="text-[20px]" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceDetector;
