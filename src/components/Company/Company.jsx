import React, { useState, useEffect } from "react";
import supabase from "../iMonitorDBconfig";
import CompanyConfig from "./CompanyConfig";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { BsFileEarmarkPostFill, BsFillFileBarGraphFill } from "react-icons/bs";

import AOS from "aos";
import "aos/dist/aos.css";

import ReactPaginate from "react-paginate";
import Analytics from "./Analytics";

const Company = ({ Data }) => {
  const [fetcherrror, setFetchError] = useState(null);
  const [companyinfos, setStudCompanyInfos] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [count, setCount] = useState(0);

  const [openTable, setOpenTable] = useState(true);

  useEffect(() => {
    fetchcompanyinfo();

    supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "CompanyTable" },
        (payload) => {
          fetchcompanyinfo();
        }
      )
      .subscribe();
    AOS.init({ duration: 1000 });
  }, []);

  const fetchcompanyinfo = async () => {
    const { data, count, error } = await supabase
      .from("CompanyTable")
      .select("*", { count: "exact" });

    if (error) {
      setFetchError("Could not fetch the data please check your internet");
      setStudCompanyInfos(null);
    }

    setCount(count);
    setStudCompanyInfos(data);

    setFetchError(null);
  };

  const [pageNumber, setPageNumber] = useState(0);
  const userPerPage = 20;
  const pageVisited = pageNumber * userPerPage;

  const pageCount = Math.ceil(count / userPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="overflow-hidden h-screen w-[100%] md:p-10 p-2">
      {companyinfos === null ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        ""
      )}
      <div className="h-[100%] overflow-auto">
        <div
          data-aos="fade-up"
          data-aos-duration="500"
          className="md:pt-[0%] pt-[10%]"
        >
          <label className="text-[30px] font-bold text-white">
            COMPANY INFORMATION
          </label>
          {/* Search */}
          <div className="mt-1 w-full flex">
            <button
              onClick={() => setOpenTable(true)}
              className="bg-blue-900 mr-2 p-1 rounded-md text-white flex items-center gap-1"
            >
              <BsFileEarmarkPostFill /> Table
            </button>
            <button
              onClick={() => setOpenTable(false)}
              className="bg-blue-900 p-1 rounded-md text-white flex items-center gap-1"
            >
              <BsFillFileBarGraphFill /> Analytics
            </button>
          </div>
          {openTable ? (
            <div>
              <div
                className="bg-slate-100 w-[100%] mt-5 rounded-full justify-center flex
               text-black"
              >
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
                    value={searchTerm}
                    className="cursor-text w-[100%]  h-[40px] rounded-full border pl-12  focus:pl-16 focus:pr-4"
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="bg-slate-300 rounded mt-2 w-[100%] h-[50px] justify-center items-center text-[20px] flex font-extrabold text-[#41729F] underline">
                <p>COMPANY</p>
              </div>

              <div
                data-aos="fade-up"
                data-aos-duration="500"
                className=" mt-1 md:h-[340px] h-[380px] overflow-y-auto overflow-x-hidden"
              >
                {companyinfos ? (
                  <>
                    {searchTerm ? (
                      <>
                        <div className=" ">
                          {companyinfos
                            .filter((val) => {
                              try {
                                if (searchTerm === "") {
                                  return val;
                                } else if (
                                  val.companyname
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                                ) {
                                  return val;
                                } else if (
                                  val.companyaddress
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase())
                                ) {
                                  return val;
                                }
                              } catch (error) {}
                            })
                            .sort((a, b) =>
                              a.companyOJT < b.companyOJT ? 1 : -1
                            )
                            .map((companyinfos) => (
                              <CompanyConfig
                                key={companyinfos.id}
                                companyinfos={companyinfos}
                              />
                            ))}
                        </div>
                      </>
                    ) : (
                      <div className=" ">
                        {companyinfos
                          .slice(pageVisited, pageVisited + userPerPage)
                          .filter((val) => {
                            try {
                              if (searchTerm === "") {
                                return val;
                              } else if (
                                val.companyname
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                              ) {
                                return val;
                              } else if (
                                val.companyaddress
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                              ) {
                                return val;
                              }
                            } catch (error) {}
                          })
                          .sort((a, b) =>
                            a.companyOJT < b.companyOJT ? 1 : -1
                          )
                          .map((companyinfos) => (
                            <CompanyConfig
                              key={companyinfos.id}
                              companyinfos={companyinfos}
                              Data={Data}
                            />
                          ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div>{fetcherrror}</div>
                )}
              </div>
              <div className="md:mt-[20px] mt-[10px] text-white">
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
                <div className="md:mb-[0%] mb-[30%]" />
              </div>
            </div>
          ) : (
            <Analytics data={companyinfos} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Company;
