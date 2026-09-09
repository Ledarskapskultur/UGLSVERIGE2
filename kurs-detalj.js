(function(){
  var MANADER=['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'];
  var BILDER=['ugl-grupp.webp','ugl-samtal.webp','ugl-tid.webp','ugl-feedback.webp','ugl-oppenhet.webp','ugl-upplevelse.webp','ugl-handledare.webp','ugl-hero.webp'];
  var REGIONER={'Stockholm':'Stockholm','Lidingö':'Stockholm','Täby':'Stockholm','Värmdö':'Stockholm','Nacka Strand, Stockholm':'Stockholm',
                'Helsingborg':'Skåne','Kristianstad':'Skåne','Halmstad':'Halland','Göteborg':'Västra Götaland','Mölnlycke':'Västra Götaland',
                'Jönköping':'Jönköping','Sundsvall/Timrå':'Västernorrland'};
  function fmt(d){return d.getDate()+' '+MANADER[d.getMonth()]}
  function kr(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' kr'}
  function hash(s){var h=0;for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))|0;return Math.abs(h)}
  function slug(s){return s.toLowerCase().replace(/[åä]/g,'a').replace(/ö/g,'o').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  var SVG=function(d){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'};

  var kurser=window.UGL_RADER.split('\n').map(function(rad){
    var d=rad.split('|'),start=new Date(d[0]+'T00:00:00'),slut=new Date(start.getTime()+4*864e5),logi=+d[5],kurspris=d[7]?+d[7]:window.UGL_KURSPRIS,samlat=!logi&&!!d[7];
    return {start:start,slut:slut,vecka:+d[1],anlaggning:d[2],ort:d[3],region:REGIONER[d[3]]||d[3],
      handledare:d[4]?d[4].split(';'):[],kurspris:kurspris,logi:logi,samlat:samlat,total:logi?kurspris+logi:(samlat?kurspris:0),ledig:d[6]==='L',
      bild:'assets/'+BILDER[hash(d[2]+d[3])%BILDER.length],
      period:fmt(start)+' till '+fmt(slut)+' '+slut.getFullYear(),
      nyckel:d[0]+'-'+slug(d[2])};
  });

  var nyckel=new URLSearchParams(location.search).get('k');
  var k=kurser.filter(function(x){return x.nyckel===nyckel})[0];
  if(!k){location.replace('/kurser');return}

  var etikett='Vecka '+k.vecka+', '+k.period+', '+k.anlaggning+', '+k.ort;
  document.title='UGL vecka '+k.vecka+' på '+k.anlaggning+' | UGL Sverige';
  document.getElementById('bs-region').textContent=k.region;
  document.getElementById('bs-vecka').textContent='Vecka '+k.vecka;
  document.getElementById('k-rubrik').textContent='UGL vecka '+k.vecka+' på '+k.anlaggning;
  document.getElementById('k-bild').src=k.bild;
  document.getElementById('k-bildtext').textContent='Bilden är från en UGL-vecka och visar inte '+k.anlaggning+'.';
  document.getElementById('k-meta').innerHTML=
    '<span>'+SVG('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>')+k.period+'</span>'+
    '<span>'+SVG('<path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>')+k.anlaggning+', '+k.ort+'</span>'+
    '<span>'+SVG('<circle cx="9" cy="8" r="3"/><path d="M2 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5"/><path d="M17 11h5M19.5 8.5v5"/>')+'8 till 12 deltagare</span>'+
    '<span class="'+(k.ledig?'meta-ledig':'meta-full')+'">'+(k.ledig?'Lediga platser':'Fullbokad')+'</span>';

  document.getElementById('k-ingar').innerHTML=[
    ['Fem kursdagar',SVG('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>')],
    ['Boende fyra nätter',SVG('<path d="M3 18v-7h18v7"/><path d="M3 11V7a1 1 0 0 1 1-1h6v5"/><path d="M21 18v2M3 18v2"/>')],
    ['Alla måltider',SVG('<path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10"/><path d="M17 3c-1.5 1.5-2 3-2 5s.5 2.5 2 2.5V21"/>')],
    ['Kursmaterial',SVG('<path d="M5 4h11l3 3v13H5z"/><path d="M8 10h8M8 14h6"/>')],
    ['Två handledare',SVG('<circle cx="9" cy="8" r="3"/><path d="M2 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5"/><path d="M16 5.5a3 3 0 0 1 0 5"/>')],
    ['Intyg efter kursen',SVG('<circle cx="12" cy="9" r="5"/><path d="M9 14l-1 7 4-2 4 2-1-7"/>')]
  ].map(function(i){return '<li>'+i[1]+'<span>'+i[0]+'</span></li>'}).join('');

  var REG=window.UGL_HANDLEDARE||{};
  var harProfil=false;
  document.getElementById('k-handledare').innerHTML=k.handledare.length
    ? k.handledare.map(function(n){
        var p=REG[n],init=n.split(' ').map(function(w){return w[0]}).slice(0,2).join('');
        var bild=p&&p.bild?'<img src="assets/'+p.bild+'" alt="Porträtt av '+n+'">':'<span class="hl-init">'+init+'</span>';
        var roll=p&&p.roll?p.roll:'UGL-handledare, utbildad av Försvarshögskolan';
        if(p&&p.text)harProfil=true;
        return '<article class="'+(p&&p.text?'hl-full':'')+'">'+
          '<figure class="hl-bild">'+bild+'</figure>'+
          '<div><strong>'+n+'</strong><span class="hl-roll">'+roll+'</span>'+
          (p&&p.text?'<p class="hl-text">'+p.text+'</p>':'')+'</div></article>'}).join('')
    : '<p class="handledare-tom">Handledarna för den här veckan meddelas senare. Hör av dig om du vill veta så snart de är satta.</p>';
  if(harProfil){
    var not=document.createElement('p');
    not.className='demo-note';
    not.textContent='Presentationerna är utkast sammanställda av oss och publiceras i sin slutliga form när handledaren godkänt texten och lämnat porträtt.';
    document.querySelector('.handledare-not').after(not);
  }

  document.getElementById('kp-vecka').textContent='UGL vecka '+k.vecka;
  document.getElementById('kp-pris').textContent=k.total?kr(k.total):'Pris meddelas';
  document.getElementById('kp-split').innerHTML=
    k.samlat ? '<div><dt>Kurs, kost och logi</dt><dd>Ingår</dd></div><div class="kp-tot"><dt>Totalpris</dt><dd>'+kr(k.total)+'</dd></div>'
    : k.total ? '<div><dt>Kurs</dt><dd>'+kr(k.kurspris)+'</dd></div><div><dt>Kost och logi</dt><dd>'+kr(k.logi)+'</dd></div><div class="kp-tot"><dt>Totalpris</dt><dd>'+kr(k.total)+'</dd></div>'
    : '<div><dt>Kurs</dt><dd>'+kr(k.kurspris)+'</dd></div><div><dt>Kost och logi</dt><dd>Meddelas</dd></div>';
  var cta=document.getElementById('kp-cta');
  cta.href='/kurser?valj='+encodeURIComponent(k.ledig?etikett:'Intresselista')+'#anmalan';
  if(!k.ledig){cta.textContent='Bevaka veckan →';document.querySelector('.kp-ingar').textContent='Veckan är fullbokad. Vi hör av oss om en plats blir ledig.'}
})();
