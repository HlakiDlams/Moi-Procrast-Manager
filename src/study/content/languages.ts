import type { Course } from '../types'

/** Starter courses for extra languages. Each starts with sounds/script, greetings, numbers, then "about me". */

export const JAPANESE: Course = {
  id: 'japanese',
  name: 'Japanese',
  icon: '',
  color: '#FF5C8A',
  group: 'extra',
  section: 'Languages',
  lang: 'ja-JP',
  blurb: 'Your targets: JLPT N3 by 2028, N2 by 2030. Hiragana first: it unlocks everything else.',
  units: [
    {
      id: 'ja-kana',
      title: 'Hiragana',
      icon: 'あ',
      description: 'The first Japanese alphabet',
      lessons: [
        {
          id: 'ja-vowels',
          title: 'Vowels: あいうえお',
          teach: { text: ['Japanese has 5 vowels, always pronounced the same way.', 'あ a (as in "car") · い i ("see") · う u ("food") · え e ("pet") · お o ("pot")'], say: 'あ い う え お' },
          questions: [
            { id: 'jv1', type: 'mcq', prompt: 'How do you read あ?', say: 'あ', options: ['a', 'o', 'i', 'e'], answer: 0, explain: 'あ = a.' },
            { id: 'jv2', type: 'match', prompt: 'Match the hiragana to its sound', pairs: [['あ', 'a'], ['い', 'i'], ['う', 'u'], ['え', 'e']], explain: 'あ a, い i, う u, え e.' },
            { id: 'jv3', type: 'mcq', prompt: 'Which one is "o"?', options: ['お', 'あ', 'え', 'う'], answer: 0, explain: 'お = o. It looks a bit like あ, so watch the shape.' },
            { id: 'jv4', type: 'input', prompt: 'Type the sound of え (in romaji)', say: 'え', answers: ['e'], explain: 'え = e.' },
            { id: 'jv5', type: 'mcq', prompt: 'How do you read う?', say: 'う', options: ['u', 'i', 'o', 'a'], answer: 0, explain: 'う = u.' },
          ],
        },
        {
          id: 'ja-k',
          title: 'K-row: かきくけこ',
          teach: { text: ['Add k to each vowel: か ka · き ki · く ku · け ke · こ ko', 'Now you can read real words!'], example: ['かお kao = face', 'あき aki = autumn', 'いけ ike = pond'], say: 'か き く け こ。 かお、 あき、 いけ' },
          questions: [
            { id: 'jk1', type: 'match', prompt: 'Match the hiragana', pairs: [['か', 'ka'], ['き', 'ki'], ['く', 'ku'], ['け', 'ke']], explain: 'か ka, き ki, く ku, け ke.' },
            { id: 'jk2', type: 'mcq', prompt: 'How do you read こ?', say: 'こ', options: ['ko', 'ku', 'ka', 'ke'], answer: 0, explain: 'こ = ko.' },
            { id: 'jk3', type: 'mcq', prompt: 'Read: かお (face)', say: 'かお', options: ['kao', 'kio', 'kou', 'keo'], answer: 0, explain: 'か ka + お o = kao.' },
            { id: 'jk4', type: 'input', prompt: 'Read: あき (autumn)', say: 'あき', answers: ['aki'], explain: 'あ a + き ki = aki.' },
            { id: 'jk5', type: 'mcq', prompt: 'Read: いけ (pond)', say: 'いけ', options: ['ike', 'ika', 'uke', 'iko'], answer: 0, explain: 'い i + け ke = ike.' },
          ],
        },
      ],
    },
    {
      id: 'ja-basic',
      title: 'Basics',
      icon: '',
      description: 'Greetings and numbers',
      lessons: [
        {
          id: 'ja-greet',
          title: 'Greetings',
          teach: { text: ['おはよう (ohayou) = good morning', 'こんにちは (konnichiwa) = hello / good afternoon', 'こんばんは (konbanwa) = good evening', 'ありがとう (arigatou) = thank you', 'すみません (sumimasen) = excuse me / sorry', 'さようなら (sayounara) = goodbye'], say: 'おはよう。こんにちは。こんばんは。ありがとう。すみません。さようなら。' },
          questions: [
            { id: 'jg1', type: 'mcq', prompt: 'ありがとう means…', say: 'ありがとう', options: ['thank you', 'hello', 'sorry', 'goodbye'], answer: 0, explain: 'arigatou = thank you.' },
            { id: 'jg2', type: 'mcq', prompt: 'What do you say at 8 in the morning?', options: ['おはよう', 'こんばんは', 'さようなら', 'すみません'], answer: 0, explain: 'ohayou = good morning.' },
            { id: 'jg3', type: 'match', prompt: 'Match the greeting', pairs: [['こんにちは', 'hello'], ['こんばんは', 'good evening'], ['すみません', 'excuse me'], ['さようなら', 'goodbye']], explain: 'konnichiwa, konbanwa, sumimasen, sayounara.' },
            { id: 'jg4', type: 'mcq', prompt: 'You bump into someone. You say…', options: ['すみません', 'おはよう', 'ありがとう', 'こんばんは'], answer: 0, explain: 'sumimasen = excuse me / sorry.' },
          ],
        },
        {
          id: 'ja-num',
          title: 'Numbers 1–10',
          teach: { text: ['一 いち ichi · 二 に ni · 三 さん san · 四 よん yon · 五 ご go', '六 ろく roku · 七 なな nana · 八 はち hachi · 九 きゅう kyuu · 十 じゅう juu', '(4 and 7 also have the readings shi and shichi.)'], say: 'いち、に、さん、よん、ご、ろく、なな、はち、きゅう、じゅう' },
          questions: [
            { id: 'jn1', type: 'match', prompt: 'Match the kanji to the number', pairs: [['一', '1'], ['二', '2'], ['三', '3'], ['十', '10']], explain: '一 1, 二 2, 三 3, 十 10. Count the lines!' },
            { id: 'jn2', type: 'mcq', prompt: 'さん is…', say: 'さん', options: ['3', '4', '5', '8'], answer: 0, explain: 'san = 3.' },
            { id: 'jn3', type: 'mcq', prompt: 'Which kanji is 4?', options: ['四', '五', '六', '八'], answer: 0, explain: '四 = 4 (yon).' },
            { id: 'jn4', type: 'input', prompt: 'How do you say 2 in Japanese? (romaji)', answers: ['ni'], explain: '二 = ni.' },
            { id: 'jn5', type: 'mcq', prompt: 'はち is…', say: 'はち', options: ['8', '7', '9', '6'], answer: 0, explain: 'hachi = 8.' },
          ],
        },
      ],
    },
  ],
}

