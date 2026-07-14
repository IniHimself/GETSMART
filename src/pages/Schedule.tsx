import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2, Target } from 'lucide-react';
import { useAppGlobal } from '../context/AppContext';
import { useStudy } from '../context/StudyContext';
import { getCoursesByUniversity } from '../data/courses';

interface StudyBlock {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  courseCode: string;
  courseTitle: string;
  type: 'lecture' | 'review' | 'practice' | 'break';
  completed: boolean;
}

interface PlannerSettings {
  wakeUp: string;
  bedTime: string;
  dailyGoalMinutes: number;
  freeHours: string[];
  semesterStart: string;
  examDate: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 16 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const STORAGE_KEY = 'getsmart_planner';

export default function Planner() {
  const { profile } = useAppGlobal();
  const { timerState, setDailyStudyGoal } = useStudy();
  
  const [settings, setSettings] = useState<PlannerSettings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored).settings;
      } catch {}
    }
    return {
      wakeUp: '07:00',
      bedTime: '23:00',
      dailyGoalMinutes: 120,
      freeHours: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      semesterStart: '',
      examDate: ''
    };
  });

  const [blocks, setBlocks] = useState<StudyBlock[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored).blocks;
      } catch {}
    }
    return [];
  });

  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [newBlock, setNewBlock] = useState({
    startTime: '09:00',
    endTime: '10:00',
    courseCode: '',
    courseTitle: '',
    type: 'review' as const
  });

  const studentCourses = profile.university ? getCoursesByUniversity(profile.university) : [];

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings, blocks }));
  }, [settings, blocks]);

  // Sync daily goal
  useEffect(() => {
    if (settings.dailyGoalMinutes !== timerState.dailyGoal) {
      setDailyStudyGoal(settings.dailyGoalMinutes);
    }
  }, [settings.dailyGoalMinutes]);

  const toggleFreeHour = (hour: string) => {
    setSettings(prev => ({
      ...prev,
      freeHours: prev.freeHours.includes(hour)
        ? prev.freeHours.filter(h => h !== hour)
        : [...prev.freeHours, hour].sort()
    }));
  };

  const addBlock = () => {
    if (!newBlock.courseCode || !newBlock.courseTitle) return;
    const block: StudyBlock = {
      id: `block-${Date.now()}`,
      day: selectedDay,
      ...newBlock,
      completed: false
    };
    setBlocks(prev => [...prev, block]);
    setShowAddBlock(false);
    setNewBlock({ startTime: '09:00', endTime: '10:00', courseCode: '', courseTitle: '', type: 'review' });
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const toggleBlockComplete = (id: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, completed: !b.completed } : b));
  };

  const getBlocksForDay = (day: string) => blocks.filter(b => b.day === day);

  const getCompletionStats = () => {
    const total = blocks.length;
    const completed = blocks.filter(b => b.completed).length;
    return { total, completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'var(--primary)';
      case 'review': return 'var(--success)';
      case 'practice': return 'var(--gold)';
      case 'break': return 'var(--secondary-text-color)';
      default: return 'var(--primary)';
    }
  };

  const overallStats = getCompletionStats();

  return (
    <div className="fade-enter fade-enter-active">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          marginTop: 0, 
          color: 'var(--text-color)',
          fontSize: '2rem',
          fontWeight: '700',
          letterSpacing: '-0.02em'
        }}>
          Study Planner
        </h1>
        <p style={{ 
          color: 'var(--secondary-text-color)',
          fontSize: '1.125rem'
        }}>
          Plan your study schedule and track progress throughout the week
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '1.5rem'
      }}>
        
        {/* Weekly Overview */}
        <div className="login-content" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Target size={20} color="white" />
            </div>
            <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.125rem', fontWeight: '600' }}>
              Weekly Progress
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {DAYS.map(day => {
              const dayBlocks = getBlocksForDay(day);
              const dayCompleted = dayBlocks.filter(b => b.completed).length;
              const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
              return (
                <div key={day} style={{
                  textAlign: 'center',
                  padding: '0.75rem 0.25rem',
                  background: isToday ? 'rgba(0, 117, 255, 0.1)' : 'var(--background-color)',
                  borderRadius: '10px',
                  border: isToday ? '2px solid var(--primary)' : '2px solid transparent'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--secondary-text-color)', fontWeight: '500', marginBottom: '0.25rem' }}>
                    {day.slice(0, 3)}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-color)' }}>
                    {dayCompleted}/{dayBlocks.length}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text-color)' }}>Overall:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-color)' }}>
              {overallStats.completed}/{overallStats.total} blocks ({overallStats.percent}%)
            </span>
          </div>
          <div style={{ 
            width: '100%', height: '8px', background: 'var(--background-color-secondary)',
            borderRadius: '4px', overflow: 'hidden'
          }}>
            <div style={{
              width: `${overallStats.percent}%`, height: '100%',
              background: 'var(--primary)', borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Settings */}
        <div className="login-content" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--brightLavender), var(--brighterLavender))',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Clock size={20} color="var(--night)" />
            </div>
            <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.125rem', fontWeight: '600' }}>
              Schedule Settings
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '500', color: 'var(--secondary-text-color)' }}>
                Wake Up
              </label>
              <input
                type="time"
                value={settings.wakeUp}
                onChange={(e) => setSettings(prev => ({ ...prev, wakeUp: e.target.value }))}
                className="thea-text-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '500', color: 'var(--secondary-text-color)' }}>
                Bed Time
              </label>
              <input
                type="time"
                value={settings.bedTime}
                onChange={(e) => setSettings(prev => ({ ...prev, bedTime: e.target.value }))}
                className="thea-text-input"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '500', color: 'var(--secondary-text-color)' }}>
              Daily Study Goal (minutes)
            </label>
            <input
              type="number"
              min="30"
              max="480"
              step="15"
              value={settings.dailyGoalMinutes}
              onChange={(e) => setSettings(prev => ({ ...prev, dailyGoalMinutes: parseInt(e.target.value) || 120 }))}
              className="thea-text-input"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '500', color: 'var(--secondary-text-color)' }}>
              Free Study Hours
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {TIME_SLOTS.filter(t => {
                const hour = parseInt(t.split(':')[0]);
                const wakeHour = parseInt(settings.wakeUp.split(':')[0]);
                const bedHour = parseInt(settings.bedTime.split(':')[0]);
                return hour >= wakeHour && hour < bedHour;
              }).map(hour => {
                const isActive = settings.freeHours.includes(hour);
                return (
                  <button
                    key={hour}
                    onClick={() => toggleFreeHour(hour)}
                    style={{
                      padding: '0.375rem 0.625rem',
                      background: isActive ? 'var(--primary)' : 'var(--background-color)',
                      color: isActive ? 'white' : 'var(--text-color)',
                      border: `1px solid ${isActive ? 'var(--primary)' : 'var(--border-style)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {hour}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '500', color: 'var(--secondary-text-color)' }}>
                Semester Start
              </label>
              <input
                type="date"
                value={settings.semesterStart}
                onChange={(e) => setSettings(prev => ({ ...prev, semesterStart: e.target.value }))}
                className="thea-text-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '500', color: 'var(--secondary-text-color)' }}>
                Exam Date
              </label>
              <input
                type="date"
                value={settings.examDate}
                onChange={(e) => setSettings(prev => ({ ...prev, examDate: e.target.value }))}
                className="thea-text-input"
              />
            </div>
          </div>
        </div>

        {/* Day Schedule */}
        <div className="login-content" style={{ padding: '2rem', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--green), var(--greenLight))',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Calendar size={20} color="white" />
              </div>
              <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.125rem', fontWeight: '600' }}>
                Daily Schedule
              </h3>
            </div>
            <button
              onClick={() => setShowAddBlock(!showAddBlock)}
              className="primary-button-component"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Add Block
            </button>
          </div>

          {/* Day Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {DAYS.map(day => {
              const dayBlocks = getBlocksForDay(day);
              const dayCompleted = dayBlocks.filter(b => b.completed).length;
              const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.75rem 1.25rem',
                    background: selectedDay === day ? 'var(--primary)' : isToday ? 'rgba(0, 117, 255, 0.05)' : 'var(--background-color)',
                    color: selectedDay === day ? 'white' : 'var(--text-color)',
                    border: `1px solid ${selectedDay === day ? 'var(--primary)' : 'var(--border-style)'}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    fontFamily: 'inherit',
                    minWidth: '80px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontWeight: '600' }}>{day.slice(0, 3)}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                    {dayCompleted}/{dayBlocks.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Add Block Form */}
          {showAddBlock && (
            <div className="fade-enter fade-enter-active" style={{
              padding: '1.5rem',
              background: 'var(--background-color)',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              border: '1px solid var(--border-style)'
            }}>
              <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-color)', fontSize: '1rem', fontWeight: '600' }}>
                Add Study Block - {selectedDay}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--secondary-text-color)' }}>Start</label>
                  <select
                    value={newBlock.startTime}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, startTime: e.target.value }))}
                    className="thea-text-input"
                  >
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--secondary-text-color)' }}>End</label>
                  <select
                    value={newBlock.endTime}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, endTime: e.target.value }))}
                    className="thea-text-input"
                  >
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--secondary-text-color)' }}>Course</label>
                  <select
                    value={newBlock.courseCode}
                    onChange={(e) => {
                      const course = studentCourses.find(c => c.code === e.target.value);
                      setNewBlock(prev => ({
                        ...prev,
                        courseCode: e.target.value,
                        courseTitle: course?.title || ''
                      }));
                    }}
                    className="thea-text-input"
                  >
                    <option value="">Select course...</option>
                    {studentCourses.map(c => (
                      <option key={c.code} value={c.code}>{c.code} - {c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--secondary-text-color)' }}>Type</label>
                  <select
                    value={newBlock.type}
                    onChange={(e) => setNewBlock(prev => ({ ...prev, type: e.target.value as any }))}
                    className="thea-text-input"
                  >
                    <option value="lecture">Lecture</option>
                    <option value="review">Review</option>
                    <option value="practice">Practice</option>
                    <option value="break">Break</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => setShowAddBlock(false)} className="ghost-button-component" style={{ padding: '0.5rem 1rem' }}>
                  Cancel
                </button>
                <button onClick={addBlock} className="primary-button-component" style={{ padding: '0.5rem 1.5rem' }} disabled={!newBlock.courseCode}>
                  Add Block
                </button>
              </div>
            </div>
          )}

          {/* Schedule Blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {getBlocksForDay(selectedDay).length === 0 ? (
              <div style={{ 
                padding: '3rem', textAlign: 'center',
                background: 'var(--background-color)', borderRadius: '12px'
              }}>
                <Calendar size={48} color="var(--secondary-text-color)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-color)' }}>No blocks scheduled</h4>
                <p style={{ margin: 0, color: 'var(--secondary-text-color)', fontSize: '0.9rem' }}>
                  Click "Add Block" to schedule study sessions for {selectedDay}
                </p>
              </div>
            ) : (
              getBlocksForDay(selectedDay)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map(block => (
                  <div
                    key={block.id}
                    className="login-content"
                    style={{
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      borderLeft: `4px solid ${getTypeColor(block.type)}`,
                      opacity: block.completed ? 0.6 : 1
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={block.completed}
                      onChange={() => toggleBlockComplete(block.id)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{
                          fontSize: '0.7rem', fontWeight: '600',
                          padding: '0.15rem 0.5rem', borderRadius: '999px',
                          background: `${getTypeColor(block.type)}20`,
                          color: getTypeColor(block.type)
                        }}>
                          {block.type.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text-color)' }}>
                          {block.startTime} - {block.endTime}
                        </span>
                      </div>
                      <div style={{ fontWeight: '600', color: 'var(--text-color)', fontSize: '0.95rem', textDecoration: block.completed ? 'line-through' : 'none' }}>
                        {block.courseCode} - {block.courseTitle}
                      </div>
                    </div>
                    <button
                      onClick={() => removeBlock(block.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--danger)', padding: '0.5rem'
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
