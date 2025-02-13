import {
    dashboardImg1,
    dashboardImg2,
    dashboardImg3,
    dashboardImg4,
    adminTemplate,
    createProject,
  } from "./../src/images";
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
            src: dashboardImg4,
            url: "/company/create-new-project",
          },
          {
            id: "module",
            title: "Module",
            type: "collapse",
            icon: "feather icon-file-text",
            src: dashboardImg4,
  
            children: [
              {
                id: "module",
                title: "Add Module",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/module/add-module",
              },
              {
                id: "module",
                title: "Module List",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/module/module-list",
              },
              
            ],
          },
       
          {
            id: "Packages",
            title: "Packages",
            type: "collapse",
            icon: "feather icon-file-text",
            src: dashboardImg4,
  
            children: [
              {
                id: "fixed-item-master",
                title: "Fixed Item Master",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/packages/fixed-item-master",
              },


              {
                id: "Addons",
                title: "Addons",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/packages/addons-list",
              },

              {
                id: "Add Package",
                title: "Add Package",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/packages/add-package",
              },
              {
                id: "Package List",
                title: "Package List",
                type: "item",
                // icon: "feather icon-file-text",
                // src: dashboardImg4,
                url: "/packages/package-list",
              },


            ],
          },
          // {
          // 	id: 'auth',
          // 	title: 'Authentication',
          // 	type: 'collapse',
          // 	icon: 'feather icon-lock',
          // 	src: dashboardImg2,
          // 	badge: {
          // 		title: 'New',
          // 		type: 'label-danger'
          // 	},
          // 	children: [
          // 		{
          // 			id: 'signup-1',
          // 			title: 'Sign In',
          // 			type: 'item',
          // 			url: '/auth/signin',
          // 			target: true,
          // 			breadcrumbs: false
          // 		},
          // 		{
          // 			id: 'form',
          // 			title: 'Forgot Password',
          // 			type: 'item',
          // 			url: '/auth/forgotpassword',
          // 			target: true,
          // 			breadcrumbs: false
          // 		},
          // 		{
          // 			id: 'form',
          // 			title: 'Reset Password',
          // 			type: 'item',
          // 			url: '/auth/resetpassword',
          // 			target: true,
          // 			breadcrumbs: false
          // 		}
          // 	]
          // },
        ],
      },
    ],
  };
  
  export default menuItems;
  