export const KOREAN: Course = {
  id: 'korean',
  name: 'Korean',
  icon: '',
  color: '#7DB9FF',
  group: 'extra',
  section: 'Languages',
  lang: 'ko-KR',
  blurb: 'Hangul was designed to be easy: you can learn to read it in a few days.',
  units: [
    {
      id: 'ko-hangul',
      title: 'Hangul',
      icon: '한',
      description: 'Vowels, consonants, syllable blocks',
      lessons: [
        {
          id: 'ko-vowels',
          title: 'Basic vowels',
          teach: { text: ['ㅏ a · ㅓ eo (like "aw") · ㅗ o · ㅜ u · ㅡ eu · ㅣ i'], say: '아 어 오 우 으 이' },
          questions: [
            { id: 'kv1', type: 'match', prompt: 'Match the vowel', pairs: [['ㅏ', 'a'], ['ㅓ', 'eo'], ['ㅗ', 'o'], ['ㅜ', 'u']], explain: 'ㅏ a, ㅓ eo, ㅗ o, ㅜ u.' },
            { id: 'kv2', type: 'mcq', prompt: 'ㅣ is…', options: ['i', 'eu', 'a', 'o'], answer: 0, explain: 'ㅣ = i.' },
            { id: 'kv3', type: 'mcq', prompt: 'ㅡ is…', options: ['eu', 'u', 'i', 'eo'], answer: 0, explain: 'ㅡ = eu (lips flat).' },
            { id: 'kv4', type: 'mcq', prompt: 'Which vowel is "o"?', options: ['ㅗ', 'ㅜ', 'ㅓ', 'ㅏ'], answer: 0, explain: 'ㅗ points up = o. ㅜ points down = u.' },
          ],
        },
        {
          id: 'ko-blocks',
          title: 'Consonants and blocks',
          teach: { text: ['ㄱ g · ㄴ n · ㄷ d · ㄹ r/l · ㅁ m · ㅂ b · ㅅ s · ㅈ j · ㅎ h', 'ㅇ is silent at the start of a block, "ng" at the end.', 'Consonant + vowel = one block: ㄴ + ㅏ = 나 (na)'], example: ['가 ga · 나 na · 마 ma · 아 a · 고 go'], say: '가 나 마 아 고' },
          questions: [
            { id: 'kb1', type: 'mcq', prompt: 'Read: 나', say: '나', options: ['na', 'ma', 'ga', 'da'], answer: 0, explain: 'ㄴ n + ㅏ a = na.' },
            { id: 'kb2', type: 'mcq', prompt: 'Read: 마', say: '마', options: ['ma', 'na', 'ba', 'ha'], answer: 0, explain: 'ㅁ m + ㅏ a = ma.' },
            { id: 'kb3', type: 'match', prompt: 'Match the consonant', pairs: [['ㄴ', 'n'], ['ㅁ', 'm'], ['ㅅ', 's'], ['ㅎ', 'h']], explain: 'ㄴ n, ㅁ m, ㅅ s, ㅎ h.' },
            { id: 'kb4', type: 'mcq', prompt: 'ㅇ at the START of a block is…', options: ['silent', 'ng', 'm', 'h'], answer: 0, explain: 'So 아 is just "a".' },
            { id: 'kb5', type: 'mcq', prompt: 'Read: 고', say: '고', options: ['go', 'gu', 'ga', 'no'], answer: 0, explain: 'ㄱ g + ㅗ o = go.' },
          ],
        },
      ],
    },
    {
      id: 'ko-basic',
      title: 'Basics',
      icon: '',
      description: 'Greetings',
      lessons: [
        {
          id: 'ko-greet',
          title: 'Greetings',
          teach: { text: ['안녕하세요 annyeonghaseyo = hello', '감사합니다 gamsahamnida = thank you', '네 ne = yes · 아니요 aniyo = no', '죄송합니다 joesonghamnida = I\'m sorry'], say: '안녕하세요. 감사합니다. 네. 아니요. 죄송합니다.' },
          questions: [
            { id: 'kg1', type: 'mcq', prompt: '안녕하세요 means…', say: '안녕하세요', options: ['hello', 'thank you', 'sorry', 'yes'], answer: 0, explain: 'annyeonghaseyo = hello.' },
            { id: 'kg2', type: 'mcq', prompt: 'How do you say thank you?', options: ['감사합니다', '안녕하세요', '죄송합니다', '아니요'], answer: 0, explain: 'gamsahamnida.' },
            { id: 'kg3', type: 'match', prompt: 'Match', pairs: [['네', 'yes'], ['아니요', 'no'], ['죄송합니다', 'sorry'], ['감사합니다', 'thank you']], explain: 'ne, aniyo, joesonghamnida, gamsahamnida.' },
            { id: 'kg4', type: 'mcq', prompt: '네 means…', say: '네', options: ['yes', 'no', 'hello', 'four'], answer: 0, explain: 'ne = yes (even though it sounds like "nay"!).' },
          ],
        },
      ],
    },
  ],
}

