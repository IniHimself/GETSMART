import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

export interface FlashCardData {
  id: string;
  front: string;
  back: string;
  type: 'basic' | 'cloze' | 'image';
  imageUrl?: string;
  clozeAnswers?: string[];
  hint?: string;
  topic?: string;
}

interface FlashCardProps {
  cards: FlashCardData[];
  onComplete: (results: CardResult[]) => void;
  onExit: () => void;
}

export interface CardResult {
  cardId: string;
  score: number;
  timeSpent: number;
  flips: number;
}

export default function FlashCard({ cards, onComplete, onExit }: FlashCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [flips, setFlips] = useState(0);
  const [clozeInputs, setClozeInputs] = useState<string[]>([]);
  const [clozeSubmitted, setClozeSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [results, setResults] = useState<CardResult[]>([]);
  const [showImage, setShowImage] = useState(false);

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;

  useEffect(() => {
    setFlipped(false);
    setFlips(0);
    setClozeSubmitted(false);
    setShowHint(false);
    setStartTime(Date.now());
    setShowImage(false);
    
    if (currentCard?.type === 'cloze' && currentCard.clozeAnswers) {
      setClozeInputs(new Array(currentCard.clozeAnswers.length).fill(''));
    }
  }, [currentIndex, currentCard]);

  const handleFlip = useCallback(() => {
    setFlipped(prev => !prev);
    setFlips(prev => prev + 1);
  }, []);

  const handleClozeChange = (index: number, value: string) => {
    setClozeInputs(prev => {
      const newInputs = [...prev];
      newInputs[index] = value;
      return newInputs;
    });
  };

  const checkClozeAnswers = () => {
    if (!currentCard.clozeAnswers) return true;
    return clozeInputs.every((input, i) => 
      input.toLowerCase().trim() === currentCard.clozeAnswers![i].toLowerCase().trim()
    );
  };

  const handleScore = (score: number) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const result: CardResult = {
      cardId: currentCard.id,
      score,
      timeSpent,
      flips
    };

    const newResults = [...results, result];
    setResults(newResults);

    if (isLastCard) {
      onComplete(newResults);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const renderFront = () => {
    switch (currentCard.type) {
      case 'basic':
        return (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'var(--background-color)',
              padding: '0.4rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              color: 'var(--secondary-text-color)'
            }}>
              QUESTION
            </div>
            <h2 style={{ 
              fontSize: '1.75rem', 
              margin: 0,
              color: 'var(--text-color)',
              lineHeight: 1.4,
              fontWeight: '600'
            }}>
              {currentCard.front}
            </h2>
            {currentCard.hint && showHint && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(253, 189, 25, 0.1)',
                borderRadius: '12px',
                color: 'var(--gold)',
                fontSize: '0.9rem'
              }}>
                💡 {currentCard.hint}
              </div>
            )}
          </div>
        );
      
      case 'cloze':
        return (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'var(--background-color)',
              padding: '0.4rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              color: 'var(--secondary-text-color)'
            }}>
              FILL IN THE BLANK
            </div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              margin: '0 0 1.5rem 0',
              color: 'var(--text-color)',
              lineHeight: 1.6,
              fontWeight: '600'
            }}>
              {currentCard.front}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '300px', margin: '0 auto' }}>
              {currentCard.clozeAnswers?.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  value={clozeInputs[index] || ''}
                  onChange={(e) => handleClozeChange(index, e.target.value)}
                  disabled={clozeSubmitted}
                  placeholder={`Blank ${index + 1}`}
                  className="thea-text-input"
                  style={{
                    textAlign: 'center',
                    borderColor: clozeSubmitted
                      ? (clozeInputs[index]?.toLowerCase().trim() === currentCard.clozeAnswers![index].toLowerCase().trim()
                          ? 'var(--success)'
                          : 'var(--danger)')
                      : undefined
                  }}
                />
              ))}
            </div>
            {clozeSubmitted && (
              <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                {checkClozeAnswers() ? (
                  <p style={{ color: 'var(--success)', fontWeight: '600' }}>
                    ✓ All correct!
                  </p>
                ) : (
                  <p style={{ color: 'var(--danger)' }}>
                    Answers: {currentCard.clozeAnswers?.join(', ')}
                  </p>
                )}
              </div>
            )}
            {!clozeSubmitted && currentCard.clozeAnswers && (
              <button
                onClick={() => setClozeSubmitted(true)}
                disabled={clozeInputs.some(i => !i.trim())}
                className="primary-button-component"
                style={{ marginTop: '1rem' }}
              >
                Check Answers
              </button>
            )}
          </div>
        );
      
      case 'image':
        return (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'inline-block',
              background: 'var(--background-color)',
              padding: '0.4rem 0.85rem',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              color: 'var(--secondary-text-color)'
            }}>
              IMAGE CARD
            </div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              margin: '0 0 1.5rem 0',
              color: 'var(--text-color)',
              lineHeight: 1.4,
              fontWeight: '600'
            }}>
              {currentCard.front}
            </h2>
            <div style={{
              width: '100%',
              maxWidth: '300px',
              height: '200px',
              margin: '0 auto',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--border-style)'
            }}>
              {currentCard.imageUrl && showImage ? (
                <img 
                  src={currentCard.imageUrl} 
                  alt="Card" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--background-color-secondary)',
                  cursor: 'pointer'
                }} onClick={() => setShowImage(true)}>
                  <Eye size={32} color="var(--secondary-text-color)" />
                  <span style={{ marginLeft: '0.5rem', color: 'var(--secondary-text-color)' }}>
                    Reveal image
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderBack = () => (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'inline-block',
        background: 'var(--success)',
        color: 'white',
        padding: '0.4rem 0.85rem',
        borderRadius: '999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        marginBottom: '1.5rem'
      }}>
        ANSWER
      </div>
      <p style={{ 
        fontSize: '1.25rem', 
        margin: 0,
        color: 'var(--text-color)',
        lineHeight: 1.6
      }}>
        {currentCard.back}
      </p>
    </div>
  );

  if (!currentCard) {
    return null;
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      height: '100%',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <button
          onClick={onExit}
          className="ghost-button-component"
          style={{ padding: '0.5rem 1rem' }}
        >
          <ChevronLeft size={18} /> Exit
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ 
            fontSize: '0.875rem', 
            color: 'var(--secondary-text-color)',
            fontWeight: '500'
          }}>
            {currentIndex + 1} / {cards.length}
          </span>
          <button
            onClick={() => setShowHint(!showHint)}
            disabled={!currentCard.hint}
            className="ghost-button-component"
            style={{ 
              padding: '0.5rem',
              opacity: currentCard.hint ? 1 : 0.3
            }}
            title={currentCard.hint ? 'Toggle hint' : 'No hint available'}
          >
            {showHint ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        width: '100%',
        height: '6px',
        background: 'var(--background-color-secondary)',
        borderRadius: '3px',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${((currentIndex) / cards.length) * 100}%`,
          height: '100%',
          background: 'var(--primary)',
          borderRadius: '3px',
          transition: 'width 0.3s'
        }} />
      </div>

      {/* Card */}
      <div style={{ perspective: '1000px', width: '100%', maxWidth: '500px' }}>
        <div
          onClick={handleFlip}
          style={{
            position: 'relative',
            width: '100%',
            height: '320px',
            cursor: 'pointer',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'var(--background-color-secondary)',
            borderRadius: '20px',
            border: '1px solid var(--border-style)',
            boxShadow: 'var(--box-shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            {renderFront()}
          </div>
          
          {/* Back */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'var(--background-color-secondary)',
            borderRadius: '20px',
            border: '2px solid var(--success)',
            boxShadow: '0 10px 30px rgba(57, 203, 63, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'rotateY(180deg)',
            overflow: 'hidden'
          }}>
            {renderBack()}
          </div>
        </div>
      </div>

      {/* Flip hint */}
      {!flipped && (
        <p style={{
          marginTop: '1rem',
          fontSize: '0.85rem',
          color: 'var(--secondary-text-color)'
        }}>
          Tap card to reveal answer
        </p>
      )}

      {/* Score buttons (only when flipped) */}
      {flipped && (
        <div style={{
          marginTop: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          width: '100%',
          maxWidth: '500px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <button
            onClick={() => handleScore(1)}
            className="base-button-component"
            style={{ 
              background: 'var(--danger)', 
              color: 'white',
              flexDirection: 'column',
              padding: '1rem'
            }}
          >
            Again
            <small style={{ fontSize: '0.7rem', opacity: 0.8 }}>{'< 1m'}</small>
          </button>
          <button
            onClick={() => handleScore(2)}
            className="base-button-component"
            style={{ 
              background: 'var(--orange)', 
              color: 'white',
              flexDirection: 'column',
              padding: '1rem'
            }}
          >
            Hard
            <small style={{ fontSize: '0.7rem', opacity: 0.8 }}>10m</small>
          </button>
          <button
            onClick={() => handleScore(3)}
            className="base-button-component"
            style={{ 
              background: 'var(--primary)', 
              color: 'white',
              flexDirection: 'column',
              padding: '1rem'
            }}
          >
            Good
            <small style={{ fontSize: '0.7rem', opacity: 0.8 }}>1d</small>
          </button>
          <button
            onClick={() => handleScore(4)}
            className="base-button-component"
            style={{ 
              background: 'var(--success)', 
              color: 'white',
              flexDirection: 'column',
              padding: '1rem'
            }}
          >
            Easy
            <small style={{ fontSize: '0.7rem', opacity: 0.8 }}>4d</small>
          </button>
        </div>
      )}

      {/* Bottom info */}
      <div style={{
        marginTop: '1rem',
        display: 'flex',
        gap: '1.5rem',
        fontSize: '0.8rem',
        color: 'var(--secondary-text-color)'
      }}>
        <span>Flips: {flips}</span>
        {currentCard.topic && <span>Topic: {currentCard.topic}</span>}
      </div>
    </div>
  );
}
