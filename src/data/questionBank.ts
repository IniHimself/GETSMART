/**
 * Structured Question Bank
 * Organized by course and topic for easy access
 * Each question has a type that determines how it's presented to the student
 */

import type { Card } from '../utils/sm2';

// Question types (card types for SM-2 compatibility)
export type QuestionType = 'recall' | 'teach' | 'occlusion' | 'flashcard';
export type CardType = QuestionType;

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  answer: string;
  topic: string;
  course: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  // For teach mode
  modelAnswer?: string[];
  // For occlusion
  imageUrl?: string;
  occlusionLabel?: string;
  // For multiple choice
  options?: string[];
  correctOptionIndex?: number;
}

// Helper to create a card from a question
function createCardFromQuestion(question: Question): Omit<Card, 'schedule' | 'mastery'> {
  return {
    id: question.id,
    type: question.type,
    question: question.question,
    answer: question.answer,
    topic: question.topic,
    course: question.course
  };
}

// Biochemistry 201 - Enzyme Kinetics
const biochemistryEnzymeKinetics: Question[] = [
  {
    id: 'bio_enz_001',
    type: 'recall',
    question: 'What is a peptide bond?',
    answer: 'A chemical bond formed between two molecules when the carboxyl group of one molecule reacts with the amino group of the other molecule, releasing a molecule of water (H2O).',
    topic: 'Enzyme Kinetics',
    course: 'Biochemistry 201',
    difficulty: 'easy',
    tags: ['enzymes', 'bonds', 'biochemistry']
  },
  {
    id: 'bio_enz_002',
    type: 'recall',
    question: 'What is the powerhouse of the cell?',
    answer: 'Mitochondria are the powerhouses of the cell, generating ATP through cellular respiration.',
    topic: 'Enzyme Kinetics',
    course: 'Biochemistry 201',
    difficulty: 'easy',
    tags: ['cell', 'mitochondria', 'ATP']
  },
  {
    id: 'bio_enz_003',
    type: 'recall',
    question: 'What is the active site of an enzyme?',
    answer: 'The active site is the region on the enzyme where substrates bind and the chemical reaction occurs.',
    topic: 'Enzyme Kinetics',
    course: 'Biochemistry 201',
    difficulty: 'medium',
    tags: ['enzyme', 'active site', 'substrate']
  },
  {
    id: 'bio_enz_004',
    type: 'recall',
    question: 'How do enzymes lower activation energy?',
    answer: 'Enzymes lower activation energy by providing an alternative reaction pathway that requires less energy, typically through substrate orientation, strain, or chemical group participation.',
    topic: 'Enzyme Kinetics',
    course: 'Biochemistry 201',
    difficulty: 'medium',
    tags: ['activation energy', 'catalyst', 'reaction pathway']
  },
  {
    id: 'bio_enz_005',
    type: 'teach',
    question: 'Explain the concept of enzyme activation energy to a beginner.',
    answer: 'Enzymes are biological catalysts that speed up chemical reactions by lowering the activation energy required for the reaction to occur.',
    topic: 'Enzyme Kinetics',
    course: 'Biochemistry 201',
    difficulty: 'hard',
    tags: ['activation energy', 'catalyst', 'enzyme function'],
    modelAnswer: ['activation energy', 'lower', 'catalyst', 'speed up', 'biological']
  },
  {
    id: 'bio_enz_006',
    type: 'recall',
    question: 'What is a substrate?',
    answer: 'A substrate is the molecule upon which an enzyme acts. It binds to the active site of the enzyme and is converted into product.',
    topic: 'Enzyme Kinetics',
    course: 'Biochemistry 201',
    difficulty: 'easy',
    tags: ['substrate', 'enzyme', 'active site']
  },
  {
    id: 'bio_enz_007',
    type: 'recall',
    question: 'What is the Michaelis constant (Km)?',
    answer: 'Km is the substrate concentration at which the reaction rate is half of its maximum value (Vmax). It indicates the affinity of the enzyme for its substrate.',
    topic: 'Enzyme Kinetics',
    course: 'Biochemistry 201',
    difficulty: 'hard',
    tags: ['Michaelis constant', 'Km', 'enzyme kinetics', 'Vmax']
  },
  {
    id: 'bio_enz_008',
    type: 'recall',
    question: 'What is Vmax?',
    answer: 'Vmax is the maximum rate of an enzyme-catalyzed reaction when the enzyme is saturated with substrate.',
    topic: 'Enzyme Kinetics',
    course: 'Biochemistry 201',
    difficulty: 'medium',
    tags: ['Vmax', 'reaction rate', 'enzyme saturation']
  },
  {
    id: 'bio_enz_009',
    type: 'flashcard',
    question: 'Which of the following is NOT a factor that affects enzyme activity?',
    answer: 'Color of the substrate',
    topic: 'Enzyme Kinetics',
    course: 'Biochemistry 201',
    difficulty: 'medium',
    tags: ['enzyme activity', 'factors', 'flashcard'],
    options: ['Temperature', 'pH', 'Substrate concentration', 'Color of the substrate'],
    correctOptionIndex: 3
  },
  {
    id: 'bio_enz_010',
    type: 'flashcard',
    question: 'What are the 6 classes of enzymes?',
    answer: '1. Oxidoreductases, 2. Transferases, 3. Hydrolases, 4. Lyases, 5. Isomerases, 6. Ligases',
    topic: 'Enzyme Classification',
    course: 'Biochemistry 201',
    difficulty: 'medium',
    tags: ['enzyme classes', 'classification', 'flashcard']
  }
];

