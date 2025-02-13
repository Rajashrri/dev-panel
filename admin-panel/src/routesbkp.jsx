import React, { useState, useEffect, Suspense, Fragment, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';
import AuthGuard from 'store/AuthGuard';
import { useAuth } from 'store/auth';

const AppRoutes = () => {
  const [dynamicRoutes, setDynamicRoutes] = useState([]); // Initialize as an empty array
  const BASE_URL = "/dashboard";
  const { fetchData } = useAuth();
  console.log(fetchData);
  setDynamicRoutes(fetchData);
  // const fetchData = async () => {
  //   const custid = localStorage.getItem("custid");
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/form/getroutes2/${custid}`, {
  //       method: "GET",
  //     });

  //     if (!response.ok) throw new Error(`Error: ${response.status}`);

  //     const result = await response.json();

  //     console.log("Fetched Routes:", result);

  //     const fetchedRoutes = Array.isArray(result.msg) ? result.msg : [];
  //     setDynamicRoutes(fetchedRoutes);
      
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setDynamicRoutes([]); // Set an empty array in case of error
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const staticRoutes = [
    { exact: true, path: "/auth/signin", element: lazy(() => import("./views/auth/SignIn")) },
    { exact: true, path: "/auth/otp-verify", element: lazy(() => import("./views/auth/otpverify")) },
    { exact: true, path: "/auth/forgotpassword", element: lazy(() => import("./views/auth/Forgotpassword")) },
    { exact: true, path: "/auth/resetpassword/:token?", element: lazy(() => import("./views/auth/Resetpassword")) },
    { exact: true, path: "logout", element: lazy(() => import("./views/auth/Logout")) },
    {
      path: "*",
      layout: AdminLayout,
      routes: [
        { exact: true, path: "*", element: () => <Navigate to={BASE_URL} /> },
        { exact: true, path: "/dashboard", guard: AuthGuard, element: lazy(() => import("./views/dashboard/index")) },
      ],
    },
  ];

  const combinedRoutes = [
    ...staticRoutes,
    ...(Array.isArray(dynamicRoutes)
      ? dynamicRoutes
          .filter(route => route.pagename) // Only include valid routes
          .map(route => ({
            path: `/${route.pagename}`,
            exact: true,
            element: lazy(() => import(`./views/module-preview/AddModulePreview`)),
          }))
      : []),
  ];

  console.log("Combined Routes:", combinedRoutes); // Verify combinedRoutes structure

  // Ensure `combinedRoutes` is an array before passing it to `renderRoutes`
  return renderRoutes(Array.isArray(combinedRoutes) ? combinedRoutes : []);
};

export const renderRoutes = (routes = []) => {
  if (!Array.isArray(routes)) {
    console.error("Routes should be an array, received:", routes);
    return null; // Return null if routes is invalid
  }

  return (
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
                  <Layout>{route.routes ? renderRoutes(route.routes) : <Element />}</Layout>
                </Guard>
              }
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
