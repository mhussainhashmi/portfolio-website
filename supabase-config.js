// ============================================================
// supabase-config.js
// This file does ONE job: create the Supabase client.
// Every other JS file in this project loads this file first
// and uses the global `supabaseClient` variable it creates.
// ============================================================

// These two values tell the JS library WHICH Supabase project
// to connect to. The anon key is safe to have here —
// your RLS policies we just created are what actually
// control what anyone can and cannot do with the data.

const SUPABASE_URL = 'https://yihahetrxltdysdaiweu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpaGFoZXRyeGx0ZHlzZGFpd2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzEwNDQsImV4cCI6MjA5MTc0NzA0NH0.GfH1aQqod9ADK487VELffLbjF6mxkrWWC6jyM_lGYn4';

// supabase.createClient() is like dialing a phone number.


// "supabaseClient" (different name) = supabase (the CDN library) .createClient()
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// Make it available globally so admin.html and main.js can use it


console.log("Supabase client initialized successfully");