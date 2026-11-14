import { inp, lesson, mc, pair, schoolCourse, seq, unit } from './build'

export const BUSINESS = schoolCourse('business', 'Business Studies', 'Learn the terms and the facts as lists, then practise applying them to a case study.', [
  unit('bs-environments', 'Environments and ownership', 'Where a business operates and how it is owned', [
    lesson(
      'bs-env',
      'The three business environments',
      ['Micro environment: inside the business (vision, management, employees). The business has full control.', 'Market environment: directly around it (customers, suppliers, competitors). The business can influence it.', 'Macro environment: the wider world (economy, laws, technology, politics). The business has no control.', 'PESTLE lists the macro factors: Political, Economic, Social, Technological, Legal, Environmental.'],
      [
        pair('Match the factor to its environment', [['Employees', 'micro'], ['Competitors', 'market'], ['Interest rates', 'macro'], ['Suppliers', 'market']], 'Inside, around, or far outside the business.'),
        mc('How much control does a business have over the macro environment?', ['None', 'Full control', 'Some influence', 'It depends on the manager'], 'It can only adapt to it.'),
        mc('Which tool is used to analyse the macro environment?', ['PESTLE', 'A payslip', 'An organogram', 'A cash budget'], 'PESTLE covers the six groups of outside factors.'),
        mc('A new competitor opens next door. Which environment is this?', ['Market', 'Micro', 'Macro', 'None'], 'Competitors are in the market environment.'),
        mc('Load shedding is a challenge from which environment?', ['Macro', 'Micro', 'Market', 'Internal'], 'The business cannot control the electricity supply.'),
      ],
    ),
    lesson(
      'bs-ownership',
      'Forms of ownership',
      ['Sole trader: one owner, easy to start, unlimited liability.', 'Partnership: two or more owners share profits and have unlimited liability.', 'Private company (Pty) Ltd: owned by shareholders with limited liability; shares are not sold to the public.', 'Public company (Ltd): can sell shares to the public on the JSE. Limited liability means owners can lose only what they invested.'],
      [
        mc('Which form of ownership has ONE owner?', ['Sole trader', 'Partnership', 'Private company', 'Public company'], 'A sole trader owns and usually runs the business alone.'),
        mc('Limited liability means…', ['owners can lose only what they invested', 'the business has few debts', 'owners must pay all business debts personally', 'the business cannot borrow'], 'Their personal belongings are protected.'),
        mc('Which business can sell shares to the public on the JSE?', ['Public company (Ltd)', 'Private company (Pty) Ltd', 'Sole trader', 'Partnership'], 'Only public companies can list.'),
        mc('What is a disadvantage of a sole trader?', ['Unlimited liability', 'Too many owners', 'Shares must be sold', 'It is hard to start'], 'The owner is personally responsible for the debts.'),
        mc('The name of a private company ends with…', ['(Pty) Ltd', 'Ltd', 'CC', 'Inc.'], 'Proprietary Limited.'),
      ],
    ),
    lesson(
      'bs-strategy',
      'SWOT and strategies',
      ['SWOT: Strengths and Weaknesses are internal; Opportunities and Threats are external.', "Porter's Five Forces look at competition: rivalry, new entrants, substitutes, and the power of buyers and suppliers.", 'Growth strategies include market penetration, market development and product development.', 'Defensive strategies include retrenchment, divestiture and liquidation.'],
      [
        pair('Match each SWOT item', [['Skilled staff', 'strength'], ['Old equipment', 'weakness'], ['A new market opening', 'opportunity'], ['A new competitor', 'threat']], 'Internal: S and W. External: O and T.'),
        mc('Which parts of SWOT are internal to the business?', ['Strengths and weaknesses', 'Opportunities and threats', 'Strengths and threats', 'All four'], 'Opportunities and threats come from outside.'),
        mc('Selling existing products in a new area is…', ['market development', 'product development', 'retrenchment', 'liquidation'], 'New market, same product.'),
        mc('Which is a defensive strategy?', ['Retrenchment', 'Market penetration', 'Product development', 'Diversification'], 'Defensive strategies cut back to survive.'),
        mc("Which is one of Porter's Five Forces?", ['Threat of new entrants', 'Interest rates', 'Staff morale', 'Exchange rates'], 'The others are rivalry, substitutes, and buyer and supplier power.'),
      ],
    ),
  ]),
  unit('bs-people', 'Law and leadership', 'Legislation, management and ethics', [
    lesson(
      'bs-laws',
      'Legislation',
      ['BCEA (Basic Conditions of Employment Act): working hours, leave and overtime.', 'LRA (Labour Relations Act): trade unions, strikes and unfair dismissal.', 'EEA (Employment Equity Act): fair treatment and affirmative action. BBBEE: broad-based black economic empowerment.', 'CPA (Consumer Protection Act) protects consumers. NCA (National Credit Act) regulates lending and prevents reckless credit.'],
      [
        pair('Match the Act to what it covers', [['BCEA', 'working hours and leave'], ['LRA', 'unions and strikes'], ['CPA', 'consumer rights'], ['NCA', 'credit and lending']], 'Learn the abbreviations.'),
        mc('Which Act deals with unfair dismissal?', ['LRA', 'CPA', 'NCA', 'BBBEE'], 'The Labour Relations Act.'),
        mc('A shop refuses to take back a faulty phone. Which Act protects the customer?', ['Consumer Protection Act', 'Labour Relations Act', 'Skills Development Act', 'Employment Equity Act'], 'The CPA gives the right to safe, good-quality goods.'),
        mc('Under the BCEA, the ordinary maximum working week is…', ['45 hours', '40 hours', '60 hours', '35 hours'], '45 ordinary hours, with overtime paid extra.'),
        mc('What is the purpose of the National Credit Act?', ['To prevent reckless lending', 'To set working hours', 'To register companies', 'To set the price of goods'], 'Lenders must check that a customer can afford the credit.'),
      ],
    ),
    lesson(
      'bs-leadership',
      'Management and leadership',
      ['Managers plan, organise, lead and control. Leaders inspire and motivate people.', 'Autocratic: the leader decides alone. Useful in a crisis.', 'Democratic: the leader involves the team in decisions. Builds commitment.', 'Laissez-faire: the leader lets the team decide. Works with skilled, motivated staff.'],
      [
        pair('Match the leadership style', [['Leader decides alone', 'autocratic'], ['Team takes part in decisions', 'democratic'], ['Team is left to decide', 'laissez-faire']], 'Three classic styles.'),
        mc('Which style suits an emergency best?', ['Autocratic', 'Democratic', 'Laissez-faire', 'None of them'], 'Quick decisions are needed.'),
        seq('Put the management tasks in order', ['Planning', 'Organising', 'Leading', 'Controlling'], 'POLC.'),
        mc('What is an advantage of the democratic style?', ['Employees feel involved and committed', 'Decisions are always fastest', 'The leader does no work', 'No meetings are needed'], 'Involvement improves morale and ideas.'),
        mc('Laissez-faire leadership works best when the staff are…', ['skilled and motivated', 'new and untrained', 'in a crisis', 'unwilling to work'], 'They can manage themselves.'),
      ],
    ),
    lesson(
      'bs-ethics',
      'Ethics and social responsibility',
      ['Ethics means doing what is right, not only what is legal.', 'Unethical conduct includes tax evasion, misleading advertising, unfair pay and abusing work time.', 'Corporate Social Responsibility (CSR): how a business takes responsibility for its effect on society and the environment.', 'Corporate Social Investment (CSI): the money and projects a business invests in communities.'],
      [
        mc('Which is an example of unethical business behaviour?', ['Misleading advertising', 'Paying tax on time', 'Fair pay', 'Recycling waste'], 'It deceives customers.'),
        mc('CSI stands for…', ['Corporate Social Investment', 'Company Sales Income', 'Consumer Safety Index', 'Corporate Staff Induction'], 'Projects that uplift communities.'),
        mc('A business sponsors a school feeding scheme. This is an example of…', ['CSI', 'tax evasion', 'retrenchment', 'market penetration'], 'It invests in the community.'),
        mc('Not declaring income so as to pay less tax is…', ['tax evasion (illegal)', 'tax avoidance (legal)', 'CSI', 'good ethics'], 'Evasion is a crime; legal planning is avoidance.'),
        mc('Why should a business act ethically?', ['It builds trust and a good reputation', 'It is never required', 'It always costs nothing', 'To avoid paying staff'], 'Trust keeps customers, staff and investors.'),
      ],
    ),
  ]),
])