// Biochemistry 201 - Protein Structure
const biochemistryProteinStructure: Question[] = [
  {
    id: 'bio_prot_001',
    type: 'recall',
    question: 'What are the four levels of protein structure?',
    answer: 'Primary (amino acid sequence), Secondary (alpha helices and beta sheets), Tertiary (3D folding of a single polypeptide), Quaternary (assembly of multiple polypeptide chains).',
    topic: 'Protein Structure',
    course: 'Biochemistry 201',
    difficulty: 'medium',
    tags: ['protein structure', 'levels', 'biochemistry']
  },
  {
    id: 'bio_prot_002',
    type: 'recall',
    question: 'What type of bond stabilizes the alpha helix?',
    answer: 'Hydrogen bonds between the carbonyl oxygen of one amino acid and the amide hydrogen of another amino acid four residues away.',
    topic: 'Protein Structure',
    course: 'Biochemistry 201',
    difficulty: 'medium',
    tags: ['alpha helix', 'hydrogen bonds', 'protein folding']
  },
  {
    id: 'bio_prot_003',
    type: 'teach',
    question: 'Explain why protein folding is important for enzyme function.',
    answer: 'Protein folding creates the specific three-dimensional structure that allows the enzyme to bind substrates and catalyze reactions efficiently.',
    topic: 'Protein Structure',
    course: 'Biochemistry 201',
    difficulty: 'hard',
    tags: ['protein folding', 'enzyme function', '3D structure'],
    modelAnswer: ['folding', 'three-dimensional', 'structure', 'bind', 'substrate', 'catalyze']
  }
];

// History of Africa
const historyOfAfrica: Question[] = [
  {
    id: 'hist_afr_001',
    type: 'recall',
    question: 'Which ancient civilization built the pyramids?',
    answer: 'The ancient Egyptians built the pyramids, primarily during the Old and Middle Kingdom periods.',
    topic: 'Ancient Civilizations',
    course: 'History of Africa',
    difficulty: 'easy',
    tags: ['Egypt', 'pyramids', 'ancient civilization']
  },
  {
    id: 'hist_afr_002',
    type: 'recall',
    question: 'What was the significance of the Kingdom of Axum?',
    answer: 'The Kingdom of Axum (modern-day Ethiopia and Eritrea) was one of the first African civilizations to mint its own coins and was a major trading power, connecting Rome, India, and Arabia.',
    topic: 'Ancient Civilizations',
    course: 'History of Africa',
    difficulty: 'medium',
    tags: ['Axum', 'trade', 'coins', 'Ethiopia']
  },
  {
    id: 'hist_afr_003',
    type: 'recall',
    question: 'Who was Mansa Musa?',
    answer: 'Mansa Musa was the ruler of the Mali Empire from 1312 to 1337, known for his wealth and his famous pilgrimage to Mecca, during which he distributed so much gold that he affected the economy of the regions he passed through.',
    topic: 'Medieval Africa',
    course: 'History of Africa',
    difficulty: 'medium',
    tags: ['Mansa Musa', 'Mali Empire', 'pilgrimage', 'gold']
  },
  {
    id: 'hist_afr_004',
    type: 'flashcard',
    question: 'Which European country was the first to establish a presence in West Africa?',
    answer: 'Portugal',
    topic: 'Colonial Era',
    course: 'History of Africa',
    difficulty: 'medium',
    tags: ['colonialism', 'Portugal', 'West Africa'],
    options: ['Spain', 'Portugal', 'England', 'France'],
    correctOptionIndex: 1
  }
];

