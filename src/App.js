import React from 'react';
import { Route } from 'react-router-dom';
import loadable from '@loadable/component';
import Menu from './components/Menu';
import RouteListener from './containers/RouteListener';

const RedPage = loadable(() => import('./pages/RedPage'));
const BluePage = loadable(() => import('./pages/BluePage'));
const PhotoPage = loadable(() => import('./pages/PhotoPage'));
const App = () => {
  return (
    <div>
      <Menu />
      <hr />
      <Route path="/red" component={RedPage} />
      <Route path="/blue" component={BluePage} />
      <Route path="/photo/:id" component={PhotoPage} />
      <RouteListener />
    </div>
  );
};

export default App;
