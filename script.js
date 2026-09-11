const colors=['#123d35','#9aaa96','#f4f0e7','#123d35','#b89a62','#9aaa96','#123d35','#f4f0e7','#b89a62','#123d35'];
function peopleMarkup(){return colors.map((c,i)=>{const a=i*36-90,r=37,x=50+Math.cos(a*Math.PI/180)*r,y=50+Math.sin(a*Math.PI/180)*r;return `<g transform="translate(${x} ${y}) rotate(${a+90})"><circle cy="-3.4" r="3.6" fill="${c}"/><path d="M-6 2 Q0 9 6 2" fill="none" stroke="${c}" stroke-width="4.2" stroke-linecap="round"/></g>`}).join('')}
document.querySelectorAll('#people,.footer-people').forEach(el=>el.innerHTML=peopleMarkup());
const menu=document.querySelector('.menu-button'),nav=document.querySelector('.nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const rorelseAv=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* stegvis intoning av innehall i rutnat */
if(!rorelseAv){
  document.querySelectorAll('.reason-rows,.research-grid,.goal-grid,.days,.veckoikoner,.ingar-grid,.lm-rader,.formel,.outcome-grid,.org-points,.check-list,.handledare-lista,.fragor').forEach(c=>{
    [...c.children].forEach((el,i)=>{el.classList.add('stagg');el.style.transitionDelay=Math.min(i,7)*70+'ms'});
  });
}
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
}),{threshold:.06,rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
/* lasindikator */
if(!rorelseAv){
  const bar=document.createElement('div');bar.className='lasbar';document.body.appendChild(bar);
  let tick=false;
  const uppdatera=()=>{
    const h=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(h>0?Math.min(window.scrollY/h,1)*100:0)+'%';tick=false;
  };
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(uppdatera)}},{passive:true});
  uppdatera();
}
/* herosektionen tonar in vid laddning */
requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.add('laddad')));
/* Forskningsgrunden: klickbara modeller */
(function(){
  const flikar=[...document.querySelectorAll('.research-kort[data-modell]')];
  if(!flikar.length)return;
  const paneler={lm:document.getElementById('panel-lm'),imgd:document.getElementById('panel-imgd'),konflikt:document.getElementById('panel-konflikt')};
  function valj(namn,flytta){
    flikar.forEach(f=>{
      const pa=f.getAttribute('data-modell')===namn;
      f.classList.toggle('ar-vald',pa);
      f.setAttribute('aria-selected',pa?'true':'false');
    });
    Object.keys(paneler).forEach(k=>{if(paneler[k])paneler[k].hidden=k!==namn});
    if(flytta&&paneler[namn]){
      const r=paneler[namn].getBoundingClientRect();
      if(r.bottom>window.innerHeight)paneler[namn].scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  }
  flikar.forEach((f,i)=>{
    f.addEventListener('click',()=>valj(f.getAttribute('data-modell'),true));
    f.addEventListener('keydown',e=>{
      if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;
      e.preventDefault();
      const n=flikar[(i+(e.key==='ArrowRight'?1:flikar.length-1))%flikar.length];
      n.focus();valj(n.getAttribute('data-modell'),true);
    });
  });
})();
