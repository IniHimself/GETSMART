const fs = require('fs');
const path = require('path');

const rawData = JSON.parse(fs.readFileSync('C:\\Users\\VP\\Documents\\scraper\\RUN_All_Departments_100L.json', 'utf8'));

// Faculty mapping for RUN departments
const FACULTY_MAP = {
  'ACCOUNTING': { faculty: 'Faculty of Management Sciences', deptId: 'run-accounting' },
  'ACTUARIAL SCIENCE': { faculty: 'Faculty of Management Sciences', deptId: 'run-actuarial-science' },
  'APPLIED BIO - ENVIRONM': { faculty: 'Faculty of Natural Sciences', deptId: 'run-applied-bio-env' },
  'APPLIED BIOLOGY AND GENETICS': { faculty: 'Faculty of Natural Sciences', deptId: 'run-applied-biology' },
  'APPLIED GEOPHYSICS': { faculty: 'Faculty of Natural Sciences', deptId: 'run-applied-geophysics' },
  'ARCHITECTURE': { faculty: 'Faculty of Built Environment', deptId: 'run-architecture' },
  'BANKING AND FINANCE': { faculty: 'Faculty of Management Sciences', deptId: 'run-banking-finance' },
  'BIOCHEMISTRY': { faculty: 'Faculty of Basic Medical Sciences', deptId: 'run-biochemistry' },
  'BIOTECHNOLOGY': { faculty: 'Faculty of Natural Sciences', deptId: 'run-biotechnology' },
  'BUILDING TECHNOLOGY': { faculty: 'Faculty of Built Environment', deptId: 'run-building-technology' },
  'BUSINESS ADMINISTRATION': { faculty: 'Faculty of Management Sciences', deptId: 'run-business-admin' },
  'CHEMICAL ENGINEERING': { faculty: 'Faculty of Engineering', deptId: 'run-chemical-engineering' },
  'CHRISTIAN RELIGIOUS STUDIES': { faculty: 'Faculty of Humanities', deptId: 'run-crs' },
  'CIVIL ENGINEERING': { faculty: 'Faculty of Engineering', deptId: 'run-civil-engineering' },
  'CLINICAL PSYCHOLOGY': { faculty: 'Faculty of Basic Medical Sciences', deptId: 'run-clinical-psychology' },
  'COMMUNICATION PHYSICS': { faculty: 'Faculty of Natural Sciences', deptId: 'run-communication-physics' },
  'COMPUTER ENGINEERING': { faculty: 'Faculty of Engineering', deptId: 'run-computer-engineering' },
  'COMPUTER SCIENCE': { faculty: 'Faculty of Computing and Digital Technology', deptId: 'run-computer-science' },
  'CYBER SECURITY': { faculty: 'Faculty of Computing and Digital Technology', deptId: 'run-cyber-security' },
  'ECONOMICS': { faculty: 'Faculty of Social Sciences', deptId: 'run-economics' },
  'EDUCATIONAL MANAGEMENT': { faculty: 'Faculty of Education', deptId: 'run-educational-management' },
  'EDUCATIONAL TECHNOLOGY': { faculty: 'Faculty of Education', deptId: 'run-educational-technology' },
  'ELECTRICAL AND ELECTRONIC ENGINEERING': { faculty: 'Faculty of Engineering', deptId: 'run-eee' },
  'ENGLISH': { faculty: 'Faculty of Humanities', deptId: 'run-english' },
  'ENGLISH (LANGUAGE EMPHASIS)': { faculty: 'Faculty of Humanities', deptId: 'run-english-lang' },
  'ENGLISH (LITERATURE EMPHASIS)': { faculty: 'Faculty of Humanities', deptId: 'run-english-lit' },
  'ENVIRONMENTAL MANAGEMENT AND TOXICOLOGY': { faculty: 'Faculty of Natural Sciences', deptId: 'run-env-mgmt-tox' },
  'ESTATE MANAGEMENT': { faculty: 'Faculty of Built Environment', deptId: 'run-estate-mgmt' },
  'FRENCH': { faculty: 'Faculty of Humanities', deptId: 'run-french' },
  'GEOLOGY': { faculty: 'Faculty of Natural Sciences', deptId: 'run-geology' },
  'HIR': { faculty: 'Faculty of Humanities', deptId: 'run-hir' },
  'HISTORY & INTL. STUDIES': { faculty: 'Faculty of Humanities', deptId: 'run-history' },
  'HOSPITALITY AND TOURISM MANAGEMENT': { faculty: 'Faculty of Management Sciences', deptId: 'run-hospitality-tourism' },
  'HUMAN ANATOMY': { faculty: 'Faculty of Basic Medical Sciences', deptId: 'run-human-anatomy' },
  'HUMAN PHYSIOLOGY': { faculty: 'Faculty of Basic Medical Sciences', deptId: 'run-human-physiology' },
  'INDUSTRIAL CHEMISTRY': { faculty: 'Faculty of Natural Sciences', deptId: 'run-industrial-chemistry' },
  'INDUSTRIAL MATHEMATICS': { faculty: 'Faculty of Natural Sciences', deptId: 'run-industrial-maths' },
  'INDUSTRIAL MATHEMATICS AND COMPUTER SCIENCE': { faculty: 'Faculty of Natural Sciences', deptId: 'run-industrial-maths-cs' },
  'INDUSTRIAL TECHNOLOGY EDUCATION': { faculty: 'Faculty of Education', deptId: 'run-industrial-tech-edu' },
  'INFORMATION TECHNOLOGY': { faculty: 'Faculty of Computing and Digital Technology', deptId: 'run-information-tech' },
  'INSURANCE': { faculty: 'Faculty of Management Sciences', deptId: 'run-insurance' },
  'LAW': { faculty: 'Faculty of Law', deptId: 'run-law' },
  'LIBRARY AND INFORMATION SCIENCE': { faculty: 'Faculty of Education', deptId: 'run-library-info-science' },
  'MANAGERIAL PSYCHOLOGY': { faculty: 'Faculty of Social Sciences', deptId: 'run-managerial-psychology' },
  'MARKETING': { faculty: 'Faculty of Management Sciences', deptId: 'run-marketing' },
  'MASS COMM': { faculty: 'Faculty of Humanities', deptId: 'run-mass-comm' },
  'MASTER BUSINESS ADMINISTRATION(MBA)': { faculty: 'Faculty of Management Sciences', deptId: 'run-mba' },
};

