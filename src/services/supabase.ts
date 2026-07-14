import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  university: string;
  faculty: string;
  department: string;
  level: number;
  created_at: string;
  updated_at: string;
}

export async function getOrCreateProfile(userId: string, defaults?: Partial<UserProfile>) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing) return existing;

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      user_id: userId,
      display_name: defaults?.display_name || '',
      email: defaults?.email || '',
      university: defaults?.university || '',
      faculty: defaults?.faculty || '',
      department: defaults?.department || '',
      level: defaults?.level || 100
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}
