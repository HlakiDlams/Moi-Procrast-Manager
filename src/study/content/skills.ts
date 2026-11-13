import type { Course } from '../types'

// Note frequencies (Hz) for ear training
const C4 = 261.63
const E4 = 329.63
const G4 = 392.0
const A4 = 440.0
const C5 = 523.25

export const ART: Course = {
  id: 'art',
  name: 'Art',
  icon: '🎨',
  color: '#FF9F68',
  group: 'extra',
  section: 'Skills & knowledge',
  blurb: 'Learn the fundamentals here, then draw the daily prompt. 10 minutes a day beats 3 hours once a month.',
  prompts: [
    'Draw your hand in 3 different poses.',
    'Draw a cup from your kitchen: notice the ellipse at the top.',
    'Fill a page with 20 different lines: thick, thin, wavy, broken.',
    'Draw your shoe using only straight lines.',
    'Shade a sphere: light, mid-tone, shadow, cast shadow.',
    'Draw a corner of your room in 1-point perspective.',
    'Draw an eye, then draw it again from memory.',
    'Draw a plant or leaf in detail for 10 minutes.',
    'Draw a face using the "eyes halfway down" rule.',
    'Make a 5-step value scale from white to black.',
    'Draw something using only its silhouette (filled black shape).',
    'Draw a stack of 3 books from an angle.',
    'Sketch a person from a photo in 2 minutes. Then do 4 more.',
    'Draw your favourite food.',
    'Draw a cloud using soft shading only, no outlines.',
    'Draw your street or the view from your window.',
    'Mix (or colour) a warm and a cool version of the same object.',
    'Draw texture: tree bark, fabric, hair, or brick.',
    'Draw a self-portrait in a mirror.',
    'Draw something you love, and add one tiny detail you\'ve never noticed before.',
  ],
  units: [
    {
      id: 'art-basics',
      title: 'Fundamentals',
      icon: '✏️',
      description: 'Elements, colour, proportion',
      lessons: [
        {
          id: 'art-elements',
          title: 'Elements of art',
          teach: { text: ['Line: a mark made by a moving point', 'Shape: flat (2D): circle, square', 'Form: 3D: sphere, cube', 'Value: how light or dark', 'Colour, texture (how it feels or looks like it feels) and space (around and between things)'] },
          questions: [
            { id: 'ae1', type: 'mcq', prompt: 'A circle is a shape. A sphere is a…', options: ['form', 'line', 'value', 'texture'], answer: 0, explain: 'Shape = 2D, form = 3D.' },
            { id: 'ae2', type: 'mcq', prompt: 'How light or dark something is, is called…', options: ['value', 'hue', 'form', 'space'], answer: 0, explain: 'Value = lightness/darkness. Shading creates value.' },
            { id: 'ae3', type: 'match', prompt: 'Match the element', pairs: [['Line', 'mark made by a moving point'], ['Texture', 'how a surface feels'], ['Space', 'area around objects'], ['Form', '3D object']], explain: 'The building blocks of every artwork.' },
            { id: 'ae4', type: 'mcq', prompt: 'What makes a flat circle look like a 3D ball?', options: ['Shading (value)', 'A thicker outline', 'More colours', 'Drawing it bigger'], answer: 0, explain: 'Light and shadow create form.' },
          ],
        },
        {
          id: 'art-colour',
          title: 'Colour theory',
          teach: { text: ['Primary: red, yellow, blue · Secondary (mix two primaries): orange, green, purple', 'Complementary = opposite on the colour wheel: red–green, blue–orange, yellow–purple', 'Tint = add white · Shade = add black · Tone = add grey', 'Warm: red, orange, yellow · Cool: blue, green, purple'] },
          questions: [
            { id: 'ac1', type: 'mcq', prompt: 'Blue + yellow = ?', options: ['green', 'purple', 'orange', 'brown'], answer: 0, explain: 'Blue + yellow = green.' },
            { id: 'ac2', type: 'mcq', prompt: 'The complementary colour of orange is…', options: ['blue', 'red', 'yellow', 'green'], answer: 0, explain: 'Opposite on the wheel: blue–orange.' },
            { id: 'ac3', type: 'mcq', prompt: 'Adding white to a colour makes a…', options: ['tint', 'shade', 'tone', 'hue'], answer: 0, explain: 'Tint = + white. Shade = + black.' },
            { id: 'ac4', type: 'mcq', prompt: 'Which is a cool colour?', options: ['blue', 'red', 'orange', 'yellow'], answer: 0, explain: 'Blues, greens and purples feel cool.' },
            { id: 'ac5', type: 'match', prompt: 'Match the complementary pairs', pairs: [['red', 'green'], ['blue', 'orange'], ['yellow', 'purple']], explain: 'Complementary colours make each other pop.' },
          ],
        },
        {
          id: 'art-prop',
          title: 'Proportion and perspective',
          teach: { text: ['Face: the eyes sit about HALFWAY down the head (not near the top!).', 'The space between the eyes ≈ one eye wide.', 'An adult figure is about 7½–8 heads tall.', '1-point perspective: all depth lines go to one vanishing point on the horizon (eye level).'] },
          questions: [
            { id: 'ap1', type: 'mcq', prompt: 'Where are the eyes on a head?', options: ['About halfway down', 'Near the top', 'Two thirds down', 'At the very top'], answer: 0, explain: 'A very common beginner mistake is putting them too high.' },
            { id: 'ap2', type: 'mcq', prompt: 'An adult body is about how many heads tall?', options: ['7½–8', '3', '5', '12'], answer: 0, explain: 'Roughly 7½ to 8 heads.' },
            { id: 'ap3', type: 'mcq', prompt: 'In 1-point perspective, the vanishing point sits on the…', options: ['horizon line (eye level)', 'bottom of the page', 'object itself', 'top of the page'], answer: 0, explain: 'Horizon = eye level.' },
            { id: 'ap4', type: 'mcq', prompt: 'The gap between the eyes is about…', options: ['one eye wide', 'two heads wide', 'one nose long', 'nothing'], answer: 0, explain: 'About one eye width.' },
          ],
        },
      ],
    },
  ],
}

