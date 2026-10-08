const p=predict(),c=cur(),w=week();
$("tmr").textContent=fd(shift(c,1));
cards("stats",[["Average students served",Math.round(p.avg),"all "+p.n+" recorded days"],["Recent average",Math.round(p.rec),"last 3 days"],
 ["Predicted students tomorrow",p.pred,fd(shift(c,1))],["Recommended quantity to prepare",f1(p.qty)+" kg","includes 5% safety buffer"]]);
$("steps").innerHTML=[
 "Average students per day over all "+p.n+" recorded days = <b>"+Math.round(p.avg)+"</b>.",
 "Recent average (last 3 days) = <b>"+Math.round(p.rec)+"</b>.",
 "Predicted students = 30% x average + 70% x recent average = 0.3 x "+Math.round(p.avg)+" + 0.7 x "+Math.round(p.rec)+" = <b>"+p.pred+"</b>.",
 "Food actually served per student = total kg served / total students = <b>"+p.kp.toFixed(2)+" kg</b>.",
 "Recommended quantity = "+p.pred+" x "+p.kp.toFixed(2)+" x 1.05 (5% buffer) = <b>"+f1(p.qty)+" kg</b>."].map(x=>"<li>"+x+"</li>").join("");
bars("chart",w.map(wd),w.map(d=>tot(d).st),x=>x);