export const ECONOMICS = schoolCourse('economics', 'Economics', 'Explain with the correct terms and draw clear, labelled graphs. Always say what happens to price and quantity.', [
  unit('ec-micro', 'Markets', 'Scarcity, demand, supply and market types', [
    lesson(
      'ec-scarcity',
      'Scarcity and choice',
      ['Economics studies how people use limited resources to satisfy unlimited wants.', 'Scarcity forces choices. Opportunity cost is the next best alternative you give up.', 'The four factors of production: land, labour, capital and entrepreneurship.', 'Their rewards are rent, wages, interest and profit.'],
      [
        mc('You have R50 and choose airtime instead of lunch. What is the opportunity cost?', ['The lunch', 'The airtime', 'R50', 'Nothing'], 'It is what you gave up.'),
        pair('Match the factor of production to its reward', [['Land', 'rent'], ['Labour', 'wages'], ['Capital', 'interest'], ['Entrepreneurship', 'profit']], 'Each factor earns an income.'),
        mc('The basic economic problem is…', ['scarcity', 'inflation', 'taxation', 'exports'], 'Limited resources, unlimited wants.'),
        mc('Which of these is "capital" in economics?', ['Machinery', 'A river', 'A worker', 'An idea'], 'Capital is man-made goods used to produce other goods.'),
        mc('Opportunity cost is…', ['the next best alternative given up', 'the price in rands', 'the total of all alternatives', 'the profit made'], 'Only the best one you gave up counts.'),
      ],
    ),
    lesson(
      'ec-demand',
      'Demand and supply',
      ['Law of demand: when the price rises, the quantity demanded falls (and the other way round).', 'Law of supply: when the price rises, the quantity supplied rises.', 'Equilibrium is where demand equals supply. It sets the market price and quantity.', 'A price above equilibrium causes a surplus; a price below it causes a shortage.'],
      [
        mc('The price of bread rises. According to the law of demand…', ['quantity demanded falls', 'quantity demanded rises', 'demand does not change at all', 'supply falls'], 'Price and quantity demanded move in opposite directions.'),
        mc('At a price below equilibrium there is a…', ['shortage', 'surplus', 'balance', 'monopoly'], 'More is demanded than supplied.'),
        mc('Incomes rise and people buy more takeaways. The demand curve…', ['shifts to the right', 'shifts to the left', 'does not move', 'becomes vertical'], 'Demand increases at every price.'),
        mc('What happens to the equilibrium price if supply decreases and demand stays the same?', ['It rises', 'It falls', 'It stays the same', 'It becomes zero'], 'Less is available, so the price goes up.'),
        mc('The supply curve slopes…', ['upward from left to right', 'downward from left to right', 'horizontally', 'vertically'], 'Higher prices encourage more supply.'),
      ],
    ),
    lesson(
      'ec-markets',
      'Market structures',
      ['Perfect competition: many sellers, identical products, no control over price (price takers).', 'Monopoly: one seller, no close substitutes, high barriers to entry (for example Eskom).', 'Oligopoly: a few large sellers who watch each other (banks, cellphone networks).', 'Monopolistic competition: many sellers with slightly different products (restaurants, hair salons).'],
      [
        pair('Match the example to the market structure', [['Eskom', 'monopoly'], ['Cellphone networks', 'oligopoly'], ['Hair salons', 'monopolistic competition']], 'Count the sellers and look at the product.'),
        mc('In perfect competition, firms are…', ['price takers', 'price makers', 'the only seller', 'protected by patents'], 'No single firm can change the market price.'),
        mc('What keeps other firms out of a monopoly market?', ['Barriers to entry', 'Low prices', 'Many sellers', 'Identical products'], 'High costs, licences or patents block new firms.'),
        mc('A market with a few large firms is…', ['an oligopoly', 'a monopoly', 'perfect competition', 'a duopoly only'], 'A few dominant sellers.'),
        mc('Collusion between firms to fix prices is…', ['illegal in South Africa', 'encouraged', 'a kind of perfect competition', 'the same as advertising'], 'The Competition Commission investigates it.'),
      ],
    ),
  ]),
  unit('ec-macro', 'The whole economy', 'Circular flow, inflation and policy', [
    lesson(
      'ec-flow',
      'The circular flow and GDP',
      ['Households, businesses, the state and the foreign sector take part in the circular flow.', 'Households sell factors of production and receive income; businesses sell goods and services.', 'Leakages take money out (savings, taxes, imports). Injections put it in (investment, government spending, exports).', 'GDP is the total value of final goods and services produced inside a country in a year.'],
      [
        mc('Which is a leakage from the circular flow?', ['Savings', 'Exports', 'Investment', 'Government spending'], 'Leakages: savings, taxes and imports.'),
        mc('Which is an injection?', ['Exports', 'Imports', 'Taxes', 'Savings'], 'Injections: investment, government spending and exports.'),
        mc('GDP measures…', ['the value of final goods and services produced in a country', 'the amount of money in banks', 'the number of workers', 'government debt'], 'Gross Domestic Product.'),
        mc('What do households supply to businesses?', ['Factors of production', 'Taxes', 'Exports', 'Subsidies'], 'Mainly labour, in return for income.'),
        mc('If injections are greater than leakages, the economy…', ['grows', 'shrinks', 'stays the same', 'stops'], 'More money is flowing in than out.'),
      ],
    ),
    lesson(
      'ec-inflation',
      'Inflation',
      ['Inflation is a sustained increase in the general price level. It reduces the buying power of money.', 'It is measured by the Consumer Price Index (CPI).', 'Demand-pull inflation: too much spending chases too few goods. Cost-push inflation: production costs rise.', 'The Reserve Bank aims to keep inflation low and stable.'],
      [
        mc('Inflation means…', ['a sustained rise in the general price level', 'a once-off price increase', 'falling prices', 'a rise in exports'], 'It must be general and continue over time.'),
        mc('Which index measures inflation?', ['CPI', 'GDP', 'JSE', 'VAT'], 'The Consumer Price Index tracks a basket of goods.'),
        mc('A rise in the oil price pushes up transport costs and prices. This is…', ['cost-push inflation', 'demand-pull inflation', 'deflation', 'stagflation only'], 'Higher production costs push prices up.'),
        mc('How does inflation affect a person on a fixed income?', ['They can buy less', 'They can buy more', 'No effect', 'Their income rises'], 'Buying power falls.'),
        mc('Prices that keep falling over time are called…', ['deflation', 'inflation', 'devaluation', 'depreciation'], 'The opposite of inflation.'),
      ],
    ),
    lesson(
      'ec-policy',
      'Fiscal and monetary policy',
      ['Fiscal policy: the government uses taxes and spending. The Minister of Finance presents the budget.', 'Monetary policy: the South African Reserve Bank (SARB) uses interest rates.', 'The repo rate is the rate at which the SARB lends to commercial banks.', 'A higher repo rate makes borrowing more expensive, so spending and inflation slow down.'],
      [
        mc('Who is in charge of monetary policy in South Africa?', ['The Reserve Bank (SARB)', 'The Minister of Finance', 'Parliament', 'SARS'], 'The SARB sets the repo rate.'),
        mc('What is the repo rate?', ['The rate at which the SARB lends to banks', 'The VAT rate', 'The rate of inflation', 'The exchange rate'], 'Banks pass changes on to their customers.'),
        mc('To fight inflation, the SARB will usually…', ['raise the repo rate', 'lower the repo rate', 'print more money', 'cut taxes'], 'Higher interest rates reduce borrowing and spending.'),
        mc('Which is a fiscal policy tool?', ['Taxation', 'The repo rate', 'Bank reserves', 'The exchange rate'], 'Fiscal policy is about taxes and government spending.'),
        mc('If the government cuts taxes, households have…', ['more money to spend', 'less money to spend', 'the same', 'no income'], 'Lower taxes raise disposable income.'),
      ],
    ),
  ]),
])

