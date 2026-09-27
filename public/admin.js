(function(){
  var BYGGE='3';
  var MANADER=['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'];
  var KORT=['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'];
  function kr(n){return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ')+' kr'}
  function init(n){return n.split(' ').map(function(w){return w[0]}).slice(0,2).join('').toUpperCase()}
  function veckoNr(d){var t=new Date(d.getTime());t.setHours(0,0,0,0);t.setDate(t.getDate()+3-((t.getDay()+6)%7));
    var v=new Date(t.getFullYear(),0,4);return 1+Math.round(((t-v)/864e5-3+((v.getDay()+6)%7))/7)}
  function vecka(datum){return veckoNr(new Date(datum+'T00:00:00'))}
  function period(datum){var s=new Date(datum+'T00:00:00'),e=new Date(s.getTime()+4*864e5);
    return s.getDate()+' till '+e.getDate()+' '+KORT[e.getMonth()]+' '+e.getFullYear()}
  function dat(d){var x=new Date(d+'T00:00:00');return x.getDate()+' '+KORT[x.getMonth()]+' '+x.getFullYear()}
  function idagISO(){var d=new Date();return d.toISOString().slice(0,10)}
  function dagarSedan(d){return Math.round((new Date()-new Date(d+'T00:00:00'))/864e5)}
  function dagar(x){return x+' '+(Math.abs(x)===1?'dag':'dagar')}
  var SVG=function(d){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>'};
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

  var KSTATUS={aktiv:['Aktiv','st-bekraftad'],inbjuden:['Inbjuden','st-utkast'],pausad:['Pausad','st-ingen']};
  var ASTATUS={aktivt:['Aktivt','st-bekraftad'],signering:['Väntar signering','st-forfragan'],utkast:['Utkast','st-utkast'],uppsagt:['Uppsagt','st-ingen']};
  var GSTATUS={vantar:['Väntar granskning','st-forfragan'],godkand:['Godkänd','st-bekraftad'],nekad:['Nekad','st-ingen']};
  var ISTATUS={skickad:['Skickad','st-utkast'],oppnad:['Öppnad','st-forfragan'],aktiverad:['Aktiverad','st-bekraftad'],utgangen:['Utgången','st-ingen']};
  var LSTATUS={ny:['Ny','st-forfragan'],kontaktad:['Kontaktad','st-utkast'],vunnen:['Bokad','st-bekraftad'],tappad:['Tappad','st-ingen']};
  var FSTATUS={utkast:['Underlag','st-utkast'],skickad:['Skickad','st-forfragan'],betald:['Betald','st-bekraftad'],forfallen:['Förfallen','st-ingen']};
  var LTYP={intresse:'Intresselista',chef:'Skickat till chef',bokning:'Bokningsförfrågan'};
  var KALLA={linkedin:'LinkedIn',google:'Google',nyhetsbrev:'Nyhetsbrev',rekommendation:'Rekommendation',
             massa:'Mässa och event',chefsutskick:'Skickat till chef',arbetsgivarportal:'Arbetsgivarportal',direkt:'Direkt till sajten'};
  var KANAL={webb:'Webbformulär',mejl:'Mejl',telefon:'Telefon',mote:'Möte',linkedin:'LinkedIn',nyhetsbrev:'Nyhetsbrev'};
  var KANALIKON={webb:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>',
    mejl:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/>',
    telefon:'<path d="M5 3.5h3.5l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5V18a2.5 2.5 0 0 1-2.7 2.5C10.6 20 4 13.4 3.5 6.2A2.5 2.5 0 0 1 5 3.5z"/>',
    mote:'<circle cx="9" cy="9" r="2.6"/><circle cx="16.5" cy="10" r="2.1"/><path d="M3 19c0-2.7 2.7-4.3 6-4.3s6 1.6 6 4.3M16 14.9c2.6.2 5 1.7 5 4.1"/>',
    linkedin:'<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M8 10v7M8 7.2v.1M12 17v-4a2 2 0 0 1 4 0v4"/>',
    nyhetsbrev:'<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5"/>'};
  var ITYP={arrangor:'Arrangör',foretag:'Arbetsgivare',anlaggning:'Anläggning',admin:'Admin'};

  var MALLAR=[
    {namn:'Standard',provision:12,avgift:0,text:'Tolv procent på kursavgiften, ingen fast avgift.'},
    {namn:'Partner',provision:9,avgift:1500,text:'Nio procent plus 1 500 kr per månad. För arrangörer med många veckor.'},
    {namn:'Uppstart',provision:15,avgift:0,text:'Femton procent första året, ingen bindningstid.'}
  ];

  /* ---------- Demodata ---------- */
  var DEMO={
    plattform:{namn:'UGL Sverige',kort:'US',epost:'info@uglsverige.store'},
    jag:{namn:'Carl-Fredrik Zettermark',roll:'Plattformsansvarig'},
    arrangorer:[
      {id:1,namn:'Rezon',kort:'RE',orgnr:'556123-4567',ort:'Stockholm',kontakt:'Maria Ek',epost:'maria@rezon.se',telefon:'08-123 45 67',status:'aktiv',sedan:'2025-01-15',
       avtal:{mall:'Standard',provision:12,avgift:0,start:'2026-01-01',slut:'2026-12-31',uppsagning:'3 månader',status:'aktivt'}},
      {id:2,namn:'CoreCode',kort:'CC',orgnr:'556987-1234',ort:'Göteborg',kontakt:'Anders Holm',epost:'anders@corecode.se',telefon:'031-22 33 44',status:'aktiv',sedan:'2025-04-02',
       avtal:{mall:'Partner',provision:9,avgift:1500,start:'2026-02-01',slut:'2027-01-31',uppsagning:'3 månader',status:'aktivt'}},
      {id:3,namn:'Coach Kröger',kort:'CK',orgnr:'559321-8765',ort:'Jönköping',kontakt:'Michael Kröger',epost:'michael@coachkroger.com',telefon:'036-55 66 77',status:'aktiv',sedan:'2026-02-10',
       avtal:{mall:'Uppstart',provision:15,avgift:0,start:'2026-03-01',slut:'2027-02-28',uppsagning:'1 månad',status:'aktivt'}},
      {id:4,namn:'Nordlys Utveckling AB',kort:'NU',orgnr:'559444-2211',ort:'Umeå',kontakt:'Petra Lund',epost:'petra@nordlys.se',telefon:'090-11 22 33',status:'inbjuden',sedan:'2026-08-28',
       avtal:{mall:'Standard',provision:12,avgift:0,start:'2026-10-01',slut:'2027-09-30',uppsagning:'3 månader',status:'signering'}}
    ],
    granskning:[
      {id:1,aid:1,datum:'2027-01-18',anlaggning:'Villa Lovik',ort:'Stockholm',kurspris:23900,logi:9900,handledare:'Anna Falk, Robert Koss',skickad:'2026-09-04',status:'vantar'},
      {id:2,aid:3,datum:'2027-02-08',anlaggning:'Mullsjö',ort:'Jönköping',kurspris:28750,logi:0,handledare:'Annika Banfield, Michael Kröger',skickad:'2026-09-05',status:'vantar'},
      {id:3,aid:2,datum:'2026-11-30',anlaggning:'Tanumstrand',ort:'Tanumshede',kurspris:24500,logi:9200,handledare:'Ej kopplade än',skickad:'2026-09-01',status:'vantar'}
    ],
    foretag:[
      {id:1,namn:'Nordvik Industri AB',orgnr:'556777-1122',ort:'Sundsvall',kontakt:'Karin Ek',epost:'karin.ek@nordvikindustri.se',anstallda:180,bokade:6,status:'aktiv',sedan:'2025-09-12'},
      {id:2,namn:'Almvik Kommun',orgnr:'212000-1234',ort:'Almvik',kontakt:'Sofia Berg',epost:'sofia.berg@almvik.se',anstallda:2100,bokade:11,status:'aktiv',sedan:'2025-11-03'},
      {id:3,namn:'Sydkraft Bygg',orgnr:'556333-9988',ort:'Malmö',kontakt:'Jonas Ahl',epost:'jonas@sydkraftbygg.se',anstallda:64,bokade:2,status:'aktiv',sedan:'2026-03-19'},
      {id:4,namn:'Vinga Vård',orgnr:'556212-3344',ort:'Göteborg',kontakt:'Lisa Norén',epost:'lisa@vingavard.se',anstallda:340,bokade:0,status:'inbjuden',sedan:'2026-09-01'}
    ],
    leads:[
      {id:1,namn:'Elin Sandberg',epost:'elin.sandberg@nordvikindustri.se',telefon:'070-111 22 33',roll:'Produktionschef',org:'Nordvik Industri AB',bransch:'Industri',storlek:'100-499',
       kalla:'linkedin',kampanj:'Höstkampanj UGL 2026',typ:'intresse',kurs:'Vecka 41, Tylebäck',kursdatum:'2026-10-05',
       datum:'2026-08-19',status:'kontaktad',bokad:'',varde:32800,agare:'Carl-Fredrik',not:'Vill gå tillsammans med en kollega, förklarat främlingsgrupp.',
       kontakter:[{d:'2026-08-19',kanal:'webb',riktning:'in',not:'Anmälde intresse på kurssidan'},
                  {d:'2026-08-20',kanal:'mejl',riktning:'ut',not:'Skickade veckoöversikt och tre datum'},
                  {d:'2026-08-27',kanal:'telefon',riktning:'ut',not:'Kort samtal, vill stämma av med sin chef'}]},
      {id:2,namn:'Marcus Ohlin',epost:'marcus.ohlin@almvik.se',telefon:'070-222 33 44',roll:'HR-partner',org:'Almvik Kommun',bransch:'Offentlig sektor',storlek:'500+',
       kalla:'chefsutskick',kampanj:'',typ:'chef',kurs:'Vecka 45, Ringenäs',kursdatum:'2026-11-02',
       datum:'2026-09-02',status:'ny',bokad:'',varde:33400,agare:'Carl-Fredrik',not:'',
       kontakter:[{d:'2026-09-02',kanal:'webb',riktning:'in',not:'En medarbetare skickade kursen till hen'}]},
      {id:3,namn:'Sara Bergqvist',epost:'sara@vingavard.se',telefon:'070-333 44 55',roll:'Verksamhetschef',org:'Vinga Vård',bransch:'Vård och omsorg',storlek:'100-499',
       kalla:'google',kampanj:'Sök UGL kurs',typ:'bokning',kurs:'Vecka 43, Lovik',kursdatum:'2026-10-19',
       datum:'2026-08-11',status:'kontaktad',bokad:'',varde:33800,agare:'Carl-Fredrik',not:'Vill veta om resa ingår.',
       kontakter:[{d:'2026-08-11',kanal:'webb',riktning:'in',not:'Bokningsförfrågan via formulär'},
                  {d:'2026-08-12',kanal:'mejl',riktning:'ut',not:'Bekräftade förfrågan och skickade praktisk info'},
                  {d:'2026-08-18',kanal:'mote',riktning:'ut',not:'Digitalt möte om upplägget'},
                  {d:'2026-08-30',kanal:'mejl',riktning:'in',not:'Frågade om resa och boende'}]},
      {id:4,namn:'Peter Lund',epost:'peter.lund@sydkraftbygg.se',telefon:'070-444 55 66',roll:'Platschef',org:'Sydkraft Bygg',bransch:'Bygg',storlek:'20-99',
       kalla:'rekommendation',kampanj:'',typ:'intresse',kurs:'Vecka 50, Hagastrand',kursdatum:'2026-12-07',
       datum:'2026-07-28',status:'vunnen',bokad:'2026-08-27',varde:68800,agare:'Carl-Fredrik',not:'Bokade två platser.',
       kontakter:[{d:'2026-07-28',kanal:'telefon',riktning:'in',not:'Ringde efter tips från kollega som gått UGL'},
                  {d:'2026-07-29',kanal:'mejl',riktning:'ut',not:'Skickade datum och prisbild'},
                  {d:'2026-08-14',kanal:'mote',riktning:'ut',not:'Möte med honom och HR'},
                  {d:'2026-08-27',kanal:'mejl',riktning:'in',not:'Bokade två platser'}]},
      {id:5,namn:'Amina Yusuf',epost:'amina.yusuf@almvik.se',telefon:'',roll:'Enhetschef',org:'Almvik Kommun',bransch:'Offentlig sektor',storlek:'500+',
       kalla:'nyhetsbrev',kampanj:'Nyhetsbrev augusti',typ:'intresse',kurs:'Vecka 3, Villa Lovik',kursdatum:'2027-01-18',
       datum:'2026-08-25',status:'ny',bokad:'',varde:33800,agare:'Carl-Fredrik',not:'',
       kontakter:[{d:'2026-08-25',kanal:'webb',riktning:'in',not:'Klickade i nyhetsbrevet och anmälde intresse'}]},
      {id:6,namn:'Johan Lind',epost:'johan.lind@nordvikindustri.se',telefon:'070-555 66 77',roll:'Teamledare',org:'Nordvik Industri AB',bransch:'Industri',storlek:'100-499',
       kalla:'arbetsgivarportal',kampanj:'',typ:'bokning',kurs:'Vecka 41, Tylebäck',kursdatum:'2026-10-05',
       datum:'2026-06-02',status:'vunnen',bokad:'2026-06-16',varde:32800,agare:'Carl-Fredrik',not:'HR planerade in honom i portalen.',
       kontakter:[{d:'2026-06-02',kanal:'webb',riktning:'in',not:'HR lade in honom i planeringen'},
                  {d:'2026-06-03',kanal:'mejl',riktning:'ut',not:'Välkomstinfo till deltagaren'},
                  {d:'2026-06-16',kanal:'mejl',riktning:'in',not:'Bekräftade platsen'}]},
      {id:7,namn:'Petra Sjöqvist',epost:'petra.sjoqvist@almvik.se',telefon:'070-666 77 88',roll:'Avdelningschef',org:'Almvik Kommun',bransch:'Offentlig sektor',storlek:'500+',
       kalla:'linkedin',kampanj:'Höstkampanj UGL 2026',typ:'intresse',kurs:'Vecka 42, Skogshem & Wijk',kursdatum:'2026-10-12',
       datum:'2026-05-14',status:'vunnen',bokad:'2026-07-01',varde:33800,agare:'Carl-Fredrik',not:'Lång process, budget föll på plats i juni.',
       kontakter:[{d:'2026-05-14',kanal:'linkedin',riktning:'in',not:'Kommenterade ett inlägg och bad om info'},
                  {d:'2026-05-15',kanal:'mejl',riktning:'ut',not:'Skickade kursbeskrivning'},
                  {d:'2026-05-28',kanal:'telefon',riktning:'ut',not:'Uppföljning, väntar på budget'},
                  {d:'2026-06-18',kanal:'mejl',riktning:'ut',not:'Påminnelse med två lediga veckor'},
                  {d:'2026-07-01',kanal:'telefon',riktning:'in',not:'Bokade plats'}]},
      {id:8,namn:'Nadia Rahimi',epost:'nadia.rahimi@nordvikindustri.se',telefon:'',roll:'Projektledare',org:'Nordvik Industri AB',bransch:'Industri',storlek:'100-499',
       kalla:'google',kampanj:'Sök UGL kurs',typ:'intresse',kurs:'Vecka 43, Lovik',kursdatum:'2026-10-19',
       datum:'2026-08-05',status:'tappad',bokad:'',varde:0,agare:'Carl-Fredrik',not:'Valde en intern utbildning i stället.',
       kontakter:[{d:'2026-08-05',kanal:'webb',riktning:'in',not:'Anmälde intresse'},
                  {d:'2026-08-06',kanal:'mejl',riktning:'ut',not:'Skickade info'},
                  {d:'2026-08-20',kanal:'mejl',riktning:'in',not:'Tackade nej, går intern kurs'}]},
      {id:9,namn:'Martin Berg',epost:'martin.berg@sydkraftbygg.se',telefon:'070-777 88 99',roll:'Arbetsledare',org:'Sydkraft Bygg',bransch:'Bygg',storlek:'20-99',
       kalla:'rekommendation',kampanj:'',typ:'bokning',kurs:'Vecka 45, Ringenäs',kursdatum:'2026-11-02',
       datum:'2026-07-14',status:'vunnen',bokad:'2026-07-21',varde:33400,agare:'Carl-Fredrik',not:'Kollegan Peter tipsade.',
       kontakter:[{d:'2026-07-14',kanal:'telefon',riktning:'in',not:'Ringde direkt, visste vad han ville'},
                  {d:'2026-07-21',kanal:'mejl',riktning:'in',not:'Bokade plats'}]},
      {id:10,namn:'Lisa Norén',epost:'lisa@vingavard.se',telefon:'070-888 99 00',roll:'HR-chef',org:'Vinga Vård',bransch:'Vård och omsorg',storlek:'100-499',
       kalla:'massa',kampanj:'HR-dagarna 2026',typ:'chef',kurs:'Flera veckor',kursdatum:'',
       datum:'2026-04-22',status:'kontaktad',bokad:'',varde:135000,agare:'Carl-Fredrik',not:'Vill skicka fyra chefer under 2027. Stort men långsamt.',
       kontakter:[{d:'2026-04-22',kanal:'mote',riktning:'in',not:'Besökte montern på HR-dagarna'},
                  {d:'2026-04-29',kanal:'mejl',riktning:'ut',not:'Skickade upplägg för fyra deltagare'},
                  {d:'2026-05-20',kanal:'mote',riktning:'ut',not:'Digitalt möte med henne och ekonomichefen'},
                  {d:'2026-06-30',kanal:'mejl',riktning:'ut',not:'Uppföljning inför budgetarbetet'},
                  {d:'2026-09-01',kanal:'mejl',riktning:'ut',not:'Inbjudan till arbetsgivarportalen'}]},
      {id:11,namn:'Jonas Ahl',epost:'jonas@sydkraftbygg.se',telefon:'070-999 00 11',roll:'VD',org:'Sydkraft Bygg',bransch:'Bygg',storlek:'20-99',
       kalla:'direkt',kampanj:'',typ:'chef',kurs:'Vecka 47, Bykrogen',kursdatum:'2026-11-16',
       datum:'2026-08-31',status:'ny',bokad:'',varde:33400,agare:'Carl-Fredrik',not:'',
       kontakter:[{d:'2026-08-31',kanal:'webb',riktning:'in',not:'En medarbetare skickade kursen till honom'}]},
      {id:12,namn:'Sofia Berg',epost:'sofia.berg@almvik.se',telefon:'070-121 21 21',roll:'HR-strateg',org:'Almvik Kommun',bransch:'Offentlig sektor',storlek:'500+',
       kalla:'nyhetsbrev',kampanj:'Nyhetsbrev maj',typ:'intresse',kurs:'Vecka 50, Hagastrand',kursdatum:'2026-12-07',
       datum:'2026-05-06',status:'vunnen',bokad:'2026-06-11',varde:34400,agare:'Carl-Fredrik',not:'',
       kontakter:[{d:'2026-05-06',kanal:'webb',riktning:'in',not:'Anmälde intresse via nyhetsbrevet'},
                  {d:'2026-05-07',kanal:'mejl',riktning:'ut',not:'Skickade datum'},
                  {d:'2026-05-25',kanal:'telefon',riktning:'ut',not:'Samtal om vilken vecka som passar'},
                  {d:'2026-06-11',kanal:'mejl',riktning:'in',not:'Bokade plats'}]},
      {id:13,namn:'Henrik Palm',epost:'henrik.palm@bergslagensenergi.se',telefon:'',roll:'Driftchef',org:'Bergslagens Energi',bransch:'Energi',storlek:'100-499',
       kalla:'linkedin',kampanj:'Höstkampanj UGL 2026',typ:'intresse',kurs:'Vecka 3, Villa Lovik',kursdatum:'2027-01-18',
       datum:'2026-09-01',status:'ny',bokad:'',varde:33800,agare:'Carl-Fredrik',not:'',
       kontakter:[{d:'2026-09-01',kanal:'linkedin',riktning:'in',not:'Skickade meddelande efter ett inlägg om grupputveckling'}]},
      {id:14,namn:'Karin Ek',epost:'karin.ek@nordvikindustri.se',telefon:'070-131 31 31',roll:'HR-chef',org:'Nordvik Industri AB',bransch:'Industri',storlek:'100-499',
       kalla:'rekommendation',kampanj:'',typ:'chef',kurs:'Flera veckor',kursdatum:'',
       datum:'2026-03-11',status:'vunnen',bokad:'2026-04-08',varde:98400,agare:'Carl-Fredrik',not:'Blev kund i arbetsgivarportalen, planerar tre per år.',
       kontakter:[{d:'2026-03-11',kanal:'mejl',riktning:'in',not:'Hörde av sig efter tips från annan kommun'},
                  {d:'2026-03-18',kanal:'mote',riktning:'ut',not:'Möte om behovet i chefsgruppen'},
                  {d:'2026-04-08',kanal:'mejl',riktning:'in',not:'Beställde tre platser under året'}]}
    ],
    inbjudningar:[
      {id:1,typ:'arrangor',namn:'Nordlys Utveckling AB',epost:'petra@nordlys.se',skickad:'2026-08-28',status:'oppnad'},
      {id:2,typ:'foretag',namn:'Vinga Vård',epost:'lisa@vingavard.se',skickad:'2026-09-01',status:'skickad'},
      {id:3,typ:'anlaggning',namn:'Tanumstrand',epost:'konferens@tanumstrand.se',skickad:'2026-08-20',status:'aktiverad'},
      {id:4,typ:'foretag',namn:'Bergslagens Energi',epost:'hr@bergslagensenergi.se',skickad:'2026-07-14',status:'utgangen'}
    ],
    fakturor:[
      {id:1,aid:1,period:'Augusti 2026',bokningar:14,brutto:334600,belopp:40152,forfaller:'2026-09-30',status:'skickad'},
      {id:2,aid:2,period:'Augusti 2026',bokningar:9,brutto:215100,belopp:19359,forfaller:'2026-09-30',status:'betald'},
      {id:3,aid:3,period:'Augusti 2026',bokningar:5,brutto:143750,belopp:21563,forfaller:'2026-09-30',status:'utkast'},
      {id:4,aid:1,period:'Juli 2026',bokningar:11,brutto:262900,belopp:31548,forfaller:'2026-08-31',status:'forfallen'}
    ],
    statistik:[
      {aid:1,kurser:18,platser:216,bokade:151,omsattning:3608900},
      {aid:2,kurser:12,platser:144,bokade:96,omsattning:2294400},
      {aid:3,kurser:9,platser:108,bokade:71,omsattning:2041250},
      {aid:4,kurser:0,platser:0,bokade:0,omsattning:0}
    ],
    manader:[
      {m:'2025-10',bokade:21,intresse:38,kurser:4},
      {m:'2025-11',bokade:26,intresse:44,kurser:5},
      {m:'2025-12',bokade:14,intresse:22,kurser:3},
      {m:'2026-01',bokade:29,intresse:57,kurser:5},
      {m:'2026-02',bokade:33,intresse:61,kurser:6},
      {m:'2026-03',bokade:38,intresse:66,kurser:6},
      {m:'2026-04',bokade:31,intresse:52,kurser:5},
      {m:'2026-05',bokade:36,intresse:59,kurser:6},
      {m:'2026-06',bokade:18,intresse:27,kurser:3},
      {m:'2026-07',bokade:9,intresse:16,kurser:2},
      {m:'2026-08',bokade:28,intresse:49,kurser:5},
      {m:'2026-09',bokade:35,intresse:63,kurser:6}
    ],
    orter:[
      {ort:'Stockholm',kurser:12,bokade:104},
      {ort:'Halmstad',kurser:8,bokade:79},
      {ort:'Göteborg',kurser:6,bokade:54},
      {ort:'Jönköping',kurser:5,bokade:41},
      {ort:'Kristianstad',kurser:4,bokade:24},
      {ort:'Umeå',kurser:4,bokade:16}
    ],
    tratt:[
      {steg:'Sett kurssidan',antal:4820},
      {steg:'Anmält intresse',antal:412},
      {steg:'Kontaktade',antal:263},
      {steg:'Bokningsförfrågan',antal:118},
      {steg:'Bekräftad bokning',antal:96}
    ],
    admins:[
      {id:1,namn:'Carl-Fredrik Zettermark',epost:'carl-fredrik@ledarskapskultur.se',roll:'Ägare'},
      {id:2,namn:'Demo Support',epost:'support@uglsverige.store',roll:'Admin'}
    ]
  };

  var S=null,nastaId=200;
  function las(){try{var r=localStorage.getItem('ugl-admin-demo');if(r)return komplettera(JSON.parse(r))}catch(e){}return null}
  function spara(){try{localStorage.setItem('ugl-admin-demo',JSON.stringify(S))}catch(e){}}
  function nollstall(){S=JSON.parse(JSON.stringify(DEMO));spara()}
  function komplettera(s){
    if(!s||typeof s!=='object')return null;
    ['arrangorer','granskning','foretag','leads','inbjudningar','fakturor','statistik','admins','manader','orter','tratt'].forEach(function(f){
      if(!Array.isArray(s[f])||!s[f].length)s[f]=JSON.parse(JSON.stringify(DEMO[f]));
    });
    s.plattform=s.plattform||JSON.parse(JSON.stringify(DEMO.plattform));
    s.jag=s.jag||JSON.parse(JSON.stringify(DEMO.jag));
    s.arrangorer.forEach(function(a){a.avtal=a.avtal||{mall:'Standard',provision:12,avgift:0,start:idagISO(),slut:'',uppsagning:'3 månader',status:'utkast'}});
    return s;
  }
  var $=function(id){return document.getElementById(id)};
  function arr(id){return S.arrangorer.filter(function(a){return a.id===id})[0]||{namn:'Okänd',kort:'??'}}
  function stat(id){return S.statistik.filter(function(x){return x.aid===id})[0]||{kurser:0,platser:0,bokade:0,omsattning:0}}
  function chip(s,tab){return tab[s]?'<span class="chip-status '+tab[s][1]+'">'+tab[s][0]+'</span>':''}
  function kpi(v,e,x){return '<div class="kpi"><b>'+v+'</b><span>'+e+'</span>'+(x?'<small>'+x+'</small>':'')+'</div>'}
  function logga(a){return '<span class="n-init liten">'+(a.kort||init(a.namn))+'</span>'}
  function toast(t){var e=document.createElement('div');e.className='toast';e.textContent=t;document.body.appendChild(e);
    setTimeout(function(){e.classList.add('ut')},2200);setTimeout(function(){e.remove()},2800)}
  function pil(){return '<span class="rad-pil" aria-hidden="true">&#8250;</span>'}

  /* ---------- Härledda tal ---------- */
  function kontakter(l){return Array.isArray(l.kontakter)?l.kontakter.slice().sort(function(a,b){return a.d<b.d?-1:1}):[]}
  function forstaKontakt(l){var k=kontakter(l);return k.length?k[0].d:l.datum}
  function senasteKontakt(l){var k=kontakter(l);return k.length?k[k.length-1].d:l.datum}
  function antalKontakter(l){return kontakter(l).length}
  function ledtid(l){return l.bokad?Math.round((new Date(l.bokad)-new Date(forstaKontakt(l)))/864e5):null}
  function alderDagar(l){return dagarSedan(forstaKontakt(l))}
  function tystDagar(l){return dagarSedan(senasteKontakt(l))}
  function vunna(){return S.leads.filter(function(l){return l.status==='vunnen'})}
  function snitt(lista){return lista.length?Math.round(lista.reduce(function(a,b){return a+b},0)/lista.length):0}
  function snittLedtid(){return snitt(vunna().map(ledtid).filter(function(x){return x!=null}))}
  function snittKontakter(){var v=vunna().map(antalKontakter);return v.length?Math.round(snitt(v.map(function(x){return x*10}))/10*10)/10:0}
  function kallStat(){
    var m={};
    S.leads.forEach(function(l){
      var k=l.kalla||'direkt';
      m[k]=m[k]||{kalla:k,leads:0,vunna:0,varde:0,ledtider:[],kontakter:0};
      m[k].leads++;m[k].kontakter+=antalKontakter(l);
      if(l.status==='vunnen'){m[k].vunna++;m[k].varde+=l.varde||0;var t=ledtid(l);if(t!=null)m[k].ledtider.push(t)}
    });
    return Object.keys(m).map(function(k){var x=m[k];
      x.konv=x.leads?Math.round(x.vunna/x.leads*100):0;
      x.ledtid=snitt(x.ledtider);
      return x}).sort(function(a,b){return b.leads-a.leads});
  }
  function spann(varden,granser,etiketter){
    var ut=etiketter.map(function(e){return {namn:e,antal:0}});
    varden.forEach(function(v){
      for(var i=0;i<granser.length;i++){if(v<=granser[i]){ut[i].antal++;return}}
      ut[ut.length-1].antal++;
    });
    return ut;
  }
  function provisionFor(a){var s=stat(a.id);return Math.round(s.omsattning*a.avtal.provision/100)}
  function totalProvision(){return S.arrangorer.reduce(function(n,a){return n+provisionFor(a)},0)}
  function attGora(){
    var p=[];
    var g=S.granskning.filter(function(x){return x.status==='vantar'}).length;
    if(g)p.push({niva:'varning',rubrik:g===1?'En kurs väntar på granskning':g+' kurser väntar på granskning',
      text:'Nya veckor syns inte publikt förrän de är godkända.',vy:'granskning'});
    var i=S.inbjudningar.filter(function(x){return x.status==='skickad'&&dagarSedan(x.skickad)>7}).length;
    if(i)p.push({niva:'info',rubrik:i===1?'En inbjudan utan svar':i+' inbjudningar utan svar',
      text:'Skickad för mer än en vecka sedan. Skicka en påminnelse.',vy:'inbjudningar'});
    var f=S.fakturor.filter(function(x){return x.status==='forfallen'}).length;
    if(f)p.push({niva:'varning',rubrik:f===1?'En faktura är förfallen':f+' fakturor är förfallna',text:'Följ upp med arrangören.',vy:'ekonomi'});
    var u=S.fakturor.filter(function(x){return x.status==='utkast'}).length;
    if(u)p.push({niva:'info',rubrik:u===1?'Ett fakturaunderlag att skicka':u+' fakturaunderlag att skicka',
      text:'Underlagen är klara och väntar på att gå iväg.',vy:'ekonomi'});
    var l=S.leads.filter(function(x){return x.status==='ny'}).length;
    if(l)p.push({niva:'info',rubrik:l===1?'Ett nytt lead':l+' nya leads',text:'Personer som visat intresse och inte kontaktats än.',vy:'leads'});
    var t=S.leads.filter(function(x){return x.status==='kontaktad'&&tystDagar(x)>14}).length;
    if(t)p.push({niva:'varning',rubrik:t===1?'Ett lead har legat stilla':t+' leads har legat stilla',
      text:'Ingen kontakt på över två veckor. Följ upp innan de svalnar.',vy:'leads'});
    var s=S.arrangorer.filter(function(a){return a.avtal.status==='signering'}).length;
    if(s)p.push({niva:'info',rubrik:s===1?'Ett avtal väntar på signering':s+' avtal väntar på signering',
      text:'Arrangören har fått avtalet men inte skrivit under.',vy:'arrangorer'});
    return p;
  }

  /* ---------- Vyer ---------- */
  function vOversikt(){
    var aktiva=S.arrangorer.filter(function(a){return a.status==='aktiv'}).length;
    var kurser=S.statistik.reduce(function(n,s){return n+s.kurser},0);
    var bokade=S.statistik.reduce(function(n,s){return n+s.bokade},0);
    var platser=S.statistik.reduce(function(n,s){return n+s.platser},0);
    var h='<div class="vy-head"><div><h1>Hej '+S.jag.namn.split(' ')[0]+'.</h1>'+
      '<p class="lead">Så ser plattformen ut just nu. Allt som behöver din uppmärksamhet ligger överst.</p></div>'+
      '<button class="button" id="bjud-in">Bjud in ny part</button></div>';
    h+='<div class="kpi-rad">'+kpi(aktiva,'aktiva arrangörer',S.arrangorer.length+' totalt')+
      kpi(kurser,'kurser i utbudet')+
      kpi(bokade+' / '+platser,'platser bokade',platser?Math.round(bokade/platser*100)+' procent beläggning':'')+
      kpi(kr(totalProvision()),'provision i år','exkl. moms')+'</div>';
    var p=attGora();
    h+='<div class="panel"><div class="panel-head"><h2>Att göra</h2><span class="pf">'+(p.length?p.length+' punkter':'Inget just nu')+'</span></div>';
    h+=p.length?'<ul class="attgora">'+p.map(function(x){
      return '<li class="ag-'+x.niva+'" data-oppna="vy:'+x.vy+'"><div><b>'+x.rubrik+'</b><span>'+x.text+'</span></div>'+pil()+'</li>'}).join('')+'</ul>'
      :'<p class="tom">Ingenting väntar på dig.</p>';
    h+='</div>';
    h+='<div class="panel"><div class="panel-head"><h2>Arrangörer</h2><a class="text-link" href="#arrangorer">Se alla</a></div>'+
      '<div class="tab-svep"><table class="tab"><thead><tr><th>Arrangör</th><th>Kurser</th><th class="hoger">Beläggning</th><th class="hoger">Provision i år</th><th>Avtal</th><th></th></tr></thead><tbody>'+
      S.arrangorer.map(function(a){var s=stat(a.id);
        return '<tr class="rad-oppna" tabindex="0" data-oppna="arrangor:'+a.id+'"><td><div class="td-anl">'+logga(a)+
          '<span><b>'+esc(a.namn)+'</b><small>'+esc(a.ort)+'</small></span></div></td>'+
          '<td>'+s.kurser+'</td>'+
          '<td class="hoger">'+(s.platser?Math.round(s.bokade/s.platser*100)+' %':'-')+'</td>'+
          '<td class="hoger">'+kr(provisionFor(a))+'</td>'+
          '<td>'+chip(a.avtal.status,ASTATUS)+'</td><td class="tab-atg">'+pil()+'</td></tr>';
      }).join('')+'</tbody></table></div></div>';
    return h;
  }

  function vArrangorer(){
    var h='<div class="vy-head"><div><h1>Arrangörer</h1><p class="lead">Företag som lägger upp UGL-veckor i utbudet. Varje arrangör har ett eget avtal med er.</p></div>'+
      '<button class="button" id="bjud-arr">Bjud in arrangör</button></div>';
    h+='<div class="panel"><div class="tab-svep"><table class="tab"><thead><tr><th>Arrangör</th><th>Kontakt</th><th>Avtal</th><th class="hoger">Provision</th><th class="hoger">Kurser</th><th>Status</th><th></th></tr></thead><tbody>'+
      S.arrangorer.map(function(a){var s=stat(a.id);
        return '<tr class="rad-oppna" tabindex="0" data-oppna="arrangor:'+a.id+'"><td><div class="td-anl">'+logga(a)+
          '<span><b>'+esc(a.namn)+'</b><small>'+esc(a.orgnr)+' · '+esc(a.ort)+'</small></span></div></td>'+
          '<td><b>'+esc(a.kontakt)+'</b><small>'+esc(a.epost)+'</small></td>'+
          '<td>'+esc(a.avtal.mall)+'<small>'+chip(a.avtal.status,ASTATUS)+'</small></td>'+
          '<td class="hoger">'+a.avtal.provision+' %'+(a.avtal.avgift?'<small>'+kr(a.avtal.avgift)+' per mån</small>':'')+'</td>'+
          '<td class="hoger">'+s.kurser+'</td>'+
          '<td>'+chip(a.status,KSTATUS)+'</td><td class="tab-atg">'+pil()+'</td></tr>';
      }).join('')+'</tbody></table></div></div>';
    return h;
  }

  function vGranskning(){
    var vantar=S.granskning.filter(function(g){return g.status==='vantar'});
    var klara=S.granskning.filter(function(g){return g.status!=='vantar'});
    var h='<div class="vy-head"><div><h1>Kurser att granska</h1><p class="lead">Nya veckor från arrangörerna syns publikt först när ni godkänt dem. Klicka på en rad för att se hela underlaget.</p></div></div>';
    h+='<div class="panel"><div class="panel-head"><h2>Väntar på beslut</h2><span class="pf">'+vantar.length+' i kö</span></div>';
    h+=vantar.length?'<div class="tab-svep"><table class="tab"><thead><tr><th>Vecka</th><th>Datum</th><th>Arrangör</th><th>Plats</th><th class="hoger">Totalpris</th><th>Inkom</th><th></th></tr></thead><tbody>'+
      vantar.map(radGranskning).join('')+'</tbody></table></div>':'<p class="tom">Kön är tom.</p>';
    h+='</div>';
    if(klara.length)h+='<div class="panel"><h2>Nyligen beslutade</h2><div class="tab-svep"><table class="tab"><thead><tr><th>Vecka</th><th>Datum</th><th>Arrangör</th><th>Plats</th><th>Beslut</th></tr></thead><tbody>'+
      klara.map(function(g){var a=arr(g.aid);
        return '<tr><td><b>'+vecka(g.datum)+'</b></td><td>'+period(g.datum)+'</td><td>'+esc(a.namn)+'</td>'+
          '<td>'+esc(g.anlaggning)+'<small>'+esc(g.ort)+'</small></td><td>'+chip(g.status,GSTATUS)+
          (g.orsak?'<small>'+esc(g.orsak)+'</small>':'')+'</td></tr>'}).join('')+'</tbody></table></div></div>';
    return h;
  }
  function radGranskning(g){
    var a=arr(g.aid),d=dagarSedan(g.skickad);
    return '<tr class="rad-oppna" tabindex="0" data-oppna="granska:'+g.id+'"><td><b>'+vecka(g.datum)+'</b></td>'+
      '<td class="td-datum">'+period(g.datum)+'</td>'+
      '<td><div class="td-anl">'+logga(a)+'<span><b>'+esc(a.namn)+'</b></span></div></td>'+
      '<td>'+esc(g.anlaggning)+'<small>'+esc(g.ort)+'</small></td>'+
      '<td class="hoger">'+kr(g.kurspris+g.logi)+'</td>'+
      '<td>'+(d===0?'i dag':dagar(d)+' sedan')+'</td><td class="tab-atg">'+pil()+'</td></tr>';
  }

  function vForetag(){
    var h='<div class="vy-head"><div><h1>Arbetsgivare</h1><p class="lead">Företag och organisationer med konto i bokningsportalen. Här ser ni vilka som bokar och hur mycket.</p></div>'+
      '<button class="button" id="bjud-ftg">Bjud in arbetsgivare</button></div>';
    h+='<div class="panel"><div class="tab-svep"><table class="tab"><thead><tr><th>Organisation</th><th>Kontakt</th><th class="hoger">Anställda</th><th class="hoger">Bokade platser</th><th>Kund sedan</th><th>Status</th><th></th></tr></thead><tbody>'+
      S.foretag.map(function(f){
        return '<tr class="rad-oppna" tabindex="0" data-oppna="foretag:'+f.id+'"><td><div class="td-anl"><span class="n-init liten">'+init(f.namn)+'</span>'+
          '<span><b>'+esc(f.namn)+'</b><small>'+esc(f.orgnr)+' · '+esc(f.ort)+'</small></span></div></td>'+
          '<td><b>'+esc(f.kontakt)+'</b><small>'+esc(f.epost)+'</small></td>'+
          '<td class="hoger">'+f.anstallda+'</td><td class="hoger">'+f.bokade+'</td>'+
          '<td>'+dat(f.sedan)+'</td><td>'+chip(f.status,KSTATUS)+'</td><td class="tab-atg">'+pil()+'</td></tr>';
      }).join('')+'</tbody></table></div></div>';
    return h;
  }

  var leadFilter='alla',leadKalla='alla',leadSort='datum';
  function vLeads(){
    var lista=S.leads.filter(function(l){
      return (leadFilter==='alla'||l.typ===leadFilter)&&(leadKalla==='alla'||l.kalla===leadKalla)});
    lista.sort(leadSort==='tyst'?function(a,b){return tystDagar(b)-tystDagar(a)}
      :leadSort==='varde'?function(a,b){return (b.varde||0)-(a.varde||0)}
      :function(a,b){return forstaKontakt(a)<forstaKontakt(b)?1:-1});
    var v=vunna();
    var h='<div class="vy-head"><div><h1>Leads och kundresa</h1><p class="lead">Varje kontakt loggas, så du ser var personen kom in, hur många beröringar det tog och hur lång tid det gick till bokning.</p></div>'+
      '<button class="button button-outline-dark" id="exportera">Exportera som CSV</button></div>';
    h+='<div class="kpi-rad">'+
      kpi(S.leads.filter(function(l){return l.status==='ny'}).length,'nya, ej kontaktade')+
      kpi(dagar(snittLedtid()),'snitt till bokning','från första kontakt')+
      kpi(String(snittKontakter()).replace('.',','),'kontakter i snitt','innan bokning')+
      kpi(S.leads.length?Math.round(v.length/S.leads.length*100)+' %':'-','blir bokning')+'</div>';
    h+='<div class="panel"><div class="filterchips">'+
      [['alla','Alla typer'],['intresse','Intresselista'],['chef','Skickat till chef'],['bokning','Bokningsförfrågan']].map(function(f){
        return '<button type="button" class="fchip'+(leadFilter===f[0]?' ar-pa':'')+'" data-lfilter="'+f[0]+'">'+f[1]+'</button>'}).join('')+'</div>';
    h+='<div class="filterchips filter-tva">'+
      '<button type="button" class="fchip'+(leadKalla==='alla'?' ar-pa':'')+'" data-lkalla="alla">Alla källor</button>'+
      Object.keys(KALLA).filter(function(k){return S.leads.some(function(l){return l.kalla===k})}).map(function(k){
        return '<button type="button" class="fchip'+(leadKalla===k?' ar-pa':'')+'" data-lkalla="'+k+'">'+KALLA[k]+'</button>'}).join('')+
      '<span class="filter-sort">Sortera<select id="l-sort">'+
      [['datum','Senast inkommen'],['tyst','Längst utan kontakt'],['varde','Högst värde']].map(function(o){
        return '<option value="'+o[0]+'"'+(leadSort===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></span></div>';
    h+=lista.length?'<div class="tab-svep"><table class="tab"><thead><tr><th>Person</th><th>Källa</th><th class="hoger">Kontakter</th>'+
      '<th>Första kontakt</th><th>Senaste</th><th class="hoger">Ledtid</th><th class="hoger">Värde</th><th>Status</th><th></th></tr></thead><tbody>'+
      lista.map(function(l){var t=ledtid(l),ty=tystDagar(l);
        return '<tr class="rad-oppna" tabindex="0" data-oppna="lead:'+l.id+'"><td><b>'+esc(l.namn)+'</b><small>'+esc(l.roll)+', '+esc(l.org)+'</small></td>'+
          '<td>'+(KALLA[l.kalla]||'-')+(l.kampanj?'<small>'+esc(l.kampanj)+'</small>':'')+'</td>'+
          '<td class="hoger">'+antalKontakter(l)+'</td>'+
          '<td>'+dat(forstaKontakt(l))+'<small>'+dagar(alderDagar(l))+' sedan</small></td>'+
          '<td>'+dat(senasteKontakt(l))+(l.status!=='vunnen'&&l.status!=='tappad'&&ty>14?'<small class="varn">'+dagar(ty)+' tyst</small>':'<small>'+dagar(ty)+' sedan</small>')+'</td>'+
          '<td class="hoger">'+(t!=null?dagar(t):'-')+'</td>'+
          '<td class="hoger">'+(l.varde?kr(l.varde):'-')+'</td>'+
          '<td>'+chip(l.status,LSTATUS)+'</td><td class="tab-atg">'+pil()+'</td></tr>';
      }).join('')+'</tbody></table></div>':'<p class="tom">Inga leads i det här urvalet.</p>';
    h+='</div>';
    return h;
  }

  function vEkonomi(){
    var brutto=S.statistik.reduce(function(n,s){return n+s.omsattning},0);
    var obetalt=S.fakturor.filter(function(f){return f.status!=='betald'}).reduce(function(n,f){return n+f.belopp},0);
    var h='<div class="vy-head"><div><h1>Ekonomi</h1><p class="lead">Provision per arrangör och underlag för fakturering. Alla belopp exklusive moms.</p></div>'+
      '<button class="button" id="nytt-underlag">Skapa fakturaunderlag</button></div>';
    h+='<div class="kpi-rad">'+kpi(kr(brutto),'förmedlat värde i år')+kpi(kr(totalProvision()),'provision i år')+
      kpi(kr(obetalt),'ej betalt','av utställda fakturor')+
      kpi(S.fakturor.filter(function(f){return f.status==='forfallen'}).length,'förfallna fakturor')+'</div>';
    h+='<div class="panel"><h2>Per arrangör</h2><div class="tab-svep"><table class="tab"><thead><tr><th>Arrangör</th><th>Avtal</th><th class="hoger">Bokade platser</th><th class="hoger">Förmedlat värde</th><th class="hoger">Provision</th><th></th></tr></thead><tbody>'+
      S.arrangorer.map(function(a){var s=stat(a.id);
        return '<tr class="rad-oppna" tabindex="0" data-oppna="arrangor:'+a.id+'"><td><div class="td-anl">'+logga(a)+'<span><b>'+esc(a.namn)+'</b></span></div></td>'+
          '<td>'+esc(a.avtal.mall)+'<small>'+a.avtal.provision+' procent</small></td>'+
          '<td class="hoger">'+s.bokade+'</td><td class="hoger">'+kr(s.omsattning)+'</td>'+
          '<td class="hoger"><b>'+kr(provisionFor(a))+'</b></td><td class="tab-atg">'+pil()+'</td></tr>';
      }).join('')+'</tbody></table></div></div>';
    h+='<div class="panel"><h2>Fakturor och underlag</h2><div class="tab-svep"><table class="tab"><thead><tr><th>Arrangör</th><th>Period</th><th class="hoger">Bokningar</th><th class="hoger">Belopp</th><th>Förfaller</th><th>Status</th><th></th></tr></thead><tbody>'+
      S.fakturor.map(function(f){var a=arr(f.aid);
        return '<tr class="rad-oppna" tabindex="0" data-oppna="faktura:'+f.id+'"><td><div class="td-anl">'+logga(a)+'<span><b>'+esc(a.namn)+'</b></span></div></td>'+
          '<td>'+esc(f.period)+'</td><td class="hoger">'+f.bokningar+'</td><td class="hoger"><b>'+kr(f.belopp)+'</b></td>'+
          '<td>'+dat(f.forfaller)+'</td><td>'+chip(f.status,FSTATUS)+'</td><td class="tab-atg">'+pil()+'</td></tr>';
      }).join('')+'</tbody></table></div></div>';
    return h;
  }

  function vInbjudningar(){
    var h='<div class="vy-head"><div><h1>Inbjudningar</h1><p class="lead">Alla utskickade inbjudningar och var de tagit vägen. En inbjudan ger mottagaren en egen inloggning.</p></div>'+
      '<button class="button" id="bjud-in2">Bjud in ny part</button></div>';
    h+='<div class="panel"><div class="tab-svep"><table class="tab"><thead><tr><th>Mottagare</th><th>Typ</th><th>Skickad</th><th>Status</th><th class="tab-atg">Åtgärd</th></tr></thead><tbody>'+
      S.inbjudningar.slice().sort(function(a,b){return a.skickad<b.skickad?1:-1}).map(function(i){
        return '<tr><td><b>'+esc(i.namn)+'</b><small>'+esc(i.epost)+'</small></td>'+
          '<td>'+ITYP[i.typ]+'</td><td>'+dat(i.skickad)+'<small>'+dagar(dagarSedan(i.skickad))+' sedan</small></td>'+
          '<td>'+chip(i.status,ISTATUS)+'</td>'+
          '<td class="tab-atg">'+(i.status==='aktiverad'?'':'<button class="mini" data-paminn="'+i.id+'">Påminn</button>')+
          '<button class="mini" data-lank="'+i.id+'">Kopiera länk</button></td></tr>';
      }).join('')+'</tbody></table></div></div>';
    return h;
  }

  function vInstallningar(){
    var h='<div class="vy-head"><div><h1>Inställningar</h1><p class="lead">Plattformens uppgifter, avtalsmallar och vilka kollegor som når adminsidan.</p></div></div>';
    h+='<div class="panel"><h2>Avtalsmallar</h2><p class="tom">Mallarna används när du bjuder in en arrangör. Du kan alltid justera villkoren för en enskild arrangör.</p>'+
      '<div class="mallar">'+MALLAR.map(function(m){
        var antal=S.arrangorer.filter(function(a){return a.avtal.mall===m.namn}).length;
        return '<article class="mall"><h3>'+m.namn+'</h3><p class="mall-tal">'+m.provision+' %'+(m.avgift?' + '+kr(m.avgift):'')+'</p>'+
          '<p>'+m.text+'</p><span class="mall-antal">'+antal+' arrangörer</span></article>'}).join('')+'</div></div>';
    h+='<div class="panel"><div class="panel-head"><h2>Administratörer</h2><button class="mini" id="bjud-admin">Bjud in kollega</button></div>'+
      '<div class="tab-svep"><table class="tab"><thead><tr><th>Namn</th><th>E-post</th><th>Behörighet</th></tr></thead><tbody>'+
      S.admins.map(function(a){return '<tr><td><span class="n-init liten">'+init(a.namn)+'</span><b>'+esc(a.namn)+'</b></td>'+
        '<td>'+esc(a.epost)+'</td><td>'+esc(a.roll)+'</td></tr>'}).join('')+'</tbody></table></div></div>';
    h+='<div class="panel"><h2>Demodata</h2><p class="tom">Prototypen sparar allt lokalt i din webbläsare. Återställ när du vill börja om.</p>'+
      '<button class="button button-outline-dark" id="nollstall">Återställ demodata</button></div>';
    return h;
  }

  /* ---------- Statistik ---------- */
  function manadEtikett(m){var d=m.split('-');return KORT[+d[1]-1]}
  function kolumner(serie,falt,etikett){
    var max=serie.reduce(function(n,x){return Math.max(n,x[falt])},0)||1;
    var steg=Math.ceil(max/4/5)*5;
    return '<figure class="diagram"><figcaption>'+etikett+'</figcaption>'+
      '<div class="dg-yta"><div class="dg-axel">'+[4,3,2,1,0].map(function(i){
        return '<span>'+(steg*i)+'</span>'}).join('')+'</div>'+
      '<div class="dg-plot">'+serie.map(function(x){
        var h=Math.round(x[falt]/(steg*4)*100);
        return '<div class="dg-kol" title="'+manadEtikett(x.m)+' '+x.m.slice(0,4)+': '+x[falt]+' platser">'+
          '<span class="dg-varde">'+x[falt]+'</span>'+
          '<span class="dg-stapel" style="height:'+h+'%"></span>'+
          '<span class="dg-etikett">'+manadEtikett(x.m)+'</span></div>'}).join('')+'</div></div></figure>';
  }
  function andelsstaplar(rader,falt,namnfalt,enhet){
    var max=rader.reduce(function(n,x){return Math.max(n,x[falt])},0)||1;
    var sum=rader.reduce(function(n,x){return n+x[falt]},0)||1;
    return '<div class="staplar">'+rader.map(function(x){
      return '<div class="st-rad"><span class="st-namn">'+esc(x[namnfalt])+'</span>'+
        '<span class="st-spar"><span class="st-fyll" style="width:'+Math.round(x[falt]/max*100)+'%"></span></span>'+
        '<span class="st-tal">'+x[falt]+' '+enhet+'<small>'+Math.round(x[falt]/sum*100)+' %</small></span></div>'}).join('')+'</div>';
  }
  function vStatistik(){
    var man=S.manader,ar=man.filter(function(x){return x.m.slice(0,4)==='2026'});
    var bokade=ar.reduce(function(n,x){return n+x.bokade},0);
    var intresse=ar.reduce(function(n,x){return n+x.intresse},0);
    var platser=S.statistik.reduce(function(n,s){return n+s.platser},0);
    var brutto=S.statistik.reduce(function(n,s){return n+s.omsattning},0);
    var alla=S.statistik.reduce(function(n,s){return n+s.bokade},0);
    var h='<div class="vy-head"><div><h1>Statistik</h1><p class="lead">Hur plattformen utvecklas över tid, var kurserna går och hur många av de intresserade som blir deltagare.</p></div></div>';
    h+='<div class="kpi-rad">'+kpi(bokade,'bokade platser i år')+
      kpi(intresse,'intresseanmälningar i år')+
      kpi(intresse?Math.round(bokade/intresse*100)+' %':'-','av intresset blir bokning')+
      kpi(alla?kr(Math.round(brutto/alla)):'-','snittvärde per plats')+'</div>';
    h+='<div class="panel"><h2>Bokade platser per månad</h2>'+
      '<p class="tom">Rullande tolv månader. Sommaren är låg, våren och hösten bär året.</p>'+
      kolumner(man,'bokade','Bokade platser, senaste tolv månaderna')+'</div>';
    h+='<div class="panel"><h2>Fördelning per arrangör</h2>'+
      '<p class="tom">Andel av alla bokade platser.</p>'+
      andelsstaplar(S.arrangorer.map(function(a){return {namn:a.namn,bokade:stat(a.id).bokade}})
        .sort(function(a,b){return b.bokade-a.bokade}),'bokade','namn','platser')+'</div>';
    h+='<div class="panel"><h2>Var kurserna går</h2>'+
      andelsstaplar(S.orter.slice().sort(function(a,b){return b.bokade-a.bokade}),'bokade','ort','platser')+'</div>';
    var t=S.tratt;
    h+='<div class="panel"><h2>Från besök till bokning</h2>'+
      '<p class="tom">Senaste tolv månaderna. Varje steg visar hur många som gick vidare från steget innan.</p>'+
      '<ol class="tratt">'+t.map(function(x,i){
        var b=Math.round(x.antal/t[0].antal*100);
        var fran=i?Math.round(x.antal/t[i-1].antal*100):100;
        return '<li><span class="tr-namn">'+x.steg+'</span>'+
          '<span class="tr-spar"><span class="tr-fyll" style="width:'+Math.max(b,3)+'%"></span></span>'+
          '<span class="tr-tal">'+x.antal+(i?'<small>'+fran+' % vidare</small>':'<small>av dem som tittat</small>')+'</span></li>'}).join('')+
      '</ol></div>';
    h+='<div class="panel"><h2>Var kunderna kommer ifrån</h2>'+
      '<p class="tom">Källa, hur många som blev bokning och hur lång tid det tog. Grunden för var marknadsföringen ska ligga.</p>'+
      '<div class="tab-svep"><table class="tab"><thead><tr><th>Källa</th><th class="hoger">Leads</th><th class="hoger">Bokningar</th>'+
      '<th class="hoger">Konvertering</th><th class="hoger">Snitt kontakter</th><th class="hoger">Snitt ledtid</th><th class="hoger">Värde</th></tr></thead><tbody>'+
      kallStat().map(function(x){
        return '<tr><td><b>'+(KALLA[x.kalla]||x.kalla)+'</b></td><td class="hoger">'+x.leads+'</td>'+
          '<td class="hoger">'+x.vunna+'</td>'+
          '<td class="hoger"><span class="kon-tal'+(x.konv>=50?' kon-hog':x.konv>0?'':' kon-noll')+'">'+x.konv+' %</span></td>'+
          '<td class="hoger">'+(x.leads?Math.round(x.kontakter/x.leads*10)/10:0).toString().replace('.',',')+'</td>'+
          '<td class="hoger">'+(x.ledtid?dagar(x.ledtid):'-')+'</td>'+
          '<td class="hoger">'+(x.varde?kr(x.varde):'-')+'</td></tr>'}).join('')+'</tbody></table></div></div>';
    var vun=vunna();
    h+='<div class="panel"><h2>Hur lång tid en bokning tar</h2>'+
      '<p class="tom">Dagar från första kontakt till bokad plats. Snittet är '+dagar(snittLedtid())+'.</p>'+
      andelsstaplar(spann(vun.map(ledtid).filter(function(x){return x!=null}),[7,30,90],
        ['Inom en vecka','8 till 30 dagar','31 till 90 dagar','Mer än 90 dagar']),'antal','namn','bokningar')+'</div>';
    h+='<div class="panel"><h2>Antal kontakter innan bokning</h2>'+
      '<p class="tom">Snittet är '+String(snittKontakter()).replace('.',',')+' kontakter. Det säger hur mycket uppföljning som behövs.</p>'+
      andelsstaplar(spann(vun.map(antalKontakter),[1,2,3,4],
        ['En kontakt','Två','Tre','Fyra','Fem eller fler']),'antal','namn','bokningar')+'</div>';
    var kanalmix={};
    vun.forEach(function(l){kontakter(l).forEach(function(x){kanalmix[x.kanal]=(kanalmix[x.kanal]||0)+1})});
    h+='<div class="panel"><h2>Kanaler i affärer som blev av</h2>'+
      '<p class="tom">Alla kontakter i de bokningar som gick igenom, fördelade per kanal.</p>'+
      andelsstaplar(Object.keys(kanalmix).map(function(k){return {namn:KANAL[k]||k,antal:kanalmix[k]}})
        .sort(function(a,b){return b.antal-a.antal}),'antal','namn','kontakter')+'</div>';
    var koh={};
    S.leads.forEach(function(l){var m=forstaKontakt(l).slice(0,7);
      koh[m]=koh[m]||{m:m,leads:0,vunna:0};koh[m].leads++;if(l.status==='vunnen')koh[m].vunna++});
    var kohl=Object.keys(koh).sort().map(function(k){return koh[k]});
    h+='<div class="panel"><h2>Leads per månad och hur många som bokade</h2>'+
      '<div class="tab-svep"><table class="tab"><thead><tr><th>Månad</th><th class="hoger">Nya leads</th><th class="hoger">Blev bokning</th><th class="hoger">Konvertering</th></tr></thead><tbody>'+
      kohl.map(function(x){return '<tr><td><b>'+MANADER[+x.m.slice(5)-1]+' '+x.m.slice(0,4)+'</b></td>'+
        '<td class="hoger">'+x.leads+'</td><td class="hoger">'+x.vunna+'</td>'+
        '<td class="hoger">'+Math.round(x.vunna/x.leads*100)+' %</td></tr>'}).join('')+'</tbody></table></div></div>';
    h+='<div class="panel"><h2>Beläggning per arrangör</h2><div class="tab-svep"><table class="tab"><thead><tr><th>Arrangör</th>'+
      '<th class="hoger">Kurser</th><th class="hoger">Platser</th><th class="hoger">Bokade</th><th class="hoger">Beläggning</th><th class="hoger">Förmedlat värde</th></tr></thead><tbody>'+
      S.arrangorer.map(function(a){var s=stat(a.id);
        return '<tr><td><div class="td-anl">'+logga(a)+'<span><b>'+esc(a.namn)+'</b></span></div></td>'+
          '<td class="hoger">'+s.kurser+'</td><td class="hoger">'+s.platser+'</td><td class="hoger">'+s.bokade+'</td>'+
          '<td class="hoger">'+(s.platser?Math.round(s.bokade/s.platser*100)+' %':'-')+'</td>'+
          '<td class="hoger">'+kr(s.omsattning)+'</td></tr>'}).join('')+
      '<tr class="tab-summa"><td><b>Totalt</b></td><td class="hoger">'+S.statistik.reduce(function(n,s){return n+s.kurser},0)+'</td>'+
      '<td class="hoger">'+platser+'</td><td class="hoger">'+alla+'</td>'+
      '<td class="hoger">'+(platser?Math.round(alla/platser*100)+' %':'-')+'</td>'+
      '<td class="hoger">'+kr(brutto)+'</td></tr>'+
      '</tbody></table></div></div>';
    return h;
  }

  /* ---------- Modaler ---------- */
  function modal(html){
    var d=document.createElement('div');d.innerHTML=html;document.body.appendChild(d.firstChild);
    var m=document.querySelector('.modal');
    m.addEventListener('click',function(e){if(e.target===m)stang()});
    if($('mod-stang'))$('mod-stang').addEventListener('click',stang);
    return m;
  }
  function stang(){var m=document.querySelector('.modal');if(m)m.remove()}
  function skal(rubrik,kropp,fot,bred){
    return '<div class="modal"><div class="modal-inre'+(bred?' modal-bred':'')+'">'+
      '<div class="cp-head"><h3>'+rubrik+'</h3><button type="button" id="mod-stang" aria-label="Stäng">&#10005;</button></div>'+
      '<div class="modal-kropp">'+kropp+'</div>'+
      (fot?'<div class="modal-fot">'+fot+'</div>':'')+'</div></div>';
  }
  function falt(id,etikett,varde,typ){
    return '<label class="ro"><span>'+etikett+'</span><input id="'+id+'" type="'+(typ||'text')+'" value="'+esc(varde)+'"></label>';
  }

  function arrangorModal(id){
    var a=arr(id),s=stat(a.id);
    var kropp='<div class="detalj-topp"><span class="n-init stor">'+(a.kort||init(a.namn))+'</span>'+
      '<div><b>'+esc(a.kontakt)+'</b><small>'+esc(a.epost)+'</small><small>'+esc(a.telefon)+'</small></div>'+
      '<div class="detalj-status">'+chip(a.status,KSTATUS)+'<small>Med sedan '+dat(a.sedan)+'</small></div></div>';
    kropp+='<div class="kpi-rad kpi-tat">'+kpi(s.kurser,'kurser')+kpi(s.bokade,'bokade platser')+
      kpi(kr(s.omsattning),'förmedlat värde')+kpi(kr(provisionFor(a)),'provision')+'</div>';
    kropp+='<div class="avtal-box"><div class="avtal-head"><h4>Avtal</h4>'+chip(a.avtal.status,ASTATUS)+'</div>'+
      '<dl class="avtal-lista">'+
      rad('Avtalsmall',a.avtal.mall)+
      rad('Provision',a.avtal.provision+' procent på kursavgiften')+
      rad('Fast avgift',a.avtal.avgift?kr(a.avtal.avgift)+' per månad':'Ingen')+
      rad('Löper',(a.avtal.start?dat(a.avtal.start):'-')+' till '+(a.avtal.slut?dat(a.avtal.slut):'tills vidare'))+
      rad('Uppsägningstid',a.avtal.uppsagning)+
      rad('Organisationsnummer',a.orgnr)+
      '</dl></div>';
    var fot='<button class="button" id="a-avtal">Redigera avtal</button>'+
      '<button class="button button-outline-dark" id="a-mejl">Skicka meddelande</button>'+
      (a.status==='aktiv'?'<button class="button button-outline-dark" id="a-pausa">Pausa konto</button>'
                         :'<button class="button button-outline-dark" id="a-aktivera">Aktivera konto</button>');
    modal(skal(esc(a.namn),kropp,fot,true));
    $('a-avtal').addEventListener('click',function(){stang();avtalModal(id)});
    $('a-mejl').addEventListener('click',function(){stang();toast('I skarpt läge öppnas ett meddelande till '+a.kontakt+'.')});
    if($('a-pausa'))$('a-pausa').addEventListener('click',function(){a.status='pausad';spara();stang();toast(a.namn+' är pausad och kan inte publicera nya kurser.');rita()});
    if($('a-aktivera'))$('a-aktivera').addEventListener('click',function(){a.status='aktiv';spara();stang();toast(a.namn+' är aktiv igen.');rita()});
  }
  function rad(t,v){return '<div><dt>'+t+'</dt><dd>'+esc(v)+'</dd></div>'}

  function avtalModal(id){
    var a=arr(id);
    var kropp='<p class="delad-not">'+SVG('<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/>')+
      'Villkoren gäller bara den här arrangören. Mallen fyller i förslagen, du kan ändra fritt.</p>'+
      '<div class="form-grid">'+
      '<label class="ro"><span>Avtalsmall</span><select id="av-mall">'+MALLAR.map(function(m){
        return '<option'+(m.namn===a.avtal.mall?' selected':'')+'>'+m.namn+'</option>'}).join('')+'<option'+(MALLAR.every(function(m){return m.namn!==a.avtal.mall})?' selected':'')+'>Eget upplägg</option></select></label>'+
      '<label class="ro"><span>Provision, procent</span><input id="av-prov" type="number" step="0.5" value="'+a.avtal.provision+'"></label>'+
      '<label class="ro"><span>Fast avgift per månad</span><input id="av-avgift" type="number" value="'+a.avtal.avgift+'"></label>'+
      '<label class="ro"><span>Uppsägningstid</span><input id="av-upps" value="'+esc(a.avtal.uppsagning)+'"></label>'+
      '<label class="ro"><span>Startdatum</span><input id="av-start" type="date" value="'+esc(a.avtal.start)+'"></label>'+
      '<label class="ro"><span>Slutdatum</span><input id="av-slut" type="date" value="'+esc(a.avtal.slut)+'"></label>'+
      '</div>';
    var fot='<button class="button" id="av-spara">Spara avtal</button>'+
      '<button class="button button-outline-dark" id="av-signering">Skicka för signering</button>';
    modal(skal('Avtal med '+esc(a.namn),kropp,fot,true));
    $('av-mall').addEventListener('change',function(){
      var m=MALLAR.filter(function(x){return x.namn===$('av-mall').value})[0];
      if(m){$('av-prov').value=m.provision;$('av-avgift').value=m.avgift}
    });
    function las2(){
      a.avtal.mall=$('av-mall').value;a.avtal.provision=+$('av-prov').value;a.avtal.avgift=+$('av-avgift').value;
      a.avtal.uppsagning=$('av-upps').value.trim();a.avtal.start=$('av-start').value;a.avtal.slut=$('av-slut').value;
    }
    $('av-spara').addEventListener('click',function(){las2();spara();stang();toast('Avtalet är sparat.');rita()});
    $('av-signering').addEventListener('click',function(){las2();a.avtal.status='signering';spara();stang();
      toast('Avtalet är skickat till '+a.kontakt+' för signering.');rita()});
  }

  function granskaModal(id){
    var g=S.granskning.filter(function(x){return x.id===id})[0],a=arr(g.aid);
    var kropp='<div class="detalj-topp"><span class="n-init stor">'+(a.kort||init(a.namn))+'</span>'+
      '<div><b>'+esc(a.namn)+'</b><small>Inkom '+dat(g.skickad)+'</small></div>'+
      '<div class="detalj-status">'+chip(g.status,GSTATUS)+'</div></div>'+
      '<dl class="avtal-lista">'+
      rad('Vecka',String(vecka(g.datum)))+
      rad('Datum',period(g.datum))+
      rad('Anläggning',g.anlaggning+', '+g.ort)+
      rad('Kursavgift',kr(g.kurspris)+' exkl. moms')+
      rad('Kost och logi',g.logi?kr(g.logi)+' exkl. moms':'Ingår i kursavgiften')+
      rad('Totalpris',kr(g.kurspris+g.logi)+' exkl. moms')+
      rad('Handledare',g.handledare)+
      '</dl>'+
      '<div class="field field-wide"><label for="g-orsak">Meddelande till arrangören <span>Valfritt vid godkännande, obligatoriskt vid nekande</span></label>'+
      '<textarea id="g-orsak" rows="2" placeholder="Till exempel vad som behöver kompletteras."></textarea></div>';
    var fot=g.status==='vantar'
      ? '<button class="button" id="g-ja">Godkänn och publicera</button><button class="button button-outline-dark" id="g-nej">Neka</button>'
      : '';
    modal(skal('Vecka '+vecka(g.datum)+', '+esc(g.anlaggning),kropp,fot,true));
    if($('g-ja'))$('g-ja').addEventListener('click',function(){
      g.status='godkand';g.orsak=$('g-orsak').value.trim();spara();stang();
      toast('Kursen är godkänd och syns nu i det publika utbudet.');rita();
    });
    if($('g-nej'))$('g-nej').addEventListener('click',function(){
      var o=$('g-orsak').value.trim();
      if(!o){toast('Skriv en kort motivering så vet arrangören vad som behöver ändras.');return}
      g.status='nekad';g.orsak=o;spara();stang();toast('Arrangören har fått besked.');rita();
    });
  }

  function foretagModal(id){
    var f=S.foretag.filter(function(x){return x.id===id})[0];
    var kropp='<div class="detalj-topp"><span class="n-init stor">'+init(f.namn)+'</span>'+
      '<div><b>'+esc(f.kontakt)+'</b><small>'+esc(f.epost)+'</small></div>'+
      '<div class="detalj-status">'+chip(f.status,KSTATUS)+'<small>Kund sedan '+dat(f.sedan)+'</small></div></div>'+
      '<dl class="avtal-lista">'+rad('Organisationsnummer',f.orgnr)+rad('Ort',f.ort)+
      rad('Antal anställda',String(f.anstallda))+rad('Bokade platser',String(f.bokade))+'</dl>';
    var fot='<button class="button" id="f-mejl">Skicka meddelande</button>';
    modal(skal(esc(f.namn),kropp,fot,true));
    $('f-mejl').addEventListener('click',function(){stang();toast('I skarpt läge öppnas ett meddelande till '+f.kontakt+'.')});
  }

  function leadModal(id){
    var l=S.leads.filter(function(x){return x.id===id})[0];
    var t=ledtid(l),k=kontakter(l);
    var kropp='<div class="detalj-topp"><span class="n-init stor">'+init(l.namn)+'</span>'+
      '<div><b>'+esc(l.namn)+'</b><small>'+esc(l.roll)+', '+esc(l.org)+'</small>'+
      '<small>'+esc(l.epost)+(l.telefon?' · '+esc(l.telefon):'')+'</small></div>'+
      '<div class="detalj-status">'+chip(l.status,LSTATUS)+'<small>'+(KALLA[l.kalla]||'')+'</small></div></div>';
    kropp+='<div class="kpi-rad kpi-tat">'+kpi(antalKontakter(l),'kontakter')+
      kpi(alderDagar(l),'dagar sedan första')+
      kpi(t!=null?t:tystDagar(l),t!=null?'dagar till bokning':'dagar sedan senaste')+
      kpi(l.varde?kr(l.varde):'-','värde')+'</div>';
    kropp+='<dl class="avtal-lista">'+rad('Organisation',l.org)+rad('Bransch',l.bransch||'-')+
      rad('Storlek',l.storlek?l.storlek+' anställda':'-')+
      rad('Kanal in',LTYP[l.typ])+
      rad('Kampanj',l.kampanj||'Ingen')+
      rad('Kurs',l.kurs+(l.kursdatum?', '+dat(l.kursdatum):''))+
      rad('Ansvarig',l.agare||'-')+'</dl>';
    kropp+='<div class="tidslinje-blk"><h4>Kontakthistorik</h4><ol class="tidslinje">'+
      k.map(function(x,i){
        var forra=i?Math.round((new Date(x.d)-new Date(k[i-1].d))/864e5):0;
        return '<li class="tl-'+x.riktning+'"><span class="tl-ikon">'+SVG(KANALIKON[x.kanal]||KANALIKON.mejl)+'</span>'+
          '<span class="tl-txt"><b>'+(KANAL[x.kanal]||x.kanal)+', '+(x.riktning==='in'?'kunden hörde av sig':'vi kontaktade')+'</b>'+
          '<span>'+esc(x.not)+'</span></span>'+
          '<span class="tl-dat">'+dat(x.d)+(i?'<small>'+(forra?dagar(forra)+' senare':'samma dag')+'</small>':'<small>första kontakt</small>')+'</span></li>'}).join('')+
      (l.bokad?'<li class="tl-bokad"><span class="tl-ikon">'+SVG('<path d="M4 12.5l5 5L20 6.5"/>')+'</span>'+
        '<span class="tl-txt"><b>Bokning</b><span>'+(l.varde?kr(l.varde)+' i värde':'Plats bokad')+'</span></span>'+
        '<span class="tl-dat">'+dat(l.bokad)+'<small>'+dagar(t)+' från start</small></span></li>':'')+
      '</ol></div>';
    kropp+='<div class="ny-kontakt"><h4>Logga en kontakt</h4><div class="form-grid">'+
      '<label class="ro"><span>Datum</span><input id="nk-datum" type="date" value="'+idagISO()+'"></label>'+
      '<label class="ro"><span>Kanal</span><select id="nk-kanal">'+Object.keys(KANAL).map(function(x){
        return '<option value="'+x+'">'+KANAL[x]+'</option>'}).join('')+'</select></label>'+
      '<label class="ro"><span>Riktning</span><select id="nk-rikt"><option value="ut">Vi kontaktade kunden</option><option value="in">Kunden hörde av sig</option></select></label>'+
      '<label class="ro"><span>Nytt status</span><select id="nk-status">'+Object.keys(LSTATUS).map(function(x){
        return '<option value="'+x+'"'+(l.status===x?' selected':'')+'>'+LSTATUS[x][0]+'</option>'}).join('')+'</select></label>'+
      '</div>'+
      '<div class="field field-wide"><label for="nk-not">Vad hände</label><input id="nk-not" placeholder="Kort notering, en rad räcker."></div>'+
      '<button class="mini mini-primar" id="nk-lagg">Lägg till kontakt</button></div>';
    kropp+='<div class="field field-wide"><label for="l-not">Anteckning om kunden</label><textarea id="l-not" rows="2">'+esc(l.not||'')+'</textarea></div>';
    var fot='<button class="button" id="l-spara">Spara</button>'+
      (l.status!=='vunnen'?'<button class="button button-outline-dark" id="l-bokad">Markera som bokad</button>':'')+
      '<button class="button button-outline-dark" id="l-mejl">Skicka mejl</button>';
    modal(skal(esc(l.namn),kropp,fot,true));
    $('nk-lagg').addEventListener('click',function(){
      var n=$('nk-not').value.trim();
      if(!n){toast('Skriv en kort notering om vad som hände.');return}
      l.kontakter=kontakter(l);
      l.kontakter.push({d:$('nk-datum').value||idagISO(),kanal:$('nk-kanal').value,riktning:$('nk-rikt').value,not:n});
      l.status=$('nk-status').value;
      if(l.status==='vunnen'&&!l.bokad)l.bokad=$('nk-datum').value||idagISO();
      l.not=$('l-not').value.trim();
      spara();stang();toast('Kontakten är loggad.');leadModal(id);
    });
    $('l-spara').addEventListener('click',function(){
      l.status=$('nk-status').value;l.not=$('l-not').value.trim();
      if(l.status==='vunnen'&&!l.bokad)l.bokad=idagISO();
      spara();stang();toast('Kundkortet är uppdaterat.');rita()});
    if($('l-bokad'))$('l-bokad').addEventListener('click',function(){
      l.status='vunnen';l.bokad=idagISO();
      l.kontakter=kontakter(l);
      l.kontakter.push({d:idagISO(),kanal:'mejl',riktning:'in',not:'Bokade plats'});
      spara();stang();toast('Bokningen är registrerad. Ledtiden blev '+dagar(ledtid(l))+'.');rita()});
    $('l-mejl').addEventListener('click',function(){stang();toast('I skarpt läge öppnas ett mejl till '+l.epost+'.')});
  }

  function fakturaModal(id){
    var f=S.fakturor.filter(function(x){return x.id===id})[0],a=arr(f.aid);
    var kropp='<div class="detalj-topp"><span class="n-init stor">'+(a.kort||init(a.namn))+'</span>'+
      '<div><b>'+esc(a.namn)+'</b><small>'+esc(f.period)+'</small></div>'+
      '<div class="detalj-status">'+chip(f.status,FSTATUS)+'</div></div>'+
      '<dl class="avtal-lista">'+rad('Bokningar i perioden',String(f.bokningar))+
      rad('Förmedlat värde',kr(f.brutto)+' exkl. moms')+
      rad('Provision',a.avtal.provision+' procent')+
      rad('Att fakturera',kr(f.belopp)+' exkl. moms')+
      rad('Förfallodag',dat(f.forfaller))+'</dl>';
    var fot=f.status==='utkast'?'<button class="button" id="fa-skicka">Skicka faktura</button>'
          :f.status==='betald'?'':'<button class="button" id="fa-betald">Markera som betald</button>'+
           '<button class="button button-outline-dark" id="fa-paminn">Skicka påminnelse</button>';
    modal(skal('Faktura, '+esc(f.period),kropp,fot,true));
    if($('fa-skicka'))$('fa-skicka').addEventListener('click',function(){f.status='skickad';spara();stang();toast('Fakturan är skickad.');rita()});
    if($('fa-betald'))$('fa-betald').addEventListener('click',function(){f.status='betald';spara();stang();toast('Fakturan är markerad som betald.');rita()});
    if($('fa-paminn'))$('fa-paminn').addEventListener('click',function(){stang();toast('Påminnelse skickad till '+a.kontakt+'.')});
  }

  function bjudInModal(typ){
    typ=typ||'arrangor';
    var kropp='<div class="form-grid">'+
      '<label class="ro ro-bred"><span>Vad bjuder du in</span><select id="bi-typ">'+
      Object.keys(ITYP).map(function(k){return '<option value="'+k+'"'+(typ===k?' selected':'')+'>'+ITYP[k]+'</option>'}).join('')+'</select></label>'+
      falt('bi-namn','Företag eller organisation','')+
      falt('bi-orgnr','Organisationsnummer','')+
      falt('bi-kontakt','Kontaktperson','')+
      falt('bi-epost','E-post','','email')+
      falt('bi-ort','Ort','')+
      '</div>'+
      '<div id="bi-avtal" class="avtal-val"><h4>Avtal</h4>'+
      '<div class="form-grid">'+
      '<label class="ro"><span>Avtalsmall</span><select id="bi-mall">'+MALLAR.map(function(m){
        return '<option>'+m.namn+'</option>'}).join('')+'</select></label>'+
      '<label class="ro"><span>Provision, procent</span><input id="bi-prov" type="number" step="0.5" value="12"></label>'+
      '<label class="ro"><span>Fast avgift per månad</span><input id="bi-avgift" type="number" value="0"></label>'+
      '<label class="ro"><span>Startdatum</span><input id="bi-start" type="date" value="'+idagISO()+'"></label>'+
      '</div><p class="tom" id="bi-malltext">'+MALLAR[0].text+'</p></div>'+
      '<div class="field field-wide"><label for="bi-medd">Personligt meddelande <span>Följer med i inbjudningsmejlet</span></label>'+
      '<textarea id="bi-medd" rows="2" placeholder="Hej och välkommen till UGL Sverige."></textarea></div>';
    var fot='<button class="button" id="bi-skicka">Skicka inbjudan</button>'+
      '<button class="button button-outline-dark" id="bi-avbryt">Avbryt</button>';
    modal(skal('Bjud in ny part',kropp,fot,true));
    function visa(){
      var t=$('bi-typ').value;
      $('bi-avtal').hidden=t!=='arrangor';
    }
    $('bi-typ').addEventListener('change',visa);visa();
    $('bi-mall').addEventListener('change',function(){
      var m=MALLAR.filter(function(x){return x.namn===$('bi-mall').value})[0];
      if(m){$('bi-prov').value=m.provision;$('bi-avgift').value=m.avgift;$('bi-malltext').textContent=m.text}
    });
    $('bi-avbryt').addEventListener('click',stang);
    $('bi-skicka').addEventListener('click',function(){
      var t=$('bi-typ').value,namn=$('bi-namn').value.trim(),ep=$('bi-epost').value.trim();
      if(!namn){toast('Fyll i namnet på organisationen.');return}
      if(!ep||ep.indexOf('@')<1){toast('Fyll i en e-postadress.');return}
      S.inbjudningar.push({id:nastaId++,typ:t,namn:namn,epost:ep,skickad:idagISO(),status:'skickad'});
      if(t==='arrangor'){
        var id=nastaId++;
        S.arrangorer.push({id:id,namn:namn,kort:init(namn),orgnr:$('bi-orgnr').value.trim(),ort:$('bi-ort').value.trim(),
          kontakt:$('bi-kontakt').value.trim()||'Kontaktperson',epost:ep,telefon:'',status:'inbjuden',sedan:idagISO(),
          avtal:{mall:$('bi-mall').value,provision:+$('bi-prov').value,avgift:+$('bi-avgift').value,
                 start:$('bi-start').value,slut:'',uppsagning:'3 månader',status:'signering'}});
        S.statistik.push({aid:id,kurser:0,platser:0,bokade:0,omsattning:0});
      }
      if(t==='foretag'){
        S.foretag.push({id:nastaId++,namn:namn,orgnr:$('bi-orgnr').value.trim(),ort:$('bi-ort').value.trim(),
          kontakt:$('bi-kontakt').value.trim()||'Kontaktperson',epost:ep,anstallda:0,bokade:0,status:'inbjuden',sedan:idagISO()});
      }
      if(t==='admin'){
        S.admins.push({id:nastaId++,namn:$('bi-kontakt').value.trim()||namn,epost:ep,roll:'Admin'});
      }
      spara();stang();
      toast('Inbjudan är skickad till '+ep+'.');
      rita(t==='arrangor'?'arrangorer':t==='foretag'?'foretag':'inbjudningar');
    });
  }

  /* ---------- Ram ---------- */
  var MENY=[['oversikt','Översikt'],['arrangorer','Arrangörer'],['granskning','Kurser att granska'],
            ['foretag','Arbetsgivare'],['leads','Leads'],['statistik','Statistik'],['ekonomi','Ekonomi'],
            ['inbjudningar','Inbjudningar'],['installningar','Inställningar']];
  var VYER={oversikt:vOversikt,arrangorer:vArrangorer,granskning:vGranskning,foretag:vForetag,
            leads:vLeads,statistik:vStatistik,ekonomi:vEkonomi,inbjudningar:vInbjudningar,installningar:vInstallningar};

  var OPPNA={
    arrangor:function(id){arrangorModal(id)},
    granska:function(id){granskaModal(id)},
    foretag:function(id){foretagModal(id)},
    lead:function(id){leadModal(id)},
    faktura:function(id){fakturaModal(id)},
    vy:function(v){rita(v)}
  };
  function radKlick(e){
    if(e.target.closest('button,a,input,select,textarea,label'))return;
    var r=e.target.closest('[data-oppna]');if(!r)return;
    var d=r.getAttribute('data-oppna').split(':');
    if(!OPPNA[d[0]])return;
    OPPNA[d[0]](d[0]==='vy'?d[1]:+d[1]);
  }

  function ritaMeny(){
    $('meny').innerHTML=MENY.map(function(m){
      var extra=m[0]==='granskning'?antalKo():'';
      return '<a href="#'+m[0]+'" data-vy="'+m[0]+'">'+m[1]+extra+'</a>'}).join('')+
      '<span class="meny-avdelare"></span><a href="/kurser" class="meny-extern">Publikt kursutbud &#8599;</a>'+
      '<a href="/leverantor" class="meny-extern">Leverantörsportal &#8599;</a>'+
      '<a href="/portal" class="meny-extern">Arbetsgivarportal &#8599;</a>'+
      '<span class="meny-version">Prototyp, bygge '+BYGGE+'</span>';
  }
  function antalKo(){
    var n=S.granskning.filter(function(g){return g.status==='vantar'}).length;
    return n?'<span class="meny-antal">'+n+'</span>':'';
  }

  function rita(vy){
    vy=vy||(location.hash||'#oversikt').slice(1);
    if(MENY.map(function(m){return m[0]}).indexOf(vy)<0)vy='oversikt';
    location.hash=vy;
    ritaMeny();
    document.querySelectorAll('#meny a[data-vy]').forEach(function(a){a.classList.toggle('ar-pa',a.getAttribute('data-vy')===vy)});
    try{$('vy').innerHTML=VYER[vy]()}
    catch(fel){$('vy').innerHTML='<div class="panel"><h2>Något gick fel i den här vyn</h2>'+
      '<p class="tom">Återställ demodata så fungerar den igen.</p><button class="button" id="nollstall">Återställ demodata</button></div>'}
    var n=attGora();
    $('notis-prick').hidden=!n.length;
    $('notis-lista').innerHTML=n.length?n.map(function(x){
      return '<li class="n-'+x.niva+'"><b>'+x.rubrik+'</b><span>'+x.text+'</span></li>'}).join('')
      :'<li class="n-info"><b>Inget nytt</b><span>Allt är hanterat.</span></li>';
    binda();
    $('vy').scrollTop=0;
  }

  function binda(){
    ['bjud-in','bjud-in2'].forEach(function(id){if($(id))$(id).addEventListener('click',function(){bjudInModal('arrangor')})});
    if($('bjud-arr'))$('bjud-arr').addEventListener('click',function(){bjudInModal('arrangor')});
    if($('bjud-ftg'))$('bjud-ftg').addEventListener('click',function(){bjudInModal('foretag')});
    if($('bjud-admin'))$('bjud-admin').addEventListener('click',function(){bjudInModal('admin')});
    if($('nollstall'))$('nollstall').addEventListener('click',function(){nollstall();toast('Demodata återställd.');rita('oversikt')});
    if($('nytt-underlag'))$('nytt-underlag').addEventListener('click',function(){
      var d=new Date(),per=MANADER[d.getMonth()].charAt(0).toUpperCase()+MANADER[d.getMonth()].slice(1)+' '+d.getFullYear();
      var nya=0;
      S.arrangorer.filter(function(a){return a.status==='aktiv'}).forEach(function(a){
        if(S.fakturor.some(function(f){return f.aid===a.id&&f.period===per}))return;
        var s=stat(a.id),brutto=Math.round(s.omsattning/12);
        S.fakturor.push({id:nastaId++,aid:a.id,period:per,bokningar:Math.max(1,Math.round(s.bokade/12)),
          brutto:brutto,belopp:Math.round(brutto*a.avtal.provision/100),
          forfaller:new Date(d.getFullYear(),d.getMonth()+1,0).toISOString().slice(0,10),status:'utkast'});
        nya++;
      });
      spara();
      toast(nya?nya+' underlag skapade för '+per+'.':'Underlag för '+per+' finns redan.');
      rita('ekonomi');
    });
    document.querySelectorAll('[data-lfilter]').forEach(function(b){b.addEventListener('click',function(){
      leadFilter=b.getAttribute('data-lfilter');rita('leads')})});
    document.querySelectorAll('[data-lkalla]').forEach(function(b){b.addEventListener('click',function(){
      leadKalla=b.getAttribute('data-lkalla');rita('leads')})});
    if($('l-sort'))$('l-sort').addEventListener('change',function(){leadSort=$('l-sort').value;rita('leads')});
    if($('exportera'))$('exportera').addEventListener('click',exportera);
    document.querySelectorAll('[data-paminn]').forEach(function(b){b.addEventListener('click',function(){
      var i=S.inbjudningar.filter(function(x){return x.id===+b.getAttribute('data-paminn')})[0];
      toast('Påminnelse skickad till '+i.epost+'.')})});
    document.querySelectorAll('[data-lank]').forEach(function(b){b.addEventListener('click',function(){
      var i=S.inbjudningar.filter(function(x){return x.id===+b.getAttribute('data-lank')})[0];
      var lank='https://uglsverige.store/valkommen?kod='+(i.typ.slice(0,3)+i.id+'k'+(1000+i.id*7));
      if(navigator.clipboard)navigator.clipboard.writeText(lank);
      toast('Inbjudningslänken är kopierad.')})});
  }

  function exportera(){
    var rub=['Namn','Roll','Organisation','Bransch','Storlek','E-post','Telefon','Kalla','Kampanj','Kanal in',
             'Kurs','Forsta kontakt','Senaste kontakt','Antal kontakter','Ledtid dagar','Bokad','Varde','Status','Anteckning'];
    var rader=S.leads.map(function(l){
      var t=ledtid(l);
      return [l.namn,l.roll,l.org,l.bransch,l.storlek,l.epost,l.telefon,KALLA[l.kalla]||l.kalla,l.kampanj,LTYP[l.typ],
              l.kurs,forstaKontakt(l),senasteKontakt(l),antalKontakter(l),t==null?'':t,l.bokad,l.varde||0,LSTATUS[l.status][0],l.not];
    });
    var csv=[rub].concat(rader).map(function(r){return r.map(function(c){
      return '"'+String(c==null?'':c).replace(/"/g,'""')+'"'}).join(';')}).join('\r\n');
    var b=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});
    var a=document.createElement('a');a.href=URL.createObjectURL(b);
    a.download='ugl-leads-'+idagISO()+'.csv';document.body.appendChild(a);a.click();a.remove();
    toast('Filen är exporterad, '+S.leads.length+' rader.');
  }

  /* ---------- Inloggning ---------- */
  $('login-form').addEventListener('submit',function(e){
    e.preventDefault();
    S=las()||JSON.parse(JSON.stringify(DEMO));
    var ep=$('log-epost').value.trim();
    if(ep&&ep.indexOf('@')>0){S.jag.namn=S.jag.namn;S.plattform.epost=ep}
    spara();
    $('kund-logga').textContent=S.plattform.kort;
    $('kund-namn').textContent=S.plattform.namn;
    $('kund-typ').textContent='Administration';
    $('anv-namn').textContent=S.jag.namn;
    $('anv-roll').textContent=S.jag.roll;
    $('anv-init').textContent=init(S.jag.namn);
    $('login').hidden=true;$('app').hidden=false;
    $('vy').addEventListener('click',radKlick);
    $('vy').addEventListener('keydown',function(ev){
      if(ev.key!=='Enter'&&ev.key!==' ')return;
      if(!ev.target.getAttribute||!ev.target.getAttribute('data-oppna'))return;
      ev.preventDefault();radKlick(ev);
    });
    rita();
  });
  $('logga-ut').addEventListener('click',function(){$('app').hidden=true;$('login').hidden=false});
  $('notis-knapp').addEventListener('click',function(){$('notis-panel').hidden=!$('notis-panel').hidden});
  $('notis-stang').addEventListener('click',function(){$('notis-panel').hidden=true});
  window.addEventListener('hashchange',function(){if(!$('app').hidden)rita()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')stang()});
})();
