const $=id=>document.getElementById(id),
esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),
r1=x=>Math.round(x*10)/10,f1=x=>r1(x).toFixed(1),sum=(a,k)=>a.reduce((s,r)=>s+r[k],0),
pct=(l,p)=>p>0?l/p*100:0,mean=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0,
iso=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"),
shift=(ds,n)=>{const d=new Date(ds+"T00:00:00");d.setDate(d.getDate()+n);return iso(d)},
fd=ds=>new Date(ds+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"}),
wd=ds=>new Date(ds+"T00:00:00").toLocaleDateString("en-IN",{weekday:"short"}),
TODAY=iso(new Date()),STATUS=["Available","Donated","Composted","Disposed"],
get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},
put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
let E=get("sc_entries",null),S=get("sc_status",{});

function seed(){ // 10 days of sample data, saved on first launch
 E=[];S={};const it=["Rice","Dal","Chapati","Sambar","Veg Curry","Idli"],b=[120,60,80,50,55,40],w=[.15,.08,.06,.10,.07,.05];
 for(let n=9;n>=0;n--){const ds=shift(TODAY,-n),st=450+(n*37)%61-30;
  it.forEach((x,k)=>{const p=r1(b[k]*st/450),fr=Math.max(.01,w[k]+((n*3+k*2)%5-2)/100+(x=="Rice"&&n==0?.08:0)),l=r1(p*fr),id="s"+n+k;
   E.push({id:id,date:ds,item:x,prep:p,served:r1(p-l),students:st,time:"14:"+String(10+k*5)});
   if(n>0)S[id]=["Donated","Donated","Composted","Disposed","Available"][(n+k)%5];});}
 put("sc_entries",E);put("sc_status",S);
}
if(!E)seed();

const left=e=>r1(e.prep-e.served),stat=e=>S[e.id]||"Available",kg=a=>r1(a.reduce((s,e)=>s+left(e),0)),
dayList=()=>[...new Set(E.map(e=>e.date))].sort(),
cur=()=>E.some(e=>e.date==TODAY)?TODAY:(dayList().pop()||TODAY), // latest day with data
tot=ds=>{const r=E.filter(e=>e.date==ds),p=sum(r,"prep"),s=sum(r,"served");return{p:p,s:s,l:p-s,st:Math.max(0,...r.map(e=>e.students))}},
week=()=>[6,5,4,3,2,1,0].map(n=>shift(cur(),-n)),
wkE=()=>E.filter(e=>week().includes(e.date)),
surp=()=>E.filter(e=>e.date>=shift(cur(),-2)&&e.date<=cur()&&left(e)>0);

function items(l){const m={};l.forEach(e=>{const o=m[e.item]||(m[e.item]={item:e.item,p:0,l:0});o.p+=e.prep;o.l+=e.prep-e.served});
 return Object.values(m).map(o=>({item:o.item,p:o.p,l:o.l,pc:pct(o.l,o.p)}))}

function predict(){ // demo calculation, not machine learning
 const st=dayList().filter(d=>d<=cur()).map(d=>tot(d).st).filter(x=>x>0),avg=mean(st),rec=mean(st.slice(-3)),pred=Math.round(.3*avg+.7*rec),
 kp=st.length?sum(E,"served")/st.reduce((a,b)=>a+b,0):.9;
 return{n:st.length,avg:avg,rec:rec,pred:pred,kp:kp,qty:pred*kp*1.05};
}

function alerts(){
 const a=[],c=cur(),t=tot(c),cr=items(E.filter(e=>e.date==c)),pr=items(E.filter(e=>e.date<c&&e.date>=shift(c,-6)));
 cr.forEach(x=>{const u=pr.find(y=>y.item==x.item);if(u&&x.pc>u.pc+3)a.push(["warn",esc(x.item)+" wastage is higher than usual ("+f1(x.pc)+"% against "+f1(u.pc)+"% earlier this week)."])});
 const p=predict();if(t.st&&p.pred<t.st*.97)a.push(["info","Tomorrow's predicted demand ("+p.pred+" students) is lower than today. Consider reducing preparation."]);
 const av=surp().filter(e=>stat(e)=="Available");if(av.length)a.push(["ok","Surplus food available for redistribution: "+f1(kg(av))+" kg."]);
 if(pct(t.l,t.p)>10)a.push(["warn","Overall waste is "+f1(pct(t.l,t.p))+"%, above the 10% mark."]);
 return a.length?a:[["ok","No alerts right now."]];
}

function impact(){ // prototype estimates: assumes 15% waste before the system, 300 L water and 2.5 kg CO2e per kg food
 const w=wkE(),P=sum(w,"prep"),L=P-sum(w,"served"),red=Math.max(0,P*.15-L),don=kg(E.filter(e=>stat(e)=="Donated"));
 return{pc:red/(P*.15||1)*100,red:red,water:Math.round(red*300),don:don,co2:(red+don)*2.5};
}

const cards=(id,a)=>{$(id).innerHTML=a.map(c=>'<div class="card"><div class="k">'+c[0]+'</div><div class="v">'+c[1]+'</div>'+(c[2]?'<div class="s">'+c[2]+'</div>':'')+'</div>').join("")};
function bars(id,lb,v,fmt){const m=Math.max(...v,1);
 $(id).innerHTML=v.map((x,i)=>'<div class="col"><div class="bw"><span class="val">'+fmt(x)+'</span><div class="bar'+(i==v.length-1?' last':'')+'" style="height:'+x/m*82+'%"></div></div><small>'+lb[i]+'</small></div>').join("")}
function hrows(id,rows,max,hi){
 $(id).innerHTML=rows.map(r=>'<div class="hr"><span>'+esc(r[0])+'</span><div class="track"><div class="fill'+(hi&&r[1]>hi?' hi':'')+'" style="width:'+Math.min(100,r[1]/max*100)+'%"></div></div><span>'+r[2]+'</span></div>').join("")||'<p class="s">No data yet.</p>'}

const PAGES=[["Dashboard","dashboard"],["Daily Entry","daily-entry"],["Demand Prediction","prediction"],["Analytics","analytics"],["Surplus Food","surplus"]];
if($("side")){
 $("side").innerHTML='<h1>SmartCanteen</h1><p>Food waste management</p>'+PAGES.map(p=>'<a href="'+p[1]+'.html"'+(document.body.dataset.page==p[1]?' class="active"':'')+'>'+p[0]+'</a>').join("")+'<a class="home" href="index.html">Home</a><button id="reset">Reset sample data</button>';
 $("reset").onclick=()=>{if(confirm("Delete all entries and restore the sample data?")){["sc_entries","sc_status"].forEach(k=>localStorage.removeItem(k));location.reload()}};
}
