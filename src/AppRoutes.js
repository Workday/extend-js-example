import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { isAuthenticated } from './common/wcp/WcpAuthorization';

import Authorize from './common/components/Authorize';
import ErrorNotAuthenticated from './common/components/ErrorNotAuthenticated';
import ErrorAppNotConfigured from './common/components/ErrorAppNotConfigured';
import ErrorNotFound from './common/components/ErrorNotFound';
import Home from './common/components/Home';

import BadgeGenerator from './app-examples/badge-generator';
import SpotBonus from './app-examples/spot-bonus';

const AppRoutes = () => {

  const isSpotBonusAppConfigured = () => {
    return process.env.REACT_APP_EXTEND_APP_REFERENCE_ID_SPOT_BONUS ? true : false;
  };

  const isBadgeGeneratorAppConfigured = () => {
    return process.env.REACT_APP_EXTEND_APP_REFERENCE_ID_BADGE_GENERATOR ? true : false;
  };

  return (
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route path="/authorize" component={Authorize} />
      <Route path="/spot-bonus" component={isAuthenticated() ? (isSpotBonusAppConfigured() ? SpotBonus : ErrorAppNotConfigured) : ErrorNotAuthenticated} />
      <Route path="/badge-generator" component={isAuthenticated() ? (isBadgeGeneratorAppConfigured() ? BadgeGenerator : ErrorAppNotConfigured) : ErrorNotAuthenticated} />
      <Route component={ErrorNotFound} />
    </Switch>
  );
};

export default AppRoutes;
