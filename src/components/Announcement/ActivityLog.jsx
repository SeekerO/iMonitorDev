import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import ReactPaginate from "react-paginate";
import { TailSpin } from "react-loader-spinner";
function ActivityLog() {
  const [ActivityLog, setActivityLog] = useState([]);
  const [count, setCount] = useState();
  const [filter, setFilter] = useState("");

  const [pageNumber, setPageNumber] = useState(0);
  const userPerPage = 50;
  const pageVisited = pageNumber * userPerPage;
  const pageCount = Math.ceil(count / userPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  useEffect(() => {
    fetchactivitylog();
    supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ActivityLog",
        },
        (payload) => {
          fetchactivitylog();
        }
      )
      .subscribe();
  }, [filter]);

  const fetchactivitylog = async () => {
    const { data, count } = await supabase
      .from("ActivityLog")
      .select("*", { count: "exact" });

    setActivityLog(data);
    setCount(count);
  };

  return (
    <div className="bg-black bg-opacity-20 md:pt-[1%] pt-[7%]  h-screen md:text-base text-[14px] p-5">
      <p className="font-bold text-[30px] font-sans mb-4 mt-4 text-white">
        ACTIVITY LOG
      </p>
      <div className=" h-[75%] w-[100%]  overflow-hidden  grid   shadow-lg shadow-black">
        <div className="bg-slate-300 bg-opacity-60 w-[99.9%] rounded-md  overflow-y-hidden h-[100%] p-5">
          <div className="grid grid-cols-3 mb-3  w-fill bg-slate-300 p-2 rounded-md text-[#4D7C9A]">
            <p className="font-bold ">NAME</p>
            <p className="font-bold ">Button Clicked</p>
            <p className="font-bold ">Time Clicked</p>
          </div>
          {/* test */}
          {ActivityLog ? (
            <>
              <div className="overflow-y-auto overflow-hidden w-[100%] md:h-[80%] h-[82%] ">
                {ActivityLog.sort((a, b) =>
                  a.created_at < b.created_at ? 1 : -1
                )
                  .filter((val) => {
                    try {
                      if (filter === "") {
                        return val;
                      } else if (
                        val.name.toLowerCase().includes(filter.toLowerCase())
                      ) {
                        return val;
                      }
                    } catch (error) {}
                  })
                  .slice(filter ? "" : pageVisited, pageVisited + userPerPage)
                  .map((log) => (
                    <div
                      key={log.id}
                      className="  grid grid-cols-3 mb-3 w-[100%] bg-slate-200 p-2 rounded-md hover:translate-x-4 hover:shadow-md hover:shadow-black duration-100 hover:p-4"
                    >
                      <p className="font-semibold font-sans cursor-default">
                        {log.name}
                      </p>
                      <p className="font-semibold font-sans cursor-default">
                        {log.button}
                      </p>
                      <p className="font-semibold font-sans cursor-default">
                        {log.time}
                      </p>
                    </div>
                  ))}
              </div>
              <div className="mt-[1%] w-[100%] justify-between flex">
                <div className="flex justify-center items-center  gap-2 ">
                  <label>Filter By Name</label>
                  <input
                    onChange={(e) => setFilter(e.target.value)}
                    type="text"
                    className="rounded-md p-1"
                    placeholder="Type Name"
                  ></input>
                </div>
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={pageCount}
                  onPageChange={changePage}
                  containerClassName="flex gap-2 justify-center flex items-center text-white cursor-default"
                  previousLinkClassName="bg-[#274472] p-1 rounded-md flex items-center"
                  nextLinkClassName="bg-[#274472] p-1 rounded-md flex items-center"
                  disabledLinkClassName=" bg-[#274472] p-1 rounded-md"
                  activeLinkClassName=" bg-[#274472] p-1 rounded-md"
                />
              </div>
            </>
          ) : (
            <div className="flex h-[100%] items-center place-content-center">
              <TailSpin
                height="80"
                width="80"
                color="#0074B7"
                ariaLabel="tail-spin-loading"
                radius="0"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivityLog;
