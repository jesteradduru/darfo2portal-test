"use strict";(self.webpackChunkda_rfo_02_portal=self.webpackChunkda_rfo_02_portal||[]).push([[180],{7180:function(e,n,t){t.r(n);var o=t(885),a=t(2791),r=t(9051),s=t(370),c=t(3513),i=t(1405),u=t(1588),l=t(1600),m=t(2666),f=t(184);n.default=function(){var e=(0,a.useState)(!1),n=(0,o.Z)(e,2),t=n[0],d=n[1],_=(0,a.useState)(!1),p=(0,o.Z)(_,2),g=p[0],h=p[1],x=(0,a.useState)(""),j=(0,o.Z)(x,2),v=j[0],b=j[1],S=(0,a.useState)({}),C=(0,o.Z)(S,2),L=C[0],M=C[1],A=(0,i.v9)((function(e){return e.accounts})),X=A.users,J=A.isLoading,k=A.groups,w=(0,i.v9)((function(e){return e.offices})).offices,O=(0,i.v9)((function(e){return e.roles})).roles,Z=(0,i.I0)();(0,a.useEffect)((function(){Z((0,u.T8)()),Z((0,l.T)()),Z((0,m.F3)()),Z((0,u.jA)())}),[Z]);var N=[{name:"Username",selector:function(e){return e.username},sortable:!0},{name:"Full Name",selector:function(e){return e.fullname},sortable:!0},{name:"Position",selector:function(e){return e.position},sortable:!0},{name:"Role",selector:function(e){return e.role},sortable:!0},{name:"Office",selector:function(e){return e.office},sortable:!0,wrap:!0},{name:"Status",cell:function(e){return"activated"===e.status?(0,f.jsx)(r.Ct,{color:"success",children:"Activated"}):(0,f.jsx)(r.Ct,{color:"danger",children:"Deactivated"})}},{name:"Action",cell:function(e){return(0,f.jsx)(s.JQ,{userId:e.user_id,toggleEditAccountModal:function(){h(!g),M(e)}})}}],P=X.map((function(e){return{user_id:e.user_id,username:e.user_username,role_id:e.role_id,user_supervisor_id:e.user_supervisor_id,agency_no:e.emp_agencyIdNo,firstname:e.emp_firstname,middlename:e.emp_middlename,lastname:e.emp_lastname,extension:e.emp_extension,birthdate:e.emp_dateOfBirth,sex:e.emp_sex,contact:e.emp_contact,office_id:e.office_id,email:e.emp_email,fullname:"".concat(e.emp_firstname," ").concat(e.emp_middlename[0],". ").concat(e.emp_lastname," ").concat(e.emp_extension," "),position:e.emp_position,role:e.role_name,office:e.office_name,status:e.user_accountStatus,group_id:e.group_id}})).filter((function(e){return e.username.toLowerCase().includes(v.toLocaleLowerCase())})),y=w.map((function(e){return{name:e.office_code+" - "+e.office_name,value:e.office_id}})),I=O.map((function(e){return{name:e.role_name,value:e.role_id}})),D=X.map((function(e){return{name:"".concat(e.emp_firstname," ").concat(e.emp_middlename[0],". ").concat(e.emp_lastname," ").concat(e.emp_extension," - ").concat(e.emp_position," "),value:e.user_id}})),E=k.map((function(e){return{name:"".concat(e.group_name),value:e.group_id}}));return(0,f.jsxs)(r.W2,{className:"mt-3",children:[(0,f.jsx)(s.tv,{isModalOpen:t,toggleModal:d,officeList:y,roleList:I,users:D,groups:E}),(0,f.jsx)(s.MM,{isModalOpen:g,toggleModal:h,officeList:y,roleList:I,users:D,userData:L,groups:E}),(0,f.jsxs)(r.X2,{children:[(0,f.jsx)(r.JX,{md:"12",children:(0,f.jsx)(s.yW,{name:"Accounts",buttonName:"Add Account",toggleModal:function(){return d(!t)}})}),(0,f.jsx)(r.JX,{md:"12",children:(0,f.jsxs)(r.X2,{children:[(0,f.jsx)(r.JX,{sm:"12",md:"6",children:(0,f.jsx)(s.kP,{placeholder:"Search user...",onSearchValueChange:function(e){b(e.target.value)},searchValue:v,clearSearch:function(){b("")}})}),(0,f.jsx)(r.JX,{})]})}),(0,f.jsx)(r.JX,{children:(0,f.jsx)(c.ZP,{data:P,columns:N,highlightOnHover:!0,pagination:!0,progressPending:J,progressComponent:(0,f.jsx)(r.$j,{})})})]})]})}}}]);
//# sourceMappingURL=180.12357ed5.chunk.js.map