export const CAT = schoolCourse('cat', 'CAT', 'Computer Applications Technology: theory plus practical skills in a word processor, spreadsheet and database.', [
  unit('cat-theory', 'Theory', 'Hardware, software, networks and safety', [
    lesson(
      'cat-hardware',
      'Hardware',
      ['Hardware is the physical equipment. Input devices send data in (keyboard, mouse, scanner).', 'Output devices show results (monitor, printer, speakers).', 'The CPU processes data. RAM is temporary memory that is cleared when the power goes off.', 'Storage keeps data permanently: an SSD is faster and has no moving parts; an HDD is cheaper per gigabyte.'],
      [
        pair('Match the device to its type', [['Keyboard', 'input'], ['Printer', 'output'], ['SSD', 'storage'], ['CPU', 'processing']], 'Input, processing, output, storage.'),
        mc('What happens to data in RAM when the computer is switched off?', ['It is lost', 'It is saved', 'It moves to the CPU', 'It is printed'], 'RAM is volatile.'),
        mc('What is an advantage of an SSD over an HDD?', ['It is faster', 'It is cheaper per GB', 'It has more moving parts', 'It needs no power'], 'No moving parts makes it faster and tougher.'),
        mc('A touch screen is…', ['both an input and an output device', 'only an input device', 'only an output device', 'a storage device'], 'It shows the display and accepts touches.'),
        mc('Which part does the calculations and runs instructions?', ['CPU', 'RAM', 'Hard drive', 'Monitor'], 'The Central Processing Unit.'),
      ],
    ),
    lesson(
      'cat-software',
      'Software',
      ['System software runs the computer: the operating system (Windows, Android, Linux) and utilities.', 'Application software does tasks for the user: word processor, spreadsheet, browser.', 'Proprietary software is owned and licensed. Open-source software has code that anyone may use and change.', 'Updates fix bugs and security holes. Piracy (using software without a licence) is illegal.'],
      [
        mc('Which of these is an operating system?', ['Android', 'Microsoft Word', 'Google Chrome', 'Excel'], 'The others are applications.'),
        mc('A spreadsheet program is an example of…', ['application software', 'system software', 'hardware', 'a utility only'], 'It does a task for the user.'),
        mc('Open-source software…', ['has source code that anyone may use and change', 'is always illegal', 'can never be free', 'has no licence at all'], 'Linux and LibreOffice are examples.'),
        mc('Why should you install software updates?', ['To fix bugs and security problems', 'To slow the computer down', 'To delete your files', 'To remove the licence'], 'Updates close security holes.'),
        mc('Using software without a valid licence is called…', ['piracy', 'phishing', 'hacking', 'spamming'], 'It breaks copyright law.'),
      ],
    ),
    lesson(
      'cat-internet',
      'Networks and the internet',
      ['A LAN covers a small area such as a school. A WAN covers a large area; the internet is the largest WAN.', 'A router connects a network to the internet. Wi-Fi connects devices without cables.', 'An ISP (internet service provider) gives you access. Bandwidth is how much data can move per second.', 'A URL is a web address. HTTPS means the connection is encrypted.'],
      [
        mc('What does LAN stand for?', ['Local Area Network', 'Large Area Network', 'Long Access Node', 'Local Access Name'], 'A network in one building or site.'),
        mc('Which device connects a home network to the internet?', ['Router', 'Printer', 'Monitor', 'Scanner'], 'The router directs traffic between the networks.'),
        mc('What does the "s" in https tell you?', ['The connection is encrypted', 'The site is slow', 'The site is free', 'The site is for schools'], 'Look for it before typing passwords or card details.'),
        mc('A company that provides internet access is an…', ['ISP', 'URL', 'LAN', 'SSD'], 'Internet service provider.'),
        mc('Which is the largest WAN?', ['The internet', 'A school network', 'A home Wi-Fi network', 'Bluetooth'], 'It links networks across the world.'),
      ],
    ),
  ]),
  unit('cat-practical', 'Practical and safety', 'Spreadsheets, documents and staying safe', [
    lesson(
      'cat-spreadsheet',
      'Spreadsheet functions',
      ['A formula starts with =. A range is written with a colon, for example A1:A10.', '=SUM adds, =AVERAGE finds the mean, =MAX and =MIN find the largest and smallest.', '=COUNT counts cells with numbers; =COUNTA counts cells that are not empty.', '=IF(test, value if true, value if false). Use $ for an absolute reference, as in $B$1.'],
      [
        inp('Type the formula that adds cells A1 to A10', ['=SUM(A1:A10)', '=sum(a1:a10)'], '=SUM with a range.'),
        mc('What does =AVERAGE(B2:B6) do?', ['Finds the mean of B2 to B6', 'Adds B2 and B6', 'Counts the cells', 'Finds the largest value'], 'It adds the values and divides by how many there are.'),
        mc('Which formula shows "Pass" when C2 is 50 or more, and "Fail" otherwise?', ['=IF(C2>=50,"Pass","Fail")', '=IF(C2<50,"Pass","Fail")', '=SUM(C2,50)', '=COUNT(C2>=50)'], 'Test, value if true, value if false.'),
        mc('What does the $ do in $B$1?', ['Keeps the reference fixed when the formula is copied', 'Formats the cell as money', 'Adds the cells', 'Hides the cell'], 'It is an absolute reference.'),
        mc('Which function counts all cells that are not empty?', ['COUNTA', 'COUNT', 'SUM', 'MAX'], 'COUNT counts only numbers.'),
      ],
    ),
    lesson(
      'cat-word',
      'Word processing',
      ['Styles (Heading 1, Heading 2) format headings the same way throughout and build an automatic table of contents.', 'A header or footer repeats at the top or bottom of every page (page numbers, title).', 'A page break starts a new page. Track Changes records edits so they can be accepted or rejected.', 'Mail merge combines one letter with a list of names to make many personalised letters.'],
      [
        mc('Which feature creates an automatic table of contents?', ['Heading styles', 'Bold text', 'Tabs', 'Text boxes'], 'The table of contents is built from the heading styles.'),
        mc('Where do page numbers usually go?', ['In the header or footer', 'In a text box on page 1', 'In the margin notes', 'In a table'], 'Headers and footers repeat on every page.'),
        mc('Mail merge is used to…', ['send the same letter to many people with their own details', 'check spelling', 'draw tables', 'make text bold'], 'One document plus a data source.'),
        mc('What does Track Changes do?', ['Shows the edits so they can be accepted or rejected', 'Saves the file', 'Prints the file', 'Deletes comments'], 'Useful when several people edit a document.'),
        mc('How should you start a new page properly?', ['Insert a page break', 'Press Enter many times', 'Use the space bar', 'Change the font size'], 'A page break stays correct when text is added above it.'),
      ],
    ),
    lesson(
      'cat-safety',
      'Safety and social implications',
      ['Malware is harmful software (viruses, ransomware, spyware). Use antivirus software and keep it updated.', 'Phishing tricks you into giving away passwords or bank details, usually by email or SMS.', 'Use strong passwords, and two-factor authentication where you can. Back up important files.', 'Ergonomics: sit upright, keep the screen at eye level and take breaks to avoid strain injuries.'],
      [
        mc('An email asks you to "confirm your banking password" through a link. This is…', ['phishing', 'a backup', 'a firewall', 'an update'], 'Banks never ask for passwords by email.'),
        mc('Which password is the strongest?', ['T7!mango-Rain42', 'password', '123456', 'thandi'], 'Long, with a mix of letters, numbers and symbols.'),
        mc('Ransomware…', ['locks your files and demands payment', 'speeds up your computer', 'is a kind of antivirus', 'backs up your files'], 'Backups are the best protection.'),
        mc('What is two-factor authentication?', ['A second proof of identity, such as a code sent to your phone', 'Using two passwords that are the same', 'Logging in twice', 'Having two user names'], 'Something you know plus something you have.'),
        mc('Which is good ergonomic practice?', ['Taking regular breaks from the screen', 'Sitting hunched over', 'Having the screen far below eye level', 'Typing with bent wrists for hours'], 'Breaks and good posture prevent strain.'),
      ],
    ),
  ]),
])

