import React, { useEffect, useRef, useState } from "react";
import supabase from "../iMonitorDBconfig";
import { IoMdClose } from "react-icons/io";
import { BiFilterAlt } from "react-icons/bi";
import { FaPrint, FaCheckToSlot } from "react-icons/fa6";
import ReactToPrint from "react-to-print";
import PdfLayoutMasterList from "./PdfLayoutMasterList";

import { FaDownload } from "react-icons/fa";

function PrintModal({ openPrint, setOpenPrint, Data, saveAsPDF }) {
  const [course, setCourse] = useState("ALL");
  const [sy, setSY] = useState("S.Y. 2023-2024");
  const [status, setStatus] = useState("STATUS");
  const [data, setData] = useState([]);
  const [count, setCount] = useState();
  const layout = useRef();

  useEffect(() => {
    if (Data.position !== "ADVISER") {
      const fetch = async () => {
        const { data: masterlist, count } = await supabase
          .from("MasterListTable1")
          .select("*", { count: "exact" });

        setData(masterlist);
        setCount(count);
      };
      fetch();
      return;
    } else {
      const fetch = async () => {
        const { data: masterlist, count } = await supabase
          .from("MasterListTable1")
          .select("*", { count: "exact" })
          .eq("filterby", Data.filterby);

        setData(masterlist);
        setCount(count);
      };
      fetch();
      return;
    }
  }, [openPrint]);

  async function getToPrint(course1, sy1, status1) {
    setCourse(course1);
    setSY(sy1);
    setStatus(status1);

    var defCourse = "ALL";
    var defSY = "S.Y. 2023-2024";

    if (Data.position !== "ADVISER") {
      if (course1 === defCourse && sy1 === defSY) {
        const fetch = async () => {
          if (status1.toLowerCase() === "status") {
            const { data: masterlist, count } = await supabase
              .from("MasterListTable1")
              .select("*", { count: "exact" });

            setData(masterlist);
            setCount(count);
          } else if (status1.toLowerCase() !== "status") {
            const { data: masterlist, count } = await supabase
              .from("MasterListTable1")
              .select("*", { count: "exact" })
              .eq("status", status1.toLowerCase());

            setData(masterlist);
            setCount(count);
          }
        };
        fetch();
        return;
      } else if (course1 !== defCourse && sy1 === defSY) {
        const fetch = async () => {
          if (status1.toLowerCase() === "status") {
            const { data: masterlist, count } = await supabase
              .from("MasterListTable1")
              .select("*", { count: "exact" })
              .match({ filterby: course1 });

            setData(masterlist);
            setCount(count);
          } else {
            const { data: masterlist, count } = await supabase
              .from("MasterListTable1")
              .select("*", { count: "exact" })
              .match({ filterby: course1, status: status1.toLowerCase() });

            setData(masterlist);
            setCount(count);
          }
        };

        fetch();
        return;
      } else if (course1 === defCourse && sy1 !== defSY) {
        const fetch = async () => {
          if (status1.toLowerCase() === "status") {
            const { data: masterlist, count } = await supabase
              .from("MasterListTable1")
              .select("*", { count: "exact" })
              .match({ studSY: sy1 });

            setData(masterlist);
            setCount(count);
          } else {
            const { data: masterlist, count } = await supabase
              .from("MasterListTable1")
              .select("*", { count: "exact" })
              .match({ studSY: sy1, status: status1.toLowerCase() });

            setData(masterlist);
            setCount(count);
          }
        };
        fetch();
        return;
      } else if (course1 !== defCourse && sy1 !== defSY) {
        const fetch = async () => {
          if (status1.toLowerCase() === "status") {
            const { data: masterlist, count } = await supabase
              .from("MasterListTable1")
              .select("*", { count: "exact" })
              .match({
                filterby: course1,
                studSY: sy1,
              });

            setData(masterlist);
            setCount(count);
          } else {
            const { data: masterlist, count } = await supabase
              .from("MasterListTable1")
              .select("*", { count: "exact" })
              .match({
                filterby: course1,
                studSY: sy1,
                status: status1.toLowerCase(),
              });

            setData(masterlist);
            setCount(count);
          }
        };
        fetch();
        return;
      }
    } else {
      if (sy1 === defSY) {
        const fetch = async () => {
          if (status1.toLowerCase() === "status") {
            const { data: masterlist, count } = await supabase
              .from("MasterListTable1")
              .select("*", { count: "exact" })
              .match({ filterby: Data.filterby });

            setData(masterlist);
            setCount(count);
            return;
          } else if (status1.toLowerCase() !== "status") {
            const { data: masterlist, count } = await supabase
              .from("MasterListTable1")
              .select("*", { count: "exact" })
              .match({
                filterby: Data.filterby,
                status: status1.toLowerCase(),
              });

            setData(masterlist);
            setCount(count);
            return;
          }
        };
        fetch();
        return;
      } else if (sy1 !== defSY) {
        const fetch = async () => {
          if (status1.toLowerCase() === "status") {
            const { data: masterlist, count } = await supabase
              .from("MasterListTable1")
              .select("*", { count: "exact" })
              .match({ filterby: Data.filterby, studSY: sy1 });

            setData(masterlist);
            setCount(count);
            return;
          } else {
            const { data: masterlist, count } = await supabase
              .from("MasterListTable1")
              .select("*", { count: "exact" })
              .match({
                filterby: Data.filterby,
                studSY: sy1,
                status: status1.toLowerCase(),
              });

            setData(masterlist);
            setCount(count);
            return;
          }
        };
        fetch();
        return;
      }
    }
  }

  function close() {
    setCourse("ALL");
    setSY("S.Y. 2023-2024");
    setStatus("STATUS");
    setData([]);
    setOpenPrint(!openPrint);
  }

  if (!openPrint) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center ">
      <div className="bg-slate-200 md:h-[600px] h-[250px] md:w-[780px] w-[300px] rounded-md grid  shadow-md shadow-black">
        <div className=" flex justify-end">
          <a
            onClick={() => close()}
            className="text-center flex bg-red-500  p-1 w-[90px]  hover:bg-red-300 rounded-tr-md h-fit justify-center cursor-pointer"
          >
            <IoMdClose className="text-[20px]" />
          </a>
        </div>

        <div className="">
          <div className="flex md:justify-between justify-center -mt-8 ">
            <div className="justify-center md:grid hidden ">
              <label className="text-center font-bold text-[20px]">
                PREVIEW
              </label>
              <div className="h-[500px] w-[600px] bg-gray-300 ml-2 p-2 overflow-y-auto overflow-x-hidden rounded-md ">
                <div className="flex justify-end ">
                  <button
                    onClick={() => saveAsPDF(layout, sy)}
                    className="text-right text-gray-600 -mb-6 mr-1"
                  >
                    <FaDownload />
                  </button>
                </div>

                <div className="bg-white rounded-md">
                  {data.length > 0 ? (
                    <>
                      <PdfLayoutMasterList
                        data={data}
                        layout={layout}
                        sy={sy}
                        course={course}
                      />
                    </>
                  ) : (
                    <label className="flex justify-center">NO DATA</label>
                  )}
                </div>
              </div>
            </div>

            <div className="p-2 text-white grid   gap-3 h-fit justify-center mt-10">
              {Data.position !== "ADVISER" && (
                <div className="bg-[#5885AF] flex gap-1  w-full items-center rounded-md px-1">
                  <BiFilterAlt className="text-[20px]" />
                  <select
                    value={course}
                    onChange={(e) => getToPrint(e.target.value, sy, status)}
                    className={` h-[32px] rounded-md bg-[#5885AF] w-full outline-none `}
                  >
                    <option value={"ALL"}>ALL</option>
                    <option value={"BSIT"}>BSIT</option>
                    <option value={"BSAIS"}>BSAIS</option>
                    <option value={"BSTM"}>BSTM</option>
                    <option value={"BSHM"}>BSHM</option>
                    <option value={"BSCPE"}>BSCPE</option>
                    <option value={"BSCS"}>BSCS</option>
                  </select>
                </div>
              )}
              <div className="bg-[#5885AF] flex gap-1 w-fit items-center rounded-md px-1 ">
                <BiFilterAlt className="text-[20px]" />
                <select
                  value={sy}
                  onChange={(e) => getToPrint(course, e.target.value, status)}
                  className=" h-[32px] rounded-md bg-[#5885AF] overflow-auto  w-full outline-none "
                >
                  <option value={"S.Y. 2023-2024"} className="text-[15px]">
                    S.Y. 2023-2024
                  </option>
                  <option value={"S.Y. 2024-2025"} className="text-[15px]">
                    S.Y. 2024-2025
                  </option>
                  <option value={"S.Y. 2026-2027"} className="text-[15px]">
                    S.Y. 2026-2027
                  </option>
                  <option value={"S.Y. 2027-2028"} className="text-[15px]">
                    S.Y. 2027-2028
                  </option>
                  <option value={"S.Y. 2028-2029"} className="text-[15px]">
                    S.Y. 2028-2029
                  </option>
                </select>
              </div>
              <div className="bg-[#5885AF] flex gap-1 items-center w-full rounded-md px-1">
                <BiFilterAlt className="text-[20px]" />
                <select
                  value={status}
                  onChange={(e) => getToPrint(course, sy, e.target.value)}
                  className=" h-[32px] rounded-md bg-[#5885AF] overflow-auto w-full outline-none "
                >
                  <option value={"STATUS"} className="text-[15px]">
                    ALL STATUS
                  </option>
                  <option
                    value={"COMPLETE"}
                    className="text-[15px] text-green-200"
                  >
                    COMPLETE
                  </option>
                  <option
                    value={"INCOMPLETE"}
                    className="text-[15px] text-red-200"
                  >
                    INCOMPLETE
                  </option>
                </select>
              </div>

              <div>
                {data.length > 0 && (
                  <div>
                    <ReactToPrint
                      trigger={() => (
                        <a className="hover:bg-[#449256] bg-[#58af6f] text-white rounded-md flex items-center gap-2 p-1 w-full justify-center">
                          <FaPrint />
                          PRINT
                        </a>
                      )}
                      content={() => layout.current}
                      documentTitle="MasterList"
                    />
                    {data.length !== 0 ? (
                      <>
                        {data && (
                          <label className="p-2 text-black flex font-thin text-[12px] gap-1 h-fit justify-center">
                            Number of Data: <em>{count}</em>
                          </label>
                        )}
                      </>
                    ) : (
                      <label className="p-2 text-black flex gap-1 h-fit justify-center">
                        No Data
                      </label>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintModal;
