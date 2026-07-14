import { useState, useRef } from 'react';
import { Upload, FileText, X, Send, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { geminiModel } from '../../services/ai';

interface CourseMaterialUploadProps {
  courseCode: string;
  courseTitle: string;
  onBack: () => void;
}

interface UploadedFile {
  name: string;
  content: string;
  size: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function CourseMaterialUpload({ courseCode, courseTitle, onBack }: CourseMaterialUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [_error, setError] = useState('');
  const [mode, setMode] = useState<'upload' | 'chat'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    setUploading(true);
    setError('');

    for (const file of Array.from(selectedFiles)) {
      try {
        let content = '';
        
        if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
          content = await file.text();
        } else if (file.type === 'application/pdf') {
          content = `[PDF File: ${file.name}] - PDF text extraction will be handled by the AI. Please describe what you need help with from this material.`;
        } else if (file.type.startsWith('image/')) {
          content = `[Image File: ${file.name}] - Image analysis will be handled by the AI.`;
        } else {
          content = await file.text();
        }

        setFiles(prev => [...prev, {
          name: file.name,
          content: content.substring(0, 50000), // Limit to 50KB per file
          size: file.size
        }]);
      } catch {
        setError(`Failed to read ${file.name}`);
      }
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || files.length === 0) return;

    const userMessage = question.trim();
    setQuestion('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const fileContext = files.map(f => `--- ${f.name} ---\n${f.content}`).join('\n\n');
      
      const prompt = `You are a helpful study assistant for the course "${courseCode}: ${courseTitle}". The student has uploaded the following course materials:

${fileContext}

Based on these materials, answer the student's question. If the materials don't contain the answer, use your general knowledge of the subject but mention that the uploaded materials may not cover this topic. Be thorough, educational, and reference the materials when relevant.

Student Question: ${userMessage}`;

      const result = await geminiModel.generateContent(prompt);
      const response = result.response;
      const answer = response.text();

      setChatMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I had trouble analyzing your materials. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStudy = async (type: 'summary' | 'quiz' | 'flashcards') => {
    if (files.length === 0) return;

    setLoading(true);
    try {
      const fileContext = files.map(f => `--- ${f.name} ---\n${f.content}`).join('\n\n');
      let prompt = '';

      if (type === 'summary') {
        prompt = `Based on these course materials for "${courseCode}: ${courseTitle}", generate a comprehensive study summary:

${fileContext}

Include key concepts, definitions, formulas, and important points organized by topic.`;
      } else if (type === 'quiz') {
        prompt = `Based on these course materials for "${courseCode}: ${courseTitle}", generate 10 practice quiz questions:

${fileContext}

Return ONLY a JSON array in this format:
[{
  "question": "Question text?",
  "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
  "correctAnswer": "A",
  "explanation": "Brief explanation"
}]`;
      } else {
        prompt = `Based on these course materials for "${courseCode}: ${courseTitle}", generate 10 study flashcards:

${fileContext}

Return ONLY a JSON array in this format:
[{
  "front": "Question or concept",
  "back": "Answer or explanation",
  "hint": "Helpful hint"
}]`;
      }

      const result = await geminiModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `**${type === 'summary' ? 'Study Summary' : type === 'quiz' ? 'Practice Quiz' : 'Flashcards'}:**\n\n${text}` 
      }]);
    } catch {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Sorry, I couldn't generate ${type} from your materials. Please try again.` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={onBack} className="ghost-button-component" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>{courseCode}</div>
          <h1 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.25rem', fontWeight: '700' }}>
            Course Material Upload
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--secondary-text-color)', fontSize: '0.85rem' }}>
            Upload your notes, slides, or study materials and let AI help you study
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="login-content" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1rem', fontWeight: '600' }}>
            Uploaded Materials ({files.length})
          </h3>
          <label
            className="primary-button-component"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              marginBottom: 0
            }}
          >
            <Upload size={14} />
            {uploading ? 'Uploading...' : 'Add Files'}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md,.pdf,.doc,.docx,.pptx"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>
        </div>

        {files.length === 0 ? (
          <div style={{
            padding: '2rem',
            border: '2px dashed var(--border-style)',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'var(--secondary-text-color)'
          }}>
            <FileText size={40} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>No materials uploaded yet</p>
            <p style={{ margin: 0, fontSize: '0.75rem' }}>
              Upload lecture notes, slides, or textbooks (.txt, .md, .pdf, .docx)
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {files.map((file, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: 'var(--background-color)',
                borderRadius: '8px'
              }}>
                <FileText size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-color)', fontWeight: '500' }}>{file.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--secondary-text-color)' }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--danger)',
                    padding: '0.25rem'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {files.length > 0 && mode === 'upload' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { type: 'summary' as const, label: 'Generate Summary', icon: '📝' },
            { type: 'quiz' as const, label: 'Practice Quiz', icon: '❓' },
            { type: 'flashcards' as const, label: 'Flashcards', icon: '🃏' }
          ].map(action => (
            <button
              key={action.type}
              onClick={() => { handleGenerateStudy(action.type); setMode('chat'); }}
              disabled={loading}
              className="login-content card-hover"
              style={{
                padding: '1rem',
                cursor: 'pointer',
                textAlign: 'center',
                border: 'none'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{action.icon}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-color)', fontWeight: '500' }}>{action.label}</div>
            </button>
          ))}
        </div>
      )}

      {/* Chat Section */}
      {mode === 'chat' && (
        <div className="login-content" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1rem', fontWeight: '600' }}>
              Ask About Your Materials
            </h3>
          </div>

          {chatMessages.length > 0 && (
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: msg.role === 'user' ? 'var(--primary)' : 'var(--background-color)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-color)',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  background: 'var(--background-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Loader2 size={16} className="animate-spin" style={{ color: 'var(--primary)' }} />
                  <span style={{ color: 'var(--secondary-text-color)', fontSize: '0.85rem' }}>Analyzing your materials...</span>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleAskQuestion} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your uploaded materials..."
              className="thea-text-input"
              style={{ flex: 1 }}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="primary-button-component"
              style={{ padding: '0.75rem 1rem' }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
