(function(){
  var BYGGE='4';
  var MANADER=['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'];
  function kr(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' kr'}
  function fmt(d){return d.getDate()+' '+MANADER[d.getMonth()]}
  function slug(s){return s.toLowerCase().replace(/[åä]/g,'a').replace(/ö/g,'o').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function init(n){return n.split(' ').map(function(w){return w[0]}).slice(0,2).join('').toUpperCase()}
  var SVG=function(d){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'};

  /* ---------- Kursutbudet, samma data som kurssidan ---------- */
  var kurser=window.UGL_RADER.split('\n').map(function(rad){
    var d=rad.split('|'),start=new Date(d[0]+'T00:00:00'),logi=+d[5],kp=d[7]?+d[7]:window.UGL_KURSPRIS,samlat=!logi&&!!d[7];
    return {nyckel:d[0]+'-'+slug(d[2]),datum:d[0],start:start,slut:new Date(start.getTime()+4*864e5),
      vecka:+d[1],anlaggning:d[2],ort:d[3],handledare:d[4]?d[4].split(';'):[],
      kurspris:kp,logi:logi,samlat:samlat,total:logi?kp+logi:(samlat?kp:0),ledig:d[6]==='L',
      period:fmt(start)+' till '+fmt(new Date(start.getTime()+4*864e5))+' '+start.getFullYear()};
  }).sort(function(a,b){return a.start-b.start});
  function kurs(n){return kurser.filter(function(k){return k.nyckel===n})[0]}

  /* ---------- Demokund ---------- */
  var STATUS={utkast:['Utkast','st-utkast'],forfragan:['Förfrågan skickad','st-forfragan'],
              bekraftad:['Bekräftad','st-bekraftad'],genomford:['Genomförd','st-genomford']};
  var DEMO={
    org:{namn:'Nordvik Industri AB',kort:'NI',farg:'#1f4e6b',orgnr:'556xxx-xxxx',adress:'Hamngatan 12, 852 30 Sundsvall',referens:'HR-2026'},
    anv:{namn:'Karin Ek',roll:'HR-chef',epost:'karin.ek@nordvikindustri.se'},
    medarbetare:[
      {id:1,namn:'Johan Lind',roll:'Produktionschef',avd:'Produktion'},
      {id:2,namn:'Sara Öberg',roll:'Teamledare',avd:'Produktion'},
      {id:3,namn:'Mikael Ferm',roll:'Gruppchef',avd:'Logistik'},
      {id:4,namn:'Elin Sandell',roll:'Projektledare',avd:'Teknik'},
      {id:5,namn:'Peter Ahlgren',roll:'Underhållschef',avd:'Teknik'},
      {id:6,namn:'Nadia Rahimi',roll:'Kvalitetsansvarig',avd:'Kvalitet'},
      {id:7,namn:'Tobias Ek',roll:'Skiftledare',avd:'Produktion'},
      {id:8,namn:'Lena Forsberg',roll:'Ekonomichef',avd:'Stab'}
    ],
    plan:[],arenden:[],moten:[]
  };
  /* tre forbokade rader for att visa lagen */
  (function(){
    var lediga=kurser.filter(function(k){return k.ledig&&k.total});
    DEMO.plan=[
      {id:1,mid:1,nyckel:lediga[2].nyckel,status:'bekraftad'},
      {id:2,mid:4,nyckel:lediga[9].nyckel,status:'forfragan'},
      {id:3,mid:6,nyckel:lediga[18].nyckel,status:'utkast'}
    ];
  })();

  var S=null,nastaId=100;
  function komplettera(s){
    if(!s||typeof s!=='object')return null;
    s.org=s.org||JSON.parse(JSON.stringify(DEMO.org));
    s.anv=s.anv||JSON.parse(JSON.stringify(DEMO.anv));
    s.medarbetare=Array.isArray(s.medarbetare)&&s.medarbetare.length?s.medarbetare:JSON.parse(JSON.stringify(DEMO.medarbetare));
    s.plan=Array.isArray(s.plan)?s.plan:[];
    s.arenden=Array.isArray(s.arenden)?s.arenden:[];
    s.moten=Array.isArray(s.moten)?s.moten:[];
    /* slang planrader som pekar pa kurser som inte langre finns */
    s.plan=s.plan.filter(function(p){return p&&kurs(p.nyckel)&&s.medarbetare.some(function(m){return m.id===p.mid})});
    return s;
  }
  function las(){
    try{var r=localStorage.getItem('ugl-portal-demo');if(r)return komplettera(JSON.parse(r))}catch(e){}
    return null;
  }
  function spara(){try{localStorage.setItem('ugl-portal-demo',JSON.stringify(S))}catch(e){}}
  function nollstall(){S=JSON.parse(JSON.stringify(DEMO));spara()}

  var $=function(id){return document.getElementById(id)};
  function medarb(id){return S.medarbetare.filter(function(m){return m.id===id})[0]}

  /* ---------- Kvalitetskontroll: frammlingsgrupp ---------- */
  function krockar(){
    var per={};
    S.plan.forEach(function(p){(per[p.nyckel]=per[p.nyckel]||[]).push(p)});
    return Object.keys(per).filter(function(n){return per[n].length>1})
      .map(function(n){return {kurs:kurs(n),rader:per[n]}});
  }
  function notiser(){
    var n=[];
    krockar().forEach(function(kk){
      n.push({typ:'varning',rubrik:'Två kollegor på samma vecka',
        text:kk.rader.map(function(p){return medarb(p.mid).namn}).join(' och ')+' är planerade på vecka '+kk.kurs.vecka+' i '+kk.kurs.ort+'. UGL genomförs i främlingsgrupp, så de behöver olika veckor.'});
    });
    S.plan.filter(function(p){return p.status==='utkast'}).forEach(function(p){
      var k=kurs(p.nyckel);
      n.push({typ:'info',rubrik:'Utkast väntar på att skickas',
        text:medarb(p.mid).namn+', vecka '+k.vecka+' i '+k.ort+'. Skicka förfrågan för att säkra platsen.'});
    });
    S.plan.filter(function(p){return p.status==='bekraftad'}).forEach(function(p){
      var k=kurs(p.nyckel);
      n.push({typ:'info',rubrik:'Uppföljning att planera',
        text:'Boka in ett utvecklingssamtal med '+medarb(p.mid).namn+' fyra till sex veckor efter kursen i '+k.ort+'. Det är då veckan landar i vardagen.'});
    });
    return n;
  }

  /* ---------- Vyer ---------- */
  function kpi(varde,etikett,extra){
    return '<div class="kpi"><b>'+varde+'</b><span>'+etikett+'</span>'+(extra?'<small>'+extra+'</small>':'')+'</div>';
  }
  function statusChip(s){return '<span class="chip-status '+STATUS[s][1]+'">'+STATUS[s][0]+'</span>'}

  function vyOversikt(){
    var planerade=S.plan.length,
        bekr=S.plan.filter(function(p){return p.status==='bekraftad'}).length,
        summa=S.plan.reduce(function(a,p){return a+(kurs(p.nyckel).total||0)},0),
        klara=S.medarbetare.length-new Set(S.plan.map(function(p){return p.mid})).size,
        k=krockar(),
        nasta=S.plan.slice().sort(function(a,b){return kurs(a.nyckel).start-kurs(b.nyckel).start})[0];
    var h='<div class="vy-head"><div><h1>Hej '+S.anv.namn.split(' ')[0]+'.</h1><p class="lead">Så här ligger er UGL-planering till.</p></div>'+
      '<a class="button" href="#planering">Planera en medarbetare &#8594;</a></div>';
    h+='<div class="kpi-rad">'+
      kpi(planerade,'planerade platser')+
      kpi(bekr,'bekräftade')+
      kpi(kr(summa),'total kostnad','exkl. moms')+
      kpi(klara,'utan plan','av '+S.medarbetare.length+' medarbetare')+
      '</div>';
    if(k.length){
      h+='<div class="varning"><span class="v-ikon">'+SVG('<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>')+'</span>'+
        '<div><strong>Två kollegor på samma vecka</strong>'+
        k.map(function(kk){return '<p>'+kk.rader.map(function(p){return medarb(p.mid).namn}).join(' och ')+' är båda planerade på vecka '+kk.kurs.vecka+' i '+kk.kurs.ort+'.</p>'}).join('')+
        '<p class="v-varfor">UGL genomförs alltid i främlingsgrupp. Att ingen känner varandra sedan tidigare är förutsättningen för öppenheten, och därför ska kollegor gå olika veckor.</p>'+
        '<a class="text-link" href="#planering">Flytta en av dem</a></div></div>';
    }
    if(nasta){
      var nk=kurs(nasta.nyckel);
      h+='<div class="panel"><h2>Nästa kurs</h2><div class="nasta">'+
        '<span class="n-init">'+init(medarb(nasta.mid).namn)+'</span>'+
        '<div><strong>'+medarb(nasta.mid).namn+'</strong><span>'+medarb(nasta.mid).roll+', '+medarb(nasta.mid).avd+'</span></div>'+
        '<div><strong>Vecka '+nk.vecka+'</strong><span>'+nk.period+'</span></div>'+
        '<div><strong>'+nk.anlaggning+'</strong><span>'+nk.ort+'</span></div>'+
        '<div>'+statusChip(nasta.status)+'</div></div></div>';
    }
    h+='<div class="panel"><div class="panel-head"><h2>Er plan</h2><a class="text-link" href="#kalender">Se kalendern</a></div>'+tabellPlan()+'</div>';
    return h;
  }

  function tabellPlan(){
    if(!S.plan.length)return '<p class="tom">Ingen är inplanerad än. Börja med att planera en medarbetare.</p>';
    var rader=S.plan.slice().sort(function(a,b){return kurs(a.nyckel).start-kurs(b.nyckel).start});
    return '<table class="tab"><thead><tr><th>Medarbetare</th><th>Vecka</th><th>Datum</th><th>Plats</th><th>Kostnad</th><th>Status</th><th></th></tr></thead><tbody>'+
      rader.map(function(p){
        var k=kurs(p.nyckel),m=medarb(p.mid);
        return '<tr><td><b>'+m.namn+'</b><small>'+m.avd+'</small></td>'+
          '<td>'+k.vecka+'</td><td>'+k.period+'</td>'+
          '<td>'+k.anlaggning+'<small>'+k.ort+'</small></td>'+
          '<td>'+(k.total?kr(k.total):'Meddelas')+'</td>'+
          '<td>'+statusChip(p.status)+'</td>'+
          '<td class="tab-atg">'+
            (p.status==='utkast'?'<button class="mini" data-skicka="'+p.id+'">Skicka förfrågan</button>':'')+
            '<button class="mini" data-fraga="'+p.id+'">Fråga</button>'+
            '<button class="mini mini-bort" data-ta="'+p.id+'">Ta bort</button></td></tr>';
      }).join('')+'</tbody></table>';
  }

  function vyMedarbetare(){
    var avd={};
    S.medarbetare.forEach(function(m){(avd[m.avd]=avd[m.avd]||[]).push(m)});
    var h='<div class="vy-head"><div><h1>Medarbetare</h1><p class="lead">'+S.medarbetare.length+' personer i registret. Lägg till fler eller planera in en kurs.</p></div>'+
      '<button class="button button-outline-dark" id="ny-medarb">Lägg till medarbetare</button></div>';
    Object.keys(avd).sort().forEach(function(a){
      h+='<div class="panel"><h2>'+a+'</h2><table class="tab"><thead><tr><th>Namn</th><th>Roll</th><th>UGL-status</th><th></th></tr></thead><tbody>'+
        avd[a].map(function(m){
          var p=S.plan.filter(function(x){return x.mid===m.id})[0];
          return '<tr><td><span class="n-init liten">'+init(m.namn)+'</span><b>'+m.namn+'</b></td>'+
            '<td>'+m.roll+'</td>'+
            '<td>'+(p?statusChip(p.status)+' <small>vecka '+kurs(p.nyckel).vecka+'</small>':'<span class="chip-status st-ingen">Ingen plan</span>')+'</td>'+
            '<td class="tab-atg">'+(p?'':'<button class="mini" data-planera="'+m.id+'">Planera UGL</button>')+'</td></tr>';
        }).join('')+'</tbody></table></div>';
    });
    return h;
  }

  function vyPlanering(){
    var utan=S.medarbetare.filter(function(m){return !S.plan.some(function(p){return p.mid===m.id})});
    var h='<div class="vy-head"><div><h1>Planera kurs</h1><p class="lead">Välj medarbetare, välj vecka. Portalen varnar om två kollegor hamnar på samma kurs.</p></div></div>';
    h+='<div class="plan-layout"><div class="panel"><h2>1. Vem ska gå?</h2><div class="valj-lista" id="valj-medarb">'+
      S.medarbetare.map(function(m){
        var p=S.plan.filter(function(x){return x.mid===m.id})[0];
        return '<label class="valj-rad'+(p?' ar-upptagen':'')+'"><input type="radio" name="medarb" value="'+m.id+'"'+(p?' disabled':'')+'>'+
          '<span class="n-init liten">'+init(m.namn)+'</span>'+
          '<span class="vr-text"><b>'+m.namn+'</b><small>'+m.roll+', '+m.avd+'</small></span>'+
          (p?'<span class="vr-status">'+statusChip(p.status)+'</span>':'')+'</label>';
      }).join('')+'</div>'+
      (utan.length?'':'<p class="tom">Alla medarbetare har en plan. Ta bort en rad i översikten för att planera om.</p>')+'</div>';

    h+='<div class="panel"><div class="panel-head"><h2>2. Vilken vecka?</h2><span class="pf" id="plan-filter-etikett"></span></div>'+
      '<div class="plan-filter"><label>Från månad<select id="plan-manad"><option value="">Alla</option></select></label>'+
      '<label>Ort<select id="plan-ort"><option value="">Alla</option></select></label></div>'+
      '<div class="kurs-val" id="kurs-val"></div></div></div>';
    return h;
  }

  function ritaKursval(){
    var lista=$('kurs-val');if(!lista)return;
    var m=$('plan-manad').value,o=$('plan-ort').value;
    var upptagna=S.plan.map(function(p){return p.nyckel});
    var f=kurser.filter(function(k){
      if(!k.ledig)return false;
      if(m&&(k.start.getFullYear()+'-'+String(k.start.getMonth()+1).padStart(2,'0'))!==m)return false;
      if(o&&k.ort!==o)return false;
      return true;
    }).slice(0,24);
    lista.innerHTML=f.map(function(k){
      var krock=upptagna.indexOf(k.nyckel)>-1;
      return '<div class="kv-rad'+(krock?' kv-krock':'')+'">'+
        '<div><b>Vecka '+k.vecka+'</b><small>'+k.period+'</small></div>'+
        '<div><b>'+k.anlaggning+'</b><small>'+k.ort+'</small></div>'+
        '<div><b>'+(k.total?kr(k.total):'Pris meddelas')+'</b><small>exkl. moms</small></div>'+
        '<div>'+(krock?'<span class="kv-varn">Kollega redan bokad</span>':'')+
        '<button class="mini mini-primar" data-lagg="'+k.nyckel+'">Lägg till i plan</button></div></div>';
    }).join('')||'<p class="tom">Inga veckor matchar filtret.</p>';
    lista.querySelectorAll('[data-lagg]').forEach(function(b){
      b.addEventListener('click',function(){
        var vald=document.querySelector('input[name=medarb]:checked');
        if(!vald){toast('Välj först vilken medarbetare det gäller.');return}
        S.plan.push({id:nastaId++,mid:+vald.value,nyckel:b.getAttribute('data-lagg'),status:'utkast'});
        spara();toast('Tillagd i planen som utkast.');rita('oversikt');
      })});
  }

  function vyKalender(){
    var ar={};
    S.plan.forEach(function(p){var k=kurs(p.nyckel);var n=k.start.getFullYear()+'-'+String(k.start.getMonth()+1).padStart(2,'0');(ar[n]=ar[n]||[]).push(p)});
    var nycklar=Object.keys(ar).sort();
    var h='<div class="vy-head"><div><h1>Kalender</h1><p class="lead">Er UGL-plan månad för månad.</p></div></div>';
    if(!nycklar.length)return h+'<div class="panel"><p class="tom">Inget planerat än.</p></div>';
    h+='<div class="kal">';
    nycklar.forEach(function(n){
      var d=new Date(n+'-01T00:00:00');
      h+='<div class="kal-manad"><h3>'+MANADER[d.getMonth()]+' '+d.getFullYear()+'</h3>'+
        ar[n].sort(function(a,b){return kurs(a.nyckel).start-kurs(b.nyckel).start}).map(function(p){
          var k=kurs(p.nyckel),m=medarb(p.mid);
          return '<div class="kal-post '+STATUS[p.status][1]+'"><b>v '+k.vecka+'</b><span>'+m.namn+'</span><small>'+k.ort+'</small></div>';
        }).join('')+'</div>';
    });
    return h+'</div>';
  }

  function vyEkonomi(){
    var perAvd={},summa=0,bekr=0;
    S.plan.forEach(function(p){
      var k=kurs(p.nyckel),m=medarb(p.mid),t=k.total||0;
      perAvd[m.avd]=(perAvd[m.avd]||0)+t;summa+=t;
      if(p.status==='bekraftad')bekr+=t;
    });
    var h='<div class="vy-head"><div><h1>Kostnader</h1><p class="lead">Alla belopp exklusive moms. Kursavgift plus kost och logi.</p></div>'+
      '<button class="button button-outline-dark" id="exportera">Exportera som CSV</button></div>';
    h+='<div class="kpi-rad">'+kpi(kr(summa),'planerat totalt')+kpi(kr(bekr),'varav bekräftat')+
      kpi(kr(S.plan.length?summa/S.plan.length:0),'snitt per deltagare')+'</div>';
    h+='<div class="panel"><h2>Per avdelning</h2><table class="tab"><thead><tr><th>Avdelning</th><th>Deltagare</th><th>Kostnad</th><th>Andel</th></tr></thead><tbody>'+
      Object.keys(perAvd).sort().map(function(a){
        var antal=S.plan.filter(function(p){return medarb(p.mid).avd===a}).length;
        var andel=summa?Math.round(perAvd[a]/summa*100):0;
        return '<tr><td><b>'+a+'</b></td><td>'+antal+'</td><td>'+kr(perAvd[a])+'</td>'+
          '<td><span class="stapel"><i style="width:'+andel+'%"></i></span>'+andel+' %</td></tr>';
      }).join('')+'</tbody></table></div>';
    h+='<div class="panel"><h2>Specifikation</h2>'+tabellPlan()+'</div>';
    return h;
  }

  function vyInstallningar(){
    return '<div class="vy-head"><div><h1>Inställningar</h1><p class="lead">Uppgifter som följer med på fakturor och bekräftelser.</p></div></div>'+
    '<div class="plan-layout"><div class="panel"><h2>Organisation</h2>'+
      '<div class="form-grid">'+
      falt('Företagsnamn',S.org.namn)+falt('Organisationsnummer',S.org.orgnr)+
      falt('Fakturaadress',S.org.adress)+falt('Fakturareferens',S.org.referens)+
      '</div><p class="tom">I skarp version laddar ni upp er logotyp här, och den visas i portalen och på bekräftelser.</p></div>'+
    '<div class="panel"><h2>Användare</h2>'+
      '<div class="anv-rad"><span class="n-init liten">'+init(S.anv.namn)+'</span><div><b>'+S.anv.namn+'</b><small>'+S.anv.epost+'</small></div><span class="chip-status st-bekraftad">Administratör</span></div>'+
      '<div class="anv-rad"><span class="n-init liten">MB</span><div><b>Martin Berg</b><small>martin.berg@nordvikindustri.se</small></div><span class="chip-status st-utkast">Inbjuden</span></div>'+
      '<button class="button button-outline-dark" style="margin-top:1.2rem">Bjud in kollega</button>'+
      '<p class="tom">Flera personer kan dela på planeringen, till exempel HR och respektive chef.</p></div></div>'+
    '<div class="panel"><h2>Demo</h2><p class="tom">Prototypen sparar bara i din egen webbläsare.</p><button class="button button-outline-dark" id="nollstall">Återställ demodata</button></div>';
  }
  function falt(e,v){return '<label class="ro"><span>'+e+'</span><input value="'+v+'" readonly></label>'}


  /* ---------- Hjälp och kontakt ---------- */
  var MOTESTYPER=[
    ['avstamning','Kort avstämning','15 minuter','Snabba frågor om en bokning, ett datum eller en faktura.'],
    ['radgivning','Rådgivning om upplägg','30 minuter','Vilka i er organisation som bör gå, i vilken ordning och när.'],
    ['ledning','Genomgång för ledningsgrupp','45 minuter','Vi går igenom vad UGL ger och hur ni följer upp det internt.'],
    ['webinar','Webinar om UGL','40 minuter','Öppet pass där era medarbetare får ställa frågor innan de bokar.']
  ];
  var AMNEN=['Bokning och platser','Fakturering och betalning','Vilken vecka passar en viss person','Egen kurs för vår grupp','Avbokning eller ombokning','Något annat'];
  var FRAGOR=[
    ['Hur snabbt får vi svar?','Vi svarar på frågor i portalen inom fyra arbetstimmar. Bokade möten bekräftas direkt.'],
    ['Kan två kollegor gå samma vecka?','Nej. UGL genomförs i främlingsgrupp, ingen i gruppen ska känna varandra sedan tidigare. Portalen varnar automatiskt om två av era hamnar på samma vecka.'],
    ['Vad händer efter att vi skickat en förfrågan?','Vi kontrollerar att platsen finns kvar och att gruppsammansättningen fungerar, och återkommer med bekräftelse och faktura. Först då är platsen bindande.'],
    ['Hur långt i förväg bör vi boka?','De flesta bokar tre till sex månader i förväg. Populära veckor och orter fylls tidigare, särskilt runt Stockholm och Göteborg.'],
    ['Kan vi köra en egen kurs för vår grupp?','En UGL-vecka kan inte köras för en befintlig arbetsgrupp, eftersom främlingsgruppen är en förutsättning. Däremot finns andra upplägg för hela grupper. Boka rådgivning så går vi igenom vad som passar er.'],
    ['Vad ingår i priset?','Kursavgift samt kost och logi på kursgården. Beloppen står specificerade på varje rad i er plan. Resa tillkommer.']
  ];
  function tider(){
    var out=[],d=new Date();d.setHours(0,0,0,0);
    while(out.length<8){
      d=new Date(d.getTime()+864e5);
      if(d.getDay()===0||d.getDay()===6)continue;
      out.push(d);
    }
    return out;
  }
  function vySupport(){
    var h='<div class="vy-head"><div><h1>Hjälp och kontakt</h1><p class="lead">Boka ett möte eller ställ en fråga. Vi svarar inom fyra arbetstimmar.</p></div></div>';
    h+='<div class="kontakt-kort"><span class="n-init stor">CZ</span>'+
       '<div><strong>Carl-Fredrik Zettermark</strong><span>Er kontaktperson, certifierad UGL-handledare</span>'+
       '<div class="kk-lankar"><a href="mailto:kontakt@uglsverige.se">kontakt@uglsverige.se</a><span>Vardagar 08 till 17</span></div></div>'+
       '<a class="button" href="#" id="oppna-mote">Boka ett möte &#8594;</a></div>';

    h+='<div class="plan-layout">';
    h+='<div class="panel" id="motespanel"><h2>Boka ett möte</h2>'+
      '<div class="mote-typer">'+MOTESTYPER.map(function(t){
        return '<label class="mote-typ"><input type="radio" name="motestyp" value="'+t[0]+'"'+(t[0]==='avstamning'?' checked':'')+'>'+
        '<span><b>'+t[1]+'</b><i>'+t[2]+'</i><small>'+t[3]+'</small></span></label>'}).join('')+'</div>'+
      '<p class="ip-rubrik" style="margin-top:1.4rem">Välj tid</p>'+
      '<div class="tid-rutnat">'+tider().map(function(d){
        return '<div class="tid-dag"><b>'+['sön','mån','tis','ons','tor','fre','lör'][d.getDay()]+' '+d.getDate()+'/'+(d.getMonth()+1)+'</b>'+
        ['09:00','11:00','14:00','15:30'].map(function(t){
          return '<button type="button" class="tid" data-tid="'+d.getDate()+'/'+(d.getMonth()+1)+' kl '+t+'">'+t+'</button>'}).join('')+'</div>'}).join('')+'</div>'+
      '<div class="field field-wide" style="margin-top:1.2rem"><label for="mote-not">Vad vill du prata om? <span>Valfritt</span></label><textarea id="mote-not" rows="2"></textarea></div>'+
      '<p class="tom" id="mote-vald">Ingen tid vald än.</p>'+
      '<button class="button" id="boka-mote">Boka mötet</button></div>';

    h+='<div><div class="panel"><h2>Ställ en fråga</h2>'+
      '<div class="form-grid"><label class="ro"><span>Ämne</span><select id="fraga-amne">'+
      AMNEN.map(function(a){return '<option>'+a+'</option>'}).join('')+'</select></label>'+
      '<label class="ro"><span>Gäller medarbetare</span><select id="fraga-mid"><option value="">Ingen särskild</option>'+
      S.medarbetare.map(function(m){return '<option value="'+m.id+'">'+m.namn+'</option>'}).join('')+'</select></label></div>'+
      '<div class="field field-wide" style="margin-top:1rem"><label for="fraga-text">Din fråga</label><textarea id="fraga-text" rows="4" placeholder="Skriv så konkret du kan, så slipper vi mejla fram och tillbaka."></textarea></div>'+
      '<button class="button" id="skicka-fraga">Skicka frågan</button>'+
      '<p class="tom">Svar kommer till '+S.anv.epost+' och syns här i portalen.</p></div>';

    h+='<div class="panel"><h2>Vanliga frågor</h2><div class="fragor">'+
      FRAGOR.map(function(f){return '<details><summary>'+f[0]+'</summary><p>'+f[1]+'</p></details>'}).join('')+'</div></div></div></div>';

    h+='<div class="panel"><h2>Dina ärenden</h2>'+
      ((S.arenden.length||S.moten.length)?'<table class="tab"><thead><tr><th>Typ</th><th>Ärende</th><th>Skapat</th><th>Status</th></tr></thead><tbody>'+
        S.moten.map(function(m){return '<tr><td><b>Möte</b></td><td>'+m.typ+'<small>'+m.tid+'</small></td><td>'+m.skapat+'</td><td><span class="chip-status st-bekraftad">Bekräftat</span></td></tr>'}).join('')+
        S.arenden.map(function(a){return '<tr><td><b>Fråga</b></td><td>'+a.amne+'<small>'+a.text.slice(0,70)+(a.text.length>70?'…':'')+'</small></td><td>'+a.skapat+'</td><td><span class="chip-status st-forfragan">Skickad</span></td></tr>'}).join('')+
        '</tbody></table>':'<p class="tom">Inga ärenden än. Boka ett möte eller ställ en fråga så dyker de upp här.</p>')+'</div>';
    return h;
  }

  /* ---------- Ram ---------- */
  var VYER={oversikt:vyOversikt,medarbetare:vyMedarbetare,planering:vyPlanering,kalender:vyKalender,ekonomi:vyEkonomi,support:vySupport,installningar:vyInstallningar};
  function rita(vy){
    vy=vy||(location.hash||'#oversikt').slice(1);
    if(!VYER[vy])vy='oversikt';
    location.hash=vy;
    document.querySelectorAll('.app-meny a[data-vy]').forEach(function(a){a.classList.toggle('ar-pa',a.getAttribute('data-vy')===vy)});
    try{$('vy').innerHTML=VYER[vy]()}
    catch(fel){
      $('vy').innerHTML='<div class="panel"><h2>Något gick fel i den här vyn</h2>'+
        '<p class="tom">Prototypen kunde inte visa vyn med den data som ligger sparad i din webbläsare. Återställ demodata så fungerar den igen.</p>'+
        '<button class="button" id="nollstall">Återställ demodata</button></div>';
    }
    $('vy').scrollTop=0;
    var n=notiser();
    $('notis-prick').hidden=!n.length;
    $('notis-lista').innerHTML=n.length?n.map(function(x){
      return '<li class="'+(x.typ==='varning'?'n-varning':'')+'"><b>'+x.rubrik+'</b><span>'+x.text+'</span></li>'}).join('')
      :'<li><b>Inget nytt</b><span>Vi hör av oss här när något behöver din uppmärksamhet.</span></li>';
    koppla();
  }
  function koppla(){
    document.querySelectorAll('[data-skicka]').forEach(function(b){b.addEventListener('click',function(){
      var p=S.plan.filter(function(x){return x.id==b.getAttribute('data-skicka')})[0];
      p.status='forfragan';spara();toast('Förfrågan skickad till UGL Sverige.');rita();
    })});
    document.querySelectorAll('[data-ta]').forEach(function(b){b.addEventListener('click',function(){
      S.plan=S.plan.filter(function(x){return x.id!=b.getAttribute('data-ta')});spara();toast('Raden är borttagen.');rita();
    })});
    document.querySelectorAll('[data-planera]').forEach(function(b){b.addEventListener('click',function(){
      rita('planering');
      var r=document.querySelector('input[name=medarb][value="'+b.getAttribute('data-planera')+'"]');
      if(r){r.checked=true;r.closest('.valj-rad').scrollIntoView({block:'center'})}
    })});
    if($('plan-manad')){
      [...new Set(kurser.filter(function(k){return k.ledig}).map(function(k){return k.start.getFullYear()+'-'+String(k.start.getMonth()+1).padStart(2,'0')}))]
        .forEach(function(m){var d=new Date(m+'-01T00:00:00');
          $('plan-manad').insertAdjacentHTML('beforeend','<option value="'+m+'">'+MANADER[d.getMonth()]+' '+d.getFullYear()+'</option>')});
      [...new Set(kurser.map(function(k){return k.ort}))].sort(function(a,b){return a.localeCompare(b,'sv')})
        .forEach(function(o){$('plan-ort').insertAdjacentHTML('beforeend','<option value="'+o+'">'+o+'</option>')});
      $('plan-manad').addEventListener('change',ritaKursval);
      $('plan-ort').addEventListener('change',ritaKursval);
      ritaKursval();
    }
    if($('ny-medarb'))$('ny-medarb').addEventListener('click',function(){
      var n=prompt('Namn på medarbetaren');if(!n)return;
      var r=prompt('Roll')||'Medarbetare',a=prompt('Avdelning')||'Övrigt';
      S.medarbetare.push({id:nastaId++,namn:n,roll:r,avd:a});spara();toast('Medarbetaren är tillagd.');rita();
    });
    if($('exportera'))$('exportera').addEventListener('click',function(){
      var rader=[['Medarbetare','Avdelning','Vecka','Datum','Anlaggning','Ort','Kursavgift','Kost och logi','Totalt exkl moms','Status']];
      S.plan.forEach(function(p){var k=kurs(p.nyckel),m=medarb(p.mid);
        rader.push([m.namn,m.avd,k.vecka,k.period,k.anlaggning,k.ort,k.samlat?'':k.kurspris,k.samlat?'':k.logi,k.total,STATUS[p.status][0]])});
      var csv=rader.map(function(r){return r.map(function(c){return '"'+String(c).replace(/"/g,'""')+'"'}).join(';')}).join('\n');
      var a=document.createElement('a');
      a.href='data:text/csv;charset=utf-8,'+encodeURIComponent('﻿'+csv);
      a.download='ugl-plan-nordvik.csv';a.click();
      toast('CSV-filen är hämtad.');
    });
    if($('nollstall'))$('nollstall').addEventListener('click',function(){nollstall();toast('Demodata återställd.');rita('oversikt')});
    var valdTid=null;
    document.querySelectorAll('.tid').forEach(function(b){b.addEventListener('click',function(){
      document.querySelectorAll('.tid').forEach(function(x){x.classList.remove('ar-vald')});
      b.classList.add('ar-vald');valdTid=b.getAttribute('data-tid');
      $('mote-vald').textContent='Vald tid: '+valdTid;
    })});
    if($('boka-mote'))$('boka-mote').addEventListener('click',function(){
      if(!valdTid){toast('Välj en tid först.');return}
      var t=document.querySelector('input[name=motestyp]:checked').value;
      var namn=MOTESTYPER.filter(function(x){return x[0]===t})[0][1];
      S.moten.push({typ:namn,tid:valdTid,not:$('mote-not').value,skapat:idag()});
      spara();toast('Mötet är bokat. Kallelse kommer till din mejl.');rita('support');
    });
    if($('skicka-fraga'))$('skicka-fraga').addEventListener('click',function(){
      var txt=$('fraga-text').value.trim();
      if(!txt){toast('Skriv din fråga först.');return}
      var mid=$('fraga-mid').value;
      S.arenden.push({amne:$('fraga-amne').value+(mid?', '+medarb(+mid).namn:''),text:txt,skapat:idag()});
      spara();toast('Frågan är skickad. Vi svarar inom fyra arbetstimmar.');rita('support');
    });
    if($('oppna-mote'))$('oppna-mote').addEventListener('click',function(e){
      e.preventDefault();$('motespanel').scrollIntoView({behavior:'smooth',block:'start'})});
    document.querySelectorAll('[data-fraga]').forEach(function(b){b.addEventListener('click',function(){
      var p=S.plan.filter(function(x){return x.id==b.getAttribute('data-fraga')})[0];
      var k=kurs(p.nyckel),m=medarb(p.mid);
      rita('support');
      $('fraga-amne').value='Bokning och platser';
      $('fraga-mid').value=m.id;
      $('fraga-text').value='Gäller '+m.namn+', vecka '+k.vecka+' i '+k.ort+' ('+k.period+'). ';
      $('fraga-text').focus();
      $('fraga-text').scrollIntoView({behavior:'smooth',block:'center'});
    })});
  }
  function idag(){var d=new Date();return d.getDate()+' '+MANADER[d.getMonth()]}
  function toast(t){
    var e=document.createElement('div');e.className='toast';e.textContent=t;
    document.body.appendChild(e);setTimeout(function(){e.classList.add('ut')},2200);
    setTimeout(function(){e.remove()},2800);
  }

  /* ---------- Inloggning ---------- */
  $('login-form').addEventListener('submit',function(e){
    e.preventDefault();
    S=las()||JSON.parse(JSON.stringify(DEMO));
    if(!las())spara();
    var ep=$('log-epost').value.trim();
    if(ep&&ep.indexOf('@')>0){
      var dom=ep.split('@')[1].split('.')[0];
      S.anv.epost=ep;
      S.org.namn=dom.charAt(0).toUpperCase()+dom.slice(1);
      S.org.kort=dom.slice(0,2).toUpperCase();
      spara();
    }
    S.medarbetare.concat(S.plan).forEach(function(x){if(x&&x.id>=nastaId)nastaId=x.id+1});
    $('meny-version').textContent='Prototyp, bygge '+BYGGE;
    $('login').hidden=true;$('app').hidden=false;$('hjalp-knapp').hidden=false;
    $('kund-logga').textContent=S.org.kort;
    $('kund-namn').textContent=S.org.namn;
    $('anv-namn').textContent=S.anv.namn;
    $('anv-roll').textContent=S.anv.roll;
    $('anv-init').textContent=init(S.anv.namn);
    rita('oversikt');
  });
  $('logga-ut').addEventListener('click',function(){$('app').hidden=true;$('login').hidden=false;$('hjalp-knapp').hidden=true});
  $('hjalp-knapp').addEventListener('click',function(){rita('support')});
  $('notis-knapp').addEventListener('click',function(){$('notis-panel').hidden=!$('notis-panel').hidden});
  $('notis-stang').addEventListener('click',function(){$('notis-panel').hidden=true});
  window.addEventListener('hashchange',function(){if(!$('app').hidden)rita()});
})();
