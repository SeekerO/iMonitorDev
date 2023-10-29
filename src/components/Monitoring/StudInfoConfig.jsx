import { Link } from "react-router-dom";
import supabase from "../iMonitorDBconfig";
import ArchiveModal from "./ArchiveModal";
import ViewProfileModal from "./ViewProfileModal";
import { useState, useEffect } from "react";
import moment from "moment";
import AOS from "aos";
import "aos/dist/aos.css";

const StudInfoConfig = ({ studinfos, BeneData, course, sy, handleCheck }) => {
  // AOS ANIMATION
  useEffect(() => {
    DateCreated();

    AOS.init({ duration: 1000 });
  }, [sy]);

  const [showmodalarchive, setShowModalArchive] = useState(false);
  const handleclosemodalarchive = () => setShowModalArchive(false);

  const [showmodalprofile, setShowModalProfile] = useState(false);
  const handleclosemodalprofile = () => setShowModalProfile(false);

  const [DateHolderSY, SetDateHolderSY] = useState("2023");
  const [StudCreateDate, SetStudCreateDate] = useState();

  function DateCreated() {
    if (sy === "S.Y. 2023-2024") {
      SetDateHolderSY(2023);
      SetStudCreateDate(new Date(studinfos.created_at).getFullYear());
    }
    if (sy === "S.Y. 2024-2025") {
      SetDateHolderSY(2025);
      SetStudCreateDate(new Date(studinfos.created_at).getFullYear());
    }
    if (sy === "S.Y. 2025-2026") {
      SetDateHolderSY(2026);
      SetStudCreateDate(new Date(studinfos.created_at).getFullYear());
    }
    if (sy === "S.Y. 2026-2027") {
      SetDateHolderSY(2027);
      SetStudCreateDate(new Date(studinfos.created_at).getFullYear());
    }
    if (sy === "S.Y. 2027-2028") {
      SetDateHolderSY(2028);
      SetStudCreateDate(new Date(studinfos.created_at).getFullYear());
    }
  }

  return (
    <>
      <div className={``}>
        <div className={`${studinfos.studSY !== sy && "hidden"}`}>
          <div
            className="bg-slate-200 text-black flex font-medium rounded mt-1.5 
            hover:shadow-sm hover:shadow-black duration-300 p-2 hover:p-3"
          >
            <div
              data-tip="View Information"
              className=" pl-[2%] w-[29%] hover:underline hover:text-blue-600  
            md:text-[16px] text-[10px]
            before:content-[attr(data-tip)]
            before:absolute
            before:p-1
            before:mt-1
            before:text-[12px]
            before:-translate-x-[40px] before:-translate-y-full
            before:bg-gray-400 before:text-white
            before:rounded-sm before:opacity-0
            before:transition-all
            hover:before:opacity-100 
            hover:cursor-pointer
          "
              onClick={() => setShowModalProfile(true)}
            >
              {/* <input
                type="checkbox"
                value={`${[studinfos]}`}
                onChange={handleCheck}
              ></input> */}
              <p className="">{studinfos.studname}</p>
            </div>
            <div className="w-[46%] pl-[10%] md:text-[16px] text-[10px] cursor-default">
              {studinfos.studsection}
            </div>
            <div className="md:h-6 h-8 w-[20%] bg-[#4d8092a7] mr-6 rounded-md  md:mt-1.5 mt-0 cursor-default">
              <div
                className="md:h-6 h-8 bg-[#78D0F4]  rounded-l rounded-r "
                style={{
                  width: `${
                    (studinfos.studprogress / studinfos.studmaxprogress) * 100
                  }%`,
                }}
              >
                <div
                  className={`${
                    studinfos.studprogress > 0
                      ? "md:pl-[60px] pl-[4px] md:pt-0 pt-2.5"
                      : "md:pl-[70px] pl-[10px] md:pt-0 pt-2.5"
                  } whitespace-nowrap z-0 md:text-[15px] text-[9px] font-mono   font-semibold mr-3 `}
                >
                  {studinfos.studprogress}hrs/
                  {studinfos.studmaxprogress}hrs
                </div>
              </div>
            </div>
            <div
              id="menu"
              data-tip="Archive"
              className="
            pt-1
            before:content-[attr(data-tip)]
            before:absolute
            before:left/12 before: top-3
            before:w-max before:max-w-xs
            before:-translate-x-1/2 before:-translate-y-full
            before:bg-gray-400 before:text-white
            before:rounded-sm before:opacity-0
            before:transition-all
            before:p-0.5
            hover:before:opacity-100 

          "
            >
              <button
                className="bg-slate-200 hover:cursor-pointer"
                onClick={() => setShowModalArchive(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 fill-current hover:text-blue-400"
                  viewBox="0 0 512 512"
                >
                  <path d="M32 32H480c17.7 0 32 14.3 32 32V96c0 17.7-14.3 32-32 32H32C14.3 128 0 113.7 0 96V64C0 46.3 14.3 32 32 32zm0 128H480V416c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V160zm128 80c0 8.8 7.2 16 16 16H336c8.8 0 16-7.2 16-16s-7.2-16-16-16H176c-8.8 0-16 7.2-16 16z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <ArchiveModal
          studinfos={studinfos}
          onClose={handleclosemodalarchive}
          visible={showmodalarchive}
        />

        <ViewProfileModal
          beneData={BeneData}
          onClose={handleclosemodalprofile}
          visible={showmodalprofile}
          studinfos={studinfos}
          studemail={studinfos.studemail}
        />
      </div>
    </>
  );
};

export default StudInfoConfig;
