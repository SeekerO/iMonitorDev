import React from "react";
import moment from "moment";
import { AiOutlineStop, AiFillCheckCircle } from "react-icons/ai";
import supabase from "../iMonitorDBconfig";

function AdminConfig({ admin }) {
  async function ChangeStatus() {
    if (admin.status === "active") {
      const { data, error } = await supabase
        .from("AdminAccount")
        .update({ status: "deactivate" })
        .eq("id", admin.id)
        .select();
    } else {
      const { data, error } = await supabase
        .from("AdminAccount")
        .update({ status: "active" })
        .eq("id", admin.id)
        .select();
    }
  }
  return (
    <div
      key={admin.id}
      className="grid grid-cols-4 w-[100%] p-1 bg-slate-200 hover:bg-blue-200 cursor-pointer"
    >
      <label className="cursor-pointer flex items-center justify-center">
        {admin.username}
      </label>
      <label className="cursor-pointer flex items-center justify-center">
        {moment(admin.created_at).format("ll")}
      </label>
      <label
        className={`${
          admin.status === "active"
            ? "text-green-700 cursor-pointer flex items-center justify-center"
            : "text-red-500 cursor-pointer flex items-center justify-center"
        }`}
      >
        {admin.status.toUpperCase()}
      </label>
      {admin.username === "admin" ? (
        ""
      ) : (
        <a
          onClick={() => ChangeStatus()}
          className="cursor-pointer flex items-center justify-center"
        >
          {admin.status === "active" ? (
            <AiOutlineStop className="hover:text-red-500 text-red-500 bg-white rounded-full hover:shadow-md hover:shadow-black" />
          ) : (
            <AiFillCheckCircle className="hover:text-green-100 text-white bg-green-500 rounded-full hover:shadow-md hover:shadow-black" />
          )}
        </a>
      )}
    </div>
  );
}

export default AdminConfig;
