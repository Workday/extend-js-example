import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import './App.css';

import AppHeader from './common/components/AppHeader';
import AppRoutes from './AppRoutes';

const App = () => {
  return (
    <BrowserRouter>
      <AppHeader />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
