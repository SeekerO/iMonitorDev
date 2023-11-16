import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./components/authHere";
import { MsalProvider } from "@azure/msal-react";
const msalinstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <MsalProvider instance={msalinstance}>
    <HashRouter>
      <App instance={msalinstance} />
    </HashRouter>
  </MsalProvider>
);
