const w=week(),W=wkE(),P=sum(W,"prep"),L=P-sum(W,"served"),pc=pct(L,P),score=Math.max(0,Math.round(100-pc*4)),it=items(W);
cards("stats",[["Waste % (7 days)",f1(pc)+"%"],["Food wasted",f1(L)+" kg","of "+f1(P)+" kg prepared"],["Sustainability score",score+" / 100"]]);
const dp=w.map(d=>{const t=tot(d);return{d:d,pc:pct(t.l,t.p),p:t.p}});
bars("trend",w.map(wd),dp.map(x=>x.pc),v=>f1(v)+"%");
const byKg=[...it].sort((a,b)=>b.l-a.l);
hrows("top",byKg.slice(0,6).map(x=>[x.item,x.l,f1(x.l)+" kg"]),Math.max(1,...byKg.map(x=>x.l)));
$("tbl").innerHTML='<tr><th>Food item</th><th>Prepared</th><th>Wasted</th><th>Waste %</th></tr>'+[...it].sort((a,b)=>b.pc-a.pc).map(x=>'<tr><td>'+esc(x.item)+'</td><td>'+f1(x.p)+' kg</td><td>'+f1(x.l)+' kg</td><td>'+f1(x.pc)+'%</td></tr>').join("");
$("score").innerHTML='<p><b>'+(pc<=5?"Good: close to the 5% target":pc<=10?"Moderate: room to improve":"High: action needed")+'</b></p>'+
 '<div class="mw"><div class="meter"><i style="background:#3b8f4a;flex:5"></i><i style="background:#d9a21b;flex:5"></i><i style="background:#b3392f;flex:10"></i></div><div class="mark" style="left:calc('+Math.min(pc,20)/20*100+'% - 1px)"></div></div>'+
 '<div class="ml"><span style="flex:5">0 to 5%</span><span style="flex:5">5 to 10%</span><span style="flex:10">10% and above</span></div><p class="note">Score = 100 minus 4 points for every 1% of food wasted.</p>';
const ins=[],d2=dp.filter(x=>x.p>0);
if(it.length){const h=[...it].sort((a,b)=>b.pc-a.pc)[0];ins.push(esc(h.item)+" has the highest waste rate ("+f1(h.pc)+"%). Reducing it to 5% would save about "+f1(Math.max(0,h.l-h.p*.05))+" kg a week.")}
if(d2.length>1){const s=[...d2].sort((a,b)=>b.pc-a.pc);ins.push("Highest waste day: "+wd(s[0].d)+" ("+f1(s[0].pc)+"%). Lowest: "+wd(s[s.length-1].d)+" ("+f1(s[s.length-1].pc)+"%).");
 const a=d2.slice(-3),b=d2.slice(0,-3);
 if(b.length){const df=mean(a.map(x=>x.pc))-mean(b.map(x=>x.pc));ins.push("Waste over the last 3 days is "+f1(Math.abs(df))+" percentage points "+(df>0?"higher":"lower")+" than earlier in the week.")}}
ins.push(pc<=5?"Overall waste is within the 5% target. Keep preparing according to predicted demand.":"Overall waste of "+f1(pc)+"% is above the 5% target. Preparing closer to the predicted demand is the quickest fix.");
$("ins").innerHTML=ins.map(x=>"<li>"+x+"</li>").join("");
