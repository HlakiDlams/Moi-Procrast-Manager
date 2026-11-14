import { inp, lesson, mc, pair, schoolCourse, seq, unit } from './build'

export const MATHLIT = schoolCourse('mathlit', 'Mathematical Literacy', 'Everyday maths: money, measurement, maps and data. Always show your working and round only at the end.', [
  unit('ml-money', 'Numbers and money', 'Percentages, rates, interest and bills', [
    lesson(
      'ml-percent',
      'Percentages and VAT',
      ['Percent means "out of 100". To find 15% of an amount, multiply by 0.15.', 'VAT in South Africa is 15%. Price including VAT = price × 1.15.', 'To remove VAT from an inclusive price, divide by 1.15.', 'Percentage change = (new − old) ÷ old × 100.'],
      [
        inp('What is 15% of R200? (number only)', ['30', 'R30'], '200 × 0.15 = 30.', { numeric: true }),
        mc('A jacket costs R400 before VAT. What is the price including 15% VAT?', ['R460', 'R415', 'R340', 'R600'], '400 × 1.15 = 460.'),
        mc('A price of R230 includes VAT. How do you find the price before VAT?', ['Divide by 1.15', 'Subtract 15% of 230', 'Multiply by 0.15', 'Divide by 15'], 'Inclusive ÷ 1.15 gives the exclusive price (R200).'),
        inp('A taxi fare rises from R20 to R25. What is the percentage increase? (number only)', ['25', '25%'], '(25 − 20) ÷ 20 × 100 = 25%.', { numeric: true }),
        mc('Which is the same as 7.5%?', ['0.075', '0.75', '7.5', '0.0075'], 'Divide by 100: 7.5 ÷ 100 = 0.075.'),
      ],
      { example: ['R80 shirt, 25% off', 'Discount = 80 × 0.25 = R20', 'You pay R60'] },
    ),
    lesson(
      'ml-ratio',
      'Ratio, rate and proportion',
      ['A ratio compares two amounts in the same unit, e.g. 1 : 4 juice to water.', 'A rate compares different units, e.g. R18 per litre or 60 km/h.', 'To share in a ratio, add the parts, find one part, then multiply.', 'Unit rate: divide to find the cost or amount for ONE, then scale up.'],
      [
        inp('Share R120 in the ratio 1 : 3. How much is the bigger share? (number only)', ['90', 'R90'], '4 parts, one part = R30, bigger share = 3 × 30 = R90.', { numeric: true }),
        mc('6 pens cost R42. What do 10 pens cost at the same rate?', ['R70', 'R60', 'R84', 'R52'], 'One pen = R7, so 10 pens = R70.'),
        mc('Which is the better buy?', ['2 kg for R36', '500 g for R10', '1 kg for R19', 'They are the same'], 'Per kg: R18, R20 and R19. R18/kg is cheapest.'),
        inp('A car travels 150 km in 2 hours. What is its average speed in km/h?', ['75'], 'Speed = distance ÷ time = 150 ÷ 2.', { numeric: true }),
        mc('A recipe for 4 people needs 300 g of flour. How much for 10 people?', ['750 g', '600 g', '1200 g', '700 g'], '300 ÷ 4 = 75 g per person, × 10 = 750 g.'),
      ],
    ),
    lesson(
      'ml-interest',
      'Simple and compound interest',
      ['Simple interest is worked out on the original amount only: I = P × i × n.', 'Compound interest earns interest on interest: A = P(1 + i)^n.', 'i is the rate as a decimal (8% = 0.08) and n is the number of years.', 'Over time, compound interest always grows faster than simple interest at the same rate.'],
      [
        inp('R1 000 at 10% simple interest for 3 years. How much interest? (number only)', ['300', 'R300'], '1000 × 0.10 × 3 = 300.', { numeric: true }),
        mc('R1 000 at 10% compound interest for 2 years grows to…', ['R1 210', 'R1 200', 'R1 100', 'R1 020'], '1000 × 1.1 × 1.1 = 1210.'),
        mc('Which statement is true?', ['Compound interest is calculated on the growing balance', 'Simple interest is calculated on the growing balance', 'They always give the same answer', 'Compound interest ignores the rate'], 'Compound interest adds interest to the balance each period.'),
        mc('In A = P(1 + i)^n, what is P?', ['The starting amount', 'The interest rate', 'The number of years', 'The final amount'], 'P is the principal: what you start with.'),
        inp('Write 6.5% as a decimal', ['0.065', '0,065', '.065'], '6.5 ÷ 100 = 0.065.'),
      ],
      { example: ['R2 000 at 5% simple for 4 years', 'I = 2000 × 0.05 × 4 = R400', 'Total = R2 400'] },
    ),
  ]),
  unit('ml-world', 'Measurement and data', 'Tariffs, units, area and statistics', [
    lesson(
      'ml-tariffs',
      'Tariffs and bills',
      ['A tariff is a price list for a service, e.g. electricity per kWh or data per GB.', 'Many bills have a fixed charge plus a charge per unit used.', 'Block (sliding) tariffs charge different rates for different levels of use.', 'To compare two options, work out the total cost of each for the same usage.'],
      [
        mc('Electricity costs R2.50 per kWh. What do 120 kWh cost?', ['R300', 'R250', 'R122.50', 'R48'], '120 × 2.50 = 300.'),
        mc('A plumber charges a R350 call-out fee plus R200 per hour. What is the cost of a 3-hour job?', ['R950', 'R600', 'R1 650', 'R550'], '350 + 3 × 200 = 950.'),
        mc('Plan A: R100 per month + R1 per minute. Plan B: R2 per minute, no fee. For 80 minutes, which is cheaper?', ['Plan B (R160)', 'Plan A (R180)', 'They cost the same', 'Cannot tell'], 'A = 100 + 80 = R180, B = 160.'),
        inp('Using the same plans, at how many minutes do A and B cost the same?', ['100'], '100 + m = 2m, so m = 100.', { numeric: true }),
        mc('A "fixed charge" on a bill is…', ['an amount you pay no matter how much you use', 'the charge per unit', 'the VAT', 'a discount'], 'Fixed charges do not change with usage.'),
      ],
    ),
    lesson(
      'ml-measure',
      'Measurement: units, perimeter and area',
      ['1 km = 1 000 m, 1 m = 100 cm, 1 kg = 1 000 g, 1 litre = 1 000 ml.', 'Perimeter is the distance around a shape. Area is the surface it covers.', 'Rectangle: area = length × width. Circle: area = π × r², circumference = 2 × π × r.', 'Area units are squared (m²). 1 m² = 10 000 cm².'],
      [
        inp('How many metres are in 3.2 km?', ['3200', '3 200'], '3.2 × 1000 = 3200.', { numeric: true }),
        mc('A room is 4 m by 5 m. What is its area?', ['20 m²', '18 m²', '9 m²', '20 m'], 'Area = 4 × 5 = 20 m².'),
        mc('What is the perimeter of that 4 m by 5 m room?', ['18 m', '20 m', '9 m', '40 m'], '2 × (4 + 5) = 18 m.'),
        mc('Tiles cost R150 per m². What does it cost to tile 20 m²?', ['R3 000', 'R170', 'R1 500', 'R300'], '20 × 150 = 3000.'),
        inp('How many millilitres are in 2.5 litres?', ['2500', '2 500'], '2.5 × 1000 = 2500.', { numeric: true }),
      ],
    ),
    lesson(
      'ml-data',
      'Data: mean, median, mode and range',
      ['Mean = add all the values and divide by how many there are.', 'Median = the middle value when the values are in order. With two middle values, take their mean.', 'Mode = the value that appears most often. Range = highest − lowest.', 'One very large or small value (an outlier) pulls the mean but hardly moves the median.'],
      [
        inp('Find the mean of 4, 6, 8, 10, 12', ['8'], '40 ÷ 5 = 8.', { numeric: true }),
        inp('Find the median of 3, 9, 4, 7, 5', ['5'], 'In order: 3, 4, 5, 7, 9. The middle is 5.', { numeric: true }),
        mc('What is the mode of 2, 3, 3, 5, 7, 3, 9?', ['3', '5', '7', '9'], '3 appears most often.'),
        inp('What is the range of 12, 20, 15, 8, 30?', ['22'], '30 − 8 = 22.', { numeric: true }),
        mc('Salaries: R8 000, R9 000, R9 500, R10 000 and R90 000. Which average describes a typical salary best?', ['Median', 'Mean', 'Range', 'Mode'], 'The R90 000 outlier pulls the mean up; the median is not affected.'),
      ],
    ),
  ]),
])