// GST courses that are shared
const GST_COURSES = [
  { code: 'GST 111', title: 'COMMUNICATION SKILLS IN ENGLISH I', semester: 1 },
  { code: 'GST 112', title: 'NIGERIAN PEOPLE AND CULTURE', semester: 2 },
  { code: 'GST 114', title: 'COMMUNICATION SKILLS IN ENGLISH II', semester: 2 },
  { code: 'GST 107', title: 'SCIENCE, TECHNOLOGY & HEALTH STUDIES', semester: 1 },
];

function generateCourseId(code, dept) {
  return `run-${dept.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}-${code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
}

function generateTopics(title) {
  // Generate reasonable topics based on course title
  const base = title.replace(/^(INTRODUCTION TO |PRINCIPLES OF |GENERAL |ELEMENTARY )/i, '').trim();
  return [
    `Introduction to ${base}`,
    `Fundamentals of ${base}`,
    `Key Concepts in ${base}`,
    `Historical Development`,
    `Core Principles`,
    `Practical Applications`,
    `Modern Trends`,
    `Case Studies`,
    `Review and Assessment`,
    `Summary and Conclusion`
  ];
}

function getFacultyName(deptName) {
  const mapping = FACULTY_MAP[deptName];
  return mapping ? mapping.faculty : 'Faculty of General Studies';
}

function getDeptId(deptName) {
  const mapping = FACULTY_MAP[deptName];
  return mapping ? mapping.deptId : deptName.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

// Build the courses structure
const facultyMap = {};

for (const [deptName, semesters] of Object.entries(rawData)) {
  const facultyName = getFacultyName(deptName);
  const deptId = getDeptId(deptName);
  
  if (!facultyMap[facultyName]) {
    facultyMap[facultyName] = {};
  }
  
  if (!facultyMap[facultyName][deptName]) {
    facultyMap[facultyName][deptName] = { id: deptId, courses: [] };
  }
  
  // Process First Semester
  if (semesters['First Semester']) {
    const compulsory = semesters['First Semester'].Compulsory || [];
    const elective = semesters['First Semester'].Elective || [];
    
    [...compulsory, ...elective].forEach(course => {
      // Skip GST and shared courses - they go to the GST section
      if (course.code.startsWith('GST') || course.code.startsWith('FIC') || 
          course.code.startsWith('TVET') || course.code.startsWith('GIT')) {
        return;
      }
      
      const existing = facultyMap[facultyName][deptName].courses.find(c => c.code === course.code);
      if (!existing) {
        facultyMap[facultyName][deptName].courses.push({
          id: generateCourseId(course.code, deptName),
          code: course.code,
          title: course.title,
          units: parseInt(course.units) || 3,
          semester: 1,
          topics: generateTopics(course.title)
        });
      }
    });
  }
  
  // Process Second Semester
  if (semesters['Second Semester']) {
    const compulsory = semesters['Second Semester'].Compulsory || [];
    const elective = semesters['Second Semester'].Elective || [];
    
    [...compulsory, ...elective].forEach(course => {
      if (course.code.startsWith('GST') || course.code.startsWith('FIC') || 
          course.code.startsWith('TVET') || course.code.startsWith('GIT')) {
        return;
      }
      
      const existing = facultyMap[facultyName][deptName].courses.find(c => c.code === course.code);
      if (!existing) {
        facultyMap[facultyName][deptName].courses.push({
          id: generateCourseId(course.code, deptName),
          code: course.code,
          title: course.title,
          units: parseInt(course.units) || 3,
          semester: 2,
          topics: generateTopics(course.title)
        });
      }
    });
  }
}

// Generate TypeScript output
let output = `export interface Course {
  id: string;
  code: string;
  title: string;
  faculty: string;
  department: string;
  university: string;
  level: 100;
  semester: 1 | 2;
  units: number;
  description: string;
  topics: string[];
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  faculties: Faculty[];
}

export interface Faculty {
  id: string;
  name: string;
  departments: Department[];
}

export interface Department {
  id: string;
  name: string;
  courses: Course[];
}

export const UNIVERSITIES: University[] = [
  {
    id: 'run',
    name: "Redeemer's University",
    shortName: 'RUN',
    faculties: [
`;

const facultyEntries = Object.entries(facultyMap);
facultyEntries.forEach(([facultyName, depts], fi) => {
  output += `      {\n`;
  output += `        id: '${facultyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}',\n`;
  output += `        name: '${facultyName}',\n`;
  output += `        departments: [\n`;
  
  const deptEntries = Object.entries(depts);
  deptEntries.forEach(([deptName, deptData], di) => {
    output += `          {\n`;
    output += `            id: '${deptData.id}',\n`;
    output += `            name: '${deptName}',\n`;
    output += `            courses: [\n`;
    
    deptData.courses.forEach((course, ci) => {
      const description = `Study of ${course.title.toLowerCase()} concepts and principles.`;
      output += `              {\n`;
      output += `                id: '${course.id}',\n`;
      output += `                code: '${course.code}',\n`;
      output += `                title: '${course.title.replace(/'/g, "\\'")}',\n`;
      output += `                faculty: '${facultyName.replace(/'/g, "\\'")}',\n`;
      output += `                department: '${deptName.replace(/'/g, "\\'")}',\n`;
      output += `                university: "Redeemer's University",\n`;
      output += `                level: 100,\n`;
      output += `                semester: ${course.semester},\n`;
      output += `                units: ${course.units},\n`;
      output += `                description: '${description.replace(/'/g, "\\'")}',\n`;
      output += `                topics: [${course.topics.map(t => `'${t.replace(/'/g, "\\'")}'`).join(', ')}]\n`;
      output += `              }${ci < deptData.courses.length - 1 ? ',' : ''}\n`;
    });
    
    output += `            ]\n`;
    output += `          }${di < deptEntries.length - 1 ? ',' : ''}\n`;
  });
  
  output += `        ]\n`;
  output += `      }${fi < facultyEntries.length - 1 ? ',' : ''}\n`;
});

