import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Zap, ChevronRight } from 'lucide-react';

interface GameCardProps {
  questions: Array<{ question: string; answer: string; options?: string[] }>;
  onExit: () => void;
  onComplete: (score: number) => void;
}

export default function GameCard({ questions, onExit, onComplete }: GameCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [stackHeight, setStackHeight] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; question: string }[]>([]);
  const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
  
  const currentQuestion = questions[currentIndex];
  const hasOptions = currentQuestion?.options && currentQuestion.options.length > 0;

  const handleAnswer = useCallback((answer: string) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    const correct = answer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();
    
    setAnswers(prev => [...prev, { correct, question: currentQuestion.question }]);
    
    if (correct) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setStackHeight(prev => prev + 1);
      setShowCorrectFeedback(true);
      setTimeout(() => setShowCorrectFeedback(false), 800);
    } else {
      setStreak(0);
      setGameOver(true);
    }
    
    if (!correct || !currentQuestion.options) {
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setSelectedAnswer(null);
        } else {
          const finalScore = Math.round((score + (correct ? 1 : 0)) / questions.length * 100);
          onComplete(finalScore);
          setGameOver(true);
        }
      }, correct ? 1000 : 1500);
    }
  }, [selectedAnswer, currentQuestion, currentIndex, questions.length, score, onComplete]);

  useEffect(() => {
    if (streak > maxStreak) {
      setMaxStreak(streak);
    }
  }, [streak, maxStreak]);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!hasOptions && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, hasOptions]);

  if (gameOver) {
    const accuracy = answers.length > 0 
      ? Math.round(answers.filter(a => a.correct).length / answers.length * 100) 
      : 0;
    
    return (
      <div className="fade-enter fade-enter-active" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: accuracy >= 80 ? 'var(--success)' : accuracy >= 50 ? 'var(--gold)' : 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <Trophy size={48} color="white" />
        </div>
        
        <h2 style={{ margin: '0 0 0.5rem', color: 'var(--text-color)', fontSize: '1.75rem', fontWeight: '700' }}>
          {accuracy >= 80 ? 'Great Job!' : accuracy >= 50 ? 'Good Try!' : 'Keep Practicing!'}
        </h2>
        
        <p style={{ 
          marginBottom: '2rem',
          color: 'var(--secondary-text-color)',
          textAlign: 'center'
        }}>
          You answered {answers.filter(a => a.correct).length} out of {answers.length} correctly
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          marginBottom: '2rem',
          width: '100%',
          maxWidth: '400px'
        }}>
          {[
            { value: `${accuracy}%`, label: 'Accuracy', color: 'var(--primary)' },
            { value: stackHeight, label: 'Stack Height', color: 'var(--success)' },
            { value: maxStreak, label: 'Best Streak', color: 'var(--gold)' }
          ].map(({ value, label, color }) => (
            <div key={label} style={{ 
              textAlign: 'center',
              padding: '1rem',
              background: 'var(--background-color-secondary)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '700', color }}>
                {value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text-color)', fontWeight: '500' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onExit} className="ghost-button-component" style={{ padding: '1rem 2rem' }}>
            Exit
          </button>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setStreak(0);
              setStackHeight(0);
              setSelectedAnswer(null);
              setGameOver(false);
              setAnswers([]);
            }}
            className="primary-button-component"
            style={{ padding: '1rem 2rem' }}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      height: '100%',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <button onClick={onExit} className="ghost-button-component" style={{ padding: '0.5rem 1rem' }}>
          ← Exit
        </button>
        <span style={{ 
          fontSize: '0.875rem', 
          color: 'var(--secondary-text-color)',
          fontWeight: '500'
        }}>
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: '6px',
        background: 'var(--background-color-secondary)',
        borderRadius: '3px',
        marginBottom: '1.5rem',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${((currentIndex) / questions.length) * 100}%`,
          height: '100%',
          background: 'var(--primary)',
          borderRadius: '3px',
          transition: 'width 0.3s'
        }} />
      </div>

      {/* Score and Streak */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(0, 117, 255, 0.1)',
          borderRadius: '999px'
        }}>
          <Zap size={16} color="var(--primary)" />
          <span style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.9rem' }}>
            {streak} streak
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(57, 203, 63, 0.1)',
          borderRadius: '999px'
        }}>
          <Trophy size={16} color="var(--success)" />
          <span style={{ fontWeight: '600', color: 'var(--success)', fontSize: '0.9rem' }}>
            {score} points
          </span>
        </div>
      </div>

      {/* Stack Visualization */}
      <div style={{
        width: '60px',
        height: '120px',
        background: 'var(--background-color-secondary)',
        borderRadius: '10px',
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column-reverse',
        overflow: 'hidden',
        border: '1px solid var(--border-style)'
      }}>
        {Array.from({ length: Math.min(stackHeight, 10) }).map((_, i) => (
          <div
            key={i}
            style={{
              height: '12px',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              opacity: 0.7 + (i / 10) * 0.3,
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>

      {/* Question */}
      <div className="login-content" style={{
        width: '100%',
        padding: '2rem',
        marginBottom: '1.5rem',
        textAlign: 'center'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '1.25rem',
          color: 'var(--text-color)',
          lineHeight: 1.5,
          fontWeight: '600'
        }}>
          {currentQuestion.question}
        </h3>
      </div>

      {/* Answer Options */}
      {hasOptions ? (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.75rem',
          width: '100%',
          maxWidth: '500px'
        }}>
          {currentQuestion.options?.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();
            const showFeedback = selectedAnswer !== null;
            
            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className="base-button-component"
                style={{
                  justifyContent: 'flex-start',
                  padding: '1rem 1.5rem',
                  background: showFeedback
                    ? (isCorrectOption 
                        ? 'rgba(57, 203, 63, 0.1)' 
                        : isSelected 
                          ? 'rgba(255, 50, 50, 0.1)' 
                          : 'var(--background-color-secondary)')
                    : 'var(--background-color-secondary)',
                  border: `2px solid ${
                    showFeedback
                      ? (isCorrectOption 
                          ? 'var(--success)' 
                          : isSelected 
                            ? 'var(--danger)' 
                            : 'var(--border-style)')
                      : 'var(--border-style)'
                  }`,
                  color: 'var(--text-color)',
                  cursor: selectedAnswer !== null ? 'default' : 'pointer'
                }}
              >
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: showFeedback
                    ? (isCorrectOption ? 'var(--success)' : isSelected ? 'var(--danger)' : 'var(--background-color)')
                    : 'var(--background-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: showFeedback && (isCorrectOption || isSelected) ? 'white' : 'var(--text-color)',
                  flexShrink: 0
                }}>
                  {showFeedback
                    ? (isCorrectOption ? '✓' : isSelected ? '✗' : String.fromCharCode(65 + index))
                    : String.fromCharCode(65 + index)
                  }
                </span>
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.target as HTMLFormElement).elements.namedItem('answer') as HTMLInputElement;
            if (input?.value.trim()) {
              handleAnswer(input.value.trim());
            }
          }}
          style={{ width: '100%', maxWidth: '500px' }}
        >
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              ref={inputRef}
              name="answer"
              type="text"
              placeholder="Type your answer..."
              disabled={selectedAnswer !== null}
              className="thea-text-input"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              disabled={selectedAnswer !== null}
              className="primary-button-component"
              style={{ padding: '1rem 1.5rem' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </form>
      )}

      {/* Correct feedback animation */}
      {showCorrectFeedback && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '1rem 2rem',
          background: 'var(--success)',
          color: 'white',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '1.25rem',
          animation: 'popIn 0.3s ease',
          zIndex: 1000
        }}>
          ✓ Correct! +1
        </div>
      )}
    </div>
  );
}