export const PHYSCI = schoolCourse('physci', 'Physical Sciences', 'Physics and chemistry. Write the formula first, substitute with units, then solve.', [
  unit('ps-physics', 'Physics', 'Vectors, forces, motion and circuits', [
    lesson(
      'ps-vectors',
      'Vectors and scalars',
      ['A scalar has size only: distance, speed, mass, time, energy.', 'A vector has size AND direction: displacement, velocity, acceleration, force.', 'Vectors in a line: choose a positive direction, then add with signs.', 'The resultant is the single vector that has the same effect as all the vectors together.'],
      [
        mc('Which of these is a vector?', ['Velocity', 'Speed', 'Mass', 'Time'], 'Velocity has a direction; the others do not.'),
        mc('Forces of 8 N right and 3 N left act on a box. What is the resultant?', ['5 N right', '11 N right', '5 N left', '3 N right'], 'Take right as positive: 8 − 3 = 5 N right.'),
        mc('You walk 4 m east then 4 m west. What is your displacement?', ['0 m', '8 m', '4 m east', '16 m'], 'You end where you started. Distance is 8 m but displacement is 0.'),
        pair('Match the quantity to its type', [['Distance', 'scalar'], ['Displacement', 'vector'], ['Energy', 'scalar'], ['Force', 'vector']], 'Displacement and force have direction.'),
        mc('What is the SI unit of force?', ['newton (N)', 'joule (J)', 'watt (W)', 'kilogram (kg)'], 'Force is measured in newtons.'),
      ],
    ),
    lesson(
      'ps-newton',
      "Newton's laws",
      ['First law (inertia): an object stays at rest or at constant velocity unless a net force acts on it.', 'Second law: Fnet = m × a. The acceleration is in the direction of the net force.', 'Third law: when A pushes B, B pushes A with an equal force in the opposite direction.', 'Weight is the force of gravity: w = m × g, with g = 9.8 m/s² on Earth.'],
      [
        inp('A net force of 20 N acts on a 4 kg trolley. What is its acceleration in m/s²?', ['5'], 'a = F ÷ m = 20 ÷ 4.', { numeric: true }),
        mc('A passenger jerks forward when a taxi brakes suddenly. Which law explains this?', ['First law (inertia)', 'Second law', 'Third law', 'Law of conservation of energy'], 'The body keeps moving until a force (the seatbelt) stops it.'),
        mc('The action-reaction forces in the third law…', ['act on different objects', 'act on the same object', 'cancel each other out', 'are different in size'], 'They are equal and opposite but act on two different objects, so they do not cancel.'),
        inp('What is the weight of a 10 kg bag on Earth, in newtons? (g = 9.8)', ['98'], 'w = mg = 10 × 9.8.', { numeric: true }),
        mc('If the net force on a moving car is zero, the car…', ['keeps moving at constant velocity', 'stops immediately', 'speeds up', 'slows down'], 'Zero net force means zero acceleration.'),
      ],
      { example: ['Fnet = ma', '12 = 3 × a', 'a = 4 m/s² in the direction of the net force'] },
    ),
    lesson(
      'ps-motion',
      'Equations of motion',
      ['For constant acceleration: vf = vi + aΔt.', 'Δx = viΔt + ½aΔt² and vf² = vi² + 2aΔx.', 'List what you know (vi, vf, a, Δt, Δx), then pick the equation with only one unknown.', 'Choose a positive direction and keep it. "From rest" means vi = 0.'],
      [
        inp('A car starts from rest and accelerates at 3 m/s² for 4 s. What is its final velocity in m/s?', ['12'], 'vf = 0 + 3 × 4.', { numeric: true }),
        inp('How far does that car travel in the 4 s, in metres?', ['24'], 'Δx = 0 + ½ × 3 × 4² = 24.', { numeric: true }),
        mc('"From rest" tells you that…', ['vi = 0', 'vf = 0', 'a = 0', 'Δx = 0'], 'The initial velocity is zero.'),
        mc('A car slows down while moving in the positive direction. Its acceleration is…', ['negative', 'positive', 'zero', 'equal to its velocity'], 'It acts opposite to the motion.'),
        mc('You know vi, a and Δx and want vf. Which equation?', ['vf² = vi² + 2aΔx', 'vf = vi + aΔt', 'Δx = viΔt + ½aΔt²', 'F = ma'], 'It is the one without time.'),
      ],
    ),
    lesson(
      'ps-circuits',
      'Electric circuits',
      ["Ohm's law: V = I × R (volts = amps × ohms).", 'Series: the current is the same everywhere, and resistances add: R = R1 + R2.', 'Parallel: the voltage is the same across each branch, and 1/R = 1/R1 + 1/R2.', 'An ammeter is connected in series; a voltmeter in parallel.'],
      [
        inp('A 12 V battery is connected to a 4 Ω resistor. What is the current in amps?', ['3'], 'I = V ÷ R = 12 ÷ 4.', { numeric: true }),
        inp('Resistors of 3 Ω and 5 Ω are in series. What is the total resistance in ohms?', ['8'], 'Series resistances add.', { numeric: true }),
        mc('Two 6 Ω resistors are in parallel. What is the total resistance?', ['3 Ω', '12 Ω', '6 Ω', '36 Ω'], '1/R = 1/6 + 1/6 = 2/6, so R = 3 Ω.'),
        mc('How is a voltmeter connected?', ['In parallel with the component', 'In series with the component', 'Instead of the battery', 'It does not matter'], 'It measures the potential difference across a component.'),
        mc('Adding more resistors in parallel makes the total resistance…', ['smaller', 'bigger', 'stay the same', 'zero'], 'More paths for the current means less total resistance.'),
      ],
    ),
  ]),
  unit('ps-chem', 'Chemistry', 'Atoms, the periodic table and the mole', [
    lesson(
      'ps-atoms',
      'Atoms and the periodic table',
      ['An atom has protons (+) and neutrons (0) in the nucleus, and electrons (−) around it.', 'Atomic number = number of protons. Mass number = protons + neutrons.', 'Groups are the columns: elements in a group have the same number of outer (valence) electrons.', 'Metals are on the left, non-metals on the right. Group 18 are the noble gases.'],
      [
        mc('Sodium has atomic number 11 and mass number 23. How many neutrons?', ['12', '11', '23', '34'], '23 − 11 = 12.'),
        mc('What does the atomic number tell you?', ['The number of protons', 'The number of neutrons', 'The mass of the atom', 'The number of shells'], 'In a neutral atom it is also the number of electrons.'),
        pair('Match the particle to its charge', [['Proton', 'positive'], ['Electron', 'negative'], ['Neutron', 'no charge']], 'Protons +, electrons −, neutrons neutral.'),
        mc('Elements in the same group have the same…', ['number of valence electrons', 'mass number', 'number of neutrons', 'number of shells'], 'That is why they react in similar ways.'),
        mc('Which of these is a noble gas?', ['Neon', 'Sodium', 'Chlorine', 'Oxygen'], 'Neon is in group 18.'),
      ],
    ),
    lesson(
      'ps-mole',
      'The mole and balancing equations',
      ['A balanced equation has the same number of each type of atom on both sides.', 'Change only the coefficients (the big numbers in front), never the subscripts.', 'One mole is 6.02 × 10²³ particles. Molar mass (M) is the mass of one mole in g/mol.', 'n = m ÷ M (moles = mass ÷ molar mass).'],
      [
        mc('Balance: _H₂ + O₂ → _H₂O', ['2H₂ + O₂ → 2H₂O', 'H₂ + O₂ → H₂O', 'H₂ + 2O₂ → 2H₂O', '2H₂ + 2O₂ → 2H₂O'], '4 H and 2 O on each side.'),
        inp('What is the molar mass of H₂O in g/mol? (H = 1, O = 16)', ['18'], '2 × 1 + 16 = 18.', { numeric: true }),
        inp('How many moles are in 36 g of water? (M = 18 g/mol)', ['2'], 'n = m ÷ M = 36 ÷ 18.', { numeric: true }),
        mc('When balancing an equation you may change…', ['only the coefficients', 'only the subscripts', 'both', 'neither'], 'Changing a subscript changes the substance itself.'),
        inp('What is the molar mass of CO₂ in g/mol? (C = 12, O = 16)', ['44'], '12 + 2 × 16 = 44.', { numeric: true }),
      ],
      { example: ['N₂ + H₂ → NH₃', 'N₂ + 3H₂ → 2NH₃', 'Check: 2 N and 6 H on each side'] },
    ),
  ]),
])

