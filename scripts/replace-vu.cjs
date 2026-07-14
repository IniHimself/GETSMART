const fs = require('fs');
const content = fs.readFileSync('src/data/courses.ts', 'utf8');
const lines = content.split('\n');

// Keep everything before VU (lines 0-10970) and GST courses (lines 21907+)
const beforeVU = lines.slice(0, 10970).join('\n');
const gstSection = lines.slice(21907).join('\n');

const newVU = `  {
    id: 'vu',
    name: 'Vision University',
    shortName: 'VU',
    location: 'Ikogbo, Ogun State',
    logo: '🎓',
    color: '#2563EB',
    description: 'Vision University, Ikogbo, Ogun State - A private university mentored by Lagos State University (LASU) with NUC accreditation.',
    faculties: [
      {
        id: 'vu-faculty-of-basic-and-applied-sciences',
        name: 'Faculty of Basic & Applied Sciences',
        departments: [
          {
            id: 'vu-dept-biological-sciences',
            name: 'Department of Biological Sciences',
            courses: [
              {
                id: 'vu-bio-101',
                code: 'BIO 101',
                title: 'Introduction to Biology',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Biological Sciences',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Fundamental principles of biology including cell structure, genetics, and evolution.',
                topics: ['Cell Structure and Function', 'Cell Division', 'Genetics Fundamentals', 'DNA and Protein Synthesis', 'Evolution and Natural Selection', 'Ecology Basics', 'Biological Classification', 'Microbiology Introduction', 'Plant Biology', 'Animal Biology']
              },
              {
                id: 'vu-bio-102',
                code: 'BIO 102',
                title: 'General Biology II',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Biological Sciences',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Continuation of general biology covering diversity of life and biological systems.',
                topics: ['Diversity of Living Organisms', 'Invertebrate Biology', 'Vertebrate Biology', 'Plant Morphology', 'Animal Physiology', 'Ecology and Environment', 'Conservation Biology', 'Biotechnology Introduction', 'Microorganisms', 'Applied Biology']
              },
              {
                id: 'vu-bt-101',
                code: 'BT 101',
                title: 'Introduction to Biotechnology',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Biological Sciences',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Overview of biotechnology principles and applications.',
                topics: ['What is Biotechnology', 'History of Biotechnology', 'Cell Biology Basics', 'Genetic Engineering Introduction', 'DNA Technology', 'Microbial Biotechnology', 'Agricultural Biotechnology', 'Medical Biotechnology', 'Industrial Biotechnology', 'Bioethics']
              },
              {
                id: 'vu-mcb-101',
                code: 'MCB 101',
                title: 'Introduction to Microbiology',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Biological Sciences',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Fundamental concepts of microorganisms and their roles.',
                topics: ['History of Microbiology', 'Microscopy Techniques', 'Bacterial Structure', 'Viral Structure', 'Fungi and Protozoa', 'Microbial Growth', 'Sterilization Methods', 'Culture Techniques', 'Microbial Genetics', 'Microbiology in Society']
              },
              {
                id: 'vu-mcb-102',
                code: 'MCB 102',
                title: 'Microbiology II',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Biological Sciences',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Applied microbiology and immunology fundamentals.',
                topics: ['Immunology Basics', 'Immune Response', 'Antibodies and Antigens', 'Medical Microbiology', 'Environmental Microbiology', 'Food Microbiology', 'Industrial Microbiology', 'Microbial Pathogenesis', 'Vaccines and Sera', 'Quality Control in Microbiology']
              }
            ]
          },
          {
            id: 'vu-dept-chemical-sciences',
            name: 'Department of Chemical Sciences',
            courses: [
              {
                id: 'vu-chem-101',
                code: 'CHM 101',
                title: 'General Chemistry I',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Chemical Sciences',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Fundamental principles of chemistry including atomic structure and bonding.',
                topics: ['Atomic Structure', 'Periodic Table', 'Chemical Bonding', 'Stoichiometry', 'Gas Laws', 'Thermochemistry', 'Solutions', 'Acids and Bases', 'Oxidation-Reduction', 'Laboratory Techniques']
              },
              {
                id: 'vu-chem-102',
                code: 'CHM 102',
                title: 'General Chemistry II',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Chemical Sciences',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Continuation of general chemistry with emphasis on organic and industrial chemistry.',
                topics: ['Organic Chemistry Introduction', 'Hydrocarbons', 'Functional Groups', 'Chemical Kinetics', 'Equilibrium', 'Electrochemistry', 'Nuclear Chemistry', 'Polymers', 'Industrial Chemistry Applications', 'Environmental Chemistry']
              },
              {
                id: 'vu-ich-101',
                code: 'ICH 101',
                title: 'Introduction to Industrial Chemistry',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Chemical Sciences',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Overview of industrial chemical processes and applications.',
                topics: ['What is Industrial Chemistry', 'Raw Materials in Industry', 'Chemical Manufacturing Processes', 'Petroleum Refining', 'Fertilizer Production', 'Pharmaceutical Manufacturing', 'Food Processing', 'Textile Chemistry', 'Paint and Coatings', 'Quality Control']
              },
              {
                id: 'vu-ich-102',
                code: 'ICH 102',
                title: 'Industrial Chemistry II',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Chemical Sciences',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Advanced industrial chemistry processes and environmental considerations.',
                topics: ['Process Chemistry', 'Chemical Engineering Basics', 'Catalysis', 'Green Chemistry', 'Waste Management', 'Water Treatment', 'Air Pollution Control', 'Energy Chemistry', 'Nanotechnology', 'Emerging Trends in Industry']
              }
            ]
          },
          {
            id: 'vu-dept-computer-science-and-mathematics',
            name: 'Department of Computer Science and Mathematics',
            courses: [
              {
                id: 'vu-csc-101',
                code: 'CSC 101',
                title: 'Introduction to Computer Science',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Computer Science and Mathematics',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Fundamental concepts of computer science and computational thinking.',
                topics: ['What is Computer Science', 'History of Computing', 'Number Systems', 'Boolean Logic', 'Computer Architecture', 'Operating Systems', 'Programming Concepts', 'Data Representation', 'Algorithms Introduction', 'Computational Thinking']
              },
              {
                id: 'vu-csc-102',
                code: 'CSC 102',
                title: 'Introduction to Programming',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Computer Science and Mathematics',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Practical introduction to programming using C language.',
                topics: ['Setting Up Development Environment', 'Variables and Data Types', 'Input/Output', 'Control Structures', 'Functions', 'Arrays', 'Pointers Basics', 'Strings', 'File I/O Basics', 'Debugging Techniques']
              },
              {
                id: 'vu-cy-101',
                code: 'CYB 101',
                title: 'Introduction to Cybersecurity',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Computer Science and Mathematics',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Foundational concepts of cybersecurity and information security.',
                topics: ['What is Cybersecurity', 'Cyber Threat Landscape', 'Malware Types', 'Social Engineering', 'Network Security Basics', 'Cryptography Introduction', 'Password Security', 'Phishing and Attacks', 'Data Protection', 'Cyber Laws in Nigeria']
              },
              {
                id: 'vu-cy-102',
                code: 'CYB 102',
                title: 'Cybersecurity Fundamentals',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Computer Science and Mathematics',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Practical cybersecurity skills and defense strategies.',
                topics: ['Security Assessment', 'Vulnerability Analysis', 'Firewall Configuration', 'Intrusion Detection', 'Security Policies', 'Incident Response', 'Digital Forensics Basics', 'Secure Coding', 'Privacy Protection', 'Career in Cybersecurity']
              },
              {
                id: 'vu-mat-101',
                code: 'MAT 101',
                title: 'Elementary Mathematics I',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Computer Science and Mathematics',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Foundational mathematics for science and engineering students.',
                topics: ['Set Theory', 'Logic and Proofs', 'Number Theory', 'Functions and Relations', 'Polynomials', 'Limits and Continuity', 'Differentiation', 'Integration', 'Matrices', 'Applications of Calculus']
              },
              {
                id: 'vu-mat-102',
                code: 'MAT 102',
                title: 'Elementary Mathematics II',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Computer Science and Mathematics',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Continuation of elementary mathematics with advanced topics.',
                topics: ['Further Differentiation', 'Techniques of Integration', 'Differential Equations', 'Sequences and Series', 'Vectors', 'Linear Algebra Introduction', 'Probability Basics', 'Statistics Introduction', 'Mathematical Modeling', 'Applications in Science']
              }
            ]
          },
          {
            id: 'vu-dept-physics',
            name: 'Department of Physics',
            courses: [
              {
                id: 'vu-phy-101',
                code: 'PHY 101',
                title: 'General Physics I',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Physics',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Fundamental concepts of mechanics, heat, and sound.',
                topics: ['Measurement and Units', 'Kinematics', 'Dynamics', 'Work and Energy', 'Momentum', 'Rotational Motion', 'Gravitation', 'Properties of Matter', 'Heat and Temperature', 'Sound Waves']
              },
              {
                id: 'vu-phy-102',
                code: 'PHY 102',
                title: 'General Physics II',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Physics',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Electricity, magnetism, optics, and modern physics.',
                topics: ['Electrostatics', 'Electric Circuits', 'Magnetism', 'Electromagnetic Induction', 'Geometrical Optics', 'Wave Optics', 'Introductory Modern Physics', 'Atomic Models', 'Nuclear Physics Introduction', 'Electronics Basics']
              },
              {
                id: 'vu-phy-103',
                code: 'PHY 103',
                title: 'Physics with Electronics I',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Physics',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Introduction to electronic devices and circuits from a physics perspective.',
                topics: ['Semiconductor Physics', 'Diode Characteristics', 'Transistor Basics', 'Amplifier Circuits', 'Oscillators', 'Digital Electronics Introduction', 'Logic Gates', 'Flip-Flops', 'Counters', 'Electronic Instrumentation']
              },
              {
                id: 'vu-phy-104',
                code: 'PHY 104',
                title: 'Physics with Electronics II',
                faculty: 'Faculty of Basic & Applied Sciences',
                department: 'Physics',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Advanced electronic systems and practical applications.',
                topics: ['Operational Amplifiers', 'Filter Circuits', 'Power Electronics', 'Microprocessor Basics', 'Communication Systems', 'Sensor Technology', 'PCB Design', 'Soldering and Assembly', 'Testing and Measurement', 'Electronic Projects']
              }
            ]
          }
        ]
      },
      {
        id: 'vu-faculty-of-humanities-management-and-social-sciences',
        name: 'Faculty of Humanities, Management & Social Sciences',
        departments: [
          {
            id: 'vu-dept-accounting-and-finance',
            name: 'Department of Accounting & Finance',
            courses: [
              {
                id: 'vu-acc-101',
                code: 'ACC 101',
                title: 'Introduction to Financial Accounting',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Accounting & Finance',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Fundamental principles of financial accounting and bookkeeping.',
                topics: ['Nature and Scope of Accounting', 'Accounting Concepts and Conventions', 'Double Entry System', 'Journal Entries', 'Ledger Posting', 'Trial Balance', 'Cash Book', 'Bank Reconciliation', 'Final Accounts Introduction', 'Accounting for Sole Traders']
              },
              {
                id: 'vu-acc-102',
                code: 'ACC 102',
                title: 'Financial Accounting II',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Accounting & Finance',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Continuation of financial accounting with partnerships and company accounts.',
                topics: ['Partnership Accounts', 'Company Accounts', 'Issue of Shares', 'Depreciation Accounting', 'Inventory Valuation', 'Control Accounts', 'Rectification of Errors', 'Consignment Accounts', 'Joint Ventures', 'Introduction to Management Accounting']
              },
              {
                id: 'vu-bFN-101',
                code: 'BFN 101',
                title: 'Introduction to Banking and Finance',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Accounting & Finance',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Overview of banking systems and financial institutions.',
                topics: ['Evolution of Banking', 'Types of Banks', 'Commercial Banking Operations', 'Central Bank of Nigeria', 'Financial Institutions', 'Money Markets', 'Capital Markets', 'Electronic Banking', 'Risk Management Basics', 'Financial Regulation']
              },
              {
                id: 'vu-bFN-102',
                code: 'BFN 102',
                title: 'Banking and Finance II',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Accounting & Finance',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Advanced banking operations and financial systems.',
                topics: ['Credit Management', 'Foreign Exchange', 'Treasury Operations', 'Investment Banking', 'Insurance Principles', 'Pension Fund Administration', 'Microfinance Banking', 'Fintech and Digital Banking', 'Financial Analysis', 'Ethics in Banking']
              }
            ]
          },
          {
            id: 'vu-dept-business-administration',
            name: 'Department of Business Administration',
            courses: [
              {
                id: 'vu-bus-101',
                code: 'BUS 101',
                title: 'Introduction to Business Administration',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Business Administration',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Fundamental concepts of business management and administration.',
                topics: ['What is Business', 'Types of Business Organizations', 'Functions of Management', 'Planning and Decision Making', 'Organizational Structure', 'Leadership Basics', 'Human Resource Management', 'Marketing Introduction', 'Business Ethics', 'Nigerian Business Environment']
              },
              {
                id: 'vu-bus-102',
                code: 'BUS 102',
                title: 'Principles of Management',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Business Administration',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Core principles and theories of management.',
                topics: ['Management Theories', 'Planning Process', 'Organizing Functions', 'Staffing and Directing', 'Controlling Mechanisms', 'Communication in Organizations', 'Motivation Theories', 'Group Dynamics', 'Change Management', 'Total Quality Management']
              },
              {
                id: 'vu-ent-101',
                code: 'ENT 101',
                title: 'Introduction to Entrepreneurship',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Business Administration',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Foundational concepts of entrepreneurship and new venture creation.',
                topics: ['What is Entrepreneurship', 'Entrepreneurial Mindset', 'Opportunity Identification', 'Business Plan Development', 'Sources of Funding', 'Risk Management', 'Small Business Management', 'Innovation and Creativity', 'Legal Requirements in Nigeria', 'Case Studies of Nigerian Entrepreneurs']
              },
              {
                id: 'vu-ent-102',
                code: 'ENT 102',
                title: 'Entrepreneurship Skills',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Business Administration',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Practical skills for starting and managing a business.',
                topics: ['Market Research', 'Customer Analysis', 'Financial Planning', 'Budgeting and Costing', 'Marketing Strategies', 'Sales Techniques', 'Networking', 'Time Management', 'Negotiation Skills', 'Business Registration Process']
              },
              {
                id: 'vu-mkt-101',
                code: 'MKT 101',
                title: 'Introduction to Marketing',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Business Administration',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Basic concepts and principles of marketing.',
                topics: ['What is Marketing', 'Marketing Mix', 'Consumer Behavior', 'Market Segmentation', 'Product Planning', 'Pricing Strategies', 'Distribution Channels', 'Promotion Methods', 'Digital Marketing Introduction', 'Marketing in Nigeria']
              }
            ]
          },
          {
            id: 'vu-dept-economics',
            name: 'Department of Economics',
            courses: [
              {
                id: 'vu-eco-101',
                code: 'ECO 101',
                title: 'Principles of Economics I',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Economics',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Fundamental concepts of microeconomics.',
                topics: ['What is Economics', 'Scarcity and Choice', 'Demand and Supply', 'Elasticity', 'Consumer Behaviour', 'Theory of Production', 'Market Structures', 'Factor Pricing', 'National Income Basics', 'Economic Systems']
              },
              {
                id: 'vu-eco-102',
                code: 'ECO 102',
                title: 'Principles of Economics II',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Economics',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Fundamental concepts of macroeconomics.',
                topics: ['National Income Accounting', 'Money and Banking', 'Inflation and Deflation', 'Unemployment', 'Fiscal Policy', 'Monetary Policy', 'International Trade', 'Balance of Payments', 'Economic Development', 'Nigerian Economic Issues']
              },
              {
                id: 'vu-eco-103',
                code: 'ECO 103',
                title: 'Economics of Development',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Economics',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Introduction to development economics with focus on developing nations.',
                topics: ['What is Development', 'Development Indicators', 'Theories of Development', 'Poverty and Inequality', 'Human Capital Development', 'Agricultural Development', 'Industrialization Strategies', 'Foreign Aid', 'Debt and Development', 'African Economic Challenges']
              }
            ]
          },
          {
            id: 'vu-dept-history',
            name: 'Department of History',
            courses: [
              {
                id: 'vu-his-101',
                code: 'HIS 101',
                title: 'Introduction to History',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'History',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Fundamental concepts and methods of historical study.',
                topics: ['What is History', 'Sources of History', 'Historical Methods', 'Ancient Civilizations', 'Medieval History', 'Modern History', 'Nigerian History Introduction', 'West African History', 'Colonialism in Africa', 'Historiography']
              },
              {
                id: 'vu-ir-101',
                code: 'IR 101',
                title: 'Introduction to International Relations',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'History',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Basic concepts of international relations and global politics.',
                topics: ['What is International Relations', 'Theories of IR', 'State and Non-State Actors', 'Diplomacy', 'International Organizations', 'United Nations System', 'African Union', 'International Law', 'Conflict and Peace', 'Nigerian Foreign Policy']
              },
              {
                id: 'vu-his-102',
                code: 'HIS 102',
                title: 'History of Nigeria',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'History',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Comprehensive survey of Nigerian history from prehistoric times.',
                topics: ['Pre-Historic Nigeria', 'Nigerian Kingdoms', 'Hausa-Fulani Empire', 'Yoruba Kingdoms', 'Benin Kingdom', 'Igbo Society', 'Trans-Saharan Trade', 'Atlantic Slave Trade', 'British Colonialism', 'Independence Movement']
              },
              {
                id: 'vu-ir-102',
                code: 'IR 102',
                title: 'International Relations II',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'History',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Continuation of international relations with contemporary issues.',
                topics: ['Cold War and After', 'Globalization', 'Regional Integration', 'ECOWAS', 'Trade and Development', 'Human Rights', 'Environmental Politics', 'Terrorism and Security', 'Nigeria in Global Affairs', 'Diplomatic Practice']
              }
            ]
          },
          {
            id: 'vu-dept-languages',
            name: 'Department of Languages',
            courses: [
              {
                id: 'vu-eng-101',
                code: 'ENG 101',
                title: 'Communicative English I',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Languages',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Development of academic writing and communication skills.',
                topics: ['Grammar Review', 'Essay Writing', 'Comprehension Skills', 'Summary and Paraphrase', 'Vocabulary Development', 'Punctuation and Usage', 'Academic Writing', 'Letter Writing', 'Oral Communication', 'Study Skills']
              },
              {
                id: 'vu-eng-102',
                code: 'ENG 102',
                title: 'Communicative English II',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Languages',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Advanced communication skills for academic and professional contexts.',
                topics: ['Advanced Grammar', 'Technical Writing', 'Report Writing', 'Public Speaking', 'Debate Skills', 'Presentation Skills', 'Creative Writing', 'Language and Society', 'Research Writing', 'Communication Barriers']
              },
              {
                id: 'vu-eng-103',
                code: 'ENG 103',
                title: 'Introduction to Literature',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Languages',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Introduction to literary appreciation and analysis.',
                topics: ['What is Literature', 'Genres of Literature', 'Elements of Fiction', 'Poetry Analysis', 'Drama and Theatre', 'African Literature', 'Nigerian Literature', 'Literary Criticism', 'Prose Fiction', 'Literary Devices']
              }
            ]
          },
          {
            id: 'vu-dept-mass-communication',
            name: 'Department of Mass Communication',
            courses: [
              {
                id: 'vu-mcm-101',
                code: 'MCM 101',
                title: 'Introduction to Mass Communication',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Mass Communication',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Foundational concepts of mass media and communication.',
                topics: ['What is Mass Communication', 'Evolution of Mass Media', 'Print Media', 'Broadcast Media', 'Digital Media', 'Communication Theories', 'Media and Society', 'Journalism Ethics', 'Media Effects', 'Nigerian Media Landscape']
              },
              {
                id: 'vu-mcm-102',
                code: 'MCM 102',
                title: 'Introduction to Journalism',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Mass Communication',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Principles and practices of journalism.',
                topics: ['News Writing', 'News Values', 'Reporting Techniques', 'Interviewing Skills', 'Feature Writing', 'Press Freedom', 'Media Law', 'Investigative Journalism', 'Citizen Journalism', 'Digital Journalism']
              },
              {
                id: 'vu-mcm-103',
                code: 'MCM 103',
                title: 'Media and Society',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Mass Communication',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 2,
                description: 'Role of media in society and its effects on audiences.',
                topics: ['Media Functions', 'Agenda Setting', 'Framing Theory', 'Media Bias', 'Propaganda', 'Social Media Impact', 'Media Literacy', 'Cultural Imperialism', 'Development Communication', 'Media Regulation in Nigeria']
              }
            ]
          },
          {
            id: 'vu-dept-sociology',
            name: 'Department of Sociology',
            courses: [
              {
                id: 'vu-soc-101',
                code: 'SOC 101',
                title: 'Introduction to Sociology',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Sociology',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Basic concepts and principles of sociology.',
                topics: ['What is Sociology', 'Sociological Imagination', 'Social Stratification', 'Culture and Society', 'Social Institutions', 'Socialization', 'Social Change', 'Deviance and Control', 'Gender and Society', 'Nigerian Society']
              },
              {
                id: 'vu-soc-102',
                code: 'SOC 102',
                title: 'Introduction to Criminology',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Sociology',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Foundational concepts of criminology and criminal justice.',
                topics: ['What is Criminology', 'Theories of Crime', 'Types of Crime', 'Criminal Justice System', 'Law Enforcement', 'Courts and Judiciary', 'Correctional Systems', 'Juvenile Delinquency', 'Cybercrime in Nigeria', 'Crime Prevention']
              },
              {
                id: 'vu-soc-103',
                code: 'SOC 103',
                title: 'Security Studies',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Sociology',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Introduction to security concepts and security challenges.',
                topics: ['What is Security', 'National Security', 'Human Security', 'Internal Security', 'External Security', 'Intelligence Gathering', 'Terrorism and Counter-Terrorism', 'Border Security', 'Cybersecurity', 'Nigerian Security Challenges']
              },
              {
                id: 'vu-soc-104',
                code: 'SOC 104',
                title: 'Criminology and Society',
                faculty: 'Faculty of Humanities, Management & Social Sciences',
                department: 'Sociology',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Relationship between crime and social structures.',
                topics: ['Social Disorganization', 'Strain Theory', 'Learning Theory', 'Control Theory', 'Labeling Theory', 'Victimology', 'White Collar Crime', 'Organized Crime', 'Drug Abuse', 'Rehabilitation and Reintegration']
              }
            ]
          }
        ]
      },
      {
        id: 'vu-faculty-of-basic-and-medical-sciences',
        name: 'Faculty of Basic & Medical Sciences',
        departments: [
          {
            id: 'vu-dept-nursing-science',
            name: 'Department of Nursing Science',
            courses: [
              {
                id: 'vu-nsc-101',
                code: 'NSC 101',
                title: 'Introduction to Nursing Science',
                faculty: 'Faculty of Basic & Medical Sciences',
                department: 'Nursing Science',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Foundational concepts of nursing as a profession and discipline.',
                topics: ['History of Nursing', 'Nursing as a Profession', 'Nursing Theories', 'Patient Care Basics', 'Vital Signs', 'Hygiene and Infection Control', 'First Aid', 'Medical Terminology', 'Ethics in Nursing', 'Nursing in Nigeria']
              },
              {
                id: 'vu-nsc-102',
                code: 'NSC 102',
                title: 'Anatomy and Physiology I',
                faculty: 'Faculty of Basic & Medical Sciences',
                department: 'Nursing Science',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Basic anatomy and physiology for nursing students.',
                topics: ['Cell and Tissue', 'Skeletal System', 'Muscular System', 'Integumentary System', 'Cardiovascular System', 'Blood and Blood Groups', 'Body Organization', 'Homeostasis', 'Basic Pathology', 'Clinical Assessment Basics']
              },
              {
                id: 'vu-nsc-103',
                code: 'NSC 103',
                title: 'Anatomy and Physiology II',
                faculty: 'Faculty of Basic & Medical Sciences',
                department: 'Nursing Science',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Continuation of anatomy and physiology for nursing.',
                topics: ['Nervous System', 'Endocrine System', 'Respiratory System', 'Digestive System', 'Urinary System', 'Reproductive System', 'Immune System', 'Special Senses', 'Growth and Development', 'Pharmacology Basics']
              },
              {
                id: 'vu-nsc-104',
                code: 'NSC 104',
                title: 'Fundamentals of Nursing Care',
                faculty: 'Faculty of Basic & Medical Sciences',
                department: 'Nursing Science',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Basic nursing skills and patient care techniques.',
                topics: ['Nursing Process', 'Patient Assessment', 'Documentation', 'Medication Administration', 'Wound Care', 'Diet and Nutrition', 'Bed Making', 'Patient Safety', 'Communication with Patients', 'Teamwork in Healthcare']
              }
            ]
          },
          {
            id: 'vu-dept-medical-laboratory-science',
            name: 'Department of Medical Laboratory Science',
            courses: [
              {
                id: 'vu-mls-101',
                code: 'MLS 101',
                title: 'Introduction to Medical Laboratory Science',
                faculty: 'Faculty of Basic & Medical Sciences',
                department: 'Medical Laboratory Science',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Overview of medical laboratory science and its role in healthcare.',
                topics: ['What is Medical Laboratory Science', 'History of Laboratory Medicine', 'Laboratory Safety', 'Specimen Collection', 'Basic Laboratory Techniques', 'Microscopy', 'Quality Assurance', 'Laboratory Ethics', 'Healthcare Team Role', 'Career in MLS']
              },
              {
                id: 'vu-mls-102',
                code: 'MLS 102',
                title: 'General Chemistry for MLS',
                faculty: 'Faculty of Basic & Medical Sciences',
                department: 'Medical Laboratory Science',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Chemistry fundamentals applicable to medical laboratory work.',
                topics: ['Atomic Structure', 'Chemical Bonding', 'Acids and Bases', 'Buffer Solutions', 'Solutions and Concentrations', 'Chemical Reactions', 'Electrochemistry', 'Spectrophotometry', 'Chromatography', 'Clinical Chemistry Basics']
              },
              {
                id: 'vu-mls-103',
                code: 'MLS 103',
                title: 'Anatomy and Histology I',
                faculty: 'Faculty of Basic & Medical Sciences',
                department: 'Medical Laboratory Science',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Basic anatomy and histological techniques for laboratory scientists.',
                topics: ['Cell Biology', 'Tissue Types', 'Epithelial Tissues', 'Connective Tissues', 'Muscle Tissues', 'Nervous Tissues', 'Organ Systems Overview', 'Microscopy Techniques', 'Tissue Preparation', 'Staining Methods']
              },
              {
                id: 'vu-mls-104',
                code: 'MLS 104',
                title: 'Anatomy and Histology II',
                faculty: 'Faculty of Basic & Medical Sciences',
                department: 'Medical Laboratory Science',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Continuation of anatomy and histology for laboratory practice.',
                topics: ['Organ Histology', 'Digestive System Histology', 'Cardiovascular Histology', 'Respiratory Histology', 'Urinary Histology', 'Reproductive Histology', 'Nervous System Histology', 'Endocrine Glands', 'Immune System Histology', 'Pathological Changes']
              },
              {
                id: 'vu-mls-105',
                code: 'MLS 105',
                title: 'General Biology for MLS',
                faculty: 'Faculty of Basic & Medical Sciences',
                department: 'Medical Laboratory Science',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Biology fundamentals for medical laboratory scientists.',
                topics: ['Cell Biology', 'Microbiology Introduction', 'Parasitology Basics', 'Immunology Introduction', 'Blood Biology', 'Genetics Basics', 'Molecular Biology', 'Biotechnology Applications', 'Lab Animal Biology', 'Disease Mechanisms']
              }
            ]
          },
          {
            id: 'vu-dept-public-health',
            name: 'Department of Public Health',
            courses: [
              {
                id: 'vu-pha-101',
                code: 'PHA 101',
                title: 'Introduction to Public Health',
                faculty: 'Faculty of Basic & Medical Sciences',
                department: 'Public Health',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Overview of public health principles and practice.',
                topics: ['What is Public Health', 'History of Public Health', 'Epidemiology Basics', 'Disease Prevention', 'Health Promotion', 'Environmental Health', 'Community Health', 'Biostatistics Introduction', 'Health Policy', 'Public Health in Nigeria']
              },
              {
                id: 'vu-pha-102',
                code: 'PHA 102',
                title: 'Human Anatomy for Public Health',
                faculty: 'Faculty of Basic & Medical Sciences',
                department: 'Public Health',
                university: 'Vision University',
                level: 100,
                semester: 1,
                units: 3,
                description: 'Basic anatomy relevant to public health practice.',
                topics: ['Body Systems Overview', 'Cardiovascular System', 'Respiratory System', 'Digestive System', 'Nervous System', 'Immune System', 'Musculoskeletal System', 'Endocrine System', 'Reproductive System', 'Health Assessment']
              },
              {
                id: 'vu-pha-103',
                code: 'PHA 103',
                title: 'Human Physiology for Public Health',
                faculty: 'Faculty of Basic & Medical Sciences',
                department: 'Public Health',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Basic physiology relevant to public health.',
                topics: ['Cellular Physiology', 'Cardiac Physiology', 'Respiratory Physiology', 'Renal Physiology', 'Digestive Physiology', 'Nerve Physiology', 'Muscle Physiology', 'Endocrine Physiology', 'Reproductive Physiology', 'Homeostasis and Disease']
              },
              {
                id: 'vu-pha-104',
                code: 'PHA 104',
                title: 'Community Health',
                faculty: 'Faculty of Basic & Medical Sciences',
                department: 'Public Health',
                university: 'Vision University',
                level: 100,
                semester: 2,
                units: 3,
                description: 'Principles and practices of community health services.',
                topics: ['Community Health Concept', 'Primary Health Care', 'Health Education', 'Disease Surveillance', 'Immunization Programs', 'Maternal and Child Health', 'Water and Sanitation', 'Vector Control', 'Community Health Workers', 'Health System in Nigeria']
              }
            ]
          }
        ]
      }
    ]
  }`;

// Write the updated file
const updated = beforeVU + '\n' + newVU + '\n];\n\n' + gstSection;
fs.writeFileSync('src/data/courses.ts', updated);
console.log('Done! New VU section written.');
console.log('New file has', updated.split('\n').length, 'lines');
