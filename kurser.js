(function(){
  var MANADER=['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'];
  function fmtDate(d){return d.getDate()+' '+MANADER[d.getMonth()]}
  function kr(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' kr'}
  var kurser=window.UGL_RADER.split('\n').map(function(rad){
    var d=rad.split('|'),start=new Date(d[0]+'T00:00:00'),slut=new Date(start.getTime()+4*864e5);
    return {start:start,slut:slut,vecka:+d[1],anlaggning:d[2],ort:d[3],
            handledare:d[4]?d[4].split(';'):[],logi:+d[5],ledig:d[6]==='L',
            period:fmtDate(start)+' till '+fmtDate(slut)+' '+slut.getFullYear()};
  }).sort(function(a,b){return a.start-b.start});

  var lista=document.getElementById('kurslista'),
      raknare=document.getElementById('kursraknare'),
      fOrt=document.getElementById('filter-ort'),
      fTid=document.getElementById('filter-tid'),
      fLedig=document.getElementById('filter-ledig'),
      merKnapp=document.getElementById('visa-fler'),
      select=document.getElementById('kurs'),
      visade=8;

  [...new Set(kurser.map(function(k){return k.ort}))].sort(function(a,b){return a.localeCompare(b,'sv')})
    .forEach(function(o){fOrt.insertAdjacentHTML('beforeend','<option value="'+o+'">'+o+'</option>')});
  [...new Set(kurser.map(function(k){return k.start.getFullYear()+'-'+String(k.start.getMonth()+1).padStart(2,'0')}))]
    .forEach(function(m){var d=new Date(m+'-01T00:00:00');
      fTid.insertAdjacentHTML('beforeend','<option value="'+m+'">'+MANADER[d.getMonth()]+' '+d.getFullYear()+'</option>')});

  function filtrerade(){
    return kurser.filter(function(k){
      if(fOrt.value&&k.ort!==fOrt.value)return false;
      if(fTid.value&&(k.start.getFullYear()+'-'+String(k.start.getMonth()+1).padStart(2,'0'))!==fTid.value)return false;
      if(fLedig.checked&&!k.ledig)return false;
      return true;
    });
  }

  function etikett(k){return 'Vecka '+k.vecka+', '+k.period+', '+k.anlaggning+', '+k.ort}

  function rita(){
    var f=filtrerade();
    raknare.textContent=f.length+(f.length===1?' kurstillfälle':' kurstillfällen');
    lista.innerHTML=f.slice(0,visade).map(function(k){
      var pris=k.logi?'<strong>'+kr(window.UGL_KURSPRIS)+'</strong><span>+ kost och logi '+kr(k.logi)+'</span>'
                     :'<strong>Pris meddelas</strong><span>Kontakta oss för uppgift</span>';
      var hl=k.handledare.length?k.handledare.join(' och '):'Handledare meddelas senare';
      return '<li class="'+(k.ledig?'':'is-full')+'">'+
        '<div class="cl-date"><b>'+k.period+'</b><span>Vecka '+k.vecka+'</span></div>'+
        '<div class="cl-place"><strong>'+k.anlaggning+'</strong><span>'+k.ort+'</span></div>'+
        '<div class="cl-people"><span>'+hl+'</span></div>'+
        '<div class="cl-price">'+pris+'</div>'+
        '<div class="cl-status">'+(k.ledig
          ? '<a class="button-row" href="#anmalan" data-kurs="'+etikett(k)+'">Anmäl dig</a>'
          : '<span class="badge badge-full">Fullbokad</span><a class="mini-link" href="#anmalan" data-kurs="Intresselista">Bevaka</a>')+'</div>'+
      '</li>';
    }).join('');
    merKnapp.hidden=f.length<=visade;
    merKnapp.textContent='Visa fler ('+(f.length-visade)+' till)';
    lista.querySelectorAll('[data-kurs]').forEach(function(a){
      a.addEventListener('click',function(){valjKurs(a.getAttribute('data-kurs'))});
    });
  }

  function valjKurs(v){
    var finns=false;
    for(var i=0;i<select.options.length;i++){if(select.options[i].value===v){select.selectedIndex=i;finns=true}}
    if(!finns){var o=new Option(v,v,true,true);select.add(o,1)}
  }

  kurser.filter(function(k){return k.ledig}).slice(0,60).forEach(function(k){
    select.insertAdjacentHTML('beforeend','<option value="'+etikett(k)+'">'+etikett(k)+'</option>');
  });
  select.insertAdjacentHTML('beforeend','<option value="Intresselista">Intresselista, jag väntar på nya datum</option>');

  [fOrt,fTid].forEach(function(el){el.addEventListener('change',function(){visade=8;rita()})});
  fLedig.addEventListener('change',function(){visade=8;rita()});
  merKnapp.addEventListener('click',function(){visade+=12;rita()});
  rita();

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
