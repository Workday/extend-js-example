import * as React from 'react';

import styled from '@emotion/styled';

import { PrimaryButton } from "@workday/canvas-kit-react/button";
import { borderRadius, space, type } from "@workday/canvas-kit-react/tokens";
import { AccentIcon } from "@workday/canvas-kit-react/icon";
import { toolboxIcon } from '@workday/canvas-accent-icons-web';

const ErrorNotFound = () => {
  return (
    <ErrorContainer>
      <ErrorSubContainer>
        <AccentIcon icon={toolboxIcon} size={128} />
        <ErrorHeader>Sorry, the page you requested was not found.</ErrorHeader>
        <ErrorMessage>The page you are looking for may have been removed or renamed.</ErrorMessage>
        <PrimaryButton onClick={() => { window.location.assign('/'); }}>Go to Home</PrimaryButton>
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

export default ErrorNotFound;
