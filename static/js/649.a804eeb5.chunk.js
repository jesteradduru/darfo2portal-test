"use strict";(self.webpackChunkda_rfo_02_portal=self.webpackChunkda_rfo_02_portal||[]).push([[649],{2061:function(e,t,n){n.r(t);var a=n(5861),r=n(885),s=n(7757),c=n.n(s),i=n(2791),o=n(9126),d=n(1405),l=n(6871),u=n(9051),m=n(5776),x=n(7373),_=n(5617),f=n(370),p=n(2426),j=n.n(p),h=n(8950),v=n(184);t.default=function(){var e=(0,l.UO)(),t=e.com_id,n=e.inbox_id,s=(0,d.I0)(),p=(0,d.v9)((function(e){return e.action})),k=p.reviewActionTakenData,b=p.isLoading,w=p.errorMessage,g=p.actor,y=(0,i.useState)(!1),D=(0,r.Z)(y,2),I=D[0],A=D[1],N=(0,l.s0)(),C=(0,i.useState)(!1),R=(0,r.Z)(C,2),E=R[0],M=R[1],S=(0,d.v9)((function(e){return e.user})).user,O=function(){var e=(0,a.Z)(c().mark((function e(){var t,a;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(t=new FormData(document.getElementById("review_action_taken_form"))).set("act_id",k.act_id),t.set("com_id",k.com_id),t.set("inbox_id",n),a={},t.forEach((function(e,t){a[t]=e})),e.next=8,s((0,m.Vr)(t));case 8:if(!e.sent.payload.act_id){e.next=13;break}return e.next=12,s((0,x.l7)(n));case 12:N("/dts/managementOfCommunications/inbox");case 13:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,i.useEffect)((function(){s((0,m.Ke)({com_id:t,inbox_id:n}))}),[s]),(0,v.jsxs)(u.W2,{className:"w-75 mt-3",children:[(0,v.jsx)(f.Tv,{isOpen:E,toggleModal:function(){return M(!E)},onProceed:O}),(0,v.jsx)(f.pO,{isLoading:b,errorMessage:w,children:(0,v.jsxs)(u.l0,{onSubmit:function(e){e.preventDefault(),M(!E)},id:"review_action_taken_form",children:[(0,v.jsx)("h4",{children:"Review Action Taken"}),(0,v.jsx)("hr",{}),(0,v.jsxs)(u.cw,{children:[(0,v.jsxs)(u.__,{for:"action_taken",children:["Description of action taken",(0,v.jsx)("span",{className:"text-danger",children:" *"})]}),(0,v.jsx)(u.II,{defaultValue:k.act_taken,type:"textarea",rows:"6",id:"action_taken",required:!0,name:"action_taken"})]}),(0,v.jsx)("i",{className:"text-success text-end d-block",children:"Acted by ".concat(g.emp_firstname," ").concat(g.emp_lastname," - ").concat(g.office_code)}),(0,v.jsx)("i",{className:"text-success text-end d-block",children:"".concat(j()(k.act_date).fromNow()," - ").concat(j()(k.act_date).format("DD/MM/YYYY hh:mm A"))}),(0,v.jsx)(_.hJ,{title:"Scanned Copies",images:k.scanned&&(0,h.W)(k.scanned)}),(0,v.jsx)("br",{}),(0,v.jsx)(_.$f,{attachments:k.scanned&&(0,h.D)(k.attachments)}),(0,v.jsxs)(u.cw,{children:[(0,v.jsx)(u.__,{for:"approve_reject",children:"Approve/Reject"}),(0,v.jsxs)(u.II,{id:"approve_reject",name:"approve_reject",type:"select",required:!0,onChange:function(e){A("revise"===e.target.value)},children:[(0,v.jsx)("option",{value:"approve",children:"Approve"}),(0,v.jsx)("option",{value:"revise",children:"Revise"})]})]}),!I&&"Process-level Reviewer"===S.role_name&&(0,v.jsx)(_.AX,{label:"Communication signed by RED"}),I&&(0,v.jsxs)(u.cw,{children:[(0,v.jsx)(u.__,{className:"lead",for:"reject_remarks",children:"Remarks"}),(0,v.jsx)(u.II,{type:"textarea",id:"reject_remarks",required:!0,name:"reject_remarks"})]}),(0,v.jsxs)("div",{className:"d-flex justify-content-between",children:[(0,v.jsx)(_.xE,{}),(0,v.jsx)(f.s,{size:"md",color:"primary",name:"Submit",type:"submit",icon:(0,v.jsx)(o.fmn,{})})]})]})})]})}}}]);
//# sourceMappingURL=649.a804eeb5.chunk.js.map