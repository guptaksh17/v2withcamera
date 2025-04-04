
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lchiyoyszzkrbzzbnaab.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaGl5b3lzenprcmJ6emJuYWFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NjUwMTIsImV4cCI6MjA1ODI0MTAxMn0.qNDVvdQri3b1VmSim5ee5N-ZEFp53yM7h1nO9qyoOUs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'silent-guardians-auth',
    storage: localStorage
  }
});
