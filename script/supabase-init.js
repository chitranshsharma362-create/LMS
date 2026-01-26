const supabaseClient = window.supabase.createClient(
  "https://veeksbpngjfdwhbikxys.supabase.co",
  "sb_publishable_Fd9uiZ_5THN8T3svE6mnDw_0uie3n_q"
  );

if (supabaseClient) {
  console.log("Database connected:", supabaseClient);
} else{
  console.log("Database not connected");
}
