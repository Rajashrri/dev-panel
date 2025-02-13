// import {
//     dashboardImg1,
//     dashboardImg2,
//     dashboardImg3,
//     dashboardImg4,
//     adminTemplate,
//     createProject,
//   } from "./../src/images";
//   const menuItems = {
//     items: [
//       {
//         id: "navigation",
//         title: "Navigation",
//         type: "group",
//         icon: "icon-navigation",
//         children: [
//           {
//             id: "dashboard",
//             title: "Dashboard",
//             type: "item",
//             icon: "feather icon-file-text",
//             src: dashboardImg4,
//             url: "/dashboard",
//           },
//           {
//             id: "module",
//             title: "Module",
//             type: "collapse",
//             icon: "feather icon-file-text",
//             src: dashboardImg4,
  
//             children: [
//               {
//                 id: "module",
//                 title: "Add Module",
//                 type: "item",
//                 // icon: "feather icon-file-text",
//                 // src: dashboardImg4,
//                 url: "/blog",
//               },
//               {
//                 id: "module",
//                 title: "Module List",
//                 type: "item",
//                 // icon: "feather icon-file-text",
//                 // src: dashboardImg4,
//                 url: "/module/module-list",
//               },
              
//             ],
//           },
          
//         ],
//       },
//     ],
//   };
  
//   export default menuItems;
  

// import {
//   dashboardImg1,
//   dashboardImg2,
//   dashboardImg3,
//   dashboardImg4,
//   adminTemplate,
//   createProject,
// } from "./../src/images";
// import React from "react";
// import { useEffect, useState } from "react";
// import { useAuth } from "./store/auth";

// const MenuItems = () => {
//   console.log('menu-items');
//   const { dynamicsidebarItems } = useAuth();
//   const [menuItems, setMenuItems] = useState({ items: [] }); 

//   useEffect(() => {
//     if (dynamicsidebarItems?.items?.length) {
//       console.log("Updating menuItems:", dynamicsidebarItems); 
//       setMenuItems(dynamicsidebarItems);
//     }
//   }, [dynamicsidebarItems]); 

//   console.log("Rendered menuItems:", dynamicsidebarItems); 

//   return menuItems;
// };

// export default MenuItems;

// const MenuItems = () => {
//   const { dynamicsidebarItems } = useAuth();

//   const menuItems = dynamicsidebarItems?.items
//     ? { ...dynamicsidebarItems }
//     : { items: [] }; // Fallback to empty items if undefined

//   return men;
// };
import React, { useEffect, useState } from "react";
import { useAuth } from "./store/auth";
// const MenuItems = () => {
//   const { dynamicsidebarItems } = useAuth();
//   const [menuItems, setMenuItems] = useState({ items: [] });

//   useEffect(() => {
//     if (dynamicsidebarItems?.items?.length) {
//       console.log("Updating menuItems:", dynamicsidebarItems);
//       setMenuItems(dynamicsidebarItems);
//       dynamicNavigation = dynamicsidebarItems; // Update global navigation
//     }
//   }, [dynamicsidebarItems]);

//   return null; 
// };

// const men = {   
//   items: [
//     {
//       id: "navigation",
//       title: "Navigation",
//       type: "group",
//       children: [
//         {
//           id: "dashboard",
//           title: "Dashboard",
//           type: "item",
//           url: "/dashboard",
//         },
//         {
//           id: "blog",
//           title: "blog",
//           type: "item",
//           url: "/blog",
//         },
//       ],
//     },
//   ],
// }
// export default men;



// let dynamicNavigation = { items: [] }; // Fallback for dynamic navigation

// const MenuItems = () => {
//   const { dynamicsidebarItems } = useAuth();
//   const [menuItems, setMenuItems] = useState({ items: [] });

//   useEffect(() => {
//     if (dynamicsidebarItems?.items?.length) {
//       console.log("Updating menuItems:", dynamicsidebarItems);
//       setMenuItems(dynamicsidebarItems);
//       dynamicNavigation = dynamicsidebarItems; // Update global navigation
//     }
//   }, [dynamicsidebarItems]);

//   return null; 
// };

// export { dynamicNavigation as navigation };

// export default MenuItems;
