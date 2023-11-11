import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { BarChart, Bar } from "@mui/x-charts/BarChart";
import supabase from "../iMonitorDBconfig";
import { MoonLoader } from "react-spinners";
function Analytics({ data, masterlistinfos }) {
  const [analytics, setAnalytics] = useState([]);
  const [showdata, setShowData] = useState(false);
  var array;
  useEffect(() => {
    Analytics(data);
  }, [data]);

  async function Analytics(data) {
    try {
      var count = 0;
      var array = await data.sort((a, b) =>
        a.companyOJT < b.companyOJT ? 1 : -1
      );
      const colors = ["#efcc00", "#5885AF", "#3962a3"];
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
    var completeTop1 = [];
    var incompleteTop1 = [];

    for (let index = 0; index < masterlistinfos.length; index++) {
      const { data: masterlist, error } = await supabase
        .from("MasterListTable1")
        .select()
        .match({
          companyname: compname,
          studname: masterlistinfos[index].studname,
          status: "complete",
        });

      completeTop1 = completeTop1.concat(masterlist);
    }
    for (let index = 0; index < masterlistinfos.length; index++) {
      const { data: masterlist, error } = await supabase
        .from("MasterListTable1")
        .select()
        .match({
          companyname: compname,
          studname: masterlistinfos[index].studname,
          status: "incomplete",
        });

      incompleteTop1 = incompleteTop1.concat(masterlist);
    }

    var completeNum = completeTop1.length;
    var incompleteNum = incompleteTop1.length;

    array = [
      {
        companyname: compname,
        completed: completeNum,
        incomplete: incompleteNum,
      },
    ];

    return { array };
  }

  return (
    <div className="mt-2  h-screen ">
      {/* Analytics  */}
      {showdata && (
        <div className=" w-[100%]  h-[33%] md:flex grid place-content-center items-center  inset-0 bg-[#5885af44] text-black rounded-md shadow-md shadow-black">
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
                className=" w-[200px] "
              />
            </div>

            {analytics.length <= 2 && (
              <label className="text-black font-bold mt-10 text-[20px] -ml-14">
                The analytics will show when there are three or more companies
                registered.
              </label>
            )}

            <div className=" ml-2 gap-10  text-white justify-start md:flex grid items-center">
              {analytics.map((data) => (
                <div
                  key={data.id}
                  className="font-semibold text-sm flex items-center  justify-center gap-1 cursor-default"
                >
                  <div
                    style={{ background: data.color }}
                    className="h-[15px] w-[15px] rounded-full items-center flex gap-1 "
                  />
                  <label className="text-[18px] flex">
                    {data.companyname} | Number of Students: {data.companyOJT}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showdata ? (
        <div className="md:flex grid justify-between ">
          {analytics.map((data) => (
            <div>
              <div className=" bg-slate-100 p-3 w-fit mt-4 rounded shadow-black shadow-lg">
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
                  width={420}
                  height={340}
                />
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
  );
}

export default Analytics;
