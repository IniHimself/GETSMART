import { useState } from 'react';
import { BookOpen, CheckCircle } from 'lucide-react';

interface SwipeCard {
  question: string;
  answer: string;
  type?: string;
  options?: string[];
  correctOptionIndex?: number;
}

interface SwipeCardsProps {
  onBack: () => void;
  card: SwipeCard;
  onScore: (score: number) => void;
}

const btnStyle = {
  color: 'white', border: 'none', padding: '1rem 2rem',
  borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem'
};

export default function SwipeCards({ onBack, card, onScore }: SwipeCardsProps) {
  const [rotated, setRotated] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Handle card flip
  const handleFlip = () => {
    if (card.type === 'multiple-choice' && !rotated) {
      // For multiple choice, don't flip, just show answer
      setShowAnswer(true);
    } else {
      setRotated(!rotated);
    }
  };

  // Handle option selection
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setShowAnswer(true);
    
    // Check if correct
    if (card.correctOptionIndex === index) {
      // Correct answer - will score as Good (3)
      setTimeout(() => onScore(3), 500);
    } else {
      // Incorrect answer - will score as Again (1)
      setTimeout(() => onScore(1), 500);
    }
  };

  // Determine card content based on type
  const renderCardContent = () => {
    if (card.type === 'multiple-choice') {
      if (!showAnswer) {
        // Show question and options
        return (
          <div style={{ width: '100%', padding: '1rem' }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              margin: '0 0 1.5rem 0',
              textAlign: 'center',
              color: 'var(--color-text)'
            }}>
              {card.question}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {card.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={selectedOption !== null}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    background: selectedOption === index 
                      ? (index === card.correctOptionIndex 
                          ? 'var(--color-secondary)' 
                          : 'var(--color-btn-again)')
                      : 'var(--color-surface-solid)',
                    color: selectedOption === index 
                      ? 'white' 
                      : 'var(--color-text)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    fontWeight: 'normal'
                  }}
                  onMouseOver={(e) => {
                    if (selectedOption === null) {
                      e.currentTarget.style.background = 'var(--color-bg)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedOption === null) {
                      e.currentTarget.style.background = 'var(--color-surface-solid)';
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      } else {
        // Show answer and feedback
        return (
          <div style={{ width: '100%', padding: '1rem', textAlign: 'center' }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              margin: '0 0 1rem 0',
              color: 'var(--color-text)'
            }}>
              {card.question}
            </h3>
            
            <div style={{
              padding: '1rem',
              background: selectedOption === card.correctOptionIndex 
                ? 'rgba(16, 185, 129, 0.1)'
                : 'rgba(239, 68, 68, 0.1)',
              borderRadius: '12px',
              marginBottom: '1rem'
            }}>
              <p style={{ 
                margin: 0,
                fontWeight: 'bold',
                color: selectedOption === card.correctOptionIndex 
                  ? 'var(--color-secondary)'
                  : 'var(--color-btn-again)'
              }}>
                {card.options?.[card.correctOptionIndex || 0]}
              </p>
              <p style={{ 
                margin: '0.5rem 0 0 0',
                fontSize: '0.85rem',
                opacity: 0.7,
                color: 'var(--color-text-secondary)'
              }}>
                {selectedOption === card.correctOptionIndex ? '✓ Correct!' : '✗ Incorrect'}
              </p>
            </div>
            
            <p style={{ 
              margin: '1rem 0',
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)'
            }}>
              {card.answer}
            </p>
          </div>
        );
      }
    } else {
      // Standard flashcard (front and back)
      return (
        <div style={{ 
          width: '100%', 
          height: '100%',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
          boxSizing: 'border-box'
        }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            margin: 0,
            color: 'var(--color-text)'
          }}>
            {rotated ? card.answer : card.question}
          </h3>
        </div>
      );
    }
  };

  return (
    <div style={{ 
      animation: 'fadeIn 0.3s', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      height: '100%',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <button 
        onClick={onBack} 
        style={{
          alignSelf: 'flex-start', 
          marginBottom: '2rem', 
          background: 'none', 
          border: 'none', 
          color: 'var(--color-primary)', 
          cursor: 'pointer', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <BookOpen size={18} />
        Back to Overview
      </button>
      
      <h2 style={{marginTop: 0, color: 'var(--color-text)'}}>
        {card.type === 'multiple-choice' ? 'Multiple Choice' : 'Active Recall'}
      </h2>

      <div 
        onClick={handleFlip}
        style={{
          width: '100%', 
          maxWidth: '500px', 
          height: '300px',
          background: 'var(--color-surface-solid)',
          borderRadius: '24px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center', 
          padding: '2rem', 
          boxSizing: 'border-box',
          cursor: card.type === 'multiple-choice' && !showAnswer ? 'default' : 'pointer',
          marginBottom: '2rem',
          transform: rotated ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          position: 'relative',
          border: '1px solid var(--color-border)'
        }}
      >
        {renderCardContent()}
      </div>

      {rotated && card.type !== 'multiple-choice' && (
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginTop: '1rem', 
          flexWrap: 'wrap', 
          justifyContent: 'center'
        }}>
          <button 
            onClick={() => onScore(1)}
            style={{ 
              ...btnStyle, 
              background: 'var(--color-btn-again)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Again (Urgent)
          </button>
          <button 
            onClick={() => onScore(2)}
            style={{ 
              ...btnStyle, 
              background: 'var(--color-btn-hard)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Hard (Review Soon)
          </button>
          <button 
            onClick={() => onScore(3)}
            style={{ 
              ...btnStyle, 
              background: 'var(--color-btn-good)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            Good (Stable)
          </button>
          <button 
            onClick={() => onScore(4)}
            style={{ 
              ...btnStyle, 
              background: 'var(--color-btn-easy)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <CheckCircle size={16} />
            Easy (Mastered)
          </button>
        </div>
      )}
    </div>
  );
}
