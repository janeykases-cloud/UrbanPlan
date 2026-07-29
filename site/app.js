const state={stars:0,done:new Set(),tool:{type:'住宅',icon:'🏠',score:[2,1,0,0,0]},city:Array(30).fill(null),quizScore:0};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500)}
function confetti(){const box=$('#confetti'), colors=['#ff9f43','#ffd45b','#12a594','#2878d0','#e85d75'];for(let i=0;i<70;i++){const p=document.createElement('i');p.style.left=Math.random()*100+'vw';p.style.background=colors[i%colors.length];p.style.animationDelay=Math.random()*.5+'s';box.appendChild(p);setTimeout(()=>p.remove(),2300)}}
function complete(id,next){if(state.done.has(id))return;state.done.add(id);state.stars++;$('#starCount').textContent=state.stars;$('#progress').style.width=(state.stars/7*100)+'%';document.querySelector(id).classList.add('celebrate');if(next){document.querySelector(next).classList.remove('locked');setTimeout(()=>document.querySelector(next).scrollIntoView({behavior:'smooth',block:'start'}),500)}confetti()}

// Level 1
$$('#level1Options .choice').forEach(btn=>btn.onclick=()=>{if(state.done.has('#level1'))return;$$('#level1Options .choice').forEach(b=>b.classList.remove('selected','correct','wrong'));btn.classList.add('selected');if(btn.dataset.correct==='true'){btn.classList.add('correct');$('#feedback1').textContent='✅ 正確！分流能同時照顧學生安全、家長接送與道路順暢。';complete('#level1','#level2')}else{btn.classList.add('wrong');$('#feedback1').textContent='再想想：這個方案是否讓某些人更危險或完全被忽略？'}});

// Level 2
const checks=$$('#projects input');function updateBudget(){let used=checks.filter(c=>c.checked).reduce((s,c)=>s+Number(c.dataset.cost),0);$('#budgetLeft').textContent=(1000-used).toLocaleString('zh-TW');$('#budgetLeft').parentElement.style.color=used>1000?'#d33':'#b56c00';$('#budgetHint').textContent=used>1000?'預算超支，請重新選擇！':'已使用新臺幣'+used+'萬元。'}checks.forEach(c=>c.onchange=updateBudget);
$('#budgetSubmit').onclick=()=>{let selected=checks.filter(c=>c.checked), used=selected.reduce((s,c)=>s+Number(c.dataset.cost),0), groups=new Set(selected.map(c=>c.dataset.group));if(used>1000){$('#feedback2').textContent='❌ 超過預算，城市不能花不存在的錢。';return}if(selected.length<2||groups.size<3){$('#feedback2').textContent='🔎 請至少選2項，並照顧三種不同需求。';return}$('#feedback2').textContent='✅ 預算通過！你在有限經費中做出了多元公共選擇。';complete('#level2','#level3')};

// Level 3
$('#sortSubmit').onclick=()=>{let correct=0;$$('#sortGrid .sort-card').forEach(card=>{const s=card.querySelector('select');s.style.borderColor=s.value===card.dataset.answer?'#39a96b':'#e85d75';if(s.value===card.dataset.answer)correct++});if(correct===6){$('#feedback3').textContent='✅ 全部分類正確！永續城市要同時兼顧多個面向。';complete('#level3','#level4')}else $('#feedback3').textContent=`答對 ${correct}/6，請看看紅框選項再調整。`};

// Level 4
$('#smartSubmit').onclick=()=>{let correct=0,answered=0;$$('#smartGrid .smart-card').forEach(card=>{const r=card.querySelector('input:checked');if(r){answered++;if(r.value===card.dataset.answer)correct++}});if(answered<4){$('#feedback4').textContent='請完成四個判斷。';return}if(correct===4){$('#feedback4').textContent='✅ 完成！智慧城市也必須重視隱私、備援與數位公平。';complete('#level4','#level5')}else $('#feedback4').textContent=`答對 ${correct}/4。提示：科技之外，還要想「誰可能被排除」與「故障怎麼辦」。`};

// City builder
const canvas=$('#cityCanvas');for(let i=0;i<30;i++){const c=document.createElement('div');c.className='cell';c.dataset.i=i;c.onclick=()=>place(i);canvas.appendChild(c)}
function place(i){if($('#level5').classList.contains('locked'))return;if(state.tool.type==='清除')state.city[i]=null;else state.city[i]={...state.tool};renderCity()}
function renderCity(){[...canvas.children].forEach((c,i)=>{const item=state.city[i];c.innerHTML=item?`${item.icon}<small>${item.type}</small>`:''});const sums=[0,0,0,0,0];state.city.filter(Boolean).forEach(x=>x.score.forEach((v,i)=>sums[i]+=v));['scFair','scSafe','scEnv','scRes','scSmart'].forEach((id,i)=>$('#'+id).textContent=sums[i])}
$$('#toolButtons .tool').forEach(btn=>btn.onclick=()=>{$$('#toolButtons .tool').forEach(b=>b.classList.remove('active'));btn.classList.add('active');state.tool={type:btn.dataset.type,icon:btn.dataset.icon,score:btn.dataset.score.split(',').map(Number)}});
$('#resetCity').onclick=()=>{state.city=Array(30).fill(null);renderCity()};
$('#citySubmit').onclick=()=>{const types=new Set(state.city.filter(Boolean).map(x=>x.type));const need=[['住宅','學校'],['公園'],['公車','自行車'],['防災'],['太陽能','感測器'],['無障礙']];const passed=need.every(group=>group.some(t=>types.has(t)));const count=state.city.filter(Boolean).length;if(count<8||!passed){$('#feedback5').textContent='🔎 還差一些！請至少使用8格，並放入生活、綠地、交通、防災、智慧與共融設施。';return}$('#feedback5').textContent='✅ 未來城市完成！你的城市兼顧生活、環境、安全、科技與公平。';complete('#level5','#quiz')};