export const MANDARIN: Course = {
  id: 'mandarin',
  name: 'Mandarin',
  icon: '',
  color: '#FF6B6B',
  group: 'extra',
  section: 'Languages',
  lang: 'zh-CN',
  blurb: 'Tones change the meaning of a word, so learn them first.',
  units: [
    {
      id: 'zh-start',
      title: 'Getting started',
      icon: '你',
      description: 'Tones, greetings, numbers',
      lessons: [
        {
          id: 'zh-tones',
          title: 'The 4 tones',
          teach: { text: ['1st tone ā: high and flat · 2nd á: rising (like a question) · 3rd ǎ: dips down then up · 4th à: sharp falling', 'Same syllable, different meaning:', 'mā 妈 mother · má 麻 hemp · mǎ 马 horse · mà 骂 to scold'], say: '妈。麻。马。骂。' },
          questions: [
            { id: 'zt1', type: 'mcq', prompt: 'mǎ (3rd tone) 马 means…', say: '马', options: ['horse', 'mother', 'to scold', 'hemp'], answer: 0, explain: 'mǎ = horse.' },
            { id: 'zt2', type: 'mcq', prompt: 'Which tone sounds sharp and falling?', options: ['4th (à)', '1st (ā)', '2nd (á)', '3rd (ǎ)'], answer: 0, explain: '4th tone falls, like a firm "No!"' },
            { id: 'zt3', type: 'match', prompt: 'Match the word to its meaning', pairs: [['mā 妈', 'mother'], ['má 麻', 'hemp'], ['mǎ 马', 'horse'], ['mà 骂', 'to scold']], explain: 'One syllable, four meanings!' },
            { id: 'zt4', type: 'mcq', prompt: 'Which tone rises like a question?', options: ['2nd (á)', '4th (à)', '1st (ā)', '3rd (ǎ)'], answer: 0, explain: '2nd tone rises.' },
          ],
        },
        {
          id: 'zh-greet',
          title: 'Greetings',
          teach: { text: ['你好 nǐ hǎo = hello', '谢谢 xièxie = thank you', '再见 zàijiàn = goodbye', '对不起 duìbuqǐ = sorry', '没关系 méi guānxi = it\'s okay'], say: '你好。谢谢。再见。对不起。没关系。' },
          questions: [
            { id: 'zg1', type: 'mcq', prompt: '你好 means…', say: '你好', options: ['hello', 'goodbye', 'thank you', 'sorry'], answer: 0, explain: 'nǐ hǎo = hello.' },
            { id: 'zg2', type: 'mcq', prompt: 'How do you say thank you?', options: ['谢谢', '再见', '你好', '对不起'], answer: 0, explain: 'xièxie.' },
            { id: 'zg3', type: 'match', prompt: 'Match', pairs: [['再见', 'goodbye'], ['对不起', 'sorry'], ['没关系', 'it\'s okay'], ['谢谢', 'thank you']], explain: 'zàijiàn, duìbuqǐ, méi guānxi, xièxie.' },
            { id: 'zg4', type: 'mcq', prompt: 'Someone says 对不起. You reply…', options: ['没关系', '你好', '再见', '谢谢'], answer: 0, explain: 'méi guānxi = no problem, it\'s okay.' },
          ],
        },
        {
          id: 'zh-num',
          title: 'Numbers 1–10',
          teach: { text: ['一 yī · 二 èr · 三 sān · 四 sì · 五 wǔ', '六 liù · 七 qī · 八 bā · 九 jiǔ · 十 shí'], say: '一、二、三、四、五、六、七、八、九、十' },
          questions: [
            { id: 'zn1', type: 'match', prompt: 'Match the number', pairs: [['一', '1'], ['三', '3'], ['八', '8'], ['十', '10']], explain: '一 1, 三 3, 八 8, 十 10.' },
            { id: 'zn2', type: 'mcq', prompt: '五 wǔ is…', say: '五', options: ['5', '4', '6', '9'], answer: 0, explain: 'wǔ = 5.' },
            { id: 'zn3', type: 'input', prompt: 'Pinyin for 三 (without the tone mark)', answers: ['san', 'sān'], explain: '三 = sān.' },
            { id: 'zn4', type: 'mcq', prompt: '九 is…', say: '九', options: ['9', '7', '6', '10'], answer: 0, explain: 'jiǔ = 9.' },
          ],
        },
      ],
    },
  ],
}

