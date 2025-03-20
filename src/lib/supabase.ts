import { createClient } from "@supabase/supabase-js";

// Supabase client setup
const supabaseUrl = "https://apnrlhvjugrgcrxjzdwo.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbnJsaHZqdWdyZ2NyeGp6ZHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NTE4NDAsImV4cCI6MjA1ODAyNzg0MH0.fklwckBPFvQIK4UxDhmZ8J5SY6vOqtO_k3VZG3MfhYU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type LeaderboardEntry = {
  id?: number;
  username: string;
  time: number;
  score: number;
  completedAt: string;
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("score", { ascending: false })
    .order("time", { ascending: true });

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }

  return data || [];
};

export const updateLeaderboard = async (
  entry: LeaderboardEntry
): Promise<boolean> => {
  // First check if the user already has a better score
  const { data: existingEntries } = await supabase
    .from("leaderboard")
    .select("*")
    .eq("username", entry.username);

  const existingEntry = existingEntries && existingEntries[0];

  // Only update if new score is better or if score is the same but time is better
  if (existingEntry) {
    if (
      entry.score > existingEntry.score ||
      (entry.score === existingEntry.score && entry.time < existingEntry.time)
    ) {
      const { error } = await supabase
        .from("leaderboard")
        .update(entry)
        .eq("id", existingEntry.id);

      return !error;
    }
    return true; // No need to update
  }

  // No existing entry, insert new one
  const { error } = await supabase.from("leaderboard").insert(entry);

  return !error;
};
