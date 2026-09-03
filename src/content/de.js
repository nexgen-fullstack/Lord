'use strict';
/* Deutsch */

module.exports = {
  siteName: 'Die Verherrlichung des kostbarsten Blutes unseres Herrn Jesus Christus',
  brand: 'Kostbares Blut',

  meta: {
    title: 'Das kostbarste Blut Jesu Christi — Gebete & Andacht',
    ogTitle: 'Die Verherrlichung des kostbarsten Blutes unseres Herrn Jesus Christus',
    description: 'Das zwölfjährige Gebet zum kostbarsten Blute, der Weiheakt, das Gebet der hl. Gertrud, der Goldene Pfeil, die Schulterwunde und das eucharistische Herz Jesu.',
    keywords: 'Kostbares Blut, Kostbarstes Blut Jesu, zwölfjähriges Gebet, Andacht zum kostbaren Blut, hl. Gertrud die Große Gebet, Goldener Pfeil, heilige Schulterwunde, eucharistisches Herz Jesu, katholische Gebete, Arme Seelen',
    section: 'Katholische Andacht',
    genre: 'Gebet'
  },

  ui: {
    skip: 'Zu den Gebeten springen',
    navLabel: 'Gebetsabschnitte',
    navHome: 'Startseite',
    menuLabel: 'Menü öffnen',
    closeLabel: 'Menü schließen',
    languageLabel: 'Sprache wählen',
    print: 'Gebete drucken',
    audioOn: 'Leise Andachtsmusik einschalten',
    audioOff: 'Andachtsmusik ausschalten',
    toTop: 'Nach oben',

    /* Offline app — install prompt, cache state, update notice. */
    installLabel:  'App installieren',
    installTitle:  'Das Gebetbuch auf dem Telefon',
    installBody:   'Installieren Sie die App, und alle Gebete bleiben bei Ihnen — mit oder ohne Netz.',
    installAction: 'Installieren',
    installIos:    'In Safari auf „Teilen“ tippen, dann auf „Zum Home-Bildschirm“.',
    installedNote: 'Die App ist installiert. Die Gebete sind offline verfügbar.',
    offlineReady:  'Alle Gebete gespeichert — Sie können ohne Netz beten.',
    offlineStored: 'Auf diesem Gerät gespeichert: {done} von {total}',
    offlineComplete: 'Alle Gebete sind auf diesem Gerät gespeichert — die App funktioniert ohne Verbindung.',
    offlineNow:    'Keine Verbindung — die Gebete sind weiterhin da.',
    backOnline:    'Verbindung wiederhergestellt.',
    updateReady:   'Ein aktualisiertes Gebetbuch ist bereit.',
    updateAction:  'Aktualisieren',
    dismiss:       'Schließen',

    voiceLabel: 'Die Gebete laut vorlesen',
    voiceTitle: 'Gebet mit Stimme',
    voiceGender: 'Stimme',
    voiceMale: 'Männlich',
    voiceFemale: 'Weiblich',
    voicePlay: 'Vorlesen',
    voicePause: 'Pause',
    voiceResume: 'Weiter',
    voiceStop: 'Stopp',
    voiceIdle: 'Wählen Sie eine Stimme und drücken Sie „Vorlesen“.',
    voiceReading: 'Es wird gelesen: {section}',
    voicePaused: 'Vorlesen angehalten.',
    voiceDone: 'Vorlesen beendet.',
    voiceNoGender: 'Keine {gender} Stimme für Deutsch in Ihrem Browser verfügbar — es wird die vorhandene verwendet.',
    voiceNoVoice: 'In Ihrem Browser ist keine deutsche Stimme installiert. Bitte fügen Sie ein Sprachpaket hinzu.',
    voiceUnsupported: 'Ihr Browser unterstützt keine Sprachsynthese.',

    nameDefault: '(Name)',

    tracker33Title: 'Fortschritt der 33 Tage',
    tracker33Lead: 'Markieren Sie jeden Tag, an dem Sie dieses Gebet verrichtet haben.',
    markToday: 'Heute markieren',
    resetProgress: 'Zurücksetzen',

    statusIdle: 'Noch nicht begonnen — markieren Sie Ihren ersten Tag.',
    statusDay33: 'Tag {n} von {total} · {pct}%',
    statusMarked: 'heute markiert, kehren Sie morgen zurück',
    statusDone33: '33 Tage vollendet. Gelobt sei Jesus Christus!',
    confirmReset: 'Den gesamten aufgezeichneten Fortschritt zurücksetzen?'
  },

  hero: {
    title: 'Die Verherrlichung des kostbarsten Blutes unseres Herrn Jesus Christus',
    quote: '„Du hast mich, o Herr, durch dein kostbarstes Blut erkauft aus jedem Stamm und jeder Sprache, aus jedem Volk und jeder Nation.“',
    quoteRef: 'Offenbarung 5, 9',
    imageAlt: 'Jesus Christus am Kreuz; Engel sammeln das kostbarste Blut in goldenen Kelchen',
    cta: 'Zu den Gebeten'
  },

  sections: [

    {
      id: 'devotion',
      nav: 'Zwölfjähriges Gebet',
      title: 'Die Andacht zum heiligen Blute Gottes',
      subtitle: 'Das Gebet, das zwölf Jahre lang täglich gebetet wird',
      blocks: [
        { t: 'chant', lines: [
          'Kyrie eleison, Christe eleison,',
          'Kyrie eleison, Christe eleison,',
          'Kyrie eleison, Christe eleison.'
        ] },

        { t: 'litany', items: [
          ['O Christus,', 'höre mich.'],
          ['O Christus,', 'erhöre mich.'],
          ['Gott Vater vom Himmel,', 'erbarme dich meiner.'],
          ['Gott Sohn, Erlöser der Welt,', 'erbarme dich meiner.'],
          ['Gott Heiliger Geist,', 'erbarme dich meiner.'],
          ['Heilige Dreifaltigkeit, ein einiger Gott,', 'erbarme dich meiner.'],
          ['Heilige Maria,', 'bitte für mich.'],
          ['Mutter des leidenden Erlösers,', 'bitte für mich.']
        ] },

        { t: 'litany', items: [
          ['O kostbarstes Blut des Herrn, bei der Beschneidung vergossen,', 'reinige mich von meinen Sünden.'],
          ['O kostbarstes Blut des Herrn, bei der Geißelung vergossen,', 'reinige mich von meinen Sünden.'],
          ['O kostbarstes Blut des Herrn, unter der Dornenkrone vergossen,', 'reinige mich von meinen Sünden.'],
          ['O kostbarstes Blut des Herrn, auf dem Kreuzweg vergossen,', 'reinige mich von meinen Sünden.'],
          ['O kostbarstes Blut des Herrn, bei der Annagelung deiner heiligsten Hände an das Kreuz vergossen,', 'reinige mich von meinen Sünden.'],
          ['O kostbarstes Blut des Herrn, bei der Annagelung deiner heiligsten Füße an das Kreuz vergossen,', 'reinige mich von meinen Sünden.'],
          ['O kostbarstes Blut des Herrn, aus deinem von der Lanze durchbohrten heiligsten Herzen vergossen,', 'reinige mich von meinen Sünden.'],
          ['O kostbarstes Blut des Herrn, für mich unwürdigen Sünder vergossen,', 'reinige mich von meinen Sünden.'],
          ['O kostbarstes Blut des Herrn, bis zum letzten Tropfen für mich und meine Sünden vergossen,', 'erbarme dich meiner.']
        ] },

        { t: 'litany', items: [
          ['O Jesus, für dein kostbarstes Blut, das du für mich am Kreuze vergossen hast,', 'danke ich dir.'],
          ['O Jesus, für dein kostbarstes Blut, das auf Golgotha geschmäht wurde,', 'bitte ich dich um Verzeihung.'],
          ['O Jesus, für jede Schmähung deines kostbarsten Blutes in der heiligen Messe durch unwürdige Kommunionen,', 'bitte ich dich um Verzeihung.']
        ] },

        { t: 'litany', items: [
          ['Ich, ein Sünder, bitte dich, o Gott:', 'rette mich durch dein kostbarstes Blut.'],
          ['Ich, ein Sünder, bitte dich, o Gott:', 'birg mich in deinem kostbarsten Blute.'],
          ['Ich, ein Sünder, bitte dich, o Gott:', 'tränke mich mit deinem kostbarsten Blute.']
        ] },

        { t: 'litany', items: [
          ['Lamm Gottes, du nimmst hinweg die Sünden der Welt,', 'erhöre mich, o Herr.'],
          ['Lamm Gottes, du nimmst hinweg die Sünden der Welt,', 'verzeihe mir, o Herr.'],
          ['Lamm Gottes, du nimmst hinweg die Sünden der Welt,', 'erbarme dich meiner, o Herr.']
        ] },

        { t: 'chant', lines: ['Kyrie eleison, Christe eleison (dreimal)'] },

        { t: 'lead', x: 'O kostbarstes Blut unseres Herrn Jesus Christus, sei erhoben und verherrlicht von uns allen, jetzt und immerdar und in alle Ewigkeit. Amen.' },

        { t: 'rule' },

        { t: 'p', x: 'Allmächtiger Gott, mein Erlöser! Mit einem einzigen Tropfen deines kostbarsten Blutes hättest du Millionen von Welten erlösen können. Doch aus deiner grenzenlosen Liebe zu mir Sünder hast du den letzten Tropfen deines kostbarsten Blutes vergossen und ihn Gott dem Vater für meine Sünden aufgeopfert.' },
        { t: 'p', x: 'O Jesus, du opferst es täglich auch auf den Altären der ganzen Welt in jeder heiligen Messe. Du gießt dein Blut unter der Gestalt des Weines aus und opferst es für meine Erlösung. Du hast es vergossen zur Speise meiner Seele für das ewige Leben.' },
        { t: 'p', x: 'Ich, ein Sünder, falle in Demut vor deiner Majestät nieder und flehe dich an um deiner grenzenlosen Barmherzigkeit willen: erbarme dich meiner, des Sünders. Erlöser, ich bitte dich, die verstockten Sünder umzuwenden, damit sie sich möglichst bald aus jenem schrecklichen Zustand bekehren. Erneuere den heiligen Glauben in allen Völkern, damit sie zur Einheit zurückkehren.' },
        { t: 'p', x: 'Herr, dies ist unser großes Verlangen: dass alle Menschen der Welt dir allein dienen und dein kostbarstes Blut verherrlichen.' },
        { t: 'p', x: 'O Gott, erbarme dich der Seelen im Fegefeuer, denn sie harren deiner Begnadigung.' },
        { t: 'p', x: 'Möge dein kostbarstes Blut, für unsere Sünden vergossen, ihnen beim himmlischen Vater Verzeihung erwirken und sie zur ewigen Seligkeit führen. Amen.' },

        { t: 'rule' },

        { t: 'p', x: 'Herr Jesus Christus, mein Erlöser, bewahre mich durch dein kostbarstes Blut vor den Nachstellungen teuflischer Versuchungen.' },
        { t: 'p', x: 'Herr Jesus Christus, mein Erlöser, hilf mir durch dein kostbarstes Blut, die Versuchungen zu überwinden.' },
        { t: 'p', x: 'Herr Jesus Christus, mein Erlöser, behüte mich und führe mich dir nach um deines kostbarsten Blutes willen.' },
        { t: 'p', x: 'Herr Jesus Christus, mein Erlöser, bewahre uns den Heiligen Vater mit der ganzen Geistlichkeit und der heiligen Kirche vor allen Gefahren um deines kostbarsten Blutes willen. Amen.' },

        { t: 'box', title: 'Die Gebetsregel', x: [
          '**Vater unser…** (7 mal) · **Gegrüßet seist du, Maria…** (7 mal) · **Ehre sei dem Vater…** (7 mal)',
          'Das Gebet wird **täglich zwölf Jahre lang** ohne Unterbrechung verrichtet.'
        ] },

        { t: 'promise', title: 'Die göttlichen Verheißungen', x: [
          'Wer dieses Gebet zwölf Jahre lang täglich und ohne Unterbrechung verrichtet, wird nicht durch das Fegefeuer gehen.',
          'Wer zu beten begonnen hat und nach einem halben Jahr stirbt, empfängt dennoch all diese großen Gnaden: fünf Seelen aus seiner Familie erhalten den Ruf zum geistlichen Stand, und bis in die vierte Generation wird niemand aus seiner Familie in der Hölle sein.',
          'Dieses zwölfjährige Gebet hat die Kraft, die Seele von allen Ungerechtigkeiten zu reinigen. _Herr, gib deinen Segen!_'
        ] }
      ]
    },

    {
      id: 'consecration',
      nav: 'Weihe',
      title: 'Akt der persönlichen Weihe an das kostbarste Blut Jesu Christi',
      subtitle: '',
      blocks: [
        { t: 'p', x: 'In vollem Bewusstsein meiner Nichtigkeit und zugleich deiner Größe, o barmherziger Erlöser, falle ich zu deinen Füßen nieder und danke dir für die zahllosen Beweise der Gnade, die du mir, dem undankbaren Geschöpf, erwiesen hast, und vor allem dafür, dass du mich durch dein kostbarstes Blut von der verderbenden Macht Satans befreit hast. In Gegenwart meiner geliebten Mutter Maria, meines Schutzengels, meiner heiligen Patrone und des ganzen himmlischen Hofes weihe ich mich, o liebster Jesus, mit ganzer Aufrichtigkeit des Herzens und aus freiestem Willen deinem kostbarsten Blute, durch das du die ganze Welt von Sünde, Tod und Hölle erlöst hast.' },

        { t: 'p', x: 'Ich, {{name}}, verspreche dir, auf die Hilfe deiner Gnade vertrauend, mit allen meinen Kräften und nach allen meinen Möglichkeiten die Andacht zu deinem kostbarsten Blute, dem Preis unserer Erlösung, zu wecken und zu verbreiten, damit dein Blut, der höchsten Verehrung würdig, von allen geehrt und geliebt werde.' },

        { t: 'p', x: 'Auf diese Weise will ich meine Untreue gegen dein kostbarstes Blut und deine Liebe wiedergutmachen und dir Genugtuung leisten für die zahllosen Entweihungen und Schmähungen, welche die Menschen jenem kostbarsten Preis unseres Heiles zufügen. Oh, könnten doch meine eigenen Sünden, meine Lauheit und alle Schmähungen, mit denen ich dich, o kostbarstes Blut, jemals entehrt habe, ins Nichts zurückgenommen werden!' },

        { t: 'p', x: 'Siehe, liebster Jesus, ich opfere dir auch die Liebe, die Ehre und die Anbetung auf, welche deine heiligste Mutter, deine treuen Jünger und alle Heiligen deinem kostbarsten Blute dargebracht haben. Ich bitte dich: gedenke nicht mehr meiner früheren Untreue und Lauheit, und verzeihe allen, die dich schmähen. Besprenge mich, o göttlicher Erlöser, mit deinem kostbarsten Blute, und mit ihm alle Menschen, damit wir dich, gekreuzigte Liebe, sogleich von ganzem Herzen lieben und den Preis unserer Erlösung allezeit aufs würdigste verehren können. Amen.' }
      ]
    },

    {
      id: 'gertrude',
      nav: 'Hl. Gertrud',
      title: 'Das Gebet der hl. Gertrud der Großen',
      subtitle: 'Zur Erlösung der Seelen aus dem Fegefeuer',
      blocks: [
        { t: 'promise', title: 'Die Verheißung unseres Herrn Jesus', x: [
          'Unser Herr Jesus offenbarte der hl. Gertrud der Großen, dass ein einziges Beten dieses Gebetes **tausend Seelen aus dem Fegefeuer** befreit.'
        ] },

        { t: 'lead', x: '„Ewiger Vater, ich opfere dir das kostbarste Blut deines göttlichen Sohnes, unseres Herrn Jesus Christus, in Vereinigung mit allen heiligen Messen, die heute auf der ganzen Welt gefeiert werden, auf: für alle armen Seelen im Fegefeuer, für die Sterbenden, für die Sünder in der ganzen Welt, für die Sünder in der Weltkirche, für die Sünder in meiner Familie und in meinem Hause. Amen.“' },

        { t: 'note', x: '(Ein Ablass von 500 Tagen.)' }
      ]
    },

    {
      id: 'golden-arrow',
      nav: 'Goldener Pfeil',
      title: 'Der Anbetungsakt „Der Goldene Pfeil“',
      subtitle: 'Zum Lobe des heiligsten Namens Gottes',
      blocks: [
        { t: 'poem', lines: [
          'Gepriesen, gelobt, verehrt,',
          'Angebetet und verherrlicht',
          'Sei in Ewigkeit',
          'Der allerheiligste, hochheiligste,',
          'Anbetungswürdigste, unbegreifliche',
          'Und unaussprechliche Name Gottes',
          'Im Himmel, auf Erden und in den Abgründen,',
          'Durch alle Geschöpfe,',
          'Die aus den Händen Gottes hervorgegangen sind,',
          'Und durch das heiligste Herz unseres Herrn Jesus Christus',
          'Im allerheiligsten Sakrament des Altares. Amen.'
        ] },

        { t: 'note', x: '(Dieser Anbetungsakt gehört zur Bruderschaft vom heiligsten Antlitz Jesu.)' }
      ]
    },

    {
      id: 'shoulder-wound',
      nav: 'Schulterwunde',
      title: 'Gebet zur heiligen Schulterwunde Christi',
      subtitle: '',
      blocks: [
        { t: 'p', x: 'O liebreichster Jesus, du mein sanftestes Lamm Gottes! Ich, ein armer Sünder, grüße und verehre jene deine heiligste Wunde, die dir einen überaus heftigen Schmerz bereitete, als du das schwere Kreuz auf deiner göttlichen Schulter trugst. Dieser Schmerz war schwerer und bitterer als die übrigen Wunden an deinem heiligen Leibe. Ich liebe dich, ich gebe dir Ehre und beuge mich vor dir aus der Tiefe meines Herzens.' },

        { t: 'p', x: 'Ich danke dir für jene tiefste Wunde deiner Schulter. Demütig bitte ich dich im Namen des Leidens, das du durch die Wunde deiner Schulter ertragen hast, und im Namen deines schweren Kreuzes, das du auf jener heiligen Wunde getragen hast: erbarme dich meiner, des unwürdigen Sünders. Vergib mir alle meine Sünden und gewähre, dass ich, in deinen blutigen Spuren wandelnd, die selige Ewigkeit erlange. Amen.' },

        { t: 'box', title: 'Die Gebetsregel', x: [
          '**Vater unser…** (3 mal) · **Gegrüßet seist du, Maria…** (3 mal)',
          '_Gelobt seist du, o Herr, im allerheiligsten Sakramente verborgen._ (3 mal)'
        ] },

        { t: 'lead', x: 'O kostbarstes Blut, das aus dem heiligen Haupte unseres Herrn Jesus Christus fließt, dem Tempel der göttlichen Weisheit und der Wohnung Gottes, der Erkenntnis, des himmlischen und des irdischen Lichtes: bewahre mich jetzt und in alle Ewigkeit. Amen.' }
      ]
    },

    {
      id: 'eucharistic-heart',
      nav: 'Eucharistisches Herz',
      title: 'Gebet zum eucharistischen Herzen Jesu',
      subtitle: 'Die Andacht der dreiunddreißig Tage',
      blocks: [
        { t: 'lead', x: '„Jesus, Maria, ich liebe euch — rettet die Seelen. O Blut und Wasser, das aus dem heiligsten Herzen Christi als Quell der Barmherzigkeit für uns hervorgeströmt ist, wir vertrauen auf dich. Jesus, wir vertrauen auf dich und setzen alle unsere Hoffnung auf dich.“' },

        { t: 'refrain', x: 'Eucharistisches Herz Jesu, ich vertraue dir.' },

        { t: 'litany', ordered: true, items: [
          ['Eucharistisches Herz Jesu, das du in Liebe brennst,', 'entzünde unsere Herzen in Liebe.'],
          ['Eucharistisches Herz Jesu,', 'mehre in uns Glaube und Liebe.'],
          ['Eucharistisches Herz Jesu, Quell des rechten Willens,', 'gib uns einen rechten Willen.'],
          ['Eucharistisches Herz Jesu, Schöpfer der Welt, der du die Welt in deiner Hand hältst,', 'lass uns niemals aus deinem Schutze fallen.'],
          ['Eucharistisches Herz Jesu, Arzt Gottes, der du in Christus den Tod getragen hast,', 'heile die Wunden unserer Sünden.'],
          ['Eucharistisches Herz Jesu, zum Gedächtnis deines bitteren Leidens,', 'gib uns wahre Reue und die Vergebung der Sünden.'],
          ['Eucharistisches Herz Jesu, Spiegel des ewigen Lichtes,', 'lass uns dich in der Ewigkeit schauen.'],
          ['Eucharistisches Herz Jesu,', 'erweise dich uns barmherzig in der Stunde unseres Todes.'],
          ['Eucharistisches Herz Jesu,', 'lösche in uns gänzlich die Glut der weltlichen Begierden.'],
          ['Eucharistisches Herz Jesu, Güte der Herzen,', 'komm durch dein kostbarstes Blut zu uns in der Stunde unseres Todes.']
        ] },

        { t: 'refrain', x: 'Eucharistisches Herz Jesu, ich vertraue dir.' },

        { t: 'rule' },

        { t: 'litany', items: [
          ['Eucharistisches Herz Jesu, unerschöpflicher Quell des Lebens und der Heiligkeit,', 'heilige mich durch dein kostbarstes Blut.'],
          ['Eucharistisches Herz Jesu, Feuerherd unauslöschlicher Liebe,', 'entzünde mein Herz in Liebe zu dir.'],
          ['Eucharistisches Herz Jesu, das du uns geduldig im Tabernakel erwartest,', 'lehre mich die Treue.'],
          ['Eucharistisches Herz Jesu, durch unwürdige Kommunionen geschmäht,', 'nimm meine Sühne an.'],
          ['Eucharistisches Herz Jesu, Brot der Engel und Speise der Seelen,', 'sättige meine Armut.'],
          ['Eucharistisches Herz Jesu, Trost der Betrübten und Stärke der Schwachen,', 'stütze mich auf meinem Wege.'],
          ['Eucharistisches Herz Jesu, Zuflucht der Sünder,', 'verwirf mich nicht.'],
          ['Eucharistisches Herz Jesu, Trost der Seelen im Fegefeuer,', 'befreie sie durch dein kostbarstes Blut.'],
          ['Eucharistisches Herz Jesu, Wegzehrung der Sterbenden,', 'sei bei mir in meiner letzten Stunde.'],
          ['Eucharistisches Herz Jesu, voll der Barmherzigkeit gegen uns,', 'erbarme dich meiner.']
        ] },

        { t: 'p', x: 'O eucharistisches Herz Jesu, das du aus Liebe zu uns unter den Gestalten von Brot und Wein bis ans Ende der Zeiten bei uns geblieben bist, nimm dieses mein armes Gebet an. Ich glaube, dass du hier wahrhaft, wirklich und wesentlich gegenwärtig bist; ich hoffe auf deine Barmherzigkeit und liebe dich über alles. Für alle Schmähungen, die du im allerheiligsten Sakramente empfängst, bringe ich dir das kostbarste Blut dar, das du für mich am Kreuze vergossen hast. Amen.' },

        { t: 'promise', title: 'Die Verheißung der 33 Tage', x: [
          'Wer **dreiunddreißig Tage** hindurch — zum Gedächtnis der dreiunddreißig Jahre des irdischen Lebens des Erlösers — dieses Gebet zum eucharistischen Herzen Jesu täglich und ohne Unterbrechung verrichtet, erlangt den **vollkommenen Nachlass von Strafe und Schuld**.',
          '_Es wird im Stande der heiligmachenden Gnade gebetet, nach Empfang der heiligen Beichte und Kommunion._'
        ] },

        { t: 'tracker', kind: '33d' }
      ]
    }
  ],

  footer: {
    motto: 'O kostbarstes Blut unseres Herrn Jesus Christus, rette mich!',
    note: 'Eine private Andacht. Die mit diesen Gebeten verbundenen Verheißungen stammen aus Privatoffenbarungen und sind keine Glaubenssätze.',
    copyright: 'Andacht zum kostbarsten Blute Christi'
  }
};
