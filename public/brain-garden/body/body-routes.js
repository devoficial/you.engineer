// Teaching routes in the body model's frame, not reconstructed nerve tracts.
export const bodyLocations={brain:[0,7.52,-.03],ear:[.36,7.38,.06],eye:[.17,7.48,.35],nose:[0,7.35,.43],mouth:[0,7.17,.36],neck:[0,6.92,0],spine:[0,5.75,-.23],hand:[1.46,3.80,.04],leg:[.38,2.3,.02],heart:[.13,6.06,.15],lungs:[0,6.12,.04],gut:[.12,5.2,.12],kidney:[.28,5.19,-.08],adrenal:[.29,5.48,-.06],mammary:[.4,6.13,.27],blood:[.06,5.7,.13],device:[1.12,7.2,.24]};
export function bodyRoute(step){
 const b=bodyLocations,route=step.route||'',cervical=[0,6.65,-.17],medulla=[0,7.11,-.13];
 const arm=[b.hand,[1.37,4.25,.05],[1.12,5,.02],[.65,6.58,0],cervical];
 let points,kind='nerve';
 if(route==='reflex')points=step.id==='withdraw'?[...arm].reverse():[...arm,[.08,6.58,-.15],[.23,6.53,-.08]];
 else if(['adrenal','kidney','hormone','mammary'].includes(route)){kind='hormone';const target=route==='hormone'?'mammary':route;points=[b.brain,[.10,7,.12],b.heart,[.12,5.65,.14],b[target]];}
 else if(step.phase==='blood'||['blood','blood-return'].includes(route)){kind='blood';points=route==='blood-return'?[b.brain,[.18,6.8,.04],b.heart]:[b[step.body]||b.blood,b.heart,[.12,6.85,.08],b.brain];}
 else if(route==='device-hand'){kind='device';points=[b.device,[1.68,6.5,.40],[1.78,4.9,.38],b.hand];}
 else if(route==='device'){kind='device';points=[[.20,7.85,.06],[.70,7.96,.20],b.device];}
 else if(route.startsWith('arm'))points=[...arm,medulla,b.brain];
 else if(route.startsWith('leg'))points=[b.leg,[.36,3.8,-.06],[0,4.75,-.20],cervical,medulla,b.brain];
 else if(route==='neck-out')points=[b.neck,[.20,6.78,.02],cervical,medulla,b.brain];
 else if(route.startsWith('vagus'))points=[b.gut,[.12,5.9,.07],[.12,6.6,.07],medulla,b.brain];
 else if(route.startsWith('heart'))points=[b.heart,[.2,6.45,.05],[.14,6.95,.06],medulla,b.brain];
 else if(route.startsWith('lung'))points=[b.lungs,cervical,medulla,b.brain];
 else {const p=b[route.split('-')[0]]||b[step.body]||b.brain;points=[p,[p[0]*.6,7.24,.04],b.brain];}
 if(kind==='nerve'&&route!=='reflex'&&route.endsWith('-out'))points.reverse();
 return {kind,points:points.filter((p,i)=>!i||p.some((n,k)=>n!==points[i-1][k]))};
}
