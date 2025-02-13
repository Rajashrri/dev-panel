import{t as A,R as x,q as T,_ as B,r as l,E as L,I as H,j as D,e as P,P as y}from"./index-CqonvCgs.js";import{_ as Y}from"./setPrototypeOf-DgZC2w_0.js";function Z(t,r){t.prototype=Object.create(r.prototype),t.prototype.constructor=t,Y(t,r)}function q(t){var r=A(t);return r&&r.defaultView||window}function z(t,r){return q(t).getComputedStyle(t,r)}var K=/([A-Z])/g;function J(t){return t.replace(K,"-$1").toLowerCase()}var Q=/^ms-/;function N(t){return J(t).replace(Q,"-ms-")}var tt=/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;function et(t){return!!(t&&tt.test(t))}function j(t,r){var i="",s="";if(typeof r=="string")return t.style.getPropertyValue(N(r))||z(t).getPropertyValue(N(r));Object.keys(r).forEach(function(n){var e=r[n];!e&&e!==0?t.style.removeProperty(N(n)):et(n)?s+=n+"("+e+") ":i+=N(n)+": "+e+";"}),s&&(i+="transform: "+s+";"),t.style.cssText+=";"+i}const w={disabled:!1},I=x.createContext(null);var nt=function(r){return r.scrollTop},g="unmounted",m="exited",p="entering",v="entered",k="exiting",c=function(t){Z(r,t);function r(s,n){var e;e=t.call(this,s,n)||this;var a=n,o=a&&!a.isMounting?s.enter:s.appear,u;return e.appearStatus=null,s.in?o?(u=m,e.appearStatus=p):u=v:s.unmountOnExit||s.mountOnEnter?u=g:u=m,e.state={status:u},e.nextCallback=null,e}r.getDerivedStateFromProps=function(n,e){var a=n.in;return a&&e.status===g?{status:m}:null};var i=r.prototype;return i.componentDidMount=function(){this.updateStatus(!0,this.appearStatus)},i.componentDidUpdate=function(n){var e=null;if(n!==this.props){var a=this.state.status;this.props.in?a!==p&&a!==v&&(e=p):(a===p||a===v)&&(e=k)}this.updateStatus(!1,e)},i.componentWillUnmount=function(){this.cancelNextCallback()},i.getTimeouts=function(){var n=this.props.timeout,e,a,o;return e=a=o=n,n!=null&&typeof n!="number"&&(e=n.exit,a=n.enter,o=n.appear!==void 0?n.appear:a),{exit:e,enter:a,appear:o}},i.updateStatus=function(n,e){if(n===void 0&&(n=!1),e!==null)if(this.cancelNextCallback(),e===p){if(this.props.unmountOnExit||this.props.mountOnEnter){var a=this.props.nodeRef?this.props.nodeRef.current:T.findDOMNode(this);a&&nt(a)}this.performEnter(n)}else this.performExit();else this.props.unmountOnExit&&this.state.status===m&&this.setState({status:g})},i.performEnter=function(n){var e=this,a=this.props.enter,o=this.context?this.context.isMounting:n,u=this.props.nodeRef?[o]:[T.findDOMNode(this),o],f=u[0],d=u[1],h=this.getTimeouts(),R=o?h.appear:h.enter;if(!n&&!a||w.disabled){this.safeSetState({status:v},function(){e.props.onEntered(f)});return}this.props.onEnter(f,d),this.safeSetState({status:p},function(){e.props.onEntering(f,d),e.onTransitionEnd(R,function(){e.safeSetState({status:v},function(){e.props.onEntered(f,d)})})})},i.performExit=function(){var n=this,e=this.props.exit,a=this.getTimeouts(),o=this.props.nodeRef?void 0:T.findDOMNode(this);if(!e||w.disabled){this.safeSetState({status:m},function(){n.props.onExited(o)});return}this.props.onExit(o),this.safeSetState({status:k},function(){n.props.onExiting(o),n.onTransitionEnd(a.exit,function(){n.safeSetState({status:m},function(){n.props.onExited(o)})})})},i.cancelNextCallback=function(){this.nextCallback!==null&&(this.nextCallback.cancel(),this.nextCallback=null)},i.safeSetState=function(n,e){e=this.setNextCallback(e),this.setState(n,e)},i.setNextCallback=function(n){var e=this,a=!0;return this.nextCallback=function(o){a&&(a=!1,e.nextCallback=null,n(o))},this.nextCallback.cancel=function(){a=!1},this.nextCallback},i.onTransitionEnd=function(n,e){this.setNextCallback(e);var a=this.props.nodeRef?this.props.nodeRef.current:T.findDOMNode(this),o=n==null&&!this.props.addEndListener;if(!a||o){setTimeout(this.nextCallback,0);return}if(this.props.addEndListener){var u=this.props.nodeRef?[this.nextCallback]:[a,this.nextCallback],f=u[0],d=u[1];this.props.addEndListener(f,d)}n!=null&&setTimeout(this.nextCallback,n)},i.render=function(){var n=this.state.status;if(n===g)return null;var e=this.props,a=e.children;e.in,e.mountOnEnter,e.unmountOnExit,e.appear,e.enter,e.exit,e.timeout,e.addEndListener,e.onEnter,e.onEntering,e.onEntered,e.onExit,e.onExiting,e.onExited,e.nodeRef;var o=B(e,["children","in","mountOnEnter","unmountOnExit","appear","enter","exit","timeout","addEndListener","onEnter","onEntering","onEntered","onExit","onExiting","onExited","nodeRef"]);return x.createElement(I.Provider,{value:null},typeof a=="function"?a(n,o):x.cloneElement(x.Children.only(a),o))},r}(x.Component);c.contextType=I;c.propTypes={};function b(){}c.defaultProps={in:!1,mountOnEnter:!1,unmountOnExit:!1,appear:!1,enter:!0,exit:!0,onEnter:b,onEntering:b,onEntered:b,onExit:b,onExiting:b,onExited:b};c.UNMOUNTED=g;c.EXITED=m;c.ENTERING=p;c.ENTERED=v;c.EXITING=k;function xt(t){return t.code==="Escape"||t.keyCode===27}function rt(){const t=l.version.split(".");return{major:+t[0],minor:+t[1],patch:+t[2]}}function st(t){if(!t||typeof t=="function")return null;const{major:r}=rt();return r>=19?t.props.ref:t.ref}function it(t,r,i,s){if(s===void 0&&(s=!0),t){var n=document.createEvent("HTMLEvents");n.initEvent(r,i,s),t.dispatchEvent(n)}}function at(t){var r=j(t,"transitionDuration")||"",i=r.indexOf("ms")===-1?1e3:1;return parseFloat(r)*i}function ot(t,r,i){i===void 0&&(i=5);var s=!1,n=setTimeout(function(){s||it(t,"transitionend",!0)},r+i),e=L(t,"transitionend",function(){s=!0},{once:!0});return function(){clearTimeout(n),e()}}function ut(t,r,i,s){i==null&&(i=at(t)||0);var n=ot(t,i,s),e=L(t,"transitionend",r);return function(){n(),e()}}function M(t,r){const i=j(t,r)||"",s=i.indexOf("ms")===-1?1e3:1;return parseFloat(i)*s}function lt(t,r){const i=M(t,"transitionDuration"),s=M(t,"transitionDelay"),n=ut(t,e=>{e.target===t&&(n(),r(e))},i+s)}function ft(t){t.offsetHeight}function ct(t){return t&&"setState"in t?T.findDOMNode(t):t??null}const pt=x.forwardRef(({onEnter:t,onEntering:r,onEntered:i,onExit:s,onExiting:n,onExited:e,addEndListener:a,children:o,childRef:u,...f},d)=>{const h=l.useRef(null),R=H(h,u),O=C=>{R(ct(C))},E=C=>S=>{C&&h.current&&C(h.current,S)},U=l.useCallback(E(t),[t]),F=l.useCallback(E(r),[r]),G=l.useCallback(E(i),[i]),X=l.useCallback(E(s),[s]),W=l.useCallback(E(n),[n]),V=l.useCallback(E(e),[e]),$=l.useCallback(E(a),[a]);return D.jsx(c,{ref:d,...f,onEnter:U,onEntered:G,onEntering:F,onExit:X,onExited:V,onExiting:W,addEndListener:$,nodeRef:h,children:typeof o=="function"?(C,S)=>o(C,{...S,ref:O}):x.cloneElement(o,{ref:O})})}),dt={[p]:"show",[v]:"show"},ht=l.forwardRef(({className:t,children:r,transitionClasses:i={},onEnter:s,...n},e)=>{const a={in:!1,timeout:300,mountOnEnter:!1,unmountOnExit:!1,appear:!1,...n},o=l.useCallback((u,f)=>{ft(u),s==null||s(u,f)},[s]);return D.jsx(pt,{ref:e,addEndListener:lt,...a,onEnter:o,childRef:st(r),children:(u,f)=>l.cloneElement(r,{...f,className:P("fade",t,r.props.className,dt[u],i[u])})})});ht.displayName="Fade";const Et={"aria-label":y.string,onClick:y.func,variant:y.oneOf(["white"])},_=l.forwardRef(({className:t,variant:r,"aria-label":i="Close",...s},n)=>D.jsx("button",{ref:n,type:"button",className:P("btn-close",r&&`btn-close-${r}`,t),"aria-label":i,...s}));_.displayName="CloseButton";_.propTypes=Et;export{_ as C,ht as F,st as g,xt as i,j as s,ut as t};
