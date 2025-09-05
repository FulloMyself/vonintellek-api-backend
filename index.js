// Example: /api/profile endpoint
import "dotenv/config";
import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.use(express.json());

app.get("/api/profile", async (req, res) => {
  const jwt = req.headers.authorization?.replace("Bearer ", "");
  if (!jwt) return res.status(401).json({ error: "Unauthorized" });

  // Validate JWT with Supabase
  const { data: { user }, error } = await supabase.auth.getUser(jwt);
  if (error || !user) return res.status(401).json({ error: "Invalid token" });

  // Fetch purchases
  const { data: purchases } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  res.json({ user, purchases });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});

export default app;