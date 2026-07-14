/**
 * SM-2 Spaced Repetition Algorithm Implementation
 * Based on the algorithm used in SuperMemo
 * 
 * This implementation handles the scheduling of flashcards based on user performance
 * and tracks when each card should be reviewed next.
 */

export interface CardSchedule {
  interval: number; // Days until next review
  repetition: number; // Number of consecutive successful reviews
  efactor: number; // Easiness factor (1.3 - 2.5)
  lastReview: number; // Timestamp of last review
  nextReview: number; // Timestamp of next review
}

export interface Card {
  id: string;
  type: 'recall' | 'teach' | 'occlusion' | 'flashcard';
  question: string;
  answer: string;
  topic: string;
  course: string;
  schedule: CardSchedule;
  mastery: 'new' | 'learning' | 'review' | 'mastered';
}

// Default starting values for new cards
const DEFAULT_EFACTOR = 2.5;
const INITIAL_INTERVAL = 1; // 1 day for first review

/**
 * Calculate the next interval based on SM-2 algorithm
 * @param repetition Current repetition count
 * @param efactor Current easiness factor
 * @returns Next interval in days
 */
export function calculateNextInterval(repetition: number, efactor: number): number {
  if (repetition === 0) return 1; // First review after 1 day
  if (repetition === 1) return 6; // Second review after 6 days
  
  // For repetitions >= 2, use the SM-2 formula
  return Math.round(repetition * efactor);
}

/**
 * Update card schedule based on user's performance score (1-4)
 * 1 = Again (failed)
 * 2 = Hard
 * 3 = Good
 * 4 = Easy
 * @param card The card to update
 * @param score User's performance score (1-4)
 * @returns Updated card with new schedule
 */
export function updateCardSchedule(card: Card, score: number): Card {
  const now = Date.now();
  const { repetition, efactor } = card.schedule;
  
  let newEfactor = efactor;
  let newRepetition = repetition;
  let newInterval = INITIAL_INTERVAL;
  
  switch (score) {
    case 1: // Again - Reset to beginning
      newRepetition = 0;
      newInterval = 1; // Review again in 1 day
      break;
    case 2: // Hard - Small increase
      newRepetition = repetition + 1;
      newEfactor = Math.max(1.3, efactor - 0.15);
      newInterval = calculateNextInterval(newRepetition, newEfactor);
      break;
    case 3: // Good - Normal progression
      newRepetition = repetition + 1;
      newInterval = calculateNextInterval(newRepetition, efactor);
      break;
    case 4: // Easy - Larger increase
      newRepetition = repetition + 1;
      newEfactor = Math.min(2.5, efactor + 0.1);
      newInterval = calculateNextInterval(newRepetition, newEfactor);
      break;
  }
  
  // Calculate next review date
  const nextReview = now + (newInterval * 24 * 60 * 60 * 1000);
  
  // Update mastery state
  let newMastery: Card['mastery'] = 'new';
  if (newRepetition >= 4) {
    newMastery = 'mastered';
  } else if (newRepetition >= 2) {
    newMastery = 'review';
  } else if (newRepetition >= 1) {
    newMastery = 'learning';
  }
  
  return {
    ...card,
    schedule: {
      interval: newInterval,
      repetition: newRepetition,
      efactor: newEfactor,
      lastReview: now,
      nextReview
    },
    mastery: newMastery
  };
}

/**
 * Create a new card with default schedule
 * @param cardData Card data without schedule
 * @returns Card with initialized schedule
 */
export function createNewCard(cardData: Omit<Card, 'schedule' | 'mastery'>): Card {
  const now = Date.now();
  return {
    ...cardData,
    schedule: {
      interval: INITIAL_INTERVAL,
      repetition: 0,
      efactor: DEFAULT_EFACTOR,
      lastReview: now,
      nextReview: now + (INITIAL_INTERVAL * 24 * 60 * 60 * 1000)
    },
    mastery: 'new'
  };
}

/**
 * Get cards that are due for review today
 * @param cards Array of all cards
 * @returns Cards due for review today
 */
export function getDueCards(cards: Card[]): Card[] {
  const now = Date.now();
  const todayStart = new Date(now).setHours(0, 0, 0, 0);
  const todayEnd = todayStart + (24 * 60 * 60 * 1000);
  
  return cards.filter(card => {
    const nextReview = card.schedule.nextReview;
    return nextReview >= todayStart && nextReview <= todayEnd;
  });
}

/**
 * Get cards that are overdue (should have been reviewed before today)
 * @param cards Array of all cards
 * @returns Overdue cards
 */
export function getOverdueCards(cards: Card[]): Card[] {
  const now = Date.now();
  const todayStart = new Date(now).setHours(0, 0, 0, 0);
  
  return cards.filter(card => {
    const nextReview = card.schedule.nextReview;
    return nextReview < todayStart;
  });
}

/**
 * Get new cards (never reviewed before)
 * @param cards Array of all cards
 * @returns New cards
 */
export function getNewCards(cards: Card[]): Card[] {
  return cards.filter(card => card.mastery === 'new' && card.schedule.repetition === 0);
}

/**
 * Get cards for today's review session (due + overdue + new cards)
 * @param cards Array of all cards
 * @param newCardsPerDay Maximum new cards to show per day
 * @returns Cards for today's session
 */
export function getTodaysCards(cards: Card[], newCardsPerDay: number = 20): Card[] {
  const dueCards = getDueCards(cards);
  const overdueCards = getOverdueCards(cards);
  const newCards = getNewCards(cards).slice(0, newCardsPerDay);
  
  // Combine and shuffle to interleave different types
  const allCards = [...dueCards, ...overdueCards, ...newCards];
  
  // Simple shuffle to mix card types
  return allCards.sort(() => Math.random() - 0.5);
}

/**
 * Get statistics about card collection
 * @param cards Array of all cards
 * @returns Statistics object
 */
export function getCardStatistics(cards: Card[]): {
  total: number;
  newCount: number;
  learningCount: number;
  reviewCount: number;
  masteredCount: number;
  dueToday: number;
  overdue: number;
} {
  const dueToday = getDueCards(cards).length;
  const overdue = getOverdueCards(cards).length;
  
  return {
    total: cards.length,
    newCount: cards.filter(c => c.mastery === 'new').length,
    learningCount: cards.filter(c => c.mastery === 'learning').length,
    reviewCount: cards.filter(c => c.mastery === 'review').length,
    masteredCount: cards.filter(c => c.mastery === 'mastered').length,
    dueToday,
    overdue
  };
}