export const SPANISH: Course = {
  id: 'spanish',
  name: 'Spanish',
  icon: '',
  color: '#FFB347',
  group: 'extra',
  section: 'Languages',
  lang: 'es-ES',
  units: [
    {
      id: 'es-start',
      title: 'Getting started',
      icon: '',
      description: 'Greetings, numbers, about me',
      lessons: [
        {
          id: 'es-greet',
          title: 'Greetings',
          teach: { text: ['Hola = hello · Buenos días = good morning · Buenas noches = good night', 'Gracias = thank you · Por favor = please · Adiós = goodbye', '¿Cómo estás? = How are you? → Bien, gracias.'], say: 'Hola. Buenos días. Gracias. Por favor. ¿Cómo estás? Bien, gracias. Adiós.' },
          questions: [
            { id: 'eg1', type: 'mcq', prompt: '"Gracias" means…', say: 'Gracias', options: ['thank you', 'please', 'hello', 'goodbye'], answer: 0, explain: 'Gracias = thank you.' },
            { id: 'eg2', type: 'match', prompt: 'Match', pairs: [['Hola', 'hello'], ['Adiós', 'goodbye'], ['Por favor', 'please'], ['Buenas noches', 'good night']], explain: 'Core greetings.' },
            { id: 'eg3', type: 'mcq', prompt: '¿Cómo estás? → you answer…', say: '¿Cómo estás?', options: ['Bien, gracias.', 'Adiós.', 'Por favor.', 'Hola.'], answer: 0, explain: 'Bien, gracias = fine, thanks.' },
            { id: 'eg4', type: 'input', prompt: 'Translate: hello', answers: ['hola'], explain: 'Hola (the h is silent).' },
          ],
        },
        {
          id: 'es-num',
          title: 'Numbers 1–10',
          teach: { text: ['uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez'], say: 'uno, dos, tres, cuatro, cinco, seis, siete, ocho, nueve, diez' },
          questions: [
            { id: 'en1', type: 'match', prompt: 'Match', pairs: [['tres', '3'], ['cinco', '5'], ['ocho', '8'], ['diez', '10']], explain: 'tres 3, cinco 5, ocho 8, diez 10.' },
            { id: 'en2', type: 'input', prompt: 'Write 2 in Spanish', answers: ['dos'], explain: '2 = dos.' },
            { id: 'en3', type: 'mcq', prompt: '"siete" is…', say: 'siete', options: ['7', '6', '9', '4'], answer: 0, explain: 'siete = 7.' },
            { id: 'en4', type: 'mcq', prompt: '"cuatro" is…', say: 'cuatro', options: ['4', '5', '8', '3'], answer: 0, explain: 'cuatro = 4.' },
          ],
        },
        {
          id: 'es-me',
          title: 'About me',
          teach: { text: ['Me llamo Hlaki = My name is Hlaki', 'Tengo diecinueve años = I am 19 (literally "I have 19 years")', 'Soy de Sudáfrica = I am from South Africa', 'Hablo inglés y zulú = I speak English and Zulu'], say: 'Me llamo Hlaki. Tengo diecinueve años. Soy de Sudáfrica. Hablo inglés y zulú.' },
          questions: [
            { id: 'em1', type: 'mcq', prompt: '"Me llamo Hlaki" means…', options: ['My name is Hlaki', 'I am from Hlaki', 'I love Hlaki', 'Call Hlaki'], answer: 0, explain: 'Me llamo = my name is.' },
            { id: 'em2', type: 'mcq', prompt: 'How do you say "I am 19"?', options: ['Tengo diecinueve años', 'Soy diecinueve', 'Estoy diecinueve años', 'Me llamo diecinueve'], answer: 0, explain: 'Spanish uses "tener" (to have) for age.' },
            { id: 'em3', type: 'order', prompt: 'Build: I am from South Africa', steps: ['Soy', 'de', 'Sudáfrica'], explain: 'Soy de Sudáfrica.' },
            { id: 'em4', type: 'mcq', prompt: '"Hablo inglés" means…', options: ['I speak English', 'I am English', 'I like English', 'I learn English'], answer: 0, explain: 'Hablo = I speak.' },
          ],
        },
      ],
    },
  ],
}

