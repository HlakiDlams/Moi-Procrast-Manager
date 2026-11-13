import type { Course } from '../types'

/** Information Technology (CAPS Gr 12): Delphi, SQL and theory. */
export const IT: Course = {
  id: 'it',
  name: 'Information Technology',
  icon: '💻',
  color: '#C77DFF',
  subjectName: 'Information Technology',
  group: 'school',
  units: [
    // ------------------------------------------------------------------ Delphi basics
    {
      id: 'i-basics',
      title: 'Delphi basics',
      icon: '🧮',
      description: 'Variables, types, operators, conversions',
      lessons: [
        {
          id: 'i-vars',
          title: 'Variables and data types',
          teach: {
            text: [
              'Integer = whole number · Real = decimal · String = text · Char = one character · Boolean = True/False',
              'Declare in a var section, assign with :=',
              'Naming convention: prefix with the type, e.g. iAge, rPrice, sName, bFound.',
            ],
            example: ['var', '  iAge : Integer;', '  sName : String;', 'begin', "  iAge := 19;", "  sName := 'Hlaki';", 'end;'],
          },
          questions: [
            { id: 'iv-1', type: 'mcq', prompt: 'Which data type stores 3.75?', options: ['Real', 'Integer', 'Boolean', 'Char'], answer: 0, explain: 'Decimals = Real.' },
            { id: 'iv-2', type: 'mcq', prompt: 'Which operator assigns a value in Delphi?', options: [':=', '=', '==', '<-'], answer: 0, explain: ':= assigns. = is used for comparing.' },
            { id: 'iv-3', type: 'mcq', prompt: 'A Boolean can hold…', options: ['True or False', 'any number', 'one letter', 'text'], answer: 0, explain: 'Boolean = True/False.' },
            {
              id: 'iv-4',
              type: 'match',
              prompt: 'Match the value to its data type',
              pairs: [
                ['42', 'Integer'],
                ['3.14', 'Real'],
                ["'Hello'", 'String'],
                ["'A'", 'Char'],
              ],
              explain: 'Whole number, decimal, text, single character.',
            },
            { id: 'iv-5', type: 'mcq', prompt: 'Which is the best variable name for a learner\'s surname?', options: ['sSurname', 'x', 'iSurname', '1Surname'], answer: 0, explain: 's for String + a meaningful name. Names can\'t start with a digit.' },
          ],
        },
        {
          id: 'i-ops',
          title: 'Operators and conversions',
          teach: {
            text: [
              'div = whole-number division · mod = remainder · / = real division',
              'IntToStr / StrToInt · FloatToStr / StrToFloat convert between numbers and text.',
              "+ on strings joins them: '5' + '3' = '53'",
            ],
            example: ['17 div 5 = 3', '17 mod 5 = 2', '17 / 5 = 3.4', "StrToInt('12') + 3 = 15"],
          },
          questions: [
            { id: 'io-1', type: 'input', prompt: '17 div 5 = ?', answers: ['3'], numeric: true, explain: '5 fits into 17 three whole times.' },
            { id: 'io-2', type: 'input', prompt: '17 mod 5 = ?', answers: ['2'], numeric: true, explain: '17 − 15 = 2 left over.' },
            { id: 'io-3', type: 'mcq', prompt: "What is '5' + '3' in Delphi?", options: ["'53'", '8', "'8'", 'an error'], answer: 0, explain: 'They are strings, so + joins them.' },
            { id: 'io-4', type: 'input', prompt: "StrToInt('12') + 3 = ?", answers: ['15'], numeric: true, explain: "'12' becomes the number 12; 12 + 3 = 15." },
            { id: 'io-5', type: 'mcq', prompt: 'How do you check if iNum is even?', options: ['iNum mod 2 = 0', 'iNum div 2 = 0', 'iNum / 2 = 0', 'iNum mod 2 = 1'], answer: 0, explain: 'Even numbers leave no remainder when divided by 2.' },
            { id: 'io-6', type: 'mcq', prompt: 'Which converts an Integer to text for a label?', options: ['IntToStr', 'StrToInt', 'FloatToStr', 'Ord'], answer: 0, explain: 'IntToStr(iNum) gives a String.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------ control structures
    {
      id: 'i-control',
      title: 'Decisions and loops',
      icon: '🔀',
      description: 'if, case, for, while, repeat',
      lessons: [
        {
          id: 'i-if',
          title: 'if and case',
          teach: {
            text: ['if condition then … else …', 'No semicolon directly before else!', 'Use begin … end when more than one statement runs.', 'case is neat for many fixed values (Integer or Char).'],
            example: ['if iMark >= 50 then', "  lblResult.Caption := 'Pass'", 'else', "  lblResult.Caption := 'Fail';"],
          },
          questions: [
            { id: 'if-1', type: 'mcq', code: "iMark := 45;\nif iMark >= 50 then\n  sRes := 'Pass'\nelse\n  sRes := 'Fail';", prompt: 'What is sRes?', options: ["'Fail'", "'Pass'", 'empty', 'an error'], answer: 0, explain: '45 is not ≥ 50, so the else part runs.' },
            { id: 'if-2', type: 'mcq', prompt: 'Where is a semicolon NOT allowed?', options: ['Directly before else', 'After end', 'After an assignment', 'After var declarations'], answer: 0, explain: 'A ; before else ends the if statement early: syntax error.' },
            { id: 'if-3', type: 'mcq', prompt: 'Which condition checks if iAge is between 13 and 19 (inclusive)?', options: ['(iAge >= 13) and (iAge <= 19)', 'iAge >= 13 and <= 19', '(iAge > 13) or (iAge < 19)', '13 <= iAge <= 19'], answer: 0, explain: 'Each comparison in brackets, joined with and.' },
            { id: 'if-4', type: 'mcq', code: "case iDay of\n  1: sDay := 'Mon';\n  2: sDay := 'Tue';\nelse\n  sDay := '?';\nend;", prompt: 'iDay = 2. sDay = ?', options: ["'Tue'", "'Mon'", "'?'", "'2'"], answer: 0, explain: 'Matches 2.' },
            { id: 'if-5', type: 'mcq', prompt: 'When must you use begin … end after then?', options: ['When more than one statement must run', 'Always', 'Never', 'Only with else'], answer: 0, explain: 'One statement: no begin/end needed. More than one: begin … end.' },
          ],
        },
        {
          id: 'i-loops',
          title: 'Loops',
          teach: {
            text: [
              'for: you know how many times. for i := 1 to 10 do …',
              'while: checks FIRST, might run 0 times.',
              'repeat … until: checks LAST, always runs at least once.',
            ],
            example: ['iTotal := 0;', 'for i := 1 to 5 do', '  iTotal := iTotal + i;', '// iTotal = 15'],
          },
          questions: [
            { id: 'lo-1', type: 'input', code: 'iTotal := 0;\nfor i := 1 to 5 do\n  iTotal := iTotal + i;', prompt: 'iTotal = ?', answers: ['15'], numeric: true, explain: '1 + 2 + 3 + 4 + 5 = 15.' },
            { id: 'lo-2', type: 'mcq', prompt: 'Which loop always runs at least once?', options: ['repeat … until', 'while … do', 'for … to', 'none'], answer: 0, explain: 'repeat checks the condition at the end.' },
            { id: 'lo-3', type: 'input', code: 'iCount := 0;\niNum := 1;\nwhile iNum < 20 do\nbegin\n  iNum := iNum * 2;\n  Inc(iCount);\nend;', prompt: 'iCount = ?', answers: ['5'], numeric: true, explain: 'iNum: 1→2→4→8→16→32. That is 5 loops.' },
            { id: 'lo-4', type: 'mcq', prompt: 'Best loop to process exactly 30 learners in an array', options: ['for', 'repeat', 'while', 'case'], answer: 0, explain: 'Known number of repetitions → for.' },
            { id: 'lo-5', type: 'mcq', prompt: 'Which loop counts DOWN from 10 to 1?', options: ['for i := 10 downto 1 do', 'for i := 10 to 1 do', 'for i := 1 to 10 do', 'repeat i := 10'], answer: 0, explain: 'Use downto to count down.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------ strings + arrays + files
    {
      id: 'i-data',
      title: 'Strings, arrays, files',
      icon: '🧵',
      description: 'String functions, arrays, text files',
      lessons: [
        {
          id: 'i-str',
          title: 'String functions',
          teach: {
            text: [
              'Strings start at position 1.',
              'Length(s) · Copy(s, start, count) · Pos(sub, s) · UpperCase(s)',
              'Delete(s, start, count) and Insert(sub, s, pos) are procedures: they change s itself.',
            ],
            example: ["s := 'Delphi';", 'Length(s) = 6', "Copy(s, 2, 3) = 'elp'", "Pos('h', s) = 5"],
          },
          questions: [
            { id: 'st-1', type: 'input', prompt: "Length('Hello') = ?", answers: ['5'], numeric: true, explain: 'H-e-l-l-o = 5 characters.' },
            { id: 'st-2', type: 'mcq', prompt: "Copy('Delphi', 2, 3) = ?", options: ["'elp'", "'Del'", "'lph'", "'el'"], answer: 0, explain: 'Start at position 2 (e), take 3 characters: e-l-p.' },
            { id: 'st-3', type: 'input', prompt: "Pos('l', 'Hello') = ?", answers: ['3'], numeric: true, explain: 'The first l is at position 3.' },
            { id: 'st-4', type: 'mcq', prompt: "Pos('z', 'Hello') = ?", options: ['0', '-1', '6', 'an error'], answer: 0, explain: 'Not found → 0.' },
            { id: 'st-5', type: 'mcq', code: "s := 'Hello World';\nDelete(s, 1, 6);", prompt: 's = ?', options: ["'World'", "'Hello'", "' World'", "'ello World'"], answer: 0, explain: 'Deletes 6 characters from position 1 ("Hello "), leaving "World".' },
            { id: 'st-6', type: 'mcq', prompt: 'Which gives the LAST character of sWord?', options: ['sWord[Length(sWord)]', 'sWord[0]', 'sWord[1]', 'Copy(sWord, 1, 1)'], answer: 0, explain: 'Position Length(s) is the last character (strings start at 1).' },
          ],
        },
        {
          id: 'i-arr',
          title: 'Arrays',
          teach: {
            text: ['An array stores many values of the same type under one name.', 'Access an element with an index: arrNames[3].', 'Loop through with for.'],
            example: ['var arrMarks : array[1..5] of Integer;', '…', 'iTotal := 0;', 'for i := 1 to 5 do', '  iTotal := iTotal + arrMarks[i];'],
          },
          questions: [
            { id: 'ar-1', type: 'mcq', prompt: 'arrNames : array[1..30] of String. How many names can it hold?', options: ['30', '29', '31', 'unlimited'], answer: 0, explain: 'Indexes 1 to 30 = 30 elements.' },
            { id: 'ar-2', type: 'mcq', prompt: 'How do you get the 4th element of arrMarks?', options: ['arrMarks[4]', 'arrMarks(4)', 'arrMarks.4', 'arrMarks[3] always'], answer: 0, explain: 'Square brackets with the index.' },
            { id: 'ar-3', type: 'input', code: 'const arr : array[1..4] of Integer = (3, 8, 2, 7);\niMax := arr[1];\nfor i := 2 to 4 do\n  if arr[i] > iMax then\n    iMax := arr[i];', prompt: 'iMax = ?', answers: ['8'], numeric: true, explain: 'This is the standard "find the biggest" algorithm.' },
            { id: 'ar-4', type: 'mcq', prompt: 'All elements of an array must be…', options: ['the same data type', 'different types', 'Strings', 'sorted'], answer: 0, explain: 'One array, one type.' },
            { id: 'ar-5', type: 'mcq', prompt: 'Swapping two elements needs…', options: ['a temporary variable', 'a second array', 'a text file', 'a case statement'], answer: 0, explain: 'temp := a[i]; a[i] := a[j]; a[j] := temp;' },
          ],
        },
        {
          id: 'i-files',
          title: 'Text files',
          teach: {
            text: [
              'AssignFile links a variable to a file name.',
              'Reset = open to READ · Rewrite = create/overwrite to WRITE · Append = add to the end',
              'Read line by line until Eof (end of file). Always CloseFile.',
              'Check FileExists first so the program doesn\'t crash.',
            ],
            example: ["AssignFile(tFile, 'learners.txt');", 'Reset(tFile);', 'while not Eof(tFile) do', 'begin', '  ReadLn(tFile, sLine);', '  …', 'end;', 'CloseFile(tFile);'],
          },
          questions: [
            { id: 'tf-1', type: 'mcq', prompt: 'Which procedure opens a text file for READING?', options: ['Reset', 'Rewrite', 'Append', 'AssignFile'], answer: 0, explain: 'Reset = read.' },
            { id: 'tf-2', type: 'mcq', prompt: 'Rewrite on an existing file will…', options: ['erase it and start empty', 'add to the end', 'only read it', 'rename it'], answer: 0, explain: 'Rewrite creates a new, empty file (overwriting).' },
            { id: 'tf-3', type: 'mcq', prompt: 'To add lines to the end of an existing file, use…', options: ['Append', 'Rewrite', 'Reset', 'Delete'], answer: 0, explain: 'Append keeps what is there.' },
            { id: 'tf-4', type: 'mcq', prompt: 'Which loop condition reads to the end of the file?', options: ['while not Eof(tFile) do', 'while Eof(tFile) do', 'for i := 1 to Eof do', 'repeat until not Eof(tFile)'], answer: 0, explain: 'Keep going while NOT at the end of the file.' },
            { id: 'tf-5', type: 'order', prompt: 'Put the steps in order to read a text file', steps: ["AssignFile(tFile, 'data.txt')", 'Reset(tFile)', 'while not Eof(tFile) do ReadLn(tFile, sLine)', 'CloseFile(tFile)'], explain: 'Assign → open → read loop → close.' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------ OOP + SQL
    {
      id: 'i-oop-sql',
      title: 'OOP and SQL',
      icon: '🧩',
      description: 'Classes and objects, SQL queries',
      lessons: [
        {
          id: 'i-oop',
          title: 'Classes and objects',
          teach: {
            text: [
              'A class is a blueprint, an object is one thing made from it.',
              'Fields (attributes) are private: encapsulation.',
              'Constructor (Create) builds the object and sets its fields.',
              'Accessor (get) returns a field · Mutator (set) changes a field · toString returns the data as text.',
            ],
            example: ['objLearner := TLearner.Create(\'Hlaki\', 12);', 'lblOut.Caption := objLearner.toString;'],
          },
          questions: [
            { id: 'oo-1', type: 'mcq', prompt: 'A class is…', options: ['a blueprint for objects', 'one object', 'a variable type like Integer only', 'a loop'], answer: 0, explain: 'Class = blueprint; object = instance.' },
            { id: 'oo-2', type: 'mcq', prompt: 'Keeping fields private and using methods to reach them is called…', options: ['encapsulation', 'inheritance', 'iteration', 'normalisation'], answer: 0, explain: 'Encapsulation protects the data.' },
            { id: 'oo-3', type: 'mcq', prompt: 'Which method gives initial values when an object is made?', options: ['Constructor', 'Accessor', 'Destructor', 'Mutator'], answer: 0, explain: 'The constructor (Create).' },
            {
              id: 'oo-4',
              type: 'match',
              prompt: 'Match the method type',
              pairs: [
                ['Accessor', 'returns a field value'],
                ['Mutator', 'changes a field value'],
                ['Constructor', 'creates the object'],
                ['toString', 'returns all data as text'],
              ],
              explain: 'These are tested in almost every OOP question.',
            },
            { id: 'oo-5', type: 'mcq', prompt: 'Making an object from a class is called…', options: ['instantiation', 'declaration', 'compilation', 'iteration'], answer: 0, explain: 'objX := TClass.Create(...) instantiates an object.' },
          ],
        },
        {
          id: 'i-sql',
          title: 'SQL',
          teach: {
            text: [
              'SELECT fields FROM table WHERE condition ORDER BY field (ASC/DESC)',
              'Aggregates: COUNT, SUM, AVG, MAX, MIN with GROUP BY.',
              'Changing data: INSERT INTO … VALUES · UPDATE … SET … WHERE · DELETE FROM … WHERE',
              'Forget WHERE in UPDATE/DELETE and you change EVERY record!',
            ],
            example: ['SELECT Name, Surname', 'FROM tblLearners', 'WHERE Grade = 12', 'ORDER BY Surname'],
          },
          questions: [
            { id: 'sq-1', type: 'mcq', prompt: 'Which keyword filters records?', options: ['WHERE', 'ORDER BY', 'FROM', 'SELECT'], answer: 0, explain: 'WHERE filters.' },
            { id: 'sq-2', type: 'mcq', prompt: 'Sort marks from highest to lowest', options: ['ORDER BY Mark DESC', 'ORDER BY Mark ASC', 'SORT Mark DOWN', 'GROUP BY Mark'], answer: 0, explain: 'DESC = descending.' },
            { id: 'sq-3', type: 'order', prompt: 'Build the query: names of Grade 12 learners', steps: ['SELECT Name', 'FROM tblLearners', 'WHERE Grade = 12'], explain: 'SELECT → FROM → WHERE.' },
            { id: 'sq-4', type: 'mcq', prompt: 'Count the learners in each grade', options: ['SELECT Grade, COUNT(*) FROM tblLearners GROUP BY Grade', 'SELECT COUNT(Grade) FROM tblLearners', 'SELECT Grade FROM tblLearners ORDER BY COUNT', 'COUNT Grade FROM tblLearners'], answer: 0, explain: 'COUNT with GROUP BY gives one count per grade.' },
            { id: 'sq-5', type: 'mcq', prompt: 'Change Thabo\'s grade to 12', options: ["UPDATE tblLearners SET Grade = 12 WHERE Name = 'Thabo'", "UPDATE tblLearners Grade = 12", "SET Grade = 12 FROM tblLearners", "INSERT Grade = 12 WHERE Name = 'Thabo'"], answer: 0, explain: 'UPDATE … SET … WHERE.' },
            { id: 'sq-6', type: 'mcq', prompt: 'What happens with: DELETE FROM tblLearners', options: ['ALL records are deleted', 'Nothing', 'Only the first record is deleted', 'The table is renamed'], answer: 0, explain: 'No WHERE = every record. Always add WHERE!' },
          ],
        },
      ],
    },
    // ------------------------------------------------------------------ theory
    {
      id: 'i-theory',
      title: 'Theory',
      icon: '🌐',
      description: 'Systems, networks, internet, data, social',
      lessons: [
        {
          id: 'i-sys',
          title: 'Systems technologies',
          teach: {
            text: [
              'CPU processes instructions. RAM is temporary working memory (volatile: lost when off). ROM keeps its contents (non-volatile).',
              'Cache: tiny, very fast memory between CPU and RAM.',
              'Virtual memory: disk space used as extra RAM when RAM is full (slower).',
              'SSD: no moving parts, faster than an HDD.',
              '1 byte = 8 bits.',
            ],
          },
          questions: [
            { id: 'sy-1', type: 'mcq', prompt: 'Which memory loses its data when the power goes off?', options: ['RAM', 'ROM', 'SSD', 'Flash drive'], answer: 0, explain: 'RAM is volatile.' },
            { id: 'sy-2', type: 'mcq', prompt: 'Cache memory is…', options: ['small and very fast, close to the CPU', 'large and slow', 'part of the hard drive', 'the same as ROM'], answer: 0, explain: 'Cache speeds up access to frequently used data.' },
            { id: 'sy-3', type: 'mcq', prompt: 'Virtual memory uses…', options: ['storage space as extra RAM', 'the cloud as RAM', 'ROM as RAM', 'cache as storage'], answer: 0, explain: 'When RAM is full, part of the disk acts as memory (slower).' },
            { id: 'sy-4', type: 'input', prompt: 'How many bits in 1 byte?', answers: ['8'], numeric: true, explain: '1 byte = 8 bits.' },
            { id: 'sy-5', type: 'input', prompt: 'Binary 1011 in decimal = ?', answers: ['11'], numeric: true, explain: '8 + 0 + 2 + 1 = 11.' },
            { id: 'sy-6', type: 'mcq', prompt: 'Why is an SSD faster than an HDD?', options: ['No moving parts', 'It is bigger', 'It uses tape', 'It is always external'], answer: 0, explain: 'SSDs use flash memory, with no spinning disk.' },
          ],
        },
        {
          id: 'i-net',
          title: 'Networks and internet',
          teach: {
            text: [
              'LAN = small area (home, school) · WAN = large area (the internet)',
              'Switch connects devices in a LAN · Router connects different networks',
              'DNS turns names (www.impaq.co.za) into IP addresses.',
              'HTTPS = HTTP encrypted with SSL/TLS (the padlock).',
              'Email: SMTP sends · POP3 / IMAP receive',
            ],
          },
          questions: [
            { id: 'ne-1', type: 'mcq', prompt: 'What does DNS do?', options: ['Translates domain names into IP addresses', 'Encrypts websites', 'Sends email', 'Speeds up the CPU'], answer: 0, explain: 'DNS = the internet\'s phone book.' },
            { id: 'ne-2', type: 'mcq', prompt: 'A school\'s network in one building is a…', options: ['LAN', 'WAN', 'PAN', 'VPN'], answer: 0, explain: 'Small area = LAN.' },
            { id: 'ne-3', type: 'mcq', prompt: 'Which device connects a home network to the internet?', options: ['Router', 'Switch', 'Monitor', 'Printer'], answer: 0, explain: 'Routers connect different networks.' },
            { id: 'ne-4', type: 'mcq', prompt: 'The "S" in HTTPS means…', options: ['Secure (encrypted)', 'Speed', 'Server', 'Simple'], answer: 0, explain: 'HTTPS uses SSL/TLS encryption.' },
            {
              id: 'ne-5',
              type: 'match',
              prompt: 'Match the protocol to its job',
              pairs: [
                ['SMTP', 'send email'],
                ['IMAP', 'receive email (kept on server)'],
                ['HTTP', 'web pages'],
                ['FTP', 'file transfer'],
              ],
              explain: 'Classic protocol question.',
            },
          ],
        },
        {
          id: 'i-db',
          title: 'Data and databases',
          teach: {
            text: [
              'Primary key: a field that is unique for every record.',
              'Foreign key: a field that links to the primary key of another table.',
              'Normalisation: splitting data into related tables to remove repeated data (redundancy).',
              'Validation checks data is sensible (range, type, presence). Verification checks it was typed correctly.',
            ],
          },
          questions: [
            { id: 'db-1', type: 'mcq', prompt: 'A primary key must be…', options: ['unique for every record', 'a number', 'empty sometimes', 'the same in all records'], answer: 0, explain: 'Unique, so each record can be identified.' },
            { id: 'db-2', type: 'mcq', prompt: 'A field that links to another table\'s primary key is a…', options: ['foreign key', 'secondary key', 'master key', 'validation rule'], answer: 0, explain: 'Foreign key.' },
            { id: 'db-3', type: 'mcq', prompt: 'Normalisation mainly removes…', options: ['data redundancy (repetition)', 'all keys', 'the need for SQL', 'security'], answer: 0, explain: 'Less repetition → fewer update mistakes.' },
            { id: 'db-4', type: 'mcq', prompt: 'Checking that a mark is between 0 and 100 is…', options: ['a range check (validation)', 'verification', 'normalisation', 'encryption'], answer: 0, explain: 'Validation: range check.' },
            { id: 'db-5', type: 'mcq', prompt: 'One customer can have many orders. This is a…', options: ['one-to-many relationship', 'one-to-one', 'many-to-many', 'no relationship'], answer: 0, explain: 'One customer → many orders.' },
          ],
        },
        {
          id: 'i-social',
          title: 'Social implications',
          teach: {
            text: [
              'Phishing: fake emails/sites that trick you into giving passwords or bank details.',
              'Virus needs a host file · Worm spreads by itself · Trojan pretends to be useful software',
              'POPIA (Protection of Personal Information Act) protects personal data in South Africa.',
              'E-waste: old electronics with toxic parts, so recycle responsibly.',
              'Digital divide: the gap between people with and without access to technology.',
            ],
          },
          questions: [
            { id: 'so-1', type: 'mcq', prompt: 'An email "from your bank" asks for your PIN. This is…', options: ['phishing', 'spam filtering', 'encryption', 'a firewall'], answer: 0, explain: 'Banks never ask for your PIN: phishing.' },
            { id: 'so-2', type: 'mcq', prompt: 'Malware that spreads across networks by itself', options: ['Worm', 'Virus', 'Trojan', 'Cookie'], answer: 0, explain: 'Worms self-replicate without a host file.' },
            { id: 'so-3', type: 'mcq', prompt: 'Which SA law protects personal information?', options: ['POPIA', 'BEE', 'RICA', 'NSFAS'], answer: 0, explain: 'Protection of Personal Information Act.' },
            { id: 'so-4', type: 'mcq', prompt: 'The digital divide is…', options: ['the gap between those with and without access to ICT', 'a type of network cable', 'splitting a hard drive', 'a sorting algorithm'], answer: 0, explain: 'Access gap: cost, location, skills.' },
            { id: 'so-5', type: 'mcq', prompt: 'Malware disguised as a useful program', options: ['Trojan', 'Worm', 'Firewall', 'Patch'], answer: 0, explain: 'Like the Trojan horse.' },
          ],
        },
      ],
    },
  ],
}
