import { createClient } from '@supabase/supabase-js';

// Use VITE_ prefix for frontend env variables
const supabaseUrl = 'https://epoovvzdvytqaivxiyws.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwb292dnpkdnl0cWFpdnhpeXdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODQyMDMsImV4cCI6MjA2NjE2MDIwM30.6ORc_gLmOh7PUZldliQjGQXUA8YVXO2Qlku22P4nMAQ';

if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [
    !supabaseUrl ? 'VITE_SUPABASE_URL' : null,
    !supabaseAnonKey ? 'VITE_SUPABASE_ANON_KEY' : null
  ].filter(Boolean).join(' and ');
  const envFileHint = `\n\nCheck that your .env file exists at the project root and contains:\nVITE_SUPABASE_URL=your-supabase-url\nVITE_SUPABASE_ANON_KEY=your-supabase-anon-key\n\nAfter editing .env, restart your dev server (npm run dev).`;
  throw new Error(`Missing required environment variable(s): ${missingVars}.${envFileHint}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
