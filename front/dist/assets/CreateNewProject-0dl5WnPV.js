import{a as j,u as x,r as t,j as e,L as f,C as a}from"./index-CqonvCgs.js";import{b as v}from"./index-Jaecfe_D.js";import{b as w}from"./index-D378bV6i.js";import{R as l,C as r}from"./Row-kCx33sI5.js";const N=""+new URL("Lotus-Cs-6YgD2.jpg",import.meta.url).href,E=()=>{const{isLoggedIn:c}=j(),i=x(),[h,d]=t.useState([]),[n,m]=t.useState("");t.useState("");const p=async()=>{try{const s=await fetch("http://localhost:5000/api/customer/custlist");if(!s.ok)throw new Error(`Error: ${s.status}`);const g=await s.json();d(g.msg)}catch(s){console.error("Error fetching data:",s),console.log("Failed to load data. Please try again later.")}},o=h.filter(s=>s.compname.toLowerCase().includes(n.toLowerCase())),u=s=>{m(s.target.value)};return t.useEffect(()=>{c||i("/auth/signin"),p()},[c,i]),e.jsxs("div",{className:"create-new-project mb40",children:[e.jsxs(l,{className:"",children:[e.jsx(r,{lg:4,children:e.jsx("div",{id:"main-search",className:"open-search",children:e.jsxs("div",{className:"input-group mt-2",children:[e.jsx("span",{role:"button",tabIndex:"0",className:"input-group-append search-btn",style:{borderRadius:"50%",marginRight:15},children:e.jsx("i",{className:"feather icon-search input-group-text"})}),e.jsx("input",{type:"text",id:"m-search",className:"form-control",value:n,onChange:u,placeholder:"Search websites..."})]})})}),e.jsx(r,{lg:2}),e.jsx(r,{lg:6,children:e.jsx("div",{className:"text-right mt20",children:e.jsxs(f,{to:"/dev-forms/details-form",className:"create-button btn btn-primary waves-effect waves-light",children:[e.jsx(v,{})," Create New Project"]})})})]}),e.jsx(l,{children:o.length>0?o.map(s=>e.jsx(r,{lg:4,children:e.jsxs(a,{className:"project-card",children:[e.jsxs("div",{className:"card-image-wrapper",children:[e.jsx(a.Img,{variant:"top",src:N}),e.jsx("div",{className:"overlay",children:e.jsx("div",{className:"button",children:e.jsx("a",{href:"http://localhost:3001/auth/signin",target:"_blank",className:"create-button btn btn-primary waves-effect waves-light",children:"Preview"})})})]}),e.jsx(a.Body,{children:e.jsxs(a.Title,{children:[s.compname," "," ",e.jsx("a",{href:"http://localhost:3001/auth/signin",target:"_blank",style:{float:"right"},className:"view-color",children:e.jsx(w,{})})]})})]})},s._id)):e.jsx("p",{children:"No projects found"})})]})};export{E as default};