export const CHESS: Course = {
  id: 'chess',
  name: 'Chess',
  icon: '♟️',
  color: '#B0B0B0',
  group: 'extra',
  section: 'Skills & knowledge',
  units: [
    {
      id: 'ch-basics',
      title: 'Chess basics',
      icon: '♞',
      description: 'Pieces, rules, openings, tactics',
      lessons: [
        {
          id: 'ch-pieces',
          title: 'How the pieces move',
          teach: { text: ['King ♔: one square any way · Queen ♕: any distance, any direction', 'Rook ♖: straight lines · Bishop ♗: diagonals · Knight ♘: L-shape, can jump', 'Pawn ♙: forward one (two on its first move), captures diagonally', 'Values: pawn 1 · knight 3 · bishop 3 · rook 5 · queen 9'] },
          questions: [
            { id: 'cp-1', type: 'mcq', prompt: 'Which piece can jump over others?', options: ['Knight', 'Bishop', 'Rook', 'Queen'], answer: 0, explain: 'Only the knight jumps.' },
            { id: 'cp-2', type: 'mcq', prompt: 'How does a pawn capture?', options: ['Diagonally forward', 'Straight forward', 'Sideways', 'Backwards'], answer: 0, explain: 'Pawns move straight but capture diagonally.' },
            { id: 'cp-3', type: 'match', prompt: 'Match the piece to its value', pairs: [['Pawn', '1'], ['Knight', '3'], ['Rook', '5'], ['Queen', '9']], explain: 'Bishop is also 3. The king is priceless!' },
            { id: 'cp-4', type: 'mcq', prompt: 'Which piece moves only diagonally?', options: ['Bishop', 'Rook', 'Knight', 'King'], answer: 0, explain: 'Bishops stay on one colour all game.' },
            { id: 'cp-5', type: 'mcq', prompt: 'Is trading your rook for a knight a good deal?', options: ['No: you give 5 for 3', 'Yes: knights are better', 'It\'s equal', 'Only on Sundays'], answer: 0, explain: 'Rook (5) > knight (3).' },
          ],
        },
        {
          id: 'ch-rules',
          title: 'Special rules',
          teach: { text: ['Check: the king is attacked. Checkmate: check with no escape = game over.', 'Stalemate: no legal moves but NOT in check = draw.', 'Castling: king moves 2 squares toward a rook, the rook jumps over. Only if neither has moved, nothing is between them, and the king is not in check and doesn\'t pass through check.', 'Promotion: a pawn reaching the last row becomes any piece (usually a queen).'] },
          questions: [
            { id: 'cr1', type: 'mcq', prompt: 'No legal moves and NOT in check is…', options: ['stalemate (draw)', 'checkmate (win)', 'check', 'castling'], answer: 0, explain: 'Stalemate = draw. Careful when you\'re winning!' },
            { id: 'cr2', type: 'mcq', prompt: 'Can you castle while in check?', options: ['No', 'Yes', 'Only on the queen side'], answer: 0, explain: 'You can\'t castle out of, through, or into check.' },
            { id: 'cr3', type: 'mcq', prompt: 'A pawn reaches the last row. It…', options: ['promotes to another piece', 'is removed', 'goes back to start', 'becomes a king'], answer: 0, explain: 'Usually a queen. It can\'t become a king.' },
            { id: 'cr4', type: 'mcq', prompt: 'Checkmate means…', options: ['the king is attacked and cannot escape', 'the king is attacked', 'no legal moves', 'a draw'], answer: 0, explain: 'Checkmate ends the game.' },
          ],
        },
        {
          id: 'ch-tactics',
          title: 'Openings and tactics',
          teach: { text: ['Opening: control the centre, develop knights and bishops, castle early, don\'t bring the queen out too soon.', 'Fork: one piece attacks two at once (knights love this).', 'Pin: a piece can\'t move without exposing a more valuable piece behind it.', 'Skewer: like a pin, but the MORE valuable piece is in front.'], example: ["Scholar's mate:", '1. e4 e5  2. Bc4 Nc6  3. Qh5 Nf6??  4. Qxf7#'] },
          questions: [
            { id: 'ct1', type: 'mcq', prompt: 'One knight attacks the king and the queen at the same time. This is a…', options: ['fork', 'pin', 'skewer', 'castle'], answer: 0, explain: 'Fork = attacking two pieces at once.' },
            { id: 'ct2', type: 'mcq', prompt: 'Good opening principle', options: ['Develop knights and bishops early', 'Move the queen out first', 'Move only pawns', 'Move the king forward'], answer: 0, explain: 'Get your minor pieces into the game.' },
            { id: 'ct3', type: 'mcq', code: '1. e4 e5\n2. Bc4 Nc6\n3. Qh5 Nf6??', prompt: 'White to move. What is checkmate?', options: ['Qxf7#', 'Qxe5+', 'Bxf7+', 'Qh6'], answer: 0, explain: 'Scholar\'s mate: the queen takes f7, protected by the bishop.' },
            { id: 'ct4', type: 'mcq', prompt: 'A piece can\'t move because a more valuable piece is behind it. That is a…', options: ['pin', 'fork', 'skewer', 'stalemate'], answer: 0, explain: 'Pin.' },
          ],
        },
      ],
    },
  ],
}

