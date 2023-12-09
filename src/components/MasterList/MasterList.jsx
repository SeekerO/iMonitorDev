import React, { useState, useEffect } from "react";
import supabase from "../iMonitorDBconfig";
import MasterListTableConfig from "./MasterListTableConfig";

import AOS from "aos";
import "aos/dist/aos.css";
import { BiFilterAlt } from "react-icons/bi";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import ReactPaginate from "react-paginate";
import PrintModal from "./PrintModal";
import moment from "moment";
import { MdLocalPrintshop } from "react-icons/md";

const MasterList = ({ Data }) => {
  // AOS ANIMATION
  useEffect(() => {
    AOS.init();
  }, []);

  const [fetcherrror, setFetchError] = useState(null);
  const [studinfos, setStudInfos] = useState(null);
  const [count, setCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [course, setCourse] = useState("ALL");
  const [sy, setSY] = useState();

  const [openPrint, setOpenPrint] = useState(false);
  useEffect(() => {
    const filterYear = () => {
      // var curryear = moment().weekYear();
      var curryear = moment().year();
      var nextyear = curryear + 1;

      setSY("S.Y. " + curryear + "-" + nextyear);
    };
    filterYear();
  }, [Data]);

  useEffect(() => {
    fetchstudinfo();

    const channels = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "MasterListTable1" },
        (payload) => {
          fetchstudinfo();
        }
      )
      .subscribe();
  }, [Data, course, sy]);

  const fetchstudinfo = async () => {
    try {
      if (Data.filterby === "ALL") {
        if (course === "ALL") {
          const {
            data: filter,
            count,
            error,
          } = await supabase
            .from("MasterListTable1")
            .select("*", { count: "exact" })
            .match({ studSY: sy });

          setCount(count);
          setStudInfos(filter);

          if (error) setFetchError("Please check your connection..");
        } else {
          const {
            data: filter,
            count,
            error,
          } = await supabase
            .from("MasterListTable1")
            .select("*", { count: "exact" })
            .match({ filterby: course, studSY: sy });

          setCount(count);
          setStudInfos(filter);

          if (error) setFetchError("Please check your connection..");
        }
      } else {
        const {
          data: filter,
          count,
          error,
        } = await supabase
          .from("MasterListTable1")
          .select("*", { count: "exact" })
          .match({ filterby: Data.filterby, studSY: sy });

        setCount(count);
        setStudInfos(filter);

        if (error) setFetchError("Please check your connection..");
      }
    } catch (error) {}
  };

  const [pageNumber, setPageNumber] = useState(0);
  const userPerPage = 20;
  const pageVisited = pageNumber * userPerPage;

  const pageCount = Math.ceil(count / userPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div id="monitoring" className="overflow-hidden md:p-10 p-2">
      <div
        className=" text-white md:pt-[2%] pt-[10%] w-[100%] h-screen"
        data-aos="fade-up"
        data-aos-duration="300"
      >
        <header className="font-bold text-4xl mb-2">MASTER LIST</header>

        <div className="flex gap-4 max-h-[50px]">
          <div
            className={`${
              Data.filterby === "ALL"
                ? "flex max-h-[50px] items-center rounded-md bg-[#5885AF] "
                : "hidden"
            }`}
          >
            <BiFilterAlt className="text-[20px]" />
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className={` h-[25px] rounded-md bg-[#5885AF] outline-none `}
            >
              <option>ALL</option>
              <option>BSIT</option>
              <option>BSAIS</option>
              <option>BSTM</option>
              <option>BSHM</option>
              <option>BSCPE</option>
              <option>BSCS</option>
            </select>
          </div>
          <div className="flex max-h-[50px] items-center rounded-md bg-[#5885AF] ">
            <BiFilterAlt className="text-[20px]" />
            {sy && (
              <select
                defaultValue={sy}
                onChange={(e) => setSY(e.target.value)}
                className=" h-[25px] md:text-base text-sm rounded-md bg-[#5885AF] overflow-auto outline-none "
              >
                <option value={"S.Y. 2023-2024"} className="text-[15px]">
                  S.Y. 2023-2024
                </option>
                <option value={"S.Y. 2024-2025"} className="text-[15px]">
                  S.Y. 2024-2025
                </option>
                <option value={"S.Y. 2025-2026"} className="text-[15px]">
                  S.Y. 2025-2026
                </option>
                <option value={"S.Y. 2026-2027"} className="text-[15px]">
                  S.Y. 2026-2027
                </option>
                <option value={"S.Y. 2027-2028"} className="text-[15px]">
                  S.Y. 2027-2028
                </option>
              </select>
            )}
          </div>

          <button
            onClick={() => setOpenPrint(!openPrint)}
            className="h-[26px] rounded-md hover:bg-[#449256] bg-[#58af6f] px-5 flex gap-1 items-center"
          >
            <MdLocalPrintshop /> PRINT
          </button>
        </div>

        {studinfos === null ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : (
          ""
        )}

        <div className="bg-white w-[100%] mt-4 rounded-full text-black">
          <div id="searchbar" className="flex w-[100%] ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="h-[18px] w-10 mt-2.5 ml-2"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </svg>
            <input
              type="search"
              placeholder="Search"
              className="cursor-text w-[100%]  h-[40px] rounded-full border pl-12     focus:pl-16 focus:pr-4"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>
        </div>

        <main className="md:h-[47%] h-[55%] mt-[1%] w-[100%]">
          <div className="bg-slate-300  rounded w-[100%] flex font-extrabold text-[#41729F]">
            <div className="flex w-full h-[50px] items-center ">
              <label className=" text-center   md:pr-[27%] pr-[20%] md:ml-5 ml-2 md:text-[16px] text-[9px] ">
                STUDENT NAME
              </label>
              <label className=" text-center   md:pr-[41%] pr-[29%] md:text-[16px] text-[9px]  ">
                SECTION
              </label>

              <label className=" text-cr0px]   md:text-[16px] text-[9px]  ">
                DURATION
              </label>
            </div>
          </div>
          {/* STUD INFO */}
          {fetcherrror && <p>{fetcherrror}</p>}

          {studinfos && (
            <>
              {studinfos.length > 0 ? (
                <>
                  <div className="overflow-auto overflow-x-hidden h-[85%]">
                    {studinfos
                      .sort((a, b) => (a.status < b.status ? -1 : 1))
                      .filter((val) => {
                        try {
                          if (searchTerm === "") {
                            return val;
                          } else if (
                            val.studname
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          ) {
                            return val;
                          } else if (
                            val.studsection
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          ) {
                            return val;
                          }
                        } catch (error) {}
                      })
                      .slice(pageVisited, pageVisited + userPerPage)
                      .map((studinfo) => (
                        <MasterListTableConfig
                          key={studinfo.id}
                          studinfos={studinfo}
                          sy={sy}
                          course={course}
                        />
                      ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center place-content-center md:h-[90%] h-[80%]  ">
                  <label className="font-bold text-[30px]">No Data</label>
                </div>
              )}
            </>
          )}
        </main>
        <div className="mt-[20px]">
          {studinfos && studinfos.length > 0 && (
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName="flex gap-2 justify-center flex items-center"
              previousLinkClassName="bg-[#5885AF] p-1 rounded-md flex items-center"
              nextLinkClassName="bg-[#5885AF] p-1 rounded-md flex items-center"
              disabledLinkClassName="bg-[#5885AF] p-1 rounded-md"
              activeLinkClassName="bg-[#5885AF] p-1 rounded-md"
            />
          )}
        </div>
      </div>
      <PrintModal
        openPrint={openPrint}
        setOpenPrint={setOpenPrint}
        Data={Data}
      />
    </div>
  );
};

export default MasterList;
