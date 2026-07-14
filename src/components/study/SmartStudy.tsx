import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, CheckCircle, XCircle, Clock, Zap, Brain, Target, ArrowRight, RotateCcw } from 'lucide-react';
import { generateSmartStudySession } from '../../services/ai';
import type { Course } from '../../data/courses';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: string;
}

interface SmartStudyProps {
  course: Course;
  topic: string;
  onBack: () => void;
  onComplete: (results: StudyResults) => void;
}

export interface StudyResults {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  timeSpent: number;
  difficultyBreakdown: { easy: number; medium: number; hard: number };
  topicsStudied: string[];
}

type StudyPhase = 'loading' | 'active' | 'review' | 'complete';

export default function SmartStudy({ course, topic, onBack, onComplete }: SmartStudyProps) {
  const [phase, setPhase] = useState<StudyPhase>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [, setAnswers] = useState<{ question: number; selected: string; correct: boolean; timeSpent: number }[]>([]);
  const [timer, setTimer] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const startTimeRef = useRef(Date.now());
  const questionStartRef = useRef(Date.now());

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    if (phase !== 'active') return;
    const interval = setInterval(() => {
      setTimer(Math.floor((Date.now() - startTimeRef.current) / 1000));
      setQuestionTimer(Math.floor((Date.now() - questionStartRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const loadQuestions = async () => {
    try {
      setPhase('loading');
      const sessionQuestions = await generateSmartStudySession(
        course.title,
        topic,
        weakTopics,
        'adaptive'
      );
      setQuestions(sessionQuestions);
      setPhase('active');
      startTimeRef.current = Date.now();
      questionStartRef.current = Date.now();
    } catch (error) {
      console.error('Failed to load questions:', error);
      setPhase('active');
      const fallback: Question[] = [];
      setQuestions(fallback);
    }
  };

  const handleAnswer = useCallback((answer: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    setShowExplanation(true);

    const currentQuestion = questions[currentIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    const timeSpent = Math.floor((Date.now() - questionStartRef.current) / 1000);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setMaxStreak(max => Math.max(max, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
      setWeakTopics(prev => [...new Set([...prev, topic])]);
    }

    setAnswers(prev => [...prev, {
      question: currentIndex,
      selected: answer,
      correct: isCorrect,
      timeSpent
    }]);
  }, [selectedAnswer, currentIndex, questions, topic]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setQuestionTimer(0);
      questionStartRef.current = Date.now();
    } else {
      const results: StudyResults = {
        totalQuestions: questions.length,
        correctAnswers: score,
        incorrectAnswers: questions.length - score,
        accuracy: Math.round((score / questions.length) * 100),
        timeSpent: timer,
        difficultyBreakdown: {
          easy: questions.filter(q => q.difficulty === 'easy').length,
          medium: questions.filter(q => q.difficulty === 'medium').length,
          hard: questions.filter(q => q.difficulty === 'hard').length
        },
        topicsStudied: [topic]
      };
      setPhase('complete');
      onComplete(results);
    }
  }, [currentIndex, questions.length, score, timer, topic, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'var(--success)';
      case 'medium': return 'var(--gold)';
      case 'hard': return 'var(--danger)';
      default: return 'var(--primary)';
    }
  };

  if (phase === 'loading') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem'
      }}>
        <div className="loader-ring" style={{ marginBottom: '2rem' }} />
        <h3 style={{ color: 'var(--text-color)', margin: '0 0 0.5rem 0', fontWeight: '600' }}>
          Generating Your Smart Study Session
        </h3>
        <p style={{ color: 'var(--secondary-text-color)', textAlign: 'center', maxWidth: '400px' }}>
          AI is creating personalized questions based on your course material...
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem'
      }}>
        <Brain size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
        <h3 style={{ color: 'var(--text-color)', margin: '0 0 0.5rem 0' }}>No questions available</h3>
        <p style={{ color: 'var(--secondary-text-color)', marginBottom: '1.5rem' }}>Try selecting a different topic</p>
        <button onClick={onBack} className="ghost-button-component">Go Back</button>
      </div>
    );
  }

  if (phase === 'complete') {
    const accuracy = Math.round((score / questions.length) * 100);
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
          <Target size={48} color="white" />
        </div>
        
        <h2 style={{ margin: '0 0 0.5rem', color: 'var(--text-color)', fontSize: '1.75rem', fontWeight: '700' }}>
          {accuracy >= 80 ? 'Excellent Work!' : accuracy >= 50 ? 'Good Progress!' : 'Keep Practicing!'}
        </h2>
        <p style={{ color: 'var(--secondary-text-color)', marginBottom: '2rem', textAlign: 'center', maxWidth: '400px' }}>
          You answered {score} out of {questions.length} questions correctly
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
          width: '100%',
          maxWidth: '400px'
        }}>
          {[
            { label: 'Accuracy', value: `${accuracy}%`, color: 'var(--primary)' },
            { label: 'Time', value: formatTime(timer), color: 'var(--gold)' },
            { label: 'Best Streak', value: `${maxStreak}`, color: 'var(--success)' },
            { label: 'Questions', value: `${questions.length}`, color: 'var(--brightLavender)' }
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              padding: '1rem',
              background: 'var(--background-color-secondary)',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--secondary-text-color)', fontWeight: '500' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onBack} className="ghost-button-component" style={{ padding: '0.875rem 1.5rem' }}>
            Back to Overview
          </button>
          <button onClick={loadQuestions} className="primary-button-component" style={{ padding: '0.875rem 1.5rem' }}>
            <RotateCcw size={18} /> Study Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="fade-enter fade-enter-active" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <button onClick={onBack} className="ghost-button-component" style={{ padding: '0.5rem 1rem' }}>
          <ChevronLeft size={18} /> Exit
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 0.75rem',
            background: 'rgba(0, 117, 255, 0.1)',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: '600',
            color: 'var(--primary)'
          }}>
            <Zap size={14} /> {streak} streak
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.375rem 0.75rem',
            background: 'rgba(253, 189, 25, 0.1)',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: '600',
            color: 'var(--gold)'
          }}>
            <Clock size={14} /> {formatTime(questionTimer)}
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text-color)', fontWeight: '500' }}>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '6px',
        background: 'var(--background-color-secondary)',
        borderRadius: '3px',
        marginBottom: '2rem',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'var(--primary)',
          borderRadius: '3px',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Question Card */}
      <div className="login-content" style={{
        padding: '2rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            background: `${getDifficultyColor(currentQuestion.difficulty)}20`,
            color: getDifficultyColor(currentQuestion.difficulty)
          }}>
            {currentQuestion.difficulty.toUpperCase()}
          </span>
        </div>
        <h3 style={{
          margin: 0,
          fontSize: '1.25rem',
          color: 'var(--text-color)',
          lineHeight: 1.6,
          fontWeight: '600'
        }}>
          {currentQuestion.question}
        </h3>
      </div>

      {/* Answer Options */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        {currentQuestion.options.map((option, index) => {
          const letter = String.fromCharCode(65 + index);
          const isSelected = selectedAnswer === option;
          const isCorrect = option.startsWith(currentQuestion.correctAnswer + ')') || 
                           option.startsWith(currentQuestion.correctAnswer + '.');
          const showResult = showExplanation;

          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className="base-button-component"
              style={{
                justifyContent: 'flex-start',
                padding: '1rem 1.25rem',
                background: showResult
                  ? (isCorrect ? 'rgba(57, 203, 63, 0.1)' : isSelected ? 'rgba(255, 50, 50, 0.1)' : 'var(--background-color-secondary)')
                  : 'var(--background-color-secondary)',
                border: `2px solid ${
                  showResult
                    ? (isCorrect ? 'var(--success)' : isSelected ? 'var(--danger)' : 'var(--border-style)')
                    : 'var(--border-style)'
                }`,
                color: 'var(--text-color)',
                cursor: selectedAnswer !== null ? 'default' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: showResult
                  ? (isCorrect ? 'var(--success)' : isSelected ? 'var(--danger)' : 'var(--background-color)')
                  : 'var(--background-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: showResult && (isCorrect || isSelected) ? 'white' : 'var(--text-color)',
                flexShrink: 0
              }}>
                {showResult ? (isCorrect ? '✓' : isSelected ? '✗' : letter) : letter}
              </span>
              <span style={{ flex: 1 }}>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="fade-enter fade-enter-active" style={{
          padding: '1.25rem',
          background: selectedAnswer === (currentQuestion.options.find(o => 
            o.startsWith(currentQuestion.correctAnswer + ')') || o.startsWith(currentQuestion.correctAnswer + '.')
          )) ? 'rgba(57, 203, 63, 0.05)' : 'rgba(255, 50, 50, 0.05)',
          border: `1px solid ${selectedAnswer === (currentQuestion.options.find(o => 
            o.startsWith(currentQuestion.correctAnswer + ')') || o.startsWith(currentQuestion.correctAnswer + '.')
          )) ? 'var(--success)' : 'var(--danger)'}`,
          borderRadius: '12px',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            {selectedAnswer === (currentQuestion.options.find(o => 
              o.startsWith(currentQuestion.correctAnswer + ')') || o.startsWith(currentQuestion.correctAnswer + '.')
            )) ? (
              <CheckCircle size={18} color="var(--success)" />
            ) : (
              <XCircle size={18} color="var(--danger)" />
            )}
            <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-color)' }}>
              {selectedAnswer === (currentQuestion.options.find(o => 
                o.startsWith(currentQuestion.correctAnswer + ')') || o.startsWith(currentQuestion.correctAnswer + '.')
              )) ? 'Correct!' : 'Incorrect'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-color)', lineHeight: 1.5 }}>
            {currentQuestion.explanation}
          </p>
        </div>
      )}

      {/* Next Button */}
      {selectedAnswer !== null && (
        <button
          onClick={handleNext}
          className="primary-button-component btn-block"
          style={{ padding: '0.875rem' }}
        >
          {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
          <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
}
