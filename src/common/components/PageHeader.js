import React from 'react';

import styled from '@emotion/styled';
import { colors, space, type } from "@workday/canvas-kit-react/tokens";

const PageHeader = (props) => {
  return (
    <PageHeaderContainer>
      <PageTitle>{ props.title }</PageTitle>
    </PageHeaderContainer>
  );
};

const PageHeaderContainer = styled('div')({
  backgroundImage: `linear-gradient(to bottom right, ${colors.blueberry500}, ${colors.blueberry400})`,
  display: "flex",
  height: space.xxxl,
  overflow: "hidden",
  padding: `0 ${space.xl}`
});

const PageTitle = styled('h2')({
  color: colors.frenchVanilla100,
  display: "block",
  flex: 1,
  fontFamily: type.properties.fontFamilies.default,
  fontSize: type.properties.fontSizes[28],
  fontWeight: type.properties.fontWeights.bold,
  lineHeight: type.properties.fontSizes[56],
  padding: `${space.xs} 0`,
  margin: 0,
  whiteSpace: "nowrap"
});

export default PageHeader;
