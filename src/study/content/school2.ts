import { inp, lesson, mc, pair, schoolCourse, unit } from './build'

export const GEOGRAPHY = schoolCourse('geography', 'Geography', 'Physical and human geography plus mapwork. Use the correct terms and refer to the source in every answer.', [
  unit('geo-physical', 'Mapwork and physical geography', 'Maps, weather and rivers', [
    lesson(
      'geo-maps',
      'Map skills',
      ['South African topographic maps use a scale of 1 : 50 000. 1 cm on the map = 0.5 km on the ground.', 'Orthophoto maps use 1 : 10 000. 1 cm = 0.1 km (100 m).', 'Distance on the ground = map distance × scale.', 'Contour lines join places of equal height. Lines close together mean a steep slope.'],
      [
        inp('On a 1 : 50 000 map two towns are 6 cm apart. How far apart are they in km?', ['3'], '6 × 0.5 km = 3 km.', { numeric: true }),
        mc('Contour lines that are very close together show…', ['a steep slope', 'a gentle slope', 'flat land', 'a river'], 'The height changes quickly over a short distance.'),
        mc('Which map shows a smaller area in more detail?', ['1 : 10 000 orthophoto', '1 : 50 000 topographic', 'They show the same', '1 : 250 000'], 'A larger scale (1 : 10 000) shows more detail.'),
        mc('Which direction is halfway between north and east?', ['North-east', 'South-east', 'North-west', 'South-west'], 'NE lies at 45°.'),
        mc('What does a contour interval of 20 m mean?', ['Each contour line is 20 m higher or lower than the next', 'The map is 20 m wide', 'Lines are 20 m apart on the ground', 'The scale is 1 : 20'], 'It is the height difference between neighbouring lines.'),
      ],
    ),
    lesson(
      'geo-weather',
      'Cyclones and weather',
      ['A mid-latitude cyclone moves west to east and brings cold fronts to the Western Cape in winter.', 'When a cold front passes: temperature drops, pressure rises, and wind backs from north-west to south-west.', 'Tropical cyclones form over warm oceans (above about 26.5 °C) and have a calm eye in the centre.', 'In the Southern Hemisphere air circulates clockwise around a low pressure.'],
      [
        mc('In which season do cold fronts bring most rain to Cape Town?', ['Winter', 'Summer', 'Spring', 'All year equally'], 'The Western Cape has winter rainfall from mid-latitude cyclones.'),
        mc('What happens to temperature when a cold front passes?', ['It drops', 'It rises', 'It stays the same', 'It doubles'], 'Cold air replaces warm air.'),
        mc('What is the calm centre of a tropical cyclone called?', ['The eye', 'The front', 'The ridge', 'The trough'], 'The eye has clear skies and light winds.'),
        mc('Tropical cyclones get their energy from…', ['warm ocean water', 'cold fronts', 'mountains', 'deserts'], 'They weaken over land or cold water.'),
        mc('In the Southern Hemisphere, air moves around a low pressure…', ['clockwise', 'anticlockwise', 'straight outward', 'straight upward only'], 'Clockwise and inward around a low.'),
      ],
    ),
    lesson(
      'geo-rivers',
      'Drainage basins and rivers',
      ['A drainage basin is the area drained by a river and its tributaries. A watershed separates two basins.', 'A confluence is where two rivers meet. The source is where a river starts; the mouth is where it ends.', 'Upper course: steep, erosion, V-shaped valleys, waterfalls. Lower course: flat, deposition, meanders, floodplains.', 'Drainage density is the total length of streams divided by the area of the basin.'],
      [
        pair('Match the term to its meaning', [['Source', 'where a river starts'], ['Mouth', 'where a river ends'], ['Confluence', 'where two rivers meet'], ['Watershed', 'high ground between two basins']], 'Learn these four exactly.'),
        mc('Which feature is typical of the upper course of a river?', ['Waterfall', 'Delta', 'Floodplain', 'Oxbow lake'], 'The upper course is steep and erosion dominates.'),
        mc('A bend in a river is called a…', ['meander', 'tributary', 'watershed', 'levee'], 'Meanders form in the middle and lower course.'),
        mc('In the lower course, a river mostly…', ['deposits material', 'erodes downward', 'forms waterfalls', 'flows fastest downhill'], 'The gradient is gentle, so the river drops its load.'),
        mc('A smaller river that flows into a bigger one is a…', ['tributary', 'distributary', 'delta', 'source'], 'Tributaries add water to the main river.'),
      ],
    ),
  ]),
  unit('geo-human', 'Human geography', 'Settlements, the economy and climate change', [
    lesson(
      'geo-settlement',
      'Settlements',
      ['Rural settlements are small and mostly unifunctional (farming). Urban settlements are large and multifunctional.', 'Urbanisation is the growing percentage of people living in urban areas.', 'Push factors drive people out of rural areas (few jobs, drought). Pull factors attract them to cities (jobs, services).', 'The CBD is the commercial centre with the highest land values and tallest buildings.'],
      [
        mc('Which is a push factor from a rural area?', ['Lack of jobs', 'Better schools in the city', 'City hospitals', 'Higher city wages'], 'Push factors are problems in the place people leave.'),
        mc('Urbanisation means…', ['a growing percentage of people living in cities', 'cities becoming smaller', 'people moving to farms', 'the building of roads'], 'It is about the proportion of the population that is urban.'),
        mc('Where are land values highest in a city?', ['The CBD', 'The rural-urban fringe', 'Informal settlements', 'Industrial areas'], 'Accessibility makes CBD land the most expensive.'),
        mc('A town with one main function, such as mining, is…', ['unifunctional', 'multifunctional', 'a metropolis', 'a conurbation'], 'One dominant function.'),
        mc('Which is a common problem caused by rapid urbanisation?', ['Informal settlements and traffic congestion', 'Too few people in cities', 'Too many farms', 'Falling land values in the CBD'], 'Housing and transport cannot keep up.'),
      ],
    ),
    lesson(
      'geo-economy',
      'Economic geography of South Africa',
      ['Primary sector: taking raw materials from nature (farming, mining, fishing, forestry).', 'Secondary sector: making products (factories, construction). Tertiary sector: services (shops, banks, teaching, tourism).', 'Gauteng (the PWV region) is the largest industrial region in South Africa.', 'The tertiary sector contributes the most to South Africa’s GDP.'],
      [
        pair('Match the job to its sector', [['Gold miner', 'primary'], ['Car factory worker', 'secondary'], ['Nurse', 'tertiary']], 'Extract, make, serve.'),
        mc('Which sector contributes most to South Africa’s GDP?', ['Tertiary', 'Primary', 'Secondary', 'They are equal'], 'Services dominate the economy.'),
        mc('Which is South Africa’s largest industrial region?', ['Gauteng (PWV)', 'Durban-Pinetown', 'Port Elizabeth-Uitenhage', 'South-western Cape'], 'It grew around gold mining on the Witwatersrand.'),
        mc('Turning raw materials into more valuable products is called…', ['beneficiation', 'urbanisation', 'deposition', 'subsistence'], 'Adding value before export earns more.'),
        mc('Farming mainly to feed your own family is…', ['subsistence farming', 'commercial farming', 'beneficiation', 'tertiary activity'], 'Commercial farming sells for profit.'),
      ],
    ),
    lesson(
      'geo-climate',
      'Climate change',
      ['Greenhouse gases (carbon dioxide, methane) trap heat in the atmosphere.', 'Burning fossil fuels (coal, oil, gas) and deforestation add greenhouse gases and strengthen the greenhouse effect.', 'Effects include rising sea levels, more extreme weather, droughts and floods.', 'Responses: renewable energy (solar, wind), saving energy, planting trees, and adapting farming.'],
      [
        mc('Which is a greenhouse gas?', ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Argon'], 'CO₂ and methane trap heat.'),
        mc('Most of South Africa’s electricity comes from burning…', ['coal', 'gas', 'wood', 'uranium'], 'Coal power stations are a major source of CO₂.'),
        mc('Which is a renewable energy source?', ['Solar', 'Coal', 'Oil', 'Natural gas'], 'Solar and wind do not run out.'),
        mc('How does deforestation affect climate change?', ['Fewer trees absorb less carbon dioxide', 'It cools the Earth', 'It removes methane', 'It has no effect'], 'Trees store carbon.'),
        mc('Which is an expected effect of global warming?', ['Rising sea levels', 'More ice at the poles', 'Fewer droughts', 'Lower sea levels'], 'Melting ice and warmer water raise sea levels.'),
      ],
    ),
  ]),
])

export const HISTORY = schoolCourse('history', 'History', 'History marks come from using sources and building an argument. Always say what the source shows and why it matters.', [
  unit('hist-skills', 'Skills and the wider world', 'Sources, the Cold War and civil rights', [
    lesson(
      'hist-sources',
      'Working with sources',
      ['A primary source comes from the time of the event (a diary, photograph, speech, law).', 'A secondary source is written later about the event (a textbook, documentary).', 'Bias is a one-sided view. Ask: who made it, when, why, and for whom?', 'A source can be useful even when it is biased, because it shows what people thought at the time.'],
      [
        mc('Which is a primary source about the Soweto Uprising?', ['A photograph taken on 16 June 1976', 'A 2010 school textbook', 'A modern documentary', 'A Wikipedia article'], 'It was made at the time of the event.'),
        mc('A biased source is…', ['one-sided', 'always false', 'always useless', 'written later'], 'Bias means it favours one point of view.'),
        mc('Which question tests the reliability of a source?', ['Who created it and why?', 'How long is it?', 'Is it in colour?', 'Is it easy to read?'], 'Origin and purpose affect reliability.'),
        mc('A government propaganda poster is useful to a historian because it…', ['shows what the government wanted people to believe', 'is always accurate', 'is a secondary source', 'has no bias'], 'Biased sources still reveal attitudes and aims.'),
        pair('Match the source to its type', [['A diary from 1960', 'primary'], ['A history textbook', 'secondary'], ['A speech recording', 'primary']], 'Primary = from the time.'),
      ],
    ),
    lesson(
      'hist-coldwar',
      'The Cold War',
      ['After 1945 the USA (capitalist) and the USSR (communist) became rival superpowers.', 'It was "cold" because they never fought each other directly, but competed through an arms race and proxy wars.', 'The Truman Doctrine (1947) promised to contain communism. The Marshall Plan gave aid to rebuild Western Europe.', 'The Berlin Wall (1961 to 1989) became the symbol of a divided Europe.'],
      [
        mc('Why was it called a "cold" war?', ['The superpowers never fought each other directly', 'It was fought in winter', 'No weapons were made', 'It lasted one year'], 'They competed through proxy wars and an arms race.'),
        mc('The policy of stopping the spread of communism was called…', ['containment', 'apartheid', 'détente', 'glasnost'], 'It was set out in the Truman Doctrine.'),
        mc('What was the Marshall Plan?', ['American aid to rebuild Western Europe', 'A Soviet military alliance', 'A plan to build the Berlin Wall', 'A nuclear treaty'], 'Aid was meant to stop poverty that could lead to communism.'),
        inp('In which year did the Berlin Wall fall?', ['1989'], 'It was built in 1961 and fell in November 1989.', { numeric: true }),
        pair('Match the superpower to its system', [['USA', 'capitalism'], ['USSR', 'communism']], 'Two opposing ideologies.'),
      ],
    ),
    lesson(
      'hist-civilrights',
      'The Civil Rights Movement in the USA',
      ['In the southern USA, segregation laws ("Jim Crow") separated black and white Americans.', 'The Montgomery Bus Boycott (1955 to 1956) began after Rosa Parks refused to give up her seat.', 'Martin Luther King Jr led non-violent protest and gave the "I have a dream" speech at the March on Washington (1963).', 'The Civil Rights Act (1964) outlawed segregation; the Voting Rights Act (1965) protected the right to vote.'],
      [
        mc('What started the Montgomery Bus Boycott?', ['Rosa Parks refused to give up her seat', 'The March on Washington', 'The Civil Rights Act', 'A school closing'], 'Her arrest in 1955 sparked the boycott.'),
        mc('Which method did Martin Luther King Jr promote?', ['Non-violent protest', 'Armed struggle', 'Leaving the country', 'Silence'], 'Marches, boycotts and sit-ins.'),
        inp('In which year was the Civil Rights Act passed?', ['1964'], 'It outlawed segregation in public places.', { numeric: true }),
        mc('What did the Voting Rights Act of 1965 do?', ['Protected the right of black Americans to vote', 'Ended the Cold War', 'Started segregation', 'Banned protests'], 'It removed barriers such as literacy tests.'),
        mc('Laws that enforced racial segregation in the southern USA were known as…', ['Jim Crow laws', 'Pass laws', 'The Marshall Plan', 'The New Deal'], 'They kept public facilities separate.'),
      ],
    ),
  ]),
  unit('hist-sa', 'South Africa', 'Apartheid, resistance and democracy', [
    lesson(
      'hist-apartheid',
      'Apartheid and early resistance',
      ['The National Party came to power in 1948 and made apartheid law.', 'Key laws: the Population Registration Act and Group Areas Act (1950), and the Bantu Education Act (1953).', 'The Freedom Charter was adopted at Kliptown in 1955.', 'At Sharpeville on 21 March 1960, police shot protesters against the pass laws. The ANC and PAC were then banned.'],
      [
        inp('In which year did the National Party come to power?', ['1948'], 'Apartheid became official policy.', { numeric: true }),
        mc('What did the Group Areas Act do?', ['Forced people to live in areas set aside for their race', 'Gave everyone the vote', 'Ended the pass laws', 'Created one education system'], 'It led to forced removals.'),
        mc('What happened at Sharpeville on 21 March 1960?', ['Police shot people protesting against the pass laws', 'The Freedom Charter was signed', 'Mandela was released', 'The first democratic election'], '69 people were killed. 21 March is now Human Rights Day.'),
        mc('Where was the Freedom Charter adopted in 1955?', ['Kliptown', 'Sharpeville', 'Rivonia', 'Robben Island'], 'At the Congress of the People.'),
        mc('What was the aim of the Bantu Education Act?', ['To give black learners an inferior education', 'To make schooling equal', 'To close all schools', 'To teach in all languages'], 'It prepared black South Africans only for low-paid work.'),
      ],
    ),
    lesson(
      'hist-bc',
      'Black Consciousness and 1976',
      ['Steve Biko led the Black Consciousness Movement, which taught black pride and self-reliance.', 'SASO (the South African Students’ Organisation) was formed in 1968.', 'On 16 June 1976, Soweto students protested against Afrikaans as a language of teaching. Police opened fire.', 'Biko died in police detention in September 1977. Resistance and international pressure grew.'],
      [
        mc('Who was the leading figure of the Black Consciousness Movement?', ['Steve Biko', 'F. W. de Klerk', 'Hendrik Verwoerd', 'Desmond Tutu'], 'Biko wrote "I Write What I Like".'),
        mc('What did the Soweto students protest against on 16 June 1976?', ['Being taught in Afrikaans', 'The pass laws', 'The Group Areas Act', 'School fees'], 'Afrikaans was imposed as a medium of instruction.'),
        mc('What did Black Consciousness encourage?', ['Pride and self-reliance among black people', 'Working inside apartheid structures', 'Leaving South Africa', 'Accepting segregation'], '"Black man, you are on your own."'),
        inp('In which year did Steve Biko die in detention?', ['1977'], 'His death caused outrage around the world.', { numeric: true }),
        mc('16 June is now remembered in South Africa as…', ['Youth Day', 'Freedom Day', 'Heritage Day', 'Human Rights Day'], 'It honours the students of 1976.'),
      ],
    ),
    lesson(
      'hist-democracy',
      'The road to democracy',
      ['On 2 February 1990, F. W. de Klerk unbanned the ANC, PAC and SACP. Nelson Mandela was released on 11 February 1990.', 'Negotiations took place at CODESA from 1991, with setbacks such as the Boipatong massacre.', 'The first democratic election was held on 27 April 1994. Mandela became president.', 'The Truth and Reconciliation Commission (TRC), chaired by Desmond Tutu, heard testimony and could grant amnesty for full disclosure.'],
      [
        inp('In which year was Nelson Mandela released from prison?', ['1990'], '11 February 1990.', { numeric: true }),
        mc('What was CODESA?', ['The negotiations for a democratic South Africa', 'A political party', 'An apartheid law', 'A trade union'], 'The Convention for a Democratic South Africa.'),
        mc('27 April 1994 is remembered as…', ['Freedom Day', 'Youth Day', 'Workers’ Day', 'Heritage Day'], 'The first election in which all South Africans could vote.'),
        mc('Who chaired the Truth and Reconciliation Commission?', ['Desmond Tutu', 'Nelson Mandela', 'Thabo Mbeki', 'F. W. de Klerk'], 'Archbishop Tutu chaired the TRC.'),
        mc('The TRC could grant amnesty to people who…', ['fully told the truth about politically motivated crimes', 'paid a fine', 'left the country', 'refused to testify'], 'Amnesty in exchange for full disclosure.'),
      ],
    ),
  ]),
])

export const ACCOUNTING = schoolCourse('accounting', 'Accounting', 'Accuracy and layout earn marks. Learn the formats and always check that things balance.', [
  unit('acc-basics', 'Foundations', 'The equation, double entry and VAT', [
    lesson(
      'acc-equation',
      'The accounting equation',
      ['Assets = Owner’s equity + Liabilities (A = OE + L).', 'Assets are what the business owns. Liabilities are what it owes. Owner’s equity is the owner’s share.', 'Every transaction keeps the equation in balance.', 'Income increases owner’s equity; expenses and drawings decrease it.'],
      [
        inp('Assets are R80 000 and liabilities are R30 000. What is owner’s equity? (number only)', ['50000', '50 000', 'R50000', 'R50 000'], 'OE = A − L = 80 000 − 30 000.', { numeric: true }),
        mc('The business buys equipment for cash. What happens?', ['One asset increases and another decreases', 'Assets and liabilities both increase', 'Owner’s equity decreases', 'Liabilities decrease'], 'Equipment goes up, bank goes down. Total assets stay the same.'),
        mc('Which of these is a liability?', ['Loan from the bank', 'Vehicles', 'Trading stock', 'Debtors'], 'A loan is money the business owes.'),
        mc('How do expenses affect owner’s equity?', ['They decrease it', 'They increase it', 'No effect', 'They increase liabilities only'], 'Expenses reduce profit, and profit belongs to the owner.'),
        mc('The owner takes R500 cash for personal use. This is called…', ['drawings', 'income', 'a liability', 'capital'], 'Drawings reduce both the bank and owner’s equity.'),
      ],
    ),
    lesson(
      'acc-double',
      'Debits and credits',
      ['Every transaction has a debit and an equal credit (double entry).', 'Assets and expenses increase on the debit side.', 'Liabilities, owner’s equity and income increase on the credit side.', 'The trial balance lists all balances. Total debits must equal total credits.'],
      [
        mc('Rent is paid by EFT. Which account is debited?', ['Rent expense', 'Bank', 'Capital', 'Rent income'], 'Expenses increase on the debit side. Bank is credited.'),
        pair('Match the account to the side on which it increases', [['Assets', 'debit'], ['Expenses', 'debit'], ['Income', 'credit'], ['Liabilities', 'credit']], 'Assets and expenses: debit. The rest: credit.'),
        mc('Goods are sold for cash. Which account is credited?', ['Sales', 'Bank', 'Debtors', 'Trading stock only'], 'Sales is income, so it increases on the credit side.'),
        mc('What does a trial balance check?', ['That total debits equal total credits', 'That the business made a profit', 'That all debtors have paid', 'That stock was counted'], 'It tests the arithmetic of the ledger.'),
        mc('The owner puts R10 000 of her own money into the business. Which account is credited?', ['Capital', 'Bank', 'Drawings', 'Sales'], 'Bank is debited; capital (owner’s equity) is credited.'),
      ],
    ),
    lesson(
      'acc-vat',
      'VAT',
      ['VAT is charged at 15% on most goods and services.', 'Output VAT is what a business charges customers. Input VAT is what it pays suppliers.', 'VAT owed to SARS = output VAT − input VAT.', 'VAT amount in an inclusive price = price × 15 ÷ 115.'],
      [
        inp('How much VAT is added to an item that costs R200 before VAT? (number only)', ['30', 'R30'], '200 × 15% = 30.', { numeric: true }),
        inp('Output VAT is R900 and input VAT is R600. How much is owed to SARS? (number only)', ['300', 'R300'], '900 − 600 = 300.', { numeric: true }),
        mc('VAT a business pays to its suppliers is called…', ['input VAT', 'output VAT', 'income tax', 'PAYE'], 'Input = on purchases. Output = on sales.'),
        mc('An item costs R230 including VAT. How much of that is VAT?', ['R30', 'R34.50', 'R15', 'R23'], '230 × 15 ÷ 115 = 30.'),
        mc('Who does a business pay its VAT to?', ['SARS', 'The supplier’s bank', 'The customers', 'The municipality'], 'The South African Revenue Service collects VAT.'),
      ],
    ),
  ]),
  unit('acc-statements', 'Financial statements', 'Reporting and interpreting results', [
    lesson(
      'acc-income',
      'The income statement',
      ['The income statement shows income and expenses for a period, and the profit or loss.', 'Gross profit = sales − cost of sales.', 'Net profit = gross profit + other income − operating expenses (and interest).', 'It covers a period of time, such as a financial year.'],
      [
        inp('Sales are R100 000 and cost of sales is R60 000. What is the gross profit? (number only)', ['40000', '40 000', 'R40000', 'R40 000'], '100 000 − 60 000.', { numeric: true }),
        inp('Gross profit is R40 000 and operating expenses are R25 000. What is the net profit? (number only)', ['15000', '15 000', 'R15000', 'R15 000'], '40 000 − 25 000.', { numeric: true }),
        mc('Which item appears on the income statement?', ['Salaries and wages', 'Vehicles', 'Capital', 'Creditors'], 'Salaries are an expense. The others belong on the balance sheet.'),
        mc('If expenses are greater than income, the business has made a…', ['net loss', 'net profit', 'gross profit', 'dividend'], 'A loss reduces owner’s equity.'),
        mc('Cost of sales is…', ['what the goods that were sold cost the business', 'the selling price', 'all the expenses', 'the profit'], 'Sales minus cost of sales gives gross profit.'),
      ],
    ),
    lesson(
      'acc-balance',
      'The balance sheet',
      ['The balance sheet (statement of financial position) shows assets, equity and liabilities on one date.', 'Non-current assets are kept for more than a year (land, vehicles, equipment).', 'Current assets become cash within a year (inventory, debtors, cash).', 'Current liabilities must be paid within a year (creditors, bank overdraft).'],
      [
        pair('Match the item to its group', [['Vehicles', 'non-current asset'], ['Trading stock', 'current asset'], ['Creditors', 'current liability'], ['Mortgage loan', 'non-current liability']], 'Ask: within a year, or longer?'),
        mc('The balance sheet shows the financial position…', ['on one specific date', 'over a whole year', 'for one month only', 'in the future'], 'It is a snapshot.'),
        mc('Which of these is a current asset?', ['Debtors', 'Land and buildings', 'Equipment', 'Capital'], 'Debtors are expected to pay within a year.'),
        mc('A bank overdraft is a…', ['current liability', 'current asset', 'non-current asset', 'form of income'], 'It is money owed to the bank in the short term.'),
        mc('Total assets must equal…', ['equity plus liabilities', 'income minus expenses', 'sales minus cost of sales', 'current assets only'], 'The accounting equation: A = OE + L.'),
      ],
    ),
    lesson(
      'acc-ratios',
      'Analysing with ratios',
      ['Current ratio = current assets : current liabilities. It shows if short-term debts can be paid (about 2 : 1 is healthy).', 'Acid-test ratio = (current assets − inventory) : current liabilities.', 'Gross profit on sales = gross profit ÷ sales × 100.', 'Always comment: say if the ratio improved or got worse, and what that means.'],
      [
        mc('Current assets are R60 000 and current liabilities are R30 000. What is the current ratio?', ['2 : 1', '1 : 2', '3 : 1', '0.5 : 1'], '60 000 ÷ 30 000 = 2.'),
        mc('What does the current ratio measure?', ['Liquidity: the ability to pay short-term debts', 'Profitability', 'How much stock was sold', 'The owner’s salary'], 'Liquidity ratios look at the short term.'),
        inp('Gross profit is R20 000 and sales are R80 000. What is the gross profit percentage on sales? (number only)', ['25', '25%'], '20 000 ÷ 80 000 × 100 = 25%.', { numeric: true }),
        mc('How is the acid-test ratio different from the current ratio?', ['It leaves out inventory', 'It includes non-current assets', 'It uses profit', 'It leaves out debtors'], 'Stock can be slow to turn into cash.'),
        mc('A current ratio that falls from 2 : 1 to 0.8 : 1 means…', ['liquidity got worse', 'liquidity improved', 'profit doubled', 'nothing changed'], 'There are now fewer current assets than short-term debts.'),
      ],
    ),
  ]),
])
