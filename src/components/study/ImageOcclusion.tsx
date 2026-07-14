import { useState } from 'react';
import { Image, Eye, CheckCircle, XCircle } from 'lucide-react';

interface ImageOcclusionProps {
  item: {
    question: string;
    answer: string;
    imageUrl?: string;
    occlusionLabel?: string;
    box?: { x: number; y: number; label: string };
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

export default function ImageOcclusion({ 
  item, 
  onScore,
  showProgress = false,
  progress = 0,
  cardCount = 0,
  currentIndex = 0 
}: ImageOcclusionProps) {
  const [typedAnswer, setTypedAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Use the box data or fallback to occlusionLabel
  const box = item.box || { x: 50, y: 70, label: item.occlusionLabel || 'Label' };
  const isCorrect = submitted ? typedAnswer.toLowerCase().trim() === box.label.toLowerCase() : false;

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
        <Image size={14} />
        Image Occlusion / Cloze
      </div>
      
      <p style={{ 
        textAlign: 'center', 
        marginBottom: '2rem', 
        opacity: 0.7,
        color: 'var(--color-text-secondary)'
      }}>
        Identify the hidden region in the diagram.
      </p>

      {/* Image Area */}
      <div style={{ 
        width: '100%', 
        maxWidth: '400px', 
        height: '300px', 
        background: 'var(--color-unseen)', 
        borderRadius: '16px', 
        position: 'relative', 
        marginBottom: '2rem',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden',
        border: '1px solid var(--color-border)'
      }}>
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt="Study diagram" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover'
            }}
          />
        ) : (
          <span style={{opacity: 0.3, color: 'var(--color-text-secondary)'}}>
            [ Diagram of Cell ]
          </span>
        )}
        
        <div style={{
          position: 'absolute', 
          top: `${box.y}%`, 
          left: `${box.x}%`,
          background: submitted 
            ? (isCorrect ? 'var(--color-btn-easy)' : 'var(--color-btn-again)') 
            : 'var(--color-primary)',
          color: 'white', 
          padding: '0.5rem 1rem', 
          borderRadius: '8px', 
          fontWeight: 'bold',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.3s'
        }}>
          {submitted ? box.label : '?'}
        </div>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ 
          width: '100%', 
          maxWidth: '400px', 
          display: 'flex', 
          gap: '1rem'
        }}>
          <input 
            autoFocus
            value={typedAnswer} 
            onChange={e => setTypedAnswer(e.target.value)}
            placeholder="Type your guess..."
            style={{
              flex: 1, 
              padding: '1rem', 
              borderRadius: '12px', 
              border: '1px solid var(--color-border)', 
              background: 'var(--color-surface-solid)', 
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
              padding: '0 1.5rem', 
              border: 'none', 
              cursor: 'pointer',
              borderRadius: '12px',
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
            <Eye size={18} />
            Check
          </button>
        </form>
      ) : (
        <div className="fade-in" style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}>
          <h3 style={{ 
            margin: '0 0 2rem', 
            color: isCorrect ? 'var(--color-btn-easy)' : 'var(--color-btn-again)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
            {isCorrect ? 'Correct!' : `Incorrect. The answer is ${box.label}.`}
          </h3>
          
          <h4 style={{ 
            margin: '0 0 1rem', 
            opacity: 0.7,
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            <Image size={16} />
            Schedule Next Review
          </h4>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '1rem'
          }}>
            <button 
              onClick={() => onScore(1)} 
              className="apple-button" 
              style={{ 
                ...scoreBtnStyle, 
                background: 'var(--color-btn-again)'
              }}
            >
              Again
            </button>
            <button 
              onClick={() => onScore(2)} 
              className="apple-button" 
              style={{ 
                ...scoreBtnStyle, 
                background: 'var(--color-btn-hard)'
              }}
            >
              Hard
            </button>
            <button 
              onClick={() => onScore(3)} 
              className="apple-button" 
              style={{ 
                ...scoreBtnStyle, 
                background: 'var(--color-btn-good)'
              }}
            >
              Good
            </button>
            <button 
              onClick={() => onScore(4)} 
              className="apple-button" 
              style={{ 
                ...scoreBtnStyle, 
                background: 'var(--color-btn-easy)'
              }}
            >
              Easy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
