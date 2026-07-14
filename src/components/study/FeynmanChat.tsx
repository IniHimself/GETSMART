import { useState } from 'react';

export default function FeynmanChat({ onBack }: { onBack: () => void }) {
  const [msgs, setMsgs] = useState([
    { role: 'bot', text: "Explain Enzyme Kinetics to me simply, like I'm a beginner." }
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMsgs([...msgs, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'bot', text: "That's a good start! But what happens when the substrate concentration gets too high? Can it keep speeding up forever?" }]);
    }, 1500);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s', display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ alignSelf: 'flex-start', marginBottom: '1rem', background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold' }}>
        ← Back to Outline
      </button>

      <h2>Feynman Technique Chat</h2>
      <p style={{opacity: 0.7, marginTop: 0}}>Master a concept by explaining it simply.</p>

      <div style={{ flex: 1, background: 'var(--color-surface)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                background: m.role === 'user' ? 'var(--color-primary)' : 'var(--color-bg)',
                color: m.role === 'user' ? 'white' : 'var(--color-text)',
                padding: '1rem', borderRadius: '16px', maxWidth: '70%', lineHeight: '1.5'
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '1rem', background: 'var(--color-bg)' }}>
          <textarea 
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Type your explanation here..."
            style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: 'var(--color-surface)', color: 'var(--color-text)', resize: 'none', height: '60px', fontFamily: 'inherit' }}
          />
          <button onClick={send} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '0 2rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
