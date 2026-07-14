import { useState } from 'react';
import { Bot, CheckCircle } from 'lucide-react';

interface TeachModeProps {
  item: {
    question: string;
    answer: string;
    modelAnswer?: string[];
    type?: string;
  };
  onScore: (score: number) => void;
  showProgress?: boolean;
  progress?: number;
  cardCount?: number;
  currentIndex?: number;
}

export default function TeachMode({ 
  item, 
  onScore,
  showProgress = false,
  progress = 0,
  cardCount = 0,
  currentIndex = 0 
}: TeachModeProps) {
  const [typedAnswer, setTypedAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{missed: string[], score: number} | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedAnswer.trim()) return;

    setSubmitted(true);
    setEvaluating(true);

    // Simulate AI evaluation
    setTimeout(() => {
      const lowerResp = typedAnswer.toLowerCase();
      const modelAnswers = item.modelAnswer || [];
      const missed = modelAnswers.filter((kw: string) => !lowerResp.includes(kw.toLowerCase()));
      const calcScore = missed.length === 0 ? 4 : (missed.length <= 2 ? 2 : 1);
      
      setFeedback({ missed, score: calcScore });
      setEvaluating(false);
    }, 1500);
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
        <Bot size={14} />
        Teach Mode (Feynman)
      </div>
      
      <h2 style={{ textAlign: 'center', margin: '0 0 0.5rem 0', color: 'var(--color-text)' }}>
        Teach the concept:
      </h2>
      <p style={{ 
        textAlign: 'center', 
        marginBottom: '2rem', 
        fontSize: '1.2rem', 
        color: 'var(--color-primary)', 
        fontWeight: 'bold' 
      }}>
        {item.question}
      </p>

      {!submitted ? (
        <form onSubmit={handleSubmit} style={{ 
          width: '100%', 
          maxWidth: '600px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem'
        }}>
          <textarea 
            autoFocus
            value={typedAnswer} 
            onChange={e => setTypedAnswer(e.target.value)}
            placeholder="Explain it simply in your own words..."
            style={{
              padding: '1.5rem', 
              borderRadius: '16px', 
              border: '1px solid var(--color-border)', 
              background: 'var(--color-surface-solid)', 
              resize: 'vertical', 
              minHeight: '150px', 
              fontSize: '1rem', 
              lineHeight: 1.6,
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
              fontSize: '1.1rem',
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
            Submit to AI Examiner
          </button>
        </form>
      ) : evaluating ? (
        <div style={{ 
          padding: '3rem', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          opacity: 0.7,
          color: 'var(--color-text-secondary)'
        }}>
          <Bot size={48} className="fade-in" style={{ animation: 'spin 2s linear infinite' }} />
          <p style={{ marginTop: '1rem' }}>AI is analyzing your explanation...</p>
        </div>
      ) : feedback && (
        <div className="fade-in" style={{ width: '100%', maxWidth: '600px' }}>
          <div style={{
            padding: '2rem', 
            background: 'var(--color-bg)', 
            borderRadius: '16px', 
            marginBottom: '2rem', 
            border: '1px solid var(--color-border)'
          }}>
            <h3 style={{ 
              margin: '0 0 1rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              color: 'var(--color-text)'
            }}>
              <Bot size={24} color="var(--color-primary)" /> 
              AI Feedback
            </h3>
            
            {feedback.missed.length === 0 ? (
              <p style={{ 
                color: 'var(--color-secondary)', 
                fontWeight: 'bold', 
                margin: 0,
                textAlign: 'center'
              }}>
                <CheckCircle size={20} style={{ display: 'block', margin: '0 auto 0.5rem' }} />
                Excellent explanation! You covered all the critical concepts perfectly.
              </p>
            ) : (
              <>
                <p style={{ margin: '0 0 1rem 0', color: 'var(--color-text)' }}>You had a good start, but you missed some critical attributes:</p>
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}>
                  {feedback.missed.map(kw => (
                    <span key={kw} style={{
                      background: 'rgba(239, 68, 68, 0.1)', 
                      color: 'var(--color-btn-again)', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '8px', 
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <button 
            onClick={() => onScore(feedback.score)} 
            className="apple-button" 
            style={{
              width: '100%', 
              background: 'var(--color-primary)', 
              color: 'white', 
              border: 'none', 
              padding: '1rem', 
              borderRadius: '16px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Continue (Auto-Reschedule: {feedback.score > 2 ? 'Mastered' : 'Needs Review'})
          </button>
        </div>
      )}
    </div>
  );
}
