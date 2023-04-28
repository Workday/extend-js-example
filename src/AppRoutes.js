import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { isAuthenticated } from './common/wcp/WcpAuthorization';

import Authorize from './common/components/Authorize';
import ErrorNotAuthenticated from './common/components/ErrorNotAuthenticated';
import ErrorAppNotConfigured from './common/components/ErrorAppNotConfigured';
import ErrorNotFound from './common/components/ErrorNotFound';
import Home from './common/components/Home';

import BadgeGenerator from './app-examples/badge-generator';
import SpotBonus from './app-examples/spot-bonus';

const AppRoutes = () => {

  const isBadgeGeneratorAppConfigured = () => {
    return process.env.REACT_APP_EXTEND_APP_REFERENCE_ID_BADGE_GENERATOR ? true : false;
  };

  return (
    <Routes>
      <Route exact={true} path="/" element={<Home />} />
      <Route path="/authorize" element={<Authorize />} />
      <Route path="/spot-bonus" element={isAuthenticated() ? <SpotBonus /> : <ErrorNotAuthenticated />} />
      <Route path="/badge-generator" element={isAuthenticated() ? (isBadgeGeneratorAppConfigured() ? <BadgeGenerator/> : <ErrorAppNotConfigured/>) : <ErrorNotAuthenticated />} />
      <Route element={ErrorNotFound} />
    </Routes>
  );
};

export default AppRoutes;
