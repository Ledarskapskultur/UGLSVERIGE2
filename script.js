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

/* Veckan: fastnalad sekvens med roterande hjul */
(function(){
  const sek=document.querySelector('.week-pin');
  if(!sek)return;
  const spar=sek.querySelector('.wp-spar'),fast=sek.querySelector('.wp-fast');
  const dagar=[...sek.querySelectorAll('.wp-dagar li')];
  const prickar=[...sek.querySelectorAll('.wh-prick')];
  const dekor=sek.querySelector('.wh-dekor'),arc=sek.querySelector('.wh-arc');
  const nr=sek.querySelector('.wh-nr');
  const OMKRETS=2*Math.PI*128;
  let pa=null,aktiv=-1;
  function sattAktiv(i){
    if(i===aktiv)return;aktiv=i;
    dagar.forEach((d,n)=>d.classList.toggle('ar-pa',n===i));
    prickar.forEach((p,n)=>{p.classList.toggle('ar-pa',n===i);p.classList.toggle('ar-klar',n<i)});
    if(nr)nr.textContent=i+1;
  }
  function rita(){
    if(!pa)return;
    const r=spar.getBoundingClientRect();
    const total=spar.offsetHeight-window.innerHeight;
    let p=total>0?(-r.top)/total:0;
    p=Math.max(0,Math.min(1,p));
    const i=Math.max(0,Math.min(4,Math.floor(p*5+0.001)));
    sattAktiv(i);
    const fyllt=(i+1)/5;
    if(arc)arc.style.strokeDashoffset=OMKRETS*(1-fyllt);
    if(dekor)dekor.style.transform='rotate('+(p*300).toFixed(1)+'deg)';
  }
  function slaPa(){
    const kan=window.innerWidth>980&&window.innerHeight>560&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(kan===pa)return;
    pa=kan;sek.classList.toggle('pin-pa',kan);
    if(kan){aktiv=-1;sattAktiv(0);rita()}
    else{dagar.forEach(d=>d.classList.remove('ar-pa'));aktiv=-1}
  }
  let tick=false;
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(()=>{rita();tick=false})}},{passive:true});
  addEventListener('resize',()=>{slaPa();rita()});
  slaPa();rita();
})();

/* Mjuk parallax pa bildbanor */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const lager=[...document.querySelectorAll('[data-parallax]')];
  if(!lager.length)return;
  let tick=false;
  function rita(){
    const h=window.innerHeight;
    lager.forEach(el=>{
      const r=el.parentElement.getBoundingClientRect();
      if(r.bottom<-200||r.top>h+200)return;
      const mitt=(r.top+r.height/2-h/2)/h;
      el.style.transform='translate3d(0,'+(mitt*-6).toFixed(2)+'%,0)';
    });
    tick=false;
  }
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(rita)}},{passive:true});
  addEventListener('resize',rita);rita();
})();