export const LIFESCI = schoolCourse('lifesci', 'Life Sciences', 'Learn the terms exactly, label diagrams, and always link structure to function.', [
  unit('ls-cells', 'Cells and molecules', 'Cells, division and DNA', [
    lesson(
      'ls-cell',
      'The cell',
      ['The cell is the basic unit of life. The nucleus holds the DNA and controls the cell.', 'Mitochondria release energy by cellular respiration. Ribosomes make proteins.', 'Plant cells also have a cell wall (cellulose), chloroplasts and a large vacuole.', 'The cell membrane is selectively permeable: it controls what enters and leaves.'],
      [
        pair('Match the organelle to its job', [['Nucleus', 'controls the cell'], ['Mitochondrion', 'releases energy'], ['Ribosome', 'makes proteins'], ['Chloroplast', 'photosynthesis']], 'Structure and function go together.'),
        mc('Which is found in plant cells but NOT in animal cells?', ['Cell wall', 'Cell membrane', 'Nucleus', 'Mitochondria'], 'Animal cells have no cell wall or chloroplasts.'),
        mc('"Selectively permeable" means the membrane…', ['lets only some substances through', 'lets everything through', 'lets nothing through', 'is made of cellulose'], 'It controls movement in and out of the cell.'),
        mc('Water moving across a membrane from a high to a low water concentration is called…', ['osmosis', 'respiration', 'transpiration', 'mitosis'], 'Osmosis is the diffusion of water across a selectively permeable membrane.'),
        mc('Where does cellular respiration mainly take place?', ['Mitochondria', 'Nucleus', 'Ribosomes', 'Cell wall'], 'Mitochondria are the site of aerobic respiration.'),
      ],
    ),
    lesson(
      'ls-division',
      'Mitosis and meiosis',
      ['Mitosis makes 2 identical daughter cells with the same chromosome number. It is for growth and repair.', 'Meiosis makes 4 different cells with half the chromosome number (haploid). It makes gametes.', 'Phases of mitosis in order: prophase, metaphase, anaphase, telophase.', 'Crossing over in meiosis mixes genes, which causes variation.'],
      [
        seq('Put the phases of mitosis in order', ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'], 'Remember PMAT.'),
        mc('How many cells does meiosis produce from one cell?', ['4', '2', '1', '8'], 'Two divisions give four haploid cells.'),
        mc('A human body cell has 46 chromosomes. How many are in a sperm cell?', ['23', '46', '92', '12'], 'Gametes are haploid: half the number.'),
        mc('What is mitosis used for?', ['Growth and repair', 'Making gametes', 'Creating variation', 'Halving the chromosome number'], 'Mitosis makes identical body cells.'),
        mc('During which phase do the chromosomes line up at the equator of the cell?', ['Metaphase', 'Prophase', 'Anaphase', 'Telophase'], 'M for middle.'),
      ],
    ),
    lesson(
      'ls-dna',
      'DNA and protein synthesis',
      ['DNA is a double helix made of nucleotides. Bases pair A with T, and C with G.', 'RNA is single-stranded and has uracil (U) instead of thymine (T).', 'Transcription: DNA is copied into mRNA in the nucleus.', 'Translation: at the ribosome, tRNA brings amino acids to match the mRNA codons and builds a protein.'],
      [
        mc('In DNA, adenine (A) pairs with…', ['thymine (T)', 'guanine (G)', 'cytosine (C)', 'uracil (U)'], 'A–T and C–G.'),
        inp('A DNA strand reads ATG C. Write the complementary DNA strand (4 letters)', ['TACG', 'TAC G', 'tacg'], 'A↔T and C↔G.'),
        mc('Where does transcription take place?', ['In the nucleus', 'At the ribosome', 'In the mitochondria', 'In the cell membrane'], 'The DNA stays in the nucleus; mRNA carries the code out.'),
        mc('Which base is found in RNA but not in DNA?', ['Uracil', 'Thymine', 'Adenine', 'Guanine'], 'RNA uses U instead of T.'),
        seq('Put protein synthesis in order', ['DNA unwinds', 'mRNA is made (transcription)', 'mRNA moves to a ribosome', 'tRNA brings amino acids (translation)'], 'Transcription first, then translation.'),
      ],
    ),
  ]),
  unit('ls-life', 'Inheritance and energy', 'Genetics, energy and evolution', [
    lesson(
      'ls-genetics',
      'Genetics',
      ['A gene has different forms called alleles. Dominant alleles (T) mask recessive ones (t).', 'Genotype is the alleles (TT, Tt, tt). Phenotype is what you see (tall, short).', 'Homozygous = two of the same allele. Heterozygous = two different alleles.', 'A Punnett square shows the possible offspring of a cross.'],
      [
        mc('Tall (T) is dominant over short (t). What is the phenotype of Tt?', ['Tall', 'Short', 'Medium', 'Cannot tell'], 'One dominant allele is enough.'),
        mc('Cross Tt × Tt. What fraction of the offspring are expected to be short?', ['1/4', '1/2', '3/4', 'None'], 'TT, Tt, Tt, tt: one in four is tt.'),
        mc('Which genotype is heterozygous?', ['Tt', 'TT', 'tt', 'None of them'], 'Hetero means different alleles.'),
        pair('Match the term to its meaning', [['Genotype', 'the alleles an organism has'], ['Phenotype', 'the visible trait'], ['Allele', 'a form of a gene']], 'Genotype causes phenotype.'),
        mc('Cross TT × tt. What are all the offspring?', ['Tt (all tall)', 'TT (all tall)', 'tt (all short)', 'Half tall, half short'], 'Each offspring gets T from one parent and t from the other.'),
      ],
    ),
    lesson(
      'ls-energy',
      'Photosynthesis and respiration',
      ['Photosynthesis: carbon dioxide + water → glucose + oxygen, using light energy and chlorophyll.', 'It happens in the chloroplasts and stores energy in glucose.', 'Cellular respiration: glucose + oxygen → carbon dioxide + water + energy (ATP).', 'Anaerobic respiration happens without oxygen and releases much less energy.'],
      [
        mc('Which gas do plants take in for photosynthesis?', ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], 'CO₂ is a raw material; oxygen is released.'),
        mc('What are the products of photosynthesis?', ['Glucose and oxygen', 'Carbon dioxide and water', 'Glucose and carbon dioxide', 'Water and oxygen'], 'Light energy is stored in glucose.'),
        mc('What is the purpose of cellular respiration?', ['To release energy from glucose', 'To make glucose', 'To absorb light', 'To make oxygen'], 'The energy is released as ATP.'),
        mc('In human muscles, anaerobic respiration produces…', ['lactic acid', 'alcohol', 'oxygen', 'glucose'], 'Lactic acid builds up during hard exercise.'),
        mc('Where does photosynthesis take place?', ['Chloroplasts', 'Mitochondria', 'Nucleus', 'Ribosomes'], 'Chloroplasts contain chlorophyll.'),
      ],
    ),
    lesson(
      'ls-evolution',
      'Evolution by natural selection',
      ['Individuals in a population show variation.', 'More offspring are produced than can survive, so there is competition.', 'Individuals with favourable characteristics survive and reproduce, passing those characteristics on.', 'Over many generations the favourable characteristic becomes more common. This is natural selection (Darwin).'],
      [
        seq("Put Darwin's explanation in order", ['There is variation in the population', 'There is competition to survive', 'Those with favourable traits survive and reproduce', 'The favourable trait becomes more common'], 'Variation, competition, survival, inheritance.'),
        mc('Natural selection acts on…', ['variation that already exists', 'traits an organism wants', 'traits gained during life', 'only the strongest animals'], 'It selects from existing inherited variation.'),
        mc('Who proposed evolution by natural selection?', ['Charles Darwin', 'Gregor Mendel', 'Louis Pasteur', 'Robert Hooke'], 'Mendel worked on inheritance, Darwin on natural selection.'),
        mc('Bacteria becoming resistant to antibiotics is an example of…', ['natural selection', 'photosynthesis', 'mitosis', 'osmosis'], 'Resistant bacteria survive, reproduce and become common.'),
        mc('Fossils support evolution because they…', ['show how organisms changed over time', 'are all the same age', 'show that species never change', 'are only found in Africa'], 'The fossil record shows change and transitional forms.'),
      ],
    ),
  ]),
])