output += `    ]
  },
  {
    id: 'vu',
    name: 'Vision University',
    shortName: 'VU',
    faculties: [
`;

// For Vision University, use the same data temporarily
facultyEntries.forEach(([facultyName, depts], fi) => {
  output += `      {\n`;
  output += `        id: 'vu-${facultyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}',\n`;
  output += `        name: '${facultyName}',\n`;
  output += `        departments: [\n`;
  
  const deptEntries = Object.entries(depts);
  deptEntries.forEach(([deptName, deptData], di) => {
    output += `          {\n`;
    output += `            id: 'vu-${deptData.id}',\n`;
    output += `            name: '${deptName}',\n`;
    output += `            courses: [\n`;
    
    deptData.courses.forEach((course, ci) => {
      const description = `Study of ${course.title.toLowerCase()} concepts and principles.`;
      output += `              {\n`;
      output += `                id: 'vu-${course.id}',\n`;
      output += `                code: '${course.code}',\n`;
      output += `                title: '${course.title.replace(/'/g, "\\'")}',\n`;
      output += `                faculty: '${facultyName.replace(/'/g, "\\'")}',\n`;
      output += `                department: '${deptName.replace(/'/g, "\\'")}',\n`;
      output += `                university: 'Vision University',\n`;
      output += `                level: 100,\n`;
      output += `                semester: ${course.semester},\n`;
      output += `                units: ${course.units},\n`;
      output += `                description: '${description.replace(/'/g, "\\'")}',\n`;
      output += `                topics: [${course.topics.map(t => `'${t.replace(/'/g, "\\'")}'`).join(', ')}]\n`;
      output += `              }${ci < deptData.courses.length - 1 ? ',' : ''}\n`;
    });
    
    output += `            ]\n`;
    output += `          }${di < deptEntries.length - 1 ? ',' : ''}\n`;
  });
  
  output += `        ]\n`;
  output += `      }${fi < facultyEntries.length - 1 ? ',' : ''}\n`;
});

