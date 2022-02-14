export const AppSessionVariables = {
  CODE_VERIFIER: 'code-verifier',
  STATE: 'state',
  WCP_ACCESS_TOKEN: 'wcp-access-token'
};

export const clearSession = () => {
  sessionStorage.clear();
};

export const setSessionVariable = (sessionVariableKey, value) => {
  return sessionStorage.setItem(sessionVariableKey, value);
};

export const getSessionVariable = (cookieKey) => {
  return sessionStorage.getItem(cookieKey);
};

export const removeSessionVariable = (sessionVariableKey) => {
  sessionStorage.removeItem(sessionVariableKey);
};

export default AppSessionVariables;
