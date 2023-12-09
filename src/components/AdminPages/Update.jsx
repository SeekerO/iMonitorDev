import React, { useState, useEffect } from "react";
import supabase from "../iMonitorDBconfig";
import { IoIosArrowBack } from "react-icons/io";

import { toast } from "react-toastify";

function Update({ visible, close, data, beneinfo, studinfo }) {
  const [oldname, setOldName] = useState(data.beneName);
  const [updatename, setupdatename] = useState(data.beneName);
  const [updateemail, setupdateemail] = useState(data.beneEmail);
  const [updateid, setupdateid] = useState(data.id);
  const [performerrorupdate, setPerformErrorUpdate] = useState("");

  const [position, setPosition] = useState("ALUMNI OFFICER");
  const [course, setCourse] = useState("ALL");

  const [positionupdate, setPositionUpdate] = useState(data.position);
  const [courseupdate, setCourseUpdate] = useState("BSIT");

  const [uploading, isUploading] = useState(false);

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  // UPDATE Function
  var emailcheckerUPDATE = false;
  async function updateaccount() {
    if (updatename === "" || updateemail === "") {
      setPerformErrorUpdate("Please input all fields");
      return;
    }

    var emailchecker = false;

    if (!isValidEmail(updateemail)) {
      emailchecker = false;
      toast.warning("Invalid Email", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      emailchecker = true;
    }
    var run = false;
    var oldEmail_holder = data.beneEmail;
    if (emailchecker) {
      if (oldEmail_holder !== updateemail) {
        for (let index = 0; index < studinfo.length; index++) {
          if (studinfo[index].studemail === updateemail) {
            toast.warn(" The email is already registed in Student Accounts", {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              limit: 1,
              theme: "light",
            });
            return;
          }
        }

        for (let index = 0; index < beneinfo.length; index++) {
          if (beneinfo[index].beneEmail === updateemail) {
            toast.warn(
              " The email is already registed in APO & ADVISER Accounts",
              {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                limit: 1,
                theme: "light",
              }
            );
            return;
          }
        }
      }
      run = true;
      if (run === true) {
        isUploading(true);
        if (oldname !== updatename) {
          const { data: beneName } = await supabase
            .from("Messaging")
            .update({ name: updatename })
            .eq("name", oldname);

          const { data: beneContactWith } = await supabase
            .from("Messaging")
            .update({ contactwith: updatename })
            .eq("contactwith", oldname);
        }

        var courseupdate1;
        if (positionupdate !== "ADVISER") {
          courseupdate1 = "ALL";
          const { data } = await supabase
            .from("BeneAccount")
            .update({
              beneName: updatename,
              beneEmail: updateemail,
              filterby: courseupdate1,
              position: positionupdate,
            })
            .eq("id", updateid);
        } else {
          const { data } = await supabase
            .from("BeneAccount")
            .update({
              beneName: updatename,
              beneEmail: updateemail,
              filterby: courseupdate,
              position: positionupdate,
            })
            .eq("id", updateid);
        }

        setPerformErrorUpdate();
        toast.success("Account Updated Successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        isUploading(false);
        close1();
      } else {
        toast.warning("Account Not Detected", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  }

  function close1() {
    close(!visible);
  }
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex justify-center items-center p-4 ">
      <div
        className="bg-white rounded-md shadow-lg shadow-slate-600 w-[500px]"
        data-aos="zoom-in"
        data-aos-duration="500"
      >
        {/* Update */}
        <div className="bg-white md:h-[270px] h-[320px] w-[100%] rounded-md  ">
          <div className="flex md:text-center text-start font-bold text-[30px] bg-amber-700 rounded-t-sm font-mono text-white ">
            <a
              onClick={() => close1()}
              className="justify-start ml-2 md:mr-[110px] mr-[10px] flex items-center cursor-pointer"
            >
              <IoIosArrowBack />
            </a>
            <p className="flex "> UPDATE ACCOUNT</p>
          </div>

          <div className="">
            <div className="md:flex grid items-center gap-1 mt-4 justify-center w-[100%]">
              <p className="ml-1 font-semibold">NAME</p>{" "}
              <input
                type="text"
                value={updatename}
                onChange={(e) => setupdatename(e.target.value)}
                placeholder="Update name here"
                className="bg-gray-200 md:w-[80%] w-[280px] pl-2 p-1 rounded-sm"
              ></input>
            </div>
            <div className="md:flex grid items-center gap-1 mt-4 justify-center">
              <p className="ml-1 font-semibold ">EMAIL</p>
              <input
                type="text"
                value={updateemail}
                onChange={(e) => setupdateemail(e.target.value)}
                placeholder="Update email here"
                className="bg-gray-200 md:w-[80%] w-[280px]  pl-2 p-1 rounded-sm"
              ></input>
            </div>

            <div className="flex mb-4 mt-2">
              <select
                className="ml-6 mb-2 border-2 border-slate-400"
                value={positionupdate}
                onChange={(e) => setPositionUpdate(e.target.value)}
              >
                <option>ALUMNI OFFICER</option>
                <option>ADVISER </option>
              </select>
              {positionupdate === "ADVISER" && (
                <select
                  className="ml-5 mb-2 border-2 border-slate-400"
                  value={courseupdate}
                  onChange={(e) => setCourseUpdate(e.target.value)}
                >
                  <option value={"BSIT"}>BSIT</option>
                  <option value={"BSAIS"}>BSAIS</option>
                  <option value={"BSTM"}>BSTM</option>
                  <option value={"BSHM"}>BSHM</option>
                  <option value={"BSCS"}>BSCS</option>
                  <option value={"BSCPE"}>BSCPE</option>
                </select>
              )}
            </div>

            {performerrorupdate && (
              <p className="ml-[20px] text-red-600">{performerrorupdate}</p>
            )}
            <button
              onClick={() => updateaccount()}
              disabled={uploading}
              className={`${
                uploading ? "bg-gray-500" : "bg-[#12557c] hover:bg-[#1b7fb9]"
              }  text-white font-bold w-[90%] p-2 `}
            >
              UPDATE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Update;
