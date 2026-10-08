function setS(id,v){S[id]=v;put("sc_status",S);render()}
function render(){
 const l=surp().sort((a,b)=>b.date.localeCompare(a.date)||b.time.localeCompare(a.time)),tk=kg(l),by=s=>kg(l.filter(e=>stat(e)==s));
 cards("stats",STATUS.map(s=>[s=="Available"?"Available for redistribution":s,f1(by(s))+" kg"]));
 $("sum").textContent=tk?"Of "+f1(tk)+" kg surplus in the last 3 days, "+f1(by("Donated")+by("Composted"))+" kg ("+f1(pct(by("Donated")+by("Composted"),tk))+"%) was donated or composted, "+f1(by("Disposed"))+" kg was disposed and "+f1(by("Available"))+" kg is still available.":"No surplus food recorded.";
 $("tbl").innerHTML='<tr><th>Food Item</th><th>Quantity</th><th>Time</th><th>Status</th></tr>'+l.map(e=>'<tr><td>'+esc(e.item)+'</td><td>'+f1(left(e))+' kg</td><td>'+fd(e.date)+', '+e.time+
  '</td><td><span class="badge b-'+stat(e)+'">'+stat(e)+'</span><select onchange="setS(\''+e.id+'\',this.value)">'+STATUS.map(s=>'<option'+(s==stat(e)?' selected':'')+'>'+s+'</option>').join("")+'</select></td></tr>').join("");
}
render();
