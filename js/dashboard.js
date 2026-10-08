const c=cur(),t=tot(c),w=week(),i=impact();
$("date").textContent=new Date(c+"T00:00:00").toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
cards("stats",[["Students Served",t.st],["Food Prepared",f1(t.p)+" kg"],["Food Served",f1(t.s)+" kg"],["Food Wasted",f1(t.l)+" kg"],["Waste %",f1(pct(t.l,t.p))+"%"]]);
$("alerts").innerHTML=alerts().map(a=>'<div class="alert '+a[0]+'">'+a[1]+'</div>').join("");
bars("chart",w.map(wd),w.map(d=>tot(d).l),f1);
hrows("high",items(wkE()).sort((a,b)=>b.pc-a.pc).slice(0,4).map(x=>[x.item,x.pc,f1(x.pc)+"% ("+f1(x.l)+" kg)"]),20,10);
cards("impact",[["Food waste reduced",f1(i.pc)+"%","about "+f1(i.red)+" kg this week"],["Resources saved",i.water.toLocaleString("en-IN")+" L","water, estimate"],
 ["Surplus redistributed",f1(i.don)+" kg","donated so far"],["CO2 reduction",f1(i.co2)+" kg CO2e","estimate"]]);