export const PORTUGUESE: Course = {
  id: 'portuguese',
  name: 'Portuguese',
  icon: '',
  color: '#6BCB77',
  group: 'extra',
  section: 'Languages',
  lang: 'pt-BR',
  blurb: 'Spoken in Mozambique, Angola, Brazil and Portugal: very useful in Southern Africa.',
  units: [
    {
      id: 'pt-start',
      title: 'Getting started',
      icon: '',
      description: 'Greetings, numbers, about me',
      lessons: [
        {
          id: 'pt-greet',
          title: 'Greetings',
          teach: { text: ['Olá = hello · Bom dia = good morning · Boa noite = good evening/night', 'Obrigado (said by a man) / Obrigada (said by a woman) = thank you', 'Por favor = please · Tchau = bye'], say: 'Olá. Bom dia. Boa noite. Obrigada. Por favor. Tchau.' },
          questions: [
            { id: 'pg1', type: 'mcq', prompt: 'You are a woman. How do you say thank you?', options: ['Obrigada', 'Obrigado', 'Gracias', 'Merci'], answer: 0, explain: 'Women say obrigada, men say obrigado.' },
            { id: 'pg2', type: 'match', prompt: 'Match', pairs: [['Olá', 'hello'], ['Bom dia', 'good morning'], ['Por favor', 'please'], ['Tchau', 'bye']], explain: 'Core greetings.' },
            { id: 'pg3', type: 'mcq', prompt: '"Boa noite" means…', say: 'Boa noite', options: ['good evening / good night', 'good morning', 'goodbye', 'thank you'], answer: 0, explain: 'noite = night.' },
            { id: 'pg4', type: 'input', prompt: 'Translate: please', answers: ['por favor'], explain: 'Por favor.' },
          ],
        },
        {
          id: 'pt-num',
          title: 'Numbers 1–10',
          teach: { text: ['um, dois, três, quatro, cinco, seis, sete, oito, nove, dez'], say: 'um, dois, três, quatro, cinco, seis, sete, oito, nove, dez' },
          questions: [
            { id: 'pn1', type: 'match', prompt: 'Match', pairs: [['dois', '2'], ['cinco', '5'], ['oito', '8'], ['dez', '10']], explain: 'dois 2, cinco 5, oito 8, dez 10.' },
            { id: 'pn2', type: 'mcq', prompt: '"três" is…', say: 'três', options: ['3', '6', '2', '7'], answer: 0, explain: 'três = 3.' },
            { id: 'pn3', type: 'mcq', prompt: '"sete" is…', say: 'sete', options: ['7', '6', '9', '4'], answer: 0, explain: 'sete = 7.' },
            { id: 'pn4', type: 'input', prompt: 'Write 1 in Portuguese', answers: ['um'], explain: '1 = um.' },
          ],
        },
        {
          id: 'pt-me',
          title: 'About me',
          teach: { text: ['Meu nome é Hlaki = My name is Hlaki', 'Tenho dezenove anos = I am 19', 'Sou da África do Sul = I am from South Africa', 'Falo inglês e zulu = I speak English and Zulu'], say: 'Meu nome é Hlaki. Tenho dezenove anos. Sou da África do Sul. Falo inglês e zulu.' },
          questions: [
            { id: 'pm1', type: 'mcq', prompt: '"Meu nome é Hlaki" means…', options: ['My name is Hlaki', 'I am Hlaki\'s friend', 'Hlaki is here', 'Call me later'], answer: 0, explain: 'nome = name.' },
            { id: 'pm2', type: 'mcq', prompt: 'How do you say "I am 19"?', options: ['Tenho dezenove anos', 'Sou dezenove', 'Estou dezenove', 'Falo dezenove'], answer: 0, explain: 'Like Spanish, Portuguese uses "to have" for age.' },
            { id: 'pm3', type: 'order', prompt: 'Build: I speak English and Zulu', steps: ['Falo', 'inglês', 'e', 'zulu'], explain: 'Falo inglês e zulu.' },
            { id: 'pm4', type: 'mcq', prompt: '"Sou da África do Sul" means…', options: ['I am from South Africa', 'I live in the south', 'I love Africa', 'I am going south'], answer: 0, explain: 'Sou = I am, da = from the.' },
          ],
        },
      ],
    },
  ],
}

