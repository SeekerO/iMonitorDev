import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./components/Testing/authHere";
import { MsalProvider } from "@azure/msal-react";
const msalinstance = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="860934734518-i9sst4ljo2qheba5cfkj2db427edl1id.apps.googleusercontent.com">
    <MsalProvider instance={msalinstance}>
      <HashRouter>
        <App instance={msalinstance} />
      </HashRouter>
    </MsalProvider>
  </GoogleOAuthProvider>
);
