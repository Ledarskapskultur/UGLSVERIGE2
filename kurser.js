(function(){
  var MANADER=['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'];
  var BILDER=['ugl-grupp.webp','ugl-samtal.webp','ugl-tid.webp','ugl-feedback.webp','ugl-oppenhet.webp','ugl-upplevelse.webp','ugl-handledare.webp','ugl-hero.webp'];
  var REGIONER={'Stockholm':'Stockholm','Lidingö':'Stockholm','Täby':'Stockholm','Värmdö':'Stockholm','Nacka Strand, Stockholm':'Stockholm',
                'Helsingborg':'Skåne','Kristianstad':'Skåne','Halmstad':'Halland','Göteborg':'Västra Götaland','Mölnlycke':'Västra Götaland',
                'Jönköping':'Jönköping','Sundsvall/Timrå':'Västernorrland'};
  function fmt(d){return d.getDate()+' '+MANADER[d.getMonth()]}
  function kr(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' kr'}
  var SVG=function(d){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'};
  var IKON={kalender:SVG('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
            plats:SVG('<path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>'),
            person:SVG('<circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/>'),
            bil:SVG('<path d="M4 16h16v-3l-2-5H6l-2 5z"/><circle cx="7.5" cy="17.5" r="1.6"/><circle cx="16.5" cy="17.5" r="1.6"/>')};
  function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}

  var kurser=window.UGL_RADER.split('\n').map(function(rad,i){
    var d=rad.split('|'),start=new Date(d[0]+'T00:00:00'),slut=new Date(start.getTime()+4*864e5),logi=+d[5],kurspris=d[7]?+d[7]:window.UGL_KURSPRIS,samlat=!logi&&!!d[7];
    return {id:i,start:start,slut:slut,vecka:+d[1],anlaggning:d[2],ort:d[3],
      region:REGIONER[d[3]]||d[3],
      handledare:d[4]?d[4].split(';'):[],kurspris:kurspris,logi:logi,samlat:samlat,total:logi?kurspris+logi:(samlat?kurspris:0),
      ledig:d[6]==='L',
      bild:'assets/'+BILDER[hash(d[2]+d[3])%BILDER.length],
      datum:d[0],
      period:fmt(start)+' till '+fmt(slut)+' '+slut.getFullYear(),
      manad:start.getFullYear()+'-'+String(start.getMonth()+1).padStart(2,'0')};
  }).sort(function(a,b){return a.start-b.start});

  var ORTER=window.UGL_ORTER.split('\n').map(function(r){var d=r.split('|');return {namn:d[0],lat:+d[1],lon:+d[2]}});
  var KURSORT=window.UGL_KURSORT;
  function rad(g){return g*Math.PI/180}
  function avstand(a,b){
    var R=6371,dLat=rad(b[0]-a[0]),dLon=rad(b[1]-a[1]);
    var x=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(rad(a[0]))*Math.cos(rad(b[0]))*Math.sin(dLon/2)*Math.sin(dLon/2);
    return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));
  }
  function restidTimmar(fran,ort){
    var till=KURSORT[ort]; if(!fran||!till)return null;
    var km=avstand([fran.lat,fran.lon],till)*1.3;
    return km/78;
  }
  function restidText(t){
    if(t===null)return '';
    if(t<0.35)return 'på orten';
    var m=Math.round(t*60),h=Math.floor(m/60);m=m-h*60;m=Math.round(m/5)*5;
    if(m===60){h++;m=0}
    return 'ca '+(h?h+' tim'+(m?' '+m+' min':''):m+' min')+' bilresa';
  }
  function hittaOrt(text){
    var t=(text||'').trim().toLowerCase();
    if(!t)return null;
    var exakt=ORTER.filter(function(o){return o.namn.toLowerCase()===t})[0];
    if(exakt)return exakt;
    var borjar=ORTER.filter(function(o){return o.namn.toLowerCase().indexOf(t)===0});
    if(borjar.length===1)return borjar[0];
    var inne=ORTER.filter(function(o){return o.namn.toLowerCase().indexOf(t)>-1});
    if(inne.length===1)return inne[0];
    return borjar.length?borjar[0]:null;
  }
  var svar={period:null,ort:null,restid:null},guideKlar=false,steg=1;

  var $=function(id){return document.getElementById(id)};
  var lista=$('kurslista'),raknare=$('kursraknare'),fTid=$('filter-tid'),fRegion=$('filter-region'),
      fOrt=$('filter-ort'),fPris=$('filter-pris'),fLedig=$('filter-ledig'),fSort=$('filter-sort'),
      merKnapp=$('visa-fler'),select=$('kurs'),bar=$('valbar'),panel=$('jamforpanel'),
      ipanel=$('intressepanel'),visade=6,valda=[],bevakade=[];

  function fyll(el,varden,etikett){varden.forEach(function(v){
    el.insertAdjacentHTML('beforeend','<option value="'+v[0]+'">'+v[1]+'</option>')})}
  fyll(fTid,[...new Set(kurser.map(function(k){return k.manad}))].map(function(m){
    var d=new Date(m+'-01T00:00:00');return [m,MANADER[d.getMonth()]+' '+d.getFullYear()]}));
  fyll(fRegion,[...new Set(kurser.map(function(k){return k.region}))].sort(function(a,b){return a.localeCompare(b,'sv')}).map(function(r){return [r,r]}));
  fyll(fOrt,[...new Set(kurser.map(function(k){return k.ort}))].sort(function(a,b){return a.localeCompare(b,'sv')}).map(function(o){return [o,o]}));

  function manadFram(n){var d=new Date();d.setMonth(d.getMonth()+n);return d}
  function filtrerade(){
    var idag=new Date(),spann=null;
    if(svar.period==='0')spann=[idag,manadFram(3)];
    else if(svar.period==='1')spann=[manadFram(3),manadFram(6)];
    else if(svar.period==='2')spann=[manadFram(6),manadFram(12)];
    var max=svar.restid&&svar.restid!=='x'?+svar.restid:null;
    var f=kurser.filter(function(k){
      if(spann&&(k.start<spann[0]||k.start>spann[1]))return false;
      if(max&&svar.ort){var t=restidTimmar(svar.ort,k.ort);if(t===null||t>max)return false}
      if(fTid.value&&k.manad!==fTid.value)return false;
      if(fRegion.value&&k.region!==fRegion.value)return false;
      if(fOrt.value&&k.ort!==fOrt.value)return false;
      if(fPris.value&&(!k.total||k.total>=+fPris.value))return false;
      if(fLedig.checked&&!k.ledig)return false;
      return true;
    });
    if(fSort.value==='pris')f.sort(function(a,b){return (a.total||1e9)-(b.total||1e9)});
    else if(fSort.value==='ort')f.sort(function(a,b){return a.ort.localeCompare(b.ort,'sv')||a.start-b.start});
    else f.sort(function(a,b){return a.start-b.start});
    return f;
  }
  function slug(s){return s.toLowerCase().replace(/[åä]/g,'a').replace(/ö/g,'o').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function lank(k){return 'kurs?k='+k.datum+'-'+slug(k.anlaggning)}
  function etikett(k){return 'Vecka '+k.vecka+', '+k.period+', '+k.anlaggning+', '+k.ort}

  function rita(){
    var f=filtrerade();
    raknare.innerHTML='<b>'+f.length+'</b> '+(f.length===1?'kurs':'kurser');
    var billigast=null,narmast=f.length?f[0].id:null;
    f.forEach(function(k){if(k.total&&(!billigast||k.total<billigast.total))billigast=k});
    lista.innerHTML=f.slice(0,visade).map(function(k){
      var mark = (guideKlar&&k.id===f[0].id) ? '<figcaption class="mark">Bäst matchning</figcaption>'
               : (k.id===narmast ? '<figcaption class="mark">Närmast i tiden</figcaption>'
               : (billigast&&k.id===billigast.id ? '<figcaption class="mark mark-pris">Lägst totalpris</figcaption>' : ''));
      var pris=!k.total
        ? '<strong>Pris meddelas</strong><span class="kort-moms">Kontakta oss för uppgift</span>'
        : '<strong>'+kr(k.total)+'</strong><span class="kort-moms">exkl. moms</span>'+
          (k.samlat
            ? '<dl class="kort-split"><div><dt>Kurs, kost och logi</dt><dd>Ingår</dd></div></dl>'
            : '<dl class="kort-split"><div><dt>Kurs</dt><dd>'+kr(k.kurspris)+'</dd></div><div><dt>Kost och logi</dt><dd>'+kr(k.logi)+'</dd></div></dl>');
      var hl=k.handledare.length?k.handledare.join('<br>'):'Handledare meddelas senare';
      var vald=valda.indexOf(k.id)>-1;
      return '<li class="kort'+(k.ledig?'':' is-full')+'">'+
        '<figure><img src="'+k.bild+'" alt="Deltagare under en UGL-vecka" loading="lazy">'+
          (k.ledig?mark:'<figcaption>Fullbokad</figcaption>')+'</figure>'+
        '<div class="kort-mitt">'+
          '<h3>Vecka '+k.vecka+'</h3>'+
          '<p class="kort-rad">'+IKON.kalender+k.period+'</p>'+
          '<p class="kort-rad">'+IKON.plats+k.anlaggning+', '+k.ort+'</p>'+
          '<p class="kort-rad kort-hl">'+IKON.person+hl+'</p>'+
          (svar.ort?'<p class="kort-rad kort-resa">'+IKON.bil+restidText(restidTimmar(svar.ort,k.ort))+' från '+svar.ort.namn+'</p>':'')+
        '</div>'+
        '<div class="kort-pris">'+pris+'</div>'+
        '<div class="kort-val">'+
          '<label class="jamfor"><input type="checkbox" data-jamfor="'+k.id+'"'+(vald?' checked':'')+'> Jämför</label>'+
          '<label class="jamfor"><input type="checkbox" data-bevaka="'+k.id+'"'+(bevakade.indexOf(k.id)>-1?' checked':'')+'> Intresselista</label>'+
          '<a class="button button-small" href="'+lank(k)+'">Se kursen &#8594;</a>'+
        '</div>'+
      '</li>';
    }).join('');
    merKnapp.hidden=f.length<=visade;
    merKnapp.textContent='Visa fler ('+Math.max(f.length-visade,0)+' till)';
    lista.querySelectorAll('[data-kurs]').forEach(function(a){
      a.addEventListener('click',function(){valjKurs(a.getAttribute('data-kurs'))})});
    lista.querySelectorAll('[data-bevaka]').forEach(function(c){
      c.addEventListener('change',function(){
        var id=+c.getAttribute('data-bevaka'),i=bevakade.indexOf(id);
        if(c.checked&&i<0)bevakade.push(id); else if(!c.checked&&i>-1)bevakade.splice(i,1);
        ritaBar();
      })});
    lista.querySelectorAll('[data-jamfor]').forEach(function(c){
      c.addEventListener('change',function(){
        var id=+c.getAttribute('data-jamfor'),i=valda.indexOf(id);
        if(c.checked&&i<0){if(valda.length>=3){c.checked=false;return}valda.push(id)}
        else if(!c.checked&&i>-1)valda.splice(i,1);
        ritaBar();
      })});
  }

  function ritaBar(){
    $('cb-antal').textContent=valda.length;
    $('cb-iantal').textContent=bevakade.length;
    $('cb-jamfor').hidden=$('cb-oppna').hidden=valda.length===0;
    $('cb-intresse').hidden=$('cb-iopna').hidden=bevakade.length===0;
    bar.hidden=valda.length===0&&bevakade.length===0;
  }
  function kursMedId(id){return kurser.filter(function(k){return k.id===id})[0]}
  function ritaIntresse(){
    $('ip-lista').innerHTML=bevakade.map(function(id){
      var k=kursMedId(id);
      return '<li><strong>Vecka '+k.vecka+'</strong><span>'+k.period+'</span><span>'+k.anlaggning+', '+k.ort+'</span>'+
             '<button type="button" class="ip-bort" data-bort="'+id+'" aria-label="Ta bort">&#10005;</button></li>';
    }).join('');
    $('ip-lista').querySelectorAll('[data-bort]').forEach(function(b){
      b.addEventListener('click',function(){
        var id=+b.getAttribute('data-bort'),i=bevakade.indexOf(id);
        if(i>-1)bevakade.splice(i,1);
        ritaBar();rita();
        if(bevakade.length){ritaIntresse()}else{ipanel.hidden=true}
      })});
    ipanel.hidden=false;
  }

  function ritaJamfor(){
    var v=valda.map(function(id){return kurser.filter(function(k){return k.id===id})[0]});
    var rader=[
      ['Vecka',function(k){return 'Vecka '+k.vecka}],
      ['Datum',function(k){return k.period}],
      ['Anläggning',function(k){return k.anlaggning}],
      ['Ort',function(k){return k.ort+' ('+k.region+')'}],
      ['Handledare',function(k){return k.handledare.length?k.handledare.join(', '):'Meddelas senare'}],
      ['Kursavgift, exkl. moms',function(k){return k.samlat?'Ingår i totalpriset':kr(k.kurspris)}],
      ['Kost och logi, exkl. moms',function(k){return k.samlat?'Ingår i totalpriset':(k.logi?kr(k.logi):'Meddelas')}],
      ['Totalpris, exkl. moms',function(k){return k.total?'<b>'+kr(k.total)+'</b>':'Meddelas'}],
      ['Status',function(k){return k.ledig?'Lediga platser':'Fullbokad'}]
    ];
    $('cp-innehall').innerHTML='<table><tbody>'+rader.map(function(r){
      return '<tr><th>'+r[0]+'</th>'+v.map(function(k){return '<td>'+r[1](k)+'</td>'}).join('')+'</tr>'
    }).join('')+'</tbody></table>';
    panel.hidden=false;
  }

  function valjKurs(v){
    var finns=false;
    for(var i=0;i<select.options.length;i++){if(select.options[i].value===v){select.selectedIndex=i;finns=true}}
    if(!finns)select.add(new Option(v,v,true,true),1);
  }
  kurser.filter(function(k){return k.ledig}).slice(0,60).forEach(function(k){
    select.insertAdjacentHTML('beforeend','<option value="'+etikett(k)+'">'+etikett(k)+'</option>')});
  select.insertAdjacentHTML('beforeend','<option value="Intresselista">Intresselista, jag väntar på nya datum</option>');

  [fTid,fRegion,fOrt,fPris,fSort].forEach(function(el){el.addEventListener('change',function(){visade=6;rita()})});
  fLedig.addEventListener('change',function(){visade=6;rita()});
  merKnapp.addEventListener('click',function(){visade+=guideKlar?12:6;rita()});
  document.querySelectorAll('[data-quick]').forEach(function(b){
    b.addEventListener('click',function(){
      var q=b.getAttribute('data-quick'),pa=b.classList.contains('is-on');
      document.querySelectorAll('[data-quick]').forEach(function(x){x.classList.remove('is-on')});
      fRegion.value='';fTid.value='';
      if(!pa){b.classList.add('is-on');
        if(q==='snart')fTid.value=fTid.options[1].value; else fRegion.value=q;}
      visade=6;rita();
    })});
  $('rensa-filter').addEventListener('click',function(){
    svar={period:null,ort:null,restid:null};guideKlar=false;
    $('guide-svar').hidden=true;$('matchrubrik').hidden=true;
    [fTid,fRegion,fOrt,fPris,fSort].forEach(function(el){el.selectedIndex=0});
    fLedig.checked=true;
    document.querySelectorAll('[data-quick]').forEach(function(x){x.classList.remove('is-on')});
    visade=6;rita();
  });
  $('cb-oppna').addEventListener('click',ritaJamfor);
  $('cp-stang').addEventListener('click',function(){panel.hidden=true});
  $('cb-iopna').addEventListener('click',ritaIntresse);
  $('ip-stang').addEventListener('click',function(){ipanel.hidden=true});
  $('cb-rensa').addEventListener('click',function(){valda=[];bevakade=[];ritaBar();rita();panel.hidden=true;ipanel.hidden=true});
  $('ip-form').addEventListener('submit',function(e){
    e.preventDefault();
    var f=$('ip-form');
    if(!f.checkValidity()){f.reportValidity();return}
    var rader=bevakade.map(function(id){var k=kursMedId(id);
      return '- Vecka '+k.vecka+', '+k.period+', '+k.anlaggning+', '+k.ort});
    var text='Intresseanmälan UGL\n\nNamn: '+$('ip-namn').value+'\nE-post: '+$('ip-epost').value+
             ($('ip-telefon').value?'\nTelefon: '+$('ip-telefon').value:'')+
             '\n\nBevakade kurser:\n'+rader.join('\n');
    if(ENDPOINT){
      $('ip-status').textContent='Skickar…';
      var d=new FormData(f);d.append('kurser',rader.join(' | '));
      fetch(ENDPOINT,{method:'POST',body:d,headers:{Accept:'application/json'}})
        .then(function(r){$('ip-status').textContent=r.ok?'Tack, vi hör av oss när det är dags.':'Något gick fel. Mejla oss på '+MOTTAGARE+'.';if(r.ok){f.reset();bevakade=[];ritaBar();rita()}})
        .catch(function(){$('ip-status').textContent='Något gick fel. Mejla oss på '+MOTTAGARE+'.'});
    }else{
      window.location.href='mailto:'+MOTTAGARE+'?subject='+encodeURIComponent('Intresselista UGL, '+bevakade.length+' kurser')+'&body='+encodeURIComponent(text);
      $('ip-status').textContent='Ditt e-postprogram öppnas med anmälan ifylld. Skicka mejlet så har vi den.';
    }
  });
  var q=new URLSearchParams(location.search).get('valj');
  if(q)valjKurs(q);
  rita();ritaBar();


  var ENDPOINT='';
  var MOTTAGARE='kontakt@uglsverige.se';

  // ---- Mini behovsanalys ----
  var PERIODTEXT={'0':'Inom 3 månader','1':'Om 4 till 6 månader','2':'Om 7 till 12 månader','x':'Alla datum'};
  var RESTEXT={'1':'Upp till 1 tim resa','2':'Upp till 2 tim resa','3':'Upp till 3 tim resa','x':'Hela landet'};
  $('ortlista').innerHTML=ORTER.map(function(o){return '<option value="'+o.namn+'">'}).join('');
  $('ort-form').addEventListener('submit',function(e){
    e.preventDefault();
    var trff=hittaOrt($('ort-input').value);
    if(!trff){$('ort-fel').hidden=false;$('ort-fel').textContent='Vi hittade inte den orten. Prova närmaste större ort, till exempel Växjö, Örebro eller Umeå.';return}
    $('ort-fel').hidden=true;
    svar.ort=trff;$('ort-input').value=trff.namn;
    visaSteg(3);
  });

  function visaSteg(n){
    steg=n;
    document.querySelectorAll('.guide-fraga').forEach(function(el){el.hidden=+el.getAttribute('data-steg')!==n});
    document.querySelectorAll('#guide-steg li').forEach(function(li,i){li.classList.toggle('is-pa',i===0)});
    $('guide-bak').hidden=n===1;
  }
  function avslutaGuide(){
    guideKlar=true;
    $('guide-kort').hidden=true;
    $('guide-svar').hidden=false;
    document.querySelectorAll('#guide-steg li').forEach(function(li,i){li.classList.toggle('is-pa',i===1)});
    $('gs-chips').innerHTML=[
      svar.period?PERIODTEXT[svar.period]:null,
      svar.ort?'Från '+svar.ort.namn:'Hela landet',
      svar.restid?RESTEXT[svar.restid]:null
    ].filter(Boolean).map(function(t){return '<span class="gs-chip">'+t+'</span>'}).join('');
    var f=filtrerade();
    var r=$('matchrubrik');
    r.hidden=false;
    r.textContent=f.length===0?'Inga veckor matchar riktigt dina svar'
      :(f.length<=3?(f.length===1?'En vecka som passar dig':f.length+' kurser som passar dig'):'Tre kurser som passar dig');
    visade=Math.min(3,Math.max(f.length,1));
    if(f.length===0){visade=3;svar.restid=null;svar.period=null;r.textContent='Inga veckor matchade exakt, här är de närmaste alternativen'}
    rita();
    document.getElementById('datum').scrollIntoView({behavior:'smooth',block:'start'});
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-svar]');
    if(!b)return;
    var p=b.getAttribute('data-svar').split(':');
    if(p[0]==='ort'&&p[1]==='x'){svar.ort=null;visaSteg(3);return}
    svar[p[0]]=p[1];
    if(steg<3)visaSteg(steg+1); else avslutaGuide();
  });
  $('guide-bak').addEventListener('click',function(){if(steg>1)visaSteg(steg-1)});
  $('guide-hoppa').addEventListener('click',function(){
    guideKlar=false;svar={period:null,ort:null,restid:null};
    $('guide-kort').hidden=true;$('guide-svar').hidden=true;
    $('matchrubrik').hidden=true;visade=6;rita();
    document.getElementById('datum').scrollIntoView({behavior:'smooth',block:'start'});
  });
  $('guide-andra').addEventListener('click',function(){
    guideKlar=false;svar={period:null,ort:null,restid:null};
    $('guide-svar').hidden=true;$('guide-kort').hidden=false;$('matchrubrik').hidden=true;
    visaSteg(1);visade=6;rita();
    document.getElementById('behov').scrollIntoView({behavior:'smooth',block:'start'});
  });


  var form=document.querySelector('.booking-form'),status=document.querySelector('.form-status');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return}
    var d=new FormData(form),rader=[];
    d.forEach(function(v,k){if(k!=='samtycke')rader.push(k.charAt(0).toUpperCase()+k.slice(1)+': '+v)});
    if(ENDPOINT){
      status.textContent='Skickar…';
      fetch(ENDPOINT,{method:'POST',body:d,headers:{Accept:'application/json'}})
        .then(function(r){status.textContent=r.ok?'Tack, din anmälan är skickad. Vi hör av oss inom två arbetsdagar.':'Något gick fel. Mejla oss på '+MOTTAGARE+'.';if(r.ok)form.reset()})
        .catch(function(){status.textContent='Något gick fel. Mejla oss på '+MOTTAGARE+'.'});
    }else{
      window.location.href='mailto:'+MOTTAGARE+'?subject='+encodeURIComponent('Anmälan UGL: '+(d.get('kurs')||''))+'&body='+encodeURIComponent(rader.join('\n'));
      status.textContent='Ditt e-postprogram öppnas med anmälan ifylld. Skicka mejlet så har vi den.';
    }
  });
})();
