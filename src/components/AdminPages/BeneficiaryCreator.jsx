import React, { useEffect, useState } from "react";
import supabase from "../iMonitorDBconfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalAccounts from "./ModalAccounts";

import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const BeneficiaryCreator = () => {
  const [studinfo, setStudinfo] = useState();
  const [beneinfo, setBeneinfo] = useState();
  const [createname, setCreateName] = useState("");
  const [createemail, setCreateEmail] = useState("");
  const [performerror, setPerformError] = useState("");

  const [position, setPosition] = useState("ALUMNI OFFICER");
  const [course, setCourse] = useState("ALL");

  //Modal View accounts
  const [viewAccounts, setViewAccounts] = useState(false);

  const [loadingcreate, setLoadingCreate] = useState(false);

  const [creating, isCreating] = useState(false);

  useEffect(() => {
    fetchbeneinfo();

    const channels = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "BeneAccount" },
        (payload) => {
          fetchbeneinfo();
        }
      )
      .subscribe();
  }, []);

  const fetchbeneinfo = async () => {
    const { data: bene } = await supabase.from("BeneAccount").select();

    if (bene) {
      setBeneinfo(bene);
    }

    const { data: stud } = await supabase.from("StudentInformation").select();
    if (stud) {
      setStudinfo(stud);
    }
  };

  //Create Account of Beneficiary
  var emailchecker = false;

  async function createaccount() {
    if (!createname || !createemail || !position || !course) {
      setPerformError("Please input all fields");
      return;
    }

    if (!isValidEmail(createemail)) {
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

    if (emailchecker) {
      for (let index = 0; index < studinfo.length; index++) {
        if (studinfo[index].studemail === createemail) {
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
        if (
          beneinfo[index].beneEmail === createemail ||
          beneinfo[index].beneName === createname
        ) {
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

      isCreating(true);

      var positionCHECKER;

      if (position === "ALUMNI OFFICER") {
        positionCHECKER = "ALL";
      }

      if (positionCHECKER) {
        await supabase
          .from("BeneAccount")
          .insert([
            {
              beneName: createname,
              beneEmail: createemail,
              status: "active",
              position: position,
              filterby: positionCHECKER,
            },
          ])
          .single();
      } else {
        await supabase
          .from("BeneAccount")
          .insert([
            {
              beneName: createname,
              beneEmail: createemail,
              status: "active",
              position: position,
              filterby: course,
            },
          ])
          .single();
      }

      setLoadingCreate(false);
      setCreateName("");
      setCreateEmail("");
      setPerformError("");

      isCreating(false);
      toast.success("Account Created Successfully!", {
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

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  return (
    <>
      <ToastContainer limit={1} />

      <div className="h-screen overflow-y-auto md:pt-0 pt-10">
        <div className=" md:grid-cols-3 grid-cols-1 gap-5 gap-y-50  md:ml-[2.5%] ml-0 md:mr-[2.5%] mr-0 mt-[10%] place-content-center flex">
          {/* Create */}
          <div className="bg-white w-[400px] h-[390px] rounded-md shadow-2xl shadow-slate-900 ">
            <p className="text-center font-bold text-[30px] bg-green-700 rounded-t-sm font-mono  text-white">
              CREATE ACCOUNT
            </p>
            {!loadingcreate ? (
              <div>
                <div className="mt-[5.8%]">
                  <p className="ml-5 font-semibold mt-4">NAME</p>
                  <input
                    type="text"
                    value={createname}
                    placeholder="Type Name Here"
                    onChange={(e) => setCreateName(e.target.value)}
                    className="bg-gray-200 w-[90%] ml-5 mb-2 pl-2 p-2 rounded-sm"
                  ></input>
                  <p className="ml-5 font-semibold mt-4">EMAIL</p>

                  <input
                    type="email"
                    value={createemail}
                    placeholder="Type Email Here"
                    onChange={(e) => setCreateEmail(e.target.value)}
                    className="bg-gray-200 w-[90%] ml-5 mb-2 pl-2 p-2 rounded-sm"
                  ></input>

                  {createname && (
                    <div className="flex">
                      <select
                        value={position}
                        className="ml-5 mb-2 border-2 border-slate-400"
                        onChange={(e) => setPosition(e.target.value)}
                      >
                        <option>ALUMNI OFFICER</option>
                        <option>ADVISER </option>
                      </select>
                      {position === "ADVISER" && (
                        <select
                          value={course}
                          className="ml-5 mb-2 border-2 border-slate-400"
                          onChange={(e) => setCourse(e.target.value)}
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
                  )}

                  {performerror && (
                    <p className="ml-[20px] text-red-600">{performerror}</p>
                  )}
                  <button
                    disabled={creating}
                    onClick={() => createaccount()}
                    className={`${
                      creating
                        ? "bg-gray-500"
                        : "bg-[#12557c] hover:bg-[#1b7fb9]"
                    }  text-white font-bold w-[90%] p-2 ml-5 `}
                  >
                    CREATE
                  </button>
                </div>
                <button
                  onClick={() => setViewAccounts(!viewAccounts)}
                  className=" text-blue-500 hover:underline cursor-pointer flex justify-start ml-5"
                >
                  View Accounts
                </button>
              </div>
            ) : (
              <div className="">
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              </div>
            )}
          </div>
        </div>
      </div>

      <ModalAccounts
        visible={viewAccounts}
        setViewAccounts={setViewAccounts}
        beneinfo={beneinfo}
        studinfo={studinfo}
      />
    </>
  );
};

export default BeneficiaryCreator;
