import React, { useEffect, useRef, useState } from "react";
import supabase from "../iMonitorDBconfig";
import { IoMdClose } from "react-icons/io";
import { BiFilterAlt } from "react-icons/bi";
import { FaPrint, FaCheckToSlot } from "react-icons/fa6";
import ReactToPrint from "react-to-print";
import PdfLayoutMasterList from "./PdfLayoutMasterList";

function PrintModal({ openPrint, setOpenPrint }) {
  const [course, setCourse] = useState("ALL");
  const [sy, setSY] = useState("S.Y. 2023-2024");
  const [status, setStatus] = useState("STATUS");
  const [data, setData] = useState([]);
  const [count, setCount] = useState();
  const layout = useRef();

  useEffect(() => {
    const fetch = async () => {
      const { data: masterlist, count } = await supabase
        .from("MasterListTable1")
        .select("*", { count: "exact" });

      setData(masterlist);
      setCount(count);
    };
    fetch();
  }, [openPrint]);

  async function getToPrint(course1, sy1, status1) {
    setCourse(course1);
    setSY(sy1);
    setStatus(status1);

    var defCourse = "ALL";
    var defSY = "S.Y. 2023-2024";

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
        const { data: masterlist, count } = await supabase
          .from("MasterListTable1")
          .select("*", { count: "exact" })
          .match({ filterby: course1, status: status1.toLowerCase() });

        setData(masterlist);
        setCount(count);
      };
      fetch();
      return;
    } else if (course1 === defCourse && sy1 !== defSY) {
      const fetch = async () => {
        const { data: masterlist, count } = await supabase
          .from("MasterListTable1")
          .select("*", { count: "exact" })
          .match({ studSY: sy1, status: status1.toLowerCase() });

        setData(masterlist);
        setCount(count);
      };
      fetch();
      return;
    } else if (course1 !== defCourse && sy1 !== defSY) {
      console.log(true + "1");
      const fetch = async () => {
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
      };
      fetch();
      return;
    }
  }

  function close() {
    setCourse("ALL");
    setSY("S.Y. 2023-2024");
    setStatus("ALL STATUS");
    setData([]);
    setOpenPrint(!openPrint);
  }

  if (!openPrint) return null;
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center ">
      <div className="bg-slate-200 md:h-[150px] h-[250px] md:w-[500px] w-[300px] rounded-md grid  shadow-md shadow-black">
        <div className="flex justify-end ">
          <button
            onClick={() => close()}
            className="text-right flex bg-red-500 hover:bg-red-300 h-fit p-0.5 px-5 rounded-tr-md w-fit justify-end "
          >
            <IoMdClose className="text-[20px]" />
          </button>
        </div>
        <div className="p-2 text-white md:flex grid gap-3 h-fit justify-center">
          <div className="bg-[#5885AF] flex gap-1 w-fit items-center rounded-md px-1">
            <BiFilterAlt className="text-[20px]" />
            <select
              value={course}
              onChange={(e) => getToPrint(e.target.value, sy, status)}
              className={` h-[32px] rounded-md bg-[#5885AF] outline-none `}
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
          <div className="bg-[#5885AF] flex gap-1 w-fit items-center rounded-md px-1 ">
            <BiFilterAlt className="text-[20px]" />
            <select
              value={sy}
              onChange={(e) => getToPrint(course, e.target.value, status)}
              className=" h-[32px] rounded-md bg-[#5885AF] overflow-auto  outline-none "
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
          <select
            value={status}
            onChange={(e) => getToPrint(course, sy, e.target.value)}
            className=" h-[32px] rounded-md bg-[#5885AF] overflow-auto  outline-none "
          >
            <option value={"STATUS"} className="text-[15px]">
              ALL STATUS
            </option>
            <option value={"COMPLETE"} className="text-[15px]">
              COMPLETE
            </option>
            <option value={"INCOMPLETE"} className="text-[15px]">
              INCOMPLETE
            </option>
          </select>
          <div>
            {data.length > 0 && (
              <div>
                <ReactToPrint
                  trigger={() => (
                    <button className="hover:bg-[#449256] bg-[#58af6f] text-white rounded-md flex items-center gap-2 p-1 w-full justify-center">
                      <FaPrint />
                      PRINT
                    </button>
                  )}
                  content={() => layout.current}
                  documentTitle="MasterList"
                />

                <div className="hidden">
                  <PdfLayoutMasterList
                    data={data}
                    layout={layout}
                    sy={sy}
                    course={course}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {data.length !== 0 ? (
          <>
            {data && (
              <label className="p-2 text-black flex gap-1 h-fit justify-center">
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
    </div>
  );
}

export default PrintModal;
