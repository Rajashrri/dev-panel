import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import AuthGuard from 'store/AuthGuard';
import { BASE_URL } from './config/constant';
import { useAuth } from 'store/auth';

export const renderRoutes = (routes = []) => (

  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);


const routes = [
  {
    exact: 'true',
    path: '/auth/signin',
    element: lazy(() => import('./views/auth/SignIn'))
  },
  {
    exact: 'true',
    path: '/auth/otp-verify',
    element: lazy(() => import('./views/auth/otpverify'))
  },
  {
    exact: 'true',
    path: '/auth/forgotpassword',
    element: lazy(() => import('./views/auth/Forgotpassword'))
  },
  {
    exact: 'true',
    path: '/auth/resetpassword/:token?',
    element: lazy(() => import('./views/auth/Resetpassword'))
  },
  {
    exact: 'true',
    path: 'logout',
    element: lazy(() => import('./views/auth/Logout'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      },

      {
        exact: 'true',
        path: '/dashboard',
        guard: AuthGuard, 
        element: lazy(() => import('./views/dashboard/index'))
      },
     
      {
        exact: 'true',
        path: '/module/add-module',
        guard: AuthGuard, 
        element: lazy(() => import('./views/module-preview/AddModulePreview'))
      },

    ]
  }
];

export default routes;