output += `    ]
  }
];

export const GST_COURSES: Course[] = [
  // GST 100 Level - Semester 1
  { id: 'gst-run-111', code: 'GST 111', title: 'Communication Skills in English I', faculty: 'General Studies', department: 'General Studies', university: 'run', level: 100, semester: 1, units: 2, description: 'Effective communication and writing skills in English for academic purposes.', topics: ['Parts of Speech', 'Sentence Structure', 'Essay Writing', 'Comprehension', 'Summary Skills', 'Punctuation', 'Vocabulary', 'Academic Writing', 'Report Writing', 'Critical Reading'] },
  { id: 'gst-run-107', code: 'GST 107', title: 'Science, Technology & Health Studies', faculty: 'General Studies', department: 'General Studies', university: 'run', level: 100, semester: 1, units: 2, description: 'Overview of science, technology and health in Nigerian society.', topics: ['Scientific Method', 'Technology in Nigeria', 'Health Awareness', 'Environmental Science', 'Digital Literacy', 'Innovation', 'Sustainable Development', 'Public Health', 'Science and Society', 'Research Ethics'] },
  { id: 'gst-vu-111', code: 'GST 111', title: 'Communication Skills in English I', faculty: 'General Studies', department: 'General Studies', university: 'vu', level: 100, semester: 1, units: 2, description: 'Effective communication and writing skills in English for academic purposes.', topics: ['Parts of Speech', 'Sentence Structure', 'Essay Writing', 'Comprehension', 'Summary Skills', 'Punctuation', 'Vocabulary', 'Academic Writing', 'Report Writing', 'Critical Reading'] },
  { id: 'gst-vu-107', code: 'GST 107', title: 'Science, Technology & Health Studies', faculty: 'General Studies', department: 'General Studies', university: 'vu', level: 100, semester: 1, units: 2, description: 'Overview of science, technology and health in Nigerian society.', topics: ['Scientific Method', 'Technology in Nigeria', 'Health Awareness', 'Environmental Science', 'Digital Literacy', 'Innovation', 'Sustainable Development', 'Public Health', 'Science and Society', 'Research Ethics'] },
  // GST 100 Level - Semester 2
  { id: 'gst-run-112', code: 'GST 112', title: 'Nigerian Peoples and Culture', faculty: 'General Studies', department: 'General Studies', university: 'run', level: 100, semester: 2, units: 2, description: 'Study of Nigerian history, culture and arts.', topics: ['Pre-colonial History', 'Major Ethnic Groups', 'Culture Areas', 'Evolution as Political Unit', 'Amalgamation of 1914', 'Colonial Administration', 'Independence Movement', 'Trade and Self-Reliance', 'Social Justice', 'Nigerian Norms and Values'] },
  { id: 'gst-run-114', code: 'GST 114', title: 'Communication Skills in English II', faculty: 'General Studies', department: 'General Studies', university: 'run', level: 100, semester: 2, units: 1, description: 'Advanced communication skills for academic and professional contexts.', topics: ['Phonetics', 'Word Formation', 'Figures of Speech', 'Public Speaking', 'Logical Presentation', 'Technical Report Writing', 'Précis Writing', 'Debate Skills', 'Language and Society', 'Communication Barriers'] },
  { id: 'gst-vu-112', code: 'GST 112', title: 'Nigerian Peoples and Culture', faculty: 'General Studies', department: 'General Studies', university: 'vu', level: 100, semester: 2, units: 2, description: 'Study of Nigerian history, culture and arts.', topics: ['Pre-colonial History', 'Major Ethnic Groups', 'Culture Areas', 'Evolution as Political Unit', 'Amalgamation of 1914', 'Colonial Administration', 'Independence Movement', 'Trade and Self-Reliance', 'Social Justice', 'Nigerian Norms and Values'] },
  { id: 'gst-vu-114', code: 'GST 114', title: 'Communication Skills in English II', faculty: 'General Studies', department: 'General Studies', university: 'vu', level: 100, semester: 2, units: 1, description: 'Advanced communication skills for academic and professional contexts.', topics: ['Phonetics', 'Word Formation', 'Figures of Speech', 'Public Speaking', 'Logical Presentation', 'Technical Report Writing', 'Précis Writing', 'Debate Skills', 'Language and Society', 'Communication Barriers'] },
  // Shared GST (FIC, TVET, GIT)
  { id: 'gst-run-fic101', code: 'FIC 101', title: 'Foundational Truths', faculty: 'General Studies', department: 'General Studies', university: 'run', level: 100, semester: 1, units: 2, description: 'Core foundational principles for academic and personal development.', topics: ['Values and Ethics', 'Critical Thinking', 'Personal Development', 'Faith and Reason', 'Worldview', 'Academic Integrity', 'Leadership', 'Communication', 'Time Management', 'Goal Setting'] },
  { id: 'gst-run-fic102', code: 'FIC 102', title: 'Christian Spiritual Formation and Discipleship', faculty: 'General Studies', department: 'General Studies', university: 'run', level: 100, semester: 2, units: 2, description: 'Spiritual growth and Christian discipleship principles.', topics: ['Spiritual Growth', 'Biblical Foundations', 'Prayer Life', 'Christian Ethics', 'Discipleship', 'Fellowship', 'Service', 'Witnessing', 'Spiritual Disciplines', 'Christian Living'] },
  { id: 'gst-vu-fic101', code: 'FIC 101', title: 'Foundational Truths', faculty: 'General Studies', department: 'General Studies', university: 'vu', level: 100, semester: 1, units: 2, description: 'Core foundational principles for academic and personal development.', topics: ['Values and Ethics', 'Critical Thinking', 'Personal Development', 'Faith and Reason', 'Worldview', 'Academic Integrity', 'Leadership', 'Communication', 'Time Management', 'Goal Setting'] },
  { id: 'gst-vu-fic102', code: 'FIC 102', title: 'Christian Spiritual Formation and Discipleship', faculty: 'General Studies', department: 'General Studies', university: 'vu', level: 100, semester: 2, units: 2, description: 'Spiritual growth and Christian discipleship principles.', topics: ['Spiritual Growth', 'Biblical Foundations', 'Prayer Life', 'Christian Ethics', 'Discipleship', 'Fellowship', 'Service', 'Witnessing', 'Spiritual Disciplines', 'Christian Living'] },
  { id: 'gst-run-tvet101', code: 'TVET 101', title: 'Technical and Vocational Educational Training I', faculty: 'General Studies', department: 'General Studies', university: 'run', level: 100, semester: 1, units: 0, description: 'Introduction to technical and vocational education skills.', topics: ['Technical Skills', 'Vocational Training', 'Workshop Practice', 'Safety Standards', 'Tool Usage', 'Basic Engineering', 'Craft Skills', 'Entrepreneurship', 'Project Planning', 'Quality Control'] },
  { id: 'gst-run-tvet102', code: 'TVET 102', title: 'Technical and Vocational Educational Training II', faculty: 'General Studies', department: 'General Studies', university: 'run', level: 100, semester: 2, units: 0, description: 'Advanced technical and vocational education skills.', topics: ['Advanced Technical Skills', 'Project Management', 'Quality Assurance', 'Business Planning', 'Marketing', 'Financial Literacy', 'Innovation', 'Sustainability', 'Leadership', 'Professional Development'] },
  { id: 'gst-vu-tvet101', code: 'TVET 101', title: 'Technical and Vocational Educational Training I', faculty: 'General Studies', department: 'General Studies', university: 'vu', level: 100, semester: 1, units: 0, description: 'Introduction to technical and vocational education skills.', topics: ['Technical Skills', 'Vocational Training', 'Workshop Practice', 'Safety Standards', 'Tool Usage', 'Basic Engineering', 'Craft Skills', 'Entrepreneurship', 'Project Planning', 'Quality Control'] },
  { id: 'gst-vu-tvet102', code: 'TVET 102', title: 'Technical and Vocational Educational Training II', faculty: 'General Studies', department: 'General Studies', university: 'vu', level: 100, semester: 2, units: 0, description: 'Advanced technical and vocational education skills.', topics: ['Advanced Technical Skills', 'Project Management', 'Quality Assurance', 'Business Planning', 'Marketing', 'Financial Literacy', 'Innovation', 'Sustainability', 'Leadership', 'Professional Development'] }
];

export function getAllCourses(): Course[] {
  const allCourses: Course[] = [...GST_COURSES];
  UNIVERSITIES.forEach(uni => {
    uni.faculties.forEach(fac => {
      fac.departments.forEach(dept => {
        allCourses.push(...dept.courses);
      });
    });
  });
  return allCourses;
}

export function getCoursesByUniversity(uniId: string): Course[] {
  const uni = UNIVERSITIES.find(u => u.id === uniId);
  if (!uni) return GST_COURSES.filter(c => c.university === uniId || !c.university);
  const courses = GST_COURSES.filter(c => c.university === uniId || !c.university);
  uni.faculties.forEach(fac => {
    fac.departments.forEach(dept => {
      courses.push(...dept.courses);
    });
  });
  return courses;
}

export function getCourseById(courseId: string): Course | undefined {
  if (courseId.startsWith('gst-')) return GST_COURSES.find(c => c.id === courseId);
  for (const uni of UNIVERSITIES) {
    for (const fac of uni.faculties) {
      for (const dept of fac.departments) {
        const course = dept.courses.find(c => c.id === courseId);
        if (course) return course;
      }
    }
  }
  return undefined;
}
`;

fs.writeFileSync('C:\\Users\\VP\\Documents\\Get Smart\\src\\data\\courses.ts', output);
console.log('courses.ts generated successfully!');
console.log(`Total faculties: ${facultyEntries.length}`);
let totalCourses = 0;
facultyEntries.forEach(([_, depts]) => {
  Object.values(depts).forEach(d => { totalCourses += d.courses.length; });
});
console.log(`Total department courses: ${totalCourses}`);
console.log(`Total GST courses: ${GST_COURSES.length * 2 + 12}`);
