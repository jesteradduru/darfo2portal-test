"use strict";(self.webpackChunkda_rfo_02_portal=self.webpackChunkda_rfo_02_portal||[]).push([[606],{3748:function(n,e,a){a.d(e,{P:function(){return i}});var i=function(n,e){return n.includes(e)}},9553:function(n,e,a){a.r(e);var i=a(885),t=a(2791),s=a(6871),o=a(9051),r=a(370),c=a(1405),m=a(9126),d=a(8230),l=a(3748),u=a(2666),f=a(5617),h=a(6782),k=a(184);e.default=function(n){var e=n.socket,a=(0,c.I0)(),v=(0,c.v9)((function(n){return n.drafts.drafts.length})),g=(0,c.v9)((function(n){return n.inbox.inbox.length})),C=(0,c.v9)((function(n){return n.user.user})).user_id,x=(0,c.v9)((function(n){return n.roles})).userPermissions,N=(0,c.v9)((function(n){return n.inbox})).newInboxCount;(0,t.useEffect)((function(){a((0,d.Oe)(C)),a((0,u.V1)()),a((0,h.EW)())}),[a,C]);var p=[{headerName:"Incoming Communications",headerIcon:(0,k.jsx)(m.dcn,{}),links:[{linkName:"Add New",linkUrl:"/dts/managementOfCommunications/add",icon:(0,k.jsx)(m.B8K,{}),active:!0,hidden:!(0,l.P)(x,"addCommunication")},{linkName:"Inbox",linkUrl:"/dts/managementOfCommunications/inbox",active:!1,count:g,new:N,showBadge:!0},{linkName:"Drafts",linkUrl:"/dts/managementOfCommunications/draft",active:!1,count:v,new:0,showBadge:!0,hidden:!(0,l.P)(x,"manageDrafts")},{linkName:"Classifications",linkUrl:"/dts/managementOfCommunications/classifications",active:!1,hidden:!(0,l.P)(x,"manageClassifications")}]},{headerName:"Search",headerIcon:(0,k.jsx)(m.dVI,{}),links:[{linkName:"Basic Search",linkUrl:"/dts/managementOfCommunications/search/basic",active:!0,hidden:!(0,l.P)(x,"basicSearch")},{linkName:"Advanced Search",linkUrl:"/dts/managementOfCommunications/search/advanced",active:!1,hidden:!(0,l.P)(x,"advancedSearch")}]},{headerName:"Dashboard",headerIcon:(0,k.jsx)(m.xRX,{}),links:[{linkName:"Analytics",linkUrl:"/dts/managementOfCommunications/analytics",active:!0,hidden:!(0,l.P)(x,"viewDashboardAnalytics")},{linkName:"Reports",linkUrl:"/dts/managementOfCommunications/reports",hidden:!(0,l.P)(x,"exportReport"),active:!1},{linkName:"Communication Logs",linkUrl:"/dts/managementOfCommunications/communicationLogs",hidden:!(0,l.P)(x,"exportLog"),active:!1}]},{headerName:"Calendar",headerIcon:(0,k.jsx)(m.ow5,{}),links:[{linkName:"RED's Activities",linkUrl:"/dts/managementOfCommunications/calendar",active:!0,hidden:!(0,l.P)(x,"viewCalendar")}]},{headerName:"Help & Support",headerIcon:(0,k.jsx)(m.jek,{}),links:[{linkName:"Help Center",linkUrl:"/dts/managementOfCommunications/helpCenter"}]}],j=(0,t.useState)(!1),b=(0,i.Z)(j,2),O=b[0],P=b[1],w=function(){P(!O)};return(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(f.P_,{socket:e}),(0,k.jsx)(r.ZA,{className:"bg-dark-green",appName:"DTS",navItem:"Management of Communication",sidenav:w,toggleSideNav:w}),(0,k.jsxs)("div",{className:"d-flex",children:[(0,k.jsx)(r.t7,{navConfig:p,isOpen:O,toggleSideNav:w}),(0,k.jsx)(o.W2,{onClick:function(){return P(!1)},fluid:!0,children:(0,k.jsx)(s.j3,{})})]})]})}}}]);
//# sourceMappingURL=606.2906bda8.chunk.js.map