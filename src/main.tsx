import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import './styles/index.scss';

import App from './components/App/App';
import Favoris from './components/Profil/Favoris';
import Profil from './components/Profil/Profil';
import Apptest from './components/App/Apptest';
import store from './store';
import Recipes from './components/Recipes/Recipes';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index path="/profil" element={<Profil />} />
      <Route path="/favoris" element={<Favoris />} />
      <Route path="/login" element={<Apptest />} />
      {/* Modifier les routes et l'élement Apptest en fonction de vos taches */}
      <Route index element={<Apptest />} />
      <Route path="recipes" element={<Recipes />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