// Quiz
const quiz=[
 {q:'1. 城市規劃遇到不同需求時，最適合怎麼做？',a:['只聽人數最多的一方','比較不同需求與證據，再說明取捨','完全不做決定'],c:1},
 {q:'2. 下列哪一項最能減少都市熱島？',a:['增加水泥廣場','增加樹木與遮蔭','取消公園'],c:1},
 {q:'3. 智慧城市服務全部改用App，最需要注意什麼？',a:['手機顏色','數位落差與替代服務','App圖示大小'],c:1},
 {q:'4. 「平時是公園，災害時可作避難場所」展現哪種想法？',a:['單一用途','複合使用與城市韌性','增加車流'],c:1},
 {q:'5. 公共預算有限時，好的選擇應該是？',a:['每個方案都做','依需求、效益與公平性排序','只選最華麗的建設'],c:1}
];
const qb=$('#quizBox');quiz.forEach((item,i)=>{const d=document.createElement('div');d.className='quiz-question';d.innerHTML=`<h3>${item.q}</h3>`+item.a.map((x,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${x}</label>`).join('');qb.appendChild(d)});
$('#quizSubmit').onclick=()=>{let answered=0,score=0;quiz.forEach((item,i)=>{const r=document.querySelector(`input[name=q${i}]:checked`);if(r){answered++;if(Number(r.value)===item.c)score++}});if(answered<5){$('#feedbackQuiz').textContent='請完成五題再送出。';return}state.quizScore=score;if(score>=4){$('#feedbackQuiz').textContent=`🎉 通過！你答對 ${score}/5 題，已取得證書資格。`;complete('#quiz','#certificate');drawCert('城市小市民')}else $('#feedbackQuiz').textContent=`答對 ${score}/5 題。再複習前面的關卡後重新挑戰！`};

// Certificate
function drawCert(name){const cv=$('#certCanvas'),ctx=cv.getContext('2d');ctx.clearRect(0,0,cv.width,cv.height);const g=ctx.createLinearGradient(0,0,1200,850);g.addColorStop(0,'#fffdf2');g.addColorStop(1,'#e9f9ff');ctx.fillStyle=g;ctx.fillRect(0,0,1200,850);ctx.strokeStyle='#d5a928';ctx.lineWidth=18;ctx.strokeRect(28,28,1144,794);ctx.strokeStyle='#2878d0';ctx.lineWidth=4;ctx.strokeRect(52,52,1096,746);ctx.textAlign='center';ctx.fillStyle='#183153';ctx.font='bold 72px Microsoft JhengHei';ctx.fillText('城市規劃大師證書',600,170);ctx.font='34px Microsoft JhengHei';ctx.fillText('茲證明',600,250);ctx.fillStyle='#2878d0';ctx.font='bold 66px Microsoft JhengHei';ctx.fillText(name||'城市小市民',600,345);ctx.fillStyle='#183153';ctx.font='32px Microsoft JhengHei';ctx.fillText('完成多元需求、公共選擇、永續與智慧城市學習任務',600,430);ctx.fillText('並成功設計一座公平、安全、永續的未來城市',600,482);ctx.fillStyle='#39a96b';ctx.font='bold 40px Microsoft JhengHei';ctx.fillText(`認證成績：${state.quizScore || 5} / 5 題`,600,560);ctx.font='95px serif';ctx.fillText('🏙️　🌳　🚌',600,680);ctx.fillStyle='#5d708a';ctx.font='24px Microsoft JhengHei';ctx.fillText('城市規劃大師自學任務',600,750);ctx.textAlign='right';ctx.fillText(new Date().toLocaleDateString('zh-TW'),1090,785)}
$('#makeCert').onclick=()=>{const n=$('#studentName').value.trim();if(!n){toast('請先輸入姓名');return}drawCert(n);confetti();toast('專屬證書完成！')};
$('#downloadCert').onclick=()=>{const n=$('#studentName').value.trim()||'城市規劃大師';drawCert(n);const a=document.createElement('a');a.download=`${n}-城市規劃大師證書.png`;a.href=$('#certCanvas').toDataURL('image/png');a.click()};
$('#printCert').onclick=()=>{const n=$('#studentName').value.trim()||'城市規劃大師';drawCert(n);window.print()};
drawCert('城市小市民');
