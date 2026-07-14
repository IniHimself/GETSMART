import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Schedule from './pages/Schedule';
import Study from './pages/Study';
import Profile from './pages/Profile';
import Announcements from './pages/Announcements';
import { AppProvider, useAppGlobal } from './context/AppContext';
import { StudyProvider } from './context/StudyContext';

const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'var(--background-color)'
  }}>
    <div className="loader-ring" />
  </div>
);

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isOnboarded, loading: profileLoading } = useAppGlobal();
  
  if (authLoading || profileLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (isOnboarded) return <Navigate to="/home" />;
  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isOnboarded, loading: profileLoading } = useAppGlobal();
  
  if (authLoading || profileLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (!isOnboarded) return <Navigate to="/onboarding" />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/home" />;
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <StudyProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              
              <Route path="/onboarding" element={
                <OnboardingGuard>
                  <Onboarding />
                </OnboardingGuard>
              } />
              
              <Route element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route path="/home" element={<Home />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/study" element={<Study />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/announcements" element={<Announcements />} />
              </Route>
              
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </BrowserRouter>
        </StudyProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
