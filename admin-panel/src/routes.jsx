import React, { Suspense, Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import { useAuth } from "./store/auth";

const renderRoutes = (routes = []) => (
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

const AppRoutes = () => {
  const { dynamicMenuItems } = useAuth();

  if (!dynamicMenuItems.length) {
    return <Loader />;
  }

  return renderRoutes(dynamicMenuItems);
};

export default AppRoutes;
