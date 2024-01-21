"use strict";(self.webpackChunkimonitor=self.webpackChunkimonitor||[]).push([[585],{93585:function(e,t,n){n.r(t);var a=n(74165),r=n(15861),s=n(29439),o=n(72791),l=n(67945),i=n.n(l),c=(n(24655),n(43621)),u=n(72426),d=n.n(u),m=n(78820),p=(n(84734),n(14070),n(75985)),g=(n(5462),n(54261)),x=n(80184);t.default=function(e){var t=e.Data;(0,o.useEffect)((function(){i().init({duration:1e3})}),[]);var n=(0,o.useState)(""),l=(0,s.Z)(n,2),u=l[0],f=l[1],h=(0,o.useState)(""),b=(0,s.Z)(h,2),v=b[0],N=b[1],j=(0,o.useState)(!1),k=(0,s.Z)(j,2),w=k[0],A=k[1],C=(0,o.useState)(""),S=(0,s.Z)(C,2),y=S[0],O=S[1],Z=(0,o.useState)(""),E=(0,s.Z)(Z,2),D=(E[0],E[1]),T=d()().format("LLL"),L=d()(v).format("LLL"),B=(0,o.useState)(!1),I=(0,s.Z)(B,2),M=I[0],P=I[1],H=(0,o.useState)([]),F=(0,s.Z)(H,2),R=F[0],q=F[1],z=(0,o.useState)(),U=(0,s.Z)(z,2),W=U[0],G=U[1];function X(){P(!1),p.Am.success("Announcement Posted!",{position:"top-center",autoClose:1e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"light"}),A(!1),O(""),f(""),N(""),D(""),q(),G()}return(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)("div",{className:" h-screen  w-[100%] text-white  justify-center place-content-center flex",children:(0,x.jsxs)("form",{onSubmit:function(e){e.preventDefault();var n=(0,g.Z)();if(console.log(n),0!==u.trim().length&&0!==v.trim().length&&0!==y.trim().length){var s=function(){var e=(0,r.Z)((0,a.Z)().mark((function e(){var r,s,o,l;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(0!==u.trim()&&0!==y.trim()){e.next=3;break}return p.Am.warning("Invalid Input",{position:"top-center",autoClose:1e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"light"}),e.abrupt("return");case 3:if(!1!==M){e.next=12;break}return e.next=6,c.Z.from("AnnouncementTable").insert([{announcementTitle:n+"."+u,announcementAllow:w,announcementStartDate:T,announcementEndDate:L,announcementMessage:y,PostedBy:t.beneName}]);case 6:r=e.sent,r.data,r.error,X(),e.next=26;break;case 12:if(s=["jpg","jpeg","png","gif","bmp"],o=["docx","pdf","ods","pptx","xlsx"],l=W.split(".").pop().toLowerCase(),!s.includes(l)&&!o.includes(l)){e.next=23;break}return e.next=18,c.Z.storage.from("AnnouncementAttachmentFiles").upload(u+"/"+n+"."+W,R);case 18:return e.next=20,c.Z.from("AnnouncementTable").insert([{announcementTitle:n+"."+u,announcementAllow:w,announcementStartDate:T,announcementEndDate:L,announcementMessage:y}]);case 20:X(),e.next=26;break;case 23:return P(),p.Am.warning("Invalid File",{position:"top-center",autoClose:1e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"light"}),e.abrupt("return");case 26:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();s()}else p.Am.warning("Invalid input",{position:"top-center",autoClose:1e3,hideProgressBar:!1,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"light"})},className:"flex-col w-[100%] md:h-[85%] h-[82%] md:mt-3 mt-14 overflow-y-auto p-2 ","data-aos":"fade-left","data-aos-duration":"300",children:[(0,x.jsx)("label",{className:"text-[30px] font-bold ",children:"CREATE ANNOUNCEMENT"}),(0,x.jsxs)("div",{className:"mt-14",children:[(0,x.jsx)("label",{className:"pr-5 text-[20px] font-semibold ",children:"TITLE OF ANNOUNCEMENT:"}),(0,x.jsx)("input",{required:!0,value:u,onChange:function(e){return f(e.target.value)},type:"text",className:"rounded-md p-2 md:w-[75%] w-[100%] text-black"})]}),(0,x.jsxs)("div",{className:"pt-6 flex ",children:[(0,x.jsx)("label",{className:"pr-5 text-[20px] font-semibold ",children:"DURATION:"}),(0,x.jsx)("input",{min:function(){var e=new Date,t=String(e.getDate()+1).padStart(2,"0"),n=String(e.getMonth()+1).padStart(2,"0");return e.getFullYear()+"-"+n+"-"+t}(),required:!0,value:v,onChange:function(e){return N(e.target.value)},type:"date",className:"rounded-md p-2 text-black hover:cursor-pointer"})]}),(0,x.jsxs)("div",{className:"flex pt-6 ",children:[(0,x.jsx)("label",{className:"pr-5 text-[20px] font-semibold ",children:"ALLOW DROPBOX:"}),(0,x.jsx)("input",{type:"checkbox",value:w,onClick:function(){return A(!w)},className:"w-6 h-6 mt-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"})]}),(0,x.jsxs)("div",{className:"md:flex grid pt-6 ",children:[(0,x.jsx)("label",{className:"pr-5 text-[20px] font-semibold mb-1",children:"ADD ATTACHMENT:"}),(0,x.jsx)("input",{type:"file",accept:"e.g:.jpg,.jpeg,.png,.gif,.bmp,.docx,.pdf,.ods,.pptx,.xlsx",onChange:function(e){try{var t=e.target.files,n=e.target.files[0];t.length>0?(P(!0),q(n),G(n.name)):P(!1)}catch(a){}}}),M&&(0,x.jsx)("div",{className:"",children:(0,x.jsx)(m.bzc,{size:25,style:{fill:"black"}})})]}),(0,x.jsxs)("div",{className:"pt-6",children:[(0,x.jsx)("label",{className:"pr-5 text-[20px] font-semibold ",children:"MESSSAGE:"}),(0,x.jsx)("textarea",{required:!0,value:y,onChange:function(e){return O(e.target.value)},rows:"10",className:"mt-3  p-1 md:w-[97%] w-full text-sm text-gray-900  rounded-md resize-none",placeholder:"Write Remaks Here.."})]}),(0,x.jsx)("div",{children:(0,x.jsx)("button",{className:"md:w-[97%] w-[100%] h-[35px] mb-[100px] bg-[#0074B7]  rounded-md hover:bg-[#3282b5]",children:"SEND"})})]})}),(0,x.jsx)(p.Ix,{limit:1})]})}}}]);
//# sourceMappingURL=585.6f405bc7.chunk.js.map