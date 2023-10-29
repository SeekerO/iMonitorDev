import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>

  // </React.StrictMode>
  <GoogleOAuthProvider clientId="860934734518-i9sst4ljo2qheba5cfkj2db427edl1id.apps.googleusercontent.com">
    <HashRouter>
      <App />
    </HashRouter>
  </GoogleOAuthProvider>
);
