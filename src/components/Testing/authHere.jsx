// msalConfig.js
export const msalConfig = {
  auth: {
    clientId: "dbceb318-ae9e-4f95-87fa-e064609db28b",
    // clientId: "0ba355cc-d023-478b-84dd-5e716f734b64",
    authority: "https://login.microsoftonline.com/stamaria.sti.edu.ph",
  },
  cache: {
    cacheLocation: "sessionStorage", // or 'localStorage'
  },
};

export const loginRequest = {
  scopes: ["profile", "user.read", "email", "offline_access", "openid"],
};
