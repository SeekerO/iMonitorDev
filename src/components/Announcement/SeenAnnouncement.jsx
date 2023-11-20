import React, { useState } from "react";
import { read } from "xlsx";
import supabase from "../iMonitorDBconfig";
import { useEffect } from "react";
function SeenAnnouncement({ getreadsBy, seen }) {
  const [studinfo, setStudinfo] = useState();

  useEffect(() => {
    fetchStudentInfo();
  }, [getreadsBy]);

  async function fetchStudentInfo() {
    const { data: studinfo } = await supabase
      .from("StudentInformation")
      .select();

    setStudinfo(studinfo);
  }

  const dataDisplay = (email) => {
    var data = [];
    if (studinfo) {
      for (let index = 0; index < studinfo.length; index++) {
        if (studinfo[index].studemail === email) {
          data = studinfo[index];
        }
      }
    }

    return (
      <div>{data && <>{`${data.studname ? data.studname : email}`}</>}</div>
    );
  };

  if (!seen) return null;
  return (
    <div className="p-1">  
      Seen By:
      <div className="">
        {getreadsBy.map((reads, index) => (
          <div key={index} className="p-1 cursor-default">
            {dataDisplay(reads)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SeenAnnouncement;
