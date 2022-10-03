"use strict";(self.webpackChunkda_rfo_02_portal=self.webpackChunkda_rfo_02_portal||[]).push([[814,299],{7558:function(e,n,t){t.r(n);var r=t(5861),i=t(885),o=t(7757),a=t.n(o),s=t(2791),c=t(370),u=t(6871),l=t(9126),d=t(9442),m=t(1734),f=t(6981),_=t(5617),g=t(1405),p=(t(7137),t(2741)),x=t(7373),v=t(5540),j=t(9051),h=t(184),y=t(763);n.default=function(e){var n=e.initial,t=(0,u.s0)(),o=(0,g.I0)(),k=(0,u.UO)(),b=k.com_id,w=k.inbox_id,L=(0,g.v9)((function(e){return e.routing})),C=L.routingRecipients,R=L.addRoutingLoading,N=L.errorMessage,P=L.isLoading,I=(0,g.v9)((function(e){return e.tasks})).viewCommunicationData,E=(0,s.useState)(!1),F=(0,i.Z)(E,2),Z=F[0],V=F[1],A=(0,s.useState)([]),D=(0,i.Z)(A,2),T=D[0],X=D[1],J=function(){V(!Z)},O=function(){var e=(0,r.Z)(a().mark((function e(){var n;return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=[],C.forEach((function(e){var t=document.getElementById("routing_".concat(e.value)),r=new FormData(t),i=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map((function(e){return e.value})),o={};r.forEach((function(e,n){o[n]=e})),o.routing_legend=i,o.routing_recipients=[e],o.com_id=b,"group"===e.type&&(o.routing_recipients=e.recipients),n.push(o)})),!y.isEmpty(n)){e.next=4;break}return e.abrupt("return",alert("Please add recipients"));case 4:X(n),J();case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),S=function(){var e=(0,r.Z)(a().mark((function e(){return a().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!n){e.next=10;break}return e.next=3,o((0,p.Nk)(T));case 3:if(!e.sent.payload.routingData.com_id){e.next=8;break}return e.next=7,o((0,x.l7)(w));case 7:t("/dts/managementOfCommunications/inbox");case 8:e.next=17;break;case 10:return e.next=12,o((0,p.X6)(T));case 12:if(!e.sent.payload.com_id){e.next=17;break}return e.next=16,o((0,x.l7)(w));case 16:t("/dts/managementOfCommunications/inbox");case 17:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();(0,s.useEffect)((function(){n||o((0,p.pd)({com_id:b,status:"for_routing"}))}),[o]);var z=C.map((function(e){return(0,h.jsx)(m.Z,{eventKey:e.value,title:(0,h.jsx)(_.Qc,{label:e.label,username:e.value}),children:(0,h.jsx)(f.default,{data:e})})}));return(0,h.jsxs)(c.pO,{isLoading:P,errorMessage:N,className:"m-3",children:[(0,h.jsx)(_.XN,{previewRouting:Z,togglePreview:J,routingData:T,onProceed:S}),(0,h.jsxs)(j.W2,{children:[(0,h.jsxs)("div",{className:"d-block d-md-flex mt-3",children:[(0,h.jsx)("h4",{className:"me-3",children:"Rush"!==I.com_urgency&&n?"Add Initial Routing":"Route Communication"}),(0,h.jsx)(_.iI,{})]}),(0,h.jsx)("hr",{}),(0,h.jsx)(d.Z,{children:z}),y.isEmpty(C)&&(0,h.jsx)("p",{className:"text-center lead p-3 bg-super-light-green text-secondary mt-3",children:"Add Recipient/s"}),(0,h.jsxs)("div",{className:"d-flex justify-content-between",children:[(0,h.jsx)(v.Z,{}),(0,h.jsx)(c.s,{size:"md",color:"primary",name:R?(0,h.jsx)(j.$j,{color:"light"}):"Submit",onClick:O,icon:(0,h.jsx)(l.fmn,{})})]})]})]})}},6981:function(e,n,t){t.r(n);var r=t(2791),i=t(1405),o=t(2706),a=t(9051),s=t(2741),c=t(5617),u=t(4464),l=t(1588),d=t(1146),m=t(370),f=t(9126),_=t(184),g=t(763);n.default=function(e){var n=e.data,t=e.viewOnly,p=(0,i.v9)((function(e){return e.accounts})).users,x=(0,i.v9)((function(e){return e.user})).user,v=(0,i.v9)((function(e){return e.tasks})).viewCommunicationData,j=(0,i.I0)(),h=(0,i.v9)((function(e){return e.routing})).routingRecipients,y=(0,i.v9)((function(e){return e.tasks})),k=y.tasks,b=y.taskCounter,w=(0,r.useRef)(),L=(0,d.useReactToPrint)({content:function(){return w.current},documentTitle:"routing_slip",pageStyle:"print"}),C=p.filter((function(e){return e.group_id===n.value})).map((function(e){return{value:e.user_username,label:"".concat(e.emp_firstname,"  ").concat(e.emp_lastname," - ").concat(e.office_code),user_id:e.user_id,user_username:e.user_username,user_fullname:"".concat(e.emp_firstname,"  ").concat(e.emp_lastname," - ").concat(e.office_code),role_name:e.role_name,role_id:e.role_id}})),R=h.filter((function(e){return e.value===n.value}));(0,r.useEffect)((function(){j((0,s.JK)({group_id:n.value,recipients:C})),j((0,l.T8)()),j((0,u.PR)())}),[j]);var N,P=function(e){if(n.routing_legend)return n.routing_legend.includes(e)};return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(m.s,{name:"Print Routing",outline:!0,icon:(0,_.jsx)(f.dwT,{}),className:"ms-auto d-block my-2 d-print-none",onClick:L}),(0,_.jsxs)(a.l0,{id:"routing_".concat(n.value),ref:w,className:"p-md-4 p-1 rounded bg-super-light-green m-md-2 routing_slip_form",style:{pointerEvents:t?"none":""},children:[(0,_.jsxs)(a.cw,{children:[(0,_.jsx)(a.__,{for:"reference_no",children:"Reference No."}),(0,_.jsx)(a.II,{type:"text",id:"reference_no",name:"reference_no",size:"sm",defaultValue:n.routing_referenceNo?n.routing_referenceNo:"139-9-".concat(v.class_code,"-")})]}),(0,_.jsxs)(a.cw,{children:[(0,_.jsx)(a.__,{for:"routing_from",children:"From"}),(0,_.jsx)(a.II,{type:"text",id:"routing_from",defaultValue:function(){if(!g.isEmpty(p)){if(x.role_name.includes("Process-level")&&!t){var e=p.filter((function(e){return"Process-level Approver"===e.role_name}))[0];return"".concat(e.emp_firstname," ").concat(e.emp_middlename[0],". ").concat(e.emp_lastname," - ").concat(e.emp_position)}if(t){var r=p.filter((function(e){return e.user_id===n.routing_from}))[0];return"".concat(r.emp_firstname," ").concat(r.emp_middlename[0],". ").concat(r.emp_lastname," - ").concat(r.emp_position)}return"".concat(x.emp_firstname," ").concat(x.emp_middlename[0],". ").concat(x.emp_lastname," - ").concat(x.emp_position)}}(),name:"routing_from",size:"sm"})]}),"group"===n.type?(0,_.jsxs)(a.cw,{children:[(0,_.jsx)(a.__,{for:"routing_to",children:"To"}),(0,_.jsx)(o.ZP,{options:C,isMulti:!0,defaultValue:C,className:"basic-multi-select",classNamePrefix:"select",onChange:function(e){j((0,s.JK)({group_id:n.value,recipients:e}))}})]}):(0,_.jsxs)(a.cw,{children:[(0,_.jsx)(a.__,{for:"routing_to",children:"To"}),(0,_.jsx)(o.ZP,{options:R,defaultValue:n.routing_to?[{label:n.label}]:R,classNamePrefix:"select"})]}),(0,_.jsxs)(a.X2,{style:{wordWrap:"break-word"},children:[(0,_.jsxs)(a.JX,{md:"6",children:[(0,_.jsx)(c.Ls,{name:"routing_legend",id:"for_action_".concat(n.value),value:"for_action",desc:"For your appropriate action",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"for_information_".concat(n.value),value:"for_information",desc:"For your information/file & reference",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"for_review_".concat(n.value),value:"for_review",desc:"For your review/ comments/ recommendation/ validation",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"draft_reply_".concat(n.value),value:"draft_reply",desc:"Draft reply/For your acknowledgement",defaultValue:n.routing_draftReply,textbox:!0,isLegendContains:P})]}),(0,_.jsxs)(a.JX,{md:"6",children:[(0,_.jsx)(c.Ls,{name:"routing_legend",id:"rush_".concat(n.value),value:"rush",desc:"Rush",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"urgent_".concat(n.value),value:"urgent",desc:"Urgent",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"for_circulation_".concat(n.value),value:"for_circulation",desc:"For circulation & dissemination",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"for_schedule_".concat(n.value),value:"for_schedule",desc:"For schedule",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"attend_".concat(n.value),value:"attend",desc:"Attend/Represent Me",isLegendContains:P}),(0,_.jsx)(c.Ls,{name:"routing_legend",id:"consolidate_".concat(n.value),value:"consolidate",textbox:!0,defaultValue:P("consolidate")?n.routing_consolidate:"\nPlease consolidate & submit to my office on or before\n",isLegendContains:P})]}),("Rush"===v.com_urgency||(N=k[b],["viewRouting","addRoutingNote","forRouting","routeCommunication"].includes(N)))&&(0,_.jsx)(a.JX,{md:"12",children:(0,_.jsxs)(a.cw,{children:[(0,_.jsx)(a.__,{for:"routing_remarks",children:"Remarks"}),(0,_.jsx)(a.II,{defaultValue:n.routing_remarks,type:"textarea",id:"routing_remarks_".concat(n.value),name:"routing_remarks",size:"sm",rows:"5"})]})})]})]})]})}},7137:function(){}}]);
//# sourceMappingURL=814.5f6efc06.chunk.js.map