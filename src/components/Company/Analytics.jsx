import React, { useEffect, useState, useRef } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart, Bar } from "@mui/x-charts/BarChart";
import supabase from "../iMonitorDBconfig";
import { MoonLoader } from "react-spinners";
function Analytics({ data }) {
  const [analytics, setAnalytics] = useState([]);
  const [showdata, setShowData] = useState(false);
  const [moreinformaiton, setMoreInformation] = useState(false);

  const divRef = useRef(null);

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setMoreInformation(false);
    }
  };
  useEffect(() => {
    Analytics(data);
  }, [data]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  var array;

  async function Analytics(data) {
    try {
      var count = 0;
      var array = await data.sort((a, b) =>
        a.companyOJT < b.companyOJT ? 1 : -1
      );
      const colors = ["#efcc00", "#6693F5", "#0080FE"];
      var holder = [];

      for (let index = 0; index < 3; index++) {
        holder = holder.concat([
          {
            color: colors[index],
            id: array[index].id,
            companyname: array[index].companyname,
            companyOJT: array[index].companyOJT,
            data: await DataTop1(array[index].companyname),
          },
        ]);

        count++;
      }

      await setAnalytics(holder);
      setShowData(true);
    } catch (error) {}
  }

  async function DataTop1(compname) {
    const { data: masterlistcom, count: complete } = await supabase
      .from("MasterListTable1")
      .select("*", { count: "exact" })
      .match({
        companyname: compname,
        status: "complete",
      });

    const { data: masterlistincom, count: incomplete } = await supabase
      .from("MasterListTable1")
      .select("*", { count: "exact" })
      .match({
        companyname: compname,
        status: "incomplete",
      });

    let ITcom = 0;
    let ITincom = 0;

    let TMcom = 0;
    let TMincom = 0;

    let AIScom = 0;
    let AISincom = 0;

    let HMcom = 0;
    let HMincom = 0;

    let CPEcom = 0;
    let CPEincom = 0;

    let CScom = 0;
    let CSincom = 0;
    for (let index = 0; index < masterlistcom.length; index++) {
      if (masterlistincom[index].filterby === "BSIT") ITcom++;
      if (masterlistincom[index].filterby === "BSHM") HMcom++;
      if (masterlistincom[index].filterby === "BSTM") TMcom++;
      if (masterlistincom[index].filterby === "BSCPE") CPEcom++;
      if (masterlistincom[index].filterby === "BSAIS") AIScom++;
      if (masterlistincom[index].filterby === "BSCS") CScom++;
    }
    for (let index = 0; index < masterlistincom.length; index++) {
      if (masterlistincom[index].filterby === "BSIT") ITcom++;
      if (masterlistincom[index].filterby === "BSHM") HMcom++;
      if (masterlistincom[index].filterby === "BSTM") TMcom++;
      if (masterlistincom[index].filterby === "BSCPE") CPEcom++;
      if (masterlistincom[index].filterby === "BSAIS") AIScom++;
      if (masterlistincom[index].filterby === "BSCS") CScom++;
    }

    array = [
      {
        companyname: compname,
        completed: complete,
        incomplete: incomplete,
        BSITCom: ITcom,
        BSITInCom: ITincom,

        BSTMCom: TMcom,
        BSTMInCom: TMincom,

        BSAISCom: AIScom,
        BSAISInCom: AISincom,

        BSHMCom: HMcom,
        BSHMInCom: HMincom,

        BSCPECom: CPEcom,
        BSCPEInCom: CPEincom,

        BSCSCom: CScom,
        BSCSInCom: CSincom,
      },
    ];
    console.log(array);
    return { array };
  }

  const calculateAverateCompleted = (
    overallValue,
    CompleteValue,
    InCompleteValue
  ) => {
    let avgCOM = Math.round((CompleteValue / overallValue) * 100);
    let avgINCOM = Math.round((InCompleteValue / overallValue) * 100);
    return (
      <div className="flex text-start gap-2 justify-center w-[100%]">
        <div className="md:flex grid gap-1 text-[15px] ">
          The average number of student who completed their OJT in this company
          is{" "}
          <div className="text-green-500 font-bold  italic">{`${
            avgCOM >= -0 ? `${avgCOM}%` : "No Data"
          }`}</div>
        </div>
        <div className="md:flex grid gap-1 text-[15px] ">
          The average number of student who didn't complete their OJT in this
          company is
          {console.log(avgINCOM)}
          <div className="text-red-500 font-bold italic">{`${
            avgINCOM >= -0 ? `${avgINCOM}%` : "No Data"
          }`}</div>
        </div>
        .
      </div>
    );
  };
  return (
    <>
      {analytics ? (
        <>
          {analytics.length < 2 ? (
            <label className="text-white font-bold text-[20px]  flex justify-center place-content-center items-center mt-[10%]">
              The analytics will show when there are three or more companies
              registered.
            </label>
          ) : (
            <div className="mt-2  h-screen ">
              {showdata && (
                <div className=" md:w-[100%]  w-[99%]  h-[33%] md:flex grid place-content-center items-center  inset-0 bg-[#6f97bcb3] text-black rounded-md shadow-md shadow-black">
                  <div className=" h-[100%] flex items-center ">
                    <div className="flex-col mb-2">
                      <p className="flex-col flex text-center font-bold text-lg text-white">
                        {analytics.length >= 2 && "Top 3 Companies"}
                      </p>

                      <PieChart
                        data={analytics.map((file) => ({
                          title: file.companyname,
                          value: file.companyOJT,
                          color: file.color,
                        }))}
                        className=" md:w-[200px] w-[150px] "
                      />
                    </div>

                    <div className=" ml-10 md:gap-10 gap-5  text-white justify-start md:flex grid items-center ">
                      {analytics.map((data) => (
                        <div
                          key={data.id}
                          className="font-semibold text-sm  items-center  justify-center gap-1 cursor-default grid"
                        >
                          <label className="flex items-center gap-1">
                            <div
                              style={{ background: data.color }}
                              className="h-[15px] w-[15px] rounded-full items-center  gap-1 "
                            />
                            {data.companyname}
                          </label>

                          <label className="text-[14px] flex font-thin">
                            Number of Students Enrolled: {data.companyOJT}
                          </label>
                          <div className="flex gap-2">
                            <label className="text-[14px] flex font-thin">
                              Completed: {data.data.array[0].completed}
                            </label>
                            <label className="text-[14px] flex font-thin">
                              Incompleted: {data.data.array[0].incomplete}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {moreinformaiton ? (
                <div ref={divRef}>
                  <div
                    onClick={() => setMoreInformation(!moreinformaiton)}
                    className="bg-[#58abf8b3] hover:bg-[#48a7ff60]  p-1 mt-4 rounded shadow-black shadow-lg md:w-[100%]  w-[99%] text-white justify-center flex "
                  >
                    <label className="font-bold text-md ">
                      HIDE INFORMATION
                    </label>
                  </div>
                  {showdata ? (
                    <div className="md:flex grid justify-between ">
                      {analytics.map((data) => (
                        <div key={data.id}>
                          <div className=" bg-[#6f97bcb3] p-3 mt-4 rounded shadow-black shadow-lg text-white md:w-[100%] w-[102%]">
                            <label className="text-xl font-bold flex items-center gap-1">
                              <span
                                style={{ background: data.color }}
                                className="h-[15px] w-[15px] rounded-full items-center"
                              />
                              {data.companyname}
                            </label>
                            <BarChart
                              xAxis={[
                                {
                                  scaleType: "band",
                                  data: ["Enrolled", "Completed", "Incomplete"],
                                },
                              ]}
                              series={[
                                {
                                  data: [
                                    data.companyOJT,
                                    data.data.array[0].completed,
                                    data.data.array[0].incomplete,
                                  ],
                                  color: [data.color],
                                },
                              ]}
                              width={370}
                              height={340}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex place-content-center items-center h-[300px] bg-[#6f97bcb3] mt-2 rounded-md shadow-black shadow-md">
                      <MoonLoader color="#131f2a" speedMultiplier={0.5} />
                    </div>
                  )}
                  <div className="bg-[#6f97bcb3] p-3 mt-4 rounded shadow-black shadow-lg  md:w-[100%]  w-[99%] text-white justify-center flex ">
                    <label className="font-thin text-lg">
                      OVERALL COMPLETED AND INCOMPLETE IN EACH COURSE FOR THE
                      TOP 3 MOST OJT ENROLLED AT THAT COMPANY
                    </label>
                  </div>
                  {console.log(analytics)}
                  {showdata ? (
                    <div className=" grid justify-between md:w-[100%]  w-[95%]">
                      {analytics.map((data) => (
                        <div key={data.id}>
                          <div className=" bg-[#6f97bcb3] p-3 mt-4 rounded shadow-black shadow-lg md:w-[100%] w-[105%] text-white ">
                            <label className="text-xl font-bold flex items-center gap-1">
                              <span
                                style={{ background: data.color }}
                                className="h-[15px] w-[15px] rounded-full items-center"
                              />
                              {data.companyname}
                            </label>

                            <div className="grid md:grid-cols-6 grid-cols-2 md:w-[100%] ">
                              {/* IT */}
                              <div>
                                BSIT
                                <BarChart
                                  xAxis={[
                                    {
                                      scaleType: "band",
                                      data: ["Complete", "Incomplete"],
                                    },
                                  ]}
                                  series={[
                                    {
                                      data: [
                                        data.data.array[0].BSITCom,
                                        data.data.array[0].BSITInCom,
                                      ],
                                      color: [data.color],
                                    },
                                  ]}
                                  width={240}
                                  height={260}
                                />
                              </div>
                              {/* TM */}
                              <div>
                                BSTM
                                <BarChart
                                  xAxis={[
                                    {
                                      scaleType: "band",
                                      data: ["Complete", "Incomplete"],
                                    },
                                  ]}
                                  series={[
                                    {
                                      data: [
                                        data.data.array[0].BSTMCom,
                                        data.data.array[0].BSTMInCom,
                                      ],
                                      color: [data.color],
                                    },
                                  ]}
                                  width={240}
                                  height={260}
                                />
                              </div>
                              {/* HM */}
                              <div>
                                BSHM
                                <BarChart
                                  xAxis={[
                                    {
                                      scaleType: "band",
                                      data: ["Complete", "Incomplete"],
                                    },
                                  ]}
                                  series={[
                                    {
                                      data: [
                                        data.data.array[0].BSHMCom,
                                        data.data.array[0].BSHMInCom,
                                      ],
                                      color: [data.color],
                                    },
                                  ]}
                                  width={240}
                                  height={260}
                                />
                              </div>
                              {/* AIS */}
                              <div>
                                BSAIS
                                <BarChart
                                  xAxis={[
                                    {
                                      scaleType: "band",
                                      data: ["Complete", "Incomplete"],
                                    },
                                  ]}
                                  series={[
                                    {
                                      data: [
                                        data.data.array[0].BSAISCom,
                                        data.data.array[0].BSAISInCom,
                                      ],
                                      color: [data.color],
                                    },
                                  ]}
                                  width={240}
                                  height={260}
                                />
                              </div>
                              {/* CPE */}
                              <div>
                                BSCPE
                                <BarChart
                                  xAxis={[
                                    {
                                      scaleType: "band",
                                      data: ["Complete", "Incomplete"],
                                    },
                                  ]}
                                  series={[
                                    {
                                      data: [
                                        data.data.array[0].BSCPECom,
                                        data.data.array[0].BSCPEInCom,
                                      ],
                                      color: [data.color],
                                    },
                                  ]}
                                  width={240}
                                  height={260}
                                />
                              </div>
                              {/* CS */}
                              <div>
                                BSCS
                                <BarChart
                                  xAxis={[
                                    {
                                      scaleType: "band",
                                      data: ["Complete", "Incomplete"],
                                    },
                                  ]}
                                  series={[
                                    {
                                      data: [
                                        data.data.array[0].BSCSCom,
                                        data.data.array[0].BSCSInCom,
                                      ],
                                      color: [data.color],
                                    },
                                  ]}
                                  width={240}
                                  height={260}
                                />
                              </div>
                            </div>
                            <div className="items-center flex font-light w-[100%]">
                              {calculateAverateCompleted(
                                data.companyOJT,
                                data.data.array[0].completed,
                                data.data.array[0].incomplete
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex place-content-center items-center h-[300px] bg-[#5885AF] bg-opacity-20 mt-2 rounded-md shadow-black shadow-md">
                      <MoonLoader color="#131f2a" speedMultiplier={0.5} />
                    </div>
                  )}
                  <div className="h-[100px]" />
                </div>
              ) : (
                <div
                  onClick={() => setMoreInformation(!moreinformaiton)}
                  className="bg-[#4778a6b3] cursor-pointer hover:bg-[#48a7ff60] p-1 mt-4 rounded shadow-black shadow-lg  md:w-[100%]  w-[99%] text-white justify-center flex "
                >
                  <label className="font-bold text-md cursor-pointer">
                    VIEW MORE INFORMATION
                  </label>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex place-content-center items-center h-[300px] bg-[#5885AF] bg-opacity-20 mt-2 rounded-md shadow-black shadow-md">
          <MoonLoader color="#131f2a" speedMultiplier={0.5} />
        </div>
      )}
    </>
  );
}

export default Analytics;
