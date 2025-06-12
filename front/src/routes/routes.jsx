import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from '../pages/mainPage/mainPage';
import ProfilePage from '../pages/profilePage/profilePage';
import SettingsPage from '../pages/settingsPage/settingsPage';
import ReferalPage from '../pages/referalPage/referalPage';
import TopPage from '../pages/topPage/topPage';

const RoutesComponent = (props) => {
    return <Routes>
      <Route
        path='/'
        element={<MainPage />}
      />
      <Route
        path='/profile'
        element={<ProfilePage />}
      />
      <Route
        path='/settings'
        element={<SettingsPage />}
      />
      <Route
        path='/referals'
        element={<ReferalPage />}
      />
      <Route
        path='/top-page'
        element={<TopPage />}
      />
    </Routes>
    
};

export default RoutesComponent;
