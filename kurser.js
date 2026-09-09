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
            person:SVG('<circle cx="12" cy="8" r="3.4"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/>')};
  function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}

  var kurser=window.UGL_RADER.split('\n').map(function(rad,i){
    var d=rad.split('|'),start=new Date(d[0]+'T00:00:00'),slut=new Date(start.getTime()+4*864e5),logi=+d[5];
    return {id:i,start:start,slut:slut,vecka:+d[1],anlaggning:d[2],ort:d[3],
      region:REGIONER[d[3]]||d[3],
      handledare:d[4]?d[4].split(';'):[],logi:logi,total:logi?window.UGL_KURSPRIS+logi:0,
      ledig:d[6]==='L',
      bild:'assets/'+BILDER[hash(d[2]+d[3])%BILDER.length],
      period:fmt(start)+' till '+fmt(slut)+' '+slut.getFullYear(),
      manad:start.getFullYear()+'-'+String(start.getMonth()+1).padStart(2,'0')};
  }).sort(function(a,b){return a.start-b.start});

  var $=function(id){return document.getElementById(id)};
  var lista=$('kurslista'),raknare=$('kursraknare'),fTid=$('filter-tid'),fRegion=$('filter-region'),
      fOrt=$('filter-ort'),fPris=$('filter-pris'),fLedig=$('filter-ledig'),fSort=$('filter-sort'),
      merKnapp=$('visa-fler'),select=$('kurs'),bar=$('jamforbar'),panel=$('jamforpanel'),
      visade=6,valda=[];

  function fyll(el,varden,etikett){varden.forEach(function(v){
    el.insertAdjacentHTML('beforeend','<option value="'+v[0]+'">'+v[1]+'</option>')})}
  fyll(fTid,[...new Set(kurser.map(function(k){return k.manad}))].map(function(m){
    var d=new Date(m+'-01T00:00:00');return [m,MANADER[d.getMonth()]+' '+d.getFullYear()]}));
  fyll(fRegion,[...new Set(kurser.map(function(k){return k.region}))].sort(function(a,b){return a.localeCompare(b,'sv')}).map(function(r){return [r,r]}));
  fyll(fOrt,[...new Set(kurser.map(function(k){return k.ort}))].sort(function(a,b){return a.localeCompare(b,'sv')}).map(function(o){return [o,o]}));

  function filtrerade(){
    var f=kurser.filter(function(k){
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
  function lank(k){return 'kurs?k='+k.start.toISOString().slice(0,10)+'-'+slug(k.anlaggning)}
  function etikett(k){return 'Vecka '+k.vecka+', '+k.period+', '+k.anlaggning+', '+k.ort}

  function rita(){
    var f=filtrerade();
    raknare.innerHTML='<b>'+f.length+'</b> '+(f.length===1?'kurs':'kurser');
    var billigast=null,narmast=f.length?f[0].id:null;
    f.forEach(function(k){if(k.total&&(!billigast||k.total<billigast.total))billigast=k});
    lista.innerHTML=f.slice(0,visade).map(function(k){
      var mark = k.id===narmast ? '<figcaption class="mark">Närmast i tiden</figcaption>'
               : (billigast&&k.id===billigast.id ? '<figcaption class="mark mark-pris">Lägst totalpris</figcaption>' : '');
      var pris=k.total
        ? '<strong>'+kr(k.total)+'</strong><span>Kurs '+kr(window.UGL_KURSPRIS)+' och kost och logi '+kr(k.logi)+'</span>'
        : '<strong>Pris meddelas</strong><span>Kontakta oss för uppgift</span>';
      var hl=k.handledare.length?k.handledare.join(' och '):'Handledare meddelas senare';
      var vald=valda.indexOf(k.id)>-1;
      return '<li class="kort'+(k.ledig?'':' is-full')+'">'+
        '<figure><img src="'+k.bild+'" alt="Deltagare under en UGL-vecka" loading="lazy">'+
          (k.ledig?mark:'<figcaption>Fullbokad</figcaption>')+'</figure>'+
        '<div class="kort-mitt">'+
          '<h3>Vecka '+k.vecka+'</h3>'+
          '<p class="kort-rad">'+IKON.kalender+k.period+'</p>'+
          '<p class="kort-rad">'+IKON.plats+k.anlaggning+', '+k.ort+'</p>'+
          '<p class="kort-rad kort-hl">'+IKON.person+hl+'</p>'+
        '</div>'+
        '<div class="kort-pris">'+pris+'<span class="kort-ingar">Fem dagar, internat och kursmaterial</span></div>'+
        '<div class="kort-val">'+
          '<label class="jamfor"><input type="checkbox" data-jamfor="'+k.id+'"'+(vald?' checked':'')+'> Jämför</label>'+
          (k.ledig
            ? '<a class="button button-small" href="'+lank(k)+'">Se kursen &#8594;</a>'
            : '<a class="mini-link" href="#anmalan" data-kurs="Intresselista">Bevaka veckan</a>')+
        '</div>'+
      '</li>';
    }).join('');
    merKnapp.hidden=f.length<=visade;
    merKnapp.textContent='Visa fler ('+Math.max(f.length-visade,0)+' till)';
    lista.querySelectorAll('[data-kurs]').forEach(function(a){
      a.addEventListener('click',function(){valjKurs(a.getAttribute('data-kurs'))})});
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
    bar.hidden=valda.length===0;
  }

  function ritaJamfor(){
    var v=valda.map(function(id){return kurser.filter(function(k){return k.id===id})[0]});
    var rader=[
      ['Vecka',function(k){return 'Vecka '+k.vecka}],
      ['Datum',function(k){return k.period}],
      ['Anläggning',function(k){return k.anlaggning}],
      ['Ort',function(k){return k.ort+' ('+k.region+')'}],
      ['Handledare',function(k){return k.handledare.length?k.handledare.join(', '):'Meddelas senare'}],
      ['Kurspris',function(k){return kr(window.UGL_KURSPRIS)}],
      ['Kost och logi',function(k){return k.logi?kr(k.logi):'Meddelas'}],
      ['Totalt',function(k){return k.total?'<b>'+kr(k.total)+'</b>':'Meddelas'}],
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
  merKnapp.addEventListener('click',function(){visade+=6;rita()});
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
    [fTid,fRegion,fOrt,fPris,fSort].forEach(function(el){el.selectedIndex=0});
    fLedig.checked=true;
    document.querySelectorAll('[data-quick]').forEach(function(x){x.classList.remove('is-on')});
    visade=6;rita();
  });
  $('cb-oppna').addEventListener('click',ritaJamfor);
  $('cp-stang').addEventListener('click',function(){panel.hidden=true});
  $('cb-rensa').addEventListener('click',function(){valda=[];ritaBar();rita()});
  var q=new URLSearchParams(location.search).get('valj');
  if(q)valjKurs(q);
  rita();ritaBar();

  var ENDPOINT='';
  var MOTTAGARE='kontakt@uglsverige.se';
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