export const MUSIC: Course = {
  id: 'music',
  name: 'Music',
  icon: '🎵',
  color: '#C77DFF',
  group: 'extra',
  section: 'Skills & knowledge',
  blurb: 'Theory plus ear training. Turn your volume up for the ▶ questions.',
  units: [
    {
      id: 'mu-basics',
      title: 'Music basics',
      icon: '🎼',
      description: 'Reading notes, rhythm, ear training',
      lessons: [
        {
          id: 'mu-notes',
          title: 'Reading notes',
          teach: { text: ['Treble clef lines (bottom to top): E G B D F: "Every Good Boy Deserves Fruit"', 'Treble clef spaces: F A C E: spells FACE', 'Bass clef lines: G B D F A: "Good Boys Do Fine Always"', 'Bass clef spaces: A C E G: "All Cows Eat Grass"'] },
          questions: [
            { id: 'mn1', type: 'mcq', prompt: 'The treble clef SPACES spell…', options: ['FACE', 'EGBDF', 'ACEG', 'CAGE'], answer: 0, explain: 'F A C E.' },
            { id: 'mn2', type: 'mcq', prompt: 'Bottom line of the treble clef', options: ['E', 'F', 'G', 'C'], answer: 0, explain: 'Every (E) Good Boy Deserves Fruit.' },
            { id: 'mn3', type: 'mcq', prompt: 'Treble clef, 3rd line from the bottom', options: ['B', 'G', 'D', 'C'], answer: 0, explain: 'E G B: the 3rd line is B.' },
            { id: 'mn4', type: 'mcq', prompt: 'Bass clef spaces', options: ['A C E G', 'F A C E', 'G B D F A', 'E G B D F'], answer: 0, explain: 'All Cows Eat Grass.' },
          ],
        },
        {
          id: 'mu-rhythm',
          title: 'Rhythm',
          teach: { text: ['Semibreve (whole note) = 4 beats · Minim (half) = 2 · Crotchet (quarter) = 1 · Quaver (eighth) = ½', 'A dot adds half the note\'s value: dotted minim = 2 + 1 = 3 beats', '4/4 time = 4 crotchet beats in every bar'] },
          questions: [
            { id: 'mr1', type: 'input', prompt: 'How many beats is a minim?', answers: ['2'], numeric: true, explain: 'Minim = half note = 2 beats.' },
            { id: 'mr2', type: 'input', prompt: 'How many beats is a dotted minim?', answers: ['3'], numeric: true, explain: '2 + half of 2 = 3.' },
            { id: 'mr3', type: 'match', prompt: 'Match the note to its beats', pairs: [['Semibreve', '4'], ['Minim', '2'], ['Crotchet', '1'], ['Quaver', '½']], explain: 'Each one is half of the one before.' },
            { id: 'mr4', type: 'input', prompt: 'How many quavers fit in one bar of 4/4?', answers: ['8'], numeric: true, explain: '4 beats ÷ ½ = 8 quavers.' },
          ],
        },
        {
          id: 'mu-ear',
          title: 'Ear training',
          teach: { text: ['Listen carefully. Is the second note higher, lower or the same?', 'An octave is the same note, 8 notes higher (double the frequency).', 'Major scale pattern: Tone, Tone, Semitone, Tone, Tone, Tone, Semitone', 'C major has no sharps or flats (all white keys).'] },
          questions: [
            { id: 'me1', type: 'mcq', tones: [C4, G4], prompt: 'Is the second note higher or lower?', options: ['Higher', 'Lower', 'The same'], answer: 0, explain: 'C → G goes up.' },
            { id: 'me2', type: 'mcq', tones: [A4, E4], prompt: 'Is the second note higher or lower?', options: ['Lower', 'Higher', 'The same'], answer: 0, explain: 'A → E goes down.' },
            { id: 'me3', type: 'mcq', tones: [G4, G4], prompt: 'Higher, lower or the same?', options: ['The same', 'Higher', 'Lower'], answer: 0, explain: 'Both notes are G.' },
            { id: 'me4', type: 'mcq', tones: [C4, C5], prompt: 'This jump (same note name, much higher) is an…', options: ['octave', 'semitone', 'tone', 'unison'], answer: 0, explain: 'C to the next C = octave.' },
            { id: 'me5', type: 'mcq', prompt: 'Which major scale has no sharps or flats?', options: ['C major', 'G major', 'F major', 'D major'], answer: 0, explain: 'C major: all white keys.' },
          ],
        },
      ],
    },
  ],
}

