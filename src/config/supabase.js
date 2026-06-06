import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// Sử dụng VITE_SUPABASE_PUBLISHABLE_KEY theo cấu hình .env của bạn
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
