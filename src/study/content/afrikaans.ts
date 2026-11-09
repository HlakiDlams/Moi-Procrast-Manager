import type { Course } from '../types'

/**
 * Afrikaans Eerste Addisionele Taal (EAT / FAL).
 * Starts with everyday basics, then the Paper 1 language work (taal in konteks),
 * comprehension + summary, Paper 3 writing formats and Paper 2 poetry terms.
 */

const THANDI = `Thandi woon in Potchefstroom saam met haar ouma. Elke oggend staan sy om vieruur op. Sy bid, doen haar take en eet ontbyt. Daarna leer sy vir haar eksamen. Wiskunde is vir haar moeilik, maar sy gee nie op nie. Sy sê: "As ek elke dag ’n bietjie leer, sal ek slaag."`

export const AFRIKAANS: Course = {
  id: 'afrikaans',
  name: 'Afrikaans EAT',
  icon: '🗣️',
  color: '#FF8AC8',
  subjectName: 'Afrikaans EAT',
  group: 'school',
  lang: 'af-ZA',
  units: [
    // ------------------------------------------------------------------ basics
    {
      id: 'a-basics',
      title: 'Basiese woordeskat',
      icon: '👋',
      description: 'Groete, getalle, skool en huis',
      lessons: [
        {
          id: 'a-greet',
          title: 'Groete',
          teach: {
            text: ['Goeie môre = Good morning', 'Goeiemiddag = Good afternoon · Goeienaand = Good evening', 'Hoe gaan dit? = How are you? → Dit gaan goed, dankie.', 'Asseblief = please · Baie dankie = thank you very much · Totsiens = goodbye'],
            example: ['A: Goeie môre! Hoe gaan dit?', 'B: Dit gaan goed, dankie. En met jou?', 'A: Ook goed, baie dankie.'],
            say: 'Goeie môre! Hoe gaan dit? Dit gaan goed, dankie. En met jou? Ook goed, baie dankie.',
          },
          questions: [
            { id: 'gr1', type: 'mcq', prompt: 'Wat beteken "Baie dankie"?', say: 'Baie dankie', options: ['Thank you very much', 'Please', 'Goodbye', 'Good morning'], answer: 0, explain: '"Baie" = very/much, "dankie" = thanks.' },
            {
              id: 'gr2',
              type: 'match',
              prompt: 'Match the Afrikaans to the English',
              pairs: [
                ['Goeie môre', 'Good morning'],
                ['Totsiens', 'Goodbye'],
                ['Asseblief', 'Please'],
                ['Hoe gaan dit?', 'How are you?'],
              ],
              explain: 'These four are used every single day. Learn them first!',
            },
            { id: 'gr3', type: 'mcq', prompt: 'Iemand vra: "Hoe gaan dit?" Jy antwoord:', say: 'Hoe gaan dit?', options: ['Dit gaan goed, dankie.', 'Totsiens.', 'Asseblief.', 'Goeienaand.'], answer: 0, explain: '"Dit gaan goed, dankie" = I am well, thanks.' },
            { id: 'gr4', type: 'input', prompt: 'Vertaal: please', answers: ['asseblief'], explain: 'Please = asseblief.' },
            { id: 'gr5', type: 'mcq', prompt: 'Which greeting do you use at 19:00?', options: ['Goeienaand', 'Goeie môre', 'Goeiemiddag', 'Totsiens'], answer: 0, explain: 'Evening = aand, so "Goeienaand".' },
            { id: 'gr6', type: 'mcq', prompt: '"Ek is jammer" means…', say: 'Ek is jammer', options: ['I am sorry', 'I am hungry', 'I am happy', 'I am late'], answer: 0, explain: 'Jammer = sorry. (Honger = hungry, bly = happy, laat = late.)' },
          ],
        },
        {
          id: 'a-numbers',
          title: 'Getalle, dae en maande',
          teach: {
            text: ['1–10: een, twee, drie, vier, vyf, ses, sewe, agt, nege, tien', '11–20: elf, twaalf, dertien, veertien, vyftien, sestien, sewentien, agtien, negentien, twintig', 'Dae: Maandag, Dinsdag, Woensdag, Donderdag, Vrydag, Saterdag, Sondag', 'Maande: Januarie, Februarie, Maart, April, Mei, Junie, Julie, Augustus, September, Oktober, November, Desember'],
            say: 'een, twee, drie, vier, vyf, ses, sewe, agt, nege, tien. Maandag, Dinsdag, Woensdag, Donderdag, Vrydag, Saterdag, Sondag.',
          },
          questions: [
            {
              id: 'nu1',
              type: 'match',
              prompt: 'Match the numbers',
              pairs: [
                ['drie', '3'],
                ['sewe', '7'],
                ['nege', '9'],
                ['twaalf', '12'],
              ],
              explain: 'drie = 3, sewe = 7, nege = 9, twaalf = 12.',
            },
            { id: 'nu2', type: 'input', prompt: 'Skryf 5 in Afrikaans', answers: ['vyf'], explain: '5 = vyf.' },
            { id: 'nu3', type: 'mcq', prompt: 'Watter dag kom ná Woensdag?', options: ['Donderdag', 'Dinsdag', 'Vrydag', 'Maandag'], answer: 0, explain: 'Woensdag (Wednesday) → Donderdag (Thursday).' },
            { id: 'nu4', type: 'mcq', prompt: 'Which month is "March"?', options: ['Maart', 'Mei', 'Maandag', 'Mars'], answer: 0, explain: 'March = Maart. (Mei = May, Maandag = Monday.)' },
            { id: 'nu5', type: 'input', prompt: 'Skryf 20 in Afrikaans', answers: ['twintig'], explain: '20 = twintig.' },
            { id: 'nu6', type: 'mcq', prompt: 'Wat is "vyftien"?', say: 'vyftien', options: ['15', '50', '5', '14'], answer: 0, explain: 'vyf (5) + tien (10) = vyftien = 15.' },
          ],
        },
        {
          id: 'a-home',
          title: 'Skool en huis',
          teach: {
            text: ['Skool: leerder (learner), onderwyser (teacher), huiswerk (homework), eksamen (exam), boek, pen', 'Huis: kombuis (kitchen), slaapkamer (bedroom), badkamer (bathroom), sitkamer (lounge)', 'Familie: ma, pa, suster, broer, ouma (granny), oupa (grandpa)'],
          },
          questions: [
            {
              id: 'ho1',
              type: 'match',
              prompt: 'Match the words',
              pairs: [
                ['huiswerk', 'homework'],
                ['eksamen', 'exam'],
                ['kombuis', 'kitchen'],
                ['broer', 'brother'],
              ],
              explain: 'Huiswerk, eksamen, kombuis, broer: all high-frequency words.',
            },
            { id: 'ho2', type: 'mcq', prompt: '"Slaapkamer" is a…', say: 'slaapkamer', options: ['bedroom', 'bathroom', 'lounge', 'classroom'], answer: 0, explain: 'Slaap = sleep, kamer = room.' },
            { id: 'ho3', type: 'input', prompt: 'Vertaal: sister', answers: ['suster'], explain: 'Sister = suster.' },
            { id: 'ho4', type: 'mcq', prompt: '"Ouma" means…', options: ['grandmother', 'aunt', 'mother', 'sister'], answer: 0, explain: 'Ouma = grandmother, oupa = grandfather.' },
            { id: 'ho5', type: 'mcq', prompt: 'Ek skryf met ’n ___.', options: ['pen', 'kombuis', 'ouma', 'bed'], answer: 0, explain: 'You write with a pen.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------ sentence building
    {
      id: 'a-sentences',
      title: 'Sinsbou',
      icon: '🧱',
      description: 'Woordorde (STOMPI) en voegwoorde',
      lessons: [
        {
          id: 'a-stompi',
          title: 'Woordorde: STOMPI',
          teach: {
            text: [
              'Afrikaans word order: Subjek → Werkwoord → Tyd → Objek → Manier → Plek → Infinitief',
              'The (first) werkwoord is always in 2nd place.',
              'A second werkwoord (infinitief) goes right at the end.',
              'If you start with time (Môre…), the verb STILL comes 2nd: Môre gaan ek…',
            ],
            example: ['Ek | gaan | môre | met die bus | skool toe.', 'S    W     T        M            P', '', 'Sy | wil | vanaand | in haar kamer | studeer.', 'S    W     T          P             I'],
            say: 'Ek gaan môre met die bus skool toe. Sy wil vanaand in haar kamer studeer.',
          },
          questions: [
            { id: 'st1', type: 'order', prompt: 'Bou die sin: I am going to school by bus tomorrow.', steps: ['Ek', 'gaan', 'môre', 'met die bus', 'skool toe'], explain: 'S (Ek) W (gaan) T (môre) M (met die bus) P (skool toe).' },
            { id: 'st2', type: 'mcq', prompt: 'Watter sin is korrek?', options: ['Sy wil vanaand studeer.', 'Sy vanaand wil studeer.', 'Vanaand sy wil studeer.'], answer: 0, explain: 'Verb "wil" in 2nd place, infinitive "studeer" at the end.' },
            { id: 'st3', type: 'mcq', prompt: 'Môre ___', options: ['gaan ek skool toe.', 'ek gaan skool toe.', 'skool toe ek gaan.'], answer: 0, explain: 'Starting with time pushes the subject after the verb: Môre gaan ek…' },
            { id: 'st4', type: 'order', prompt: 'Bou die sin: He plays soccer on the field every afternoon.', steps: ['Hy', 'speel', 'elke middag', 'sokker', 'op die veld'], explain: 'S (Hy) W (speel) T (elke middag) O (sokker) P (op die veld).' },
            { id: 'st5', type: 'mcq', prompt: 'In STOMPI, what does P stand for?', options: ['Plek (place)', 'Persoon (person)', 'Prent (picture)', 'Pen'], answer: 0, explain: 'P = Plek: where it happens.' },
            { id: 'st6', type: 'order', prompt: 'Bou die sin: We must study at the library today.', steps: ['Ons', 'moet', 'vandag', 'by die biblioteek', 'leer'], explain: 'S W T P I: Ons moet vandag by die biblioteek leer.' },
          ],
        },
        {
          id: 'a-voeg',
          title: 'Voegwoorde',
          teach: {
            text: [
              'Group 1, normal word order (verb stays 2nd): en, maar, of, want',
              'Group 2, the verb jumps to the END: omdat, dat, as, wanneer, terwyl, toe, sodat, hoewel',
            ],
            example: ['Ek bly tuis, want ek is siek.', 'Ek bly tuis, omdat ek siek is.', '                              ↑ verb at the end'],
          },
          questions: [
            { id: 'vo1', type: 'mcq', prompt: 'Ek bly tuis, omdat ek ___.', options: ['siek is', 'is siek'], answer: 0, explain: '"Omdat" sends the verb to the end: omdat ek siek is.' },
            { id: 'vo2', type: 'mcq', prompt: 'Ek bly tuis, want ek ___.', options: ['is siek', 'siek is'], answer: 0, explain: '"Want" keeps normal order: want ek is siek.' },
            { id: 'vo3', type: 'mcq', prompt: 'Which voegwoord sends the verb to the end?', options: ['omdat', 'en', 'maar', 'want'], answer: 0, explain: 'en, maar, of, want keep normal order. Omdat sends the verb to the end.' },
            { id: 'vo4', type: 'order', prompt: 'Join with "omdat": Sy leer hard. Sy wil slaag.', steps: ['Sy leer hard,', 'omdat', 'sy', 'wil', 'slaag.'], explain: 'Sy leer hard, omdat sy wil slaag. Both verbs at the end.' },
            { id: 'vo5', type: 'mcq', prompt: 'Vertaal: but', options: ['maar', 'want', 'of', 'en'], answer: 0, explain: 'maar = but, want = because, of = or, en = and.' },
            { id: 'vo6', type: 'mcq', prompt: 'Hy sê dat hy môre ___.', options: ['sal kom', 'kom sal'], answer: 0, explain: 'After "dat", the verbs go to the end in the order: sal kom.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------ tenses
    {
      id: 'a-tense',
      title: 'Tye',
      icon: '⏳',
      description: 'Verlede tyd en toekomende tyd',
      lessons: [
        {
          id: 'a-past',
          title: 'Verlede tyd',
          teach: {
            text: [
              'Past tense = het + ge- + werkwoord (at the end).',
              'is → was · het (have) → het … gehad',
              'kan → kon · wil → wou · moet → moes · sal → sou',
              'Verbs starting with be-, ge-, er-, her-, ont-, ver- get NO extra ge-.',
            ],
            example: ['Ek eet brood. → Ek het brood geëet.', 'Sy is moeg. → Sy was moeg.', 'Ons verstaan. → Ons het verstaan.'],
          },
          questions: [
            { id: 'pa1', type: 'mcq', prompt: 'Ek eet brood. (Verlede tyd)', options: ['Ek het brood geëet.', 'Ek het brood eet.', 'Ek geëet brood.', 'Ek eet het brood.'], answer: 0, explain: 'het + ge- + eet at the end: Ek het brood geëet.' },
            { id: 'pa2', type: 'input', prompt: 'Sy is moeg. → Sy ___ moeg.', answers: ['was'], explain: 'is → was.' },
            { id: 'pa3', type: 'mcq', prompt: 'Ons verstaan die werk. (Verlede tyd)', options: ['Ons het die werk verstaan.', 'Ons het die werk geverstaan.', 'Ons verstaan het die werk.'], answer: 0, explain: 'Verstaan starts with ver-, so no ge-.' },
            { id: 'pa4', type: 'mcq', prompt: 'Hy kan swem. (Verlede tyd)', options: ['Hy kon swem.', 'Hy het kan swem.', 'Hy het gekan swem.'], answer: 0, explain: 'kan → kon.' },
            { id: 'pa5', type: 'mcq', prompt: 'Ek het ’n hond. (Verlede tyd)', options: ['Ek het ’n hond gehad.', 'Ek het ’n hond.', 'Ek was ’n hond.'], answer: 0, explain: 'het (have) → het … gehad.' },
            { id: 'pa6', type: 'order', prompt: 'Hulle speel sokker. → Verlede tyd', steps: ['Hulle', 'het', 'sokker', 'gespeel'], explain: 'Hulle het sokker gespeel.' },
          ],
        },
        {
          id: 'a-future',
          title: 'Toekomende tyd',
          teach: {
            text: ['Future = sal + werkwoord (at the end).', 'is → sal … wees'],
            example: ['Ek skryf ’n brief. → Ek sal ’n brief skryf.', 'Dit is koud. → Dit sal koud wees.'],
          },
          questions: [
            { id: 'fu1', type: 'mcq', prompt: 'Ek skryf ’n brief. (Toekoms)', options: ['Ek sal ’n brief skryf.', 'Ek sal skryf ’n brief.', 'Ek skryf sal ’n brief.'], answer: 0, explain: 'sal in 2nd place, skryf at the end.' },
            { id: 'fu2', type: 'input', prompt: 'Sy lees die boek. → Sy ___ die boek lees.', answers: ['sal'], explain: 'Future: sal.' },
            { id: 'fu3', type: 'order', prompt: 'Bou die sin: We will write exams next week.', steps: ['Ons', 'sal', 'volgende week', 'eksamen', 'skryf'], explain: 'Ons sal volgende week eksamen skryf.' },
            { id: 'fu4', type: 'mcq', prompt: 'Which sentence is in the future tense?', options: ['Hulle sal later kom.', 'Hulle het gekom.', 'Hulle kom nou.'], answer: 0, explain: '"sal" = future.' },
            { id: 'fu5', type: 'mcq', prompt: 'Dit is koud. (Toekoms)', options: ['Dit sal koud wees.', 'Dit sal koud is.', 'Dit is sal koud.'], answer: 0, explain: 'is → sal … wees.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------ taal in konteks
    {
      id: 'a-taal',
      title: 'Taal in konteks',
      icon: '✍️',
      description: 'Paper 1: meervoud, ontkenning, lydende vorm, indirekte rede, trappe',
      lessons: [
        {
          id: 'a-plural',
          title: 'Meervoud en verkleinwoord',
          teach: {
            text: [
              'Meervoud (plural): mostly add -e or -s: boek → boeke, tafel → tafels.',
              'Learn the odd ones: kind → kinders, stad → stede, skip → skepe.',
              'Verkleinwoord (small): -ie, -jie, -tjie, -pie, -etjie',
            ],
            example: ['boek → boekie', 'hond → hondjie', 'boom → boompie', 'man → mannetjie'],
          },
          questions: [
            { id: 'pl1', type: 'mcq', prompt: 'Meervoud: boek', options: ['boeke', 'boeks', 'boekes', 'boeken'], answer: 0, explain: 'boek → boeke.' },
            { id: 'pl2', type: 'mcq', prompt: 'Meervoud: kind', options: ['kinders', 'kinde', 'kinds', 'kindere'], answer: 0, explain: 'kind → kinders (an exception, learn it).' },
            { id: 'pl3', type: 'input', prompt: 'Meervoud: tafel', answers: ['tafels'], explain: 'Words ending in -el usually take -s: tafels.' },
            { id: 'pl4', type: 'mcq', prompt: 'Verkleinwoord: hond', options: ['hondjie', 'hondie', 'hondtjie', 'hondetjie'], answer: 0, explain: 'Ending in -d → -jie: hondjie.' },
            {
              id: 'pl5',
              type: 'match',
              prompt: 'Match the verkleinwoord',
              pairs: [
                ['boom', 'boompie'],
                ['man', 'mannetjie'],
                ['boek', 'boekie'],
                ['kat', 'katjie'],
              ],
              explain: 'boompie, mannetjie, boekie, katjie.',
            },
            { id: 'pl6', type: 'mcq', prompt: 'Meervoud: stad', options: ['stede', 'stads', 'stadde', 'stade'], answer: 0, explain: 'stad → stede (exception).' },
          ],
        },
        {
          id: 'a-neg',
          title: 'Ontkenning',
          teach: {
            text: [
              'Afrikaans uses a double negative: nie … nie.',
              'If "nie" would be the last word anyway, use only one.',
              'iets → niks · iemand → niemand · altyd → nooit · oral → nêrens · ’n → geen (and still end with nie)',
            ],
            example: ['Ek hou van sokker. → Ek hou nie van sokker nie.', 'Ek eet. → Ek eet nie.', 'Sy het altyd tyd. → Sy het nooit tyd nie.'],
          },
          questions: [
            { id: 'ne1', type: 'mcq', prompt: 'Ek hou van sokker. (Ontken)', options: ['Ek hou nie van sokker nie.', 'Ek hou nie van sokker.', 'Ek nie hou van sokker nie.'], answer: 0, explain: 'nie after the verb, and nie at the end.' },
            { id: 'ne2', type: 'mcq', prompt: 'Ek eet. (Ontken)', options: ['Ek eet nie.', 'Ek eet nie nie.', 'Ek nie eet.'], answer: 0, explain: 'Only one "nie" when it is already the last word.' },
            {
              id: 'ne3',
              type: 'match',
              prompt: 'Match the positive to the negative',
              pairs: [
                ['iets', 'niks'],
                ['iemand', 'niemand'],
                ['altyd', 'nooit'],
                ['oral', 'nêrens'],
              ],
              explain: 'iets/niks, iemand/niemand, altyd/nooit, oral/nêrens.',
            },
            { id: 'ne4', type: 'mcq', prompt: 'Sy het altyd tyd. (Ontken)', options: ['Sy het nooit tyd nie.', 'Sy het nie altyd tyd.', 'Sy het nooit tyd.'], answer: 0, explain: 'altyd → nooit, plus nie at the end.' },
            { id: 'ne5', type: 'mcq', prompt: 'Daar is iemand by die deur. (Ontken)', options: ['Daar is niemand by die deur nie.', 'Daar is nie iemand by die deur.', 'Daar is niemand by die deur.'], answer: 0, explain: 'iemand → niemand, plus nie at the end.' },
            { id: 'ne6', type: 'mcq', prompt: 'Ek het ’n pen. (Ontken with "geen")', options: ['Ek het geen pen nie.', 'Ek het geen pen.', 'Ek het nie pen nie.'], answer: 0, explain: '’n → geen, and still end with nie.' },
          ],
        },
        {
          id: 'a-passive',
          title: 'Lydende vorm',
          teach: {
            text: [
              'Bedrywend (active): the subject DOES it. Lydend (passive): it is done TO the object.',
              'The object moves to the front, the doer comes after "deur".',
              'Present: word + ge-… · Past: is + ge-… · Future: sal … ge-… word',
            ],
            example: ['Die seun skop die bal.', '→ Die bal word deur die seun geskop.', 'Die seun het die bal geskop.', '→ Die bal is deur die seun geskop.', 'Die seun sal die bal skop.', '→ Die bal sal deur die seun geskop word.'],
          },
          questions: [
            { id: 'ly1', type: 'mcq', prompt: 'Ma kook die kos. (Lydende vorm)', options: ['Die kos word deur Ma gekook.', 'Die kos is deur Ma gekook.', 'Die kos word deur Ma kook.'], answer: 0, explain: 'Present → word + gekook.' },
            { id: 'ly2', type: 'mcq', prompt: 'Die hond het die been gevreet. (Lydende vorm)', options: ['Die been is deur die hond gevreet.', 'Die been word deur die hond gevreet.', 'Die been het deur die hond gevreet.'], answer: 0, explain: 'Past (het … ge-) → is + gevreet.' },
            { id: 'ly3', type: 'mcq', prompt: 'Die onderwyser sal die toets nasien. (Lydende vorm)', options: ['Die toets sal deur die onderwyser nagesien word.', 'Die toets sal deur die onderwyser nasien word.', 'Die toets word deur die onderwyser nagesien.'], answer: 0, explain: 'Future → sal … nagesien word. (nasien → nagesien)' },
            { id: 'ly4', type: 'mcq', prompt: 'Which word introduces the doer in lydende vorm?', options: ['deur', 'vir', 'met', 'van'], answer: 0, explain: 'deur = by: "deur die seun".' },
            { id: 'ly5', type: 'mcq', prompt: '"Die brief is deur Thandi geskryf." Active or passive?', options: ['Lydend (passive)', 'Bedrywend (active)'], answer: 0, explain: '"is … deur … geskryf" = passive.' },
            { id: 'ly6', type: 'input', prompt: 'Die huis ___ deur die bouers gebou. (present tense)', answers: ['word'], explain: 'Present passive uses "word".' },
          ],
        },
        {
          id: 'a-indirect',
          title: 'Indirekte rede',
          teach: {
            text: [
              'Remove the quotation marks and add "dat" (verb goes to the end).',
              'Change the pronouns: ek → hy/sy, ons → hulle.',
              'If the sentence says "het gesê", present becomes past: is → was.',
              'Time/place: vandag → daardie dag, môre → die volgende dag, gister → die vorige dag, hier → daar',
              'Yes/no question → "of"',
            ],
            example: ['Sipho sê: "Ek is honger."', '→ Sipho sê dat hy honger is.', 'Ma vra: "Het jy geëet?"', '→ Ma vra of ek geëet het.'],
          },
          questions: [
            { id: 'ir1', type: 'mcq', prompt: 'Sipho sê: "Ek is honger."', options: ['Sipho sê dat hy honger is.', 'Sipho sê dat ek honger is.', 'Sipho sê dat hy is honger.'], answer: 0, explain: 'ek → hy, and "is" goes to the end after "dat".' },
            { id: 'ir2', type: 'mcq', prompt: 'Lerato het gesê: "Ek is moeg."', options: ['Lerato het gesê dat sy moeg was.', 'Lerato het gesê dat ek moeg was.', 'Lerato het gesê sy was moeg dat.'], answer: 0, explain: '"het gesê" → is becomes was; ek → sy.' },
            {
              id: 'ir3',
              type: 'match',
              prompt: 'Match the word changes in indirekte rede',
              pairs: [
                ['vandag', 'daardie dag'],
                ['môre', 'die volgende dag'],
                ['gister', 'die vorige dag'],
                ['hier', 'daar'],
              ],
              explain: 'Time and place words shift because it is reported later.',
            },
            { id: 'ir4', type: 'mcq', prompt: 'Ma vra: "Het jy geëet?"', options: ['Ma vra of ek geëet het.', 'Ma vra dat ek geëet het.', 'Ma vra of ek het geëet.'], answer: 0, explain: 'Yes/no question → of, and the verb goes to the end.' },
            { id: 'ir5', type: 'mcq', prompt: 'Which word starts a reported yes/no question?', options: ['of', 'dat', 'want', 'maar'], answer: 0, explain: '"of" = whether/if.' },
          ],
        },
        {
          id: 'a-trappe',
          title: 'Trappe van vergelyking',
          teach: {
            text: ['Stellend → vergrotend (-er) → oortreffend (-ste)', 'Comparing two things: … -er as …', 'Learn the irregular ones: goed → beter → beste · baie → meer → meeste · min → minder → minste'],
            example: ['groot → groter → grootste', 'lank → langer → langste', 'Thabo is langer as sy broer.'],
          },
          questions: [
            { id: 'tr1', type: 'mcq', prompt: 'Vergrotende trap: groot', options: ['groter', 'grootste', 'grootter', 'meer groot'], answer: 0, explain: 'groot → groter → grootste.' },
            { id: 'tr2', type: 'mcq', prompt: 'Oortreffende trap: goed', options: ['beste', 'goedste', 'beter', 'meeste'], answer: 0, explain: 'goed → beter → beste (irregular).' },
            { id: 'tr3', type: 'input', prompt: 'Vergrotende trap: mooi', answers: ['mooier'], explain: 'mooi → mooier → mooiste.' },
            { id: 'tr4', type: 'mcq', prompt: 'Thabo is ___ as sy broer. (lank)', options: ['langer', 'lankste', 'lanker', 'langste'], answer: 0, explain: 'Comparing two → vergrotend: langer as.' },
            {
              id: 'tr5',
              type: 'match',
              prompt: 'Match to the vergrotende trap',
              pairs: [
                ['baie', 'meer'],
                ['min', 'minder'],
                ['goed', 'beter'],
                ['oud', 'ouer'],
              ],
              explain: 'baie → meer, min → minder, goed → beter, oud → ouer.',
            },
            { id: 'tr6', type: 'mcq', prompt: 'Sy is die ___ meisie in die klas. (slim)', options: ['slimste', 'slimmer', 'slimmeste', 'slim'], answer: 0, explain: '"die … in die klas" = the most → oortreffend: slimste.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------ comprehension + summary
    {
      id: 'a-read',
      title: 'Begrip en opsomming',
      icon: '📰',
      description: 'Paper 1: leesbegrip en opsomming',
      lessons: [
        {
          id: 'a-begrip',
          title: 'Leesbegrip',
          teach: {
            text: ['Read the questions FIRST, then the text, so you know what to look for.', 'Answer in full sentences unless they ask for one word.', 'Use your own words when they say "in jou eie woorde".', 'Read the passage below. It stays on screen for every question.'],
            example: THANDI.split('. ').map((x, i, a) => (i < a.length - 1 ? x + '.' : x)),
            say: THANDI,
          },
          questions: [
            { id: 'be1', type: 'mcq', context: THANDI, prompt: 'Waar woon Thandi?', options: ['In Potchefstroom', 'In Pretoria', 'By haar ma', 'In die skool'], answer: 0, explain: '"Thandi woon in Potchefstroom…"' },
            { id: 'be2', type: 'mcq', context: THANDI, prompt: 'Hoe laat staan sy op?', options: ['Om vieruur', 'Om sesuur', 'Om agtuur', 'Om middernag'], answer: 0, explain: '"…staan sy om vieruur op."' },
            { id: 'be3', type: 'mcq', context: THANDI, prompt: 'Saam met wie woon sy?', options: ['Haar ouma', 'Haar ma', 'Haar broer', 'Haar vriendin'], answer: 0, explain: '"…saam met haar ouma."' },
            { id: 'be4', type: 'mcq', context: THANDI, prompt: 'Watter vak is vir haar moeilik?', options: ['Wiskunde', 'Afrikaans', 'Engels', 'IT'], answer: 0, explain: '"Wiskunde is vir haar moeilik…"' },
            { id: 'be5', type: 'mcq', context: THANDI, prompt: 'Wat beteken "sy gee nie op nie"?', options: ['She does not give up', 'She does not get up', 'She gives it away', 'She is not upset'], answer: 0, explain: 'opgee = to give up.' },
            { id: 'be6', type: 'mcq', context: THANDI, prompt: 'Waarom glo sy dat sy sal slaag?', options: ['Omdat sy elke dag ’n bietjie leer', 'Omdat wiskunde maklik is', 'Omdat haar ouma help', 'Omdat sy vroeg opstaan'], answer: 0, explain: '"As ek elke dag ’n bietjie leer, sal ek slaag." (Just like you 💕)' },
          ],
        },
        {
          id: 'a-opsom',
          title: 'Opsomming',
          teach: {
            text: [
              'Give exactly the number of points asked (usually 7).',
              'Write in full sentences, in your own words where you can.',
              'Stay within the word count (e.g. 50–60 words) and give the number of words at the end.',
              'No examples, no repetition, and NOT your own opinion.',
            ],
          },
          questions: [
            { id: 'op1', type: 'mcq', prompt: 'In ’n opsomming skryf jy…', options: ['volsinne', 'net enkele woorde', 'jou eie mening', 'lang voorbeelde'], answer: 0, explain: 'Full sentences (volsinne).' },
            { id: 'op2', type: 'mcq', prompt: 'Wat los jy UIT?', options: ['Voorbeelde en herhalings', 'Die hoofpunte', 'Volsinne', 'Die woordtelling'], answer: 0, explain: 'Examples and repetition are not main points.' },
            { id: 'op3', type: 'mcq', prompt: 'Jy moet 7 punte gee. Hoeveel skryf jy?', options: ['Presies 7', '5', '10', 'Soveel as moontlik'], answer: 0, explain: 'Exactly 7. Extra points don\'t earn marks and can cost you the word limit.' },
            { id: 'op4', type: 'mcq', prompt: 'Mag jy jou eie mening byvoeg?', options: ['Nee', 'Ja', 'Net aan die einde'], answer: 0, explain: 'A summary only gives the text\'s points.' },
            { id: 'op5', type: 'order', prompt: 'Put the summary steps in order', steps: ['Lees die teks deeglik', 'Onderstreep die hoofpunte', 'Skryf die punte in volsinne', 'Tel jou woorde'], explain: 'Read → underline → write → count.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------ writing
    {
      id: 'a-write',
      title: 'Skryf',
      icon: '📝',
      description: 'Paper 3: transaksionele tekste en opstel',
      lessons: [
        {
          id: 'a-trans',
          title: 'Transaksionele tekste',
          teach: {
            text: [
              'Formele brief: your address top right, date, receiver\'s address left, "Geagte Meneer/Mevrou", onderwerpreël, body, "Die uwe", your name.',
              'Informele brief: "Liewe …", end with "Groete" / "Baie liefde".',
              'E-pos: Aan, Van, Datum, Onderwerp.',
              'Dagboekinskrywing: date + time, first person (ek), your feelings.',
            ],
          },
          questions: [
            { id: 'tt1', type: 'mcq', prompt: 'Aanhef van ’n formele brief', options: ['Geagte Meneer', 'Liewe Ma', 'Haai daar', 'Hallo vriend'], answer: 0, explain: 'Formal = Geagte Meneer/Mevrou.' },
            { id: 'tt2', type: 'mcq', prompt: 'Slot van ’n formele brief', options: ['Die uwe', 'Baie liefde', 'Later!', 'Jou vriendin'], answer: 0, explain: 'Formal = Die uwe.' },
            { id: 'tt3', type: 'mcq', prompt: 'Wat skryf jy by "Onderwerp" in ’n e-pos?', options: ['Waaroor die e-pos gaan', 'Jou adres', 'Die datum', 'Jou handtekening'], answer: 0, explain: 'The subject line says what it is about.' },
            { id: 'tt4', type: 'mcq', prompt: '’n Dagboekinskrywing word geskryf in die…', options: ['eerste persoon (ek)', 'derde persoon (hy/sy)', 'tweede persoon (jy)'], answer: 0, explain: 'A diary is about you: ek.' },
            {
              id: 'tt5',
              type: 'match',
              prompt: 'Match the text type to how it starts',
              pairs: [
                ['Formele brief', 'Geagte Mevrou'],
                ['Informele brief', 'Liewe Sipho'],
                ['E-pos', 'Onderwerp:'],
                ['Dagboek', 'Maandag, 9 November, 21:00'],
              ],
              explain: 'Each format has its own opening.',
            },
            { id: 'tt6', type: 'mcq', prompt: '"Liewe Oupa" is the aanhef of a…', options: ['informele brief', 'formele brief', 'koerantberig'], answer: 0, explain: '"Liewe" = dear → informal.' },
          ],
        },
        {
          id: 'a-opstel',
          title: 'Opstel',
          teach: {
            text: [
              'Structure: inleiding → 3–4 paragrawe (one idea each) → slot.',
              'Verhalend = tells a story · Beskrywend = describes · Betogend = argues for/against · Bespiegelend = reflects',
              'Plan first (breinkaart), then check spelling, tenses and word order (STOMPI!).',
            ],
          },
          questions: [
            { id: 'os1', type: 'mcq', prompt: 'Opstel wat ’n storie vertel', options: ['Verhalend', 'Betogend', 'Beskrywend', 'Bespiegelend'], answer: 0, explain: 'Verhaal = story.' },
            { id: 'os2', type: 'mcq', prompt: 'Opstel wat vir of teen iets argumenteer', options: ['Betogend', 'Verhalend', 'Beskrywend', 'Bespiegelend'], answer: 0, explain: 'Betoog = argument.' },
            { id: 'os3', type: 'mcq', prompt: 'Hoeveel hoofgedagtes in een paragraaf?', options: ['Een', 'Drie', 'Soveel as moontlik', 'Geen'], answer: 0, explain: 'One main idea per paragraph.' },
            { id: 'os4', type: 'order', prompt: 'Put the writing steps in order', steps: ['Beplan (breinkaart)', 'Skryf die inleiding', 'Skryf die paragrawe', 'Skryf die slot', 'Lees oor en verbeter'], explain: 'Plan → intro → body → ending → check.' },
            { id: 'os5', type: 'mcq', prompt: 'Wat doen ’n goeie inleiding?', options: ['Trek die leser se aandag', 'Som alles op', 'Sê totsiens', 'Lys bronne'], answer: 0, explain: 'A good intro grabs the reader\'s attention.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------ literature
    {
      id: 'a-lit',
      title: 'Letterkunde',
      icon: '🌹',
      description: 'Paper 2: poësie-terme',
      lessons: [
        {
          id: 'a-poetry',
          title: 'Beeldspraak en klank',
          teach: {
            text: [
              'Vergelyking (simile): uses "soos" or "as": so vinnig soos ’n jagluiperd.',
              'Metafoor: says something IS something else: Hy is ’n leeu.',
              'Personifikasie: gives human qualities: Die wind fluister.',
              'Alliterasie: same starting consonant: Die dapper dogter dans.',
              'Assonansie: same vowel sound: Die maan staan laag.',
            ],
          },
          questions: [
            { id: 'po1', type: 'mcq', prompt: '"Die wind fluister deur die bome."', options: ['Personifikasie', 'Vergelyking', 'Metafoor', 'Alliterasie'], answer: 0, explain: 'Only people whisper → personifikasie.' },
            { id: 'po2', type: 'mcq', prompt: '"Hy is so sterk soos ’n os."', options: ['Vergelyking', 'Metafoor', 'Personifikasie', 'Assonansie'], answer: 0, explain: '"soos" → vergelyking.' },
            { id: 'po3', type: 'mcq', prompt: '"My ma is ’n engel."', options: ['Metafoor', 'Vergelyking', 'Alliterasie', 'Assonansie'], answer: 0, explain: 'She IS an angel (no "soos") → metafoor.' },
            { id: 'po4', type: 'mcq', prompt: '"Die dapper dogter dans."', options: ['Alliterasie', 'Assonansie', 'Personifikasie', 'Metafoor'], answer: 0, explain: 'd-d-d-d → alliterasie.' },
            { id: 'po5', type: 'mcq', prompt: '"Die maan staan laag." (the aa-sound repeats)', options: ['Assonansie', 'Alliterasie', 'Vergelyking', 'Personifikasie'], answer: 0, explain: 'Repeated vowel sound → assonansie.' },
            {
              id: 'po6',
              type: 'match',
              prompt: 'Match the term to what it means',
              pairs: [
                ['Vergelyking', '"soos" of "as"'],
                ['Metafoor', 'iets IS iets anders'],
                ['Personifikasie', 'menslike eienskappe'],
                ['Alliterasie', 'dieselfde beginklank'],
              ],
              explain: 'These come up in almost every poetry question.',
            },
          ],
        },
      ],
    },
  ],
}