export const FINANCE: Course = {
  id: 'finance',
  name: 'Personal finance',
  icon: '💳',
  color: '#6BE3A4',
  group: 'extra',
  section: 'Skills & knowledge',
  blurb: 'Money skills for real life in South Africa: budgets, saving, payslips and avoiding debt traps.',
  units: [
    {
      id: 'fi-basics',
      title: 'Money basics',
      icon: '💰',
      description: 'Budgeting, saving, debt, payslips',
      lessons: [
        {
          id: 'fi-budget',
          title: 'Budgeting',
          teach: { text: ['A budget plans where your money goes BEFORE you spend it.', 'Needs (rent, food, transport) vs wants (takeaways, new sneakers).', '50/30/20 rule: 50% needs · 30% wants · 20% savings/debt.'], example: ['Income R4 000', 'Needs: R2 000 · Wants: R1 200 · Savings: R800'] },
          questions: [
            { id: 'fb1', type: 'input', prompt: 'Income R4 000. Using 50/30/20, how much goes to savings? (R)', answers: ['800'], numeric: true, explain: '20% of 4 000 = R800.' },
            { id: 'fb2', type: 'mcq', prompt: 'Which is a NEED?', options: ['Taxi fare to work', 'New phone case', 'Takeaways', 'Netflix'], answer: 0, explain: 'Getting to work is essential.' },
            { id: 'fb3', type: 'input', prompt: 'Income R6 000. How much for needs (50%)? (R)', answers: ['3000'], numeric: true, explain: '50% of 6 000 = R3 000.' },
            { id: 'fb4', type: 'mcq', prompt: 'Best time to make a budget', options: ['Before the month starts', 'After the money is gone', 'Only in December', 'Never'], answer: 0, explain: 'Plan first, then spend.' },
          ],
        },
        {
          id: 'fi-save',
          title: 'Saving and interest',
          teach: { text: ['Emergency fund: aim for 3–6 months of expenses for surprises.', 'Compound interest: you earn interest on your interest, so start early!', 'TFSA (Tax-Free Savings Account): growth is tax-free, with a yearly and lifetime limit (check SARS for the current amounts).', 'Guaranteed super-high returns = almost always a scam.'] },
          questions: [
            { id: 'fs1', type: 'mcq', prompt: 'An emergency fund should cover about…', options: ['3–6 months of expenses', '1 day', '10 years', 'nothing'], answer: 0, explain: '3–6 months is the common guideline.' },
            { id: 'fs2', type: 'mcq', prompt: 'Why start saving young?', options: ['Compound interest has more time to grow', 'Banks prefer young people', 'Interest is higher for teens', 'No reason'], answer: 0, explain: 'Time is the secret ingredient of compound growth.' },
            { id: 'fs3', type: 'mcq', prompt: 'Growth inside a TFSA is…', options: ['tax-free', 'taxed double', 'not allowed', 'paid to SARS'], answer: 0, explain: 'That\'s the point of a TFSA.' },
            { id: 'fs4', type: 'mcq', prompt: '"Invest R500, get R5 000 guaranteed next week!" This is…', options: ['a scam', 'a great deal', 'a TFSA', 'a budget'], answer: 0, explain: 'Guaranteed huge returns = red flag.' },
          ],
        },
        {
          id: 'fi-debt',
          title: 'Debt and payslips',
          teach: { text: ['Interest on credit cards and store accounts makes things cost much more over time.', 'Paying only the minimum keeps you in debt for years.', 'Mashonisa (loan sharks) charge illegal interest. Avoid them.', 'Payslip: Gross pay = before deductions. Net pay = what you actually get.', 'Deductions: PAYE (income tax), UIF (1% from you), sometimes pension/medical aid.', 'Your credit record: pay on time, every time.'] },
          questions: [
            { id: 'fd1', type: 'mcq', prompt: 'Net pay is…', options: ['what you get after deductions', 'pay before deductions', 'your bonus', 'your tax'], answer: 0, explain: 'Net = take-home pay.' },
            { id: 'fd2', type: 'mcq', prompt: 'PAYE on your payslip is…', options: ['income tax', 'a savings plan', 'your pension', 'a bonus'], answer: 0, explain: 'Pay As You Earn = income tax.' },
            { id: 'fd3', type: 'input', prompt: 'Gross pay R5 000. UIF is 1%. How much UIF is deducted? (R)', answers: ['50'], numeric: true, explain: '1% of 5 000 = R50.' },
            { id: 'fd4', type: 'mcq', prompt: 'Paying only the minimum on a credit card…', options: ['keeps you in debt longer and costs more', 'clears it quickly', 'improves your salary', 'is free'], answer: 0, explain: 'Interest keeps piling up.' },
            { id: 'fd5', type: 'mcq', prompt: 'Best way to build a good credit record', options: ['Pay accounts on time', 'Open many store cards', 'Borrow from a mashonisa', 'Ignore your accounts'], answer: 0, explain: 'On-time payments matter most.' },
          ],
        },
      ],
    },
  ],
}
