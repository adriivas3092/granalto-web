"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "@/lib/supabase/config";

/** Cliente de Supabase para componentes de cliente (navegador). */
export function createSupabaseBrowserClient() {
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey);
}
