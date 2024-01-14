// msalConfig.js
const Id = process.env.REACT_APP_AZURE_CLIENT_ID;
export const msalConfig = {
  auth: {
    clientId: Id,
    authority: "https://login.microsoftonline.com/stamaria.sti.edu.ph",
    redirectUri: "http://localhost:3000/iMonitorDev",
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
};

export const loginRequest = {
  scopes: ["profile", "user.read", "email", "offline_access", "openid"],
};
