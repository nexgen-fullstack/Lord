'use strict';
/* Português */

module.exports = {
  siteName: 'A Exaltação do Preciosíssimo Sangue de Nosso Senhor Jesus Cristo',
  brand: 'Preciosíssimo Sangue',

  meta: {
    title: 'O Preciosíssimo Sangue de Jesus Cristo — Orações',
    ogTitle: 'A Exaltação do Preciosíssimo Sangue de Nosso Senhor Jesus Cristo',
    description: 'A oração de doze anos ao Preciosíssimo Sangue, o ato de consagração, a oração de santa Gertrudes, a Flecha de Ouro e o Coração Eucarístico de Jesus.',
    keywords: 'Preciosíssimo Sangue, devoção ao Preciosíssimo Sangue, oração de doze anos, oração de santa Gertrudes Magna, Flecha de Ouro, santa Chaga do Ombro, Coração Eucarístico de Jesus, orações católicas, almas do purgatório',
    section: 'Devoção católica',
    genre: 'Oração'
  },

  ui: {
    skip: 'Ir para as orações',
    navLabel: 'Secções das orações',
    navHome: 'Início',
    menuLabel: 'Abrir o menu',
    closeLabel: 'Fechar o menu',
    languageLabel: 'Escolher o idioma',
    print: 'Imprimir as orações',
    audioOn: 'Ligar a música devocional',
    audioOff: 'Desligar a música devocional',
    toTop: 'Voltar ao topo',

    textSizeLabel: 'Tamanho do texto',
    textSmaller:   'Texto mais pequeno',
    textLarger:    'Texto maior',
    textSizeHint:  'A escolha fica guardada neste dispositivo.',

    /* Offline app — install prompt, cache state, update notice. */
    installLabel:  'Instalar a aplicação',
    installTitle:  'O livro de orações no telemóvel',
    installBody:   'Instale a aplicação e todas as orações ficam consigo, com ou sem rede.',
    installAction: 'Instalar',
    installIos:    'No Safari, toque em «Partilhar» e depois em «Adicionar ao ecrã principal».',
    installedNote: 'A aplicação está instalada. As orações estão disponíveis offline.',
    offlineReady:  'Todas as orações guardadas — pode rezar sem rede.',
    offlineStored: 'Guardado neste dispositivo: {done} de {total}',
    offlineComplete: 'Todas as orações estão guardadas neste dispositivo — a aplicação funciona sem ligação.',
    offlineNow:    'Está offline — as orações continuam aqui.',
    backOnline:    'Ligação restabelecida.',
    updateReady:   'Está pronto um livro de orações atualizado.',
    updateAction:  'Atualizar',
    dismiss:       'Fechar',

    voiceLabel: 'Ler as orações em voz alta',
    voiceTitle: 'Oração com voz',
    voiceGender: 'Voz',
    voiceMale: 'Masculina',
    voiceFemale: 'Feminina',
    voicePlay: 'Ler',
    voicePause: 'Pausa',
    voiceResume: 'Continuar',
    voiceStop: 'Parar',
    voiceIdle: 'Escolha uma voz e prima «Ler».',
    voiceReading: 'A ler: {section}',
    voicePaused: 'Leitura em pausa.',
    voiceDone: 'Leitura concluída.',
    voiceNoGender: 'A voz «{gender}» não está disponível para português no seu dispositivo — foi usada a existente.',
    voiceNoVoice: 'O seu navegador não tem uma voz portuguesa instalada. Adicione um pacote de idioma no sistema.',
    voiceUnsupported: 'O seu navegador não suporta síntese de voz.',

    nameDefault: '(nome)',

    tracker33Title: 'Caminho dos 33 dias',
    tracker33Lead: 'Assinale cada dia em que rezou esta oração.',
    markToday: 'Assinalar hoje',
    resetProgress: 'Reiniciar',

    statusIdle: 'Ainda não começou — assinale o seu primeiro dia.',
    statusDay33: 'Dia {n} de {total} · {pct}%',
    statusMarked: 'assinalado hoje, volte amanhã',
    statusDone33: '33 dias completos. Louvado seja Jesus Cristo!',
    confirmReset: 'Reiniciar todo o caminho registado?'
  },

  hero: {
    title: 'A Exaltação do Preciosíssimo Sangue de Nosso Senhor Jesus Cristo',
    quote: '«Vós nos remistes, ó Senhor, com o Vosso Preciosíssimo Sangue, de toda a tribo, língua, povo e nação.»',
    quoteRef: 'Apocalipse 5, 9',
    imageAlt: 'Jesus Cristo na Cruz; anjos recolhem o Preciosíssimo Sangue em cálices de ouro',
    cta: 'Às orações'
  },

  sections: [

    {
      id: 'devotion',
      nav: 'Oração de 12 anos',
      title: 'A devoção ao santo Sangue de Deus',
      subtitle: 'A oração que se reza todos os dias durante doze anos',
      blocks: [
        { t: 'chant', lines: [
          'Kyrie eleison, Christe eleison,',
          'Kyrie eleison, Christe eleison,',
          'Kyrie eleison, Christe eleison.'
        ] },

        { t: 'litany', items: [
          ['Ó Cristo,', 'ouvi-me.'],
          ['Ó Cristo,', 'atendei-me.'],
          ['Deus Pai do céu,', 'tende piedade de mim.'],
          ['Deus Filho, Redentor do mundo,', 'tende piedade de mim.'],
          ['Deus Espírito Santo,', 'tende piedade de mim.'],
          ['Santíssima Trindade, um só Deus,', 'tende piedade de mim.'],
          ['Santa Maria,', 'rogai por mim.'],
          ['Mãe do Salvador sofredor,', 'rogai por mim.']
        ] },

        { t: 'litany', items: [
          ['Ó Preciosíssimo Sangue do Senhor, derramado na circuncisão,', 'purificai-me dos meus pecados.'],
          ['Ó Preciosíssimo Sangue do Senhor, derramado na flagelação,', 'purificai-me dos meus pecados.'],
          ['Ó Preciosíssimo Sangue do Senhor, derramado sob a coroa de espinhos,', 'purificai-me dos meus pecados.'],
          ['Ó Preciosíssimo Sangue do Senhor, derramado no caminho da Cruz,', 'purificai-me dos meus pecados.'],
          ['Ó Preciosíssimo Sangue do Senhor, derramado ao serem cravadas na Cruz as Suas santíssimas mãos,', 'purificai-me dos meus pecados.'],
          ['Ó Preciosíssimo Sangue do Senhor, derramado ao serem cravados na Cruz os Seus santíssimos pés,', 'purificai-me dos meus pecados.'],
          ['Ó Preciosíssimo Sangue do Senhor, derramado do Seu santíssimo Coração trespassado pela lança,', 'purificai-me dos meus pecados.'],
          ['Ó Preciosíssimo Sangue do Senhor, derramado por mim, indigno pecador,', 'purificai-me dos meus pecados.'],
          ['Ó Preciosíssimo Sangue do Senhor, derramado até à última gota por mim e pelos meus pecados,', 'tende piedade de mim.']
        ] },

        { t: 'litany', items: [
          ['Ó Jesus, pelo Vosso Preciosíssimo Sangue derramado por mim na Cruz,', 'dou-Vos graças.'],
          ['Ó Jesus, pelo Vosso Preciosíssimo Sangue ultrajado no Gólgota,', 'peço-Vos perdão.'],
          ['Ó Jesus, por toda a profanação do Vosso Preciosíssimo Sangue na santa Missa por comunhões indignas,', 'peço-Vos perdão.']
        ] },

        { t: 'litany', items: [
          ['Eu, pecador, Vos peço, ó Deus:', 'salvai-me com o Vosso Preciosíssimo Sangue.'],
          ['Eu, pecador, Vos peço, ó Deus:', 'protegei-me com o Vosso Preciosíssimo Sangue.'],
          ['Eu, pecador, Vos peço, ó Deus:', 'saciai-me com o Vosso Preciosíssimo Sangue.']
        ] },

        { t: 'litany', items: [
          ['Cordeiro de Deus, que tirais os pecados do mundo,', 'atendei-me, ó Senhor.'],
          ['Cordeiro de Deus, que tirais os pecados do mundo,', 'perdoai-me, ó Senhor.'],
          ['Cordeiro de Deus, que tirais os pecados do mundo,', 'tende piedade de mim, ó Senhor.']
        ] },

        { t: 'chant', lines: ['Kyrie eleison, Christe eleison (três vezes)'] },

        { t: 'lead', x: 'Ó Preciosíssimo Sangue de Nosso Senhor Jesus Cristo, sede exaltado e glorificado por todos nós, agora e sempre e pelos séculos dos séculos. Amém.' },

        { t: 'rule' },

        { t: 'p', x: 'Deus omnipotente, meu Salvador, com uma só gota do Vosso Preciosíssimo Sangue podíeis ter redimido milhões de mundos. Contudo, pelo Vosso amor sem limites por mim, pecador, derramastes a última gota do Vosso Preciosíssimo Sangue, oferecendo-a a Deus Pai pelos meus pecados.' },
        { t: 'p', x: 'Ó Jesus, Vós o ofereceis diariamente também nos altares do mundo inteiro em cada santa Missa. Derramais o Vosso Sangue sob as espécies do vinho e Vós o ofereceis pela minha redenção. Vós o derramastes para alimentar a minha alma para a vida eterna.' },
        { t: 'p', x: 'Eu, pecador, prostro-me em humildade diante da Vossa majestade e suplico-Vos, pela Vossa misericórdia sem limites: tende piedade de mim, pecador. Ó Salvador, peço-Vos que convertais os pecadores endurecidos, para que quanto antes se afastem desse estado terrível. Renovai a santa fé em todos os povos, para que regressem à unidade.' },
        { t: 'p', x: 'Senhor, este é o nosso grande desejo: que todos os homens do mundo sirvam somente a Vós e glorifiquem o Vosso Preciosíssimo Sangue.' },
        { t: 'p', x: 'Ó Deus, tende piedade das almas do purgatório, porque aguardam o Vosso perdão.' },
        { t: 'p', x: 'Que o Vosso Preciosíssimo Sangue, derramado pelos nossos pecados, lhes alcance o perdão do Pai celeste e as conduza à felicidade eterna. Amém.' },

        { t: 'rule' },

        { t: 'p', x: 'Senhor Jesus Cristo, meu Salvador, guardai-me das ciladas das tentações diabólicas pelo Vosso Preciosíssimo Sangue.' },
        { t: 'p', x: 'Senhor Jesus Cristo, meu Salvador, ajudai-me pelo Vosso Preciosíssimo Sangue a vencer as tentações.' },
        { t: 'p', x: 'Senhor Jesus Cristo, meu Salvador, protegei-me e conduzi-me atrás de Vós pelo Vosso Preciosíssimo Sangue.' },
        { t: 'p', x: 'Senhor Jesus Cristo, meu Salvador, guardai de todos os perigos o Santo Padre com todo o clero e a santa Igreja pelo Vosso Preciosíssimo Sangue. Amém.' },

        { t: 'box', title: 'A regra de oração', x: [
          '**Pai Nosso…** (7 vezes) · **Ave Maria…** (7 vezes) · **Glória ao Pai…** (7 vezes)',
          'A oração reza-se **todos os dias durante doze anos**, sem interrupção.'
        ] },

        { t: 'promise', title: 'As promessas divinas', x: [
          'Quem rezar esta oração todos os dias durante doze anos, sem interrupção, não passará pelo purgatório.',
          'Quem tiver começado a rezá-la e morrer ao fim de seis meses receberá igualmente todas estas grandes graças: cinco almas da sua família receberão a vocação ao estado religioso, e até à quarta geração ninguém da sua família estará no inferno.',
          'Esta oração de doze anos tem o poder de purificar a alma de todas as iniquidades. _Senhor, dai a Vossa bênção!_'
        ] }
      ]
    },

    {
      id: 'consecration',
      nav: 'Consagração',
      title: 'Ato de consagração pessoal ao Preciosíssimo Sangue de Jesus Cristo',
      subtitle: '',
      blocks: [
        { t: 'p', x: 'Na plena consciência do meu nada e, ao mesmo tempo, da Vossa grandeza, ó misericordioso Salvador, prostro-me a Vossos pés e agradeço-Vos as inúmeras provas de graça que concedestes a mim, criatura ingrata, e sobretudo por me terdes libertado, pelo Vosso Preciosíssimo Sangue, do poder corruptor de satanás. Na presença da minha amada Mãe Maria, do meu Anjo da Guarda, dos meus santos Padroeiros e de toda a corte celeste, consagro-me, ó dulcíssimo Jesus, com toda a sinceridade do coração e do modo mais livre, ao Vosso Preciosíssimo Sangue, pelo qual redimistes o mundo inteiro do pecado, da morte e do inferno.' },

        { t: 'p', x: 'Eu, {{name}}, prometo-Vos, confiando no auxílio da Vossa graça, despertar e difundir com todas as minhas forças e segundo todas as minhas possibilidades a devoção ao Vosso Preciosíssimo Sangue, Preço da nossa Redenção, para que o Vosso Sangue, digno da maior veneração, seja por todos honrado e amado.' },

        { t: 'p', x: 'Deste modo desejo reparar a minha infidelidade para com o Vosso Preciosíssimo Sangue e o Vosso Amor, e dar-Vos satisfação pelas inúmeras profanações e ultrajes que os homens infligem a esse Preço caríssimo da nossa salvação. Oh, se os meus próprios pecados, a minha tibieza e todos os ultrajes com que alguma vez Vos desonrei, ó Preciosíssimo Sangue, pudessem ser reduzidos ao nada!' },

        { t: 'p', x: 'Eis, dulcíssimo Jesus, que Vos ofereço também o amor, a honra e a adoração que a Vossa santíssima Mãe, os Vossos fiéis discípulos e todos os santos prestaram ao Vosso Preciosíssimo Sangue. Peço-Vos: não Vos lembreis mais da minha antiga infidelidade e tibieza, e dignai-Vos perdoar a todos os que Vos ultrajam. Aspergi-me, ó divino Salvador, com o Vosso Preciosíssimo Sangue, e com ele todos os homens, para que doravante Vos amemos de todo o coração, ó Amor crucificado, e possamos honrar dignamente para sempre o Preço da nossa Redenção. Amém.' }
      ]
    },

    {
      id: 'gertrude',
      nav: 'Sta. Gertrudes',
      title: 'A oração de santa Gertrudes Magna',
      subtitle: 'Para a libertação das almas do Purgatório',
      blocks: [
        { t: 'promise', title: 'A promessa de Nosso Senhor Jesus', x: [
          'Nosso Senhor Jesus revelou a santa Gertrudes Magna que uma só recitação desta oração liberta **mil almas do Purgatório**.'
        ] },

        { t: 'lead', x: '«Eterno Pai, eu Vos ofereço o Preciosíssimo Sangue do Vosso divino Filho, Nosso Senhor Jesus Cristo, em união com todas as Missas celebradas hoje em todo o mundo: pelas almas do purgatório, pelos moribundos, pelos pecadores do mundo, pelos pecadores da Igreja universal, pelos pecadores da minha família e da minha casa. Amém.»' },

        { t: 'note', x: '(Indulgência de 500 dias.)' }
      ]
    },

    {
      id: 'golden-arrow',
      nav: 'Flecha de Ouro',
      title: 'O ato de adoração «A Flecha de Ouro»',
      subtitle: 'Em louvor do santíssimo Nome de Deus',
      blocks: [
        { t: 'poem', lines: [
          'Seja para sempre louvado,',
          'Bendito, amado,',
          'Adorado e glorificado',
          'O santíssimo, sacratíssimo,',
          'Adorabilíssimo, incompreensível',
          'E inefável Nome de Deus',
          'No céu, na terra e nos abismos,',
          'Por todas as criaturas',
          'Saídas das mãos de Deus,',
          'E pelo santíssimo Coração de Nosso Senhor Jesus Cristo',
          'No Santíssimo Sacramento do altar. Amém.'
        ] },

        { t: 'note', x: '(Este ato de adoração pertence à confraria da Santa Face de Jesus.)' }
      ]
    },

    {
      id: 'shoulder-wound',
      nav: 'Chaga do Ombro',
      title: 'Oração à santa Chaga do Ombro de Cristo',
      subtitle: '',
      blocks: [
        { t: 'p', x: 'Ó amabilíssimo Jesus, meu mansíssimo Cordeiro de Deus! Eu, pobre pecador, saúdo e adoro essa Vossa santíssima Chaga, que Vos causou uma dor tão intensa quando carregastes a pesada Cruz sobre o Vosso divino Ombro. Essa dor foi mais grave e mais amarga do que as outras Chagas do Vosso santo Corpo. Amo-Vos, dou-Vos honra e prostro-me diante de Vós do fundo do coração.' },

        { t: 'p', x: 'Dou-Vos graças por essa profundíssima Chaga do Vosso Ombro. Humildemente Vos peço, em nome do sofrimento que padecestes pela Chaga do Ombro e em nome da Vossa pesada Cruz, que carregastes sobre essa santa Chaga: tende misericórdia de mim, indigno pecador. Perdoai-me todos os pecados e concedei-me que, caminhando nas Vossas pegadas ensanguentadas, alcance a bem-aventurada eternidade. Amém.' },

        { t: 'box', title: 'A regra de oração', x: [
          '**Pai Nosso…** (3 vezes) · **Ave Maria…** (3 vezes)',
          '_Bendito sejais, ó Senhor, escondido no Santíssimo Sacramento._ (3 vezes)'
        ] },

        { t: 'lead', x: 'Ó Preciosíssimo Sangue, que correis da sagrada Cabeça de Nosso Senhor Jesus Cristo, Templo da divina Sabedoria e Morada de Deus, do conhecimento, da luz do céu e da terra: guardai-me agora e pelos séculos dos séculos. Amém.' }
      ]
    },

    {
      id: 'eucharistic-heart',
      nav: 'Coração Eucarístico',
      title: 'Oração ao Coração Eucarístico de Jesus',
      subtitle: 'A devoção dos trinta e três dias',
      blocks: [
        { t: 'lead', x: '«Jesus, Maria, amo-Vos — salvai as almas. Ó Sangue e Água, que jorrastes do santíssimo Coração de Cristo como Fonte de Misericórdia para nós, confiamos em Vós. Jesus, confiamos em Vós e em Vós depositamos toda a nossa esperança.»' },

        { t: 'refrain', x: 'Coração Eucarístico de Jesus, confio em Vós.' },

        { t: 'litany', ordered: true, items: [
          ['Coração Eucarístico de Jesus, ardente de Amor,', 'inflamai de amor os nossos corações.'],
          ['Coração Eucarístico de Jesus,', 'aumentai em nós a fé e o amor.'],
          ['Coração Eucarístico de Jesus, Fonte da vontade reta,', 'dai-nos uma vontade reta.'],
          ['Coração Eucarístico de Jesus, Criador do mundo, que tendes o mundo na Vossa Mão,', 'não nos deixeis sair da Vossa proteção.'],
          ['Coração Eucarístico de Jesus, Médico de Deus, que sofrestes a morte na Cruz,', 'curai as feridas dos nossos pecados.'],
          ['Coração Eucarístico de Jesus, em memória da Vossa amarga Paixão,', 'dai-nos verdadeira contrição e o perdão dos pecados.'],
          ['Coração Eucarístico de Jesus, Espelho da Luz eterna,', 'concedei-nos contemplar-Vos na eternidade.'],
          ['Coração Eucarístico de Jesus,', 'mostrai-Vos misericordioso para connosco na hora da nossa morte.'],
          ['Coração Eucarístico de Jesus,', 'apagai em nós inteiramente o ardor das cobiças do mundo.'],
          ['Coração Eucarístico de Jesus, Bondade dos corações,', 'pelo Vosso Preciosíssimo Sangue vinde a nós na hora da nossa morte.']
        ] },

        { t: 'refrain', x: 'Coração Eucarístico de Jesus, confio em Vós.' },

        { t: 'rule' },

        { t: 'litany', items: [
          ['Coração Eucarístico de Jesus, fonte inesgotável de vida e de santidade,', 'santificai-me com o Vosso Preciosíssimo Sangue.'],
          ['Coração Eucarístico de Jesus, fornalha de amor inextinguível,', 'inflamai o meu coração no amor por Vós.'],
          ['Coração Eucarístico de Jesus, que nos esperais pacientemente no sacrário,', 'ensinai-me a fidelidade.'],
          ['Coração Eucarístico de Jesus, ultrajado por comunhões indignas,', 'aceitai a minha reparação.'],
          ['Coração Eucarístico de Jesus, Pão dos anjos e alimento das almas,', 'saciai a minha pobreza.'],
          ['Coração Eucarístico de Jesus, consolo dos aflitos e força dos fracos,', 'amparai-me no caminho.'],
          ['Coração Eucarístico de Jesus, refúgio dos pecadores,', 'não me rejeiteis.'],
          ['Coração Eucarístico de Jesus, consolação das almas do purgatório,', 'libertai-as com o Vosso Preciosíssimo Sangue.'],
          ['Coração Eucarístico de Jesus, Viático dos moribundos,', 'assisti-me na minha última hora.'],
          ['Coração Eucarístico de Jesus, cheio de misericórdia para connosco,', 'tende piedade de mim.']
        ] },

        { t: 'p', x: 'Ó Coração Eucarístico de Jesus, que por amor de nós permanecestes connosco sob as espécies do pão e do vinho até ao fim dos séculos, acolhei esta minha pobre oração. Creio que estais aqui presente, verdadeira, real e substancialmente; espero na Vossa misericórdia e amo-Vos acima de todas as coisas. Por todos os ultrajes que recebeis no Santíssimo Sacramento, ofereço-Vos o Preciosíssimo Sangue que derramastes por mim na Cruz. Amém.' },

        { t: 'promise', title: 'A promessa dos 33 dias', x: [
          'Quem durante **trinta e três dias** — em memória dos trinta e três anos da vida terrena do Salvador — rezar todos os dias, sem interrupção, esta oração ao Coração Eucarístico de Jesus, obterá a **completa remissão da pena e da culpa**.',
          '_Reza-se em estado de graça santificante, tendo-se aproximado da santa Confissão e da Comunhão._'
        ] },

        { t: 'tracker', kind: '33d' }
      ]
    }
  ],

  footer: {
    motto: 'Ó Preciosíssimo Sangue de Nosso Senhor Jesus Cristo, salvai-me!',
    note: 'Devoção privada. As promessas ligadas a estas orações provêm de revelações privadas e não são artigos de fé.',
    copyright: 'Devoção ao Preciosíssimo Sangue de Cristo'
  }
};
