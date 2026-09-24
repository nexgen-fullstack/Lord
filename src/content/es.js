'use strict';
/* Español */

module.exports = {
  siteName: 'La Exaltación de la Preciosísima Sangre de Nuestro Señor Jesucristo',
  brand: 'Preciosísima Sangre',

  meta: {
    title: 'La Preciosísima Sangre de Jesucristo — Oraciones',
    ogTitle: 'La Exaltación de la Preciosísima Sangre de Nuestro Señor Jesucristo',
    description: 'La oración de doce años a la Preciosísima Sangre, el acto de consagración, la oración de santa Gertrudis, la Flecha de Oro y el Corazón Eucarístico de Jesús.',
    keywords: 'Preciosísima Sangre, devoción a la Preciosísima Sangre, oración de doce años, oración de santa Gertrudis la Magna, Flecha de Oro, santa Llaga del Hombro, Corazón Eucarístico de Jesús, oraciones católicas, almas del purgatorio',
    section: 'Devoción católica',
    genre: 'Oración'
  },

  ui: {
    skip: 'Ir a las oraciones',
    navLabel: 'Secciones de las oraciones',
    navHome: 'Inicio',
    menuLabel: 'Abrir el menú',
    closeLabel: 'Cerrar el menú',
    languageLabel: 'Elegir idioma',
    print: 'Imprimir las oraciones',
    audioOn: 'Activar la música devocional',
    audioOff: 'Desactivar la música devocional',
    toTop: 'Volver arriba',

    textSizeLabel: 'Tamaño del texto',
    textSmaller:   'Texto más pequeño',
    textLarger:    'Texto más grande',
    textSizeHint:  'Tu elección se recuerda en este dispositivo.',

    /* Offline app — install prompt, cache state, update notice. */
    installLabel:  'Instalar la aplicación',
    installTitle:  'El libro de oraciones en el móvil',
    installBody:   'Instala la aplicación y todas las oraciones se quedan contigo, con o sin red.',
    installAction: 'Instalar',
    installIos:    'En Safari, toca «Compartir» y luego «Añadir a pantalla de inicio».',
    installedNote: 'La aplicación está instalada. Las oraciones están disponibles sin conexión.',
    offlineReady:  'Todas las oraciones guardadas — puedes rezar sin conexión.',
    offlineStored: 'Guardado en este dispositivo: {done} de {total}',
    offlineComplete: 'Todas las oraciones están guardadas en este dispositivo — la aplicación funciona sin conexión.',
    offlineNow:    'Estás sin conexión — las oraciones siguen aquí.',
    backOnline:    'Conexión restablecida.',
    updateReady:   'Hay un libro de oraciones actualizado.',
    updateAction:  'Actualizar',
    dismiss:       'Cerrar',

    voiceLabel: 'Leer las oraciones en voz alta',
    voiceTitle: 'Oración con voz',
    voiceGender: 'Voz',
    voiceMale: 'Masculina',
    voiceFemale: 'Femenina',
    voicePlay: 'Leer',
    voicePause: 'Pausa',
    voiceResume: 'Continuar',
    voiceStop: 'Parar',
    voiceIdle: 'Elige una voz y pulsa «Leer».',
    voiceReading: 'Leyendo: {section}',
    voicePaused: 'Lectura en pausa.',
    voiceDone: 'Lectura terminada.',
    voiceNoGender: 'La voz «{gender}» no está disponible para el español en tu dispositivo — se usa la existente.',
    voiceNoVoice: 'Tu navegador no tiene una voz española instalada. Añade un paquete de idioma en el sistema.',
    voiceUnsupported: 'Tu navegador no admite la síntesis de voz.',

    nameDefault: '(nombre)',

    tracker33Title: 'Camino de los 33 días',
    tracker33Lead: 'Marca cada día en que hayas rezado esta oración.',
    markToday: 'Marcar hoy',
    resetProgress: 'Reiniciar',

    statusIdle: 'Aún no has comenzado — marca tu primer día.',
    statusDay33: 'Día {n} de {total} · {pct}%',
    statusMarked: 'marcado hoy, vuelve mañana',
    statusDone33: '33 días cumplidos. ¡Alabado sea Jesucristo!',
    confirmReset: '¿Reiniciar todo el camino registrado?'
  },

  hero: {
    title: 'La Exaltación de la Preciosísima Sangre de Nuestro Señor Jesucristo',
    quote: '«Tú nos has redimido, oh Señor, con Tu Preciosísima Sangre, de toda tribu, lengua, pueblo y nación.»',
    quoteRef: 'Apocalipsis 5, 9',
    imageAlt: 'Jesucristo en la Cruz; los ángeles recogen la Preciosísima Sangre en cálices de oro',
    cta: 'A las oraciones'
  },

  sections: [

    {
      id: 'devotion',
      nav: 'Oración de 12 años',
      title: 'La devoción a la santa Sangre de Dios',
      subtitle: 'La oración que se reza cada día durante doce años',
      blocks: [
        { t: 'chant', lines: [
          'Kyrie eleison, Christe eleison,',
          'Kyrie eleison, Christe eleison,',
          'Kyrie eleison, Christe eleison.'
        ] },

        { t: 'litany', items: [
          ['Oh Cristo,', 'óyeme.'],
          ['Oh Cristo,', 'escúchame.'],
          ['Dios Padre celestial,', 'ten piedad de mí.'],
          ['Dios Hijo, Redentor del mundo,', 'ten piedad de mí.'],
          ['Dios Espíritu Santo,', 'ten piedad de mí.'],
          ['Santísima Trinidad, un solo Dios,', 'ten piedad de mí.'],
          ['Santa María,', 'ruega por mí.'],
          ['Madre del Salvador que padece,', 'ruega por mí.']
        ] },

        { t: 'litany', items: [
          ['Oh Preciosísima Sangre del Señor, derramada en la circuncisión,', 'purifícame de mis pecados.'],
          ['Oh Preciosísima Sangre del Señor, derramada en la flagelación,', 'purifícame de mis pecados.'],
          ['Oh Preciosísima Sangre del Señor, derramada bajo la corona de espinas,', 'purifícame de mis pecados.'],
          ['Oh Preciosísima Sangre del Señor, derramada en el camino de la Cruz,', 'purifícame de mis pecados.'],
          ['Oh Preciosísima Sangre del Señor, derramada al ser clavadas en la Cruz Sus santísimas manos,', 'purifícame de mis pecados.'],
          ['Oh Preciosísima Sangre del Señor, derramada al ser clavados en la Cruz Sus santísimos pies,', 'purifícame de mis pecados.'],
          ['Oh Preciosísima Sangre del Señor, derramada de Su santísimo Corazón traspasado por la lanza,', 'purifícame de mis pecados.'],
          ['Oh Preciosísima Sangre del Señor, derramada por mí, indigno pecador,', 'purifícame de mis pecados.'],
          ['Oh Preciosísima Sangre del Señor, derramada hasta la última gota por mí y por mis pecados,', 'ten piedad de mí.']
        ] },

        { t: 'litany', items: [
          ['Oh Jesús, por Tu Preciosísima Sangre derramada por mí en la Cruz,', 'te doy gracias.'],
          ['Oh Jesús, por Tu Preciosísima Sangre ultrajada en el Gólgota,', 'te pido perdón.'],
          ['Oh Jesús, por toda profanación de Tu Preciosísima Sangre en la santa Misa mediante comuniones indignas,', 'te pido perdón.']
        ] },

        { t: 'litany', items: [
          ['Yo, pecador, te ruego, oh Dios:', 'sálvame con Tu Preciosísima Sangre.'],
          ['Yo, pecador, te ruego, oh Dios:', 'protégeme con Tu Preciosísima Sangre.'],
          ['Yo, pecador, te ruego, oh Dios:', 'sáciame con Tu Preciosísima Sangre.']
        ] },

        { t: 'litany', items: [
          ['Cordero de Dios, que quitas los pecados del mundo,', 'escúchame, oh Señor.'],
          ['Cordero de Dios, que quitas los pecados del mundo,', 'perdóname, oh Señor.'],
          ['Cordero de Dios, que quitas los pecados del mundo,', 'ten piedad de mí, oh Señor.']
        ] },

        { t: 'chant', lines: ['Kyrie eleison, Christe eleison (tres veces)'] },

        { t: 'lead', x: 'Oh Preciosísima Sangre de Nuestro Señor Jesucristo, sé exaltada y glorificada por todos nosotros, ahora y siempre y por los siglos de los siglos. Amén.' },

        { t: 'rule' },

        { t: 'p', x: 'Dios omnipotente, Salvador mío, con una sola gota de Tu Preciosísima Sangre habrías podido redimir millones de mundos. Sin embargo, por Tu amor sin límites hacia mí, pecador, derramaste la última gota de Tu Preciosísima Sangre, ofreciéndola a Dios Padre por mis pecados.' },
        { t: 'p', x: 'Oh Jesús, Tú la ofreces cada día también en los altares del mundo entero en cada santa Misa. Derramas Tu Sangre bajo las especies del vino y la ofreces por mi redención. La derramaste para alimentar mi alma para la vida eterna.' },
        { t: 'p', x: 'Yo, pecador, caigo con humildad ante Tu majestad y te suplico, por Tu misericordia sin límites: ten piedad de mí, pecador. Oh Salvador, te ruego que hagas volver a los pecadores endurecidos, para que cuanto antes se conviertan de aquel estado terrible. Renueva la santa fe en todos los pueblos, para que regresen a la unidad.' },
        { t: 'p', x: 'Señor, este es nuestro gran deseo: que todos los hombres del mundo te sirvan solo a Ti y glorifiquen Tu Preciosísima Sangre.' },
        { t: 'p', x: 'Oh Dios, ten piedad de las almas del purgatorio, porque aguardan Tu perdón.' },
        { t: 'p', x: 'Que Tu Preciosísima Sangre, derramada por nuestros pecados, les alcance el perdón del Padre celestial y las conduzca a la felicidad eterna. Amén.' },

        { t: 'rule' },

        { t: 'p', x: 'Señor Jesucristo, Salvador mío, guárdame de las asechanzas de las tentaciones diabólicas por Tu Preciosísima Sangre.' },
        { t: 'p', x: 'Señor Jesucristo, Salvador mío, ayúdame por Tu Preciosísima Sangre a vencer las tentaciones.' },
        { t: 'p', x: 'Señor Jesucristo, Salvador mío, protégeme y llévame en pos de Ti por Tu Preciosísima Sangre.' },
        { t: 'p', x: 'Señor Jesucristo, Salvador mío, guarda de todo peligro al Santo Padre con todo el clero y a la santa Iglesia por Tu Preciosísima Sangre. Amén.' },

        { t: 'box', title: 'La regla de oración', x: [
          '**Padre nuestro…** (7 veces) · **Ave María…** (7 veces) · **Gloria al Padre…** (7 veces)',
          'La oración se reza **cada día durante doce años**, sin interrupción.'
        ] },

        { t: 'promise', title: 'Las promesas divinas', x: [
          'Quien rece esta oración cada día durante doce años, orando sin interrupción, no pasará por el purgatorio.',
          'Quien haya comenzado a rezarla y muera al cabo de seis meses recibirá igualmente todas estas grandes gracias: cinco almas de su familia recibirán la vocación al estado religioso, y hasta la cuarta generación nadie de su familia estará en el infierno.',
          'Esta oración de doce años tiene el poder de purificar el alma de todas sus iniquidades. _¡Señor, da Tu bendición!_'
        ] }
      ]
    },

    {
      id: 'consecration',
      nav: 'Consagración',
      title: 'Acto de consagración personal a la Preciosísima Sangre de Jesucristo',
      subtitle: '',
      blocks: [
        { t: 'p', x: 'Con plena conciencia de mi nada y, al mismo tiempo, de Tu grandeza, oh misericordioso Salvador, me postro a Tus pies y te doy gracias por las innumerables pruebas de gracia que me has concedido a mí, criatura ingrata, y sobre todo por haberme librado, mediante Tu Preciosísima Sangre, del poder corruptor de satanás. En presencia de mi amada Madre María, de mi Ángel de la Guarda, de mis santos Patronos y de toda la corte celestial, me consagro, oh dulcísimo Jesús, con toda la sinceridad del corazón y del modo más libre, a Tu Preciosísima Sangre, con la cual redimiste al mundo entero del pecado, de la muerte y del infierno.' },

        { t: 'p', x: 'Yo, {{name}}, te prometo, confiando en la ayuda de Tu gracia, despertar y difundir con todas mis fuerzas y según todas mis posibilidades la devoción a Tu Preciosísima Sangre, Precio de nuestra Redención, para que Tu Sangre, digna de la más alta veneración, sea honrada y amada por todos.' },

        { t: 'p', x: 'De este modo deseo reparar mi infidelidad hacia Tu Preciosísima Sangre y hacia Tu Amor, y darte satisfacción por las innumerables profanaciones y ultrajes que los hombres infligen a ese Precio carísimo de nuestra salvación. ¡Oh, si mis propios pecados, mi tibieza y todos los ultrajes con los que alguna vez te he deshonrado, oh Preciosísima Sangre, pudieran ser reducidos a la nada!' },

        { t: 'p', x: 'He aquí, dulcísimo Jesús, que te ofrezco también el amor, el honor y la adoración que Tu santísima Madre, Tus fieles discípulos y todos los santos han rendido a Tu Preciosísima Sangre. Te ruego: no recuerdes más mi antigua infidelidad y tibieza, y dígnate perdonar a todos los que te ultrajan. Rocíame, oh divino Salvador, con Tu Preciosísima Sangre, y con ella a todos los hombres, para que te amemos desde ahora con todo el corazón, oh Amor crucificado, y podamos honrar dignamente para siempre el Precio de nuestra Redención. Amén.' }
      ]
    },

    {
      id: 'gertrude',
      nav: 'Sta. Gertrudis',
      title: 'La oración de santa Gertrudis la Magna',
      subtitle: 'Para la liberación de las almas del Purgatorio',
      blocks: [
        { t: 'promise', title: 'La promesa de Nuestro Señor Jesús', x: [
          'Nuestro Señor Jesús reveló a santa Gertrudis la Magna que una sola recitación de esta oración libera **mil almas del Purgatorio**.'
        ] },

        { t: 'lead', x: '«Padre Eterno, te ofrezco la Preciosísima Sangre de Tu divino Hijo, Nuestro Señor Jesucristo, en unión con todas las Misas que hoy se celebran en el mundo entero: por las almas del purgatorio, por los moribundos, por los pecadores del mundo, por los pecadores de la Iglesia universal, por los pecadores de mi familia y de mi casa. Amén.»' },

        { t: 'note', x: '(Indulgencia de 500 días.)' }
      ]
    },

    {
      id: 'golden-arrow',
      nav: 'Flecha de Oro',
      title: 'El acto de adoración «La Flecha de Oro»',
      subtitle: 'En alabanza del santísimo Nombre de Dios',
      blocks: [
        { t: 'poem', lines: [
          'Sea por siempre alabado,',
          'Bendecido, amado,',
          'Adorado y glorificado',
          'El santísimo, sacratísimo,',
          'Adorabilísimo, incomprensible',
          'E inefable Nombre de Dios',
          'En el cielo, en la tierra y en los abismos,',
          'Por todas las criaturas',
          'Salidas de las manos de Dios,',
          'Y por el santísimo Corazón de Nuestro Señor Jesucristo',
          'En el Santísimo Sacramento del altar. Amén.'
        ] },

        { t: 'note', x: '(Este acto de adoración pertenece a la cofradía de la Santa Faz de Jesús.)' }
      ]
    },

    {
      id: 'shoulder-wound',
      nav: 'Llaga del Hombro',
      title: 'Oración a la santa Llaga del Hombro de Cristo',
      subtitle: '',
      blocks: [
        { t: 'p', x: '¡Oh amabilísimo Jesús, mansísimo Cordero de Dios mío! Yo, pobre pecador, saludo y adoro esa santísima Llaga Tuya, que te causó un dolor tan intenso cuando llevaste la pesada Cruz sobre Tu divino Hombro. Aquel dolor fue más grave y más amargo que las demás Llagas de Tu santo Cuerpo. Te amo, te doy honor y me postro ante Ti desde lo profundo del corazón.' },

        { t: 'p', x: 'Te doy gracias por esa profundísima Llaga de Tu Hombro. Humildemente te ruego, en nombre del sufrimiento que padeciste por la Llaga del Hombro y en nombre de Tu pesada Cruz, que llevaste sobre esa santa Llaga: ten misericordia de mí, indigno pecador. Perdóname todos mis pecados y concédeme que, caminando sobre Tus huellas ensangrentadas, alcance la bienaventurada eternidad. Amén.' },

        { t: 'box', title: 'La regla de oración', x: [
          '**Padre nuestro…** (3 veces) · **Ave María…** (3 veces)',
          '_Bendito seas, oh Señor, escondido en el Santísimo Sacramento._ (3 veces)'
        ] },

        { t: 'lead', x: 'Oh Preciosísima Sangre que brotas de la sagrada Cabeza de Nuestro Señor Jesucristo, Templo de la divina Sabiduría y Morada de Dios, de la ciencia, de la luz del cielo y de la tierra: guárdame ahora y por los siglos de los siglos. Amén.' }
      ]
    },

    {
      id: 'eucharistic-heart',
      nav: 'Corazón Eucarístico',
      title: 'Oración al Corazón Eucarístico de Jesús',
      subtitle: 'La devoción de los treinta y tres días',
      blocks: [
        { t: 'lead', x: '«Jesús, María, os amo — salvad las almas. Oh Sangre y Agua, que brotaste del santísimo Corazón de Cristo como Fuente de Misericordia para nosotros, en Ti confiamos. Jesús, en Ti confiamos y en Ti ponemos toda nuestra esperanza.»' },

        { t: 'refrain', x: 'Corazón Eucarístico de Jesús, confío en Ti.' },

        { t: 'litany', ordered: true, items: [
          ['Corazón Eucarístico de Jesús, ardiente de Amor,', 'enciende de amor nuestros corazones.'],
          ['Corazón Eucarístico de Jesús,', 'acrecienta en nosotros la fe y el amor.'],
          ['Corazón Eucarístico de Jesús, Fuente de la recta voluntad,', 'danos una voluntad recta.'],
          ['Corazón Eucarístico de Jesús, Creador del mundo, que sostienes el mundo en Tu Mano,', 'no nos dejes salir de Tu amparo.'],
          ['Corazón Eucarístico de Jesús, Médico de Dios, que padeciste la muerte en la Cruz,', 'sana las heridas de nuestros pecados.'],
          ['Corazón Eucarístico de Jesús, en memoria de Tu amarga Pasión,', 'danos verdadero dolor y el perdón de los pecados.'],
          ['Corazón Eucarístico de Jesús, Espejo de la Luz eterna,', 'concédenos contemplarte en la eternidad.'],
          ['Corazón Eucarístico de Jesús,', 'muéstrate misericordioso con nosotros en la hora de nuestra muerte.'],
          ['Corazón Eucarístico de Jesús,', 'apaga en nosotros por completo el ardor de las codicias del mundo.'],
          ['Corazón Eucarístico de Jesús, Bondad de los corazones,', 'por Tu Preciosísima Sangre ven a nosotros en la hora de nuestra muerte.']
        ] },

        { t: 'refrain', x: 'Corazón Eucarístico de Jesús, confío en Ti.' },

        { t: 'rule' },

        { t: 'litany', items: [
          ['Corazón Eucarístico de Jesús, fuente inagotable de vida y de santidad,', 'santifícame con Tu Preciosísima Sangre.'],
          ['Corazón Eucarístico de Jesús, hoguera de amor inextinguible,', 'enciende mi corazón en amor por Ti.'],
          ['Corazón Eucarístico de Jesús, que nos aguardas con paciencia en el sagrario,', 'enséñame la fidelidad.'],
          ['Corazón Eucarístico de Jesús, ultrajado por comuniones indignas,', 'acepta mi reparación.'],
          ['Corazón Eucarístico de Jesús, Pan de los ángeles y alimento de las almas,', 'sacia mi pobreza.'],
          ['Corazón Eucarístico de Jesús, consuelo de los afligidos y fuerza de los débiles,', 'sostenme en el camino.'],
          ['Corazón Eucarístico de Jesús, refugio de los pecadores,', 'no me rechaces.'],
          ['Corazón Eucarístico de Jesús, consuelo de las almas del purgatorio,', 'líbralas con Tu Preciosísima Sangre.'],
          ['Corazón Eucarístico de Jesús, Viático de los moribundos,', 'asísteme en mi última hora.'],
          ['Corazón Eucarístico de Jesús, lleno de misericordia para con nosotros,', 'ten piedad de mí.']
        ] },

        { t: 'p', x: 'Oh Corazón Eucarístico de Jesús, que por amor a nosotros has permanecido con nosotros bajo las especies del pan y del vino hasta el fin de los siglos, acoge esta pobre oración mía. Creo que estás aquí presente, verdadera, real y sustancialmente; espero en Tu misericordia y te amo sobre todas las cosas. Por todos los ultrajes que recibes en el Santísimo Sacramento, te ofrezco la Preciosísima Sangre que derramaste por mí en la Cruz. Amén.' },

        { t: 'promise', title: 'La promesa de los 33 días', x: [
          'Quien durante **treinta y tres días** — en memoria de los treinta y tres años de la vida terrena del Salvador — rece cada día y sin interrupción esta oración al Corazón Eucarístico de Jesús, obtendrá la **completa remisión de la pena y de la culpa**.',
          '_Se reza en estado de gracia santificante, habiéndose acercado a la santa Confesión y a la Comunión._'
        ] },

        { t: 'tracker', kind: '33d' }
      ]
    }
  ],

  footer: {
    motto: '¡Oh Preciosísima Sangre de Nuestro Señor Jesucristo, sálvame!',
    note: 'Devoción privada. Las promesas ligadas a estas oraciones proceden de revelaciones privadas y no son artículos de fe.',
    copyright: 'Devoción a la Preciosísima Sangre de Cristo'
  }
};
