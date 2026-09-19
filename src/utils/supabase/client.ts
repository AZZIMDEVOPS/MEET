import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vhvsacrukusxxpuwxhsx.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_z_WyEoTpKP2MCV7QBYy68w_xMqmO4qx";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
