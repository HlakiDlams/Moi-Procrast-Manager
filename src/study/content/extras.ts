import type { Unit } from '../types'
import { inp, lesson, mc, pair, seq, unit } from './build'

/** Extra units that bring every language and skills course up to six lessons. Keyed by course id. */
export const EXTRA_UNITS: Record<string, Unit[]> = {
  japanese: [
    unit('ja-more', 'Next steps', 'More hiragana and introducing yourself', [
      lesson(
        'ja-s',
        'S-row: さしすせそ',
        ['さ sa · し shi · す su · せ se · そ so', 'Notice し is "shi", not "si".', 'With the vowels and the K-row you can now read words like すし (sushi) and あさ (asa, morning).'],
        [
          mc('How do you read し?', ['shi', 'sa', 'su', 'so'], 'し = shi.', { say: 'し' }),
          pair('Match the hiragana to its sound', [['さ', 'sa'], ['す', 'su'], ['せ', 'se'], ['そ', 'so']], 'さ sa, す su, せ se, そ so.'),
          inp('Type the reading of すし in romaji', ['sushi'], 'す su + し shi.', { say: 'すし' }),
          mc('Which one is "se"?', ['せ', 'さ', 'そ', 'す'], 'せ = se.'),
        ],
        { say: 'さ し す せ そ' },
      ),
      lesson(
        'ja-intro',
        'Introducing yourself',
        ['はじめまして (hajimemashite): Nice to meet you (said first).', 'わたしは ___ です (watashi wa ___ desu): I am ___.', 'よろしくおねがいします (yoroshiku onegaishimasu): Pleased to meet you (said last).', 'The particle は is written "ha" but read "wa" when it marks the topic.'],
        [
          mc('What does はじめまして mean?', ['Nice to meet you', 'Goodbye', 'Thank you', 'Good night'], 'It opens a self-introduction.', { say: 'はじめまして' }),
          mc('How do you say "I am Thandi"?', ['わたしは Thandi です', 'Thandi は わたし', 'です Thandi わたし', 'わたし Thandi'], 'わたしは + name + です.'),
          mc('How is the topic particle は read?', ['wa', 'ha', 'ho', 'he'], 'It is written は but pronounced "wa" as a particle.'),
          seq('Put the self-introduction in order', ['はじめまして', 'わたしは Thandi です', 'よろしくおねがいします'], 'Greeting, name, closing.'),
        ],
        { say: 'はじめまして。わたしは タンディ です。よろしくおねがいします。' },
      ),
    ]),
  ],
  korean: [
    unit('ko-more', 'Next steps', 'Numbers, introductions and polite words', [
      lesson(
        'ko-num',
        'Numbers 1–10',
        ['Sino-Korean numbers are used for dates, money and phone numbers.', '일 il (1) · 이 i (2) · 삼 sam (3) · 사 sa (4) · 오 o (5)', '육 yuk (6) · 칠 chil (7) · 팔 pal (8) · 구 gu (9) · 십 sip (10)'],
        [
          mc('Which number is 삼?', ['3', '4', '5', '8'], '삼 sam = 3.', { say: '삼' }),
          pair('Match the number', [['일', '1'], ['이', '2'], ['오', '5'], ['십', '10']], '일 1, 이 2, 오 5, 십 10.'),
          mc('How do you say 7?', ['칠', '팔', '육', '구'], '칠 chil = 7.'),
          inp('Type the number for 구', ['9'], '구 gu = 9.', { say: '구', numeric: true }),
        ],
        { say: '일, 이, 삼, 사, 오, 육, 칠, 팔, 구, 십' },
      ),
      lesson(
        'ko-me',
        'About me',
        ['저는 ___ 입니다 (jeoneun ___ imnida): I am ___ (polite).', '이름 (ireum): name. 학생 (haksaeng): student.', '저는 학생입니다: I am a student.', '만나서 반갑습니다 (mannaseo bangapseumnida): Nice to meet you.'],
        [
          mc('What does 학생 mean?', ['student', 'teacher', 'name', 'friend'], '학생 haksaeng = student.', { say: '학생' }),
          mc('How do you say "I am a student"?', ['저는 학생입니다', '학생 저는', '이름 학생', '저는 이름'], '저는 + noun + 입니다.'),
          mc('What does 이름 mean?', ['name', 'student', 'I', 'hello'], '이름 ireum = name.'),
          mc('What does 만나서 반갑습니다 mean?', ['Nice to meet you', 'Goodbye', 'Thank you', 'Sorry'], 'Said when you first meet someone.', { say: '만나서 반갑습니다' }),
        ],
        { say: '저는 학생입니다. 만나서 반갑습니다.' },
      ),
      lesson(
        'ko-polite',
        'Polite words',
        ['감사합니다 (gamsahamnida): Thank you.', '네 (ne): yes. 아니요 (aniyo): no.', '죄송합니다 (joesonghamnida): I am sorry.', '___ 주세요 (juseyo): Please give me ___. 물 주세요 = Water, please.'],
        [
          mc('What does 감사합니다 mean?', ['Thank you', 'Sorry', 'Hello', 'Yes'], '감사합니다 = thank you.', { say: '감사합니다' }),
          pair('Match the word', [['네', 'yes'], ['아니요', 'no'], ['물', 'water']], '네 yes, 아니요 no, 물 water.'),
          mc('How do you ask for water politely?', ['물 주세요', '물 네', '물 아니요', '감사합니다 물'], 'Noun + 주세요.'),
          mc('What does 죄송합니다 mean?', ['I am sorry', 'Thank you', 'Goodbye', 'Please'], 'A polite apology.', { say: '죄송합니다' }),
        ],
        { say: '감사합니다. 죄송합니다. 물 주세요.' },
      ),
    ]),
  ],
  mandarin: [
    unit('zh-more', 'Next steps', 'About me, family and questions', [
      lesson(
        'zh-me',
        'About me',
        ['我 (wǒ): I, me. 你 (nǐ): you.', '我叫 ___ (wǒ jiào ___): My name is ___.', '我是学生 (wǒ shì xuésheng): I am a student.', '我是南非人 (wǒ shì Nánfēi rén): I am South African.'],
        [
          mc('What does 我 mean?', ['I / me', 'you', 'he', 'they'], '我 wǒ = I.', { say: '我' }),
          mc('How do you say "My name is Thandi"?', ['我叫 Thandi', '你叫 Thandi', '我是学生', 'Thandi 我'], '我叫 + name.'),
          mc('What does 学生 (xuésheng) mean?', ['student', 'teacher', 'friend', 'person'], '学生 = student.', { say: '学生' }),
          mc('What does 我是南非人 mean?', ['I am South African', 'I am a student', 'You are South African', 'I like South Africa'], '南非 Nánfēi = South Africa, 人 rén = person.'),
        ],
        { say: '我叫 Thandi。我是学生。我是南非人。' },
      ),
      lesson(
        'zh-family',
        'Family',
        ['爸爸 (bàba): dad. 妈妈 (māma): mom.', '哥哥 (gēge): older brother. 姐姐 (jiějie): older sister.', '弟弟 (dìdi): younger brother. 妹妹 (mèimei): younger sister.', 'Chinese uses different words for older and younger siblings.'],
        [
          pair('Match the family member', [['爸爸', 'dad'], ['妈妈', 'mom'], ['姐姐', 'older sister'], ['弟弟', 'younger brother']], 'bàba, māma, jiějie, dìdi.'),
          mc('What does 哥哥 mean?', ['older brother', 'younger brother', 'older sister', 'dad'], '哥哥 gēge = older brother.', { say: '哥哥' }),
          mc('Which word means "younger sister"?', ['妹妹', '姐姐', '妈妈', '弟弟'], '妹妹 mèimei.'),
          mc('How do you say "mom"?', ['妈妈', '爸爸', '哥哥', '妹妹'], '妈妈 māma.', { say: '妈妈' }),
        ],
        { say: '爸爸，妈妈，哥哥，姐姐，弟弟，妹妹' },
      ),
      lesson(
        'zh-questions',
        'Yes, no and questions',
        ['是 (shì): is, am, are. 不 (bù): not. 不是 (bú shì): is not.', 'Add 吗 (ma) to the end of a statement to make a yes/no question.', '你是学生吗？ Are you a student? 是 / 不是.', '什么 (shénme): what. 你叫什么？ What is your name?'],
        [
          mc('What does 吗 do at the end of a sentence?', ['Turns it into a yes/no question', 'Makes it negative', 'Makes it past tense', 'Makes it polite'], 'Statement + 吗 = question.'),
          mc('What does 不是 mean?', ['is not', 'is', 'what', 'yes'], '不 negates 是.', { say: '不是' }),
          mc('How do you ask "What is your name?"', ['你叫什么？', '你是学生吗？', '我叫什么？', '你好吗？'], '你叫什么？ nǐ jiào shénme?'),
          mc('What does 什么 mean?', ['what', 'who', 'where', 'not'], '什么 shénme = what.', { say: '什么' }),
        ],
        { say: '你是学生吗？是。你叫什么？' },
      ),
    ]),
  ],
  spanish: [
    unit('es-more', 'Next steps', 'Family, colours and days', [
      lesson(
        'es-family',
        'Family',
        ['la madre: mother · el padre: father', 'el hermano: brother · la hermana: sister', 'la abuela: grandmother · el abuelo: grandfather', 'Mi familia: my family. Tengo un hermano: I have a brother.'],
        [
          pair('Match the family member', [['madre', 'mother'], ['padre', 'father'], ['hermana', 'sister'], ['abuelo', 'grandfather']], 'madre, padre, hermana, abuelo.'),
          mc('What does "hermano" mean?', ['brother', 'sister', 'father', 'uncle'], 'hermano = brother, hermana = sister.', { say: 'hermano' }),
          mc('How do you say "I have a sister"?', ['Tengo una hermana', 'Soy una hermana', 'Tengo un hermano', 'Mi hermana tengo'], 'Tengo = I have. "una" for feminine nouns.'),
          inp('Type the Spanish for "mother"', ['madre', 'la madre', 'mamá', 'mama'], 'la madre.', { say: 'madre' }),
        ],
        { say: 'la madre, el padre, el hermano, la hermana, la abuela, el abuelo' },
      ),
      lesson(
        'es-colours',
        'Colours',
        ['rojo: red · azul: blue · verde: green', 'amarillo: yellow · negro: black · blanco: white', 'The colour comes after the noun: el coche rojo (the red car).', 'Colours ending in -o change to -a for feminine nouns: la casa blanca.'],
        [
          pair('Match the colour', [['rojo', 'red'], ['azul', 'blue'], ['verde', 'green'], ['negro', 'black']], 'rojo, azul, verde, negro.'),
          mc('What does "amarillo" mean?', ['yellow', 'white', 'orange', 'green'], 'amarillo = yellow.', { say: 'amarillo' }),
          mc('How do you say "the white house"?', ['la casa blanca', 'la blanca casa', 'la casa blanco', 'el casa blanca'], 'The colour follows the noun and agrees with it.'),
          inp('Type the Spanish for "blue"', ['azul'], 'azul.', { say: 'azul' }),
        ],
        { say: 'rojo, azul, verde, amarillo, negro, blanco' },
      ),
      lesson(
        'es-days',
        'Days of the week',
        ['lunes, martes, miércoles, jueves, viernes: Monday to Friday', 'sábado, domingo: Saturday, Sunday', 'Days are not written with a capital letter in Spanish.', 'hoy: today · mañana: tomorrow. Hoy es lunes: Today is Monday.'],
        [
          seq('Put the days in order, starting with Monday', ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'], 'lunes, martes, miércoles, jueves, viernes.'),
          mc('Which day is "domingo"?', ['Sunday', 'Saturday', 'Monday', 'Friday'], 'domingo = Sunday.', { say: 'domingo' }),
          mc('What does "mañana" mean?', ['tomorrow', 'today', 'yesterday', 'week'], 'mañana = tomorrow (and also "morning").'),
          mc('How do you say "Today is Friday"?', ['Hoy es viernes', 'Mañana es viernes', 'Hoy es jueves', 'Es hoy sábado'], 'Hoy es + day.'),
        ],
        { say: 'lunes, martes, miércoles, jueves, viernes, sábado, domingo' },
      ),
    ]),
  ],
  portuguese: [
    unit('pt-more', 'Next steps', 'Family, colours and days', [
      lesson(
        'pt-family',
        'Family',
        ['a mãe: mother · o pai: father', 'o irmão: brother · a irmã: sister', 'a avó: grandmother · o avô: grandfather', 'Minha família: my family. Tenho um irmão: I have a brother.'],
        [
          pair('Match the family member', [['mãe', 'mother'], ['pai', 'father'], ['irmã', 'sister'], ['avô', 'grandfather']], 'mãe, pai, irmã, avô.'),
          mc('What does "irmão" mean?', ['brother', 'sister', 'father', 'cousin'], 'irmão = brother, irmã = sister.', { say: 'irmão' }),
          mc('How do you say "I have a sister"?', ['Tenho uma irmã', 'Sou uma irmã', 'Tenho um irmão', 'Minha irmã tenho'], 'Tenho = I have. "uma" for feminine nouns.'),
          mc('Which word means "grandmother"?', ['avó', 'avô', 'mãe', 'irmã'], 'avó (open ó) is grandmother; avô is grandfather.', { say: 'avó' }),
        ],
        { say: 'a mãe, o pai, o irmão, a irmã, a avó, o avô' },
      ),
      lesson(
        'pt-colours',
        'Colours',
        ['vermelho: red · azul: blue · verde: green', 'amarelo: yellow · preto: black · branco: white', 'The colour comes after the noun: o carro vermelho (the red car).', 'Colours ending in -o change to -a for feminine nouns: a casa branca.'],
        [
          pair('Match the colour', [['vermelho', 'red'], ['azul', 'blue'], ['verde', 'green'], ['preto', 'black']], 'vermelho, azul, verde, preto.'),
          mc('What does "amarelo" mean?', ['yellow', 'white', 'orange', 'red'], 'amarelo = yellow.', { say: 'amarelo' }),
          mc('How do you say "the white house"?', ['a casa branca', 'a branca casa', 'a casa branco', 'o casa branca'], 'The colour follows the noun and agrees with it.'),
          inp('Type the Portuguese for "green"', ['verde'], 'verde.', { say: 'verde' }),
        ],
        { say: 'vermelho, azul, verde, amarelo, preto, branco' },
      ),
      lesson(
        'pt-days',
        'Days of the week',
        ['segunda-feira, terça-feira, quarta-feira, quinta-feira, sexta-feira: Monday to Friday', 'sábado, domingo: Saturday, Sunday', 'The weekdays are numbered: segunda means "second", because Sunday counts as the first day.', 'hoje: today · amanhã: tomorrow. Hoje é segunda-feira: Today is Monday.'],
        [
          seq('Put the days in order, starting with Monday', ['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira'], 'segunda, terça, quarta, quinta, sexta.'),
          mc('Which day is "domingo"?', ['Sunday', 'Saturday', 'Monday', 'Friday'], 'domingo = Sunday.', { say: 'domingo' }),
          mc('What does "amanhã" mean?', ['tomorrow', 'today', 'yesterday', 'morning only'], 'amanhã = tomorrow.', { say: 'amanhã' }),
          mc('Which day is "sexta-feira"?', ['Friday', 'Saturday', 'Thursday', 'Wednesday'], 'sexta = sixth day = Friday.'),
        ],
        { say: 'segunda-feira, terça-feira, quarta-feira, quinta-feira, sexta-feira, sábado, domingo' },
      ),
    ]),
  ],
  french: [
    unit('fr-more', 'Next steps', 'Family, colours and days', [
      lesson(
        'fr-family',
        'Family',
        ['la mère: mother · le père: father', 'le frère: brother · la sœur: sister', 'la grand-mère: grandmother · le grand-père: grandfather', "Ma famille: my family. J'ai un frère: I have a brother."],
        [
          pair('Match the family member', [['mère', 'mother'], ['père', 'father'], ['sœur', 'sister'], ['grand-père', 'grandfather']], 'mère, père, sœur, grand-père.'),
          mc('What does "frère" mean?', ['brother', 'sister', 'father', 'friend'], 'frère = brother.', { say: 'frère' }),
          mc('How do you say "I have a sister"?', ["J'ai une sœur", 'Je suis une sœur', "J'ai un frère", 'Ma sœur ai'], "J'ai = I have. \"une\" for feminine nouns."),
          mc('Which word means "mother"?', ['mère', 'père', 'frère', 'sœur'], 'la mère.', { say: 'mère' }),
        ],
        { say: 'la mère, le père, le frère, la sœur, la grand-mère, le grand-père' },
      ),
      lesson(
        'fr-colours',
        'Colours',
        ['rouge: red · bleu: blue · vert: green', 'jaune: yellow · noir: black · blanc: white', 'The colour comes after the noun: la voiture rouge (the red car).', 'Many colours add -e for feminine nouns: vert → verte, noir → noire, blanc → blanche.'],
        [
          pair('Match the colour', [['rouge', 'red'], ['bleu', 'blue'], ['vert', 'green'], ['noir', 'black']], 'rouge, bleu, vert, noir.'),
          mc('What does "jaune" mean?', ['yellow', 'white', 'orange', 'green'], 'jaune = yellow.', { say: 'jaune' }),
          mc('How do you say "the white house"? (maison is feminine)', ['la maison blanche', 'la blanche maison', 'la maison blanc', 'le maison blanche'], 'blanc becomes blanche for a feminine noun.'),
          inp('Type the French for "blue"', ['bleu'], 'bleu.', { say: 'bleu' }),
        ],
        { say: 'rouge, bleu, vert, jaune, noir, blanc' },
      ),
      lesson(
        'fr-days',
        'Days of the week',
        ['lundi, mardi, mercredi, jeudi, vendredi: Monday to Friday', 'samedi, dimanche: Saturday, Sunday', 'Days are not written with a capital letter in French.', "aujourd'hui: today · demain: tomorrow. Aujourd'hui, c'est lundi: Today is Monday."],
        [
          seq('Put the days in order, starting with Monday', ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'], 'lundi, mardi, mercredi, jeudi, vendredi.'),
          mc('Which day is "dimanche"?', ['Sunday', 'Saturday', 'Monday', 'Friday'], 'dimanche = Sunday.', { say: 'dimanche' }),
          mc('What does "demain" mean?', ['tomorrow', 'today', 'yesterday', 'week'], 'demain = tomorrow.', { say: 'demain' }),
          mc('Which day is "jeudi"?', ['Thursday', 'Tuesday', 'Friday', 'Wednesday'], 'jeudi = Thursday.'),
        ],
        { say: 'lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche' },
      ),
    ]),
  ],
  hebrew: [
    unit('he-more', 'Next steps', 'Polite words, family and numbers', [
      lesson(
        'he-polite',
        'Yes, no and polite words',
        ['כן (ken): yes. לא (lo): no.', 'תודה (toda): thank you.', 'בבקשה (bevakasha): please, and also "you are welcome".', 'סליחה (slicha): sorry, excuse me. Hebrew is read from right to left.'],
        [
          pair('Match the word', [['כן', 'yes'], ['לא', 'no'], ['תודה', 'thank you'], ['סליחה', 'sorry']], 'ken, lo, toda, slicha.'),
          mc('What does בבקשה mean?', ['please / you are welcome', 'goodbye', 'no', 'hello'], 'bevakasha.', { say: 'בבקשה' }),
          mc('How do you say "thank you"?', ['תודה', 'סליחה', 'כן', 'לא'], 'toda.', { say: 'תודה' }),
          mc('In which direction is Hebrew read?', ['Right to left', 'Left to right', 'Top to bottom', 'Either way'], 'Right to left.'),
        ],
        { say: 'כן, לא, תודה, בבקשה, סליחה' },
      ),
      lesson(
        'he-family',
        'Family',
        ['אמא (ima): mom. אבא (aba): dad.', 'אח (ach): brother. אחות (achot): sister.', 'משפחה (mishpacha): family.', 'סבא (saba): grandfather. סבתא (savta): grandmother.'],
        [
          pair('Match the family member', [['אמא', 'mom'], ['אבא', 'dad'], ['אח', 'brother'], ['אחות', 'sister']], 'ima, aba, ach, achot.'),
          mc('What does משפחה mean?', ['family', 'house', 'friend', 'school'], 'mishpacha = family.', { say: 'משפחה' }),
          mc('Which word means "grandmother"?', ['סבתא', 'סבא', 'אמא', 'אחות'], 'savta.', { say: 'סבתא' }),
          mc('How do you say "dad"?', ['אבא', 'אמא', 'אח', 'סבא'], 'aba.', { say: 'אבא' }),
        ],
        { say: 'אמא, אבא, אח, אחות, סבא, סבתא' },
      ),
      lesson(
        'he-num',
        'Numbers 1–5',
        ['When counting, Hebrew uses the feminine forms.', 'אחת (achat): 1 · שתיים (shtayim): 2 · שלוש (shalosh): 3', 'ארבע (arba): 4 · חמש (chamesh): 5', 'אפס (efes): zero.'],
        [
          pair('Match the number', [['אחת', '1'], ['שתיים', '2'], ['שלוש', '3'], ['חמש', '5']], 'achat, shtayim, shalosh, chamesh.'),
          mc('Which number is ארבע?', ['4', '3', '5', '2'], 'arba = 4.', { say: 'ארבע' }),
          mc('How do you say 3?', ['שלוש', 'שתיים', 'חמש', 'אחת'], 'shalosh.', { say: 'שלוש' }),
          mc('What does אפס mean?', ['zero', 'one', 'ten', 'five'], 'efes = zero.'),
        ],
        { say: 'אחת, שתיים, שלוש, ארבע, חמש' },
      ),
    ]),
  ],
  finance: [
    unit('fi-next', 'Growing and protecting money', 'Investing, tax and staying safe', [
      lesson(
        'fi-invest',
        'Compound growth and investing',
        ['Compound growth means your returns earn returns. Time matters more than the amount.', 'Rule of 72: years to double ≈ 72 ÷ the yearly return (%).', 'Higher possible returns come with higher risk. Spreading money across investments (diversifying) lowers risk.', 'An emergency fund of 3 to 6 months of expenses comes before investing.'],
        [
          mc('At 8% a year, about how long does money take to double?', ['9 years', '4 years', '18 years', '72 years'], '72 ÷ 8 = 9.'),
          mc('What does diversifying mean?', ['Spreading money across different investments', 'Putting everything in one share', 'Keeping all cash at home', 'Borrowing to invest'], 'It reduces the damage if one investment fails.'),
          mc('What should come before investing?', ['An emergency fund', 'A new phone', 'A car loan', 'A store card'], 'It stops you selling investments or borrowing in a crisis.'),
          mc('Why does starting early matter so much?', ['Compound growth has more time to work', 'Prices are always lower', 'Banks pay young people more', 'It does not matter'], 'Growth builds on growth.'),
        ],
      ),
      lesson(
        'fi-tax',
        'Tax basics',
        ['PAYE (pay-as-you-earn) is income tax your employer takes off your salary and pays to SARS.', 'UIF: you pay 1% of your salary and your employer adds 1%.', 'VAT is 15% and is already included in most shelf prices.', 'Gross pay is before deductions; net pay is what reaches your bank account.'],
        [
          mc('What is PAYE?', ['Income tax taken off your salary', 'A bank fee', 'A savings account', 'A type of loan'], 'Your employer pays it to SARS for you.'),
          inp('You earn R6 000 a month. How much is your own 1% UIF contribution? (number only)', ['60', 'R60'], '6000 × 0.01 = 60.', { numeric: true }),
          mc('Net pay is…', ['what is left after deductions', 'your salary before deductions', 'your yearly bonus', 'your employer’s profit'], 'Gross minus deductions.'),
          mc('What is the VAT rate in South Africa?', ['15%', '10%', '14%', '20%'], '15% since 2018.'),
        ],
      ),
      lesson(
        'fi-safe',
        'Credit scores and scams',
        ['A credit score shows how reliably you pay. Paying on time raises it; missed payments lower it.', 'A good score makes loans cheaper and can matter when renting a home.', 'Scam signs: pressure to act fast, promises of guaranteed high returns, requests for your PIN or OTP.', 'Never share your PIN, password or one-time PIN. Your bank will never ask for them.'],
        [
          mc('What improves a credit score?', ['Paying accounts on time', 'Missing payments', 'Opening many accounts at once', 'Never using any credit at all'], 'A record of on-time payments builds trust.'),
          mc('"Double your money in a week, guaranteed!" is most likely…', ['a scam', 'a good investment', 'a bank product', 'a government bond'], 'Guaranteed high returns do not exist.'),
          mc('Someone phones, says they are from your bank and asks for your OTP. You should…', ['refuse and end the call', 'give it quickly', 'give half of it', 'send it by SMS'], 'Banks never ask for an OTP or PIN.'),
          mc('Why does a good credit score matter?', ['You can borrow at lower interest', 'You pay more tax', 'Your salary goes up', 'Your bank charges go up'], 'Lenders see you as lower risk.'),
        ],
      ),
    ]),
  ],
  art: [
    unit('art-next', 'Building skill', 'Shading, composition and materials', [
      lesson(
        'art-shading',
        'Shading and value',
        ['Value is how light or dark something is. Shading with value makes a flat shape look solid.', 'Hatching uses parallel lines. Cross-hatching layers lines in different directions.', 'Stippling uses dots. Blending smooths tones together.', 'Decide where the light comes from: the side facing the light is lightest, and the cast shadow falls on the opposite side.'],
        [
          pair('Match the technique', [['Hatching', 'parallel lines'], ['Cross-hatching', 'crossing lines'], ['Stippling', 'dots'], ['Blending', 'smooth tones']], 'Four ways to build value.'),
          mc('What does "value" mean in art?', ['How light or dark a tone is', 'How expensive the work is', 'The size of the paper', 'The type of pencil'], 'Value creates the illusion of form.'),
          mc('The light comes from the left. Where does the cast shadow fall?', ['On the right', 'On the left', 'Above the object', 'There is none'], 'Shadows fall away from the light.'),
          mc('Which pencil gives the darkest tone?', ['6B', 'HB', '2H', '4H'], 'B pencils are soft and dark; H pencils are hard and light.'),
        ],
      ),
      lesson(
        'art-composition',
        'Composition',
        ['Composition is how the parts of an artwork are arranged.', 'Rule of thirds: divide the page into a 3 × 3 grid and place the main subject on a line or crossing point.', 'The focal point is where the eye goes first. Contrast, detail and leading lines guide the eye to it.', 'Negative space is the empty area around the subject. It gives the subject room to breathe.'],
        [
          mc('Using the rule of thirds, where should the main subject go?', ['On a grid line or crossing point', 'Exactly in the centre', 'In a corner', 'Off the page'], 'Off-centre placement feels more dynamic.'),
          mc('What is the focal point?', ['Where the eye is drawn first', 'The edge of the paper', 'The lightest corner', 'The artist’s signature'], 'The main area of interest.'),
          mc('What is negative space?', ['The empty area around the subject', 'A dark colour', 'A mistake', 'The back of the paper'], 'It shapes the subject as much as the subject itself.'),
          mc('Lines that guide the eye towards the subject are called…', ['leading lines', 'contour lines', 'border lines', 'guide rules'], 'Roads, fences and rivers often work this way.'),
        ],
      ),
      lesson(
        'art-media',
        'Materials and media',
        ['Graphite pencil: precise and easy to control and erase.', 'Charcoal: rich darks, smudges easily, good for large expressive drawings.', 'Watercolour: transparent, worked from light to dark, with the white of the paper as the lightest tone.', 'Acrylic: opaque and quick-drying, so you can paint light over dark.'],
        [
          pair('Match the medium to its character', [['Watercolour', 'transparent'], ['Acrylic', 'opaque and quick-drying'], ['Charcoal', 'smudgy, rich darks'], ['Graphite', 'precise and erasable']], 'Each medium behaves differently.'),
          mc('In watercolour, how do you get white?', ['Leave the paper unpainted', 'Paint white over dark', 'Use charcoal', 'Add more water at the end'], 'Plan your lightest areas first.'),
          mc('Which medium lets you paint a light colour over a dark one?', ['Acrylic', 'Watercolour', 'Ink wash', 'Graphite'], 'Acrylic is opaque.'),
          mc('What is fixative used for?', ['To stop charcoal or pastel smudging', 'To thin paint', 'To clean brushes', 'To stretch paper'], 'It seals the finished drawing.'),
        ],
      ),
    ]),
  ],
  chess: [
    unit('ch-next', 'Playing better', 'Notation, checkmates and endgames', [
      lesson(
        'ch-notation',
        'Reading chess notation',
        ['Files are the columns a to h; ranks are the rows 1 to 8. Each square has a name, such as e4.', 'Piece letters: K king, Q queen, R rook, B bishop, N knight. Pawns have no letter.', 'x means capture, + means check and # means checkmate.', 'O-O is castling on the king side; O-O-O is castling on the queen side.'],
        [
          mc('What does Nf3 mean?', ['A knight moves to f3', 'A pawn moves to f3', 'The king moves to f3', 'A bishop captures on f3'], 'N is the knight (K is the king).'),
          mc('What does the # symbol mean?', ['Checkmate', 'Check', 'Capture', 'Castling'], '+ is check, # is checkmate.'),
          mc('What does O-O mean?', ['Castling king side', 'Castling queen side', 'A draw', 'Resignation'], 'O-O-O is queen side.'),
          mc('What does Bxe5 mean?', ['A bishop captures on e5', 'A bishop moves to e5 without capturing', 'A pawn captures a bishop', 'Black takes on e5'], 'x shows a capture.'),
        ],
      ),
      lesson(
        'ch-mates',
        'Basic checkmates',
        ['Back-rank mate: a rook or queen checks a king trapped behind its own pawns.', 'Ladder mate: two rooks (or a queen and a rook) take turns pushing the king to the edge.', 'King and queen against king: use the queen to shrink the box, bring your king closer, then mate on the edge.', 'Always check that your move does not cause stalemate.'],
        [
          mc('What traps the king in a back-rank mate?', ['Its own pawns', 'The enemy pawns', 'A knight', 'The centre'], 'Making a "window" for the king with a pawn move prevents it.'),
          mc('Which pieces give a ladder mate?', ['Two rooks', 'Two knights', 'Two pawns', 'A bishop alone'], 'They take turns cutting off rows.'),
          mc('With king and queen against a lone king, where does checkmate happen?', ['On the edge of the board', 'In the centre', 'Anywhere', 'It is impossible'], 'The king must be driven to the edge.'),
          mc('You are winning easily but leave the enemy king with no legal move and not in check. The result is…', ['a draw by stalemate', 'a win', 'a loss', 'checkmate'], 'Always leave the king a move until you mate.'),
        ],
      ),
      lesson(
        'ch-endgame',
        'Endgame principles',
        ['In the endgame the king becomes a strong piece: bring it to the centre.', 'A passed pawn has no enemy pawns in front of it or on the neighbouring files. Push it.', 'Rooks belong behind passed pawns, yours or your opponent’s.', 'When you are ahead in material, trade pieces, not pawns.'],
        [
          mc('What should the king do in the endgame?', ['Move towards the centre and help', 'Hide in the corner', 'Stay on its starting square', 'Never move'], 'With few pieces left, the king is safe and strong.'),
          mc('What is a passed pawn?', ['A pawn with no enemy pawns able to stop it', 'A pawn that has been captured', 'A pawn on its starting square', 'A doubled pawn'], 'It can run for promotion.'),
          mc('Where do rooks belong?', ['Behind passed pawns', 'In front of their own pawns', 'In the corner', 'Next to the king always'], 'From behind, the rook supports or stops the pawn all the way.'),
          mc('You are a piece ahead. What should you trade?', ['Pieces', 'Pawns', 'Nothing', 'Your extra piece only'], 'Trading pieces makes your extra piece count for more.'),
        ],
      ),
    ]),
  ],
  music: [
    unit('mu-next', 'Theory', 'Scales, chords and tempo', [
      lesson(
        'mu-scales',
        'Major scales and key signatures',
        ['A major scale follows the pattern: tone, tone, semitone, tone, tone, tone, semitone.', 'C major uses only the white keys: C D E F G A B C.', 'G major has one sharp (F♯). F major has one flat (B♭).', 'The key signature at the start of the staff shows which notes are sharp or flat throughout.'],
        [
          mc('How many sharps or flats does C major have?', ['None', 'One sharp', 'One flat', 'Two sharps'], 'C major uses only white keys.'),
          mc('Which sharp is in G major?', ['F♯', 'C♯', 'G♯', 'B♭'], 'G A B C D E F♯ G.'),
          mc('Which flat is in F major?', ['B♭', 'E♭', 'A♭', 'F♯'], 'F G A B♭ C D E F.'),
          mc('Where are the semitones in a major scale?', ['Between notes 3–4 and 7–8', 'Between notes 1–2 and 5–6', 'Between every note', 'There are none'], 'Tone, tone, semitone, tone, tone, tone, semitone.'),
        ],
      ),
      lesson(
        'mu-chords',
        'Intervals and chords',
        ['An interval is the distance between two notes. C to E is a third; C to G is a fifth.', 'A triad is a three-note chord built from the 1st, 3rd and 5th notes of a scale.', 'C major triad: C E G. A minor triad lowers the third by a semitone: C E♭ G.', 'Major chords tend to sound bright; minor chords sound darker.'],
        [
          mc('Which notes make a C major chord?', ['C E G', 'C D E', 'C F A', 'C E♭ G'], 'The 1st, 3rd and 5th notes of C major.'),
          mc('What turns a major triad into a minor triad?', ['Lowering the third by a semitone', 'Raising the fifth', 'Removing the root', 'Adding a fourth note'], 'C E G becomes C E♭ G.'),
          mc('The interval from C up to G is a…', ['fifth', 'third', 'second', 'octave'], 'C D E F G: five note names.'),
          mc('How many different notes are in a triad?', ['3', '2', '4', '5'], 'Tri means three.'),
        ],
      ),
      lesson(
        'mu-tempo',
        'Time signatures, tempo and dynamics',
        ['The top number of a time signature tells you the beats in each bar. 4/4 has four crotchet beats; 3/4 has three.', 'Tempo is the speed: adagio is slow, andante is walking pace, allegro is fast.', 'Dynamics are the volume: piano (p) is soft, forte (f) is loud.', 'Crescendo means getting louder; diminuendo means getting softer.'],
        [
          mc('How many beats are in a bar of 3/4?', ['3', '4', '2', '6'], 'The top number counts the beats.'),
          pair('Match the term to its meaning', [['Allegro', 'fast'], ['Adagio', 'slow'], ['Forte', 'loud'], ['Piano', 'soft']], 'Tempo and dynamics use Italian terms.'),
          mc('What does crescendo mean?', ['Gradually getting louder', 'Gradually getting softer', 'Getting faster', 'Stopping'], 'The opposite is diminuendo.'),
          mc('Which time signature is typical of a waltz?', ['3/4', '4/4', '2/4', '6/8'], 'One-two-three, one-two-three.'),
        ],
      ),
    ]),
  ],
}
