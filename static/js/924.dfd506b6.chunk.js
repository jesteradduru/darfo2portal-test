"use strict";(self.webpackChunkda_rfo_02_portal=self.webpackChunkda_rfo_02_portal||[]).push([[924,299],{1514:function(e,n,t){t.r(n);var r=t(5861),o=t(885),i=t(7757),a=t.n(i),s=t(2791),c=t(370),u=t(6871),l=t(9126),d=t(9442),m=t(1734),f=t(6981),_=t(5617),g=t(1405),p=(t(7137),t(2741)),v=t(7373),x=t(184),j=t(763);n.default=function(e){e.socket;var n=(0,u.s0)(),t=(0,g.I0)(),i=(0,u.UO)(),h=i.com_id,y=i.inbox_id,w=(0,g.v9)((function(e){return e.routing})).routingRecipients,k=((0,g.v9)((function(e){return e.tasks})).viewCommunicationData,(0,s.useState)(!1)),b=(0,o.Z)(k,2),C=b[0],L=b[1],R=(0,s.useState)([]),N=(0,o.Z)(R,2),P=N[0],E=N[1],F=function(){L(!C)},I=function(){var e=(0,r.Z)(a().mark((function e(){var n;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:n=[],w.forEach((function(e){var t=document.getElementById("routing_".concat(e.value)),r=new FormData(t),o=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map((function(e){return e.value})),i={};r.forEach((function(e,n){i[n]=e})),i.routing_legend=o,i.routing_recipients=[e],i.com_id=h,"group"===e.type&&(i.routing_recipients=e.recipients),n.push(i)})),E(n),F();case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),Z=function(){var e=(0,r.Z)(a().mark((function e(){return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t((0,p.fJ)(P));case 2:if(!e.sent.payload.routingData.com_id){e.next=7;break}return e.next=6,t((0,v.l7)(y));case 6:n("/dts/managementOfCommunications/inbox");case 7:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();(0,s.useEffect)((function(){j.isEmpty(w)&&t((0,p.pd)({com_id:h,status:"initial"}))}),[t,h]);var V=w.map((function(e){return(0,x.jsx)(m.Z,{eventKey:e.value,title:(0,x.jsx)(_.Qc,{label:e.label,username:e.value}),children:(0,x.jsx)(f.default,{data:e,defaultFrom:!0})})}));return(0,x.jsxs)("div",{className:"m-3",children:[(0,x.jsx)(_.XN,{previewRouting:C,togglePreview:F,routingData:P,onProceed:Z}),(0,x.jsxs)("div",{className:"d-block d-md-flex mt-3",children:[(0,x.jsx)("h4",{className:"me-3",children:"Add Routing Note"}),(0,x.jsx)(_.iI,{})]}),(0,x.jsx)("hr",{}),(0,x.jsx)(d.Z,{children:V}),j.isEmpty(w)&&(0,x.jsx)("p",{className:"text-center lead p-3 bg-super-light-green text-secondary mt-3",children:"Add Recipient/s"}),(0,x.jsxs)("div",{className:"d-flex justify-content-between",children:[(0,x.jsx)(_.xE,{}),(0,x.jsx)(c.s,{size:"md",color:"primary",name:"Submit",onClick:I,icon:(0,x.jsx)(l.fmn,{})})]})]})}},6981:function(e,n,t){t.r(n);var r=t(2791),o=t(1405),i=t(2706),a=t(9051),s=t(2741),c=t(5617),u=t(4464),l=t(1588),d=t(1146),m=t(370),f=t(9126),_=t(184),g=t(763);n.default=function(e){var n=e.data,t=e.viewOnly,p=(0,o.v9)((function(e){return e.accounts})).users,v=(0,o.v9)((function(e){return e.user})).user,x=(0,o.v9)((function(e){return e.tasks})).viewCommunicationData,j=(0,o.I0)(),h=(0,o.v9)((function(e){return e.routing})).routingRecipients,y=(0,o.v9)((function(e){return e.tasks})),w=y.tasks,k=y.taskCounter,b=(0,r.useRef)(),C=(0,d.useReactToPrint)({content:function(){return b.current},documentTitle:"routing_slip",pageStyle:"print"}),L=p.filter((function(e){return e.group_id===n.value})).map((function(e){return{value:e.user_username,label:"".concat(e.emp_firstname,"  ").concat(e.emp_lastname," - ").concat(e.office_code),user_id:e.user_id,user_username:e.user_username,user_fullname:"".concat(e.emp_firstname,"  ").concat(e.emp_lastname," - ").concat(e.office_code),role_name:e.role_name,role_id:e.role_id}})),R=h.filter((function(e){return e.value===n.value}));(0,r.useEffect)((function(){j((0,s.JK)({group_id:n.value,recipients:L})),j((0,l.T8)()),j((0,u.PR)())}),[j]);var N,P=function(e){if(n.routing_legend)return n.routing_legend.includes(e)};return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(m.s,{name:"Print Routing",outline:!0,icon:(0,_.jsx)(f.dwT,{}),className:"ms-auto d-block my-2 d-print-none",onClick:C}),(0,_.jsxs)(a.l0,{id:"routing_".concat(n.value),ref:b,className:"p-md-4 p-1 rounded bg-super-light-green m-md-2 routing_slip_form",style:{pointerEvents:t?"none":""},children:[(0,_.jsxs)(a.cw,{children:[(0,_.jsx)(a.__,{for:"reference_no",children:"Reference No."}),(0,_.jsx)(a.II,{type:"text",id:"reference_no",name:"reference_no",size:"sm",defaultValue:n.routing_referenceNo?n.routing_referenceNo:"139-9-".concat(x.class_code,"-")})]}),(0,_.jsxs)(a.cw,{children:[(0,_.jsx)(a.__,{for:"routing_from",children:"From"}),(0,_.jsx)(a.II,{type:"text",id:"routing_from",defaultValue:function(){if(!g.isEmpty(p)){if(v.role_name.includes("Process-level")&&!t){var e=p.filter((function(e){return"Process-level Approver"===e.role_name}))[0];return"".concat(e.emp_firstname," ").concat(e.emp_middlename[0],". ").concat(e.emp_lastname," - ").concat(e.emp_position)}if(t){var r=p.filter((function(e){return e.user_id===n.routing_from}))[0];return"".concat(r.emp_firstname," ").concat(r.emp_middlename[0],". ").concat(r.emp_lastname," - ").concat(r.emp_position)}return"".concat(v.emp_firstname," ").concat(v.emp_middlename[0],". ").concat(v.emp_lastname," - ").concat(v.emp_position)}}(),name:"routing_from",size:"sm"})]}),"group"===n.type?(0,_.jsxs)(a.cw,{children:[(0,_.jsx)(a.__,{for:"routing_to",children:"To"}),(0,_.jsx)(i.ZP,{options:L,isMulti:!0,defaultValue:L,className:"basic-multi-select",classNamePrefix:"select",onChange:function(e){j((0,s.JK)({group_id:n.value,recipients:e}))}})]}):(0,_.jsxs)(a.cw,{children:[(0,_.jsx)(a.__,{for:"routing_to",children:"To"}),(0,_.jsx)(i.ZP,{options:R,defaultValue:n.routing_to?[{label:n.label}]:R,classNamePrefix:"select"})]}),(0,_.jsxs)(a.X2,{style:{wordWrap:"break-word"},children:[(0,_.jsxs)(a.JX,{md:"6",children:[(0,_.jsx)(c.Ls,{name:"routing_legend",id:"for_action_".concat(n.value),value:"for_action",desc:"For your appropriate action",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"for_information_".concat(n.value),value:"for_information",desc:"For your information/file & reference",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"for_review_".concat(n.value),value:"for_review",desc:"For your review/ comments/ recommendation/ validation",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"draft_reply_".concat(n.value),value:"draft_reply",desc:"Draft reply/For your acknowledgement",defaultValue:n.routing_draftReply,textbox:!0,isLegendContains:P})]}),(0,_.jsxs)(a.JX,{md:"6",children:[(0,_.jsx)(c.Ls,{name:"routing_legend",id:"rush_".concat(n.value),value:"rush",desc:"Rush",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"urgent_".concat(n.value),value:"urgent",desc:"Urgent",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"for_circulation_".concat(n.value),value:"for_circulation",desc:"For circulation & dissemination",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"for_schedule_".concat(n.value),value:"for_schedule",desc:"For schedule",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"attend_".concat(n.value),value:"attend",desc:"Attend/Represent Me",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"consolidate_".concat(n.value),value:"consolidate",textbox:!0,defaultValue:P("consolidate")?n.routing_consolidate:"\nPlease consolidate & submit to my office on or before\n",isLegendContains:P})]}),("Rush"===x.com_urgency||(N=w[k],["viewRouting","addRoutingNote","forRouting","routeCommunication"].includes(N)))&&(0,_.jsx)(a.JX,{md:"12",children:(0,_.jsxs)(a.cw,{children:[(0,_.jsx)(a.__,{for:"routing_remarks",children:"Remarks"}),(0,_.jsx)(a.II,{defaultValue:n.routing_remarks,type:"textarea",id:"routing_remarks_".concat(n.value),name:"routing_remarks",size:"sm",rows:"5"})]})})]})]})]})}},7137:function(){}}]);
//# sourceMappingURL=924.dfd506b6.chunk.js.map