import type { Course } from '../types'

/** English: for growing knowledge (lighter course, no exam pressure). */

const PASSAGE = `Every morning before sunrise, Naledi sits at the kitchen table with a cup of rooibos. She calls this hour her "quiet gold": no messages, no noise, just her books. Her friends laugh and say she is crazy to wake up so early. Naledi only smiles. She knows that small, steady steps build big results, and that the hardest part of studying is simply starting.`

export const ENGLISH: Course = {
  id: 'english',
  name: 'English',
  icon: '📖',
  color: '#FFB3C7',
  subjectName: 'English',
  group: 'extra',
  section: 'Languages',
  lang: 'en-ZA',
  units: [
    {
      id: 'en-lang',
      title: 'Language',
      icon: '🔤',
      description: 'Parts of speech, tenses, concord, confusing words',
      lessons: [
        {
          id: 'en-pos',
          title: 'Parts of speech',
          teach: {
            text: ['Noun: a person, place, thing or idea (Naledi, kitchen, hope)', 'Verb: an action or state (run, is)', 'Adjective: describes a noun (quiet, early)', 'Adverb: describes a verb, often ending in -ly (quickly)', 'Pronoun: replaces a noun (she, they)', 'Preposition: shows position/relation (on, under, before)'],
            example: ['Naledi (noun) quietly (adverb) reads (verb) her (pronoun) new (adjective) book on (preposition) the table.'],
          },
          questions: [
            { id: 'pos1', type: 'mcq', prompt: '"She sings beautifully." Beautifully is a(n)…', options: ['adverb', 'adjective', 'verb', 'noun'], answer: 0, explain: 'It describes HOW she sings (the verb) → adverb.' },
            { id: 'pos2', type: 'mcq', prompt: '"The tall girl laughed." Tall is a(n)…', options: ['adjective', 'adverb', 'noun', 'pronoun'], answer: 0, explain: 'It describes the noun "girl".' },
            { id: 'pos3', type: 'mcq', prompt: 'Which word is an abstract noun?', options: ['happiness', 'table', 'Johannesburg', 'happy'], answer: 0, explain: 'Abstract nouns are ideas/feelings you can\'t touch.' },
            {
              id: 'pos4',
              type: 'match',
              prompt: 'Match the word to its part of speech',
              pairs: [
                ['under', 'preposition'],
                ['they', 'pronoun'],
                ['run', 'verb'],
                ['quickly', 'adverb'],
              ],
              explain: 'Position word, replacement word, action word, how-word.',
            },
            { id: 'pos5', type: 'mcq', prompt: '"Thabo and I went to church." Which word is a conjunction?', options: ['and', 'went', 'to', 'church'], answer: 0, explain: 'Conjunctions join words or clauses: and, but, because.' },
          ],
        },
        {
          id: 'en-concord',
          title: 'Tenses and concord',
          teach: {
            text: ['Concord: the verb must agree with the subject. One → is/was/has. More than one → are/were/have.', '"Each", "every", "everyone", "neither" are singular.', 'Past tense of irregular verbs must be learnt: go → went, see → saw, write → wrote.'],
            example: ['Each of the learners IS ready.', 'The learners ARE ready.', 'Neither of them WAS late.'],
          },
          questions: [
            { id: 'co1', type: 'mcq', prompt: 'Each of the girls ___ a book.', options: ['has', 'have'], answer: 0, explain: '"Each" is singular → has.' },
            { id: 'co2', type: 'mcq', prompt: 'The results ___ out tomorrow.', options: ['are', 'is'], answer: 0, explain: '"Results" is plural → are.' },
            { id: 'co3', type: 'mcq', prompt: 'Past tense: "She writes a letter."', options: ['She wrote a letter.', 'She writed a letter.', 'She has write a letter.', 'She written a letter.'], answer: 0, explain: 'write → wrote (irregular).' },
            { id: 'co4', type: 'mcq', prompt: 'Neither of my brothers ___ at home.', options: ['was', 'were'], answer: 0, explain: '"Neither" is singular → was.' },
            { id: 'co5', type: 'mcq', prompt: 'Future tense: "We study hard."', options: ['We will study hard.', 'We studied hard.', 'We are studied hard.', 'We have study hard.'], answer: 0, explain: 'will + verb.' },
          ],
        },
        {
          id: 'en-confused',
          title: 'Commonly confused words',
          teach: {
            text: ['their (belongs to them) · there (place) · they\'re (they are)', 'its (belongs to it) · it\'s (it is)', 'your (belongs to you) · you\'re (you are)', 'affect (verb: to influence) · effect (noun: a result)', 'then (time) · than (comparing)'],
          },
          questions: [
            { id: 'cf1', type: 'mcq', prompt: '___ going to church on Sunday.', options: ["They're", 'Their', 'There'], answer: 0, explain: 'They are going → they\'re.' },
            { id: 'cf2', type: 'mcq', prompt: 'The dog wagged ___ tail.', options: ['its', "it's"], answer: 0, explain: 'Belongs to it → its (no apostrophe).' },
            { id: 'cf3', type: 'mcq', prompt: 'Lack of sleep can ___ your marks.', options: ['affect', 'effect'], answer: 0, explain: 'Verb → affect.' },
            { id: 'cf4', type: 'mcq', prompt: 'She is taller ___ her sister.', options: ['than', 'then'], answer: 0, explain: 'Comparing → than.' },
            { id: 'cf5', type: 'mcq', prompt: '___ going to pass if you keep this up!', options: ["You're", 'Your'], answer: 0, explain: 'You are → you\'re.' },
          ],
        },
        {
          id: 'en-voice',
          title: 'Active/passive and reported speech',
          teach: {
            text: [
              'Passive: the object becomes the subject + form of "to be" + past participle (+ by …).',
              'Reported speech: remove quotes, shift tenses back one step, change pronouns and time words.',
              'today → that day · tomorrow → the next day · yesterday → the previous day',
            ],
            example: ['Active: Thandi wrote the essay.', 'Passive: The essay was written by Thandi.', '', 'He said, "I am tired."', '→ He said that he was tired.'],
          },
          questions: [
            { id: 'ev1', type: 'mcq', prompt: 'Passive: "The teacher marks the tests."', options: ['The tests are marked by the teacher.', 'The tests were marked by the teacher.', 'The teacher is marked by the tests.', 'The tests marks the teacher.'], answer: 0, explain: 'Present tense stays present: are marked.' },
            { id: 'ev2', type: 'mcq', prompt: 'Passive: "Sipho broke the window."', options: ['The window was broken by Sipho.', 'The window is broken by Sipho.', 'The window broke Sipho.', 'Sipho was broken by the window.'], answer: 0, explain: 'Past → was broken.' },
            { id: 'ev3', type: 'mcq', prompt: 'She said, "I am hungry."', options: ['She said that she was hungry.', 'She said that I am hungry.', 'She said that she is hungry yesterday.', 'She says I was hungry.'], answer: 0, explain: 'am → was, I → she.' },
            { id: 'ev4', type: 'mcq', prompt: 'He said, "I will come tomorrow."', options: ['He said that he would come the next day.', 'He said that he will come tomorrow.', 'He said that I would come tomorrow.', 'He said he come the next day.'], answer: 0, explain: 'will → would, tomorrow → the next day.' },
            { id: 'ev5', type: 'mcq', prompt: 'Mom asked, "Did you eat?"', options: ['Mom asked if I had eaten.', 'Mom asked did I eat.', 'Mom asked that I ate.', 'Mom asked if you eat.'], answer: 0, explain: 'Yes/no question → if/whether; did eat → had eaten.' },
          ],
        },
      ],
    },
    {
      id: 'en-read',
      title: 'Reading and writing',
      icon: '✍️',
      description: 'Comprehension, figures of speech, formats',
      lessons: [
        {
          id: 'en-comp',
          title: 'Comprehension',
          teach: {
            text: ['Read the questions first, then the passage.', 'Quote = copy the exact words in quotation marks.', '"In your own words" = don\'t copy, rephrase.', 'The passage stays on screen for every question.'],
            example: PASSAGE.split('. ').map((x, i, a) => (i < a.length - 1 ? x + '.' : x)),
            say: PASSAGE,
          },
          questions: [
            { id: 'cp1', type: 'mcq', context: PASSAGE, prompt: 'When does Naledi study?', options: ['Before sunrise', 'After school', 'At midnight', 'On weekends only'], answer: 0, explain: '"Every morning before sunrise…"' },
            { id: 'cp2', type: 'mcq', context: PASSAGE, prompt: 'What does she call this hour?', options: ['"quiet gold"', '"golden hour"', '"study time"', '"rooibos hour"'], answer: 0, explain: 'Quote: "quiet gold".' },
            { id: 'cp3', type: 'mcq', context: PASSAGE, prompt: 'How do her friends react?', options: ['They laugh and say she is crazy', 'They join her', 'They ignore her', 'They are jealous'], answer: 0, explain: '"Her friends laugh and say she is crazy…"' },
            { id: 'cp4', type: 'mcq', context: PASSAGE, prompt: '"quiet gold" is an example of a…', options: ['metaphor', 'simile', 'onomatopoeia', 'pun'], answer: 0, explain: 'It calls the hour gold without "like/as" → metaphor.' },
            { id: 'cp5', type: 'mcq', context: PASSAGE, prompt: 'What does Naledi believe is the hardest part of studying?', options: ['Simply starting', 'Waking up early', 'Remembering facts', 'Writing exams'], answer: 0, explain: '"…the hardest part of studying is simply starting." (That\'s why "Just 2 minutes" works 💕)' },
          ],
        },
        {
          id: 'en-figures',
          title: 'Figures of speech',
          teach: {
            text: ['Simile: compares using "like" or "as"', 'Metaphor: says something IS something else', 'Personification: human qualities for non-human things', 'Hyperbole: huge exaggeration', 'Onomatopoeia: words that sound like the sound (buzz, bang)', 'Alliteration: repeated starting consonant sounds'],
          },
          questions: [
            { id: 'fg1', type: 'mcq', prompt: '"I\'ve told you a million times!"', options: ['Hyperbole', 'Simile', 'Metaphor', 'Onomatopoeia'], answer: 0, explain: 'Huge exaggeration → hyperbole.' },
            { id: 'fg2', type: 'mcq', prompt: '"Her smile was like sunshine."', options: ['Simile', 'Metaphor', 'Personification', 'Alliteration'], answer: 0, explain: '"like" → simile.' },
            { id: 'fg3', type: 'mcq', prompt: '"The bees buzzed."', options: ['Onomatopoeia', 'Hyperbole', 'Metaphor', 'Simile'], answer: 0, explain: '"buzz" sounds like the sound.' },
            { id: 'fg4', type: 'mcq', prompt: '"The stars danced in the sky."', options: ['Personification', 'Simile', 'Hyperbole', 'Alliteration'], answer: 0, explain: 'Stars can\'t dance → human action.' },
            { id: 'fg5', type: 'mcq', prompt: '"Peter Piper picked peppers."', options: ['Alliteration', 'Onomatopoeia', 'Metaphor', 'Simile'], answer: 0, explain: 'p-p-p → alliteration.' },
          ],
        },
        {
          id: 'en-formats',
          title: 'Writing formats',
          teach: {
            text: [
              'Formal letter: "Dear Sir/Madam" → end "Yours faithfully". "Dear Mr Dlamini" (name known) → "Yours sincerely".',
              'Informal letter: "Dear Naledi" → "Love" / "Regards".',
              'Email: To, Subject, greeting, short paragraphs, sign-off.',
              'Essays: narrative (story), descriptive (describe), argumentative (one side), discursive (both sides), reflective (thoughts/feelings).',
            ],
          },
          questions: [
            { id: 'fm1', type: 'mcq', prompt: 'You start with "Dear Sir/Madam". You end with…', options: ['Yours faithfully', 'Yours sincerely', 'Love', 'Cheers'], answer: 0, explain: 'Unknown name → faithfully.' },
            { id: 'fm2', type: 'mcq', prompt: 'You start with "Dear Mrs Mokoena". You end with…', options: ['Yours sincerely', 'Yours faithfully', 'Love', 'Bye'], answer: 0, explain: 'Name known → sincerely.' },
            { id: 'fm3', type: 'mcq', prompt: 'An essay that looks at BOTH sides of an issue', options: ['Discursive', 'Argumentative', 'Narrative', 'Descriptive'], answer: 0, explain: 'Discursive = both sides; argumentative = one side.' },
            { id: 'fm4', type: 'mcq', prompt: 'An essay that tells a story', options: ['Narrative', 'Reflective', 'Discursive', 'Argumentative'], answer: 0, explain: 'Narrative = story.' },
            { id: 'fm5', type: 'mcq', prompt: 'The "Subject" line of an email should…', options: ['say briefly what it is about', 'contain your address', 'be left empty', 'be your full message'], answer: 0, explain: 'Short and clear.' },
          ],
        },
      ],
    },
  ],
}
