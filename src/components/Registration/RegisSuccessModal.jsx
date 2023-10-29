import React from "react";

export default function RegisSuccessModal({ visible, onClose }) {
  if (!visible) return null;

  function refersh() {
    onClose();
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-white h-[100px] w-[200px] rounded-md text-black" data-aos="zoom-in" data-aos-duration="1000">
        <p className="text-center mt-[10%]">Registry is complete!! </p>
        <div className="flex justify-center mt-[4%]">
          <button
            onClick={refersh}
            className="bg-blue-400 hover:bg-blue-200 font-semibold w-[100px] h-[10] rounded-md"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
