import { useState } from 'react';
import ActiveRecall from './ActiveRecall';
import TeachMode from './TeachMode';
import ImageOcclusion from './ImageOcclusion';
import SwipeCards from './SwipeCards';

// Extended schedule item type
interface ScheduleItem {
  type: 'recall' | 'teach' | 'occlusion' | 'flashcard' | 'multiple-choice';
  question: string;
  answer: string;
  topic?: string;
  modelAnswer?: string[];
  imageUrl?: string;
  occlusionLabel?: string;
  box?: { x: number; y: number; label: string };
  options?: string[];
  correctOptionIndex?: number;
}

// Mock SM-2 Schedule interleaving items
// Items mixed from different topics: flashcard, teach, occlusion
const INTERLEAVED_SCHEDULE: ScheduleItem[] = [
  { 
    type: 'recall', 
    question: 'What is a peptide bond?', 
    answer: 'A chemical bond formed between two molecules when the carboxyl group of one reacts with the amino group of the other.' 
  },
  { 
    type: 'teach', 
    question: 'Explain the concept of enzyme activation energy.',
    answer: 'Enzymes lower the activation energy required for chemical reactions to occur.',
    modelAnswer: ['activation energy', 'lower', 'catalyst', 'speed up']
  },
  { 
    type: 'occlusion', 
    question: 'Identify the powerhouse of the cell in this diagram.',
    answer: 'Mitochondria',
    imageUrl: 'placeholder-cell-diagram.png',
    occlusionLabel: 'Mitochondria',
    box: { x: 50, y: 70, label: 'Mitochondria' }
  },
  { 
    type: 'recall', 
    question: 'What is the powerhouse of the cell?', 
    answer: 'Mitochondria.' 
  },
  {
    type: 'multiple-choice',
    question: 'Which of the following is NOT a factor that affects enzyme activity?',
    answer: 'Color of the substrate',
    options: ['Temperature', 'pH', 'Substrate concentration', 'Color of the substrate'],
    correctOptionIndex: 3
  }
];

export default function SmartReview({ onBack }: { onBack: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Mocking the SM-2 algorithm response
  const handleScore = (_score: number) => {
    // In a real app, SM-2 algo would update the next review date in the DB here based on the 1-4 score
    if (currentIndex < INTERLEAVED_SCHEDULE.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const currentItem = INTERLEAVED_SCHEDULE[currentIndex];

  if (completed) {
    return (
      <div className="fade-in glass-panel" style={{
        padding: '3rem', 
        textAlign: 'center',
        border: '1px solid var(--color-border)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', margin: '0 0 1rem' }}>
          🎉 Session Complete!
        </h2>
        <p style={{ opacity: 0.7, marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
          All SM-2 scheduled tasks have been cleared for this time block.
        </p>
        <button 
          onClick={onBack} 
          className="apple-button" 
          style={{
            background: 'var(--color-primary)', 
            color: 'white', 
            padding: '1rem 2rem', 
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          Return to Hub
        </button>
      </div>
    );
  }

  // Convert schedule item to component props
  const getComponentProps = () => {
    switch (currentItem.type) {
      case 'recall':
        return {
          item: {
            question: currentItem.question,
            answer: currentItem.answer,
            type: currentItem.type
          },
          onScore: handleScore,
          showProgress: true,
          progress: ((currentIndex) / INTERLEAVED_SCHEDULE.length) * 100,
          cardCount: INTERLEAVED_SCHEDULE.length,
          currentIndex
        };
      case 'teach':
        return {
          item: {
            question: currentItem.question,
            answer: currentItem.answer,
            modelAnswer: currentItem.modelAnswer,
            type: currentItem.type
          },
          onScore: handleScore,
          showProgress: true,
          progress: ((currentIndex) / INTERLEAVED_SCHEDULE.length) * 100,
          cardCount: INTERLEAVED_SCHEDULE.length,
          currentIndex
        };
      case 'occlusion':
        return {
          item: {
            question: currentItem.question,
            answer: currentItem.answer,
            imageUrl: currentItem.imageUrl,
            occlusionLabel: currentItem.occlusionLabel,
            box: currentItem.box,
            type: currentItem.type
          },
          onScore: handleScore,
          showProgress: true,
          progress: ((currentIndex) / INTERLEAVED_SCHEDULE.length) * 100,
          cardCount: INTERLEAVED_SCHEDULE.length,
          currentIndex
        };
      case 'flashcard':
      case 'multiple-choice':
        return {
          card: {
            question: currentItem.question,
            answer: currentItem.answer,
            type: currentItem.type,
            options: currentItem.options,
            correctOptionIndex: currentItem.correctOptionIndex
          },
          onBack,
          onScore: handleScore
        };
      default:
        return {
          item: {
            question: currentItem.question,
            answer: currentItem.answer,
            type: currentItem.type
          },
          onScore: handleScore
        };
    }
  };

  return (
    <div className="fade-in" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      maxWidth: '800px', 
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem'
      }}>
        <button 
          onClick={onBack} 
          className="apple-button" 
          style={{
            background: 'transparent', 
            border: '1px solid var(--color-primary)', 
            color: 'var(--color-primary)', 
            padding: '0.5rem 1rem',
            borderRadius: '8px'
          }}
        >
          End Early
        </button>
        <div style={{ 
          background: 'var(--color-unseen)', 
          height: '8px', 
          borderRadius: '4px', 
          flex: 1, 
          margin: '0 2rem',
          overflow: 'hidden'
        }}>
          <div style={{
            background: 'var(--color-primary)', 
            height: '100%', 
            borderRadius: '4px', 
            width: `${((currentIndex) / INTERLEAVED_SCHEDULE.length) * 100}%`,
            transition: 'width 0.3s'
          }}></div>
        </div>
        <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
          {currentIndex + 1} / {INTERLEAVED_SCHEDULE.length}
        </span>
      </div>

      <div style={{ flex: 1 }}>
        {currentItem.type === 'recall' && (
          <ActiveRecall {...getComponentProps() as any} />
        )}
        {currentItem.type === 'teach' && (
          <TeachMode {...getComponentProps() as any} />
        )}
        {currentItem.type === 'occlusion' && (
          <ImageOcclusion {...getComponentProps() as any} />
        )}
        {(currentItem.type === 'flashcard' || currentItem.type === 'multiple-choice') && (
          <SwipeCards {...getComponentProps() as any} />
        )}
      </div>
    </div>
  );
}
