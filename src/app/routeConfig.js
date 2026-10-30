export const routeConfig=[
 {path:'/dashboard',name:'Dashboard',group:'overview',end:true},
 {path:'/markets',name:'Markets',group:'markets',end:true},
 {path:'/trading',name:'Spot Trading',group:'trading',end:true},
 {path:'/portfolio',name:'Portfolio',group:'portfolio',end:true},
 {path:'/wallet',name:'Wallet',group:'wallet',end:true},
 {path:'/account',name:'Account',group:'account',end:true},
 {path:'/settings',name:'Settings',group:'settings',end:true},
 {path:'/login',name:'Login',group:'auth',end:true},
 {path:'/register',name:'Register',group:'auth',end:true},
 {path:'*',name:'Not Found',group:'misc',isCatchAll:true}
];
export const groupLabels={overview:'Overview',markets:'Markets',trading:'Trade',portfolio:'Portfolio',wallet:'Wallet',account:'Account',settings:'Settings',auth:'Authentication',misc:'Other'};
