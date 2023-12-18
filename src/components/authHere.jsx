// msalConfig.js
export const msalConfig = {
  auth: {
    clientId: "0ba355cc-d023-478b-84dd-5e716f734b64",
    // clientId: "0ba355cc-d023-478b-84dd-5e716f734b64",
    authority: "https://login.microsoftonline.com/stamaria.sti.edu.ph",
    redirectUri: "http://localhost:3000/iMonitorDev",
  },
  cache: {
    cacheLocation: "sessionStorage", // or 'localStorage'
  },
};

export const loginRequest = {
  scopes: ["profile", "user.read", "email", "offline_access", "openid"],
};
