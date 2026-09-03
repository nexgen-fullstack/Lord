'use strict';
/* English */

module.exports = {
  siteName: 'The Exaltation of the Most Precious Blood of Our Lord Jesus Christ',
  brand: 'The Precious Blood',

  meta: {
    title: 'The Most Precious Blood of Jesus Christ — Prayers',
    ogTitle: 'The Exaltation of the Most Precious Blood of Our Lord Jesus Christ',
    description: 'The 12-year prayer to the Most Precious Blood, the Act of Consecration, St Gertrude’s prayer, the Golden Arrow, the Shoulder Wound and the Eucharistic Heart.',
    keywords: 'Most Precious Blood, Precious Blood devotion, twelve year prayer, 12 year prayer, St Gertrude the Great prayer, Golden Arrow prayer, Holy Shoulder Wound, Eucharistic Heart of Jesus, Catholic prayers, souls in purgatory',
    section: 'Catholic devotion',
    genre: 'Prayer'
  },

  ui: {
    skip: 'Skip to the prayers',
    navLabel: 'Prayer sections',
    navHome: 'Home',
    menuLabel: 'Open menu',
    closeLabel: 'Close menu',
    languageLabel: 'Choose language',
    print: 'Print the prayers',
    audioOn: 'Play quiet devotional music',
    audioOff: 'Stop the devotional music',
    toTop: 'Back to top',

    /* Offline app — install prompt, cache state, update notice. */
    installLabel:  'Install the app',
    installTitle:  'The prayer book on your phone',
    installBody:   'Install the app and every prayer stays with you, with or without a signal.',
    installAction: 'Install',
    installIos:    'In Safari, tap Share, then “Add to Home Screen”.',
    installedNote: 'The app is installed. The prayers are available offline.',
    offlineReady:  'All prayers saved — you can pray offline.',
    offlineStored: 'Stored on this device: {done} of {total}',
    offlineComplete: 'Every prayer is stored on this device — the app works with no connection.',
    offlineNow:    'You are offline — the prayers are still here.',
    backOnline:    'Connection restored.',
    updateReady:   'An updated prayer book is ready.',
    updateAction:  'Refresh',
    dismiss:       'Close',

    voiceLabel: 'Read the prayers aloud',
    voiceTitle: 'Voice prayer',
    voiceGender: 'Voice',
    voiceMale: 'Male',
    voiceFemale: 'Female',
    voicePlay: 'Read',
    voicePause: 'Pause',
    voiceResume: 'Resume',
    voiceStop: 'Stop',
    voiceIdle: 'Choose a voice and press “Read”.',
    voiceReading: 'Reading: {section}',
    voicePaused: 'Reading paused.',
    voiceDone: 'Reading complete.',
    voiceNoGender: 'No {gender} voice is available for English in your browser — using the one that is.',
    voiceNoVoice: 'Your browser has no English voice installed. Add a language pack in your system settings.',
    voiceUnsupported: 'Your browser does not support speech synthesis.',

    nameDefault: '(name)',

    tracker33Title: 'Thirty-three day progress',
    tracker33Lead: 'Mark each day on which you have said this prayer.',
    markToday: 'Mark today',
    resetProgress: 'Reset',

    statusIdle: 'Not yet begun — mark your first day.',
    statusDay33: 'Day {n} of {total} · {pct}%',
    statusMarked: 'marked today, return tomorrow',
    statusDone33: '33 days completed. Glory be to Jesus Christ!',
    confirmReset: 'Reset all recorded progress?'
  },

  hero: {
    title: 'The Exaltation of the Most Precious Blood of Our Lord Jesus Christ',
    quote: '“Thou hast redeemed me, O Lord, by Thy Most Precious Blood, out of every tribe and tongue and people and nation.”',
    quoteRef: 'Revelation 5:9',
    imageAlt: 'Jesus Christ upon the Cross, angels gathering the Most Precious Blood into golden chalices',
    cta: 'To the prayers'
  },

  sections: [

    {
      id: 'devotion',
      nav: 'Twelve-year prayer',
      title: 'The Devotion to the Holy Blood of God',
      subtitle: 'The prayer said every day for twelve years',
      blocks: [
        { t: 'chant', lines: [
          'Kyrie eleison, Christe eleison,',
          'Kyrie eleison, Christe eleison,',
          'Kyrie eleison, Christe eleison.'
        ] },

        { t: 'litany', items: [
          ['O Christ,', 'hear me.'],
          ['O Christ,', 'graciously hear me.'],
          ['God the Father of Heaven,', 'have mercy on me.'],
          ['God the Son, Redeemer of the world,', 'have mercy on me.'],
          ['God the Holy Spirit,', 'have mercy on me.'],
          ['Holy Trinity, one God,', 'have mercy on me.'],
          ['Holy Mary,', 'pray for me.'],
          ['Mother of the suffering Saviour,', 'pray for me.']
        ] },

        { t: 'litany', items: [
          ['O Most Precious Blood of the Lord, shed at His circumcision,', 'cleanse me of my sins.'],
          ['O Most Precious Blood of the Lord, shed in the scourging,', 'cleanse me of my sins.'],
          ['O Most Precious Blood of the Lord, shed beneath the crown of thorns,', 'cleanse me of my sins.'],
          ['O Most Precious Blood of the Lord, shed upon the way of the Cross,', 'cleanse me of my sins.'],
          ['O Most Precious Blood of the Lord, shed at the nailing of Thy most holy hands to the Cross,', 'cleanse me of my sins.'],
          ['O Most Precious Blood of the Lord, shed at the nailing of Thy most holy feet to the Cross,', 'cleanse me of my sins.'],
          ['O Most Precious Blood of the Lord, shed from Thy most Sacred Heart pierced by the lance,', 'cleanse me of my sins.'],
          ['O Most Precious Blood of the Lord, shed for me, an unworthy sinner,', 'cleanse me of my sins.'],
          ['O Most Precious Blood of the Lord, shed to the last drop for me and for my sins,', 'have mercy on me.']
        ] },

        { t: 'litany', items: [
          ['O Jesus, for Thy Most Precious Blood poured out for me upon the Cross,', 'I give Thee thanks.'],
          ['O Jesus, for Thy Most Precious Blood dishonoured upon Golgotha,', 'I beg Thy pardon.'],
          ['O Jesus, for every profanation of Thy Most Precious Blood at Holy Mass by unworthy Communions,', 'I beg Thy pardon.']
        ] },

        { t: 'litany', items: [
          ['I, a sinner, beseech Thee, O God:', 'save me by Thy Most Precious Blood.'],
          ['I, a sinner, beseech Thee, O God:', 'shelter me by Thy Most Precious Blood.'],
          ['I, a sinner, beseech Thee, O God:', 'give me to drink of Thy Most Precious Blood.']
        ] },

        { t: 'litany', items: [
          ['Lamb of God, who takest away the sins of the world,', 'graciously hear me, O Lord.'],
          ['Lamb of God, who takest away the sins of the world,', 'forgive me, O Lord.'],
          ['Lamb of God, who takest away the sins of the world,', 'have mercy on me, O Lord.']
        ] },

        { t: 'chant', lines: ['Kyrie eleison, Christe eleison (three times)'] },

        { t: 'lead', x: 'O Most Precious Blood of our Lord Jesus Christ, be exalted and glorified by us all, now and always and unto the ages of ages. Amen.' },

        { t: 'rule' },

        { t: 'p', x: 'Almighty God, my Saviour: with one single drop of Thy Most Precious Blood Thou couldst have redeemed a million worlds. Yet out of Thy boundless love for me, a sinner, Thou didst pour out the very last drop of Thy Most Precious Blood, offering it to God the Father for my sins.' },
        { t: 'p', x: 'O Jesus, Thou dost offer it daily upon the altars of the whole world at every Holy Mass. Thou dost pour out Thy Blood under the appearance of wine and offer it for my redemption. Thou hast shed it to nourish my soul unto everlasting life.' },
        { t: 'p', x: 'I, a sinner, fall down in humility before Thy majesty and implore Thee, for the sake of Thy boundless mercy: have mercy on me, a sinner. O Saviour, I beg Thee to turn back hardened sinners, that they may be converted with all speed from that dreadful state. Renew the holy faith among all nations, that they may return to unity.' },
        { t: 'p', x: 'O Lord, this is our great desire: that all the peoples of the world should serve Thee alone and glorify Thy Most Precious Blood.' },
        { t: 'p', x: 'O God, have mercy upon the souls in purgatory, for they await Thy pardon.' },
        { t: 'p', x: 'May Thy Most Precious Blood, poured out for our sins, obtain their forgiveness from the Heavenly Father and lead them into everlasting happiness. Amen.' },

        { t: 'rule' },

        { t: 'p', x: 'Lord Jesus Christ, my Saviour, shelter me from the snares of diabolical temptation by Thy Most Precious Blood.' },
        { t: 'p', x: 'Lord Jesus Christ, my Saviour, help me by Thy Most Precious Blood to overcome temptation.' },
        { t: 'p', x: 'Lord Jesus Christ, my Saviour, guard me and lead me after Thee for the sake of Thy Most Precious Blood.' },
        { t: 'p', x: 'Lord Jesus Christ, my Saviour, guard for us from every danger the Holy Father with all the clergy and Holy Church, for the sake of Thy Most Precious Blood. Amen.' },

        { t: 'box', title: 'The rule of prayer', x: [
          '**Our Father…** (7 times) · **Hail Mary…** (7 times) · **Glory be to the Father…** (7 times)',
          'The prayer is said **every day for twelve years**, without interruption.'
        ] },

        { t: 'promise', title: 'The divine promises', x: [
          'Whoever says this prayer every day for twelve years, praying without interruption, shall not pass through purgatory.',
          'Whoever has begun to pray it and dies after half a year shall receive all these great graces: five souls of that family will receive a vocation to the religious state, and to the fourth generation none of that family will be in hell.',
          'This twelve-year prayer has power to cleanse the soul of all its iniquities. _Lord, give Thy blessing!_'
        ] }
      ]
    },

    {
      id: 'consecration',
      nav: 'Consecration',
      title: 'Act of Personal Consecration to the Most Precious Blood of Jesus Christ',
      subtitle: '',
      blocks: [
        { t: 'p', x: 'In full awareness of my own nothingness and of Thy greatness, O merciful Saviour, I fall down at Thy feet and thank Thee for the countless proofs of grace which Thou hast shown to me, an ungrateful creature, and above all that Thou hast freed me by Thy Most Precious Blood from the corrupting power of Satan. In the presence of my beloved Mother Mary, of my Guardian Angel, of my holy Patrons and of the whole Court of Heaven, I consecrate myself, O most loving Jesus, with all the sincerity of my heart and most freely, to Thy Most Precious Blood, by which Thou hast redeemed the whole world from sin, from death and from hell.' },

        { t: 'p', x: 'I, {{name}}, promise Thee, trusting in the help of Thy grace, to awaken and to spread with all my strength and according to all my means the devotion to Thy Most Precious Blood, the Price of our Redemption, so that Thy Blood, worthy of the highest veneration, may be honoured and loved by all.' },

        { t: 'p', x: 'In this way I wish to make amends for my own unfaithfulness towards Thy Most Precious Blood and Thy Love, and to make satisfaction to Thee for the countless profanations and outrages which men inflict upon that Most Precious Price of our salvation. Oh, if only my own sins, my lukewarmness and every outrage by which I have ever dishonoured Thee, O Most Precious Blood, could be returned to nothingness!' },

        { t: 'p', x: 'Behold, dearest Jesus, I offer Thee also the love, the honour and the adoration which Thy most holy Mother, Thy faithful disciples and all the saints have rendered to Thy Most Precious Blood. I beseech Thee, deign to think no more upon my former unfaithfulness and lukewarmness, and deign to forgive all who dishonour Thee. Sprinkle me, O Divine Saviour, with Thy Most Precious Blood, and with it all mankind, that we may love Thee at once with our whole heart, O crucified Love, and may honour most worthily for all time the Price of our Redemption. Amen.' }
      ]
    },

    {
      id: 'gertrude',
      nav: 'St Gertrude',
      title: 'The Prayer of St Gertrude the Great',
      subtitle: 'For the release of the souls in Purgatory',
      blocks: [
        { t: 'promise', title: 'The promise of Our Lord Jesus', x: [
          'Our Lord Jesus revealed to St Gertrude the Great that a single recitation of this prayer releases **one thousand souls from Purgatory**.'
        ] },

        { t: 'lead', x: '“Eternal Father, I offer Thee the Most Precious Blood of Thy Divine Son, Jesus, in union with all the Masses said throughout the world this day, for all the holy souls in Purgatory, for sinners everywhere, for sinners in the Universal Church, for those in my own home and within my family. Amen.”' },

        { t: 'note', x: '(An indulgence of 500 days.)' }
      ]
    },

    {
      id: 'golden-arrow',
      nav: 'The Golden Arrow',
      title: 'The Act of Adoration “The Golden Arrow”',
      subtitle: 'In praise of the Most Holy Name of God',
      blocks: [
        { t: 'poem', lines: [
          'May the most holy,',
          'Most sacred, most adorable,',
          'Most incomprehensible and ineffable',
          'Name of God be for ever',
          'Praised, blessed, loved,',
          'Adored and glorified',
          'In Heaven, on earth and in the depths below,',
          'By all the creatures of God',
          'And by the Sacred Heart',
          'Of Our Lord Jesus Christ',
          'In the Most Holy Sacrament of the Altar. Amen.'
        ] },

        { t: 'note', x: '(This act of adoration belongs to the Confraternity of the Holy Face of Jesus.)' }
      ]
    },

    {
      id: 'shoulder-wound',
      nav: 'Shoulder Wound',
      title: 'Prayer to the Holy Shoulder Wound of Christ',
      subtitle: '',
      blocks: [
        { t: 'p', x: 'O most loving Jesus, my most gentle Lamb of God! I, a poor sinner, salute and adore that most holy Wound of Thine which caused Thee so exceeding great a pain when Thou didst bear the heavy Cross upon Thy divine Shoulder. That pain was heavier and more bitter than all the other Wounds of Thy holy Body. I love Thee, I give Thee honour and I bow down before Thee from the depths of my heart.' },

        { t: 'p', x: 'I thank Thee for that deepest Wound of Thy Shoulder. Humbly I beseech Thee, in the name of the suffering Thou didst endure through the Wound of Thy Shoulder, and in the name of Thy heavy Cross which Thou didst carry upon that holy Wound: have mercy upon me, an unworthy sinner. Forgive me all my sins, and grant that, walking in Thy blood-stained footsteps, I may attain to a blessed eternity. Amen.' },

        { t: 'box', title: 'The rule of prayer', x: [
          '**Our Father…** (3 times) · **Hail Mary…** (3 times)',
          '_Blessed be Thou, O Lord, hidden in the Most Holy Sacrament._ (3 times)'
        ] },

        { t: 'lead', x: 'O Most Precious Blood, flowing from the sacred Head of our Lord Jesus Christ, Temple of Divine Wisdom and Tabernacle of God, of knowledge, of the light of Heaven and of earth: preserve me now and for ever and ever. Amen.' }
      ]
    },

    {
      id: 'eucharistic-heart',
      nav: 'Eucharistic Heart',
      title: 'Prayer to the Eucharistic Heart of Jesus',
      subtitle: 'The devotion of thirty-three days',
      blocks: [
        { t: 'lead', x: '“Jesus, Mary, I love You — save souls. O Blood and Water, which gushed forth from the Most Sacred Heart of Christ as a Fount of Mercy for us, we trust in Thee. Jesus, we trust in Thee, and in Thee we place all our hope.”' },

        { t: 'refrain', x: 'Eucharistic Heart of Jesus, I trust in Thee.' },

        { t: 'litany', ordered: true, items: [
          ['Eucharistic Heart of Jesus, burning with Love,', 'kindle our hearts with love.'],
          ['Eucharistic Heart of Jesus,', 'increase in us faith and love.'],
          ['Eucharistic Heart of Jesus, Fount of the true will,', 'grant us a right will.'],
          ['Eucharistic Heart of Jesus, Creator of the world, who holdest the world in Thy Hand,', 'let us never fall away from Thy protection.'],
          ['Eucharistic Heart of Jesus, Physician of God, who didst bear death in Christ,', 'heal the wounds of our sins.'],
          ['Eucharistic Heart of Jesus, in memory of Thy bitter Passion,', 'grant us true sorrow and the forgiveness of our sins.'],
          ['Eucharistic Heart of Jesus, Mirror of the Eternal Light,', 'grant that we may behold Thee in eternity.'],
          ['Eucharistic Heart of Jesus,', 'show Thyself merciful to us in the hour of our death.'],
          ['Eucharistic Heart of Jesus,', 'quench in us utterly the fever of worldly desires.'],
          ['Eucharistic Heart of Jesus, Goodness of hearts,', 'through Thy Most Precious Blood come to us in the hour of our death.']
        ] },

        { t: 'refrain', x: 'Eucharistic Heart of Jesus, I trust in Thee.' },

        { t: 'rule' },

        { t: 'litany', items: [
          ['Eucharistic Heart of Jesus, inexhaustible fountain of life and holiness,', 'sanctify me by Thy Most Precious Blood.'],
          ['Eucharistic Heart of Jesus, furnace of unquenchable love,', 'set my heart on fire with love of Thee.'],
          ['Eucharistic Heart of Jesus, patiently awaiting us in the tabernacle,', 'teach me faithfulness.'],
          ['Eucharistic Heart of Jesus, dishonoured by unworthy Communions,', 'accept my reparation.'],
          ['Eucharistic Heart of Jesus, Bread of Angels and food of souls,', 'satisfy my poverty.'],
          ['Eucharistic Heart of Jesus, comfort of the sorrowful and strength of the weak,', 'sustain me upon my way.'],
          ['Eucharistic Heart of Jesus, refuge of sinners,', 'cast me not away.'],
          ['Eucharistic Heart of Jesus, consolation of the souls in purgatory,', 'deliver them by Thy Most Precious Blood.'],
          ['Eucharistic Heart of Jesus, Viaticum of the dying,', 'be with me in my last hour.'],
          ['Eucharistic Heart of Jesus, full of mercy towards us,', 'have mercy upon me.']
        ] },

        { t: 'p', x: 'O Eucharistic Heart of Jesus, who out of love for us hast remained with us under the appearances of bread and wine until the end of the ages, receive this poor prayer of mine. I believe that Thou art here present, truly, really and substantially; I hope in Thy mercy and I love Thee above all things. For all the outrages Thou dost receive in the Most Holy Sacrament, I offer Thee the Most Precious Blood which Thou didst shed for me upon the Cross. Amen.' },

        { t: 'promise', title: 'The promise of thirty-three days', x: [
          'Whoever, for **thirty-three days** — in memory of the thirty-three years of the Saviour’s earthly life — shall say this prayer to the Eucharistic Heart of Jesus daily and without interruption, shall obtain the **complete remission of both punishment and guilt**.',
          '_It is to be said in the state of sanctifying grace, having approached holy Confession and Communion._'
        ] },

        { t: 'tracker', kind: '33d' }
      ]
    }
  ],

  footer: {
    motto: 'O Most Precious Blood of our Lord Jesus Christ, save me!',
    note: 'A private devotion. The promises attached to these prayers come from private revelations and are not articles of faith.',
    copyright: 'Devotion to the Most Precious Blood of Christ'
  }
};
