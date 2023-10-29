// msalConfig.js
export const msalConfig = {
  auth: {
    clientId: "dbceb318-ae9e-4f95-87fa-e064609db28b",
    authority: "https://login.microsoftonline.com/stamaria.sti.edu.ph",
  },
  cache: {
    cacheLocation: "sessionStorage", // or 'localStorage'
  },
};

export const loginRequest = {
  scopes: ["profile", "user.read", "email", "offline_access", "openid"],
};
