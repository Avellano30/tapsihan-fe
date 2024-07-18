import React from 'react';
import ReactDOM from 'react-dom/client';
import Orders from './pages/Orders.tsx';
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import PrivateRoutes from './utils/PrivateRoute.tsx';
import Products from './pages/Products.tsx';
import Users from './pages/Users.tsx';
import Settings from './pages/Settings.tsx';
import Login from './pages/Login.tsx';

export const endpoint = import.meta.env.VITE_ENDPOINT || 'http://localhost:8080';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Login />} />
      <Route element={<PrivateRoutes />}>
        <Route path='/orders' element={<Orders />} />
        <Route path='/products' element={<Products />} />
        <Route path='/users' element={<Users />} />
        <Route path='/settings' element={<Settings />} />
      </Route>
    </>
  )
);

const theme = createTheme({
  /** Put your mantine theme override here */
  // fontFamily: 'Inter, sans-serif',
});

const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <MantineProvider theme={theme}>
        <Notifications limit={1} zIndex={1000} position='top-right' miw={250} w={"fit-content"} />
        <RouterProvider router={router} />
      </MantineProvider>
    </React.StrictMode>
  );
} else {
  console.error('Root container not found');
}