export const FRENCH: Course = {
  id: 'french',
  name: 'French',
  icon: '',
  color: '#8C9EFF',
  group: 'extra',
  section: 'Languages',
  lang: 'fr-FR',
  units: [
    {
      id: 'fr-start',
      title: 'Getting started',
      icon: '',
      description: 'Greetings, numbers, about me',
      lessons: [
        {
          id: 'fr-greet',
          title: 'Greetings',
          teach: { text: ['Bonjour = hello / good day · Bonsoir = good evening · Salut = hi (friends)', 'Merci = thank you · S\'il vous plaît = please · Au revoir = goodbye', 'Comment ça va ? = How are you? → Ça va bien, merci.'], say: 'Bonjour. Bonsoir. Merci. S\'il vous plaît. Comment ça va ? Ça va bien, merci. Au revoir.' },
          questions: [
            { id: 'fg-1', type: 'mcq', prompt: '"Merci" means…', say: 'Merci', options: ['thank you', 'please', 'goodbye', 'hello'], answer: 0, explain: 'Merci = thank you.' },
            { id: 'fg-2', type: 'match', prompt: 'Match', pairs: [['Bonjour', 'hello'], ['Au revoir', 'goodbye'], ['Bonsoir', 'good evening'], ['Salut', 'hi']], explain: 'Core greetings.' },
            { id: 'fg-3', type: 'mcq', prompt: 'Comment ça va ? → you answer…', say: 'Comment ça va ?', options: ['Ça va bien, merci.', 'Au revoir.', 'S\'il vous plaît.', 'Bonsoir.'], answer: 0, explain: 'Ça va bien = I\'m fine.' },
            { id: 'fg-4', type: 'mcq', prompt: 'Which one is more formal for "please"?', options: ['S\'il vous plaît', 'S\'il te plaît', 'Salut', 'Merci'], answer: 0, explain: '"vous" is polite/formal; "te" is for friends.' },
          ],
        },
        {
          id: 'fr-num',
          title: 'Numbers 1–10',
          teach: { text: ['un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix'], say: 'un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix' },
          questions: [
            { id: 'fn1', type: 'match', prompt: 'Match', pairs: [['deux', '2'], ['cinq', '5'], ['huit', '8'], ['dix', '10']], explain: 'deux 2, cinq 5, huit 8, dix 10.' },
            { id: 'fn2', type: 'mcq', prompt: '"trois" is…', say: 'trois', options: ['3', '4', '6', '7'], answer: 0, explain: 'trois = 3.' },
            { id: 'fn3', type: 'mcq', prompt: '"neuf" is…', say: 'neuf', options: ['9', '7', '6', '10'], answer: 0, explain: 'neuf = 9 (also means "new"!).' },
            { id: 'fn4', type: 'input', prompt: 'Write 4 in French', answers: ['quatre'], explain: '4 = quatre.' },
          ],
        },
        {
          id: 'fr-me',
          title: 'About me',
          teach: { text: ['Je m\'appelle Hlaki = My name is Hlaki', 'J\'ai dix-neuf ans = I am 19 (literally "I have 19 years")', 'Je suis sud-africaine = I am South African (woman; a man says sud-africain)', 'Je parle anglais et zoulou = I speak English and Zulu'], say: 'Je m\'appelle Hlaki. J\'ai dix-neuf ans. Je suis sud-africaine. Je parle anglais et zoulou.' },
          questions: [
            { id: 'fm-1', type: 'mcq', prompt: '"Je m\'appelle Hlaki" means…', options: ['My name is Hlaki', 'I call Hlaki', 'I am Hlaki\'s', 'I love Hlaki'], answer: 0, explain: 'Je m\'appelle = my name is.' },
            { id: 'fm-2', type: 'mcq', prompt: 'How do you say "I am 19"?', options: ['J\'ai dix-neuf ans', 'Je suis dix-neuf', 'Je suis dix-neuf ans', 'J\'appelle dix-neuf'], answer: 0, explain: 'French uses "avoir" (to have) for age.' },
            { id: 'fm-3', type: 'mcq', prompt: 'A woman says she is South African:', options: ['Je suis sud-africaine', 'Je suis sud-africain', 'J\'ai sud-africaine', 'Je parle sud-africaine'], answer: 0, explain: 'Feminine adds -e: sud-africaine.' },
            { id: 'fm-4', type: 'order', prompt: 'Build: I speak English', steps: ['Je', 'parle', 'anglais'], explain: 'Je parle anglais.' },
          ],
        },
      ],
    },
  ],
}

