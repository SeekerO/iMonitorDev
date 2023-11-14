import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ViewProfileMasterModal from "./ViewProfileMasterModal";
import AOS from "aos";
import "aos/dist/aos.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
const MasterListTableConfig = ({ studinfos, sy, course }) => {
  // AOS ANIMATION
  useEffect(() => {
    AOS.init();
  }, [sy]);

  const [showmodalprofile, setShowModalProfile] = useState(false);

  const [DateHolderSY, SetDateHolderSY] = useState();
  const [StudCreateDate, SetStudCreateDate] = useState();

  return (
    <>
      <div className="grid grid-cols bg-slate-200 rounded-md mt-[0.5%] hover:p-1 hover:translate-x-2 duration-100 hover:shadow-lg ">
        <div className={`${studinfos.studSY !== sy && "hidden"} `}>
          <div className="md:h-[50px] h-[70px]  text-black flex p-4 font-medium rounded items-center">
            <div
              className=" md:w-[30%] w-[32%] hover:underline hover:text-blue-600 hover:before:opacity-100 
            hover:cursor-pointer md:text-[16px] text-[10px]"
              onClick={() => setShowModalProfile(true)}
            >
              <a data-tooltip-id="View"> {studinfos.studname}</a>
            </div>
            <div className="w-[46%] ml-[15%]  md:text-[16px] text-[10px]">
              {studinfos.studsection}
            </div>

            <div className="grid md:grid-cols-2  w-[25%] md:mr-5 mr-2">
              <p className="md:text-[16px] text-[10px] text-center">
                {studinfos.studprogress}hrs/
                {studinfos.studmaxprogress}hrs
              </p>

              <div className=" w-[100%] bg-gray-400 rounded-md md:h-6 h-5  rounded-r text-center">
                <div
                  className={`${
                    studinfos.status === "complete"
                      ? "bg-green-500"
                      : "bg-gray-500"
                  } rounded-l rounded-r md:h-6 h-5 md:text-[16px] text-[10px]  md:pt-[0%] pt-[3%]`}
                  style={{
                    width: `${100}%`,
                  }}
                >
                  {studinfos.status == "complete" ? "COMPLETE" : "INCOMPLETE"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReactTooltip
        id="View"
        place="right"
        variant="info"
        content="View Profile"
      />
      <ViewProfileMasterModal
        onClose={setShowModalProfile}
        visible={showmodalprofile}
        studinfos={studinfos}
        studname={studinfos.studname}
        studemail={studinfos.studemail}
      />
    </>
  );
};

export default MasterListTableConfig;
