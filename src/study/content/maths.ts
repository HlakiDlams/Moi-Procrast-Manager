import type { Course } from '../types'

/**
 * Mathematics: starts from the foundations (Gr 8–10 skills every Gr 12 topic needs),
 * then moves into the Grade 12 CAPS topics.
 */
export const MATHS: Course = {
  id: 'maths',
  name: 'Mathematics',
  icon: '',
  color: '#FF2E93',
  subjectName: 'Mathematics',
  group: 'school',
  units: [
    // ------------------------------------------------------------------ foundations
    {
      id: 'm-numbers',
      title: 'Number basics',
      icon: '',
      description: 'Negatives, order of operations, fractions',
      lessons: [
        {
          id: 'm-int',
          title: 'Negative numbers',
          teach: {
            text: ['Adding a negative is the same as subtracting.', 'Subtracting a negative is the same as adding.', 'Multiply or divide: same signs → positive, different signs → negative.'],
            example: ['−3 + 7 = 4', '6 − (−2) = 6 + 2 = 8', '(−4) × (−5) = 20', '(−12) ÷ 4 = −3'],
          },
          questions: [
            { id: 'int1', type: 'mcq', prompt: '−3 + 7 = ?', options: ['4', '−10', '−4', '10'], answer: 0, explain: 'Start at −3 and move 7 to the right: −3 → 4.' },
            { id: 'int2', type: 'input', prompt: '−8 − 5 = ?', answers: ['-13'], numeric: true, explain: 'Both take you further left: −8 − 5 = −13.' },
            { id: 'int3', type: 'mcq', prompt: '(−4) × (−6) = ?', options: ['24', '−24', '−10', '10'], answer: 0, explain: 'Same signs multiply to a positive: 4 × 6 = 24.' },
            { id: 'int4', type: 'input', prompt: '6 − (−2) = ?', answers: ['8'], numeric: true, explain: 'Minus a negative is plus: 6 + 2 = 8.' },
            { id: 'int5', type: 'mcq', prompt: '(−18) ÷ 3 = ?', options: ['−6', '6', '−15', '−54'], answer: 0, explain: 'Different signs give a negative: 18 ÷ 3 = 6, so −6.' },
            {
              id: 'int6',
              type: 'match',
              prompt: 'Match each sum to its answer',
              pairs: [
                ['−2 + (−3)', '−5'],
                ['(−2) × (−3)', '6'],
                ['−2 − (−3)', '1'],
                ['(−12) ÷ (−4)', '3'],
              ],
              explain: '−2 + (−3) = −5 · (−2)(−3) = 6 · −2 + 3 = 1 · (−12) ÷ (−4) = 3',
            },
          ],
        },
        {
          id: 'm-bodmas',
          title: 'Order of operations',
          teach: {
            text: ['BODMAS: Brackets → Orders (powers, roots) → Division & Multiplication → Addition & Subtraction.', 'Division/multiplication (and addition/subtraction) are done left to right.'],
            example: ['3 + 4 × 2', '= 3 + 8   (multiply first)', '= 11'],
          },
          questions: [
            { id: 'bod1', type: 'mcq', prompt: '3 + 4 × 2 = ?', options: ['11', '14', '10', '24'], answer: 0, explain: 'Multiply first: 4 × 2 = 8, then 3 + 8 = 11.' },
            { id: 'bod2', type: 'input', prompt: '(3 + 4) × 2 = ?', answers: ['14'], numeric: true, explain: 'Brackets first: 7 × 2 = 14.' },
            { id: 'bod3', type: 'input', prompt: '20 − 6 ÷ 2 = ?', answers: ['17'], numeric: true, explain: 'Divide first: 6 ÷ 2 = 3, then 20 − 3 = 17.' },
            { id: 'bod4', type: 'mcq', prompt: '2 × 3² = ?', options: ['18', '36', '12', '81'], answer: 0, explain: 'Power first: 3² = 9, then 2 × 9 = 18.' },
            { id: 'bod5', type: 'input', prompt: '10 − 2 × 3 + 4 = ?', answers: ['8'], numeric: true, explain: '2 × 3 = 6 first. Then left to right: 10 − 6 + 4 = 8.' },
            {
              id: 'bod6',
              type: 'order',
              prompt: 'Put the steps in order to work out 5 + 2 × (8 − 5)²',
              steps: ['Brackets: 8 − 5 = 3', 'Power: 3² = 9', 'Multiply: 2 × 9 = 18', 'Add: 5 + 18 = 23'],
              explain: 'B → O → M → A gives 23.',
            },
          ],
        },
        {
          id: 'm-frac',
          title: 'Fractions',
          teach: {
            text: ['Add/subtract: make the bottoms (denominators) the same first.', 'Multiply: top × top, bottom × bottom.', 'Divide: flip the second fraction and multiply.'],
            example: ['1/2 + 1/3 = 3/6 + 2/6 = 5/6', '2/3 × 3/4 = 6/12 = 1/2', '1/2 ÷ 1/4 = 1/2 × 4/1 = 2'],
          },
          questions: [
            { id: 'fr1', type: 'input', prompt: '1/2 + 1/4 = ?', answers: ['3/4'], numeric: true, placeholder: 'e.g. 3/4', explain: '1/2 = 2/4, so 2/4 + 1/4 = 3/4.' },
            { id: 'fr2', type: 'mcq', prompt: '2/3 × 3/5 = ?', options: ['2/5', '5/8', '5/15', '1'], answer: 0, explain: '(2 × 3)/(3 × 5) = 6/15 = 2/5.' },
            { id: 'fr3', type: 'input', prompt: '3/4 ÷ 1/2 = ?', answers: ['3/2'], numeric: true, placeholder: 'fraction or decimal', explain: 'Flip and multiply: 3/4 × 2/1 = 6/4 = 3/2 (or 1.5).' },
            { id: 'fr4', type: 'mcq', prompt: 'Simplify fully: 12/18', options: ['2/3', '3/4', '1/2', '3/2'], answer: 0, explain: 'Divide top and bottom by 6: 12/18 = 2/3.' },
            { id: 'fr5', type: 'input', prompt: '5/6 − 1/3 = ?', answers: ['1/2'], numeric: true, explain: '1/3 = 2/6, so 5/6 − 2/6 = 3/6 = 1/2.' },
            { id: 'fr6', type: 'mcq', prompt: 'Which is bigger?', options: ['3/5', '4/7', 'They are equal'], answer: 0, explain: '3/5 = 0.6 and 4/7 ≈ 0.571, so 3/5 is bigger.' },
          ],
        },
      ],
    },
    {
      id: 'm-algebra',
      title: 'Algebra basics',
      icon: '',
      description: 'Like terms, expanding, factorising',
      lessons: [
        {
          id: 'm-expand',
          title: 'Like terms & expanding',
          teach: {
            text: ['Like terms have exactly the same letters and powers: 3x and 5x are like terms, x² and x are not.', 'To expand, multiply everything inside the bracket by what is outside.', 'Two brackets: every term in the first × every term in the second.'],
            example: ['3x + 5x = 8x', '3(x + 4) = 3x + 12', '(x + 2)(x + 3) = x² + 3x + 2x + 6 = x² + 5x + 6'],
          },
          questions: [
            { id: 'ex1', type: 'mcq', prompt: 'Simplify: 3x + 5x − 2x', options: ['6x', '8x', '6', '10x'], answer: 0, explain: '3 + 5 − 2 = 6, so 6x.' },
            { id: 'ex2', type: 'mcq', prompt: 'Simplify: 4a + 3b − a + 2b', options: ['3a + 5b', '5a + 5b', '3a + b', '8ab'], answer: 0, explain: 'a-terms: 4a − a = 3a. b-terms: 3b + 2b = 5b.' },
            { id: 'ex3', type: 'input', prompt: 'Expand: 3(x + 4)', answers: ['3x+12', '12+3x'], placeholder: 'e.g. 2x+6', explain: '3 × x = 3x and 3 × 4 = 12.' },
            { id: 'ex4', type: 'mcq', prompt: 'Expand: −2(x − 5)', options: ['−2x + 10', '−2x − 10', '2x + 10', '−2x − 5'], answer: 0, explain: '−2 × x = −2x and −2 × −5 = +10.' },
            { id: 'ex5', type: 'mcq', prompt: 'Expand: (x + 2)(x + 3)', options: ['x² + 5x + 6', 'x² + 6x + 5', 'x² + 6', '2x + 5'], answer: 0, explain: 'x² + 3x + 2x + 6 = x² + 5x + 6.' },
            { id: 'ex6', type: 'mcq', prompt: 'Expand: (x − 4)²', options: ['x² − 8x + 16', 'x² − 16', 'x² + 16', 'x² − 4x + 16'], answer: 0, explain: '(x − 4)(x − 4) = x² − 4x − 4x + 16 = x² − 8x + 16.' },
          ],
        },
        {
          id: 'm-factor',
          title: 'Factorising',
          teach: {
            text: ['Factorising is expanding backwards.', '1. Always take out a common factor first.', '2. Difference of squares: a² − b² = (a − b)(a + b).', '3. x² + bx + c: find two numbers that multiply to c and add to b.'],
            example: ['6x + 9 = 3(2x + 3)', 'x² − 16 = (x − 4)(x + 4)', 'x² + 7x + 12: 3 × 4 = 12 and 3 + 4 = 7', '→ (x + 3)(x + 4)'],
          },
          questions: [
            { id: 'fa1', type: 'mcq', prompt: 'Factorise: 6x + 9', options: ['3(2x + 3)', '6(x + 9)', '3(2x + 9)', '9(6x + 1)'], answer: 0, explain: '3 goes into both: 6x = 3 × 2x and 9 = 3 × 3.' },
            { id: 'fa2', type: 'mcq', prompt: 'Factorise: x² − 25', options: ['(x − 5)(x + 5)', '(x − 5)²', '(x + 5)²', '(x − 25)(x + 1)'], answer: 0, explain: 'Difference of squares: x² − 5² = (x − 5)(x + 5).' },
            { id: 'fa3', type: 'mcq', prompt: 'Which two numbers multiply to 6 and add to 5?', options: ['2 and 3', '1 and 6', '−2 and −3', '1 and 5'], answer: 0, explain: '2 × 3 = 6 and 2 + 3 = 5.' },
            { id: 'fa4', type: 'mcq', prompt: 'Factorise: x² + 5x + 6', options: ['(x + 2)(x + 3)', '(x + 1)(x + 6)', '(x − 2)(x − 3)', '(x + 5)(x + 1)'], answer: 0, explain: '2 and 3 multiply to 6 and add to 5.' },
            { id: 'fa5', type: 'mcq', prompt: 'Factorise: x² − x − 12', options: ['(x − 4)(x + 3)', '(x + 4)(x − 3)', '(x − 6)(x + 2)', '(x − 12)(x + 1)'], answer: 0, explain: 'Need ×: −12 and +: −1. That is −4 and +3.' },
            { id: 'fa6', type: 'mcq', prompt: 'Factorise fully: 2x² − 8', options: ['2(x − 2)(x + 2)', '2(x − 4)(x + 4)', '(x − 2)(x + 4)', '2(x − 2)²'], answer: 0, explain: 'Common factor first: 2(x² − 4). Then difference of squares: 2(x − 2)(x + 2).' },
          ],
        },
      ],
    },
    {
      id: 'm-equations',
      title: 'Equations',
      icon: '',
      description: 'Linear and quadratic equations',
      lessons: [
        {
          id: 'm-linear',
          title: 'Linear equations',
          teach: {
            text: ['An equation is a balance: whatever you do to one side, do to the other.', 'Goal: get x alone. Undo + and − first, then × and ÷.', 'Check your answer by putting it back in.'],
            example: ['2x + 3 = 11', '2x = 8 (−3 both sides)', 'x = 4 (÷2 both sides)', 'Check: 2(4) + 3 = 11'],
          },
          questions: [
            { id: 'li1', type: 'input', prompt: 'Solve: x + 7 = 12', answers: ['5'], numeric: true, placeholder: 'x = ?', explain: 'Subtract 7 from both sides: x = 5.' },
            { id: 'li2', type: 'input', prompt: 'Solve: 3x = 18', answers: ['6'], numeric: true, placeholder: 'x = ?', explain: 'Divide both sides by 3: x = 6.' },
            { id: 'li3', type: 'input', prompt: 'Solve: 2x + 3 = 11', answers: ['4'], numeric: true, placeholder: 'x = ?', explain: '2x = 8, so x = 4.' },
            { id: 'li4', type: 'input', prompt: 'Solve: 5x − 4 = 2x + 11', answers: ['5'], numeric: true, placeholder: 'x = ?', explain: 'Move x-terms left, numbers right: 3x = 15, so x = 5.' },
            { id: 'li5', type: 'input', prompt: 'Solve: x/3 = 7', answers: ['21'], numeric: true, placeholder: 'x = ?', explain: 'Multiply both sides by 3: x = 21.' },
            {
              id: 'li6',
              type: 'order',
              prompt: 'Put the steps in order to solve 4(x − 2) = 12',
              steps: ['Expand: 4x − 8 = 12', 'Add 8 to both sides: 4x = 20', 'Divide by 4: x = 5'],
              explain: 'Expand, then undo −8, then undo ×4.',
            },
            { id: 'li7', type: 'input', prompt: 'Solve: 2(x + 1) = x + 6', answers: ['4'], numeric: true, placeholder: 'x = ?', explain: '2x + 2 = x + 6, so x = 4.' },
          ],
        },
        {
          id: 'm-quad',
          title: 'Quadratic equations',
          teach: {
            text: ['1. Make one side = 0.', '2. Factorise.', '3. Each bracket = 0 gives an answer (usually two).', 'If it won\'t factorise, use the formula: x = (−b ± √(b² − 4ac)) / 2a.'],
            example: ['x² − 5x + 6 = 0', '(x − 2)(x − 3) = 0', 'x − 2 = 0 or x − 3 = 0', 'x = 2 or x = 3'],
          },
          questions: [
            { id: 'qu1', type: 'mcq', prompt: '(x − 2)(x + 5) = 0, so x = ?', options: ['2 or −5', '−2 or 5', '2 or 5', '−2 or −5'], answer: 0, explain: 'x − 2 = 0 → x = 2. x + 5 = 0 → x = −5.' },
            { id: 'qu2', type: 'mcq', prompt: 'Solve: x² − 9 = 0', options: ['x = 3 or x = −3', 'x = 3 only', 'x = 9', 'x = 81'], answer: 0, explain: '(x − 3)(x + 3) = 0 → x = 3 or x = −3. Don\'t forget the negative!' },
            { id: 'qu3', type: 'mcq', prompt: 'Solve: x² − 7x + 12 = 0', options: ['3 or 4', '−3 or −4', '2 or 6', '−2 or −6'], answer: 0, explain: '(x − 3)(x − 4) = 0 → x = 3 or 4.' },
            { id: 'qu4', type: 'mcq', prompt: 'Solve: x² = 4x', options: ['0 or 4', '4 only', '2 or −2', '−4 or 0'], answer: 0, explain: 'x² − 4x = 0 → x(x − 4) = 0 → x = 0 or 4. Never divide by x: you lose x = 0.' },
            { id: 'qu5', type: 'mcq', prompt: 'In 2x² + 3x − 5 = 0, what are a, b and c?', options: ['a = 2, b = 3, c = −5', 'a = 2, b = 3, c = 5', 'a = 3, b = 2, c = −5', 'a = 2, b = −3, c = −5'], answer: 0, explain: 'ax² + bx + c: a = 2, b = 3, c = −5 (keep the sign).' },
            { id: 'qu6', type: 'input', prompt: 'Use the formula: x² + 2x − 1 = 0. Give the positive answer to 2 decimals.', answers: ['0.41'], numeric: true, tolerance: 0.006, placeholder: 'e.g. 1.23', explain: 'x = (−2 + √(4 + 4)) / 2 = (−2 + 2.828) / 2 ≈ 0.41.' },
          ],
        },
      ],
    },
    {
      id: 'm-exponents',
      title: 'Exponents',
      icon: '',
      description: 'Exponent laws and exponential equations',
      lessons: [
        {
          id: 'm-explaws',
          title: 'Exponent laws',
          teach: {
            text: ['Multiply → add powers: aᵐ × aⁿ = aᵐ⁺ⁿ', 'Divide → subtract powers: aᵐ ÷ aⁿ = aᵐ⁻ⁿ', 'Power of a power → multiply: (aᵐ)ⁿ = aᵐⁿ', 'a⁰ = 1 and a⁻ⁿ = 1/aⁿ'],
            example: ['x² × x³ = x⁵', 'x⁷ ÷ x² = x⁵', '(x²)³ = x⁶', '3⁻² = 1/9'],
          },
          questions: [
            { id: 'el1', type: 'mcq', prompt: 'x³ × x⁴ = ?', options: ['x⁷', 'x¹²', '2x⁷', 'x'], answer: 0, explain: 'Same base, multiply → add the powers: 3 + 4 = 7.' },
            { id: 'el2', type: 'mcq', prompt: 'x⁸ ÷ x² = ?', options: ['x⁶', 'x⁴', 'x¹⁰', 'x¹⁶'], answer: 0, explain: 'Divide → subtract the powers: 8 − 2 = 6.' },
            { id: 'el3', type: 'mcq', prompt: '(x³)² = ?', options: ['x⁶', 'x⁵', 'x⁹', '2x³'], answer: 0, explain: 'Power of a power → multiply: 3 × 2 = 6.' },
            { id: 'el4', type: 'input', prompt: '5⁰ = ?', answers: ['1'], numeric: true, explain: 'Anything (except 0) to the power 0 is 1.' },
            { id: 'el5', type: 'mcq', prompt: '2⁻³ = ?', options: ['1/8', '−8', '−6', '8'], answer: 0, explain: 'Negative power → 1 over: 1/2³ = 1/8.' },
            { id: 'el6', type: 'input', prompt: '2³ × 2² = ? (give the number)', answers: ['32'], numeric: true, explain: '2⁵ = 32.' },
            { id: 'el7', type: 'mcq', prompt: '(2x²)³ = ?', options: ['8x⁶', '6x⁶', '8x⁵', '2x⁶'], answer: 0, explain: 'Cube everything: 2³ = 8 and (x²)³ = x⁶.' },
          ],
        },
        {
          id: 'm-expeq',
          title: 'Exponential equations',
          teach: {
            text: ['Make both sides the same base.', 'Then the powers must be equal.'],
            example: ['2ˣ = 8', '2ˣ = 2³', 'x = 3', '', '9ˣ = 27 → 3²ˣ = 3³ → 2x = 3 → x = 3/2'],
          },
          questions: [
            { id: 'xe1', type: 'input', prompt: 'Solve: 2ˣ = 16', answers: ['4'], numeric: true, placeholder: 'x = ?', explain: '16 = 2⁴, so x = 4.' },
            { id: 'xe2', type: 'input', prompt: 'Solve: 3ˣ = 27', answers: ['3'], numeric: true, placeholder: 'x = ?', explain: '27 = 3³, so x = 3.' },
            { id: 'xe3', type: 'input', prompt: 'Solve: 5ˣ = 1', answers: ['0'], numeric: true, placeholder: 'x = ?', explain: '1 = 5⁰, so x = 0.' },
            { id: 'xe4', type: 'input', prompt: 'Solve: 2ˣ = 1/8', answers: ['-3'], numeric: true, placeholder: 'x = ?', explain: '1/8 = 1/2³ = 2⁻³, so x = −3.' },
            { id: 'xe5', type: 'input', prompt: 'Solve: 4ˣ = 32', answers: ['5/2'], numeric: true, placeholder: 'x = ?', explain: '4ˣ = (2²)ˣ = 2²ˣ and 32 = 2⁵. So 2x = 5, x = 5/2 = 2.5.' },
            { id: 'xe6', type: 'input', prompt: 'Solve: 2ˣ⁺¹ = 16', answers: ['3'], numeric: true, placeholder: 'x = ?', explain: '16 = 2⁴, so x + 1 = 4, x = 3.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------ Grade 12 CAPS
    {
      id: 'm-sequences',
      title: 'Sequences & series',
      icon: '',
      description: 'Gr 12: arithmetic, geometric, sigma',
      lessons: [
        {
          id: 'm-arith',
          title: 'Arithmetic sequences',
          teach: {
            text: ['Arithmetic = same difference (d) every time.', 'd = T₂ − T₁', 'General term: Tₙ = a + (n − 1)d, where a is the first term.'],
            example: ['3; 7; 11; …', 'a = 3, d = 4', 'T₁₀ = 3 + 9 × 4 = 39'],
          },
          questions: [
            { id: 'ar1', type: 'input', prompt: 'Next term: 5; 9; 13; …', answers: ['17'], numeric: true, explain: 'd = 4, so 13 + 4 = 17.' },
            { id: 'ar2', type: 'input', prompt: 'Find d: 20; 17; 14; …', answers: ['-3'], numeric: true, explain: 'd = 17 − 20 = −3.' },
            { id: 'ar3', type: 'mcq', prompt: 'Tₙ for 3; 7; 11; …', options: ['Tₙ = 4n − 1', 'Tₙ = 3n + 4', 'Tₙ = 4n + 3', 'Tₙ = n + 4'], answer: 0, explain: 'Tₙ = 3 + (n − 1)4 = 4n − 1. Check: T₁ = 3 ' },
            { id: 'ar4', type: 'input', prompt: 'Find T₂₀ of 2; 5; 8; …', answers: ['59'], numeric: true, explain: 'T₂₀ = 2 + 19 × 3 = 59.' },
            { id: 'ar5', type: 'input', prompt: 'Which term of 3; 7; 11; … is 83?', answers: ['21'], numeric: true, placeholder: 'n = ?', explain: '4n − 1 = 83 → 4n = 84 → n = 21.' },
            {
              id: 'ar6',
              type: 'order',
              prompt: 'Order the steps to find T₁₅ of 10; 6; 2; …',
              steps: ['a = 10 and d = 6 − 10 = −4', 'Tₙ = a + (n − 1)d', 'T₁₅ = 10 + 14 × (−4)', 'T₁₅ = −46'],
              explain: 'Find a and d, write the formula, substitute, calculate.',
            },
          ],
        },
        {
          id: 'm-geo',
          title: 'Geometric sequences',
          teach: {
            text: ['Geometric = same ratio (r) every time: you multiply.', 'r = T₂ ÷ T₁', 'General term: Tₙ = a · rⁿ⁻¹'],
            example: ['3; 6; 12; …', 'a = 3, r = 2', 'T₆ = 3 × 2⁵ = 96'],
          },
          questions: [
            { id: 'ge1', type: 'input', prompt: 'Find r: 2; 6; 18; …', answers: ['3'], numeric: true, explain: 'r = 6 ÷ 2 = 3.' },
            { id: 'ge2', type: 'input', prompt: 'Next term: 5; 10; 20; …', answers: ['40'], numeric: true, explain: 'r = 2, so 20 × 2 = 40.' },
            { id: 'ge3', type: 'mcq', prompt: '4; 12; 36; … is…', options: ['Geometric (r = 3)', 'Arithmetic (d = 8)', 'Neither'], answer: 0, explain: '12 − 4 = 8 but 36 − 12 = 24, so not arithmetic. 12 ÷ 4 = 36 ÷ 12 = 3: geometric.' },
            { id: 'ge4', type: 'input', prompt: 'Find T₇ of 3; 6; 12; …', answers: ['192'], numeric: true, explain: 'T₇ = 3 × 2⁶ = 3 × 64 = 192.' },
            { id: 'ge5', type: 'input', prompt: 'Find r: 64; 32; 16; …', answers: ['1/2'], numeric: true, explain: 'r = 32 ÷ 64 = 1/2.' },
            { id: 'ge6', type: 'mcq', prompt: 'Tₙ for 1; 3; 9; …', options: ['Tₙ = 3ⁿ⁻¹', 'Tₙ = 3ⁿ', 'Tₙ = 3n − 2', 'Tₙ = n³'], answer: 0, explain: 'a = 1, r = 3: Tₙ = 1 · 3ⁿ⁻¹. Check: T₁ = 3⁰ = 1 ' },
          ],
        },
        {
          id: 'm-series',
          title: 'Series & sigma',
          teach: {
            text: ['A series is a sum of terms.', 'Arithmetic: Sₙ = n/2 [2a + (n − 1)d]', 'Geometric: Sₙ = a(rⁿ − 1) / (r − 1)', 'Σ means "add up". Number of terms = top − bottom + 1.'],
            example: ['Σ (k = 1 to 5) of 2k', '= 2 + 4 + 6 + 8 + 10 = 30'],
          },
          questions: [
            { id: 'se1', type: 'input', prompt: '1 + 2 + 3 + … + 10 = ?', answers: ['55'], numeric: true, explain: 'S₁₀ = 10/2 × (1 + 10) = 55.' },
            { id: 'se2', type: 'input', prompt: 'Σ (k = 1 to 4) of 3k = ?', answers: ['30'], numeric: true, explain: '3 + 6 + 9 + 12 = 30.' },
            { id: 'se3', type: 'input', prompt: 'Find S₁₀ of 2 + 5 + 8 + …', answers: ['155'], numeric: true, explain: 'S₁₀ = 10/2 [2(2) + 9(3)] = 5 × 31 = 155.' },
            { id: 'se4', type: 'input', prompt: '1 + 2 + 4 + 8 + 16 + 32 = ?', answers: ['63'], numeric: true, explain: 'Geometric: 1(2⁶ − 1)/(2 − 1) = 63. Or just add!' },
            { id: 'se5', type: 'mcq', prompt: 'How many terms in Σ (k = 3 to 10)?', options: ['8', '7', '10', '13'], answer: 0, explain: 'top − bottom + 1 = 10 − 3 + 1 = 8.' },
            { id: 'se6', type: 'input', prompt: 'Find S₅ of 3 + 6 + 12 + …', answers: ['93'], numeric: true, explain: 'S₅ = 3(2⁵ − 1)/(2 − 1) = 3 × 31 = 93.' },
          ],
        },
      ],
    },
    {
      id: 'm-finance',
      title: 'Finance',
      icon: '',
      description: 'Gr 12: interest (annuities next)',
      lessons: [
        {
          id: 'm-interest',
          title: 'Simple & compound interest',
          teach: {
            text: ['Simple: A = P(1 + in)', 'Compound: A = P(1 + i)ⁿ', 'P = amount you start with, i = rate as a decimal (8% → 0.08), n = number of periods.', 'Monthly compounding: i = rate ÷ 12, n = years × 12.'],
            example: ['R1000 at 10% compound for 2 years', 'A = 1000(1.1)² = R1210'],
          },
          questions: [
            { id: 'in1', type: 'mcq', prompt: '8% as a decimal is…', options: ['0.08', '0.8', '8', '0.008'], answer: 0, explain: '8 ÷ 100 = 0.08.' },
            { id: 'in2', type: 'input', prompt: 'R1000 at 10% simple interest for 3 years. A = ? (rand)', answers: ['1300'], numeric: true, tolerance: 0.5, explain: 'A = 1000(1 + 0.1 × 3) = R1300.' },
            { id: 'in3', type: 'input', prompt: 'R1000 at 10% p.a. compound for 2 years. A = ? (rand)', answers: ['1210'], numeric: true, tolerance: 0.5, explain: 'A = 1000(1.1)² = 1000 × 1.21 = R1210.' },
            { id: 'in4', type: 'mcq', prompt: 'Same rate, many years: which grows more?', options: ['Compound interest', 'Simple interest', 'They grow the same'], answer: 0, explain: 'Compound earns interest on interest, so it grows faster.' },
            { id: 'in5', type: 'mcq', prompt: '12% p.a. compounded monthly for 3 years. i and n?', options: ['i = 0.01, n = 36', 'i = 0.12, n = 3', 'i = 0.12, n = 36', 'i = 0.01, n = 3'], answer: 0, explain: 'i = 0.12 ÷ 12 = 0.01 and n = 3 × 12 = 36.' },
            { id: 'in6', type: 'input', prompt: 'R5000 at 6% p.a. compound for 4 years. A = ? (nearest rand)', answers: ['6312.38'], numeric: true, tolerance: 1, explain: 'A = 5000(1.06)⁴ = 5000 × 1.2625 ≈ R6312.' },
          ],
        },
      ],
    },
  ],
}