// Intro to Math
const introToMath: Question[] = [
  {
    id: 'math_001',
    type: 'recall',
    question: 'What is the Pythagorean theorem?',
    answer: 'In a right-angled triangle, the square of the hypotenuse (the side opposite the right angle) is equal to the sum of the squares of the other two sides: a² + b² = c².',
    topic: 'Geometry',
    course: 'Intro to Math',
    difficulty: 'easy',
    tags: ['Pythagorean theorem', 'geometry', 'right triangle']
  },
  {
    id: 'math_002',
    type: 'recall',
    question: 'What is the derivative of x²?',
    answer: 'The derivative of x² with respect to x is 2x.',
    topic: 'Calculus',
    course: 'Intro to Math',
    difficulty: 'medium',
    tags: ['derivative', 'calculus', 'differentiation']
  },
  {
    id: 'math_003',
    type: 'recall',
    question: 'What is the integral of 1/x?',
    answer: 'The integral of 1/x with respect to x is the natural logarithm of the absolute value of x plus a constant: ∫(1/x)dx = ln|x| + C.',
    topic: 'Calculus',
    course: 'Intro to Math',
    difficulty: 'hard',
    tags: ['integral', 'calculus', 'natural logarithm']
  },
  {
    id: 'math_004',
    type: 'flashcard',
    question: 'What is the value of π (pi) to two decimal places?',
    answer: '3.14',
    topic: 'Basic Math',
    course: 'Intro to Math',
    difficulty: 'easy',
    tags: ['pi', 'mathematical constants'],
    options: ['3.14', '2.71', '1.41', '1.61'],
    correctOptionIndex: 0
  }
];

// Organize all questions by course and topic
export const QUESTION_BANK: Record<string, Record<string, Question[]>> = {
  'Biochemistry 201': {
    'Enzyme Kinetics': biochemistryEnzymeKinetics,
    'Protein Structure': biochemistryProteinStructure
  },
  'History of Africa': {
    'Ancient Civilizations': historyOfAfrica.filter(q => q.topic === 'Ancient Civilizations'),
    'Medieval Africa': historyOfAfrica.filter(q => q.topic === 'Medieval Africa'),
    'Colonial Era': historyOfAfrica.filter(q => q.topic === 'Colonial Era')
  },
  'Intro to Math': {
    'Geometry': introToMath.filter(q => q.topic === 'Geometry'),
    'Calculus': introToMath.filter(q => q.topic === 'Calculus'),
    'Basic Math': introToMath.filter(q => q.topic === 'Basic Math')
  }
};

/**
 * Get all questions for a specific course
 * @param course Course name
 * @returns Array of questions for the course
 */
export function getQuestionsForCourse(course: string): Question[] {
  const courseQuestions = QUESTION_BANK[course];
  if (!courseQuestions) return [];
  
  return Object.values(courseQuestions).flat();
}

/**
 * Get all questions for a specific topic in a course
 * @param course Course name
 * @param topic Topic name
 * @returns Array of questions for the topic
 */
export function getQuestionsForTopic(course: string, topic: string): Question[] {
  const courseQuestions = QUESTION_BANK[course];
  if (!courseQuestions) return [];
  
  return courseQuestions[topic] || [];
}

/**
 * Get a specific question by ID
 * @param id Question ID
 * @returns Question or undefined
 */
export function getQuestionById(id: string): Question | undefined {
  for (const course of Object.values(QUESTION_BANK)) {
    for (const topicQuestions of Object.values(course)) {
      const question = topicQuestions.find(q => q.id === id);
      if (question) return question;
    }
  }
  return undefined;
}

/**
 * Get all questions as cards (for initial setup)
 * @returns Array of card data
 */
export function getAllQuestionsAsCards(): Omit<Card, 'schedule' | 'mastery'>[] {
  const allQuestions: Question[] = [];
  
  for (const course of Object.values(QUESTION_BANK)) {
    for (const topicQuestions of Object.values(course)) {
      allQuestions.push(...topicQuestions);
    }
  }
  
  return allQuestions.map(createCardFromQuestion);
}

/**
 * Get questions by difficulty
 * @param difficulty Difficulty level
 * @returns Array of questions
 */
export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Question[] {
  const allQuestions: Question[] = [];
  
  for (const course of Object.values(QUESTION_BANK)) {
    for (const topicQuestions of Object.values(course)) {
      allQuestions.push(...topicQuestions);
    }
  }
  
  return allQuestions.filter(q => q.difficulty === difficulty);
}

/**
 * Get questions by tags
 * @param tags Array of tags to filter by
 * @returns Array of questions that have any of the specified tags
 */
export function getQuestionsByTags(tags: string[]): Question[] {
  const allQuestions: Question[] = [];
  
  for (const course of Object.values(QUESTION_BANK)) {
    for (const topicQuestions of Object.values(course)) {
      allQuestions.push(...topicQuestions);
    }
  }
  
  return allQuestions.filter(question => 
    tags.some(tag => question.tags.includes(tag))
  );
}

// Export individual course data for easier access
export const COURSES = Object.keys(QUESTION_BANK);
export const BIOCHEMISTRY_201_TOPICS = Object.keys(QUESTION_BANK['Biochemistry 201']);
export const HISTORY_OF_AFRICA_TOPICS = Object.keys(QUESTION_BANK['History of Africa']);
export const INTRO_TO_MATH_TOPICS = Object.keys(QUESTION_BANK['Intro to Math']);