export const LIFE_ORIENTATION = schoolCourse('lo', 'Life Orientation', 'Skills for life: goals, health, rights and planning what comes after school.', [
  unit('lo-self', 'Self and study', 'Goals, study skills and wellbeing', [
    lesson(
      'lo-goals',
      'Goal setting',
      ['A SMART goal is Specific, Measurable, Achievable, Realistic and Time-bound.', 'Short-term goals take days or weeks. Medium-term goals take months. Long-term goals take years.', 'Break a big goal into small steps and write down the first one.', 'Review your goals regularly and change the plan when life changes.'],
      [
        mc('Which goal is SMART?', ['Raise my Maths mark from 35% to 50% by the June exam', 'Do better at school', 'Be successful one day', 'Study more'], 'It is specific, measurable and has a deadline.'),
        mc('What does the M in SMART stand for?', ['Measurable', 'Motivated', 'Maximum', 'Mature'], 'You must be able to check your progress.'),
        mc('Passing Grade 12 at the end of next year is a…', ['medium- to long-term goal', 'short-term goal', 'daily task', 'habit'], 'It takes many months.'),
        mc('What is the best first step towards a big goal?', ['Break it into small steps', 'Wait until you feel ready', 'Tell nobody', 'Start with the hardest part only'], 'Small steps make it possible to begin.'),
        seq('Put these in a sensible order', ['Set a SMART goal', 'Break it into steps', 'Do the first step', 'Review your progress'], 'Plan, act, review.'),
      ],
    ),
    lesson(
      'lo-study',
      'Study skills',
      ['Active recall (testing yourself) works better than re-reading.', 'Spaced repetition: revise a topic again after a day, then a few days, then a week.', 'Study in focused blocks with short breaks, such as 25 minutes of work and 5 minutes of rest.', 'In an exam, read the whole paper first, plan your time by marks, and start with the questions you know.'],
      [
        mc('Which study method works best?', ['Testing yourself without looking at the notes', 'Reading the notes again and again', 'Highlighting everything', 'Copying the textbook'], 'Recalling information strengthens memory.'),
        mc('Spaced repetition means…', ['revising a topic again after growing gaps of time', 'studying everything the night before', 'studying one subject all day', 'never repeating work'], 'Each review comes just as you start to forget.'),
        mc('A question is worth 10 marks in a 100-mark, 2-hour paper. About how long should you spend on it?', ['12 minutes', '30 minutes', '2 minutes', '45 minutes'], '120 minutes ÷ 100 marks = 1.2 minutes per mark.'),
        mc('What should you do first in an exam?', ['Read through the whole paper', 'Start writing at once', 'Do the hardest question', 'Count the pages only'], 'Then plan your time.'),
        mc('Why take short breaks while studying?', ['Your focus recovers', 'To avoid studying', 'Breaks waste time', 'To forget the work'], 'Short breaks keep concentration up.'),
      ],
    ),
    lesson(
      'lo-health',
      'Stress and a healthy lifestyle',
      ['Stress is the body’s response to pressure. A little can motivate; too much harms health and marks.', 'Signs include headaches, poor sleep, irritability and struggling to concentrate.', 'Healthy coping: exercise, enough sleep, planning your time, and talking to someone you trust.', 'Unhealthy coping (alcohol, drugs, avoiding the problem) makes things worse over time.'],
      [
        mc('Which is a healthy way to cope with exam stress?', ['Regular exercise and a study plan', 'Skipping sleep', 'Avoiding the work', 'Using alcohol'], 'Movement and planning reduce stress.'),
        mc('Which is a common sign of too much stress?', ['Trouble sleeping', 'More energy than usual', 'Better concentration', 'A stronger appetite for study'], 'Stress often disturbs sleep.'),
        mc('How much sleep do most teenagers need each night?', ['8 to 10 hours', '4 to 5 hours', '2 to 3 hours', '12 to 14 hours'], 'Sleep is when memory is stored.'),
        mc('If stress or sadness feels too heavy to carry, you should…', ['talk to someone you trust or a counsellor', 'keep it secret', 'ignore it', 'stop eating'], 'Asking for help is a strength.'),
        mc('A balanced lifestyle includes…', ['physical activity, healthy food, rest and time with people', 'only studying', 'only resting', 'only exercise'], 'Balance protects body and mind.'),
      ],
    ),
  ]),
  unit('lo-society', 'Society and careers', 'Rights, citizenship and life after school', [
    lesson(
      'lo-rights',
      'Human rights and the Constitution',
      ['The Constitution is the highest law in South Africa. Chapter 2 is the Bill of Rights.', 'Rights include equality, human dignity, freedom of expression, education and privacy.', 'Every right comes with a responsibility, such as respecting the rights of others.', 'Rights can be limited only when it is reasonable and justifiable, for example to protect other people.'],
      [
        mc('Which chapter of the Constitution contains the Bill of Rights?', ['Chapter 2', 'Chapter 1', 'Chapter 9', 'Chapter 14'], 'Chapter 2.'),
        mc('What is the highest law in South Africa?', ['The Constitution', 'The Criminal Procedure Act', 'Municipal by-laws', 'School rules'], 'Every other law must agree with it.'),
        mc('Which responsibility goes with the right to education?', ['To attend school and respect others’ learning', 'To stay at home', 'To choose the teachers', 'None'], 'Rights and responsibilities go together.'),
        mc('Unfair treatment of a person because of race, gender or disability is…', ['discrimination', 'equality', 'dignity', 'democracy'], 'The Constitution forbids unfair discrimination.'),
        mc('Which body can you approach about a human rights violation?', ['The South African Human Rights Commission', 'SARS', 'The Reserve Bank', 'Eskom'], 'The SAHRC investigates violations.'),
      ],
    ),
    lesson(
      'lo-citizen',
      'Democracy and citizenship',
      ['In a democracy, citizens choose their leaders in free and fair elections.', 'South Africans can vote from the age of 18. The IEC runs the elections.', 'The three arms of government: the legislature makes laws, the executive carries them out, and the judiciary interprets them.', 'Active citizens vote, obey the law, volunteer and hold leaders accountable.'],
      [
        inp('From what age can South Africans vote?', ['18'], 'You can register from 16 but vote from 18.', { numeric: true }),
        pair('Match the arm of government to its job', [['Legislature', 'makes laws'], ['Executive', 'carries out laws'], ['Judiciary', 'interprets laws']], 'Parliament, the Cabinet and the courts.'),
        mc('Which body runs elections in South Africa?', ['The IEC', 'SARS', 'The SAPS', 'The SABC'], 'The Electoral Commission.'),
        mc('Which is an example of active citizenship?', ['Volunteering in your community', 'Ignoring the law', 'Never voting', 'Littering'], 'Taking part improves the community.'),
        mc('Why are the three arms of government kept separate?', ['So no single one has all the power', 'To save money', 'To make laws faster', 'Because of tradition only'], 'Separation of powers provides checks and balances.'),
      ],
    ),
    lesson(
      'lo-careers',
      'Careers and life after school',
      ['Options after matric include university, a TVET college, a learnership, an apprenticeship, work, or starting a business.', 'Universities use an APS (admission point score) worked out from your subject marks.', 'A bursary does not have to be paid back; a loan does. NSFAS funds students from lower-income households at public universities and TVET colleges.', 'A CV lists your details, education, skills and references. Keep it short, honest and neat.'],
      [
        mc('What is the difference between a bursary and a loan?', ['A loan must be paid back', 'A bursary must be paid back', 'They are the same', 'Neither pays for fees'], 'Bursaries often have conditions, but they are not repaid.'),
        mc('What is NSFAS?', ['A government scheme that funds students who qualify', 'A university', 'A bank', 'An exam'], 'The National Student Financial Aid Scheme.'),
        mc('A TVET college mainly offers…', ['practical and vocational training', 'only degrees', 'primary schooling', 'only short hobby courses'], 'Technical and Vocational Education and Training.'),
        mc('What does a university use an APS for?', ['To decide if you meet the entry requirements', 'To set your fees', 'To choose your residence room', 'To mark your exams'], 'It is worked out from your subject results.'),
        mc('Which belongs on a CV?', ['Your education and skills', 'Your favourite food', 'Your banking PIN', 'Your friends’ names'], 'Keep it relevant and honest.'),
      ],
    ),
  ]),
])
