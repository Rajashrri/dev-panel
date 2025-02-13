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
  
        try {
            const response = await fetch(`http://localhost:5000/api/form/getroutes2/${custid}`, {
                method: "GET",
            });
  
            if (!response.ok) throw new Error(`Error: ${response.status}`);
  
            const result = await response.json();
  
          
            const staticRoutes = [
              { exact: true, path: "/auth/signin", element: lazy(() => import("../views/auth/SignIn")) },
              { exact: true, path: "/auth/otp-verify", element: lazy(() => import("../views/auth/otpverify")) },
              { exact: true, path: "/auth/forgotpassword", element: lazy(() => import("../views/auth/Forgotpassword")) },
              { exact: true, path: "/auth/resetpassword/:token?", element: lazy(() => import("../views/auth/Resetpassword")) },
            //   { exact: true, path: "/dashboard", element: lazy(() => import("../views/dashboard/index")) },
              { exact: true, path: "/logout", element: lazy(() => import("../views/auth/Logout")) },
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
                    ],
                },
            ];
        
            // Combine static and dynamic routes
            const dynamicRoutes = Array.isArray(result.msg)
            ? result.msg
                  .filter((route) => route.pagename) // Ensure pagename exists
                  .map((route) => ({
                      path: `/${route.pagename}`,
                      element: lazy(() => import("../views/module-preview/AddModulePreview")),
                  }))
            : [];

            setDynamicMenuItems([...staticRoutes, ...dynamicRoutes]);
        //   const staticRoutes = [
        //       { exact: "true", path: "/auth/signin", element: lazy(() => import("../views/auth/SignIn")) },
        //       { exact: "true", path: "/auth/otp-verify", element: lazy(() => import("../views/auth/otpverify")) },
        //       { exact: "true", path: "/auth/forgotpassword", element: lazy(() => import("../views/auth/Forgotpassword")) },
        //       { exact: "true", path: "/auth/resetpassword/:token?", element: lazy(() => import("../views/auth/Resetpassword")) },
        //       { exact: "true", path: "logout", element: lazy(() => import("../views/auth/Logout")) },
        //       {
        //         path: "*",
        //         layout: AdminLayout,
        //         routes: [
        //           { path: "*", exact: "true", element: () => <Navigate to="/dashboard" /> },
        //           {
        //             exact: "true",
        //             path: "/dashboard",
        //             guard: AuthGuard,
        //             element: lazy(() => import("../views/dashboard/index")),
        //           },
        //         ],
        //       },
        //       },
        //     ];
            
          //   const dynamicRoutes = (Array.isArray(result.msg) ? result.msg : [])
          //     .filter((route) => route.pagename)
          //     .map((route) => ({
          //       exact: "true",
          //       path: `/${route.pagename}`,
          //       element: lazy(() => import("../views/module-preview/AddModulePreview")), // Ensure this path is correct
          //     }));
            
          //   // Merge dynamic routes into static routes
          //   const dashboardRoute = staticRoutes.find((route) => route.path === "*" && route.routes);
          //   if (dashboardRoute) {
          //     dashboardRoute.routes = [...dashboardRoute.routes, ...dynamicRoutes];
          //   }
            
            // setDynamicMenuItems(combinedRoutes);
        } catch (error) {
            console.error("Error fetching routes:", error);
        }
    //   }
     
  };

  // Fetch routes on component mount

    // const fetchDynamicRoutes = async () => {
    //     try {
    //     const custid = localStorage.getItem("custid");
    //     const response = await fetch(`http://localhost:5000/api/form/getroutes2/${custid}`);

    //     if (!response.ok) throw new Error(`Error: ${response.status}`);
    //     const result = await response.json();

    //     // Static routes
    //     const staticRoutes = [
    //         { exact: true, path: "/auth/signin", element: lazy(() => import("../views/auth/SignIn")) },
    //         { exact: true, path: "/auth/otp-verify", element: lazy(() => import("../views/auth/otpverify")) },
    //         { exact: true, path: "/auth/forgotpassword", element: lazy(() => import("../views/auth/Forgotpassword")) },
    //         { exact: true, path: "/auth/resetpassword/:token?", element: lazy(() => import("../views/auth/Resetpassword")) },
    //         { exact: true, path: "/logout", element: lazy(() => import("../views/auth/Logout")) },
    //         {
    //         path: "*",
    //         layout: AdminLayout,
    //         routes: [
    //             { path: "*", exact: true, element: () => <Navigate to="/dashboard" /> },
    //             {
    //             exact: true,
    //             path: "/dashboard",
    //             guard: AuthGuard,
    //             element: lazy(() => import("../views/dashboard/index")),
    //             },
    //         ],
    //         },
    //     ];

    //     // Dynamic routes from API
    //     const dynamicRoutes = (Array.isArray(result.msg) ? result.msg : [])
    //         .filter((route) => route.pagename) // Ensure `pagename` exists
    //         .map((route) => ({
    //         exact: true,
    //         path: `/${route.pagename}`,
    //         element: lazy(() => import("../views/module-preview/AddModulePreview")), // Adjust component path if needed
    //         }));

    //     // Merge dynamic routes into static routes
    //     const dashboardRoute = staticRoutes.find((route) => route.path === "*" && route.routes);
    //     if (dashboardRoute) {
    //         dashboardRoute.routes = [...dashboardRoute.routes, ...dynamicRoutes];
    //     }

    //     setDynamicMenuItems(staticRoutes);
    //     } catch (error) {
    //     console.error("Error fetching routes:", error);
    //     }
    // };


  useEffect(() => {
      fetchDynamicRoutes();
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
              dynamicMenuItems, // Provide dynamic routes to the context
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
