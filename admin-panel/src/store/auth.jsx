import React, { createContext, useContext, useEffect, useState, lazy } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

import AuthGuard from './AuthGuard';
import {
    dashboardImg1,
    dashboardImg2,
    dashboardImg3,
    dashboardImg4,
    adminTemplate,
    createProject,
} from "../images";

// Create Auth Context
export const AuthContext = createContext(null);

// Auth Provider
export const Authprovider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [token1, setToken1] = useState(localStorage.getItem("tokenotp"));
    const [user, setUser] = useState("");
    const [dynamicMenuItems, setDynamicMenuItems] = useState([]);
    const [dynamicsidebarItems, setDynamicsidebarItems] = useState({
        items: [], 
      });

    // Helper functions to manage tokens
    const storeTokenInLSotp = (serverToken1) => {
        setToken1(serverToken1);
        localStorage.setItem("tokenotp", serverToken1);
    };

    const storeTokenInLScustid = (serverToken1) => {
        setToken1(serverToken1);
        localStorage.setItem("custid", serverToken1);
    };

    const storeTokenInLS = (serverToken) => {
        setToken(serverToken);
        localStorage.setItem("token", serverToken);
    };

    const LogoutUser = () => {
        setToken("");
        localStorage.removeItem("token");
    };

    const Destroyotpuser = () => {
        setToken1("");
        localStorage.removeItem("tokenotp");
    };

    const isLoggedIn = !!token;

    const fetchDynamicRoutes = async () => {
      const custid = localStorage.getItem("custid");
      if(!custid){
          const staticRoutes = [
            { exact: "true", path: "/auth/signin", element: lazy(() => import("../views/auth/SignIn")) },
            { exact: "true", path: "/auth/otp-verify", element: lazy(() => import("../views/auth/otpverify")) },
            { exact: "true", path: "/auth/forgotpassword", element: lazy(() => import("../views/auth/Forgotpassword")) },
            { exact: "true", path: "/auth/resetpassword/:token?", element: lazy(() => import("../views/auth/Resetpassword")) },
            { exact: "true", path: "/logout", element: lazy(() => import("../views/auth/Logout")) },
            {
                path: "*",
                layout: AdminLayout,
                routes: [
                { path: "*", exact: "true", element: () => <Navigate to="/dashboard" /> },
                {
                    exact: "true",
                    path: "/dashboard",
                    guard: AuthGuard,
                    element: lazy(() => import("../views/dashboard/index")),
                },
                {
                    exact: "true",
                    path: "/module/add-module",
                    guard: AuthGuard,
                    element: lazy(() => import("../views/module-preview/AddModulePreview")),
                },
              
                ],
            },
          ];    
          setDynamicMenuItems(staticRoutes);
          return staticRoutes;
      }else{
        try {
          const response = await fetch(`http://localhost:5000/api/form/getroutes2/${custid}`, {
              method: "GET",
          });

          if (!response.ok) throw new Error(`Error: ${response.status}`);

          const result = await response.json();

          const dynamicRoutes = Array.isArray(result.msg)
              ? result.msg
                  .filter((route) => route.pageurl)
                  .map((route) => ({
                      exact: "true",
                      path: `/${route.pageurl}`,
                      element: lazy(() => import("../views/module-preview/ListModulePreview")),
                  }))
              : [];
          
          const staticRoutes = [
              { exact: "true", path: "/auth/signin", element: lazy(() => import("../views/auth/SignIn")) },
              { exact: "true", path: "/auth/otp-verify", element: lazy(() => import("../views/auth/otpverify")) },
              { exact: "true", path: "/auth/forgotpassword", element: lazy(() => import("../views/auth/Forgotpassword")) },
              { exact: "true", path: "/auth/resetpassword/:token?", element: lazy(() => import("../views/auth/Resetpassword")) },
              { exact: "true", path: "/logout", element: lazy(() => import("../views/auth/Logout")) },
              {
                  path: "*",
                  layout: AdminLayout,
                  routes: [
                  { path: "*", exact: "true", element: () => <Navigate to="/dashboard" /> },
                  {
                      exact: "true",
                      path: "/dashboard",
                      guard: AuthGuard,
                      element: lazy(() => import("../views/dashboard/index")),
                  },
                  {
                      exact: "true",
                      path: "/module/add-module",
                      guard: AuthGuard,
                      element: lazy(() => import("../views/module-preview/AddModulePreview")),
                  },
                  ...dynamicRoutes, 
                  ],
              },
          ];    
          setDynamicMenuItems(staticRoutes);
     
          return staticRoutes;
         
      } catch (error) {
          console.error("Error fetching routes:", error);
      }
      }
        
    };

    const fetchDynamicSidebar = async () => {
        const custid = localStorage.getItem("custid");      
        try {
          const response = await fetch(`http://localhost:5000/api/form/getroutes2/${custid}`, {
            method: "GET",
          });
      
          if (!response.ok) throw new Error(`Error: ${response.status}`);
      
          const result = await response.json();
            const dynamicsidebar = Array.isArray(result.msg)
              ? result.msg.map((route) => ({
                  id: route.pageurl || "default-id",
                  title: route.pagename || "Default Title",
                  type: "collapse",
                  icon: "feather icon-file-text",
                  // src: dashboardImg4,
                  children: [
                    {
                      id: route.pageurl || "child-default-id",
                      title: route.pagename || "Child Default Title",
                      type: "item",
                      url: `/${route.pageurl}`,
                    },
                  ],
                }))
              : [];
    
          const menuItems = {
            items: [
              {
                id: "navigation",
                title: "Navigation",
                type: "group",
                icon: "icon-navigation",
                children: [
                  {
                    id: "dashboard",
                    title: "Dashboard",
                    type: "item",
                    icon: "feather icon-file-text",
                    // src: dashboardImg4,
                    url: "/dashboard",
                  },
                  ...dynamicsidebar,
                ],
              },
            ],
          };
      
          setDynamicsidebarItems(menuItems);
        } catch (error) {
          console.error("Error fetching routes:", error);
        }
      };

  useEffect(() => {
      fetchDynamicRoutes();
      fetchDynamicSidebar();
  }, []);
    

    return (
        <AuthContext.Provider
        value={{
          isLoggedIn,
          storeTokenInLS,
          storeTokenInLSotp,
          storeTokenInLScustid,
          Destroyotpuser,
          LogoutUser,
          dynamicMenuItems,
          fetchData: fetchDynamicRoutes,
          dynamicsidebarItems,
          // fetchDatasidebar: fetchDynamicSidebar, 
        }}
      >
          {children}
      </AuthContext.Provider>
    );
};

// Custom Hook to use Auth Context
export const useAuth = () => {
    const authContextValue = useContext(AuthContext);
    if (!authContextValue) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return authContextValue;
};
