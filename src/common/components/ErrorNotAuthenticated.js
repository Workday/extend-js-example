import * as React from 'react';

import styled from '@emotion/styled';

import { PrimaryButton } from "@workday/canvas-kit-react/button";
import { borderRadius, space, type } from "@workday/canvas-kit-react/tokens";
import { AccentIcon } from "@workday/canvas-kit-react/icon";
import { lockKeyholeIcon } from '@workday/canvas-accent-icons-web';

import { getAuthorizationUrl } from '../wcp/WcpAuthorization';

const ErrorNotAuthenticated = () => {
  return (
    <ErrorContainer>
      <ErrorSubContainer>
        <AccentIcon icon={lockKeyholeIcon} size={128} />
        <ErrorHeader>You are not authorized to view this page.</ErrorHeader>
        <ErrorMessage style={type.levels.subtext.large}>Please login and try again.</ErrorMessage>
        <PrimaryButton onClick={() => { window.location.assign(getAuthorizationUrl()); }}>Login</PrimaryButton>
      </ErrorSubContainer>
    </ErrorContainer>
  );
};

const ErrorContainer = styled("div") ({
  alignItems: "center",
  display: "flex",
  justifyContent: "center",
  marginTop: space.xxxl
});

const ErrorHeader = styled("h2") ({
  ...type.levels.heading.medium
});

const ErrorMessage = styled("p") ({
  ...type.levels.subtext.large,
  marginBottom: space.l
});

const ErrorSubContainer = styled("div") ({
  borderRadius: borderRadius.m,
  padding: space.xl,
  textAlign: "center"
});

export default ErrorNotAuthenticated;
