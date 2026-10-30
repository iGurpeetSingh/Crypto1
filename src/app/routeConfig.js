export const routeConfig=[
 {path:'/dashboard',name:'Dashboard',group:'overview',end:true},
 {path:'/markets',name:'Markets',group:'markets',end:true},
 {path:'/trading',name:'Spot Trading',group:'trading',end:true},
 {path:'/wallet',name:'Wallet',group:'wallet',end:true},
 {path:'*',name:'Not Found',group:'misc',isCatchAll:true}
];
export const groupLabels={overview:'Overview',markets:'Markets',trading:'Trade',wallet:'Wallet',misc:'Other'};
