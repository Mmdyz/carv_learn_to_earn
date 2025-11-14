// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("SUPABASE KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Loaded ✅" : "Missing ❌");


export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
