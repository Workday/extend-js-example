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

const GRAPH_API_VERSION = 'v1';

export const executeRestApiRequest = async (method, path, headers, body) => {
  return makeRestApiRequest(method, path, headers, body).then((response) => response.json());
};

export const executeRestApiRequestForFile = async (method, path, headers, body) => {
  return makeRestApiRequest(method, path, headers, body).then((response) => response.blob());
};

export const executeGraphApiRequest = async(query, variables) => {
  return makeGraphApiRequest(query, variables).then((response) => response.json());
};

export const executeOrchestration = async(method, headers, appId, orchestrationId, body) => {
  return makeRestApiRequest(method, `orchestrate/v1/apps/${appId}/orchestrations/${orchestrationId}/launch`, headers, body);
};

const makeGraphApiRequest = async (query, variables) => {
  const requestHeaders = {
    [HttpHeader.AUTHORIZATION]: `Bearer ${getAccessToken()}`
  };

  return fetch(`https://${process.env.REACT_APP_WCP_API_GATEWAY_HOST}/graphql/${GRAPH_API_VERSION}`, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({
      query,
      variables: variables
    })
  });
};

const makeRestApiRequest = async (method, path, headers, body) => {
  const requestHeaders = {
    [HttpHeader.AUTHORIZATION]: `Bearer ${getAccessToken()}`,
    ...headers
  };

  return fetch(`https://${process.env.REACT_APP_WCP_API_GATEWAY_HOST}/${path}`, {
    method: method,
    headers: requestHeaders,
    body: body
  });
};
