import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://clpbflxkbaqcimrrbqkw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscGJmbHhrYmFxY2ltcnJicWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NjU0NjcsImV4cCI6MjA5NTA0MTQ2N30.5BY840ZPjgz7l_mf-4qlJIyiGP-EleCjD51nl0lN6_I";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
