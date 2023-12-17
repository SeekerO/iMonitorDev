import React, { useState, useEffect, useRef } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { BarChart, Bar } from "@mui/x-charts/BarChart";
import ReactToPrint from "react-to-print";
import stilogo from "../images/STILOGO4.png";
export default function PdfLayout({ data, analytics, avg, testRef }) {
  const layoutFile = useRef(null);
  useEffect(() => {
    layout();
  }, [data]);

  const layout = () => {
    const calculateAverateCompleted = (
      overallValue,
      CompleteValue,
      InCompleteValue
    ) => {
      let avgCOM = Math.round((CompleteValue / overallValue) * 100);
      let avgINCOM = Math.round((InCompleteValue / overallValue) * 100);

      return (
        <div className="flex text-center gap-2 justify-center">
          <div className="flex  gap-1 text-[15px] ">
            <p>
              The average number of student who completed their on-the-job
              training in this company is{" "}
              <em className="text-green-500 font-bold  italic">{`${
                avgCOM >= -0 ? `${avgCOM}%` : "No Data"
              }`}</em>
            </p>
          </div>
          <div className="flex text-[15px] ">
            <p>
              The average number of student who didn't complete their on-the-job
              training in this{" "}
              <em className="text-red-700 font-bold italic">{`${
                avgINCOM >= -0 ? `${avgINCOM}%` : "No Data"
              }`}</em>
            </p>
          </div>
          .
        </div>
      );
    };

    return (
      <div ref={layoutFile} className="mt-2  h-screen">
        {analytics && (
          <div className="">
            <div className=" md:w-[100%]  w-[99%]  h-[33%] md:flex grid place-content-center items-center  inset-0  text-black rounded-md ">
              {/* PIE CHART */}
              <div className=" h-[100%] flex items-center ">
                <div className="flex-col mb-2">
                  <p className="flex-col flex text-center font-senibold text-lg text-black">
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

                <div className=" ml-10 gap-5  text-black justify-start flex items-center ">
                  <>
                    {analytics.map((data, index) => (
                      <div
                        key={data.id}
                        className="font-thin text-sm  items-center  justify-center gap-1 cursor-default grid"
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
                            {avg
                              ? `Completed: ${avg[index].completed}`
                              : "Loading"}
                          </label>
                          <label className="text-[14px] flex font-thin">
                            {avg
                              ? `Incomplete: ${avg[index].incomplete}`
                              : "Loading"}
                          </label>
                        </div>
                      </div>
                    ))}
                  </>
                </div>
              </div>
            </div>

            <div className="p-10">
              {analytics && (
                <div className="flex  justify-between ">
                  {analytics.map((data, index) => (
                    <div key={data.id}>
                      <div className="  p-3 mt-2 rounded text-black md:w-[100%] w-[102%]">
                        <label className="text-xl font-thin flex items-center gap-1">
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
                                avg[index].completed,
                                avg[index].incomplete,
                              ],
                              color: [data.color],
                            },
                          ]}
                          width={270}
                          height={270}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className=" p-3 rounded  md:w-[100%]  w-[99%] text-black justify-center flex ">
                <label className="font-thin text-lg text-center">
                  OVERALL COMPLETED AND INCOMPLETE IN EACH COURSE FOR THE TOP 3
                  MOST OJT ENROLLED AT THAT COMPANY
                </label>
              </div>
              {analytics && (
                <div className=" grid justify-between:w-[100%]">
                  {analytics.map((data, index) => (
                    <div key={data.id}>
                      <div className="  p-3 rounded w-[100%] text-black ">
                        <label className="text-xl font-thin flex items-center gap-1">
                          <span
                            style={{ background: data.color }}
                            className="h-[15px] w-[15px] rounded-full items-center"
                          />
                          {data.companyname}
                        </label>

                        <div className="grid grid-cols-3 w-[100%] ">
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
                                    avg[index].BSITCom,
                                    avg[index].BSITInCom,
                                  ],
                                  color: [data.color],
                                },
                              ]}
                              width={250}
                              height={230}
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
                                    avg[index].BSTMCom,
                                    avg[index].BSTMInCom,
                                  ],
                                  color: [data.color],
                                },
                              ]}
                              width={250}
                              height={230}
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
                                    avg[index].BSHMCom,
                                    avg[index].BSHMInCom,
                                  ],
                                  color: [data.color],
                                },
                              ]}
                              width={250}
                              height={230}
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
                                    avg[index].BSAISCom,
                                    avg[index].BSAISInCom,
                                  ],
                                  color: [data.color],
                                },
                              ]}
                              width={250}
                              height={230}
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
                                    avg[index].BSCPECom,
                                    avg[index].BSCPEInCom,
                                  ],
                                  color: [data.color],
                                },
                              ]}
                              width={250}
                              height={230}
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
                                    avg[index].BSCSCom,
                                    avg[index].BSCSInCom,
                                  ],
                                  color: [data.color],
                                },
                              ]}
                              width={250}
                              height={230}
                            />
                          </div>
                        </div>
                        <div className="items-center flex font-light w-[100%]">
                          {calculateAverateCompleted(
                            data.companyOJT,
                            avg[index].completed,
                            avg[index].incomplete
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="h-[1px] bg-black w-[99%] mb-4" />
        <label className="flex justify-center text-[12px]">
          © 2023 STI College. All Rights Reserved.
        </label>
      </div>
    );
  };

  const capital = (text) => {

    var textCapital = text;
    return (
      <p className="font-thin">
        {textCapital.toUpperCase()} <em className="font-semibold">iMonitor</em>
      </p>
    );
  };


  return (
    <div ref={testRef} className="p-2">
      <div className="flex items-center  gap-2 ml-1">
        <img src={stilogo} alt="STI LOGO" className=" h-15 w-20 rounded-sm" />
        <label className="font-bold text-[30px] font-sans text-[#0874B9]">
          iMonitor
        </label>
      </div>
      <div className="h-[1px] bg-black w-[99%] mt-4" />

      <div className="p-3">
        <label className="flex justify-center text-[20px] text-center ">
          {capital(`THIS DATA CONSISTS OF THE DETAILED INFORMATION OF THE TOP 3 COMPANY GENERATED IN`)}
        </label>
      </div>
      <div className="grid">{layout()}</div>
    </div>
  );
}
