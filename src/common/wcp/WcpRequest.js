import { getAccessToken } from './WcpTokenStore';

export const ContentType = {
  APPLICATION_JSON: "application/json",
  APPLICATION_FORM_ENCODED: "application/x-www-form-urlencoded",
  MULTIPART_FORM_DATA: "multipart/form-data"
};

export const HttpHeader = {
  AUTHORIZATION: "Authorization",
  CONTENT_DISPOSITION: "Content-Disposition",
  CONTENT_TYPE: "Content-Type",
  IMAGE_MAX_DIMENSION: "x-wd-image-max-dimension"
};

export const HttpMethod = {
  DELETE: "DELETE",
  GET: "GET",
  PATCH: "PATCH",
  POST: "POST",
  PUT: "PUT"
};

export const executeRequest = async (method, path, headers, body) => {
  return makeRequest(method, path, headers, body).then((response) => response.json());
};

export const executeRequestForFile = async (method, path, headers, body) => {
  return makeRequest(method, path, headers, body).then((response) => response.blob());
};

const makeRequest = async (method, path, headers, body) => {
  const requestHeaders = {
    [HttpHeader.AUTHORIZATION]: `Bearer ${getAccessToken()}`,
    ...headers
  }

  return fetch(`https://${process.env.REACT_APP_WCP_API_GATEWAY_HOST}/${path}`, {
    method: method,
    headers: requestHeaders,
    body: body
  });
};
