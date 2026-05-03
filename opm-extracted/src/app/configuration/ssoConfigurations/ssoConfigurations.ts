// Source: decompiled/deobfuscated.js
// Original path: ./src/app/configuration/ssoConfigurations/ssoConfigurations.ts
// Extracted by opm-extracted/tools/extract.mjs

function loggerCallback(logLevel, message) {
  // console.log(message);
}
function MSALInstanceFactory() {
  const isIE = false;
  return new PublicClientApplication({
    auth: {
      clientId: "5b5dd86d-c12a-46b6-9ab6-6bdbcbb4ba11",
      // redirectUri: 'http://localhost:4200',
      // postLogoutRedirectUri: 'http://localhost:4200'
      redirectUri: document.location.origin,
      postLogoutRedirectUri: "https://microsoft.com"
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE // set to true for IE 11
    },
    system: {
      allowNativeBroker: false,
      loggerOptions: {
        loggerCallback,
        logLevel: Logger_LogLevel.Info,
        piiLoggingEnabled: false
      }
    }
  });
}
function MSALInterceptorConfigFactory() {
  const protectedResourceMap = new Map();
  protectedResourceMap.set("https://graph.microsoft.com/v1.0/me", ["user.read"]);
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}
function MSALGuardConfigFactory() {
  return {
    interactionType: InteractionType.Redirect
  };
}
