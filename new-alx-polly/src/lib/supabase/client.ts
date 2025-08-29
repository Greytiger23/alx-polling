// src/lib/supabase/client.ts
// This file will handle Supabase client initialization

// Import the required Supabase libraries
// import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oougcrhzcpnffuibunli.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Placeholder for Supabase client
// (Removed invalid reassignment to 'supabase'. Use the initialized client above.)