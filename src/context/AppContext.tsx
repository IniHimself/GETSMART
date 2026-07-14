import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getOrCreateProfile, updateProfile } from '../services/supabase';

type Announcement = {
  id: number;
  title: string;
  source: string;
  type: 'system' | 'university';
  university?: string;
  unread: boolean;
};

interface UserProfile {
  name: string;
  email: string;
  university: string;
  faculty: string;
  department: string;
  courseLevel: string;
}

interface AppContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  announcements: Announcement[];
  markAnnouncementRead: (id: number) => void;
  unreadCount: number;
  isOnboarded: boolean;
  setOnboarded: (onboarded: boolean) => void;
  loading: boolean;
}

const GlobalAppContext = createContext<AppContextType | undefined>(undefined);

const PROFILE_STORAGE_KEY = 'getsmart_profile';
const ONBOARDED_STORAGE_KEY = 'getsmart_onboarded';

const EMPTY_PROFILE: UserProfile = {
  name: '',
  email: '',
  university: '',
  faculty: '',
  department: '',
  courseLevel: ''
};

const SYSTEM_ANNOUNCEMENTS: Announcement[] = [
  { id: 1, title: 'Welcome to GetSmart!', source: 'System', type: 'system', unread: true },
  { id: 2, title: 'New AI-powered Smart Study feature launched', source: 'System', type: 'system', unread: true },
  { id: 3, title: 'Platform maintenance scheduled for next week', source: 'System', type: 'system', unread: false }
];

const REDEEMERS_ANNOUNCEMENTS: Announcement[] = [
  { id: 101, title: 'Exam Timetable Released', source: "Redeemer's University Admin", type: 'university', university: 'run', unread: true },
  { id: 102, title: 'New Course Materials Available', source: "Redeemer's University Library", type: 'university', university: 'run', unread: true },
  { id: 103, title: 'Library Hours Extended During Exams', source: "Redeemer's University Library", type: 'university', university: 'run', unread: false },
  { id: 104, title: 'VC Welcome Address Uploaded', source: "Redeemer's University Admin", type: 'university', university: 'run', unread: true },
  { id: 105, title: 'New Research Grants Available', source: "Redeemer's University Research Office", type: 'university', university: 'run', unread: true }
];

const VISION_ANNOUNCEMENTS: Announcement[] = [
  { id: 201, title: 'Exam Timetable Released', source: 'Vision University Admin', type: 'university', university: 'vu', unread: true },
  { id: 202, title: 'New Course Material: Biochemistry', source: 'Vision University Faculty', type: 'university', university: 'vu', unread: true },
  { id: 203, title: 'Library Hours Extended', source: 'Vision University Library', type: 'university', university: 'vu', unread: false },
  { id: 204, title: 'Matriculation Ceremony Date Announced', source: 'Vision University Admin', type: 'university', university: 'vu', unread: true },
  { id: 205, title: 'Sports Week Activities', source: 'Vision University Student Affairs', type: 'university', university: 'vu', unread: false }
];

function getAnnouncementsForUniversity(universityId: string): Announcement[] {
  const uniAnnouncements = universityId === 'run' ? REDEEMERS_ANNOUNCEMENTS : 
                            universityId === 'vu' ? VISION_ANNOUNCEMENTS : [];
  return [...SYSTEM_ANNOUNCEMENTS, ...uniAnnouncements];
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const [profile, setProfileState] = useState<UserProfile>(() => {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserProfile;
        if (parsed.name && parsed.university) return parsed;
      } catch {}
    }
    return { ...EMPTY_PROFILE };
  });

  const [isOnboarded, setOnboarded] = useState<boolean>(() => {
    const stored = localStorage.getItem(ONBOARDED_STORAGE_KEY);
    return stored ? JSON.parse(stored) as boolean : false;
  });

  const [loading, setLoading] = useState(true);

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    return [...SYSTEM_ANNOUNCEMENTS];
  });

  // Load profile from Supabase on login
  useEffect(() => {
    if (user) {
      setLoading(true);
      getOrCreateProfile(user.uid, {
        display_name: user.displayName || '',
        email: user.email || '',
      }).then((data) => {
        if (data) {
          const loadedProfile: UserProfile = {
            name: data.display_name || user.displayName || '',
            email: data.email || user.email || '',
            university: data.university || '',
            faculty: data.faculty || '',
            department: data.department || '',
            courseLevel: data.level ? String(data.level) : ''
          };
          setProfileState(loadedProfile);
          setOnboarded(!!data.university);
          localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(loadedProfile));
          localStorage.setItem(ONBOARDED_STORAGE_KEY, JSON.stringify(!!data.university));
        }
        setLoading(false);
      }).catch((err) => {
        console.error('Supabase load failed, using localStorage:', err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  // Reset profile and onboarding when user logs out
  useEffect(() => {
    if (!user) {
      setProfileState({ ...EMPTY_PROFILE });
      setOnboarded(false);
      setAnnouncements([...SYSTEM_ANNOUNCEMENTS]);
      setLoading(false);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
      localStorage.removeItem(ONBOARDED_STORAGE_KEY);
    }
  }, [user]);

  // Update announcements when university changes
  useEffect(() => {
    if (profile.university) {
      setAnnouncements(getAnnouncementsForUniversity(profile.university));
    }
  }, [profile.university]);

  const setProfile = async (newProfile: UserProfile) => {
    setProfileState(newProfile);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    if (newProfile.university) {
      setAnnouncements(getAnnouncementsForUniversity(newProfile.university));
    }
    // Sync to Supabase
    if (user) {
      try {
        await updateProfile(user.uid, {
          display_name: newProfile.name,
          email: newProfile.email,
          university: newProfile.university,
          faculty: newProfile.faculty,
          department: newProfile.department,
          level: parseInt(newProfile.courseLevel) || 100
        });
      } catch (err) {
        console.error('Failed to sync profile to Supabase:', err);
      }
    }
  };

  const markAnnouncementRead = (id: number) => {
    setAnnouncements(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, unread: false } : a);
      return updated;
    });
  };

  const unreadCount = announcements.filter(a => a.unread).length;

  return (
    <GlobalAppContext.Provider value={{
      profile,
      setProfile,
      announcements,
      markAnnouncementRead,
      unreadCount,
      isOnboarded,
      setOnboarded,
      loading
    }}>
      {children}
    </GlobalAppContext.Provider>
  );
};

export const useAppGlobal = () => {
  const context = useContext(GlobalAppContext);
  if (!context) throw new Error("useAppGlobal must be used within AppProvider");
  return context;
};
