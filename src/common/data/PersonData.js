import { blobToDataURL } from '../utils/FileUtils';
import { executeRequest, executeRequestForFile, HttpMethod } from '../wcp/WcpRequest';

const PERSON_API_PATH = 'person/v2/people';

export const fetchPersonPhotoAsDataUri = async(personId) => {
  const fetchPersonPhotoId = async(personId) => {
    return executeRequest(HttpMethod.GET, `${PERSON_API_PATH}/${personId}/photos`)
      .then((response) => {
        // api will return the full photo URL
        // parse out the WID for the photo only
        const fullUri = response.data[0] ? response.data[0].href : '';
        if(fullUri !== '') {
          const photoId = fullUri.substring(fullUri.lastIndexOf('/') + 1);
          return photoId;
        }
        else return '';
      });
  };

  const fetchPhotoUri = async(photoId) => {
    const photo = await executeRequestForFile(HttpMethod.GET, `${PERSON_API_PATH}/${personId}/photos/${photoId}`);
    return photo ? blobToDataURL(photo) : null;
  };

  const photoId = await fetchPersonPhotoId(personId);
  return photoId ? await fetchPhotoUri(photoId) : null;
};

export const fetchPersonPreferredName = async(personId) => {
  return executeRequest(HttpMethod.GET, `${PERSON_API_PATH}/${personId}/preferredName`)
    .then((response) => {
      return response.data[0].descriptor || '';
    })
    .catch(() => {
      return null;
    });
};