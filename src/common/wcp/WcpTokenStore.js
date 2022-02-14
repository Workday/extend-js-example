import { AppSessionVariables, getSessionVariable, removeSessionVariable, setSessionVariable } from '../utils/AppSession';

/**
 * IMPORTANT NOTE:
 * 
 * Workday Cloud Platform provides JWT tokens that can be used to make authorized requests to the platform.
 * 
 * There are many ways to store tokens in browser-based single-page applications such as this one.
 * In this educational example, access tokens are stored in a client-side session variable since there is 
 * no server-side component. 
 * 
 * Consider implementing server-side token storage leveraging your web server for additional security.
 * 
 * Read more about OWASP's recommendations for JWT token handling:
 * https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
 * 
 * You should evaluate all options for storage based on your client and web server configurations in order to 
 * ensure your apps are properly secured per your requirements.
 **/
export const getAccessToken = () => {
  return getSessionVariable(AppSessionVariables.WCP_ACCESS_TOKEN);
};

export const removeAccessToken = () => {
  removeSessionVariable(AppSessionVariables.WCP_ACCESS_TOKEN);
};

export const setAccessToken = (token) => {
  setSessionVariable(AppSessionVariables.WCP_ACCESS_TOKEN, token);
};
