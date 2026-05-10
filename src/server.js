import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/api/counter", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.counterapi.dev/v2/khurkhams-team-4055/first-counter-4055/stats",
      {
        headers: {
          Authorization: `Bearer ${process.env.COUNTER_API_TOKEN}`,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch counter" });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});