// src/lib/supabase.ts
export async function submitToWaitlist(
  email: string,
  source: string
): Promise<{ success: boolean; duplicate?: boolean }> {
  // TODO: implement Supabase integration in Task 13
  console.log("Waitlist submission:", { email, source });
  return { success: true };
}
