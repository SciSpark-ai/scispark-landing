import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function submitToWaitlist(
  email: string,
  source: "hero" | "footer-cta"
): Promise<{ success: boolean; duplicate?: boolean }> {
  try {
    const { error } = await supabase.from("waitlist").insert({ email, source });
    if (error) {
      if (error.code === "23505") return { success: false, duplicate: true };
      return { success: false };
    }
    return { success: true };
  } catch {
    return { success: false };
  }
}
