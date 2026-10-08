let edit=null,all=false;
const msg=(t,bad)=>{$("msg").textContent=t;$("msg").className="msg"+(bad?" bad":"")},
calc=()=>{const p=+$("prep").value,s=+$("served").value;
 $("calc").textContent=p>0&&$("served").value!==""?"Leftover: "+f1(p-s)+" kg.  Waste: "+f1(pct(p-s,p))+"%":"Leftover and waste % are calculated automatically."};
function clear(){$("form").reset();$("date").value=TODAY;edit=null;$("sub").textContent="Save entry";$("cancel").hidden=true;calc()}
["prep","served"].forEach(i=>$(i).oninput=calc);
$("form").onsubmit=e=>{e.preventDefault();
 const r={date:$("date").value,item:$("item").value.trim(),prep:+$("prep").value,served:+$("served").value,students:+$("stu").value};
 if(r.served>r.prep){msg("Quantity served cannot be more than quantity prepared.",1);return}
 if(edit)Object.assign(E.find(x=>x.id==edit),r);else{r.id="e"+Date.now();r.time=new Date().toTimeString().slice(0,5);E.push(r)}
 put("sc_entries",E);msg(edit?"Entry updated.":"Entry saved. Dashboard, Analytics, Prediction and Surplus now include it.");clear();render()};
$("cancel").onclick=clear;
$("more").onclick=()=>{all=!all;render()};
function editE(id){const e=E.find(x=>x.id==id);edit=id;
 $("date").value=e.date;$("item").value=e.item;$("prep").value=e.prep;$("served").value=e.served;$("stu").value=e.students;
 $("sub").textContent="Update entry";$("cancel").hidden=false;calc();msg("Editing entry. Change the values and click Update entry.");window.scrollTo(0,0)}
function delE(id){if(!confirm("Delete this entry?"))return;E=E.filter(x=>x.id!=id);delete S[id];put("sc_entries",E);put("sc_status",S);render()}
function render(){
 const l=[...E].sort((a,b)=>b.date.localeCompare(a.date)||b.time.localeCompare(a.time)),v=all?l:l.slice(0,15);
 $("tbl").innerHTML='<tr><th>Date</th><th>Food item</th><th>Prepared</th><th>Served</th><th>Leftover</th><th>Waste %</th><th>Students</th><th></th></tr>'+
  v.map(e=>{const lf=e.prep-e.served;return '<tr><td>'+fd(e.date)+'</td><td>'+esc(e.item)+'</td><td>'+f1(e.prep)+' kg</td><td>'+f1(e.served)+' kg</td><td>'+f1(lf)+' kg</td><td>'+f1(pct(lf,e.prep))+'%</td><td>'+e.students+
  '</td><td><button class="sm" onclick="editE(\''+e.id+'\')">Edit</button> <button class="sm del" onclick="delE(\''+e.id+'\')">Delete</button></td></tr>'}).join("");
 $("more").textContent=all?"Show recent only":"Show all "+l.length+" entries";
 $("items").innerHTML=[...new Set(E.map(e=>e.item))].map(i=>'<option value="'+esc(i)+'">').join("");
}
clear();render();
