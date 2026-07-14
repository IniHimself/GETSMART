import { useState } from 'react';
import { Lightbulb, CheckCircle } from 'lucide-react';

interface ActiveRecallProps {
  item: {
    question: string;
    answer: string;
    type?: string;
  };
  onScore: (score: number) => void;
  showProgress?: boolean;
  progress?: number;
  cardCount?: number;
  currentIndex?: number;
}

const scoreBtnStyle = {
  color: 'white', border: 'none', padding: '1rem', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold'
};

export default function ActiveRecall({ 
  item, 
  onScore, 
  showProgress = false,
  progress = 0,
  cardCount = 0,
  currentIndex = 0 
}: ActiveRecallProps) {
  const [typedAnswer, setTypedAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedAnswer.trim()) setSubmitted(true);
  };

  return (
    <div className="glass-panel fade-in" style={{
      padding: '3rem', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      border: '1px solid var(--color-border)',
      maxWidth: '800px',
      margin: '0 auto',
      width: '100%'
    }}>
      {/* Progress Header */}
      {showProgress && (
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <button 
            onClick={() => onScore(0)}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            End Session
          </button>
          
          <div style={{ flex: 1, margin: '0 2rem' }}>
            <div style={{
              background: 'var(--color-unseen)',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'var(--color-primary)',
                height: '100%',
                borderRadius: '4px',
                width: `${progress}%`,
                transition: 'width 0.3s'
              }}></div>
            </div>
          </div>
          
          <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {currentIndex + 1} / {cardCount}
          </span>
        </div>
      )}

      <div style={{
        background: 'var(--color-primary)', 
        color: 'white', 
        padding: '0.5rem 1rem', 
        borderRadius: '999px', 
        fontSize: '0.8rem', 
        fontWeight: 'bold', 
        marginBottom: '2rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <Lightbulb size={14} />
        Active Recall
      </div>
      
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-text)' }}>
        {item.question}
      </h2>

      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ 
          width: '100%', 
          maxWidth: '500px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem'
        }}>
          <textarea 
            autoFocus
            value={typedAnswer} 
            onChange={e => setTypedAnswer(e.target.value)}
            placeholder="Type your answer here..."
            style={{
              padding: '1rem', 
              borderRadius: '16px', 
              border: '1px solid var(--color-border)', 
              background: 'var(--color-surface-solid)', 
              resize: 'vertical', 
              minHeight: '100px', 
              fontSize: '1rem',
              color: 'var(--color-text)',
              fontFamily: 'inherit'
            }}
          />
          <button 
            type="submit" 
            className="apple-button" 
            style={{
              background: 'var(--color-primary)', 
              color: 'white', 
              padding: '1rem', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: 'bold',
              borderRadius: '12px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Reveal Answer
          </button>
        </form>
      ) : (
        <div className="fade-in" style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <div style={{
            padding: '1.5rem', 
            background: 'var(--color-bg)', 
            borderRadius: '16px', 
            marginBottom: '2rem', 
            border: '1px solid var(--color-border)',
            textAlign: 'left'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem 0', 
              color: 'var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CheckCircle size={18} />
              Correct Answer:
            </h3>
            <p style={{ fontSize: '1.1rem', margin: 0, color: 'var(--color-text)' }}>
              {item.answer}
            </p>
          </div>
          
          <h4 style={{ 
            margin: '0 0 1rem', 
            opacity: 0.7, 
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <Lightbulb size={16} />
            How well did you know this? (SM-2 Scheduler)
          </h4>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <button 
              onClick={() => onScore(1)} 
              className="apple-button" 
              style={{ 
                ...scoreBtnStyle, 
                background: 'var(--color-btn-again)'
              }}
            >
              Again<br/><small style={{ fontSize: '0.7rem', opacity: 0.8 }}>1m</small>
            </button>
            <button 
              onClick={() => onScore(2)} 
              className="apple-button" 
              style={{ 
                ...scoreBtnStyle, 
                background: 'var(--color-btn-hard)'
              }}
            >
              Hard<br/><small style={{ fontSize: '0.7rem', opacity: 0.8 }}>10m</small>
            </button>
            <button 
              onClick={() => onScore(3)} 
              className="apple-button" 
              style={{ 
                ...scoreBtnStyle, 
                background: 'var(--color-btn-good)'
              }}
            >
              Good<br/><small style={{ fontSize: '0.7rem', opacity: 0.8 }}>1d</small>
            </button>
            <button 
              onClick={() => onScore(4)} 
              className="apple-button" 
              style={{ 
                ...scoreBtnStyle, 
                background: 'var(--color-btn-easy)'
              }}
            >
              Easy<br/><small style={{ fontSize: '0.7rem', opacity: 0.8 }}>4d</small>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
