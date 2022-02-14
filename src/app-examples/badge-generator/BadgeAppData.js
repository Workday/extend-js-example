import { blobToDataURL } from '../../common/utils/FileUtils';
import { executeRequest, executeRequestForFile, ContentType, HttpHeader, HttpMethod } from '../../common/wcp/WcpRequest';

const BADGE_APP_ID = process.env.REACT_APP_EXTEND_APP_REFERENCE_ID_BADGE_GENERATOR;

export const getCurrentBadgeData = async (workerId) => {
  const badgesResponse = await executeRequest(
    HttpMethod.GET, 
    `apps/${BADGE_APP_ID}/v1/badges?worker=${workerId}&limit=100`, 
    { Accept: ContentType.APPLICATION_JSON });

  const badges = badgesResponse.data ? badgesResponse.data : [];
  const currentBadge = badges.reduce((r, a) => {
    return r.dateUploaded > a.dateUploaded ? r : a;
  }, []);

  return currentBadge;
};

export const getBadgeAttachment = async (badgeId) => {
  const attachmentResponse = await executeRequestForFile(
    HttpMethod.GET, 
    `apps/${BADGE_APP_ID}/v1/badges/${badgeId}`)
  if (attachmentResponse) {
    return blobToDataURL(attachmentResponse);
  }
  else return null;
};

export const getWorkerData = async (workerId) => {
  const workerDataResponse = await executeRequest(
    HttpMethod.GET, 
    `staffing/v3/workers/${workerId}`);
  return workerDataResponse;
};

export const postBadge = async(formData, fileName) => {
  const response = await executeRequest(
    HttpMethod.POST, 
    `apps/${BADGE_APP_ID}/v1/badges`, 
    { 
      [HttpHeader.CONTENT_DISPOSITION]: `attachment; filename=${fileName} filename*=utf-8''${fileName}`,
      // set the maximum image edge size to 1024px.
      // the default badge size has smaller dimensions than this,
      // but we want to make sure we attempt to resize images if
      // they somehow happen to be larger.
      [HttpHeader.IMAGE_MAX_DIMENSION]: '1024'
    }, 
    formData);
  return response;
};
