import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styled from '@emotion/styled';
import { colors, space, type } from "@workday/canvas-kit-react/tokens";

import { Avatar } from '@workday/canvas-kit-react/avatar';
import { PrimaryButton, SecondaryButton } from "@workday/canvas-kit-react/button";

import { fetchPersonPhotoAsDataUri, fetchPersonPreferredName } from '../data/PersonData';
import { getAuthorizationUrl, isAuthenticated, logout } from '../wcp/WcpAuthorization';

const AppHeader = () => {
  const [avatarPhotoUri, setAvatarPhotoUri] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const setPersonAvatar = async() => {
      if(isAuthenticated() && !avatarPhotoUri) {
        const personPhotoUri = await fetchPersonPhotoAsDataUri('me');
        setAvatarPhotoUri(personPhotoUri);
      }
    };
    setPersonAvatar();
  }, [avatarPhotoUri]);

  useEffect(() => {
    const setPersonUserName = async() => {
      if(isAuthenticated() && !userName) {
        const personPreferredName = await fetchPersonPreferredName('me');
        setUserName(personPreferredName);
      }
    };
    setPersonUserName();
  }, [userName]);

  return (
    <HeaderContainer>
      <Link to="/">
        <LogoContainer>
          <Logo>
            <img src='./gms-logo.png' alt="GMS" height="48px" />
            <Title id="top" tabIndex={-1}>
              Global Modern Services
            </Title>
          </Logo>
        </LogoContainer>
      </Link>
      <ActionsContainer>
        {
          isAuthenticated() ?
            (
              <React.Fragment>
                <Avatar url={avatarPhotoUri} size={Avatar.Size.l} />
                <PersonName>{userName}</PersonName>
                <SecondaryButton onClick={() => { logout(); window.location.assign('/'); }}>Logout</SecondaryButton>
              </React.Fragment>
            ) :
            (
              <PrimaryButton onClick={() => { window.location.assign(getAuthorizationUrl()); }}>Login</PrimaryButton>
            )
        }
      </ActionsContainer>
    </HeaderContainer>
  );
};

const ActionsContainer = styled('div')({
  alignItems: "center",
  display: "flex",
  flex: "1 0 auto",
  height: "100%",
  justifyContent: "flex-end",
  marginRight: space.m,
  "> *": {
    marginLeft: space.m
  }
});

const HeaderContainer = styled('div')({
  alignItems: "center",
  background: colors.frenchVanilla100,
  boxSizing: "border-box",
  boxShadow: "0px 2px 4px 0 rgb(0 0 0 / 8%)",
  color: colors.blackPepper400,
  display: "flex",
  fontFamily: type.properties.fontFamilies.default,
  fontSize: type.properties.fontSizes[14],
  lineHeight: type.properties.fontSizes[20],
  height: space.xxl,
  position: "relative"
});

const Logo = styled('div')({
  display: 'flex',
  alignItems: 'center',
  height: space.xxl,
  paddingLeft: space.m,
});

const LogoContainer = styled('div')({
  display: 'inline-block',
  "&:hover": {
    background: colors.soap300
  }
});

const PersonName = styled('span')({
  fontFamily: type.properties.fontFamilies.default,
  fontSize: type.properties.fontSizes[14],
  fontWeight: type.properties.fontWeights.medium,
  lineHeight: type.properties.fontSizes[20]
});

const Title = styled('p')({
  color: colors.blueberry400,
  fontSize: type.properties.fontSizes[18],
  fontWeight: type.properties.fontWeights.regular,
  padding: `${space.xxs} ${space.s}`,
  paddingRight: space.l,
  marginLeft: space.s,
  whiteSpace: 'nowrap'
});

export default AppHeader;

