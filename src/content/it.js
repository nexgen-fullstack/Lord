'use strict';
/* Italiano */

module.exports = {
  siteName: 'L’Esaltazione del Preziosissimo Sangue di Nostro Signore Gesù Cristo',
  brand: 'Preziosissimo Sangue',

  meta: {
    title: 'Il Preziosissimo Sangue di Gesù Cristo — Preghiere',
    ogTitle: 'L’Esaltazione del Preziosissimo Sangue di Nostro Signore Gesù Cristo',
    description: 'La preghiera dodicennale al Preziosissimo Sangue, l’atto di consacrazione, la preghiera di santa Geltrude, la Freccia d’Oro e il Cuore Eucaristico di Gesù.',
    keywords: 'Preziosissimo Sangue, devozione al Preziosissimo Sangue, preghiera dodicennale, preghiera di santa Geltrude, Freccia d’Oro, sacra Piaga della Spalla, Cuore Eucaristico di Gesù, preghiere cattoliche, anime del purgatorio',
    section: 'Devozione cattolica',
    genre: 'Preghiera'
  },

  ui: {
    skip: 'Vai alle preghiere',
    navLabel: 'Sezioni delle preghiere',
    navHome: 'Home',
    menuLabel: 'Apri il menu',
    closeLabel: 'Chiudi il menu',
    languageLabel: 'Scegli la lingua',
    print: 'Stampa le preghiere',
    audioOn: 'Attiva la musica devozionale',
    audioOff: 'Disattiva la musica devozionale',
    toTop: 'Torna su',

    textSizeLabel: 'Dimensione del testo',
    textSmaller:   'Testo più piccolo',
    textLarger:    'Testo più grande',
    textSizeHint:  'La scelta viene ricordata su questo dispositivo.',

    /* Offline app — install prompt, cache state, update notice. */
    installLabel:  'Installa l’app',
    installTitle:  'Il libro di preghiere sul telefono',
    installBody:   'Installa l’app e tutte le preghiere restano con te, anche senza rete.',
    installAction: 'Installa',
    installIos:    'In Safari tocca «Condividi», poi «Aggiungi alla schermata Home».',
    installedNote: 'L’app è installata. Le preghiere sono disponibili offline.',
    offlineReady:  'Tutte le preghiere salvate — puoi pregare senza rete.',
    offlineStored: 'Salvato su questo dispositivo: {done} di {total}',
    offlineComplete: 'Tutte le preghiere sono salvate su questo dispositivo — l’app funziona senza connessione.',
    offlineNow:    'Sei offline — le preghiere sono comunque qui.',
    backOnline:    'Connessione ripristinata.',
    updateReady:   'È pronto un libro di preghiere aggiornato.',
    updateAction:  'Aggiorna',
    dismiss:       'Chiudi',

    voiceLabel: 'Leggi le preghiere ad alta voce',
    voiceTitle: 'Preghiera con voce',
    voiceGender: 'Voce',
    voiceMale: 'Maschile',
    voiceFemale: 'Femminile',
    voicePlay: 'Leggi',
    voicePause: 'Pausa',
    voiceResume: 'Riprendi',
    voiceStop: 'Ferma',
    voiceIdle: 'Scegli una voce e premi «Leggi».',
    voiceReading: 'In lettura: {section}',
    voicePaused: 'Lettura in pausa.',
    voiceDone: 'Lettura terminata.',
    voiceNoGender: 'La voce «{gender}» non è disponibile per l’italiano sul tuo dispositivo — si usa quella presente.',
    voiceNoVoice: 'Il tuo browser non ha una voce italiana installata. Aggiungi un pacchetto lingua nel sistema.',
    voiceUnsupported: 'Il tuo browser non supporta la sintesi vocale.',

    nameDefault: '(nome)',

    tracker33Title: 'Cammino dei 33 giorni',
    tracker33Lead: 'Segna ogni giorno in cui hai recitato questa preghiera.',
    markToday: 'Segna oggi',
    resetProgress: 'Azzera',

    statusIdle: 'Non ancora iniziato — segna il tuo primo giorno.',
    statusDay33: 'Giorno {n} di {total} · {pct}%',
    statusMarked: 'segnato oggi, torna domani',
    statusDone33: '33 giorni compiuti. Sia lodato Gesù Cristo!',
    confirmReset: 'Azzerare tutto il cammino registrato?'
  },

  hero: {
    title: 'L’Esaltazione del Preziosissimo Sangue di Nostro Signore Gesù Cristo',
    quote: '«Tu ci hai redenti, o Signore, con il Tuo Preziosissimo Sangue, da ogni tribù, lingua, popolo e nazione.»',
    quoteRef: 'Apocalisse 5, 9',
    imageAlt: 'Gesù Cristo in croce; angeli raccolgono il Preziosissimo Sangue in calici d’oro',
    cta: 'Alle preghiere'
  },

  sections: [

    {
      id: 'devotion',
      nav: 'Preghiera dodicennale',
      title: 'La devozione al santo Sangue di Dio',
      subtitle: 'La preghiera da recitarsi ogni giorno per dodici anni',
      blocks: [
        { t: 'chant', lines: [
          'Kyrie eleison, Christe eleison,',
          'Kyrie eleison, Christe eleison,',
          'Kyrie eleison, Christe eleison.'
        ] },

        { t: 'litany', items: [
          ['O Cristo,', 'ascoltami.'],
          ['O Cristo,', 'esaudiscimi.'],
          ['Padre celeste, Dio,', 'abbi pietà di me.'],
          ['Figlio, Redentore del mondo, Dio,', 'abbi pietà di me.'],
          ['Spirito Santo, Dio,', 'abbi pietà di me.'],
          ['Santissima Trinità, unico Dio,', 'abbi pietà di me.'],
          ['Santa Maria,', 'prega per me.'],
          ['Madre del Salvatore sofferente,', 'prega per me.']
        ] },

        { t: 'litany', items: [
          ['O Preziosissimo Sangue del Signore, versato nella circoncisione,', 'purificami dai miei peccati.'],
          ['O Preziosissimo Sangue del Signore, versato nella flagellazione,', 'purificami dai miei peccati.'],
          ['O Preziosissimo Sangue del Signore, versato sotto la corona di spine,', 'purificami dai miei peccati.'],
          ['O Preziosissimo Sangue del Signore, versato sulla via della Croce,', 'purificami dai miei peccati.'],
          ['O Preziosissimo Sangue del Signore, versato quando le Sue santissime mani furono inchiodate alla Croce,', 'purificami dai miei peccati.'],
          ['O Preziosissimo Sangue del Signore, versato quando i Suoi santissimi piedi furono inchiodati alla Croce,', 'purificami dai miei peccati.'],
          ['O Preziosissimo Sangue del Signore, versato dal Suo santissimo Cuore trafitto dalla lancia,', 'purificami dai miei peccati.'],
          ['O Preziosissimo Sangue del Signore, versato per me, indegno peccatore,', 'purificami dai miei peccati.'],
          ['O Preziosissimo Sangue del Signore, versato fino all’ultima goccia per me e per i miei peccati,', 'abbi pietà di me.']
        ] },

        { t: 'litany', items: [
          ['O Gesù, per il Tuo Preziosissimo Sangue versato per me sulla Croce,', 'Ti rendo grazie.'],
          ['O Gesù, per il Tuo Preziosissimo Sangue oltraggiato sul Golgota,', 'Ti chiedo perdono.'],
          ['O Gesù, per ogni profanazione del Tuo Preziosissimo Sangue nella santa Messa mediante comunioni indegne,', 'Ti chiedo perdono.']
        ] },

        { t: 'litany', items: [
          ['Io, peccatore, Ti prego, o Dio:', 'salvami con il Tuo Preziosissimo Sangue.'],
          ['Io, peccatore, Ti prego, o Dio:', 'proteggimi con il Tuo Preziosissimo Sangue.'],
          ['Io, peccatore, Ti prego, o Dio:', 'dissetami con il Tuo Preziosissimo Sangue.']
        ] },

        { t: 'litany', items: [
          ['Agnello di Dio, che togli i peccati del mondo,', 'esaudiscimi, o Signore.'],
          ['Agnello di Dio, che togli i peccati del mondo,', 'perdonami, o Signore.'],
          ['Agnello di Dio, che togli i peccati del mondo,', 'abbi pietà di me, o Signore.']
        ] },

        { t: 'chant', lines: ['Kyrie eleison, Christe eleison (tre volte)'] },

        { t: 'lead', x: 'O Preziosissimo Sangue di Nostro Signore Gesù Cristo, sii esaltato e glorificato da tutti noi, ora e sempre e nei secoli dei secoli. Amen.' },

        { t: 'rule' },

        { t: 'p', x: 'Dio onnipotente, mio Salvatore, con una sola goccia del Tuo Preziosissimo Sangue avresti potuto redimere milioni di mondi. Eppure, per il Tuo amore senza limiti verso di me peccatore, hai versato l’ultima goccia del Tuo Preziosissimo Sangue, offrendola a Dio Padre per i miei peccati.' },
        { t: 'p', x: 'O Gesù, Tu lo offri ogni giorno anche sugli altari del mondo intero in ogni santa Messa. Tu effondi il Tuo Sangue sotto le specie del vino e lo offri per la mia redenzione. Lo hai versato per nutrire la mia anima alla vita eterna.' },
        { t: 'p', x: 'Io, peccatore, cado in umiltà davanti alla Tua maestà e Ti supplico, per la Tua misericordia infinita: abbi pietà di me peccatore. O Salvatore, Ti prego di far tornare i peccatori induriti, perché al più presto si convertano da quello stato terribile. Rinnova la santa fede in tutti i popoli, affinché ritornino all’unità.' },
        { t: 'p', x: 'Signore, questo è il nostro grande desiderio: che tutti gli uomini del mondo servano Te solo e glorifichino il Tuo Preziosissimo Sangue.' },
        { t: 'p', x: 'O Dio, abbi pietà delle anime del purgatorio, poiché attendono il Tuo perdono.' },
        { t: 'p', x: 'Il Tuo Preziosissimo Sangue, versato per i nostri peccati, ottenga loro il perdono dal Padre celeste e le conduca alla felicità eterna. Amen.' },

        { t: 'rule' },

        { t: 'p', x: 'Signore Gesù Cristo, mio Salvatore, difendimi dalle insidie delle tentazioni diaboliche con il Tuo Preziosissimo Sangue.' },
        { t: 'p', x: 'Signore Gesù Cristo, mio Salvatore, aiutami con il Tuo Preziosissimo Sangue a vincere le tentazioni.' },
        { t: 'p', x: 'Signore Gesù Cristo, mio Salvatore, custodiscimi e guidami dietro a Te per il Tuo Preziosissimo Sangue.' },
        { t: 'p', x: 'Signore Gesù Cristo, mio Salvatore, custodisci da ogni pericolo il Santo Padre con tutto il clero e la santa Chiesa per il Tuo Preziosissimo Sangue. Amen.' },

        { t: 'box', title: 'La regola di preghiera', x: [
          '**Padre nostro…** (7 volte) · **Ave Maria…** (7 volte) · **Gloria al Padre…** (7 volte)',
          'La preghiera si recita **ogni giorno per dodici anni**, senza interruzione.'
        ] },

        { t: 'promise', title: 'Le promesse divine', x: [
          'Chi reciterà questa preghiera ogni giorno per dodici anni, pregando senza interruzione, non passerà per il purgatorio.',
          'Chi ha cominciato a pregarla e muore dopo sei mesi riceverà ugualmente tutte queste grandi grazie: cinque anime della sua famiglia riceveranno la vocazione allo stato religioso, e fino alla quarta generazione nessuno della sua famiglia sarà nell’inferno.',
          'Questa preghiera dodicennale ha il potere di purificare l’anima da ogni iniquità. _Signore, dona la Tua benedizione!_'
        ] }
      ]
    },

    {
      id: 'consecration',
      nav: 'Consacrazione',
      title: 'Atto di consacrazione personale al Preziosissimo Sangue di Gesù Cristo',
      subtitle: '',
      blocks: [
        { t: 'p', x: 'Nella piena consapevolezza del mio nulla e insieme della Tua grandezza, o misericordioso Salvatore, mi prostro ai Tuoi piedi e Ti ringrazio per le innumerevoli prove di grazia che hai concesso a me, creatura ingrata, e soprattutto per avermi liberato, mediante il Tuo Preziosissimo Sangue, dal potere corruttore di satana. Alla presenza della mia amata Madre Maria, del mio Angelo custode, dei miei santi patroni e di tutta la corte celeste, mi consacro, o dolcissimo Gesù, con tutta la sincerità del cuore e nel modo più libero, al Tuo Preziosissimo Sangue, con il quale hai redento il mondo intero dal peccato, dalla morte e dall’inferno.' },

        { t: 'p', x: 'Io, {{name}}, Ti prometto, confidando nell’aiuto della Tua grazia, di risvegliare e diffondere con tutte le mie forze e secondo tutte le mie possibilità la devozione al Tuo Preziosissimo Sangue, Prezzo della nostra Redenzione, affinché il Tuo Sangue, degno della più alta venerazione, sia da tutti onorato e amato.' },

        { t: 'p', x: 'In questo modo desidero riparare la mia infedeltà verso il Tuo Preziosissimo Sangue e verso il Tuo Amore, e darTi soddisfazione per le innumerevoli profanazioni e oltraggi che gli uomini infliggono a quel Prezzo carissimo della nostra salvezza. Oh, se i miei stessi peccati, la mia tiepidezza e tutti gli oltraggi con cui Ti ho mai disonorato, o Preziosissimo Sangue, potessero essere ridotti al nulla!' },

        { t: 'p', x: 'Ecco, dolcissimo Gesù, Ti offro anche l’amore, l’onore e l’adorazione che la Tua santissima Madre, i Tuoi fedeli discepoli e tutti i santi hanno reso al Tuo Preziosissimo Sangue. Ti prego: non ricordare più la mia passata infedeltà e tiepidezza, e degnati di perdonare tutti coloro che Ti oltraggiano. Aspergi me, o divino Salvatore, con il Tuo Preziosissimo Sangue, e con esso tutti gli uomini, affinché d’ora in poi Ti amiamo con tutto il cuore, o Amore crocifisso, e possiamo onorare degnamente per sempre il Prezzo della nostra Redenzione. Amen.' }
      ]
    },

    {
      id: 'gertrude',
      nav: 'S. Geltrude',
      title: 'La preghiera di santa Geltrude la Grande',
      subtitle: 'Per la liberazione delle anime dal Purgatorio',
      blocks: [
        { t: 'promise', title: 'La promessa di Nostro Signore Gesù', x: [
          'Nostro Signore Gesù rivelò a santa Geltrude la Grande che una sola recita di questa preghiera libera **mille anime dal Purgatorio**.'
        ] },

        { t: 'lead', x: '«Eterno Padre, Ti offro il Preziosissimo Sangue del Tuo divin Figlio, Nostro Signore Gesù Cristo, in unione con tutte le sante Messe che oggi si celebrano in tutto il mondo: per le anime del purgatorio, per i moribondi, per i peccatori del mondo, per i peccatori della Chiesa universale, per i peccatori della mia famiglia e della mia casa. Amen.»' },

        { t: 'note', x: '(Indulgenza di 500 giorni.)' }
      ]
    },

    {
      id: 'golden-arrow',
      nav: 'Freccia d’Oro',
      title: 'L’atto di adorazione «La Freccia d’Oro»',
      subtitle: 'In lode del santissimo Nome di Dio',
      blocks: [
        { t: 'poem', lines: [
          'Sia per sempre lodato,',
          'Benedetto, amato,',
          'Adorato e glorificato',
          'Il santissimo, sacratissimo,',
          'Adorabilissimo, incomprensibile',
          'E ineffabile Nome di Dio',
          'In cielo, in terra e negli abissi,',
          'Da tutte le creature',
          'Uscite dalle mani di Dio,',
          'E dal santissimo Cuore di Nostro Signore Gesù Cristo',
          'Nel Santissimo Sacramento dell’altare. Amen.'
        ] },

        { t: 'note', x: '(Questo atto di adorazione appartiene alla confraternita del Santo Volto di Gesù.)' }
      ]
    },

    {
      id: 'shoulder-wound',
      nav: 'Piaga della Spalla',
      title: 'Preghiera alla sacra Piaga della Spalla di Cristo',
      subtitle: '',
      blocks: [
        { t: 'p', x: 'O amabilissimo Gesù, mio mitissimo Agnello di Dio! Io, povero peccatore, saluto e adoro quella Tua santissima Piaga che Ti procurò un dolore così acuto quando portasti la pesante Croce sulla Tua divina Spalla. Quel dolore fu più grave e più amaro delle altre Piaghe del Tuo santo Corpo. Ti amo, Ti rendo onore e mi prostro davanti a Te dal profondo del cuore.' },

        { t: 'p', x: 'Ti ringrazio per quella profondissima Piaga della Tua Spalla. Umilmente Ti prego, in nome della sofferenza che hai patito per la Piaga della Spalla e in nome della Tua pesante Croce che hai portato su quella santa Piaga: abbi pietà di me, indegno peccatore. Perdonami tutti i peccati e concedimi che, camminando sulle Tue orme insanguinate, io giunga alla beata eternità. Amen.' },

        { t: 'box', title: 'La regola di preghiera', x: [
          '**Padre nostro…** (3 volte) · **Ave Maria…** (3 volte)',
          '_Sii benedetto, o Signore, nascosto nel Santissimo Sacramento._ (3 volte)'
        ] },

        { t: 'lead', x: 'O Preziosissimo Sangue che scorri dal sacro Capo di Nostro Signore Gesù Cristo, Tempio della divina Sapienza e Dimora di Dio, della scienza, della luce del cielo e della terra: custodiscimi ora e nei secoli dei secoli. Amen.' }
      ]
    },

    {
      id: 'eucharistic-heart',
      nav: 'Cuore Eucaristico',
      title: 'Preghiera al Cuore Eucaristico di Gesù',
      subtitle: 'La devozione dei trentatré giorni',
      blocks: [
        { t: 'lead', x: '«Gesù, Maria, vi amo — salvate le anime. O Sangue e Acqua, che scaturisti dal santissimo Cuore di Cristo come Fonte di Misericordia per noi, confidiamo in Te. Gesù, confidiamo in Te e in Te riponiamo ogni nostra speranza.»' },

        { t: 'refrain', x: 'Cuore Eucaristico di Gesù, confido in Te.' },

        { t: 'litany', ordered: true, items: [
          ['Cuore Eucaristico di Gesù, ardente d’Amore,', 'accendi d’amore i nostri cuori.'],
          ['Cuore Eucaristico di Gesù,', 'accresci in noi la fede e l’amore.'],
          ['Cuore Eucaristico di Gesù, Fonte della retta volontà,', 'donaci una volontà retta.'],
          ['Cuore Eucaristico di Gesù, Creatore del mondo, che tieni il mondo nella Tua Mano,', 'non lasciarci uscire dalla Tua protezione.'],
          ['Cuore Eucaristico di Gesù, Medico di Dio, che hai subìto la morte sulla Croce,', 'guarisci le ferite dei nostri peccati.'],
          ['Cuore Eucaristico di Gesù, in memoria della Tua amara Passione,', 'donaci vero dolore e il perdono dei peccati.'],
          ['Cuore Eucaristico di Gesù, Specchio della Luce eterna,', 'concedici di contemplarTi nell’eternità.'],
          ['Cuore Eucaristico di Gesù,', 'mostrati misericordioso verso di noi nell’ora della nostra morte.'],
          ['Cuore Eucaristico di Gesù,', 'spegni in noi del tutto l’ardore delle brame del mondo.'],
          ['Cuore Eucaristico di Gesù, Bontà dei cuori,', 'per il Tuo Preziosissimo Sangue vieni a noi nell’ora della nostra morte.']
        ] },

        { t: 'refrain', x: 'Cuore Eucaristico di Gesù, confido in Te.' },

        { t: 'rule' },

        { t: 'litany', items: [
          ['Cuore Eucaristico di Gesù, fonte inesauribile di vita e di santità,', 'santificami con il Tuo Preziosissimo Sangue.'],
          ['Cuore Eucaristico di Gesù, fornace di amore inestinguibile,', 'accendi il mio cuore d’amore per Te.'],
          ['Cuore Eucaristico di Gesù, che ci attendi con pazienza nel tabernacolo,', 'insegnami la fedeltà.'],
          ['Cuore Eucaristico di Gesù, oltraggiato dalle comunioni indegne,', 'accetta la mia riparazione.'],
          ['Cuore Eucaristico di Gesù, Pane degli angeli e cibo delle anime,', 'sazia la mia povertà.'],
          ['Cuore Eucaristico di Gesù, conforto degli afflitti e forza dei deboli,', 'sostienimi lungo il cammino.'],
          ['Cuore Eucaristico di Gesù, rifugio dei peccatori,', 'non respingermi.'],
          ['Cuore Eucaristico di Gesù, consolazione delle anime del purgatorio,', 'liberale con il Tuo Preziosissimo Sangue.'],
          ['Cuore Eucaristico di Gesù, Viatico dei morenti,', 'assistimi nella mia ultima ora.'],
          ['Cuore Eucaristico di Gesù, pieno di misericordia verso di noi,', 'abbi pietà di me.']
        ] },

        { t: 'p', x: 'O Cuore Eucaristico di Gesù, che per amore nostro sei rimasto con noi sotto le specie del pane e del vino fino alla fine dei secoli, accogli questa mia povera preghiera. Credo che Tu sia qui presente, veramente, realmente e sostanzialmente; spero nella Tua misericordia e Ti amo sopra ogni cosa. Per tutti gli oltraggi che ricevi nel Santissimo Sacramento, Ti offro il Preziosissimo Sangue che hai versato per me sulla Croce. Amen.' },

        { t: 'promise', title: 'La promessa dei 33 giorni', x: [
          'Chi per **trentatré giorni** — in memoria dei trentatré anni della vita terrena del Salvatore — reciterà ogni giorno e senza interruzione questa preghiera al Cuore Eucaristico di Gesù, otterrà la **completa remissione della pena e della colpa**.',
          '_Si recita in stato di grazia santificante, accostandosi alla santa Confessione e alla Comunione._'
        ] },

        { t: 'tracker', kind: '33d' }
      ]
    }
  ],

  footer: {
    motto: 'O Preziosissimo Sangue di Nostro Signore Gesù Cristo, salvami!',
    note: 'Devozione privata. Le promesse legate a queste preghiere provengono da rivelazioni private e non sono articoli di fede.',
    copyright: 'Devozione al Preziosissimo Sangue di Cristo'
  }
};
