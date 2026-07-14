import { useState } from 'react';
import { BookOpen, BrainCircuit, Clock, Gamepad2, TrendingUp, Sparkles, MessageSquare, ArrowLeft, Loader2, Upload } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { useAppGlobal } from '../context/AppContext';
import { UNIVERSITIES, GST_COURSES, type Course, type University } from '../data/courses';
import { generateCourseTopics } from '../services/ai';
import SmartStudy from '../components/study/SmartStudy';
import StudyGuide from '../components/study/StudyGuide';
import GameCard from '../components/study/GameCard';
import FlashCard, { type FlashCardData } from '../components/study/FlashCard';
import FocusTimer from '../components/study/FocusTimer';
import CourseMaterialUpload from '../components/study/CourseMaterialUpload';

type Mode = 'overview' | 'smart-study' | 'guide' | 'timer' | 'game' | 'flashcards' | 'upload';

interface CourseTopics {
  courseCode: string;
  courseTitle: string;
  topics: Array<{ id: number; name: string; description: string }>;
}

export default function Study() {
  const { cardStats, startStudySession, showMilestoneAlert } = useStudy();
  const { profile } = useAppGlobal();
  
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [mode, setMode] = useState<Mode>('overview');
  const [view, setView] = useState<'universities' | 'courses' | 'topics' | 'study'>('universities');
  const [courseTopics, setCourseTopics] = useState<CourseTopics | null>(null);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [topicError, setTopicError] = useState<string | null>(null);

  // Filter universities based on student's enrollment
  const availableUniversities = profile.university 
    ? UNIVERSITIES.filter(uni => uni.id === profile.university)
    : UNIVERSITIES;

  const studentUniGST = profile.university 
    ? GST_COURSES.filter(c => c.university === profile.university || !c.university)
    : GST_COURSES;

  const handleSelectUniversity = (uni: University) => {
    setSelectedUniversity(uni);
    setView('courses');
  };

  const handleSelectCourse = async (course: Course) => {
    setSelectedCourse(course);
    setView('topics');
    setLoadingTopics(true);
    setTopicError(null);
    
    try {
      const topicsData = await generateCourseTopics(course.code, course.title, selectedUniversity?.name);
      setCourseTopics(topicsData);
    } catch (err) {
      console.error('Failed to generate topics:', err);
      setTopicError('Failed to load topics. Please try again.');
      setCourseTopics(null);
    } finally {
      setLoadingTopics(false);
    }
  };

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic);
    setView('study');
  };

  const handleStartStudy = (studyMode: Mode) => {
    if (selectedCourse && selectedTopic) {
      startStudySession(selectedCourse.title, selectedTopic);
      setMode(studyMode);
    }
  };

  const handleBack = () => {
    if (mode !== 'overview') {
      setMode('overview');
      return;
    }
    if (view === 'study') setView('topics');
    else if (view === 'topics') {
      setView('courses');
      setCourseTopics(null);
    }
    else if (view === 'courses') {
      setSelectedUniversity(null);
      setView('universities');
    }
  };

  const handleStudyComplete = () => {
    showMilestoneAlert('Study session complete! Great work!');
    setMode('overview');
  };

  if (mode === 'smart-study' && selectedCourse && selectedTopic) {
    return (
      <SmartStudy
        course={selectedCourse}
        topic={selectedTopic}
        onBack={() => setMode('overview')}
        onComplete={handleStudyComplete}
      />
    );
  }

  if (mode === 'guide' && selectedCourse && selectedTopic) {
    return (
      <StudyGuide
        course={selectedCourse}
        topic={selectedTopic}
        onBack={() => setMode('overview')}
      />
    );
  }

  if (mode === 'timer') {
    return <FocusTimer onBack={() => setMode('overview')} />;
  }

  if (mode === 'game' && selectedCourse && selectedTopic) {
    return (
      <GameCard
        questions={[]}
        onExit={() => setMode('overview')}
        onComplete={(score) => {
          showMilestoneAlert(`You scored ${score}%!`);
          setMode('overview');
        }}
      />
    );
  }

  if (mode === 'flashcards' && selectedCourse && selectedTopic) {
    const flashCards: FlashCardData[] = [
      { id: '1', front: 'Sample question', back: 'Sample answer', type: 'basic', topic: selectedTopic }
    ];
    return (
      <FlashCard
        cards={flashCards}
        onExit={() => setMode('overview')}
        onComplete={() => {
          showMilestoneAlert('Flashcard session complete!');
          setMode('overview');
        }}
      />
    );
  }

  if (mode === 'upload' && selectedCourse) {
    return (
      <CourseMaterialUpload
        courseCode={selectedCourse.code}
        courseTitle={selectedCourse.title}
        onBack={() => setMode('overview')}
      />
    );
  }

  // UNIVERSITY SELECTION VIEW
  if (view === 'universities') {
    return (
      <div className="fade-enter fade-enter-active">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
            Study
          </h1>
          <p style={{ color: 'var(--secondary-text-color)', margin: '0.5rem 0 0 0' }}>
            {profile.university ? 'Browse your university courses' : 'Select your university to begin'}
          </p>
        </div>

        {/* GST Courses */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'var(--text-color)', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
            General Studies (GST)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {studentUniGST.map(course => (
              <div
                key={course.id}
                onClick={() => {
                  setSelectedCourse(course);
                  setView('topics');
                }}
                className="login-content card-hover"
                style={{ padding: '1.5rem', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <BookOpen size={20} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>{course.code}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: '600' }}>{course.title}</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--secondary-text-color)', margin: 0, lineHeight: 1.4 }}>
                  {course.description}
                </p>
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                  <span className="tag tag-easy">{course.units} Units</span>
                  <span className="tag" style={{ background: 'rgba(0,117,255,0.1)', color: 'var(--primary)' }}>
                    Semester {course.semester}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Universities */}
        <h3 style={{ color: 'var(--text-color)', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
          {profile.university ? 'Your University' : 'Universities'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
          {availableUniversities.map(uni => (
            <div
              key={uni.id}
              onClick={() => handleSelectUniversity(uni)}
              className="login-content card-hover"
              style={{ padding: '1.5rem', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: 'linear-gradient(135deg, var(--brightLavender), var(--brighterLavender))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', fontSize: '1rem', color: 'var(--night)'
                }}>
                  {uni.shortName}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1rem', fontWeight: '600' }}>{uni.name}</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--secondary-text-color)' }}>
                    {uni.faculties.length} faculties
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {uni.faculties.map(fac => (
                  <span key={fac.id} className="tag" style={{ background: 'rgba(0,117,255,0.1)', color: 'var(--primary)' }}>
                    {fac.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // COURSE SELECTION VIEW
  if (view === 'courses' && selectedUniversity) {
    return (
      <div className="fade-enter fade-enter-active">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={handleBack} className="ghost-button-component" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.5rem', fontWeight: '700' }}>
              {selectedUniversity.name}
            </h1>
            <p style={{ color: 'var(--secondary-text-color)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
              Select a faculty and department
            </p>
          </div>
        </div>

        {selectedUniversity.faculties.map(faculty => (
          <div key={faculty.id} style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'var(--text-color)', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
              {faculty.name}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {faculty.departments.map(dept => (
                <div key={dept.id}>
                  <h4 style={{ color: 'var(--secondary-text-color)', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.75rem' }}>
                    {dept.name}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {dept.courses.map(course => (
                      <div
                        key={course.id}
                        onClick={() => handleSelectCourse(course)}
                        className="login-content card-hover"
                        style={{ padding: '1rem', cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: 'var(--primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <BookOpen size={16} color="white" />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '600' }}>{course.code}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-color)', fontWeight: '500' }}>{course.title}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // TOPIC SELECTION VIEW
  if (view === 'topics' && selectedCourse) {
    return (
      <div className="fade-enter fade-enter-active">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={handleBack} className="ghost-button-component" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>{selectedCourse.code}</div>
            <h1 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.5rem', fontWeight: '700' }}>
              {selectedCourse.title}
            </h1>
            <p style={{ color: 'var(--secondary-text-color)', margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
              {selectedCourse.description}
            </p>
          </div>
        </div>

        {loadingTopics && (
          <div className="login-content" style={{ 
            padding: '4rem', textAlign: 'center', 
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
          }}>
            <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
            <div style={{ color: 'var(--text-color)', fontWeight: '600' }}>Generating topics for {selectedCourse.code}...</div>
            <div style={{ color: 'var(--secondary-text-color)', fontSize: '0.85rem' }}>
              AI is creating a comprehensive topic list for this course
            </div>
          </div>
        )}

        {topicError && (
          <div className="login-content" style={{ 
            padding: '3rem', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
          }}>
            <div style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{topicError}</div>
            <button onClick={() => handleSelectCourse(selectedCourse)} className="base-button-component" style={{ 
              background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem'
            }}>
              Try Again
            </button>
          </div>
        )}

        {!loadingTopics && !topicError && courseTopics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {courseTopics.topics.map((topic, index) => (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic.name)}
                className="login-content card-hover"
                style={{ padding: '1.25rem', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: `hsl(${index * 36}, 70%, 50%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: '700', fontSize: '0.8rem'
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-color)', fontSize: '0.9rem', fontWeight: '600' }}>{topic.name}</h4>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--secondary-text-color)', fontSize: '0.75rem' }}>{topic.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // STUDY MODE SELECTION
  if (view === 'study' && selectedCourse && selectedTopic) {
    return (
      <div className="fade-enter fade-enter-active">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={handleBack} className="ghost-button-component" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>{selectedCourse.code}</div>
            <h1 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.25rem', fontWeight: '700' }}>
              {selectedTopic}
            </h1>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: '1rem' 
        }}>
          {/* Smart Study */}
          <button
            onClick={() => handleStartStudy('smart-study')}
            className="base-button-component"
            style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              flexDirection: 'column',
              textAlign: 'center'
            }}
          >
            <BrainCircuit size={36} style={{ marginBottom: '0.75rem' }} />
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>Smart Study</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.25rem' }}>
              AI-powered adaptive quiz
            </span>
          </button>

          {/* Study Guide */}
          <button
            onClick={() => handleStartStudy('guide')}
            className="base-button-component"
            style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, var(--brightLavender), var(--brighterLavender))',
              color: 'var(--night)',
              border: 'none',
              borderRadius: '20px',
              flexDirection: 'column',
              textAlign: 'center'
            }}
          >
            <MessageSquare size={36} style={{ marginBottom: '0.75rem' }} />
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>AI Study Guide</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.25rem' }}>
              Ask questions & get summaries
            </span>
          </button>

          {/* Focus Timer */}
          <button
            onClick={() => handleStartStudy('timer')}
            className="base-button-component"
            style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, var(--green), var(--greenLight))',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              flexDirection: 'column',
              textAlign: 'center'
            }}
          >
            <Clock size={36} style={{ marginBottom: '0.75rem' }} />
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>Focus Timer</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.25rem' }}>
              Pomodoro study sessions
            </span>
          </button>

          {/* Flashcards */}
          <button
            onClick={() => handleStartStudy('flashcards')}
            className="base-button-component"
            style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, var(--brightBlue), var(--brighterBlue))',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              flexDirection: 'column',
              textAlign: 'center'
            }}
          >
            <Sparkles size={36} style={{ marginBottom: '0.75rem' }} />
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>Flashcards</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.25rem' }}>
              Flip to learn & review
            </span>
          </button>

          {/* Course Material Upload */}
          <button
            onClick={() => setMode('upload')}
            className="base-button-component"
            style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, var(--brightLavender), var(--brighterLavender))',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              flexDirection: 'column',
              textAlign: 'center'
            }}
          >
            <Upload size={36} style={{ marginBottom: '0.75rem' }} />
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>Upload Materials</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.25rem' }}>
              Upload notes & study with AI
            </span>
          </button>

          {/* Stacker Game - Coming Soon */}
          <div
            className="base-button-component"
            style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, var(--gold), var(--lightGold))',
              color: 'var(--night)',
              border: 'none',
              borderRadius: '20px',
              flexDirection: 'column',
              textAlign: 'center',
              opacity: 0.5,
              cursor: 'not-allowed'
            }}
          >
            <Gamepad2 size={36} style={{ marginBottom: '0.75rem' }} />
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>Stacker</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.25rem' }}>
              Coming Soon
            </span>
            <div style={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
              background: 'rgba(0,0,0,0.03)', borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ 
                background: 'var(--night)', color: 'var(--gold)',
                padding: '0.25rem 0.75rem', borderRadius: '12px',
                fontSize: '0.7rem', fontWeight: '700', transform: 'rotate(-5deg)'
              }}>SOON</span>
            </div>
          </div>

          {/* Progress */}
          <div className="login-content" style={{
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <TrendingUp size={36} style={{ marginBottom: '0.75rem', color: 'var(--primary)' }} />
            <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-color)' }}>Progress</span>
            <div style={{ marginTop: '1rem', width: '100%' }}>
              {[
                { label: 'New', count: cardStats.newCount, color: 'var(--secondary-text-color)' },
                { label: 'Learning', count: cardStats.learningCount, color: 'var(--primary)' },
                { label: 'Mastered', count: cardStats.masteredCount, color: 'var(--success)' }
              ].map(({ label, count, color }) => (
                <div key={label} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8rem', color: 'var(--secondary-text-color)' }}>
                    <span>{label}</span>
                    <span>{count}</span>
                  </div>
                  <div className="progress-animated">
                    <div style={{
                      width: `${cardStats.total > 0 ? (count / cardStats.total) * 100 : 0}%`,
                      height: '100%',
                      background: color,
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
