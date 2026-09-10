(function(){
  var BYGGE='11';
  var MANADER=['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'];
  function kr(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' kr'}
  function fmt(d){return d.getDate()+' '+MANADER[d.getMonth()]}
  function init(n){return n.split(' ').map(function(w){return w[0]}).slice(0,2).join('').toUpperCase()}
  function idag(){var d=new Date();return d.getDate()+' '+MANADER[d.getMonth()]}
  function veckoNr(d){var t=new Date(d.getTime());t.setHours(0,0,0,0);t.setDate(t.getDate()+3-((t.getDay()+6)%7));
    var v=new Date(t.getFullYear(),0,4);return 1+Math.round(((t-v)/864e5-3+((v.getDay()+6)%7))/7)}
  function period(datum){var s=new Date(datum+'T00:00:00'),e=new Date(s.getTime()+4*864e5);
    return fmt(s)+' till '+fmt(e)+' '+e.getFullYear()}
  var KORT=['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'];
  function periodKort(datum){var s=new Date(datum+'T00:00:00'),e=new Date(s.getTime()+4*864e5);
    return s.getDate()+' till '+e.getDate()+' '+KORT[e.getMonth()]+' '+e.getFullYear()}
  var SVG=function(d){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'};

  var STATUS={utkast:['Utkast','st-utkast'],publicerad:['Publicerad','st-bekraftad'],
              fullbokad:['Fullbokad','st-genomford'],installd:['Inställd','st-ingen']};
  var HSTATUS={tillfragad:['Tillfrågad','st-utkast'],bekraftad:['Bekräftad','st-bekraftad'],nekad:['Tackat nej','st-ingen']};

  /* ---------- Demodata ---------- */
  var DEMO={
    arrangor:{namn:'Nordlys Utveckling AB',kort:'NU',orgnr:'559xxx-xxxx',kontakt:'Petra Lund',epost:'petra@nordlys.se'},
    handledare:[
      {id:1,namn:'Anna Falk',roll:'UGL-handledare sedan 2014',epost:'anna@nordlys.se',cert:'2014',text:'',bild:'',lediga:[41,42,45,46,47]},
      {id:2,namn:'Robert Koss',roll:'UGL-handledare sedan 2018',epost:'robert@nordlys.se',cert:'2018',text:'',bild:'',lediga:[42,43,47,48]},
      {id:3,namn:'Mirja Lindström',roll:'UGL-handledare sedan 2011',epost:'mirja@nordlys.se',cert:'2011',text:'',bild:'',lediga:[45,46,49,50]},
      {id:4,namn:'Tomas Edlund',roll:'UGL-handledare sedan 2020',epost:'tomas@nordlys.se',cert:'2020',text:'',bild:'',lediga:[41,43,48,49]},
      {id:5,namn:'Lena Sobel',roll:'UGL-handledare sedan 2016',epost:'lena@nordlys.se',cert:'2016',text:'',bild:'',lediga:[42,46,50,51]}
    ],
    anlaggningar:[
      {id:1,namn:'Tylebäck',ort:'Halmstad',adress:'Tylebäcksvägen 1, 302 73 Halmstad',bild:'',platser:12,logipris:8900,kontakt:'bokning@tyleback.se',text:'Kursgård vid havet strax söder om Halmstad. Enkelrum, alla måltider och avskilda grupprum.'},
      {id:2,namn:'Skogshem & Wijk',ort:'Lidingö',adress:'Ekholmsnäsvägen 91, 181 41 Lidingö',bild:'',platser:12,logipris:9900,kontakt:'konferens@skogshemwijk.se',text:'Konferensanläggning i skogen på Lidingö, en halvtimme från Stockholms city.'},
      {id:3,namn:'Lovik',ort:'Stockholm',adress:'Lidingö',bild:'',platser:12,logipris:9900,kontakt:'',text:''},
      {id:4,namn:'Ringenäs',ort:'Halmstad',adress:'Ringenäs, Halmstad',bild:'',platser:12,logipris:9900,kontakt:'',text:''},
      {id:5,namn:'Bykrogen',ort:'Kristianstad',adress:'Kristianstad',bild:'',platser:12,logipris:9500,kontakt:'',text:''},
      {id:6,namn:'Hagastrand',ort:'Stockholm',adress:'Stockholm',bild:'',platser:12,logipris:10500,kontakt:'',text:''}
    ],
    kurser:[
      {id:1,datum:'2026-10-05',anlId:1,anlaggning:'Tylebäck',ort:'Halmstad',kurspris:23900,logi:null,max:12,bokade:9,status:'publicerad',handledare:[{hid:1,status:'bekraftad'},{hid:4,status:'bekraftad'}]},
      {id:2,datum:'2026-10-12',anlId:2,anlaggning:'Skogshem & Wijk',ort:'Lidingö',kurspris:23900,logi:null,max:12,bokade:12,status:'fullbokad',handledare:[{hid:2,status:'bekraftad'},{hid:5,status:'bekraftad'}]},
      {id:3,datum:'2026-10-19',anlId:3,anlaggning:'Lovik',ort:'Stockholm',kurspris:23900,logi:10400,max:12,bokade:4,status:'publicerad',handledare:[{hid:2,status:'bekraftad'}]},
      {id:4,datum:'2026-11-02',anlId:4,anlaggning:'Ringenäs',ort:'Halmstad',kurspris:23900,logi:null,max:12,bokade:6,status:'publicerad',handledare:[{hid:1,status:'bekraftad'},{hid:3,status:'tillfragad'}]},
      {id:5,datum:'2026-11-16',anlId:5,anlaggning:'Bykrogen',ort:'Kristianstad',kurspris:23900,logi:null,max:12,bokade:0,status:'utkast',handledare:[]},
      {id:6,datum:'2026-12-07',anlId:6,anlaggning:'Hagastrand',ort:'Stockholm',kurspris:23900,logi:null,max:12,bokade:7,status:'publicerad',handledare:[{hid:3,status:'bekraftad'},{hid:5,status:'bekraftad'}]}
    ],
    deltagare:[
      {kid:1,namn:'Johan Lind',org:'Nordvik Industri AB',status:'bekraftad'},
      {kid:1,namn:'Elin Sandell',org:'Nordvik Industri AB',status:'bekraftad'},
      {kid:1,namn:'Petra Sjöqvist',org:'Almvik Kommun',status:'bekraftad'},
      {kid:3,namn:'Nadia Rahimi',org:'Nordvik Industri AB',status:'forfragan'},
      {kid:4,namn:'Martin Berg',org:'Sydkraft Bygg',status:'bekraftad'}
    ]
  };

  var S=null,roll='arrangor',jagId=1,nastaId=100;
  function las(){try{var r=localStorage.getItem('ugl-leverantor-demo');if(r)return komplettera(JSON.parse(r))}catch(e){}return null}
  function spara(){try{localStorage.setItem('ugl-leverantor-demo',JSON.stringify(S))}catch(e){}}
  function nollstall(){S=JSON.parse(JSON.stringify(DEMO));spara()}
  function komplettera(s){
    if(!s||typeof s!=='object')return null;
    s.arrangor=s.arrangor||JSON.parse(JSON.stringify(DEMO.arrangor));
    s.handledare=Array.isArray(s.handledare)&&s.handledare.length?s.handledare:JSON.parse(JSON.stringify(DEMO.handledare));
    s.kurser=Array.isArray(s.kurser)?s.kurser:JSON.parse(JSON.stringify(DEMO.kurser));
    s.deltagare=Array.isArray(s.deltagare)?s.deltagare:[];
    s.anlaggningar=Array.isArray(s.anlaggningar)&&s.anlaggningar.length?s.anlaggningar:JSON.parse(JSON.stringify(DEMO.anlaggningar));
    s.kurser.forEach(function(k){k.handledare=Array.isArray(k.handledare)?k.handledare:[]});
    return s;
  }
  var $=function(id){return document.getElementById(id)};
  function hl(id){return S.handledare.filter(function(h){return h.id===id})[0]}
  function kurs(id){return S.kurser.filter(function(k){return k.id===id})[0]}
  function anlById(id){return (S.anlaggningar||[]).filter(function(a){return a.id===id})[0]}
  function anl(k){return anlById(k.anlId)||{id:0,namn:k.anlaggning,ort:k.ort,bild:'',platser:12,logipris:k.logi,adress:'',kontakt:'',text:''}}
  function bildRuta(bild,namn,storlek){
    return bild?'<span class="anl-bild '+(storlek||'')+'"><img src="'+bild+'" alt=""></span>'
      :'<span class="anl-bild anl-tom '+(storlek||'')+'">'+(namn||'?').slice(0,1).toUpperCase()+'</span>';
  }
  function anlBild(a,storlek){
    return a.bild?'<span class="anl-bild '+(storlek||'')+'"><img src="'+a.bild+'" alt=""></span>'
      :'<span class="anl-bild anl-tom '+(storlek||'')+'">'+a.namn.slice(0,1).toUpperCase()+'</span>';
  }
  function vecka(k){return veckoNr(new Date(k.datum+'T00:00:00'))}
  function kLogi(k){return k.logi==null?anl(k).logipris:k.logi}
  function kBild(k){return k.bild||anl(k).bild}
  function kText(k){return k.text||anl(k).text}
  function arver(k){return {logi:k.logi==null,bild:!k.bild,text:!k.text}}
  function total(k){return k.kurspris+kLogi(k)}
  function dagarKvar(k){return Math.round((new Date(k.datum+'T00:00:00')-new Date())/864e5)}
  function mina(){return S.kurser.filter(function(k){return k.handledare.some(function(h){return h.hid===jagId})})}

  /* ---------- Kvalitetskontroller ---------- */
  function problem(){
    var p=[];
    S.kurser.filter(function(k){return k.status==='publicerad'}).forEach(function(k){
      var d=dagarKvar(k);
      if(k.bokade<8&&d>0&&d<45)p.push({niva:'varning',rubrik:'Låg beläggning nära start',
        text:'Vecka '+vecka(k)+' i '+k.ort+' har '+k.bokade+' av minst 8 platser fyllda och startar om '+d+' dagar.',kid:k.id});
    });
    S.kurser.filter(function(k){return k.status==='utkast'}).forEach(function(k){
      p.push({niva:'info',rubrik:'Utkast ej publicerat',text:'Vecka '+vecka(k)+' i '+k.ort+' syns inte i det publika utbudet än.',kid:k.id});
    });
    return p;
  }
  function minaNotiser(){
    var n=[];
    mina().forEach(function(k){
      var m=k.handledare.filter(function(h){return h.hid===jagId})[0];
      if(m.status==='tillfragad')n.push({niva:'varning',rubrik:'Förfrågan att svara på',
        text:'Vecka '+vecka(k)+' i '+k.ort+', '+period(k.datum)+'. Svara så snart du kan.'});
    });
    if(!hl(jagId).text)n.push({niva:'info',rubrik:'Din profil är tom',
      text:'Lägg in en presentation och ett porträtt, så används de på kurssidorna där du står som handledare.'});
    return n;
  }

  /* ---------- Delar ---------- */
  function kpi(v,e,x){return '<div class="kpi"><b>'+v+'</b><span>'+e+'</span>'+(x?'<small>'+x+'</small>':'')+'</div>'}
  function chip(s,tab){return '<span class="chip-status '+tab[s][1]+'">'+tab[s][0]+'</span>'}
  function belaggning(k){
    var p=Math.round(k.bokade/k.max*100);
    return '<span class="bel"><i style="width:'+p+'%" class="'+(k.bokade>=8?'bel-ok':'bel-lag')+'"></i></span><small>'+k.bokade+' av '+k.max+'</small>';
  }
  function hlChips(k){
    if(!k.handledare.length)return '<span class="hl-tom">Ingen kopplad</span>';
    return '<div class="hl-rad">'+k.handledare.map(function(h){
      return '<span class="hl-chip '+(h.status==='bekraftad'?'ar-bekraftad':h.status==='nekad'?'ar-nekad':'ar-tillfragad')+'" title="'+hl(h.hid).namn+', '+HSTATUS[h.status][0].toLowerCase()+'">'+
        '<i class="hl-prick" aria-hidden="true"></i>'+hl(h.hid).namn+
        '<span class="dolt">, '+HSTATUS[h.status][0].toLowerCase()+'</span></span>'}).join('')+'</div>';
  }

  /* ---------- Arrangörsvyer ---------- */
  function aOversikt(){
    var pub=S.kurser.filter(function(k){return k.status==='publicerad'||k.status==='fullbokad'});
    var platser=pub.reduce(function(a,k){return a+k.max},0),bokade=pub.reduce(function(a,k){return a+k.bokade},0);
    var intakt=pub.reduce(function(a,k){return a+k.bokade*total(k)},0);
    var pb=problem();
    var h='<div class="vy-head"><div><h1>Hej '+S.arrangor.kontakt.split(' ')[0]+'.</h1><p class="lead">Så ser ert kursutbud ut just nu.</p></div>'+
      '<a class="button" href="#nykurs">Lägg upp ny kurs &#8594;</a></div>';
    h+='<div class="kpi-rad">'+kpi(pub.length,'kurser ute')+kpi(bokade+' / '+platser,'platser fyllda')+
      kpi(platser?Math.round(bokade/platser*100)+' %':'0 %','beläggning')+kpi(kr(intakt),'bokat värde','exkl. moms')+'</div>';
    if(pb.filter(function(x){return x.niva==='varning'}).length){
      h+='<div class="varning"><span class="v-ikon">'+SVG('<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>')+'</span><div><strong>Behöver din uppmärksamhet</strong>'+
        pb.filter(function(x){return x.niva==='varning'}).map(function(x){return '<p>'+x.text+'</p>'}).join('')+'</div></div>';
    }
    h+='<div class="panel"><div class="panel-head"><h2>Kommande kurser</h2><a class="text-link" href="#kurser">Se alla</a></div>'+kursTabell(S.kurser.slice(0,4))+'</div>';
    return h;
  }
  function kursTabell(lista){
    if(!lista.length)return '<p class="tom">Inga kurser än.</p>';
    return '<div class="tab-svep"><table class="tab"><thead><tr><th>Vecka</th><th>Datum</th><th>Plats</th><th>Handledare</th><th>Beläggning</th><th>Status</th><th></th></tr></thead><tbody>'+
      lista.slice().sort(function(a,b){return a.datum<b.datum?-1:1}).map(function(k){
        return '<tr class="rad-oppna" tabindex="0" data-oppna="kurs:'+k.id+'"><td><b>'+vecka(k)+'</b></td><td class="td-datum">'+periodKort(k.datum)+'</td>'+
          '<td class="td-plats">'+bildRuta(kBild(k),anl(k).namn)+'<span><b>'+anl(k).namn+'</b><small>'+anl(k).ort+'</small>'+(arver(k).logi&&arver(k).bild?'':'<em class="justerad">Justerad</em>')+'</span></td>'+
          '<td class="td-hl" data-oppna="koppla:'+k.id+'" title="Klicka för att koppla handledare">'+hlChips(k)+'</td>'+
          '<td>'+belaggning(k)+'</td>'+
          '<td>'+chip(k.status,STATUS)+'</td>'+
          '<td class="tab-atg">'+
            (k.status==='utkast'?'<button class="mini mini-primar" data-publicera="'+k.id+'">Publicera</button>':'')+
            '<span class="rad-pil" aria-hidden="true">&#8250;</span></td></tr>';
      }).join('')+'</tbody></table></div>';
  }
  function aKurser(){
    return '<div class="vy-head"><div><h1>Kurser</h1><p class="lead">Alla veckor ni arrangerar, publicerade och utkast.</p></div>'+
      '<a class="button" href="#nykurs">Lägg upp ny kurs &#8594;</a></div>'+
      '<div class="panel">'+kursTabell(S.kurser)+'</div>';
  }
  function aNyKurs(){
    return '<div class="vy-head"><div><h1>Lägg upp ny kurs</h1><p class="lead">Veckonummer och slutdatum räknas ut automatiskt. Publicerade kurser syns direkt i det publika utbudet.</p></div></div>'+
    '<div class="nykurs-layout">'+
      '<div class="panel"><h2>Kursen</h2><div class="form-grid">'+
        '<label class="ro"><span>Startdatum, måndag</span><input type="date" id="nk-datum" value="2027-01-18"></label>'+
        '<label class="ro"><span>Anläggning</span><select id="nk-anl"><option value="">Välj anläggning</option>'+
          S.anlaggningar.map(function(a){return '<option value="'+a.id+'">'+a.namn+', '+a.ort+'</option>'}).join('')+
          '</select></label>'+
        '<label class="ro"><span>Ort</span><input id="nk-ort" readonly placeholder="Fylls i automatiskt"></label>'+
        '<label class="ro"><span>Kursavgift, exkl. moms</span><input id="nk-pris" type="number" value="23900"></label>'+
        '<label class="ro"><span>Kost och logi, exkl. moms</span><input id="nk-logi" type="number" value="9900"></label>'+
        '<label class="ro"><span>Deltagare</span><input value="8 till 12, enligt UGL" readonly></label>'+
      '</div>'+
      '<div class="nk-knappar"><button class="button" id="nk-publicera">Skapa och publicera</button>'+
      '<button class="button button-outline-dark" id="nk-utkast">Spara som utkast</button></div></div>'+

      '<div class="panel"><div class="panel-head"><h2>Handledare</h2><span class="valfritt">Valfritt, kan kopplas senare</span></div>'+
        '<div class="sok-falt">'+SVG('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>')+
        '<input type="search" id="nk-sok" placeholder="Sök på namn eller år" autocomplete="off"></div>'+
        '<div class="valj-lista" id="nk-hl">'+S.handledare.map(function(h){
          return '<label class="valj-rad" data-namn="'+(h.namn+' '+h.roll+' '+h.cert).toLowerCase()+'">'+
          '<input type="checkbox" value="'+h.id+'"><span class="n-init liten">'+init(h.namn)+'</span>'+
          '<span class="vr-text"><b>'+h.namn+'</b><small>'+h.roll+'</small></span></label>'}).join('')+'</div>'+
        '<p class="tom" id="nk-traffar"></p></div>'+
    '</div>';
  }

  function aHandledare(){
    var h='<div class="vy-head"><div><h1>Handledarnätverk</h1><p class="lead">'+S.handledare.length+' handledare. Grön markering betyder ledig den veckan.</p></div>'+
      '<button class="button button-outline-dark" id="ny-hl">Bjud in handledare</button></div>';
    h+='<div class="panel"><table class="tab"><thead><tr><th>Handledare</th><th>Certifierad</th><th>Uppdrag hos er</th><th>Profil</th><th>Lediga veckor</th></tr></thead><tbody>'+
      S.handledare.map(function(x){
        var upp=S.kurser.filter(function(k){return k.handledare.some(function(y){return y.hid===x.id})}).length;
        return '<tr><td><span class="n-init liten">'+init(x.namn)+'</span><b>'+x.namn+'</b><small>'+x.epost+'</small></td>'+
          '<td>'+x.cert+'</td><td>'+upp+'</td>'+
          '<td>'+(x.text?'<span class="chip-status st-bekraftad">Klar</span>':'<span class="chip-status st-utkast">Saknas</span>')+'</td>'+
          '<td>'+x.lediga.map(function(v){return '<span class="veckochip">v '+v+'</span>'}).join('')+'</td></tr>';
      }).join('')+'</tbody></table></div>';
    return h;
  }
  function aDeltagare(){
    var h='<div class="vy-head"><div><h1>Deltagare</h1><p class="lead">Anmälda per kurs, inklusive förfrågningar som väntar på bekräftelse.</p></div></div>';
    S.kurser.filter(function(k){return S.deltagare.some(function(d){return d.kid===k.id})}).forEach(function(k){
      h+='<div class="panel"><div class="panel-head"><h2>Vecka '+vecka(k)+', '+k.ort+'</h2><span class="pf">'+belaggning(k)+'</span></div>'+
        '<table class="tab"><thead><tr><th>Deltagare</th><th>Organisation</th><th>Status</th></tr></thead><tbody>'+
        S.deltagare.filter(function(d){return d.kid===k.id}).map(function(d){
          return '<tr><td><b>'+d.namn+'</b></td><td>'+d.org+'</td>'+
            '<td>'+(d.status==='bekraftad'?'<span class="chip-status st-bekraftad">Bekräftad</span>':'<span class="chip-status st-forfragan">Förfrågan</span>')+'</td></tr>';
        }).join('')+'</tbody></table></div>';
    });
    return h;
  }
  function aEkonomi(){
    var pub=S.kurser.filter(function(k){return k.status!=='installd'});
    var intakt=pub.reduce(function(a,k){return a+k.bokade*total(k)},0);
    var potential=pub.reduce(function(a,k){return a+k.max*total(k)},0);
    var h='<div class="vy-head"><div><h1>Ekonomi</h1><p class="lead">Alla belopp exklusive moms.</p></div></div>';
    h+='<div class="kpi-rad">'+kpi(kr(intakt),'bokat värde')+kpi(kr(potential-intakt),'kvar att sälja')+
      kpi(kr(pub.length?intakt/pub.length:0),'snitt per kurs')+'</div>';
    h+='<div class="panel"><h2>Per kurs</h2><table class="tab"><thead><tr><th>Vecka</th><th>Plats</th><th>Pris per plats</th><th>Bokat</th><th>Möjligt</th></tr></thead><tbody>'+
      pub.map(function(k){return '<tr><td><b>'+vecka(k)+'</b></td><td>'+k.anlaggning+'<small>'+k.ort+'</small></td>'+
        '<td>'+kr(total(k))+'</td><td>'+kr(k.bokade*total(k))+'</td><td>'+kr(k.max*total(k))+'</td></tr>'}).join('')+
      '</tbody></table></div>';
    return h;
  }

  function aAnlaggningar(){
    var h='<div class="vy-head"><div><h1>Anläggningar</h1><p class="lead">Varje kursgård är en mall. Nya kurser ärver bild, pris och beskrivning härifrån, och kan justeras var för sig. Samma anläggning kan finnas hos flera arrangörer, var och en med sitt eget avtal.</p></div>'+
      '<button class="button" id="ny-anl">Lägg till anläggning</button></div>';
    if(!S.anlaggningar.length)return h+'<div class="panel"><p class="tom">Inga anläggningar än.</p></div>';
    h+='<div class="panel"><table class="tab tab-anl"><thead><tr><th>Anläggning</th><th>Beskrivning</th><th class="hoger">Kost och logi</th><th class="hoger">Kurser</th><th></th></tr></thead><tbody>'+
      S.anlaggningar.map(function(a){
        var antal=S.kurser.filter(function(k){return k.anlId===a.id}).length;
        return '<tr class="rad-oppna" tabindex="0" data-oppna="anl:'+a.id+'"><td><div class="td-anl">'+anlBild(a,'anl-mellan')+
          '<span><b>'+a.namn+'</b><small>'+(a.ort||'Ort saknas')+(a.bild?'':' · bild saknas')+'</small></span></div></td>'+
          '<td class="td-besk">'+(a.text?a.text:'<span class="anl-utan">Ingen beskrivning än.</span>')+'</td>'+
          '<td class="hoger">'+kr(a.logipris)+'</td>'+
          '<td class="hoger">'+antal+'</td>'+
          '<td class="tab-atg"><span class="rad-pil" aria-hidden="true">&#8250;</span></td></tr>';
      }).join('')+'</tbody></table></div>';
    return h;
  }
  function anlFormular(id){
    var a=id?anlById(id):{id:0,namn:'',ort:'',adress:'',bild:'',platser:12,logipris:9900,kontakt:'',text:''};
    var html='<div class="modal"><div class="modal-inre modal-bred"><div class="cp-head"><h3>'+(id?'Redigera anläggning':'Ny anläggning')+'</h3><button type="button" id="mod-stang" aria-label="Stäng">&#10005;</button></div>'+
      '<div class="modal-kropp"><div class="anl-form">'+
        '<div class="anl-bildvalj"><div class="anl-forhand" id="anl-forhand">'+anlBild(a,'anl-stor')+'</div>'+
        '<input type="file" id="af-bild" accept="image/*" class="fil-in">'+
        '<p class="tom">Liggande bild, minst 1000 pixlar bred. Den visas på kurskorten och överst på kurssidan.</p></div>'+
        '<div class="anl-falt">'+
          '<div class="form-grid">'+
            '<label class="ro"><span>Namn</span><input id="af-namn" value="'+a.namn+'"></label>'+
            '<label class="ro"><span>Ort</span><input id="af-ort" value="'+a.ort+'"></label>'+
            '<label class="ro ro-bred"><span>Adress</span><input id="af-adress" value="'+a.adress+'"></label>'+
            '<label class="ro ro-bred"><span>Kontaktperson</span><input id="af-kontakt" value="'+a.kontakt+'"></label>'+
            '<label class="ro"><span>Kost och logi, ex moms</span><input id="af-logi" type="number" value="'+a.logipris+'"></label>'+
          '</div>'+
          '<label class="ro ro-text"><span>Beskrivning</span>'+
          '<textarea id="af-text" rows="4" placeholder="Kort om läget, boendet och miljön.">'+(a.text||'')+'</textarea>'+
          '<em>Visas på kurssidan för alla kurser som ärver från mallen.</em></label>'+
        '</div>'+
      '</div></div>'+
      '<div class="modal-fot"><button class="button" id="af-spara">Spara</button>'+
      (id?'<button class="button button-outline-dark" id="af-ta">Ta bort</button>':'')+'</div></div></div>';
    var d=document.createElement('div');d.innerHTML=html;document.body.appendChild(d.firstChild);
    var nyBild=a.bild;
    document.getElementById('af-bild').addEventListener('change',function(e){
      var f=e.target.files[0];if(!f)return;
      var r=new FileReader();r.onload=function(){nyBild=r.result;
        document.getElementById('anl-forhand').innerHTML='<span class="anl-bild anl-stor"><img src="'+nyBild+'" alt=""></span>'};
      r.readAsDataURL(f);
    });
    document.getElementById('af-spara').addEventListener('click',function(){
      var namn=document.getElementById('af-namn').value.trim();
      if(!namn){toast('Anläggningen behöver ett namn.');return}
      var post={id:a.id||nastaId++,namn:namn,ort:document.getElementById('af-ort').value.trim(),
        adress:document.getElementById('af-adress').value.trim(),kontakt:document.getElementById('af-kontakt').value.trim(),
        platser:a.platser||12,logipris:+document.getElementById('af-logi').value,
        text:document.getElementById('af-text').value.trim(),bild:nyBild};
      if(a.id){S.anlaggningar=S.anlaggningar.map(function(x){return x.id===a.id?post:x})}
      else S.anlaggningar.push(post);
      spara();stang();toast('Anläggningen är sparad.');
    });
    if(id)document.getElementById('af-ta').addEventListener('click',function(){
      var antal=S.kurser.filter(function(k){return k.anlId===id}).length;
      if(antal){toast('Anläggningen används av '+antal+' kurser och kan inte tas bort.');return}
      S.anlaggningar=S.anlaggningar.filter(function(x){return x.id!==id});spara();stang();toast('Anläggningen är borttagen.');
    });
    document.getElementById('mod-stang').addEventListener('click',stang);
    function stang(){var m=document.querySelector('.modal');if(m)m.remove();rita()}
  }

  /* ---------- Handledarvyer ---------- */
  function hUppdrag(){
    var m=mina();
    var h='<div class="vy-head"><div><h1>Hej '+hl(jagId).namn.split(' ')[0]+'.</h1><p class="lead">Dina uppdrag hos '+S.arrangor.namn+'.</p></div></div>';
    h+='<div class="kpi-rad">'+
      kpi(m.filter(function(k){return k.handledare.some(function(x){return x.hid===jagId&&x.status==='bekraftad'})}).length,'bekräftade veckor')+
      kpi(m.filter(function(k){return k.handledare.some(function(x){return x.hid===jagId&&x.status==='tillfragad'})}).length,'väntar på ditt svar')+
      kpi(hl(jagId).lediga.length,'veckor du märkt lediga')+'</div>';
    if(!m.length)return h+'<div class="panel"><p class="tom">Du har inga uppdrag inlagda än.</p></div>';
    h+='<div class="panel"><h2>Mina veckor</h2><table class="tab"><thead><tr><th>Vecka</th><th>Datum</th><th>Plats</th><th>Medhandledare</th><th>Deltagare</th><th>Status</th><th></th></tr></thead><tbody>'+
      m.sort(function(a,b){return a.datum<b.datum?-1:1}).map(function(k){
        var mitt=k.handledare.filter(function(x){return x.hid===jagId})[0];
        var med=k.handledare.filter(function(x){return x.hid!==jagId}).map(function(x){return hl(x.hid).namn}).join(', ')||'Ingen inlagd';
        return '<tr class="rad-oppna" tabindex="0" data-oppna="detalj:'+k.id+'"><td><b>'+vecka(k)+'</b></td><td>'+period(k.datum)+'</td>'+
          '<td><b>'+k.anlaggning+'</b><small>'+k.ort+'</small></td><td>'+med+'</td>'+
          '<td>'+k.bokade+' av '+k.max+'</td><td>'+chip(mitt.status,HSTATUS)+'</td>'+
          '<td class="tab-atg">'+(mitt.status==='tillfragad'
            ? '<button class="mini mini-primar" data-ja="'+k.id+'">Tacka ja</button><button class="mini" data-nej="'+k.id+'">Tacka nej</button>'
            : '<button class="mini" data-detalj="'+k.id+'">Detaljer</button>')+'</td></tr>';
      }).join('')+'</tbody></table></div>';
    return h;
  }
  function hTillganglighet(){
    var mig=hl(jagId);
    var veckor=[];for(var v=40;v<=52;v++)veckor.push(v);
    return '<div class="vy-head"><div><h1>Min tillgänglighet</h1><p class="lead">Markera vilka veckor du kan ta uppdrag. Arrangören ser det när de planerar.</p></div></div>'+
      '<div class="panel"><h2>Vecka 40 till 52</h2><div class="vecko-rutnat">'+
      veckor.map(function(v){return '<button type="button" class="veckoknapp'+(mig.lediga.indexOf(v)>-1?' ar-ledig':'')+'" data-vecka="'+v+'">v '+v+'</button>'}).join('')+
      '</div><p class="tom">Grön betyder att du är tillgänglig. Klicka för att ändra.</p></div>';
  }
  function hProfil(){
    var mig=hl(jagId);
    return '<div class="vy-head"><div><h1>Min profil</h1><p class="lead">Texten och bilden du lägger in här används på kurssidorna där du står som handledare.</p></div></div>'+
    '<div class="plan-layout"><div class="panel"><h2>Presentation</h2>'+
      '<div class="form-grid"><label class="ro"><span>Namn</span><input value="'+mig.namn+'" readonly></label>'+
      '<label class="ro"><span>Certifierad år</span><input value="'+mig.cert+'" readonly></label></div>'+
      '<div class="field field-wide" style="margin-top:1rem"><label for="pr-roll">Rubrik</label><input id="pr-roll" value="'+mig.roll+'"></div>'+
      '<div class="field field-wide" style="margin-top:1rem"><label for="pr-text">Om dig <span>Två till fyra meningar</span></label>'+
      '<textarea id="pr-text" rows="5" placeholder="Skriv med dina egna ord. Bakgrund, vad du arbetar med i dag och vad du tar med dig in i UGL-rummet.">'+(mig.text||'')+'</textarea></div>'+
      '<button class="button" id="pr-spara">Spara profil</button></div>'+
    '<div class="panel"><h2>Porträtt</h2>'+
      '<div class="portratt-ruta">'+(mig.bild?'<img src="'+mig.bild+'" alt="Ditt porträtt">':'<span class="n-init stor">'+init(mig.namn)+'</span>')+'</div>'+
      '<input type="file" id="pr-bild" accept="image/*" class="fil-in">'+
      '<p class="tom">Stående bild, minst 800 pixlar hög. Du äger bilden och kan byta eller ta bort den när du vill.</p>'+
      '<div class="forhand-publik"><p class="ip-rubrik">Så visas du på kurssidan</p>'+
        '<div class="fp-kort"><div><b>'+mig.namn+'</b><small>'+mig.roll+'</small>'+
        '<p>'+(mig.text||'Din presentation visas här när du har skrivit den.')+'</p></div>'+
        '<span class="fp-bild">'+(mig.bild?'<img src="'+mig.bild+'" alt="">':init(mig.namn))+'</span></div></div>'+
    '</div></div>';
  }

  /* ---------- Ram ---------- */
  var MENY={
    arrangor:[['oversikt','Översikt'],['kurser','Kurser'],['nykurs','Lägg upp kurs'],['anlaggningar','Anläggningar'],['handledare','Handledarnätverk'],['deltagare','Deltagare'],['ekonomi','Ekonomi']],
    handledare:[['uppdrag','Mina uppdrag'],['tillganglighet','Min tillgänglighet'],['profil','Min profil']]
  };
  var VYER={oversikt:aOversikt,kurser:aKurser,nykurs:aNyKurs,anlaggningar:aAnlaggningar,handledare:aHandledare,deltagare:aDeltagare,ekonomi:aEkonomi,
            uppdrag:hUppdrag,tillganglighet:hTillganglighet,profil:hProfil};
  function ritaMeny(){
    $('meny').innerHTML=MENY[roll].map(function(m){return '<a href="#'+m[0]+'" data-vy="'+m[0]+'">'+m[1]+'</a>'}).join('')+
      '<span class="meny-avdelare"></span><a href="/kurser" class="meny-extern">Publikt kursutbud &#8599;</a>'+
      '<span class="meny-version">Prototyp, bygge '+BYGGE+'</span>';
  }
  var OPPNA={
    kurs:function(id){kursFormular(id)},
    koppla:function(id){kopplaHandledare(id)},
    anl:function(id){anlFormular(id)},
    detalj:function(id){var k=kurs(id);toast('Vecka '+vecka(k)+' i '+k.ort+'. '+k.bokade+' av '+k.max+' platser bokade.')}
  };
  function radKlick(e){
    if(e.target.closest('button,a,input,select,textarea,label'))return;
    var r=e.target.closest('[data-oppna]');if(!r)return;
    var d=r.getAttribute('data-oppna').split(':');
    if(OPPNA[d[0]])OPPNA[d[0]](+d[1]);
  }
  $('vy').addEventListener('click',radKlick);
  $('vy').addEventListener('keydown',function(e){
    if(e.key!=='Enter'&&e.key!==' ')return;
    if(!e.target.getAttribute||!e.target.getAttribute('data-oppna'))return;
    e.preventDefault();radKlick(e);
  });
  function rita(vy){
    vy=vy||(location.hash||'#'+MENY[roll][0][0]).slice(1);
    if(MENY[roll].map(function(m){return m[0]}).indexOf(vy)<0)vy=MENY[roll][0][0];
    location.hash=vy;
    document.querySelectorAll('#meny a[data-vy]').forEach(function(a){a.classList.toggle('ar-pa',a.getAttribute('data-vy')===vy)});
    try{$('vy').innerHTML=VYER[vy]()}
    catch(fel){$('vy').innerHTML='<div class="panel"><h2>Något gick fel i den här vyn</h2><p class="tom">Återställ demodata så fungerar den igen.</p><button class="button" id="nollstall">Återställ demodata</button></div>'}
    var n=roll==='arrangor'?problem():minaNotiser();
    $('notis-prick').hidden=!n.length;
    $('notis-lista').innerHTML=n.length?n.map(function(x){
      return '<li class="'+(x.niva==='varning'?'n-varning':'')+'"><b>'+x.rubrik+'</b><span>'+x.text+'</span></li>'}).join('')
      :'<li><b>Inget nytt</b><span>Vi hör av oss här när något behöver din uppmärksamhet.</span></li>';
    koppla();
  }
  function toast(t){var e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);
    setTimeout(function(){e.classList.add('ut')},2200);setTimeout(function(){e.remove()},2800)}

  function kopplaHandledare(kid){
    var k=kurs(kid),v=vecka(k);
    var upptagna={};
    S.kurser.forEach(function(x){if(x.id!==kid&&x.datum===k.datum)x.handledare.forEach(function(h){upptagna[h.hid]=x.ort})});
    var html='<div class="modal"><div class="modal-inre"><div class="cp-head"><h3>Handledare, vecka '+v+' i '+k.ort+'</h3><button type="button" id="mod-stang" aria-label="Stäng">&#10005;</button></div>'+
      '<div class="modal-kropp">'+
      '<div class="valj-lista">'+S.handledare.map(function(h){
        var pa=k.handledare.filter(function(x){return x.hid===h.id})[0];
        var ledig=h.lediga.indexOf(v)>-1,krock=upptagna[h.id];
        return '<label class="valj-rad"><input type="checkbox" data-hkoppla="'+h.id+'"'+(pa?' checked':'')+'>'+
          '<span class="n-init liten">'+init(h.namn)+'</span>'+
          '<span class="vr-text"><b>'+h.namn+'</b><small>'+h.roll+'</small></span>'+
          '<span class="vr-status">'+(krock?'<span class="kv-not">Även inlagd i '+krock+'</span>':(ledig?'<span class="chip-status st-bekraftad">Ledig v '+v+'</span>':'<span class="chip-status st-ingen">Ej markerad ledig</span>'))+
          (pa?' '+chip(pa.status,HSTATUS):'')+'</span></label>';
      }).join('')+'</div>'+
      '<p class="tom">Kryssa i en handledare för att skicka förfrågan. Hen svarar i sin egen portal.</p></div>'+
      '<div class="modal-fot"><button class="button" id="mod-klar">Klar</button></div></div></div>';
    var d=document.createElement('div');d.innerHTML=html;document.body.appendChild(d.firstChild);
    document.querySelectorAll('[data-hkoppla]').forEach(function(c){c.addEventListener('change',function(){
      var hid=+c.getAttribute('data-hkoppla');
      if(c.checked){if(!k.handledare.some(function(x){return x.hid===hid}))k.handledare.push({hid:hid,status:'tillfragad'})}
      else k.handledare=k.handledare.filter(function(x){return x.hid!==hid});
      spara();
    })});
    document.getElementById('mod-stang').addEventListener('click',stang);
    document.getElementById('mod-klar').addEventListener('click',stang);
    function stang(){document.querySelector('.modal').remove();rita()}
  }

  function kursFormular(id){
    var k=kurs(id),a=anl(k),ar=arver(k);
    var rad=function(etikett,arvd,innehall,falt){
      return '<div class="arv-rad"><div class="arv-topp"><span class="arv-etikett">'+etikett+'</span>'+
        (arvd?'<span class="arv-markor">Ärver från '+a.namn+'</span>'
             :'<span class="arv-markor ar-egen">Justerad för den här kursen <button type="button" class="arv-ater" data-ater="'+falt+'">Återställ</button></span>')+
        '</div>'+innehall+'</div>';
    };
    var html='<div class="modal"><div class="modal-inre modal-bred"><div class="cp-head"><h3>Vecka '+vecka(k)+', '+a.namn+'</h3><button type="button" id="mod-stang" aria-label="Stäng">&#10005;</button></div>'+
      '<div class="modal-kropp">'+
      '<p class="delad-not">'+SVG('<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>')+
      'Kursen ärver bild, pris och beskrivning från anläggningen. Ändrar du något här gäller det bara den här veckan.</p>'+
      '<div class="form-grid">'+
        '<label class="ro"><span>Startdatum</span><input type="date" id="kf-datum" value="'+k.datum+'"></label>'+
        '<label class="ro"><span>Kursavgift, exkl. moms</span><input id="kf-pris" type="number" value="'+k.kurspris+'"></label>'+
      '</div>'+
      rad('Kost och logi, exkl. moms',ar.logi,'<input class="arv-falt" id="kf-logi" type="number" value="'+kLogi(k)+'">','logi')+
      rad('Bild för den här veckan',ar.bild,'<div class="arv-bild"><div id="kf-forhand">'+bildRuta(kBild(k),a.namn,'anl-stor')+'</div>'+
        '<input type="file" id="kf-bild" accept="image/*" class="fil-in"></div>','bild')+
      rad('Beskrivning',ar.text,'<textarea class="arv-falt" id="kf-text" rows="3" placeholder="Beskrivning som visas på kurssidan.">'+(kText(k)||'')+'</textarea>','text')+
      '</div>'+
      '<div class="modal-fot"><button class="button" id="kf-spara">Spara</button>'+
      '<button class="button button-outline-dark" id="kf-allt">Återställ allt till mallen</button></div></div></div>';
    var d=document.createElement('div');d.innerHTML=html;document.body.appendChild(d.firstChild);
    var nyBild=k.bild;
    document.getElementById('kf-bild').addEventListener('change',function(e){
      var f=e.target.files[0];if(!f)return;
      var r=new FileReader();r.onload=function(){nyBild=r.result;
        document.getElementById('kf-forhand').innerHTML='<span class="anl-bild anl-stor"><img src="'+nyBild+'" alt=""></span>'};
      r.readAsDataURL(f);
    });
    document.querySelectorAll('[data-ater]').forEach(function(b){b.addEventListener('click',function(){
      var f=b.getAttribute('data-ater');
      if(f==='logi')k.logi=null; if(f==='bild')k.bild=''; if(f==='text')k.text='';
      spara();stang();kursFormular(id);
    })});
    document.getElementById('kf-allt').addEventListener('click',function(){
      k.logi=null;k.bild='';k.text='';spara();stang();toast('Kursen följer mallen igen.');
    });
    document.getElementById('kf-spara').addEventListener('click',function(){
      k.datum=document.getElementById('kf-datum').value;
      k.kurspris=+document.getElementById('kf-pris').value;
      var logi=+document.getElementById('kf-logi').value;
      k.logi=(logi===a.logipris)?null:logi;
      k.bild=(nyBild===a.bild)?'':nyBild;
      var txt=document.getElementById('kf-text').value.trim();
      k.text=(txt===(a.text||''))?'':txt;
      spara();stang();toast('Kursen är sparad.');
    });
    document.getElementById('mod-stang').addEventListener('click',stang);
    function stang(){var m=document.querySelector('.modal');if(m)m.remove();rita()}
  }

  function koppla(){
    document.querySelectorAll('[data-publicera]').forEach(function(b){b.addEventListener('click',function(){
      var k=kurs(+b.getAttribute('data-publicera'));
      k.status='publicerad';spara();toast('Kursen är publicerad och syns i det publika utbudet.');rita();
    })});
    document.querySelectorAll('[data-redigera]').forEach(function(b){b.addEventListener('click',function(){
      kursFormular(+b.getAttribute('data-redigera'))})});
    document.querySelectorAll('[data-koppla]').forEach(function(b){b.addEventListener('click',function(){
      kopplaHandledare(+b.getAttribute('data-koppla'))})});
    document.querySelectorAll('[data-ja]').forEach(function(b){b.addEventListener('click',function(){
      var k=kurs(+b.getAttribute('data-ja'));
      k.handledare.filter(function(x){return x.hid===jagId})[0].status='bekraftad';
      spara();toast('Tack, uppdraget är bekräftat.');rita();
    })});
    document.querySelectorAll('[data-nej]').forEach(function(b){b.addEventListener('click',function(){
      var k=kurs(+b.getAttribute('data-nej'));
      k.handledare.filter(function(x){return x.hid===jagId})[0].status='nekad';
      spara();toast('Arrangören får besked om att du tackat nej.');rita();
    })});
    document.querySelectorAll('[data-detalj]').forEach(function(b){b.addEventListener('click',function(){
      var k=kurs(+b.getAttribute('data-detalj'));
      toast('Vecka '+vecka(k)+', '+k.anlaggning+', '+k.ort+'. '+k.bokade+' anmälda av '+k.max+'.');
    })});
    document.querySelectorAll('[data-vecka]').forEach(function(b){b.addEventListener('click',function(){
      var v=+b.getAttribute('data-vecka'),mig=hl(jagId),i=mig.lediga.indexOf(v);
      if(i>-1)mig.lediga.splice(i,1);else mig.lediga.push(v);
      spara();rita();
    })});
    document.querySelectorAll('[data-anl]').forEach(function(b){b.addEventListener('click',function(){
      anlFormular(+b.getAttribute('data-anl'))})});
    if($('ny-anl'))$('ny-anl').addEventListener('click',function(){anlFormular(0)});
    if($('nk-anl'))$('nk-anl').addEventListener('change',function(){
      var a=anlById(+$('nk-anl').value);
      if(a){$('nk-ort').value=a.ort;$('nk-logi').value=a.logipris}
    });
    if($('nk-sok')){
      var sok=function(){
        var q=$('nk-sok').value.trim().toLowerCase(),n=0;
        document.querySelectorAll('#nk-hl .valj-rad').forEach(function(r){
          var pa=!q||r.getAttribute('data-namn').indexOf(q)>-1;
          r.hidden=!pa;if(pa)n++;
        });
        $('nk-traffar').textContent=q?(n===1?'1 handledare matchar':n+' handledare matchar'):'';
      };
      $('nk-sok').addEventListener('input',sok);
    }
    if($('nk-publicera'))$('nk-publicera').addEventListener('click',function(){nyKurs(true)});
    if($('nk-utkast'))$('nk-utkast').addEventListener('click',function(){nyKurs(false)});
    if($('pr-spara'))$('pr-spara').addEventListener('click',function(){
      var mig=hl(jagId);mig.roll=$('pr-roll').value;mig.text=$('pr-text').value;
      spara();toast('Profilen är sparad och används på kurssidorna.');rita();
    });
    if($('pr-bild'))$('pr-bild').addEventListener('change',function(e){
      var f=e.target.files[0];if(!f)return;
      var r=new FileReader();r.onload=function(){hl(jagId).bild=r.result;spara();toast('Porträttet är uppladdat.');rita()};
      r.readAsDataURL(f);
    });
    if($('ny-hl'))$('ny-hl').addEventListener('click',function(){
      var n=prompt('Namn på handledaren');if(!n)return;
      var e=prompt('E-post')||'';
      S.handledare.push({id:nastaId++,namn:n,roll:'UGL-handledare',epost:e,cert:'',text:'',bild:'',lediga:[]});
      spara();toast('Inbjudan skickad.');rita();
    });
    if($('nollstall'))$('nollstall').addEventListener('click',function(){nollstall();toast('Demodata återställd.');rita(MENY[roll][0][0])});
  }
  function nyKurs(publicera){
    var aid=+$('nk-anl').value;
    if(!aid){toast('Välj anläggning.');return}
    var a=anlById(aid);
    var valda=[].slice.call(document.querySelectorAll('#nk-hl input:checked')).map(function(c){return +c.value});
    S.kurser.push({id:nastaId++,datum:$('nk-datum').value,anlId:aid,anlaggning:a.namn,ort:a.ort,
      kurspris:+$('nk-pris').value,logi:null,bild:'',text:'',max:12,bokade:0,
      status:publicera?'publicerad':'utkast',
      handledare:valda.map(function(h){return {hid:h,status:'tillfragad'}})});
    spara();
    toast(publicera?'Kursen är publicerad. Handledarna har fått förfrågan.':'Kursen är sparad som utkast.');
    rita('kurser');
  }

  /* ---------- Inloggning ---------- */
  $('login-form').addEventListener('submit',function(e){
    e.preventDefault();
    S=las()||JSON.parse(JSON.stringify(DEMO));spara();
    roll=document.querySelector('input[name=roll]:checked').value;
    var ep=$('log-epost').value.trim();
    if(roll==='arrangor'&&ep&&ep.indexOf('@')>0){
      var dom=ep.split('@')[1].split('.')[0];
      S.arrangor.namn=dom.charAt(0).toUpperCase()+dom.slice(1);
      S.arrangor.kort=dom.slice(0,2).toUpperCase();
      S.arrangor.epost=ep;spara();
    }
    var jag=roll==='arrangor'?{namn:S.arrangor.kontakt,roll:'Kursansvarig'}:{namn:hl(jagId).namn,roll:'UGL-handledare'};
    $('kund-logga').textContent=roll==='arrangor'?S.arrangor.kort:init(hl(jagId).namn);
    $('kund-namn').textContent=roll==='arrangor'?S.arrangor.namn:hl(jagId).namn;
    $('kund-typ').textContent=roll==='arrangor'?'Arrangörsportal, UGL Sverige':'Handledarportal, uppdrag hos '+S.arrangor.namn;
    $('anv-namn').textContent=jag.namn;$('anv-roll').textContent=jag.roll;$('anv-init').textContent=init(jag.namn);
    $('login').hidden=true;$('app').hidden=false;
    ritaMeny();rita(MENY[roll][0][0]);
  });
  $('logga-ut').addEventListener('click',function(){$('app').hidden=true;$('login').hidden=false});
  $('notis-knapp').addEventListener('click',function(){$('notis-panel').hidden=!$('notis-panel').hidden});
  $('notis-stang').addEventListener('click',function(){$('notis-panel').hidden=true});
  window.addEventListener('hashchange',function(){if(!$('app').hidden)rita()});
})();
