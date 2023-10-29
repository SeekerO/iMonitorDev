import { useMsal } from "@azure/msal-react";
import React from "react";
import { msalConfig, loginRequest } from "./Testing/authHere";

function TestingAzure({ instance }) {
  const { accounts } = useMsal();
  const activeaccount = instance.getActiveAccount();

  const login = async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.log("Authentication error", error);
    }
  };

  console.log(accounts);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-[25%]  text-white backdrop-blur-[2px] flex justify-center items-center">
      <div className="grid gap-4  text-center">
        <label className="font-bold text-[30px] "> Testing Azure Login </label>
        <button
          onClick={login}
          className="bg-blue-300 p-2 rounded-md text-black font-semibold"
        >
          LOGIN USING AZURE
        </button>

        <label>Current Loggined: </label>
      </div>
    </div>
  );
}

export default TestingAzure;
