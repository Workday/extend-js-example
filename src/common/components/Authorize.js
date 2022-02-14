import React, { useEffect, useState } from 'react';
import querystring from 'query-string';

import { type } from "@workday/canvas-kit-react/tokens";

import { fetchAndStoreAccessToken } from '../wcp/WcpAuthorization';

const Authorize = () => {
  const [authorizationErrorMessage, setAuthorizationErrorMessage] = useState('');

  useEffect(() => {
    try {
      const authorizationParams = querystring.parse(window.location.search);
      fetchAndStoreAccessToken(authorizationParams)
        .then(() => {
          window.location.replace('/');
        })
        .catch((error) => {
          setAuthorizationErrorMessage(error);
          console.error(error);
        });
    }
    catch (error) {
      setAuthorizationErrorMessage(error);
      console.error(error);
    }
  }, []);

  return <p style={type.levels.subtext.large}>{authorizationErrorMessage.toString()}</p>;
};

export default Authorize;
