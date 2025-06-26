export const msalConfig = {
  auth: {
    clientId: "ba343fef-be4a-455d-8d99-75b732cbdda6", 
    authority:
      "https://login.microsoftonline.com/8d72c235-dd33-4381-b69c-95c5221f9041", 
    redirectUri: "http://localhost:10132", 
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["Files.ReadWrite.All", "Sites.ReadWrite.All", "User.Read"],
};