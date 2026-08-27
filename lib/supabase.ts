// lib/supabase.ts dosyanın TAMAMI böyle olmalı:

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // <--- İŞTE BU SATIR HAYAT KURTARIR!
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
})