/* Skalen: fastnalad sekvens med bildvaxling */
(function(){
  const sek=document.querySelector('.skal-pin');
  if(!sek)return;
  const spar=sek.querySelector('.sp-spar');
  const punkter=[...sek.querySelectorAll('.sp-punkter li')];
  const bilder=[...sek.querySelectorAll('.sp-bild')];
  const knappar=[...sek.querySelectorAll('.sp-punkt')];
  const antal=punkter.length;
  let pa=null,aktiv=-1;
  function sattAktiv(i){
    if(i===aktiv)return;aktiv=i;
    punkter.forEach((d,n)=>d.classList.toggle('ar-pa',n===i));
    bilder.forEach((d,n)=>d.classList.toggle('ar-pa',n===i));
    knappar.forEach((d,n)=>{d.classList.toggle('ar-pa',n===i);d.classList.toggle('ar-klar',n<i)});
  }
  function rita(){
    if(!pa)return;
    const r=spar.getBoundingClientRect();
    const total=spar.offsetHeight-window.innerHeight;
    let p=total>0?(-r.top)/total:0;
    p=Math.max(0,Math.min(1,p));
    sattAktiv(Math.max(0,Math.min(antal-1,Math.floor(p*antal+0.001))));
  }
  let obs=null;
  function slaPa(){
    const kan=window.innerWidth>980&&window.innerHeight>560&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(kan===pa)return;
    pa=kan;sek.classList.toggle('spin-pa',kan);
    if(obs){obs.disconnect();obs=null}
    if(kan){aktiv=-1;sattAktiv(0);rita()}
    else{
      punkter.forEach(d=>d.classList.remove('ar-pa'));aktiv=-1;
      bilder.forEach((d,n)=>d.classList.toggle('ar-pa',n===0));
      obs=new IntersectionObserver(poster=>{
        poster.forEach(po=>{if(po.isIntersecting){
          const i=punkter.indexOf(po.target);
          bilder.forEach((d,n)=>d.classList.toggle('ar-pa',n===i));
          knappar.forEach((d,n)=>{d.classList.toggle('ar-pa',n===i);d.classList.toggle('ar-klar',n<i)});
        }});
      },{rootMargin:'-40% 0px -45% 0px'});
      punkter.forEach(d=>obs.observe(d));
    }
  }
  knappar.forEach(k=>k.addEventListener('click',()=>{
    if(!pa){return}
    const i=+k.getAttribute('data-hopp');
    const total=spar.offsetHeight-window.innerHeight;
    const mal=spar.getBoundingClientRect().top+window.scrollY+total*((i+0.5)/antal);
    window.scrollTo({top:mal,behavior:'smooth'});
  }));
  let tick=false;
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(()=>{rita();tick=false})}},{passive:true});
  addEventListener('resize',()=>{slaPa();rita()});
  slaPa();rita();
})();

/* Forskningsgrunden: fastnalad sekvens */
(function(){
  const sek=document.querySelector('.forsk-pin');
  if(!sek)return;
  const spar=sek.querySelector('.fp-spar');
  const punkter=[...sek.querySelectorAll('.fp-modeller li')];
  const paneler=[...sek.querySelectorAll('.fp-paneler .forsk-panel')];
  const knappar=[...sek.querySelectorAll('.fp-punkt')];
  const antal=punkter.length;
  let pa=null,aktiv=-1,obs=null;
  function sattAktiv(i){
    if(i===aktiv)return;aktiv=i;
    punkter.forEach((d,n)=>d.classList.toggle('ar-pa',n===i));
    paneler.forEach((d,n)=>d.classList.toggle('ar-pa',n===i));
    knappar.forEach((d,n)=>{d.classList.toggle('ar-pa',n===i);d.classList.toggle('ar-klar',n<i)});
  }
  function rita(){
    if(!pa)return;
    const r=spar.getBoundingClientRect();
    const total=spar.offsetHeight-window.innerHeight;
    let p=total>0?(-r.top)/total:0;
    p=Math.max(0,Math.min(1,p));
    sattAktiv(Math.max(0,Math.min(antal-1,Math.floor(p*antal+0.001))));
  }
  function slaPa(){
    const kan=window.innerWidth>980&&window.innerHeight>600&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(kan===pa)return;
    pa=kan;sek.classList.toggle('fpin-pa',kan);
    if(obs){obs.disconnect();obs=null}
    if(kan){aktiv=-1;sattAktiv(0);rita()}
    else{
      punkter.forEach(d=>d.classList.remove('ar-pa'));aktiv=-1;
      paneler.forEach((d,n)=>d.classList.toggle('ar-pa',n===0));
      obs=new IntersectionObserver(poster=>{
        poster.forEach(po=>{if(po.isIntersecting){
          const i=punkter.indexOf(po.target);
          paneler.forEach((d,n)=>d.classList.toggle('ar-pa',n===i));
          knappar.forEach((d,n)=>{d.classList.toggle('ar-pa',n===i);d.classList.toggle('ar-klar',n<i)});
        }});
      },{rootMargin:'-40% 0px -45% 0px'});
      punkter.forEach(d=>obs.observe(d));
    }
  }
  knappar.forEach(k=>k.addEventListener('click',()=>{
    if(!pa)return;
    const i=+k.getAttribute('data-hopp');
    const total=spar.offsetHeight-window.innerHeight;
    window.scrollTo({top:spar.getBoundingClientRect().top+window.scrollY+total*((i+0.5)/antal),behavior:'smooth'});
  }));
  let tick=false;
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(()=>{rita();tick=false})}},{passive:true});
  addEventListener('resize',()=>{slaPa();rita()});
  slaPa();rita();
})();
