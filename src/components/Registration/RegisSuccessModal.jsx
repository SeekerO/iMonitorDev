import React from "react";
import { tailspin } from "ldrs";
import Check from "../Monitoring/Check.json";
import Lottie from "lottie-react";
tailspin.register();

export default function RegisSuccessModal({ visible, onClose, registring }) {
  if (visible) return null;

  if (!registring) {
    setTimeout(() => {
      onClose(!visible);
      return;
    }, 1300);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div
        className="bg-white h-[150px] w-[220px] rounded-md text-black grid justify-center items-center"
        data-aos="zoom-in"
        data-aos-duration="1000"
      >
        {!registring ? (
          <p className="text-center mt-[10%]">
            <Lottie animationData={Check} className="h-[100px]" />{" "}
          </p>
        ) : (
          <div className="flex items-center justify-center">
            <l-tailspin
              size="70"
              stroke="5"
              speed="0.9"
              color="#145DA0"
            ></l-tailspin>
          </div>
        )}
      </div>
    </div>
  );
}
