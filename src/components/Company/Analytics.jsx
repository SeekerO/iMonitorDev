import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
function Analytics({ data }) {
  const [analytics, setAnalytics] = useState([]);
  useEffect(() => {
    Analytics(data);
  }, [data]);
  async function Analytics(data) {
    try {
      var array = await data.sort((a, b) =>
        a.companyOJT < b.companyOJT ? 1 : -1
      );
      const colors = ["#E38627", "#C13C37", "#6A2135"];
      var holder = [];
      for (let index = 0; index < 3; index++) {
        holder = holder.concat([
          {
            color: colors[index],
            id: array[index].id,
            companyname: array[index].companyname,
            companyOJT: array[index].companyOJT,
          },
        ]);
      }

      await setAnalytics(holder);
    } catch (error) {}
  }

  return (
    <div className="mt-2">
      {/* Analytics  */}
      {analytics && (
        <div className=" w-[100%] md:flex grid place-content-center items-center inset-0 bg-[#5885af44] text-black rounded-md shadow-md shadow-black">
          <div className=" h-[100%] flex  p-4">
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
                className=" w-[130px] "
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
                    className="h-[15px] w-[15px] rounded-full items-center"
                  />
                  {data.companyname} | Number of Students: {data.companyOJT}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
