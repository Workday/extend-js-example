import base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';
import jwtDecode from 'jwt-decode';

import { AppSessionVariables, clearSession, getSessionVariable, setSessionVariable } from '../utils/AppSession';
import { generateRandomString } from '../utils/StringUtils';
import { ContentType, HttpHeader, HttpMethod } from './WcpRequest';
import { getAccessToken, removeAccessToken, setAccessToken } from './WcpTokenStore';

export const fetchAndStoreAccessToken = async (params) => {
  const responseAuthorizationCode = params.code;
  const responseState = params.state;

  if (responseAuthorizationCode == null) {
    throw new Error('Authorization code not returned from authorize endpoint.');
  }

  if (responseState == null || responseState !== getSessionVariable(AppSessionVariables.STATE)) {
    throw new Error(`State from authorize endpoint does not match stored value. Returned value: ${responseState}, Stored value : ${getSessionVariable(AppSessionVariables.STATE)}`);
  }

  const headers = {
    [HttpHeader.AUTHORIZATION]: `ID ${btoa(process.env.REACT_APP_WCP_API_CLIENT_ID)}`,
    [HttpHeader.CONTENT_TYPE]: ContentType.APPLICATION_FORM_ENCODED
  };

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: responseAuthorizationCode,
    code_verifier: getSessionVariable(AppSessionVariables.CODE_VERIFIER)
  });

  return fetch(`https://auth.${process.env.REACT_APP_WCP_API_GATEWAY_HOST}/v1/token`, {
    method: HttpMethod.POST,
    contentType: ContentType.APPLICATION_JSON,
    headers: headers,
    body: body
  }).then(response => response.json())
    .then(responseJson => {
      clearSession();
      if (responseJson.access_token) {
        setAccessToken(responseJson.access_token);
      }
      else {
        throw new Error('Unable to parse access_token from authorize endpoint response. Ensure your Workday Cloud Platform API Client is configured correctly.');
      }
    });
}

export const getAuthorizationUrl = () => {
  const codeVerifier = generateRandomString(64);
  const encryptedCodeVerifier = sha256(codeVerifier);
  const codeChallenge = base64.stringify(encryptedCodeVerifier).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const state = generateRandomString(64);
  
  logout();

  setSessionVariable(AppSessionVariables.CODE_VERIFIER, codeVerifier);
  setSessionVariable(AppSessionVariables.STATE, state);

  const apiClientId = process.env.REACT_APP_WCP_API_CLIENT_ID;
  const apiClientRedirectUri = process.env.REACT_APP_WCP_API_CLIENT_REDIRECT_URI;
  const defaultTenantAlias = process.env.REACT_APP_WCP_DEFAULT_TENANT_ALIAS;

  let redirectUri = `https://auth.${process.env.REACT_APP_WCP_API_GATEWAY_HOST}/v1/authorize`
    + `?client_id=${apiClientId}`
    + `&response_type=code&code_challenge_method=S256&code_challenge=${codeChallenge}`
    + `&state=${state}`
    + `&redirect_uri=${encodeURIComponent(apiClientRedirectUri)}`;

  if (defaultTenantAlias != null && defaultTenantAlias !== '') {
    redirectUri += `&tenantAlias=${defaultTenantAlias}`;
  }

  return redirectUri;
};

export const isAuthenticated = () => {
  const token = getStoredAccessToken();
  
  return (token && token.expirationTime && token.expirationTime >= (Date.now() / 1000));
};

export const logout = () => {
  clearSession();
  removeAccessToken();
};

const getStoredAccessToken = () => {
  const accessToken = getAccessToken();
  if (accessToken == null) {
    return null;
  }
  const parsedToken = parseAccessToken(accessToken);

  return parsedToken;
};

const parseAccessToken = (tokenToParse) => {
  const decodedToken = jwtDecode(tokenToParse);
  const parsedToken = {
    issuedTime: decodedToken.iat,
    expirationTime: decodedToken.exp,
    user: decodedToken.sub,
  };

  return parsedToken;
};