export const HEBREW: Course = {
  id: 'hebrew',
  name: 'Hebrew',
  icon: '',
  color: '#5AA2FF',
  group: 'extra',
  section: 'Languages',
  lang: 'he-IL',
  blurb: 'Hebrew is read from right to left. Most everyday text has no vowel marks.',
  units: [
    {
      id: 'he-alefbet',
      title: 'The Alef-Bet',
      icon: 'א',
      description: 'Letters and first words',
      lessons: [
        {
          id: 'he-l1',
          title: 'First letters',
          teach: { text: ['Read RIGHT to LEFT ←', 'א Alef: silent, carries a vowel · ב Bet: b · ג Gimel: g · ד Dalet: d · ה He: h · ש Shin: sh'], say: 'אלף, בית, גימל, דלת, הא, שין' },
          questions: [
            { id: 'hl1', type: 'mcq', prompt: 'Which direction is Hebrew read?', options: ['Right to left', 'Left to right', 'Top to bottom', 'Either'], answer: 0, explain: 'Right to left, like Arabic.' },
            { id: 'hl2', type: 'match', prompt: 'Match the letter to its sound', pairs: [['ב', 'b'], ['ג', 'g'], ['ד', 'd'], ['ה', 'h']], explain: 'Bet b, Gimel g, Dalet d, He h.' },
            { id: 'hl3', type: 'mcq', prompt: 'Which letter makes "sh"?', options: ['ש', 'ס', 'צ', 'ת'], answer: 0, explain: 'ש Shin = sh.' },
            { id: 'hl4', type: 'mcq', prompt: 'The letter א (Alef) is…', options: ['silent, it carries a vowel', 'always "a"', 'like "k"', 'like "sh"'], answer: 0, explain: 'Alef has no sound of its own.' },
          ],
        },
        {
          id: 'he-l2',
          title: 'More letters',
          teach: { text: ['ל Lamed: l · מ Mem: m (at the end of a word it looks like ם) · נ Nun: n · ת Tav: t · ו Vav: v, o or u · י Yod: y or i', 'שלום = sh-l-o-m (shalom). See the final ם at the end!'], say: 'שלום' },
          questions: [
            { id: 'hm1', type: 'match', prompt: 'Match the letter', pairs: [['ל', 'l'], ['מ', 'm'], ['נ', 'n'], ['ת', 't']], explain: 'Lamed l, Mem m, Nun n, Tav t.' },
            { id: 'hm2', type: 'mcq', prompt: 'ם is the form of Mem used…', options: ['at the end of a word', 'at the start', 'only in names', 'never'], answer: 0, explain: 'Some letters have a special final form.' },
            { id: 'hm3', type: 'mcq', prompt: 'Read: שלום', say: 'שלום', options: ['shalom', 'todah', 'boker', 'laila'], answer: 0, explain: 'ש sh + ל l + ו o + ם m = shalom.' },
            { id: 'hm4', type: 'mcq', prompt: 'ו (Vav) can sound like…', options: ['v, o or u', 'only b', 'only sh', 'nothing'], answer: 0, explain: 'Vav is a consonant (v) or a vowel (o/u).' },
          ],
        },
        {
          id: 'he-greet',
          title: 'Greetings',
          teach: { text: ['שלום shalom = hello / goodbye / peace', 'תודה todah = thank you', 'בוקר טוב boker tov = good morning', 'לילה טוב laila tov = good night', 'כן ken = yes · לא lo = no'], say: 'שלום. תודה. בוקר טוב. לילה טוב. כן. לא.' },
          questions: [
            { id: 'hg1', type: 'mcq', prompt: 'תודה means…', say: 'תודה', options: ['thank you', 'hello', 'yes', 'good night'], answer: 0, explain: 'todah = thank you.' },
            { id: 'hg2', type: 'match', prompt: 'Match', pairs: [['כן', 'yes'], ['לא', 'no'], ['בוקר טוב', 'good morning'], ['לילה טוב', 'good night']], explain: 'ken, lo, boker tov, laila tov.' },
            { id: 'hg3', type: 'mcq', prompt: 'שלום can mean…', say: 'שלום', options: ['hello, goodbye and peace', 'only goodbye', 'thank you', 'good night'], answer: 0, explain: 'Shalom = peace, used for hello and goodbye.' },
            { id: 'hg4', type: 'mcq', prompt: '"Good morning" in Hebrew', options: ['בוקר טוב', 'לילה טוב', 'תודה', 'שלום'], answer: 0, explain: 'boker = morning, tov = good.' },
          ],
        },
      ],
    },
  ],
}
