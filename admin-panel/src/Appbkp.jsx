import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Authprovider, useAuth } from "./store/auth.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Waves from "node-waves";
import "node-waves/dist/waves.css";

const AppRoutes = () => {
  const { dynamicMenuItems } = useAuth(); // Fetch dynamic routes within context

  return (
    <Routes>
      {dynamicMenuItems.length > 0 &&
        dynamicMenuItems.map((route, index) => {
          const Component = route.element;
          return <Route key={index} path={route.path} element={<Component />} />;
        })}
    </Routes>
  );
};

const App = () => {
  Waves.init(); // Initialize Waves

  return (
    <Authprovider>
      <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
        <Suspense fallback={<div>Loading...</div>}>
          <AppRoutes /> {/* Use a separate component for routes */}
        </Suspense>
        <ToastContainer />
      </BrowserRouter>
    </Authprovider>
  );
};

export default App;
