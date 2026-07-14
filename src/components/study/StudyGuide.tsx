import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, BookOpen, ArrowLeft } from 'lucide-react';
import { askStudyQuestion, generateStudySummary } from '../../services/ai';
import type { Course } from '../../data/courses';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface StudyGuideProps {
  course: Course;
  topic: string;
  onBack: () => void;
}

export default function StudyGuide({ course, topic, onBack }: StudyGuideProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSummary = async () => {
    setSummaryLoading(true);
    try {
      const result = await generateStudySummary(topic, course.title);
      setSummary(result);
    } catch (error) {
      setSummary('Failed to generate summary. Please try again.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await askStudyQuestion(userMessage.content, topic, course.title);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'Explain this topic in simple terms',
    'What are the key concepts I need to know?',
    'Give me practice questions',
    'What are common exam mistakes on this topic?',
    'Create mnemonics for key terms'
  ];

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
        marginBottom: '1rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-style)'
      }}>
        <button onClick={onBack} className="ghost-button-component" style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={18} /> Back
        </button>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1rem', fontWeight: '600' }}>
            AI Study Guide
          </h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--secondary-text-color)' }}>
            {course.title} - {topic}
          </p>
        </div>
        <button onClick={loadSummary} disabled={summaryLoading} className="ghost-button-component" style={{ padding: '0.5rem 1rem' }}>
          <BookOpen size={16} /> Summary
        </button>
      </div>

      {/* Summary Panel */}
      {summary && (
        <div className="login-content" style={{
          padding: '1.5rem',
          marginBottom: '1rem',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ margin: 0, color: 'var(--text-color)', fontWeight: '600' }}>Study Summary</h4>
            <button onClick={() => setSummary(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--secondary-text-color)' }}>
              ×
            </button>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-color)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {summary}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brightLavender), var(--brighterLavender))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Bot size={28} color="var(--night)" />
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-color)', fontWeight: '600' }}>
              AI Study Assistant
            </h4>
            <p style={{ color: 'var(--secondary-text-color)', marginBottom: '1.5rem', maxWidth: '300px' }}>
              Ask questions about {topic} or use quick prompts below
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(q); }}
                  className="ghost-button-component"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '1rem'
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '0.75rem',
                flexShrink: 0
              }}>
                <Bot size={16} color="white" />
              </div>
            )}
            <div style={{
              maxWidth: '75%',
              padding: '0.875rem 1.25rem',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' ? 'var(--primary)' : 'var(--background-color-secondary)',
              color: msg.role === 'user' ? 'white' : 'var(--text-color)',
              fontSize: '0.9rem',
              lineHeight: 1.5
            }}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--nightLight)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '0.75rem',
                flexShrink: 0
              }}>
                <User size={16} color="var(--dawn)" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '0.75rem'
            }}>
              <Bot size={16} color="white" />
            </div>
            <div style={{
              padding: '1rem 1.5rem',
              borderRadius: '16px 16px 16px 4px',
              background: 'var(--background-color-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ color: 'var(--secondary-text-color)', fontSize: '0.9rem' }}>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '1rem 0',
        borderTop: '1px solid var(--border-style)'
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask about ${topic}...`}
          className="thea-text-input"
          style={{ flex: 1 }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="primary-button-component"
          style={{ padding: '0.875rem 1.25rem' }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
